import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialState } from '../data/seed';
import type { AppState } from '../types';

const STORAGE_KEY = 'scalio-app-state';

export async function loadAppState() {
  const rawState = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(rawState) as AppState;

    return {
      ...initialState,
      ...parsed,
    };
  } catch {
    return initialState;
  }
}

export async function saveAppState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
