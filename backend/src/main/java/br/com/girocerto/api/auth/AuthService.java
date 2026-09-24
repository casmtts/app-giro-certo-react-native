package br.com.girocerto.api.auth;

import br.com.girocerto.api.common.ConflictException;
import br.com.girocerto.api.common.BadRequestException;
import br.com.girocerto.api.common.UnauthorizedException;
import br.com.girocerto.api.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            throw new ConflictException("Este e-mail já possui uma conta.");
        }
        AppUser user = users.save(new AppUser(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password())
        ));
        return AuthResponse.from(jwtService.issue(user.getId()), user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new UnauthorizedException("E-mail ou senha inválidos."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("E-mail ou senha inválidos.");
        }
        return AuthResponse.from(jwtService.issue(user.getId()), user);
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser(Long userId) {
        return users.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new UnauthorizedException("Sua sessão não está mais disponível."));
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        AppUser user = users.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Sua sessão não está mais disponível."));
        String email = normalizeEmail(request.email());
        boolean emailChanged = !email.equalsIgnoreCase(user.getEmail());
        if (users.findByEmailIgnoreCaseAndIdNot(email, userId).isPresent()) {
            throw new ConflictException("Este e-mail já pertence a outra conta.");
        }

        String newPasswordHash = null;
        boolean changingPassword = request.newPassword() != null;
        if (changingPassword && request.newPassword().isBlank()) {
            throw new BadRequestException("A nova senha não pode ficar em branco.");
        }
        if (emailChanged || changingPassword) {
            if (request.currentPassword() == null || request.currentPassword().isBlank()) {
                throw new BadRequestException("Informe sua senha atual para alterar o e-mail ou a senha.");
            }
            if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
                throw new UnauthorizedException("A senha atual está incorreta.");
            }
        }
        if (changingPassword) {
            newPasswordHash = passwordEncoder.encode(request.newPassword());
        }

        user.updateProfile(request.name().trim(), email, newPasswordHash);
        return UserResponse.from(users.save(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
