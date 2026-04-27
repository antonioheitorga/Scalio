import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FamilyListItem } from '../components/FamilyListItem';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';
import { normalizeText } from '../utils/text';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyList'>;

export function FamilyListScreen({ navigation }: Props) {
  const { currentUser, getDashboardStats, getFamiliesForCurrentUser, logout } = useAppContext();
  const syncConnected = useSyncStatus();
  const stats = getDashboardStats();
  const families = getFamiliesForCurrentUser();
  const [query, setQuery] = useState('');

  const filteredFamilies = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return families;
    return families.filter((family) => normalizeText(family.name).includes(normalizedQuery));
  }, [families, query]);

  const hasFamilies = families.length > 0;
  const hasResults = filteredFamilies.length > 0;
  const isSearching = query.trim().length > 0;

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

      {hasFamilies ? (
        <View style={styles.searchWrap}>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar familia por nome"
          />
        </View>
      ) : null}

      {hasResults ? (
        filteredFamilies.map((family) => (
          <FamilyListItem
            key={family.id}
            family={family}
            onPress={() => navigation.navigate('FamilyProfile', { familyId: family.id })}
          />
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {isSearching
              ? 'Nenhuma familia encontrada para essa busca.'
              : 'Nenhuma familia cadastrada ainda.'}
          </Text>
        </View>
      )}

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
  searchWrap: {
    marginBottom: 12,
  },
  link: {
    color: colors.green,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.gray,
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
