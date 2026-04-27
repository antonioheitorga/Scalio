import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Layout } from '../components/Layout';
import { StatusPill } from '../components/StatusPill';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import { formatCurrency, formatDate, formatQuantity } from '../utils/format';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

export function VisitDetailScreen({ navigation, route }: Props) {
  const { visitId } = route.params;
  const { getVisitById } = useAppContext();
  const visit = getVisitById(visitId);

  if (!visit) {
    return (
      <Layout>
        <Text style={styles.missingText}>Registro nao encontrado.</Text>
      </Layout>
    );
  }

  const isProblem = visit.type === 'Problema';
  const isResolved = isProblem && visit.problemResolved === true;
  const isActiveProblem = isProblem && !visit.problemResolved;

  return (
    <Layout>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.title}>{visit.type}</Text>
            <Text style={styles.date}>{formatDate(visit.date)}</Text>
          </View>
          {isProblem ? (
            <StatusPill
              label={isResolved ? 'Resolvido' : 'Ativo'}
              tone={isResolved ? 'ok' : 'alert'}
            />
          ) : null}
        </View>

        <Text style={styles.row}>Cultura: {visit.culture}</Text>
        <Text style={styles.row}>Quantidade: {formatQuantity(visit.quantity)}</Text>
        <Text style={styles.row}>Valor: {formatCurrency(visit.value)}</Text>
        <Text style={styles.row}>Status de sync: {visit.syncStatus}</Text>

        {visit.problemDescription ? (
          <Text style={styles.problem}>Problema: {visit.problemDescription}</Text>
        ) : null}

        {isResolved ? (
          <View style={styles.resolutionBlock}>
            <Text style={styles.resolutionLabel}>Resolvido</Text>
            {visit.problemResolvedAt ? (
              <Text style={styles.resolutionDate}>em {formatDate(visit.problemResolvedAt)}</Text>
            ) : null}
            {visit.problemResolutionNotes ? (
              <Text style={styles.resolutionNotes}>{visit.problemResolutionNotes}</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={styles.notes}>{visit.notes}</Text>
      </View>

      {isActiveProblem ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ResolveProblem', { visitId: visit.id })}
        >
          <Text style={styles.primaryButtonLabel}>Marcar como resolvido</Text>
        </Pressable>
      ) : null}
    </Layout>
  );
}

const styles = StyleSheet.create({
  backLabel: {
    color: colors.green,
    fontWeight: '700',
  },
  card: {
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  date: {
    color: colors.gray,
    marginTop: 4,
  },
  row: {
    color: colors.text,
    fontSize: 14,
  },
  problem: {
    color: colors.red,
    fontWeight: '700',
  },
  resolutionBlock: {
    marginTop: 4,
    backgroundColor: '#dcefd8',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  resolutionLabel: {
    color: '#275a20',
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  resolutionDate: {
    color: '#275a20',
    fontSize: 13,
  },
  resolutionNotes: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  notes: {
    marginTop: 6,
    color: colors.gray,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 16,
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
  missingText: {
    color: colors.text,
    fontSize: 16,
  },
});
