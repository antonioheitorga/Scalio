import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Layout } from '../components/Layout';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme';
import type { RootStackParamList, VisitType } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitForm'>;

const visitTypes: VisitType[] = ['Producao', 'Venda', 'Insumo', 'Problema', 'OrientacaoTecnica'];

export function VisitFormScreen({ navigation, route }: Props) {
  const { familyId } = route.params;
  const { addVisit, getFamilyById } = useAppContext();
  const family = getFamilyById(familyId);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [type, setType] = useState<VisitType>('Producao');
  const [culture, setCulture] = useState(family?.cultures[0] ?? '');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [problemResolved, setProblemResolved] = useState(false);

  function handleSave() {
    if (!culture.trim() || !notes.trim()) {
      Alert.alert('Campos obrigatorios', 'Informe a cultura e as observacoes da visita.');
      return;
    }

    const visit = addVisit({
      familyId,
      date: new Date(date).toISOString(),
      type,
      culture: culture.trim(),
      quantity: quantity ? Number(quantity) : undefined,
      value: value ? Number(value) : undefined,
      notes: notes.trim(),
      problemDescription: type === 'Problema' ? problemDescription.trim() : undefined,
      problemResolved: type === 'Problema' ? problemResolved : undefined,
    });

    if (!visit) {
      Alert.alert('Erro', 'Nao foi possivel salvar a visita.');
      return;
    }

    navigation.replace('FamilyProfile', { familyId });
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Nova visita</Text>
        <Text style={styles.subtitle}>
          {family ? `Registrando visita para ${family.name}` : 'Registrando visita'}
        </Text>

        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>Modo offline ativo. O registro sera salvo no aparelho.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Data da visita</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} />

          <Text style={styles.label}>Tipo de registro</Text>
          <View style={styles.chipsWrap}>
            {visitTypes.map((visitType) => (
              <Pressable
                key={visitType}
                style={[styles.chip, visitType === type && styles.chipActive]}
                onPress={() => setType(visitType)}
              >
                <Text style={[styles.chipText, visitType === type && styles.chipTextActive]}>
                  {visitType}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Cultura</Text>
          <TextInput
            style={styles.input}
            value={culture}
            onChangeText={setCulture}
            placeholder="Ex: Acai"
            placeholderTextColor="#8f988b"
          />

          <Text style={styles.label}>Quantidade (kg)</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="Ex: 150"
            placeholderTextColor="#8f988b"
          />

          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
            placeholder="Ex: 680"
            placeholderTextColor="#8f988b"
          />

          {type === 'Problema' ? (
            <>
              <Text style={styles.label}>Descricao do problema</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={problemDescription}
                onChangeText={setProblemDescription}
                multiline
                placeholder="Descreva o problema observado"
                placeholderTextColor="#8f988b"
              />

              <Pressable
                style={[styles.checkboxRow, problemResolved && styles.checkboxRowActive]}
                onPress={() => setProblemResolved((current) => !current)}
              >
                <Text style={styles.checkboxText}>
                  {problemResolved ? 'Problema marcado como resolvido' : 'Marcar problema como resolvido'}
                </Text>
              </Pressable>
            </>
          ) : null}

          <Text style={styles.label}>Observacoes</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Escreva o que aconteceu na visita"
            placeholderTextColor="#8f988b"
          />

          <Pressable style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonLabel}>Salvar visita</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 24,
  },
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
    color: colors.gray,
  },
  offlineBadge: {
    backgroundColor: '#f8e6d4',
    borderRadius: 16,
    padding: 14,
  },
  offlineText: {
    color: '#8b531f',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.greenLight,
    borderColor: colors.green,
  },
  chipText: {
    color: colors.gray,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.green,
  },
  checkboxRow: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxRowActive: {
    backgroundColor: colors.greenLight,
    borderColor: colors.green,
  },
  checkboxText: {
    color: colors.text,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
