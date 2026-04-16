import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FamilyListItem } from '../components/FamilyListItem';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyList'>;

export function FamilyListScreen({ navigation }: Props) {
  const { currentUser, getDashboardStats, getFamiliesForCurrentUser, logout } = useAppContext();
  const syncConnected = useSyncStatus();
  const stats = getDashboardStats();
  const families = getFamiliesForCurrentUser();

  return (
    <Layout scroll>
      <Header
        title={`Ola, ${currentUser?.name ?? ''}`}
        subtitle={
          syncConnected
            ? 'Conexao detectada. O app pode sincronizar quando houver dados pendentes.'
            : 'Modo offline pronto para uso em campo.'
        }
        actionLabel="Sair"
        onActionPress={logout}
      />

      <View style={styles.statRow}>
        <StatCard label="Familias" value={stats.totalFamilies} />
        <StatCard label="Registros no mes" value={stats.monthlyVisits} />
      </View>

      <View style={styles.statRow}>
        <StatCard label="Sem visita 15+ dias" value={stats.staleFamilies} />
        <StatCard label="Problemas ativos" value={stats.activeProblems} />
      </View>

      <View style={styles.sectionHeader}>
        <SectionTitle>Familias acompanhadas</SectionTitle>
        <Pressable onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.link}>Ver painel</Text>
        </Pressable>
      </View>

      {families.map((family) => (
        <FamilyListItem
          key={family.id}
          family={family}
          onPress={() => navigation.navigate('FamilyProfile', { familyId: family.id })}
        />
      ))}

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('AddFamily')}>
        <Text style={styles.addButtonLabel}>+ Adicionar nova familia</Text>
      </Pressable>
    </Layout>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: colors.green,
    fontWeight: '700',
  },
  addButton: {
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
