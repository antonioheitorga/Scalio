import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
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
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddFamily'>;

export function AddFamilyScreen({ navigation }: Props) {
  const { addFamily } = useAppContext();
  const [name, setName] = useState('');
  const [cultures, setCultures] = useState('');
  const [area, setArea] = useState('');

  function handleSave() {
    const cleanedName = name.trim();
    const cleanedCultures = cultures
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const parsedArea = Number(area);

    if (!cleanedName || cleanedCultures.length === 0 || Number.isNaN(parsedArea) || parsedArea <= 0) {
      Alert.alert('Campos obrigatorios', 'Preencha nome, culturas e area aproximada.');
      return;
    }

    const family = addFamily({
      name: cleanedName,
      cultures: cleanedCultures,
      areaHectares: parsedArea,
    });

    if (!family) {
      Alert.alert('Erro', 'Nao foi possivel salvar a familia.');
      return;
    }

    navigation.replace('FamilyProfile', { familyId: family.id });
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Nova familia</Text>
        <Text style={styles.subtitle}>
          Este cadastro fica salvo offline no aparelho e aparece imediatamente na lista.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nome da familia</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Familia Ferreira"
            placeholderTextColor="#8f988b"
          />

          <Text style={styles.label}>Culturas principais</Text>
          <TextInput
            style={styles.input}
            value={cultures}
            onChangeText={setCultures}
            placeholder="Ex: Acai, Mandioca"
            placeholderTextColor="#8f988b"
          />

          <Text style={styles.label}>Area aproximada (ha)</Text>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            keyboardType="decimal-pad"
            placeholder="Ex: 2.5"
            placeholderTextColor="#8f988b"
          />

          <Pressable style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonLabel}>Salvar familia</Text>
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
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  formCard: {
    marginTop: 10,
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
