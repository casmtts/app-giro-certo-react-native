package br.com.girocerto.api.auth;

public record AuthResponse(String token, String tokenType, UserResponse user) {
    public static AuthResponse from(String token, AppUser user) {
        return new AuthResponse(token, "Bearer", UserResponse.from(user));
    }
}
