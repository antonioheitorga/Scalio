import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import { Layout } from '../components/Layout';

export function LoginScreen() {
  const { state, login } = useAppContext();
  const [pin, setPin] = useState('');

  function handleLogin() {
    const success = login(pin);

    if (!success) {
      Alert.alert('Acesso nao encontrado', 'Use um dos PINs seed: 1234 ou 5678.');
      return;
    }

    setPin('');
  }

  return (
    <Layout>
      <View style={styles.hero}>
        <Text style={styles.logo}>SCALIO</Text>
        <Text style={styles.tagline}>
          Registro de visitas de campo com funcionamento offline para os agentes da Vila Jutaiteua.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entrar no aplicativo</Text>
        <Text style={styles.cardSubtitle}>Use o PIN do agente para continuar.</Text>

        <TextInput
          style={styles.input}
          placeholder="PIN de 4 digitos"
          placeholderTextColor="#8f988b"
          value={pin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
          onChangeText={setPin}
        />

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonLabel}>Entrar</Text>
        </Pressable>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Acessos de teste</Text>
          {state.agents.map((user) => (
            <Text key={user.id} style={styles.demoItem}>
              {user.name} · PIN {user.pin}
            </Text>
          ))}
          <Text style={styles.recovery}>
            Recuperacao MVP: reset manual pelo time fora do app.
          </Text>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 30,
    gap: 10,
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.green,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.gray,
  },
  card: {
    marginTop: 28,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  demoBox: {
    marginTop: 8,
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  demoItem: {
    fontSize: 13,
    color: colors.text,
  },
  recovery: {
    marginTop: 8,
    fontSize: 12,
    color: colors.gray,
  },
});
