import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export type NetworkState = 'ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO';

/**
 * Detector de rede (UI-4): NetInfo em web e nativo, com fallback window e
 * verificação periódica de navigator.onLine.
 */
export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>('ONLINE');

  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setNetworkState('OFFLINE');
      } else {
        setNetworkState('ONLINE');
      }
    };

    updateNetworkStatus();

    // NetInfo funciona em web e nativo; mantém fallback window para segurança
    let unsubscribeNetInfo: (() => void) | null = null;
    let windowOnlineHandler: (() => void) | null = null;
    let windowOfflineHandler: (() => void) | null = null;

    if (typeof NetInfo !== 'undefined' && typeof NetInfo.addEventListener === 'function') {
      unsubscribeNetInfo = NetInfo.addEventListener((state) => {
        if (state.isConnected === false || state.isInternetReachable === false) {
          setNetworkState('OFFLINE');
        } else {
          setNetworkState('ONLINE');
        }
      });
    } else if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      windowOnlineHandler = () => setNetworkState('ONLINE');
      windowOfflineHandler = () => setNetworkState('OFFLINE');
      window.addEventListener('online', windowOnlineHandler);
      window.addEventListener('offline', windowOfflineHandler);
    }

    const interval = setInterval(updateNetworkStatus, 1500);

    return () => {
      clearInterval(interval);
      if (unsubscribeNetInfo) unsubscribeNetInfo();
      if (windowOnlineHandler && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('online', windowOnlineHandler);
      }
      if (windowOfflineHandler && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('offline', windowOfflineHandler);
      }
    };
  }, []);

  return { networkState, setNetworkState };
}
