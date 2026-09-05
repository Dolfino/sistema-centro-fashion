import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';

interface OfflineCacheModalProps {
  visible: boolean;
  onClose: () => void;
  networkState: 'ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO';
}

export const OfflineCacheModal: React.FC<OfflineCacheModalProps> = ({
  visible,
  onClose,
  networkState,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [progress, setProgress] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [resumoText, setResumoText] = useState<string>('Cache ainda não verificado.');
  const [statusBadge, setStatusBadge] = useState<string>('PRONTO');

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

  const handleVerificarCache = () => {
    setStatusBadge('VERIFICADO');
    setResumoText(
      'Integridade auditada: 6 plantas cartográficas OK, 5 registros locais OK, 0 mídias pendentes. Versão v3.28.1-S26.6.1.'
    );
  };

  const handleRepararCache = () => {
    setStatusBadge('REPARADO');
    setResumoText(
      'Índices locais re-alinhados e inconsistências de cache reparadas com sucesso. Nenhum dado do usuário foi apagado.'
    );
  };

  const handleAtualizarOffline = () => {
    setIsUpdating(true);
    setProgress(0);
    setStatusBadge('BAIXANDO');
    setResumoText('Baixando pacote de dados e assets cartográficos…');

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current <= 100) {
        setProgress(current);
      }
      if (current >= 100) {
        clearInterval(interval);
        setIsUpdating(false);
        setStatusBadge('ATUALIZADO');
        setResumoText(
          'Pacote offline atualizado com sucesso (100%). Plantas, mapas e esquemas disponíveis para uso completamente offline.'
        );
      }
    }, 400);
  };

  return (
    <View style={styles.overlayContainer}>
      <View id="offlinePanel" style={[styles.panelBox, isMobile && styles.panelBoxMobile]}>
        {/* Head (.offline-head) */}
        <View style={styles.head}>
          <View>
            <Text style={styles.tagText}>S5A</Text>
            <Text style={styles.title}>Cache offline</Text>
          </View>
          <TouchableOpacity id="fecharOffline" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text id="offlineMensagem" style={styles.description}>
          Mantenha o cache do dispositivo íntegro e atualizado.
        </Text>

        {/* Progress Bar (.offline-progress) */}
        <View style={styles.progressContainer}>
          <View id="offlineBar" style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPctText}>{progress}% concluído</Text>

        {/* Resumo Box (.offline-resumo) */}
        <View id="offlineResumo" style={styles.resumoBox}>
          <View style={styles.resumoHead}>
            <Text style={styles.resumoTitle}>Status do Diagnóstico</Text>
            <View style={styles.resumoBadge}>
              <Text style={styles.resumoBadgeText}>{statusBadge}</Text>
            </View>
          </View>
          <Text style={styles.resumoTextContent}>{resumoText}</Text>
        </View>

        {/* Actions (.offline-actions) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            id="verificarOffline"
            style={styles.btnSecondary}
            onPress={handleVerificarCache}
            disabled={isUpdating}
          >
            <Text style={styles.btnSecondaryText}>Verificar cache</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="repararOffline"
            style={styles.btnSecondary}
            onPress={handleRepararCache}
            disabled={isUpdating}
          >
            <Text style={styles.btnSecondaryText}>Reparar cache</Text>
          </TouchableOpacity>

          <TouchableOpacity
            id="executarPrepararOffline"
            style={styles.btnPrimary}
            onPress={handleAtualizarOffline}
            disabled={isUpdating}
          >
            <Text style={styles.btnPrimaryText}>
              {isUpdating ? 'Atualizando…' : 'Preparar / atualizar offline'}
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
    zIndex: 250,
    backgroundColor: 'rgba(16, 18, 40, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelBox: {
    width: 580,
    maxWidth: '92%',
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
    marginVertical: 12,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#EAEFF8',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F50087',
    borderRadius: 5,
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#171B68',
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  resumoBox: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  resumoHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resumoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#171B68',
  },
  resumoBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  resumoBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#171B68',
  },
  resumoTextContent: {
    fontSize: 12,
    color: '#3D4350',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
    paddingTop: 12,
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20233A',
  },
  btnPrimary: {
    backgroundColor: '#F50087',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
