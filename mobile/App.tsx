import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useAppContext } from './src/context/AppContext';
import {
  AddFamilyScreen,
  DashboardScreen,
  FamilyListScreen,
  FamilyProfileScreen,
  ForgotPinScreen,
  LoginScreen,
  ResolveProblemScreen,
  VisitDetailScreen,
  VisitFormScreen,
} from './src/screens';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { currentUser, isHydrated } = useAppContext();

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6741" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          <>
            <Stack.Screen name="FamilyList" component={FamilyListScreen} />
            <Stack.Screen name="AddFamily" component={AddFamilyScreen} />
            <Stack.Screen name="FamilyProfile" component={FamilyProfileScreen} />
            <Stack.Screen name="VisitForm" component={VisitFormScreen} />
            <Stack.Screen name="VisitDetail" component={VisitDetailScreen} />
            <Stack.Screen name="ResolveProblem" component={ResolveProblemScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7f4',
  },
});
