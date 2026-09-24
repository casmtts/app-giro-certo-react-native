import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton, TextInput } from "react-native-paper";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginScreen() {
  const { setSession } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha.");
      return;
    }
    if (registering && !name.trim()) {
      setError("Informe seu nome para criar a conta.");
      return;
    }
    if (registering && password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const session = registering
        ? await api.register(name.trim(), email.trim(), password)
        : await api.login(email.trim(), password);
      await setSession(session);
      router.replace("/(tabs)/profile");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível acessar sua conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas px-6" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center">
          <View className="mr-2 h-9 w-9 items-center justify-center rounded-xl bg-ink">
            <MaterialCommunityIcons name="motorbike" size={21} color="#FFFFFF" />
          </View>
          <Text className="text-sm font-jakarta-bold tracking-[1px] text-ink">GIRO CERTO</Text>
        </View>
        <IconButton icon="close" onPress={() => router.back()} accessibilityLabel="Fechar" />
      </View>

      <View className="mt-12">
        <Text className="text-[10px] font-jakarta-bold tracking-[1.6px] text-muted">BEM-VINDO DE VOLTA</Text>
        <Text className="mt-2 text-3xl font-jakarta-bold tracking-tight text-ink">
          {registering ? "Crie sua conta." : "Entre para continuar."}
        </Text>
        <Text className="mt-2 text-base leading-6 text-muted">
          Acompanhe seus favoritos e converse com vendedores.
        </Text>
      </View>

      <View className="mt-8">
        {registering && (
          <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" autoCapitalize="words" />
        )}
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Field
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off-outline" : "eye-outline"}
              onPress={() => setShowPassword((visible) => !visible)}
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            />
          }
        />
        {!registering && (
          <Pressable onPress={() => setError("Para redefinir a senha, fale com o suporte do Giro Certo.")} className="min-h-11 self-end justify-center">
            <Text className="text-sm font-jakarta-semibold text-copper">Esqueci minha senha</Text>
          </Pressable>
        )}
      </View>

      {!!error && (
        <View className="mt-2 rounded-xl border border-[#E4B7B2] bg-[#FFF2F0] px-4 py-3">
          <Text className="text-sm leading-5 text-[#8E2720]">{error}</Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={() => void submit()}
        loading={loading}
        disabled={loading}
        contentStyle={{ minHeight: 52 }}
        style={{ marginTop: 18, borderRadius: 14 }}
      >
        {registering ? "Criar conta" : "Entrar"}
      </Button>

      <View className="my-6 flex-row items-center">
        <View className="h-px flex-1 bg-line" />
        <Text className="mx-4 text-xs text-muted">ou</Text>
        <View className="h-px flex-1 bg-line" />
      </View>

      <Button
        mode="outlined"
        onPress={() => {
          setRegistering((current) => !current);
          setError("");
        }}
        contentStyle={{ minHeight: 50 }}
        style={{ borderRadius: 14, borderColor: "#DFE3E0" }}
        textColor="#202626"
      >
        {registering ? "Já tenho uma conta" : "Criar uma conta"}
      </Button>

      <View className="mt-auto pb-3 pt-8">
        <Text className="text-center text-xs leading-5 text-muted">
          Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-jakarta-semibold text-ink">{label}</Text>
      <TextInput
        mode="outlined"
        {...inputProps}
        outlineColor="#DFE3E0"
        activeOutlineColor="#A84F26"
        style={{ backgroundColor: "#FFFFFF" }}
        contentStyle={{ minHeight: 48 }}
      />
    </View>
  );
}
