import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Layout } from '../components/Layout';
import { StatusPill } from '../components/StatusPill';
import { isVisitWithinEditWindow, useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import { formatCurrency, formatDate, formatQuantity } from '../utils/format';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

export function VisitDetailScreen({ navigation, route }: Props) {
  const { visitId } = route.params;
  const { getVisitById, deleteVisit } = useAppContext();
  const visit = getVisitById(visitId);

  if (!visit) {
    return (
      <Layout>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
        <Text style={styles.missingText}>Registro nao encontrado.</Text>
      </Layout>
    );
  }

  if (visit.deletedAt) {
    return (
      <Layout>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.title}>Registro removido</Text>
          <Text style={styles.notes}>
            Esta visita foi excluida em {formatDate(visit.deletedAt)}.
          </Text>
        </View>
      </Layout>
    );
  }

  const isProblem = visit.type === 'Problema';
  const isResolved = isProblem && visit.problemResolved === true;
  const isActiveProblem = isProblem && !visit.problemResolved;
  const editable = isVisitWithinEditWindow(visit);

  function handleDelete() {
    Alert.alert(
      'Excluir registro',
      'O registro deixa de aparecer no historico, mas permanece registrado no sistema. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const ok = deleteVisit(visit!.id);
            if (!ok) {
              Alert.alert(
                'Nao foi possivel excluir',
                'A visita pode ja ter sido removida ou tem mais de 30 dias.',
              );
              return;
            }
            navigation.goBack();
          },
        },
      ],
    );
  }

  return (
    <Layout>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.title}>{visit.type}</Text>
            <Text style={styles.date}>{formatDate(visit.date)}</Text>
            {visit.updatedAt ? (
              <Text style={styles.updatedAt}>
                Editado em {formatDate(visit.updatedAt)}
              </Text>
            ) : null}
          </View>
          {isProblem ? (
            <StatusPill
              label={isResolved ? 'Resolvido' : 'Ativo'}
              tone={isResolved ? 'ok' : 'alert'}
            />
          ) : null}
        </View>

        <Text style={styles.row}>Cultura: {visit.culture}</Text>
        <Text style={styles.row}>Quantidade: {formatQuantity(visit.quantity)}</Text>
        <Text style={styles.row}>Valor: {formatCurrency(visit.value)}</Text>
        <Text style={styles.row}>Status de sync: {visit.syncStatus}</Text>

        {visit.problemDescription ? (
          <Text style={styles.problem}>Problema: {visit.problemDescription}</Text>
        ) : null}

        {isResolved ? (
          <View style={styles.resolutionBlock}>
            <Text style={styles.resolutionLabel}>Resolvido</Text>
            {visit.problemResolvedAt ? (
              <Text style={styles.resolutionDate}>em {formatDate(visit.problemResolvedAt)}</Text>
            ) : null}
            {visit.problemResolutionNotes ? (
              <Text style={styles.resolutionNotes}>{visit.problemResolutionNotes}</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={styles.notes}>{visit.notes}</Text>
      </View>

      {isActiveProblem ? (
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ResolveProblem', { visitId: visit.id })}
        >
          <Text style={styles.primaryButtonLabel}>Marcar como resolvido</Text>
        </Pressable>
      ) : null}

      {editable ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              navigation.navigate('VisitForm', {
                familyId: visit.familyId,
                visitId: visit.id,
              })
            }
          >
            <Text style={styles.secondaryButtonLabel}>Editar</Text>
          </Pressable>

          <Pressable style={styles.dangerButton} onPress={handleDelete}>
            <Text style={styles.dangerButtonLabel}>Excluir</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.lockedText}>
          Edicao bloqueada — registros com mais de 30 dias viram historico imutavel.
        </Text>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  backLabel: {
    color: colors.green,
    fontWeight: '700',
  },
  card: {
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  date: {
    color: colors.gray,
    marginTop: 4,
  },
  updatedAt: {
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  row: {
    color: colors.text,
    fontSize: 14,
  },
  problem: {
    color: colors.red,
    fontWeight: '700',
  },
  resolutionBlock: {
    marginTop: 4,
    backgroundColor: '#dcefd8',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  resolutionLabel: {
    color: '#275a20',
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  resolutionDate: {
    color: '#275a20',
    fontSize: 13,
  },
  resolutionNotes: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  notes: {
    marginTop: 6,
    color: colors.gray,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.greenLight,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
  },
  secondaryButtonLabel: {
    color: colors.green,
    fontSize: 15,
    fontWeight: '700',
  },
  dangerButton: {
    flex: 1,
    backgroundColor: '#fbeae6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1c4bc',
  },
  dangerButtonLabel: {
    color: colors.red,
    fontSize: 15,
    fontWeight: '700',
  },
  lockedText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.gray,
    fontSize: 13,
    lineHeight: 18,
  },
  missingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 12,
  },
});
