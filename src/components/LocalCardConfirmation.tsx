import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

interface LocalCardConfirmationProps {
  visible: boolean;
  sectorName: string;
  normalizedX: number;
  normalizedY: number;
  localizacaoTexto?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LocalCardConfirmation: React.FC<LocalCardConfirmationProps> = ({
  visible,
  sectorName,
  normalizedX,
  normalizedY,
  localizacaoTexto,
  onCancel,
  onConfirm,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  if (!visible) return null;

  const pctX = (normalizedX * 100).toFixed(1);
  const pctY = (normalizedY * 100).toFixed(1);
  const textoExibido =
    localizacaoTexto || `${sectorName || 'Setor Azul • Piso 1'} — Posição X: ${pctX}% | Y: ${pctY}%`;

  return (
    <View id="localCard" style={[styles.card, isMobile && styles.cardMobile]}>
      <Text id="localTitulo" style={styles.title}>
        Ponto identificado
      </Text>
      <Text id="localStatus" style={styles.status}>
        Dados locais • conferência online em segundo plano
      </Text>

      <Text id="localDescricaoIdentificada" style={styles.localDescricao}>
        {textoExibido}
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          id="cancelarPonto"
          style={styles.btnCancel}
          onPress={onCancel}
        >
          <Text style={styles.btnCancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          id="confirmarPonto"
          style={styles.btnConfirm}
          onPress={onConfirm}
        >
          <Text style={styles.btnConfirmText}>Confirmar local</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 20,
    bottom: 24,
    zIndex: 150,
    width: 440,
    maxWidth: '92%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 25,
    elevation: 10,
  },
  cardMobile: {
    left: 12,
    right: 12,
    bottom: 16,
    width: 'auto',
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  status: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  localDescricao: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btnCancel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  btnConfirm: {
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
