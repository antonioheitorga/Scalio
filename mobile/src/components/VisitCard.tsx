import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Visit } from '../types';
import { colors } from '../theme';
import { formatCurrency, formatDate, formatQuantity } from '../utils/format';
import { StatusPill } from './StatusPill';

type VisitCardProps = {
  visit: Visit;
  onPress?: () => void;
};

export function VisitCard({ visit, onPress }: VisitCardProps) {
  const CardComponent = onPress ? Pressable : View;
  const isProblem = visit.type === 'Problema';
  const isResolved = isProblem && visit.problemResolved === true;
  const isActiveProblem = isProblem && !visit.problemResolved;

  return (
    <CardComponent style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text style={styles.type}>{visit.type}</Text>
          <Text style={styles.date}>{formatDate(visit.date)}</Text>
        </View>
        <View style={styles.pillStack}>
          {isProblem ? (
            <StatusPill
              label={isResolved ? 'Resolvido' : 'Ativo'}
              tone={isResolved ? 'ok' : 'alert'}
            />
          ) : null}
          <StatusPill
            label={visit.syncStatus === 'pending' ? 'Pendente' : 'Sincronizado'}
            tone={visit.syncStatus === 'pending' ? 'warn' : 'ok'}
          />
        </View>
      </View>

      <Text style={styles.detail}>Cultura: {visit.culture}</Text>
      <Text style={styles.detail}>Quantidade: {formatQuantity(visit.quantity)}</Text>
      <Text style={styles.detail}>Valor: {formatCurrency(visit.value)}</Text>
      <Text style={styles.notes}>{visit.notes}</Text>

      {visit.problemDescription ? (
        <Text style={isActiveProblem ? styles.problem : styles.problemResolved}>
          Problema: {visit.problemDescription}
        </Text>
      ) : null}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  pillStack: {
    alignItems: 'flex-end',
    gap: 6,
  },
  type: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  detail: {
    fontSize: 13,
    color: colors.text,
  },
  notes: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 18,
  },
  problem: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.red,
  },
  problemResolved: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
});
