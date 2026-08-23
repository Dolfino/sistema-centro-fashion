import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mapping local authentic map images from Cartografia 2025
const MAP_IMAGES: Record<string, ImageSourcePropType> = {
  SETOR_AZUL: require('../../assets/maps/SETOR_AZUL.png'),
  SETOR_VERDE: require('../../assets/maps/SETOR_VERDE.png'),
  SETOR_AMARELO: require('../../assets/maps/SETOR_AMARELO.png'),
  SETOR_ROXO: require('../../assets/maps/SETOR_ROXO.png'),
  SETOR_BRANCO: require('../../assets/maps/SETOR_BRANCO.png'),
  NIVEL_1: require('../../assets/maps/CFF_2025_NIVEL_1.png'),
};

export interface SignagePin {
  id: string;
  assetCode: string;
  category: string;
  sector: string;
  status: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA';
  normalizedX: number; // 0.0 to 1.0
  normalizedY: number; // 0.0 to 1.0
  notes?: string;
  humanLocation?: string;
}

interface InteractiveMallMapProps {
  selectedMapKey: string;
  pins: SignagePin[];
  onAddPinAtLocation?: (x: number, y: number) => void;
}

export const InteractiveMallMap: React.FC<InteractiveMallMapProps> = ({
  selectedMapKey,
  pins,
  onAddPinAtLocation,
}) => {
  const [selectedPin, setSelectedPin] = useState<SignagePin | null>(null);
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const mapSource = MAP_IMAGES[selectedMapKey] || MAP_IMAGES.SETOR_AZUL;

  const handleStageClick = (event: any) => {
    if (!isAddingMode || !onAddPinAtLocation) return;
    const { locationX, locationY } = event.nativeEvent;
    const normX = Math.max(0.05, Math.min(0.95, locationX / 650));
    const normY = Math.max(0.05, Math.min(0.95, locationY / 750));
    onAddPinAtLocation(normX, normY);
    setIsAddingMode(false);
  };

  const getPinColor = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return '#12823b'; // Verde Legado
      case 'MANUTENCAO':
        return '#e08b00'; // Laranja Legado
      case 'SUBSTITUIR':
        return '#d94841'; // Vermelho Legado
      case 'REMOVER':
        return '#7b1fa2'; // Roxo Legado
      default:
        return '#68717d'; // Cinza Legado
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Control Bar */}
      <View style={styles.mapControlBar}>
        <View style={styles.zoomControl}>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoomLevel((z) => Math.min(z + 0.2, 2.2))}>
            <Text style={styles.zoomBtnText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</Text>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}>
            <Text style={styles.zoomBtnText}>-</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addPinBtn, isAddingMode && styles.addPinBtnActive]}
          onPress={() => setIsAddingMode(!isAddingMode)}
        >
          <Text style={[styles.addPinBtnText, isAddingMode && styles.addPinBtnTextActive]}>
            {isAddingMode ? '📍 Clique no mapa para posicionar...' : '+ Posicionar Placa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Viewport Stage */}
      <ScrollView
        horizontal
        style={styles.viewportScroll}
        contentContainerStyle={styles.viewportContent}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleStageClick}
          style={[styles.stageContainer, { transform: [{ scale: zoomLevel }] }]}
        >
          {/* Authentic Floor Plan Map Image */}
          <Image
            source={mapSource}
            style={styles.floorPlanImage}
            resizeMode="contain"
          />

          {/* Authentic Pin Markers Layer */}
          {pins.map((pin) => {
            const color = getPinColor(pin.status);
            const topPercent = `${pin.normalizedY * 85}%`;
            const leftPercent = `${pin.normalizedX * 85}%`;

            return (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.markerTeardrop,
                  {
                    top: topPercent as any,
                    left: leftPercent as any,
                    backgroundColor: color,
                  },
                ]}
                onPress={() => setSelectedPin(pin)}
              >
                <View style={styles.markerInnerDot} />
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </ScrollView>

      {/* Legacy Floating Map Card (Sinalização Detail Card) */}
      {selectedPin && (
        <View style={styles.floatingCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleGroup}>
              <Text style={styles.cardSubtitle}>SINALIZAÇÃO DO MALL</Text>
              <Text style={styles.cardProtocol}>{selectedPin.assetCode}</Text>
            </View>
            <TouchableOpacity style={styles.cardCloseBtn} onPress={() => setSelectedPin(null)}>
              <Ionicons name="close" size={20} color="#676A7A" />
            </TouchableOpacity>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: getPinColor(selectedPin.status) }]}>
              <Text style={styles.statusBadgeText}>{selectedPin.status}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{selectedPin.category}</Text>
            </View>
          </View>

          <Text style={styles.cardLine}>
            <Text style={styles.boldText}>Localização: </Text>
            {selectedPin.humanLocation || selectedPin.notes || 'Piso 1 - Setor Centro Fashion'}
          </Text>

          <Text style={styles.cardLine}>
            <Text style={styles.boldText}>Coordenadas: </Text>
            X: {(selectedPin.normalizedX * 100).toFixed(1)}% | Y: {(selectedPin.normalizedY * 100).toFixed(1)}%
          </Text>

          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => setSelectedPin(null)}>
              <Text style={styles.btnSecondaryText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setSelectedPin(null)}>
              <Text style={styles.btnPrimaryText}>Fazer Inspeção</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F8',
  },
  mapControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE2EA',
  },
  zoomControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 4,
  },
  zoomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  zoomBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171B68',
  },
  zoomLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#101228',
    paddingHorizontal: 6,
  },
  addPinBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F50087',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addPinBtnActive: {
    backgroundColor: '#F50087',
  },
  addPinBtnText: {
    color: '#F50087',
    fontWeight: '700',
    fontSize: 13,
  },
  addPinBtnTextActive: {
    color: '#FFFFFF',
  },
  viewportScroll: {
    flex: 1,
  },
  viewportContent: {
    alignItems: 'center',
    justify: 'center',
    padding: 16,
  },
  stageContainer: {
    width: 650,
    height: 750,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  markerTeardrop: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '-45deg' }],
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justify: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 50,
  },
  markerInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  floatingCard: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleGroup: {
    gap: 2,
  },
  cardSubtitle: {
    color: '#676A7A',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardProtocol: {
    color: '#101228',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardCloseBtn: {
    backgroundColor: '#F4F5F8',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justify: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  categoryBadge: {
    backgroundColor: '#F4F5F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#101228',
    fontSize: 11,
    fontWeight: '600',
  },
  cardLine: {
    color: '#3D4350',
    fontSize: 13,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#101228',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  btnSecondary: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSecondaryText: {
    color: '#101228',
    fontWeight: '700',
    fontSize: 13,
  },
  btnPrimary: {
    backgroundColor: '#F50087',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
