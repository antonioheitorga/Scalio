import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamiliarHome'>;

export function FamiliarHomeScreen({}: Props) {
  const { currentUser, getFamilyById, logout } = useAppContext();

  if (!currentUser) return null;

  const family = currentUser.familyId ? getFamilyById(currentUser.familyId) : undefined;

  return (
    <Layout>
      <Header title={`Ola, ${currentUser.name}`} subtitle="Sua familia no SCALIO" />

      <View style={styles.body}>
        {family ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{family.name}</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Culturas</Text>
              <Text style={styles.rowValue}>{family.cultures.join(', ')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Area</Text>
              <Text style={styles.rowValue}>{family.areaHectares.toFixed(1)} ha</Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sem familia vinculada</Text>
            <Text style={styles.emptyText}>
              Peca ao agente responsavel para vincular sua familia ao seu cadastro.
            </Text>
          </View>
        )}

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutLabel}>Sair</Text>
        </Pressable>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutLabel: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
});
