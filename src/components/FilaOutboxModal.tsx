import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';

export interface OutboxItem {
  clientEventId: string;
  type: 'NOVO_REGISTRO' | 'EDICAO_REGISTRO';
  title: string;
  status: 'PENDENTE' | 'PROCESSANDO' | 'ERRO' | 'CONCLUIDO';
  retryCount: number;
  errorMessage?: string | null;
  timestamp: string;
}

interface FilaOutboxModalProps {
  visible: boolean;
  onClose: () => void;
  items: OutboxItem[];
  onSyncNow: () => void;
  onRetryItem: (clientEventId: string) => void;
  isSyncing?: boolean;
}

export const FilaOutboxModal: React.FC<FilaOutboxModalProps> = ({
  visible,
  onClose,
  items,
  onSyncNow,
  onRetryItem,
  isSyncing = false,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  const getStatusBadgeStyle = (status: OutboxItem['status']) => {
    switch (status) {
      case 'PENDENTE':
        return { backgroundColor: '#FFF3E0', textColor: '#E08B00' };
      case 'PROCESSANDO':
        return { backgroundColor: '#E3F2FD', textColor: '#00C8FF' };
      case 'ERRO':
        return { backgroundColor: '#FFEBEE', textColor: '#D94841' };
      case 'CONCLUIDO':
        return { backgroundColor: '#E8F5E9', textColor: '#12823B' };
    }
  };

  const pendingCount = items.filter((i) => i.status !== 'CONCLUIDO').length;

  return (
    <View style={styles.overlayContainer}>
      <View id="filaPanel" style={[styles.panelBox, isMobile && styles.panelBoxMobile]}>
        {/* Head (.offline-head) */}
        <View style={styles.head}>
          <View>
            <Text style={styles.tagText}>S6</Text>
            <Text style={styles.title}>Fila de sincronização</Text>
          </View>

          <TouchableOpacity id="fecharFila" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text id="filaMensagem" style={styles.description}>
          Registros criados ou alterados sem conexão ficam aqui até a sincronização.
        </Text>

        {/* Lista de Itens (#filaLista) */}
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          <View id="filaLista">
            {items.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Fila limpa. Nenhum item pendente.</Text>
              </View>
            ) : (
              items.map((item) => {
                const badgeStyle = getStatusBadgeStyle(item.status);

                return (
                  <View key={item.clientEventId} style={styles.itemRow}>
                    <View style={styles.itemMeta}>
                      <View style={styles.itemHeaderLine}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: badgeStyle.backgroundColor },
                          ]}
                        >
                          <Text style={[styles.statusBadgeText, { color: badgeStyle.textColor }]}>
                            {item.status}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.eventIdText}>Event ID: {item.clientEventId}</Text>

                      <Text style={styles.itemInfoText}>
                        Tipo: {item.type} • Tentativas: {item.retryCount} • {item.timestamp}
                      </Text>

                      {item.errorMessage && (
                        <View style={styles.errorBox}>
                          <Text style={styles.errorText}>Erro: {item.errorMessage}</Text>
                        </View>
                      )}
                    </View>

                    {item.status === 'ERRO' && (
                      <TouchableOpacity
                        id="retryItemBtn"
                        style={styles.retryBtn}
                        onPress={() => onRetryItem(item.clientEventId)}
                      >
                        <Text style={styles.retryBtnText}>Retry</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Actions (.offline-actions) */}
        <View style={styles.actionsRow}>
          <Text style={styles.summaryBadgeText}>
            {pendingCount > 0 ? `${pendingCount} item(ns) pendente(s)` : 'Fila zerada'}
          </Text>

          <TouchableOpacity
            id="sincronizarFila"
            style={[styles.btnSync, pendingCount === 0 && styles.btnSyncDisabled]}
            onPress={onSyncNow}
            disabled={isSyncing || pendingCount === 0}
          >
            <Text style={styles.btnSyncText}>
              {isSyncing ? 'Sincronizando…' : 'Sincronizar agora'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 260,
    backgroundColor: 'rgba(16, 18, 40, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelBox: {
    width: 640,
    maxWidth: '92%',
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 40,
    elevation: 10,
  },
  panelBoxMobile: {
    width: '96%',
    padding: 14,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
  },
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F50087',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171B68',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#676A7A',
    marginTop: -2,
  },
  description: {
    fontSize: 13,
    color: '#676A7A',
    marginVertical: 10,
  },
  listContainer: {
    maxHeight: 380,
    marginVertical: 10,
  },
  listContent: {
    gap: 10,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },
  emptyText: {
    fontSize: 13,
    color: '#676A7A',
    fontWeight: '600',
  },
  itemRow: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemMeta: {
    flex: 1,
    marginRight: 10,
  },
  itemHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#171B68',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventIdText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'monospace',
    color: '#676A7A',
  },
  itemInfoText: {
    fontSize: 11,
    color: '#676A7A',
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 11,
    color: '#D94841',
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#171B68',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  retryBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
    paddingTop: 12,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#676A7A',
  },
  btnSync: {
    backgroundColor: '#F50087',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnSyncDisabled: {
    backgroundColor: '#CFD4DF',
  },
  btnSyncText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
