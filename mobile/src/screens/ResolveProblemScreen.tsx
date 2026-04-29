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
import { formatDate } from '../utils/format';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResolveProblem'>;

export function ResolveProblemScreen({ navigation, route }: Props) {
  const { visitId } = route.params;
  const { getVisitById, resolveProblem } = useAppContext();
  const visit = getVisitById(visitId);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!visit) {
    return (
      <Layout>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
        <Text style={styles.missingText}>Registro nao encontrado.</Text>
      </Layout>
    );
  }

  if (visit.type !== 'Problema') {
    return (
      <Layout>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
        <Text style={styles.missingText}>
          Este registro nao e um problema. Apenas problemas podem ser marcados como resolvidos.
        </Text>
      </Layout>
    );
  }

  if (visit.problemResolved) {
    return (
      <Layout>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
        <Text style={styles.missingText}>Este problema ja foi marcado como resolvido.</Text>
      </Layout>
    );
  }

  function handleConfirm() {
    if (submitting) return;
    setSubmitting(true);

    const ok = resolveProblem(visitId, notes);

    if (!ok) {
      setSubmitting(false);
      Alert.alert('Erro', 'Nao foi possivel marcar o problema como resolvido.');
      return;
    }

    navigation.goBack();
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Marcar problema como resolvido</Text>
        <Text style={styles.subtitle}>
          O registro permanece no historico, mas deixa de aparecer nos alertas.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Registrado em</Text>
          <Text style={styles.summaryValue}>{formatDate(visit.date)}</Text>
          {visit.problemDescription ? (
            <>
              <Text style={[styles.summaryLabel, styles.summaryLabelSpacing]}>Problema</Text>
              <Text style={styles.summaryText}>{visit.problemDescription}</Text>
            </>
          ) : null}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Como foi resolvido (opcional)</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Ex: Aplicacao de calda bordalesa apos 5 dias"
            placeholderTextColor="#8f988b"
          />

          <Pressable
            style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
            onPress={handleConfirm}
            disabled={submitting}
          >
            <Text style={styles.primaryButtonLabel}>
              {submitting ? 'Salvando...' : 'Confirmar resolucao'}
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
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryLabelSpacing: {
    marginTop: 10,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text,
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
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
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
  missingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 12,
  },
});
