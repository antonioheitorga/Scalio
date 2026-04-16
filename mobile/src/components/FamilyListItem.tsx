import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FamilySummary } from '../types';
import { colors } from '../theme';
import { formatDate } from '../utils/format';
import { StatusPill } from './StatusPill';

type FamilyListItemProps = {
  family: FamilySummary;
  onPress: () => void;
};

export function FamilyListItem({ family, onPress }: FamilyListItemProps) {
  const status = family.hasActiveProblem
    ? { label: 'Atencao', tone: 'alert' as const }
    : family.needsAttention
      ? { label: 'Visita pendente', tone: 'warn' as const }
      : { label: 'Em dia', tone: 'ok' as const };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{family.name.slice(0, 1).toUpperCase()}</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{family.name}</Text>
          <Text style={styles.subtitle}>
            {family.cultures.join(', ')} · Ultima visita:{' '}
            {family.lastVisit ? formatDate(family.lastVisit.date) : 'nenhuma'}
          </Text>
        </View>
      </View>

      <StatusPill label={status.label} tone={status.tone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.green,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray,
  },
});
