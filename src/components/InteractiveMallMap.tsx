import React, { useState } from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, useWindowDimensions, LayoutChangeEvent, TouchableOpacity, GestureResponderEvent, Platform } from 'react-native';
import { LegacyTheme } from '../theme/legacy-theme';

const MAP_IMAGES: Record<string, ImageSourcePropType> = {
  SETOR_AZUL: require('../../assets/maps/SETOR_AZUL.png'),
  SETOR_VERDE: require('../../assets/maps/SETOR_VERDE.png'),
  SETOR_AMARELO: require('../../assets/maps/SETOR_AMARELO.png'),
  SETOR_ROXO: require('../../assets/maps/SETOR_ROXO.png'),
  SETOR_BRANCO: require('../../assets/maps/SETOR_BRANCO.png'),
  NIVEL_1: require('../../assets/maps/CFF_2025_NIVEL_1.png'),
};

const NATURAL_DIMENSIONS: Record<string, { width: number; height: number }> = {
  SETOR_AZUL: { width: 2339, height: 3307 },
  SETOR_VERDE: { width: 2339, height: 3307 },
  SETOR_AMARELO: { width: 2339, height: 3307 },
  SETOR_ROXO: { width: 2339, height: 3307 },
  SETOR_BRANCO: { width: 2339, height: 3307 },
  NIVEL_1: { width: 1853, height: 2620 },
};

import { CapturedPhoto } from '../services/mediaService';

export interface SignagePin {
  id: string;
  assetCode: string;
  category: string;
  sector: string;
  status: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  conservationState?: string;
  normalizedX: number;
  normalizedY: number;
  notes?: string;
  humanLocation?: string;
  responsible?: string;
  photos?: CapturedPhoto[];
  entityType?: 'SINALIZACAO' | 'OCORRENCIA';
  categoryColor?: string;
  priority?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  prazoHoras?: number;
  prazoData?: string;
  concludedPhotoUrl?: string;
  concludedAt?: string;
  concludedBy?: string;
  resolutionNotes?: string;
}

export function computeContainTransform(
  viewportWidth: number,
  viewportHeight: number,
  naturalWidth: number,
  naturalHeight: number
) {
  const safeVw = viewportWidth > 0 ? viewportWidth : 1200;
  const safeVh = viewportHeight > 0 ? viewportHeight : 650;

  const scale = Math.min(safeVw / naturalWidth, safeVh / naturalHeight);
  const renderedWidth = naturalWidth * scale;
  const renderedHeight = naturalHeight * scale;
  const offsetX = (safeVw - renderedWidth) / 2;
  const offsetY = (safeVh - renderedHeight) / 2;

  return { scale, renderedWidth, renderedHeight, offsetX, offsetY };
}

interface InteractiveMallMapProps {
  selectedMapKey: string;
  pins: SignagePin[];
  selectedPinId?: string | null;
  onSelectPin?: (pin: SignagePin | null) => void;
  showSinalizacoes?: boolean;
  filterConservation?: string;
  positioningMode?: boolean;
  draftPin?: { normalizedX: number; normalizedY: number } | null;
  onMapClick?: (coords: { normalizedX: number; normalizedY: number; pointerX: number; pointerY: number; renderedWidth: number; renderedHeight: number; offsetX: number; offsetY: number }) => void;
}

export const InteractiveMallMap: React.FC<InteractiveMallMapProps> = ({
  selectedMapKey,
  pins,
  selectedPinId = null,
  onSelectPin,
  showSinalizacoes = true,
  filterConservation = 'TODOS',
  positioningMode = false,
  draftPin = null,
  onMapClick,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const initialVw = isMobile ? windowWidth - 32 : Math.min(windowWidth - 60, 1460);
  const initialVh = isMobile ? Math.max(460, windowHeight - 150) : Math.max(540, windowHeight - 170);

  const [viewportDimensions, setViewportDimensions] = useState<{ width: number; height: number }>({
    width: initialVw,
    height: initialVh,
  });

  const mapSource = MAP_IMAGES[selectedMapKey] || MAP_IMAGES.SETOR_AZUL;
  const natural = NATURAL_DIMENSIONS[selectedMapKey] || NATURAL_DIMENSIONS.SETOR_AZUL;

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setViewportDimensions({ width, height });
    }
  };

  const transform = computeContainTransform(
    viewportDimensions.width,
    viewportDimensions.height,
    natural.width,
    natural.height
  );

  const handlePressViewport = (e: GestureResponderEvent) => {
    if (!positioningMode || !onMapClick) return;

    const { locationX: pointerX, locationY: pointerY } = e.nativeEvent;

    // Converte para coordenadas normalizadas da planta renderizada
    const normX = (pointerX - transform.offsetX) / transform.renderedWidth;
    const normY = (pointerY - transform.offsetY) / transform.renderedHeight;

    // Validação estrita de limites (0 <= X <= 1 e 0 <= Y <= 1)
    if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
      onMapClick({
        normalizedX: normX,
        normalizedY: normY,
        pointerX,
        pointerY,
        renderedWidth: transform.renderedWidth,
        renderedHeight: transform.renderedHeight,
        offsetX: transform.offsetX,
        offsetY: transform.offsetY,
      });
    } else {
      console.warn('[LETTERBOX-CLICK-REJECTED] Clique fora da planta renderizada ignorado:', { pointerX, pointerY, normX, normY });
    }
  };

  const getPinColor = (pin: SignagePin) => {
    if (pin.status === 'CONCLUIDA') {
      return '#059669'; // Concluída (verde escuro esmeralda)
    }
    if (pin.entityType === 'OCORRENCIA' && pin.categoryColor) {
      return pin.categoryColor;
    }
    if (pin.priority === 'CRITICA') {
      return '#dc2626';
    }
    switch (pin.status) {
      case 'ATIVA':
        return '#12823b';
      case 'MANUTENCAO':
      case 'EM_ANDAMENTO':
        return '#e08b00';
      case 'SUBSTITUIR':
      case 'REMOVER':
        return '#d94841';
      default:
        return pin.categoryColor || '#68717d';
    }
  };

  return (
    <View
      id="viewport"
      style={[
        styles.viewport,
        positioningMode && Platform.OS === 'web' && ({ cursor: 'crosshair' } as any),
      ]}
      onLayout={handleLayout}
      onTouchStart={positioningMode ? handlePressViewport : undefined}
    >
      {/* Camada 1: Planta Cartográfica Real (zIndex: 1) */}
      <View
        style={[
          styles.mapLayer,
          {
            left: transform.offsetX,
            top: transform.offsetY,
            width: transform.renderedWidth,
            height: transform.renderedHeight,
          },
        ]}
      >
        <Image
          source={mapSource}
          style={styles.floorPlanImage}
          resizeMode="contain"
        />
      </View>

      {/* Surface de Toque no Modo de Posicionamento */}
      {positioningMode && (
        <TouchableOpacity
          id="positioningTouchLayer"
          activeOpacity={1}
          onPress={handlePressViewport}
          style={styles.positioningTouchSurface}
        />
      )}

      {/* Camada 2: Áreas Vetoriais (zIndex: 2) */}
      <View style={styles.areasLayer} pointerEvents="none" />

      {/* Camada 3: Marcadores / Pins Interativos (zIndex: 3) */}
      {showSinalizacoes && (
        <View style={styles.pinsLayer} pointerEvents="box-none">
          {pins
            .filter((p) => {
              if (!filterConservation || filterConservation === 'TODOS') return true;
              if (filterConservation === 'ATENCAO') {
                return p.conservationState === 'Danificada' || p.status === 'SUBSTITUIR' || p.status === 'MANUTENCAO' || p.priority === 'CRITICA' || p.priority === 'ALTA';
              }
              if (filterConservation === 'MANUTENCAO') {
                return p.status === 'MANUTENCAO' || p.category === 'Manutenção' || p.conservationState === 'Regular';
              }
              if (filterConservation === 'ATIVAS') {
                return p.status === 'ATIVA' || p.status === 'EM_ANDAMENTO';
              }
              if (filterConservation === 'OCORRENCIAS') {
                return p.entityType === 'OCORRENCIA';
              }
              if (filterConservation === 'SINALIZACAO') {
                return p.entityType !== 'OCORRENCIA';
              }
              return true;
            })
            .map((pin) => {
            const isSelected = pin.id === selectedPinId;
            const color = getPinColor(pin);
            const pinX = transform.offsetX + pin.normalizedX * transform.renderedWidth;
            const pinY = transform.offsetY + pin.normalizedY * transform.renderedHeight;

            return (
              <TouchableOpacity
                key={pin.id}
                id={`pin-marker-${pin.id}`}
                activeOpacity={0.8}
                onPress={() => onSelectPin && onSelectPin(pin)}
                style={[
                  styles.markerTeardrop,
                  isMobile && styles.markerTeardropMobile,
                  isSelected && styles.markerTeardropSelected,
                  {
                    left: pinX - (isMobile ? 12 : 14),
                    top: pinY - (isMobile ? 24 : 28),
                    backgroundColor: color,
                  },
                ]}
              >
                <View style={styles.markerInnerDot} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Camada Provisória (#draftLayer - zIndex: 4) */}
      {draftPin && (
        <View id="draftLayer" style={styles.draftLayer} pointerEvents="none">
          <View
            style={[
              styles.markerTeardrop,
              styles.markerDraft,
              {
                left: transform.offsetX + draftPin.normalizedX * transform.renderedWidth - (isMobile ? 12 : 14),
                top: transform.offsetY + draftPin.normalizedY * transform.renderedHeight - (isMobile ? 24 : 28),
              },
            ]}
          >
            <View style={styles.markerInnerDot} />
          </View>
        </View>
      )}

      {/* Camada 5: Overlays Temporários (zIndex: 5) */}
      <View style={styles.overlayLayer} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
    height: '100%',
    minHeight: 460,
    backgroundColor: '#e9ebf0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapLayer: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  positioningTouchSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  areasLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  pinsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  draftLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
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
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 4,
  },
  markerTeardropMobile: {
    width: 24,
    height: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  markerTeardropSelected: {
    borderColor: '#F50087',
    borderWidth: 3.5,
    shadowColor: '#F50087',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    zIndex: 60,
  },
  markerDraft: {
    backgroundColor: '#00C8FF',
    borderColor: '#FFFFFF',
    borderWidth: 3,
    shadowColor: '#00C8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    zIndex: 100,
  },
  markerInnerDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  overlayLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
});
