import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type HeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function Header({ title, subtitle, actionLabel, onActionPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    marginHorizontal: -20,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionLabel: {
    color: colors.white,
    fontWeight: '600',
  },
});
