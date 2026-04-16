import { StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.4,
  },
});
