import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileScreen() {
  const { user, ready, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const emailChanged = !!user && email.trim().toLowerCase() !== user.email.toLowerCase();
  const requiresCurrentPassword = emailChanged || changingPassword;

  const handleSignOut = () => {
    Alert.alert("Sair da conta?", "Seus anúncios salvos neste aparelho continuam disponíveis.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => { void signOut(); } }
    ]);
  };

  const startEditing = () => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setError("");
    setNotice("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setError("");
  };

  const saveProfile = async () => {
    if (!user) return;
    const nextName = name.trim();
    const nextEmail = email.trim();

    if (!nextName || !nextEmail) {
      setError("Informe seu nome e seu e-mail.");
      return;
    }
    if (!EMAIL_PATTERN.test(nextEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (requiresCurrentPassword && !currentPassword) {
      setError("Informe sua senha atual para confirmar essa alteração.");
      return;
    }
    if (changingPassword && newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (changingPassword && newPassword.length > 72) {
      setError("A nova senha deve ter no máximo 72 caracteres.");
      return;
    }
    if (changingPassword && newPassword !== confirmPassword) {
      setError("A confirmação da nova senha não confere.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateProfile({
        name: nextName,
        email: nextEmail,
        ...(requiresCurrentPassword ? { currentPassword } : {}),
        ...(changingPassword ? { newPassword } : {})
      });
      setEditing(false);
      setChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
      setNotice("Seus dados foram atualizados.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível atualizar seus dados.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View className="px-5 pt-6">
        <Text className="text-2xl font-jakarta-bold tracking-tight text-ink">Perfil</Text>
        {!ready ? (
          <View className="mt-8 items-center">
            <Text className="text-sm text-muted">Carregando sua conta…</Text>
          </View>
        ) : user ? (
          <View className="mt-6 overflow-hidden rounded-[18px] border border-line bg-white">
            <View className="flex-row items-center p-5">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-copper-wash">
                <MaterialCommunityIcons name="account-outline" size={25} color="#A84F26" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-jakarta-semibold text-ink">{user.name}</Text>
                <Text className="mt-1 text-sm text-muted">{user.email}</Text>
              </View>
            </View>
            <Divider />

            {editing ? (
              <View className="p-4">
                <AccountInput
                  label="Nome completo"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  maxLength={100}
                />
                <AccountInput
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  maxLength={180}
                />

                {requiresCurrentPassword && (
                  <AccountInput
                    label="Senha atual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    secureTextEntry={!showPasswords}
                    right={<TextInput.Icon
                      icon={showPasswords ? "eye-off-outline" : "eye-outline"}
                      onPress={() => setShowPasswords((visible) => !visible)}
                      accessibilityLabel={showPasswords ? "Ocultar senha" : "Mostrar senha"}
                    />}
                  />
                )}

                <Button
                  mode="outlined"
                  icon={changingPassword ? "lock-check-outline" : "lock-reset"}
                  onPress={() => {
                    setChangingPassword((changing) => !changing);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  contentStyle={{ minHeight: 44 }}
                  style={{ marginBottom: 14, borderRadius: 14, borderColor: "#DFE3E0" }}
                  textColor="#202626"
                >
                  {changingPassword ? "Manter senha atual" : "Alterar senha"}
                </Button>

                {changingPassword && (
                  <>
                    <AccountInput
                      label="Nova senha"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      secureTextEntry={!showPasswords}
                      maxLength={72}
                      right={<TextInput.Icon
                        icon={showPasswords ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPasswords((visible) => !visible)}
                        accessibilityLabel={showPasswords ? "Ocultar senha" : "Mostrar senha"}
                      />}
                    />
                    <AccountInput
                      label="Confirme a nova senha"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      secureTextEntry={!showPasswords}
                      maxLength={72}
                    />
                  </>
                )}

                {!!error && <FormMessage message={error} />}
                <Button
                  mode="contained"
                  onPress={() => void saveProfile()}
                  loading={saving}
                  disabled={saving}
                  contentStyle={{ minHeight: 48 }}
                  style={{ borderRadius: 14 }}
                >
                  Salvar alterações
                </Button>
                <Button
                  mode="text"
                  onPress={cancelEditing}
                  disabled={saving}
                  contentStyle={{ minHeight: 44 }}
                  textColor="#687170"
                >
                  Cancelar
                </Button>
              </View>
            ) : (
              <View className="gap-2 p-4">
                {!!notice && <Text className="mb-1 text-sm text-[#28734A]">{notice}</Text>}
                <Button
                  mode="outlined"
                  icon="account-edit-outline"
                  onPress={startEditing}
                  contentStyle={{ minHeight: 48 }}
                  style={{ borderRadius: 14, borderColor: "#DFE3E0" }}
                  textColor="#202626"
                >
                  Editar dados
                </Button>
                <Button
                  mode="text"
                  textColor="#A84F26"
                  icon="logout"
                  onPress={handleSignOut}
                  contentStyle={{ minHeight: 44 }}
                >
                  Sair da conta
                </Button>
              </View>
            )}
          </View>
        ) : (
          <View className="mt-6 rounded-[18px] border border-line bg-white p-5">
            <Text className="text-lg font-jakarta-semibold text-ink">Entre no Giro Certo</Text>
            <Text className="mt-2 text-sm leading-6 text-muted">
              Acesse sua conta para sincronizar favoritos e publicar anúncios.
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/login")}
              contentStyle={{ minHeight: 48 }}
              style={{ marginTop: 18, borderRadius: 14 }}
            >
              Entrar ou criar conta
            </Button>
          </View>
        )}
      </View>
    </Screen>
  );
}

function AccountInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      mode="outlined"
      outlineColor="#DFE3E0"
      activeOutlineColor="#A84F26"
      style={[{ marginBottom: 12, backgroundColor: "#FFFFFF" }, props.style]}
    />
  );
}

function FormMessage({ message }: { message: string }) {
  return (
    <View className="mb-4 rounded-xl border border-[#E4B7B2] bg-[#FFF2F0] px-4 py-3">
      <Text className="text-sm leading-5 text-[#8E2720]">{message}</Text>
    </View>
  );
}
