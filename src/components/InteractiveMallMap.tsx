import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageSourcePropType, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  normalizedX: number;
  normalizedY: number;
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
  const { width: windowWidth } = useWindowDimensions();

  const isMobile = windowWidth < 700;
  const mapSource = MAP_IMAGES[selectedMapKey] || MAP_IMAGES.SETOR_AZUL;

  const handleStageClick = (event: any) => {
    if (!isAddingMode || !onAddPinAtLocation) return;
    const { locationX, locationY } = event.nativeEvent;
    const stageWidth = isMobile ? windowWidth - 24 : 650;
    const normX = Math.max(0.05, Math.min(0.95, locationX / stageWidth));
    const normY = Math.max(0.05, Math.min(0.95, locationY / (stageWidth * 1.15)));
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
        return '#68717d';
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Stage Viewport */}
      <ScrollView
        horizontal={!isMobile}
        style={styles.viewportScroll}
        contentContainerStyle={styles.viewportContent}
      >
        <ScrollView
          style={styles.viewportScrollY}
          contentContainerStyle={styles.viewportContentY}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleStageClick}
            style={[
              styles.stageContainer,
              isMobile && styles.stageContainerMobile,
              { transform: [{ scale: zoomLevel }] },
            ]}
          >
            {/* Authentic Floor Plan Map Image */}
            <Image
              source={mapSource}
              style={styles.floorPlanImage}
              resizeMode="contain"
            />

            {/* Authentic Teardrop Pins Layer */}
            {pins.map((pin) => {
              const color = getPinColor(pin.status);
              const topPercent = `${pin.normalizedY * 86}%`;
              const leftPercent = `${pin.normalizedX * 86}%`;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.markerTeardrop,
                    isMobile && styles.markerTeardropMobile,
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
      </ScrollView>

      {/* Floating Toolbar Bar at Top Right */}
      <View style={[styles.bottomToolbar, isMobile && styles.bottomToolbarMobile]}>
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
            {isAddingMode ? '📍 Clique...' : '+ Posicionar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Legacy Map Card Modal */}
      {selectedPin && (
        <View style={[styles.floatingCard, isMobile && styles.floatingCardMobile]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleGroup}>
              <Text style={styles.cardSubtitle}>SINALIZAÇÃO DO MALL</Text>
              <Text style={styles.cardProtocol}>{selectedPin.assetCode}</Text>
            </View>
            <TouchableOpacity style={styles.cardCloseBtn} onPress={() => setSelectedPin(null)}>
              <Ionicons name="close" size={18} color="#676A7A" />
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
              <Text style={styles.btnPrimaryText}>Inspeção</Text>
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
    backgroundColor: '#E9EBF0',
    position: 'relative',
  },
  viewportScroll: {
    flex: 1,
  },
  viewportContent: {
    alignItems: 'center',
    justify: 'center',
    flexGrow: 1,
  },
  viewportScrollY: {
    flex: 1,
  },
  viewportContentY: {
    alignItems: 'center',
    justify: 'center',
    padding: 8,
    flexGrow: 1,
  },
  stageContainer: {
    width: 650,
    height: 750,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    position: 'relative',
    overflow: 'hidden',

  },
  stageContainerMobile: {
    width: '100%',
    maxWidth: 650,
    height: 600,
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  markerTeardrop: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '-45deg' }],
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justify: 'center',
    zIndex: 50,
  },
  markerTeardropMobile: {
    width: 26,
    height: 26,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomLeftRadius: 13,
  },
  markerInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomToolbar: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 90,
  },
  bottomToolbarMobile: {
    right: 8,
    top: 8,
  },
  zoomControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    paddingHorizontal: 4,
  },
  zoomBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  zoomBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#171B68',
  },
  zoomLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#101228',
    paddingHorizontal: 4,
  },
  addPinBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F50087',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addPinBtnActive: {
    backgroundColor: '#F50087',
  },
  addPinBtnText: {
    color: '#F50087',
    fontWeight: '700',
    fontSize: 11,
  },
  addPinBtnTextActive: {
    color: '#FFFFFF',
  },
  floatingCard: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    zIndex: 100,
  },
  floatingCardMobile: {
    left: 12,
    right: 12,
    bottom: 12,
    width: 'auto',
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justify: 'space-between',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
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
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#101228',
  },
  cardActions: {
    flexDirection: 'row',
    justify: 'flex-end',
    gap: 10,
    marginTop: 12,
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
