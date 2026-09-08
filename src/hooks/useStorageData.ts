import { useState, useEffect, useCallback } from 'react';
import { SignagePin } from '../components/InteractiveMallMap';
import { OutboxItem } from '../components/FilaOutboxModal';
import { OfflineStorageService } from '../services/OfflineStorageService';

/**
 * Hidratação e persistência do storage offline (SQLite no nativo / localStorage na web).
 */
export function useStorageData() {
  const [pinsList, setPinsList] = useState<SignagePin[]>([]);
  const [outboxItems, setOutboxItems] = useState<OutboxItem[]>([]);
  const [selectedPin, setSelectedPin] = useState<SignagePin | null>(null);
  const [storageHydrated, setStorageHydrated] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const [pins, outbox] = await Promise.all([
          OfflineStorageService.loadPins(),
          OfflineStorageService.loadOutbox(),
        ]);
        if (cancelled) return;
        setPinsList(pins);
        setOutboxItems(outbox);
        setSelectedPin((current) => current ?? pins[0] ?? null);
        setStorageHydrated(true);
      } catch (e) {
        console.error('[STORAGE] Falha na hidratação inicial:', e);
        if (!cancelled) setStorageHydrated(true);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistPins = useCallback((pins: SignagePin[]) => {
    void OfflineStorageService.savePins(pins);
  }, []);

  const persistOutbox = useCallback((items: OutboxItem[]) => {
    void OfflineStorageService.saveOutbox(items);
  }, []);

  return {
    pinsList,
    setPinsList,
    outboxItems,
    setOutboxItems,
    selectedPin,
    setSelectedPin,
    storageHydrated,
    persistPins,
    persistOutbox,
  };
}
