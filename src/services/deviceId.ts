import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'sinalizacao_mall_device_id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let cachedDeviceId: string | null = null;

/**
 * Identificador persistente do dispositivo, usado no protocolo de sync
 * (device_id no push) e gerado uma única vez por instalação.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;
  try {
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }
  } catch (e) {
    console.warn('[DEVICE-ID] Erro ao ler device_id:', e);
  }
  const newId = generateUUID();
  cachedDeviceId = newId;
  try {
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
  } catch (e) {
    console.warn('[DEVICE-ID] Erro ao persistir device_id:', e);
  }
  return newId;
}
