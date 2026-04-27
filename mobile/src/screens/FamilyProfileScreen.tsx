import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Layout } from '../components/Layout';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { VisitCard } from '../components/VisitCard';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import { formatDate } from '../utils/format';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyProfile'>;

export function FamilyProfileScreen({ navigation, route }: Props) {
  const { familyId } = route.params;
  const { getFamilyById, getVisitsForFamily } = useAppContext();

  const family = getFamilyById(familyId);
  const visits = getVisitsForFamily(familyId);

  const activeProblems = useMemo(
    () => visits.filter((v) => v.type === 'Problema' && !v.problemResolved),
    [visits],
  );

  if (!family) {
    return (
      <Layout>
        <Text style={styles.missingText}>Familia nao encontrada.</Text>
      </Layout>
    );
  }

  const recentVisits = visits.slice(0, 3);

  return (
    <Layout scroll>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>{family.name}</Text>
      <Text style={styles.subtitle}>
        {family.cultures.join(', ')} · {family.areaHectares} ha
      </Text>

      <View style={styles.statsRow}>
        <StatCard label="Visitas" value={visits.length} />
        <StatCard label="Culturas" value={family.cultures.length} />
        <StatCard label="Area" value={`${family.areaHectares} ha`} />
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.primaryAction} onPress={() => navigation.navigate('VisitForm', { familyId })}>
          <Text style={styles.primaryActionLabel}>+ Registrar visita</Text>
        </Pressable>
      </View>

      {activeProblems.length > 0 ? (
        <>
          <SectionTitle>Problemas ativos</SectionTitle>
          {activeProblems.map((problem) => (
            <View key={problem.id} style={styles.problemCard}>
              <Text style={styles.problemDate}>{formatDate(problem.date)}</Text>
              {problem.problemDescription ? (
                <Text style={styles.problemText}>{problem.problemDescription}</Text>
              ) : (
                <Text style={styles.problemTextMuted}>Sem descricao registrada</Text>
              )}
              <Pressable
                style={styles.resolveButton}
                onPress={() => navigation.navigate('ResolveProblem', { visitId: problem.id })}
              >
                <Text style={styles.resolveButtonLabel}>Marcar como resolvido</Text>
              </Pressable>
            </View>
          ))}
        </>
      ) : null}

      <SectionTitle>Ultimos registros</SectionTitle>
      {recentVisits.length > 0 ? (
        recentVisits.map((visit) => (
          <VisitCard
            key={visit.id}
            visit={visit}
            onPress={() => navigation.navigate('VisitDetail', { visitId: visit.id })}
          />
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nenhum registro ainda para esta familia.</Text>
        </View>
      )}

      <SectionTitle>Historico completo</SectionTitle>
      {visits.map((visit) => (
        <VisitCard
          key={`history-${visit.id}`}
          visit={visit}
          onPress={() => navigation.navigate('VisitDetail', { visitId: visit.id })}
        />
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  backLabel: {
    color: colors.green,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  actionsRow: {
    marginBottom: 24,
  },
  primaryAction: {
    backgroundColor: colors.green,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryActionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  problemCard: {
    backgroundColor: '#fbeae6',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1c4bc',
    gap: 8,
  },
  problemDate: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.red,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  problemText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  problemTextMuted: {
    fontSize: 14,
    color: colors.gray,
    fontStyle: 'italic',
  },
  resolveButton: {
    marginTop: 6,
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resolveButtonLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  emptyText: {
    color: colors.gray,
  },
  missingText: {
    color: colors.text,
    fontSize: 16,
  },
});
