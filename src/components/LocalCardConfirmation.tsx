import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';

interface LocalCardConfirmationProps {
  visible: boolean;
  sectorName: string;
  normalizedX: number;
  normalizedY: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LocalCardConfirmation: React.FC<LocalCardConfirmationProps> = ({
  visible,
  sectorName,
  normalizedX,
  normalizedY,
  onCancel,
  onConfirm,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  if (!visible) return null;

  const pctX = (normalizedX * 100).toFixed(1);
  const pctY = (normalizedY * 100).toFixed(1);

  return (
    <View id="localCard" style={[styles.card, isMobile && styles.cardMobile]}>
      <Text id="localTitulo" style={styles.title}>
        Ponto selecionado
      </Text>
      <Text id="localStatus" style={styles.status}>
        Localização no mapa
      </Text>

      <View id="localResumo" style={styles.resumoBox}>
        <Text style={styles.resumoText}>
          <Text style={styles.resumoLabel}>Setor: </Text>
          {sectorName || 'Setor Azul'}
        </Text>
        <Text style={styles.resumoText}>
          <Text style={styles.resumoLabel}>Coordenadas: </Text>
          X: {pctX}% | Y: {pctY}%
        </Text>
      </View>

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
    bottom: 20,
    zIndex: 150,
    width: 340,
    maxWidth: '90%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 8,
  },
  cardMobile: {
    left: 12,
    right: 12,
    bottom: 12,
    width: 'auto',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171B68',
  },
  status: {
    fontSize: 12,
    color: '#676A7A',
    marginTop: 2,
    marginBottom: 10,
  },
  resumoBox: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 10,
    padding: 10,
    gap: 4,
    marginBottom: 14,
  },
  resumoText: {
    fontSize: 12,
    color: '#20233A',
  },
  resumoLabel: {
    fontWeight: 'bold',
    color: '#171B68',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#20233A',
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: '#F50087',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
