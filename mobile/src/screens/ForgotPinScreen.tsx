import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Layout } from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPin'>;

export function ForgotPinScreen({ navigation }: Props) {
  const { state, resetPinWithRecoveryCode } = useAppContext();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (submitting) return;

    if (!selectedAgentId) {
      Alert.alert('Selecione um agente', 'Toque no nome do agente que esqueceu o PIN.');
      return;
    }

    if (!/^\d{4}$/.test(newPin.trim())) {
      Alert.alert('PIN invalido', 'O novo PIN deve ter exatamente 4 digitos.');
      return;
    }

    setSubmitting(true);
    const ok = resetPinWithRecoveryCode(selectedAgentId, code, newPin);
    setSubmitting(false);

    if (!ok) {
      Alert.alert(
        'Codigo incorreto',
        'Verifique o codigo de recuperacao informado e tente novamente.',
      );
      return;
    }

    Alert.alert('PIN redefinido', 'Use o novo PIN para entrar.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Esqueci meu PIN</Text>
        <Text style={styles.subtitle}>
          Use o codigo de recuperacao gerado no seu cadastro para definir um novo PIN.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Quem esta redefinindo?</Text>
          <View style={styles.agentList}>
            {state.agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <Pressable
                  key={agent.id}
                  style={[styles.agentChip, isSelected && styles.agentChipActive]}
                  onPress={() => setSelectedAgentId(agent.id)}
                >
                  <Text
                    style={[styles.agentChipText, isSelected && styles.agentChipTextActive]}
                  >
                    {agent.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Codigo de recuperacao</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Ex: JOANA-7421"
            placeholderTextColor="#8f988b"
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Text style={styles.label}>Novo PIN (4 digitos)</Text>
          <TextInput
            style={styles.input}
            value={newPin}
            onChangeText={setNewPin}
            placeholder="0000"
            placeholderTextColor="#8f988b"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
          />

          <Pressable
            style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.primaryButtonLabel}>
              {submitting ? 'Salvando...' : 'Redefinir PIN'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 24,
  },
  backLabel: {
    color: colors.green,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
  },
  agentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  agentChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  agentChipActive: {
    backgroundColor: colors.greenLight,
    borderColor: colors.green,
  },
  agentChipText: {
    color: colors.gray,
    fontWeight: '600',
  },
  agentChipTextActive: {
    color: colors.green,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
