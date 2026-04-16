import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';

export function DashboardScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const { getDashboardStats, syncPendingData } = useAppContext();
  const stats = getDashboardStats();
  const isConnected = useSyncStatus();

  return (
    <Layout>
      <Header
        title="Painel SCALIO"
        subtitle="Resumo rapido das atividades acompanhadas pelo agronomo."
      />

      <View style={styles.grid}>
        <StatCard label="Familias" value={stats.totalFamilies} />
        <StatCard label="Registros no mes" value={stats.monthlyVisits} />
      </View>

      <View style={styles.grid}>
        <StatCard label="Sem visita 15+ dias" value={stats.staleFamilies} />
        <StatCard label="Problemas ativos" value={stats.activeProblems} />
      </View>

      <View style={styles.card}>
        <SectionTitle>Sincronizacao</SectionTitle>
        <Text style={styles.bodyText}>
          {isConnected
            ? 'Internet disponivel. Toque abaixo para simular a sincronizacao dos registros pendentes.'
            : 'Sem internet. Os dados continuam seguros no aparelho ate a proxima conexao.'}
        </Text>

        <Pressable
          style={[styles.syncButton, !isConnected && styles.syncButtonDisabled]}
          onPress={syncPendingData}
          disabled={!isConnected}
        >
          <Text style={styles.syncButtonLabel}>Sincronizar agora</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonLabel}>Voltar para familias</Text>
      </Pressable>
    </Layout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  card: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  bodyText: {
    color: colors.gray,
    lineHeight: 20,
  },
  syncButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#b7c2b1',
  },
  syncButtonLabel: {
    color: colors.white,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  backButtonLabel: {
    color: colors.green,
    fontWeight: '700',
  },
});
