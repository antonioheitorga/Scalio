import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Layout } from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import { formatCurrency, formatDate, formatQuantity } from '../utils/format';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

export function VisitDetailScreen({ navigation, route }: Props) {
  const { visitId } = route.params;
  const { getVisitById } = useAppContext();
  const visit = getVisitById(visitId);

  if (!visit) {
    return (
      <Layout>
        <Text style={styles.missingText}>Registro nao encontrado.</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backLabel}>Voltar</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>{visit.type}</Text>
        <Text style={styles.date}>{formatDate(visit.date)}</Text>

        <Text style={styles.row}>Cultura: {visit.culture}</Text>
        <Text style={styles.row}>Quantidade: {formatQuantity(visit.quantity)}</Text>
        <Text style={styles.row}>Valor: {formatCurrency(visit.value)}</Text>
        <Text style={styles.row}>Status de sync: {visit.syncStatus}</Text>

        {visit.problemDescription ? (
          <Text style={styles.problem}>Problema: {visit.problemDescription}</Text>
        ) : null}

        <Text style={styles.notes}>{visit.notes}</Text>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  date: {
    color: colors.gray,
    marginBottom: 8,
  },
  row: {
    color: colors.text,
    fontSize: 14,
  },
  problem: {
    color: colors.red,
    fontWeight: '700',
  },
  notes: {
    marginTop: 6,
    color: colors.gray,
    lineHeight: 20,
  },
  missingText: {
    color: colors.text,
    fontSize: 16,
  },
});
