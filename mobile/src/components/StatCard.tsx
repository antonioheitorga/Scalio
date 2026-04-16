import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.green,
  },
  label: {
    fontSize: 12,
    color: colors.gray,
  },
});
