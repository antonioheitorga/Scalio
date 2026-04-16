import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useSyncStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkConnection() {
      const state = await Network.getNetworkStateAsync();

      if (mounted) {
        setIsConnected(Boolean(state.isConnected && state.isInternetReachable !== false));
      }
    }

    void checkConnection();

    const interval = setInterval(() => {
      void checkConnection();
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return isConnected;
}
