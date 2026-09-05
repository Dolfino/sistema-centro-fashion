import { Platform } from 'react-native';
import { OfflineStorageAdapter } from './OfflineStorageAdapter';
import { WebStorageAdapter } from './WebStorageAdapter';
import { SQLiteStorageAdapter } from './SQLiteStorageAdapter';

export class StorageFactory {
  private static instance: OfflineStorageAdapter | null = null;

  public static getAdapter(): OfflineStorageAdapter {
    if (!this.instance) {
      if (Platform.OS === 'web') {
        this.instance = new WebStorageAdapter();
      } else {
        this.instance = new SQLiteStorageAdapter();
      }
    }
    return this.instance;
  }
}
