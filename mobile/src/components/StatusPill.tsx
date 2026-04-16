import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type StatusTone = 'ok' | 'warn' | 'alert';

type StatusPillProps = {
  label: string;
  tone: StatusTone;
};

const toneStyles = {
  ok: {
    backgroundColor: '#dcefd8',
    color: '#275a20',
  },
  warn: {
    backgroundColor: '#f8e6d4',
    color: '#8b531f',
  },
  alert: {
    backgroundColor: '#f6d8d5',
    color: '#8f332a',
  },
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: toneStyles[tone].backgroundColor }]}>
      <Text style={[styles.label, { color: toneStyles[tone].color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
