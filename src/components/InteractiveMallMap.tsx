import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SignagePin {
  id: string;
  assetCode: string;
  category: string;
  sector: string;
  conservationStatus: 'GOOD' | 'REGULAR' | 'BAD' | 'CRITICAL';
  normalizedX: number; // 0.0 to 1.0 (Percentage of floor plan width)
  normalizedY: number; // 0.0 to 1.0 (Percentage of floor plan height)
  notes?: string;
  lastInspectionDate?: string;
}

interface InteractiveMallMapProps {
  selectedSector: string;
  pins: SignagePin[];
  onAddPinAtLocation?: (x: number, y: number) => void;
}

export const InteractiveMallMap: React.FC<InteractiveMallMapProps> = ({
  selectedSector,
  pins,
  onAddPinAtLocation,
}) => {
  const [selectedPin, setSelectedPin] = useState<SignagePin | null>(null);
  const [isAddingPinMode, setIsAddingPinMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Filter pins by sector if selected
  const filteredPins = pins.filter((p) => {
    if (selectedSector === 'TODOS') return true;
    return p.sector.toUpperCase().includes(selectedSector.replace('SETOR_', '').toUpperCase());
  });

  const handleCanvasTouch = (event: any) => {
    if (!isAddingPinMode || !onAddPinAtLocation) return;
    const { locationX, locationY } = event.nativeEvent;
    // Calculate normalized percentage (0.0 to 1.0)
    const normX = Math.max(0, Math.min(1, locationX / 340));
    const normY = Math.max(0, Math.min(1, locationY / 320));
    onAddPinAtLocation(normX, normY);
    setIsAddingPinMode(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD':
        return '#10B981'; // Green
      case 'REGULAR':
        return '#F59E0B'; // Yellow
      case 'BAD':
      case 'CRITICAL':
        return '#EF4444'; // Red
      default:
        return '#38BDF8'; // Blue
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Control Toolbar */}
      <View style={styles.mapToolbar}>
        <View style={styles.zoomGroup}>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0))}
          >
            <Ionicons name="add-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
          >
            <Ionicons name="remove-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.modeBtn, isAddingPinMode && styles.modeBtnActive]}
          onPress={() => setIsAddingPinMode(!isAddingPinMode)}
        >
          <Ionicons name="location-outline" size={16} color={isAddingPinMode ? '#0F172A' : '#38BDF8'} />
          <Text style={[styles.modeBtnText, isAddingPinMode && styles.modeBtnTextActive]}>
            {isAddingPinMode ? 'Toque no mapa...' : 'Nova Placa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cartographic Floor Plan Container */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCanvasTouch}
        style={[styles.floorPlanCanvas, { transform: [{ scale: zoomLevel }] }]}
      >
        {/* Vector Sector Layout Overlay */}
        <View style={styles.sectorOverlayGrid}>
          <View style={[styles.sectorZone, { backgroundColor: '#1E3A8A22', borderColor: '#1D4ED8' }]}>
            <Text style={styles.sectorLabel}>SETOR AZUL</Text>
          </View>
          <View style={[styles.sectorZone, { backgroundColor: '#064E3B22', borderColor: '#16A34A' }]}>
            <Text style={styles.sectorLabel}>SETOR VERDE</Text>
          </View>
          <View style={[styles.sectorZone, { backgroundColor: '#713F1222', borderColor: '#EAB308' }]}>
            <Text style={styles.sectorLabel}>SETOR AMARELO</Text>
          </View>
          <View style={[styles.sectorZone, { backgroundColor: '#7F1D1D22', borderColor: '#DC2626' }]}>
            <Text style={styles.sectorLabel}>SETOR VERMELHO</Text>
          </View>
        </View>

        {/* Corridor Line Grid */}
        <View style={styles.corridorLineX} />
        <View style={styles.corridorLineY} />

        {/* Dynamic Signage Pins */}
        {filteredPins.map((pin) => {
          const pinColor = getStatusColor(pin.conservationStatus);
          const topPos = `${pin.normalizedY * 85}%`;
          const leftPos = `${pin.normalizedX * 85}%`;

          return (
            <TouchableOpacity
              key={pin.id}
              style={[
                styles.pinMarker,
                {
                  top: topPos as any,
                  left: leftPos as any,
                  backgroundColor: pinColor,
                },
              ]}
              onPress={() => setSelectedPin(pin)}
            >
              <Ionicons name="pricetag" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          );
        })}
      </TouchableOpacity>

      {/* Asset Detail Modal */}
      {selectedPin && (
        <Modal
          animationType="slide"
          transparent
          visible={!!selectedPin}
          onRequestClose={() => setSelectedPin(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={styles.titleRow}>
                  <Ionicons name="pricetag" size={22} color="#38BDF8" />
                  <Text style={styles.modalTitle}>{selectedPin.assetCode}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPin(null)}>
                  <Ionicons name="close-circle" size={26} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Categoria:</Text>
                  <Text style={styles.infoValue}>{selectedPin.category}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Setor:</Text>
                  <Text style={styles.infoValue}>{selectedPin.sector}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(selectedPin.conservationStatus) },
                    ]}
                  >
                    <Text style={styles.statusText}>{selectedPin.conservationStatus}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Coordenadas:</Text>
                  <Text style={styles.infoValue}>
                    X: {(selectedPin.normalizedX * 100).toFixed(1)}% | Y: {(selectedPin.normalizedY * 100).toFixed(1)}%
                  </Text>
                </View>

                {selectedPin.notes && (
                  <View style={styles.notesBlock}>
                    <Text style={styles.notesTitle}>Observações de Campo:</Text>
                    <Text style={styles.notesText}>{selectedPin.notes}</Text>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => setSelectedPin(null)}
              >
                <Ionicons name="camera-outline" size={18} color="#0F172A" />
                <Text style={styles.modalActionText}>Realizar Inspeção / Foto de Campo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  zoomGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 4,
  },
  toolBtn: {
    padding: 6,
  },
  zoomText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: '#38BDF8',
  },
  modeBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  floorPlanCanvas: {
    flex: 1,
    margin: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
    overflow: 'hidden',
  },
  sectorOverlayGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectorZone: {
    width: '50%',
    height: '50%',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 8,
    justifyContent: 'flex-start',
  },
  sectorLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  corridorLineX: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#33415555',
  },
  corridorLineY: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: '#33415555',
  },
  pinMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  notesBlock: {
    marginTop: 12,
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
  },
  notesTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  modalActionBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 8,
  },
  modalActionText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
