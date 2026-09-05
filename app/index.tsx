import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, TextInput } from 'react-native';
import { InteractiveMallMap, SignagePin } from '../src/components/InteractiveMallMap';
import { AppMenuModal } from '../src/components/AppMenuModal';
import { CamadasModal } from '../src/components/CamadasModal';
import { SinalizacaoCard } from '../src/components/SinalizacaoCard';
import { LocalCardConfirmation } from '../src/components/LocalCardConfirmation';
import { FormPanelModal } from '../src/components/FormPanelModal';
import { OfflineCacheModal } from '../src/components/OfflineCacheModal';
import { FilaOutboxModal, OutboxItem } from '../src/components/FilaOutboxModal';
import { FotoGaleriaModal } from '../src/components/FotoGaleriaModal';
import { InspecaoModal } from '../src/components/InspecaoModal';
import { CapturedPhoto, mediaService } from '../src/services/mediaService';
import { LegacyTheme } from '../src/theme/legacy-theme';

const initialPins: SignagePin[] = [
  { id: '1', assetCode: 'SIG-20260814-0001', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Boa', normalizedX: 0.28, normalizedY: 0.28, notes: 'Placa informativa', humanLocation: 'Rua General Bezerril', responsible: 'Davidsilva • Operações' },
  { id: '2', assetCode: 'SIG-20260814-0002', category: 'Placa informativa', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Ótima', normalizedX: 0.52, normalizedY: 0.35, notes: 'Placa informativa', humanLocation: 'Rua São José', responsible: 'Davidsilva • Operações' },
  { id: '3', assetCode: 'SIG-20260814-0003', category: 'Adesivo de piso', sector: 'SETOR_AZUL', status: 'INATIVA', conservationState: 'Regular', normalizedX: 0.25, normalizedY: 0.55, notes: 'Adesivo de uma amarelinha', humanLocation: 'Adesivo de uma amarelinha', responsible: 'Davidsilva • Operações' },
  { id: '4', assetCode: 'SIG-20260814-0004', category: 'Placa de emergência', sector: 'SETOR_AZUL', status: 'SUBSTITUIR', conservationState: 'Danificada', normalizedX: 0.65, normalizedY: 0.65, notes: 'Ambulatório ->', humanLocation: 'Ambulatório ->', responsible: 'Davidsilva • Operações' },
  { id: '5', assetCode: 'SIG-20260814-0005', category: 'Totem', sector: 'SETOR_AZUL', status: 'ATIVA', conservationState: 'Boa', normalizedX: 0.22, normalizedY: 0.80, notes: 'Promoção mês dos Pais', humanLocation: 'Promoção mês dos Pais', responsible: 'Davidsilva • Operações' },
];

const initialOutboxItems: OutboxItem[] = [
  {
    clientEventId: 'evt_20260823_001',
    type: 'NOVO_REGISTRO',
    title: 'Placa de Emergência — Ambulatório',
    status: 'PENDENTE',
    retryCount: 0,
    timestamp: '2026-08-23 18:20',
  },
  {
    clientEventId: 'evt_20260823_002',
    type: 'EDICAO_REGISTRO',
    title: 'Placa Direcional Editada — Setor Azul',
    status: 'ERRO',
    retryCount: 2,
    errorMessage: '504 Gateway Timeout — Conexão instável',
    timestamp: '2026-08-23 18:25',
  },
];

import { OfflineStorageService } from '../src/services/OfflineStorageService';

export default function LegacyMainShellScreen() {
  const [selectedMapKey, setSelectedMapKey] = useState<string>('SETOR_AZUL');

  // Inicialização com Storage Real (window.localStorage)
  const [pinsList, setPinsList] = useState<SignagePin[]>(() => OfflineStorageService.loadPins());
  const [outboxItems, setOutboxItems] = useState<OutboxItem[]>(() => OfflineStorageService.loadOutbox());

  // Pin Selecionado no Mapa
  const [selectedPin, setSelectedPin] = useState<SignagePin | null>(() => {
    const loaded = OfflineStorageService.loadPins();
    return loaded[0] || null;
  });

  // Modais e Painéis da UI-2
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [camadasOpen, setCamadasOpen] = useState<boolean>(false);
  const [showCentralCamadas, setShowCentralCamadas] = useState<boolean>(false);
  const [showSinalizacoes, setShowSinalizacoes] = useState<boolean>(true);

  // Estados do Fluxo de Posicionamento e Cadastro (UI-3)
  const [positioningMode, setPositioningMode] = useState<boolean>(false);
  const [draftPin, setDraftPin] = useState<{ normalizedX: number; normalizedY: number } | null>(null);
  const [localCardVisible, setLocalCardVisible] = useState<boolean>(false);
  const [formPanelVisible, setFormPanelVisible] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'NOVO' | 'EDITAR'>('NOVO');
  const [editingPin, setEditingPin] = useState<SignagePin | null>(null);

  // Estados de Rede e Offline/Outbox (UI-4)
  const [networkState, setNetworkState] = useState<'ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO'>('ONLINE');
  const [offlineCacheOpen, setOfflineCacheOpen] = useState<boolean>(false);
  const [filaOutboxOpen, setFilaOutboxOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modal de Fotos da Galeria S22.5 (Superfície #9 - UI-5)
  const [fotoModalOpen, setFotoModalOpen] = useState<boolean>(false);
  const [fotoPin, setFotoPin] = useState<SignagePin | null>(null);

  // Usabilidade, Busca Rápida e Filtros de Ronda (UI-6)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterConservation, setFilterConservation] = useState<string>('TODOS');
  const [inspecaoModalOpen, setInspecaoModalOpen] = useState<boolean>(false);
  const [inspecaoPin, setInspecaoPin] = useState<SignagePin | null>(null);

  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  // URL triggers e Listener automático para detector de rede (UI-4)
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setNetworkState('OFFLINE');
      } else {
        setNetworkState('ONLINE');
      }
    };

    updateNetworkStatus();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => setNetworkState('ONLINE'));
      window.addEventListener('offline', () => setNetworkState('OFFLINE'));
    }
    const interval = setInterval(updateNetworkStatus, 1500);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');

      if (view === 'network_online') {
        setNetworkState('ONLINE');
      } else if (view === 'network_degradado') {
        setNetworkState('DEGRADADO');
      } else if (view === 'network_offline') {
        setNetworkState('OFFLINE');
      } else if (view === 'network_recuperando') {
        setNetworkState('RECUPERANDO');
      } else if (view === 'cache_modal') {
        setOfflineCacheOpen(true);
        setFilaOutboxOpen(false);
      } else if (view === 'fila_modal' || view === 'item_erro') {
        setFilaOutboxOpen(true);
        setOfflineCacheOpen(false);
      } else if (view === 'retry_action') {
        setFilaOutboxOpen(true);
        // Trata retry
        setOutboxItems((prev) =>
          prev.map((i) => (i.clientEventId === 'evt_20260823_002' ? { ...i, status: 'PROCESSANDO', errorMessage: null } : i))
        );
      } else if (view === 'fila_zerada') {
        setFilaOutboxOpen(true);
        setOutboxItems((prev) => prev.map((i) => ({ ...i, status: 'CONCLUIDO', errorMessage: null })));
      } else if (view === 'positioning' || view === 'location_confirm') {
        setPositioningMode(true);
        setDraftPin({ normalizedX: 0.35, normalizedY: 0.45 });
        setLocalCardVisible(true);
        setSelectedPin(null);
      } else if (view === 'create_form') {
        setPositioningMode(false);
        setDraftPin({ normalizedX: 0.35, normalizedY: 0.45 });
        setFormMode('NOVO');
        setFormPanelVisible(true);
        setSelectedPin(null);
      } else if (view === 'created_card') {
        setSelectedPin(initialPins[0]);
      } else if (view === 'edit_before_ui31') {
        setSelectedPin(initialPins[0]);
        setFormPanelVisible(false);
      } else if (view === 'edit_form_ui31' || view === 'edit_form') {
        setFormMode('EDITAR');
        setEditingPin(initialPins[0]);
        setFormPanelVisible(true);
      } else if (view === 'edit_after_ui31' || view === 'after_edit') {
        const editedPin: SignagePin = {
          ...initialPins[0],
          notes: 'Placa Direcional Editada — Auditada UI-3',
          humanLocation: 'Rua General Bezerril',
        };
        setPinsList((prev) => prev.map((p) => (p.id === '1' ? editedPin : p)));
        setSelectedPin(editedPin);
        setFormPanelVisible(false);
      }
    }
  }, []);

  const mapsList = [
    { key: 'SETOR_AZUL', label: 'Setor Azul • Piso 1' },
    { key: 'SETOR_VERDE', label: 'Setor Verde • Piso 1' },
    { key: 'SETOR_AMARELO', label: 'Setor Amarelo • Piso 1' },
    { key: 'SETOR_ROXO', label: 'Setor Roxo • Piso 1' },
    { key: 'SETOR_BRANCO', label: 'Setor Branco • Piso 1' },
    { key: 'NIVEL_1', label: 'Visão Geral • Nível 1' },
  ];

  const handleResetView = () => {
    setSelectedMapKey('SETOR_AZUL');
    setSelectedPin(null);
    setPositioningMode(false);
    setDraftPin(null);
    setLocalCardVisible(false);
  };

  const handleSelectMenuOption = (itemId: string) => {
    setMenuOpen(false);
    if (itemId === 'novo') {
      setSelectedPin(null);
      setPositioningMode(true);
      setDraftPin({ normalizedX: 0.35, normalizedY: 0.45 });
      setLocalCardVisible(true);
    } else if (itemId === 'camadasBtn') {
      setCamadasOpen(true);
      setShowCentralCamadas(false);
    } else if (itemId === 'offline') {
      setOfflineCacheOpen(true);
    } else if (itemId === 'filaBtn' || itemId === 'fila') {
      setFilaOutboxOpen(true);
    }
  };

  const handleMapClick = (coords: { normalizedX: number; normalizedY: number }) => {
    if (!positioningMode) return;
    setDraftPin({ normalizedX: coords.normalizedX, normalizedY: coords.normalizedY });
    setLocalCardVisible(true);
  };

  const handleConfirmLocation = () => {
    setLocalCardVisible(false);
    setPositioningMode(false);
    setFormMode('NOVO');
    setEditingPin(null);
    setFormPanelVisible(true);
  };

  const handleCancelPositioning = () => {
    setPositioningMode(false);
    setDraftPin(null);
    setLocalCardVisible(false);
  };

  const handleSaveForm = (savedPinData: Partial<SignagePin>) => {
    if (formMode === 'EDITAR' && editingPin) {
      const updatedPin: SignagePin = {
        ...editingPin,
        ...savedPinData,
        id: editingPin.id,
        assetCode: editingPin.assetCode,
        photos: savedPinData.photos !== undefined ? savedPinData.photos : editingPin.photos,
      };
      setPinsList((prev) => {
        const nextPins = prev.map((p) => (p.id === editingPin.id ? updatedPin : p));
        OfflineStorageService.savePins(nextPins);
        return nextPins;
      });
      setSelectedPin(updatedPin);

      // Adiciona evento na outbox se estiver offline/degradado
      if (networkState !== 'ONLINE') {
        const outboxEvent: OutboxItem = {
          clientEventId: `evt_${Date.now()}`,
          type: 'EDICAO_REGISTRO',
          title: updatedPin.notes || 'Edição de Sinalização',
          status: 'PENDENTE',
          retryCount: 0,
          timestamp: 'Agora',
        };
        setOutboxItems((prev) => {
          const nextOutbox = [outboxEvent, ...prev];
          OfflineStorageService.saveOutbox(nextOutbox);
          return nextOutbox;
        });
      }
    } else {
      const newId = `pin_${Date.now()}`;
      const newProtocol = `SIG-20260823-000${pinsList.length + 1}`;
      const newPin: SignagePin = {
        id: newId,
        assetCode: newProtocol,
        category: savedPinData.category || 'Placa informativa',
        sector: selectedMapKey,
        status: 'ATIVA',
        conservationState: savedPinData.conservationState || 'Boa',
        normalizedX: draftPin?.normalizedX || 0.35,
        normalizedY: draftPin?.normalizedY || 0.45,
        notes: savedPinData.notes || 'Novo Registro',
        humanLocation: savedPinData.humanLocation || 'Setor Azul',
        responsible: savedPinData.responsible || 'Davidsilva • Operações',
        photos: savedPinData.photos || [],
      };
      setPinsList((prev) => {
        const nextPins = [...prev, newPin];
        OfflineStorageService.savePins(nextPins);
        return nextPins;
      });
      setSelectedPin(newPin);

      // Adiciona na outbox
      const outboxEvent: OutboxItem = {
        clientEventId: `evt_${Date.now()}`,
        type: 'NOVO_REGISTRO',
        title: newPin.notes || 'Novo Registro de Sinalização',
        status: networkState === 'ONLINE' ? 'CONCLUIDO' : 'PENDENTE',
        retryCount: 0,
        timestamp: 'Agora',
      };
      setOutboxItems((prev) => {
        const nextOutbox = [outboxEvent, ...prev];
        OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });
    }

    // Processamento de Uploads de Mídias para MinIO S3
    const pendingPhotos = (savedPinData.photos || []).filter((ph) => !ph.uploadedToS3);
    if (pendingPhotos.length > 0) {
      if (networkState === 'ONLINE') {
        pendingPhotos.forEach((ph) => {
          mediaService.uploadPhotoToMinIO(ph).then((res) => {
            if (res.success) {
              ph.uploadedToS3 = true;
              ph.storageKey = res.storageKey;
              setPinsList((currentPins) => {
                const updated = currentPins.map((p) => {
                  if (p.photos?.some((x) => x.id === ph.id)) {
                    return {
                      ...p,
                      photos: p.photos.map((x) => (x.id === ph.id ? { ...x, uploadedToS3: true, storageKey: res.storageKey } : x)),
                    };
                  }
                  return p;
                });
                OfflineStorageService.savePins(updated);
                return updated;
              });
            }
          });
        });
      } else {
        pendingPhotos.forEach((ph) => {
          const outboxEvent: OutboxItem = {
            clientEventId: `evt_media_${ph.id}`,
            type: 'NOVO_REGISTRO',
            title: `Upload de Foto (${ph.fileName})`,
            status: 'PENDENTE',
            retryCount: 0,
            timestamp: 'Agora',
          };
          setOutboxItems((prev) => {
            const nextOutbox = [outboxEvent, ...prev];
            OfflineStorageService.saveOutbox(nextOutbox);
            return nextOutbox;
          });
        });
      }
    }

    setFormPanelVisible(false);
    setPositioningMode(false);
    setDraftPin(null);
  };

  const handleSyncOutbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) => ({ ...i, status: 'CONCLUIDO' as const, errorMessage: null }));
        OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });
      setIsSyncing(false);
    }, 1200);
  };

  const handleRetryItem = (clientEventId: string) => {
    setOutboxItems((prev) => {
      const nextOutbox = prev.map((i) =>
        i.clientEventId === clientEventId
          ? { ...i, status: 'PROCESSANDO' as const, errorMessage: null, retryCount: i.retryCount + 1 }
          : i
      );
      OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });
    setTimeout(() => {
      setOutboxItems((prev) => {
        const nextOutbox = prev.map((i) =>
          i.clientEventId === clientEventId ? { ...i, status: 'CONCLUIDO' as const } : i
        );
        OfflineStorageService.saveOutbox(nextOutbox);
        return nextOutbox;
      });
    }, 800);
  };

  const handleActionClick = (actionId: string, pin: SignagePin) => {
    if (actionId === 'EDITAR') {
      setFormMode('EDITAR');
      setEditingPin(pin);
      setFormPanelVisible(true);
    } else if (actionId === 'FOTOS') {
      setFotoPin(pin);
      setFotoModalOpen(true);
    } else if (actionId === 'NOVA_INSPECAO') {
      setInspecaoPin(pin);
      setInspecaoModalOpen(true);
    }
  };

  const handleSaveInspecao = (data: {
    conservationState: string;
    status: 'ATIVA' | 'MANUTENCAO' | 'SUBSTITUIR' | 'REMOVER' | 'INATIVA';
    notes?: string;
    photo?: CapturedPhoto;
  }) => {
    if (!inspecaoPin) return;

    const updatedPhotos = data.photo ? [...(inspecaoPin.photos || []), data.photo] : inspecaoPin.photos;
    const updatedPin: SignagePin = {
      ...inspecaoPin,
      conservationState: data.conservationState,
      status: data.status,
      photos: updatedPhotos,
      notes: data.notes ? `${inspecaoPin.notes || ''} [Insp: ${data.notes}]`.trim() : inspecaoPin.notes,
    };

    setPinsList((prev) => {
      const nextPins = prev.map((p) => (p.id === updatedPin.id ? updatedPin : p));
      OfflineStorageService.savePins(nextPins);
      return nextPins;
    });

    if (selectedPin?.id === updatedPin.id) {
      setSelectedPin(updatedPin);
    }

    // Registra inspeção na Outbox
    const outboxEvent: OutboxItem = {
      clientEventId: `evt_insp_${Date.now()}`,
      type: 'EDICAO_REGISTRO',
      title: `Inspeção: ${updatedPin.assetCode} (${data.conservationState})`,
      status: networkState === 'ONLINE' ? 'CONCLUIDO' : 'PENDENTE',
      retryCount: 0,
      timestamp: 'Agora',
    };

    setOutboxItems((prev) => {
      const nextOutbox = [outboxEvent, ...prev];
      OfflineStorageService.saveOutbox(nextOutbox);
      return nextOutbox;
    });

    // Upload da foto de evidência
    if (data.photo && networkState === 'ONLINE') {
      mediaService.uploadPhotoToMinIO(data.photo).then((res) => {
        if (res.success && data.photo) {
          data.photo.uploadedToS3 = true;
          data.photo.storageKey = res.storageKey;
          setPinsList((currentPins) => {
            const updated = currentPins.map((p) => {
              if (p.id === updatedPin.id && p.photos) {
                return {
                  ...p,
                  photos: p.photos.map((ph) =>
                    ph.id === data.photo?.id ? { ...ph, uploadedToS3: true, storageKey: res.storageKey } : ph
                  ),
                };
              }
              return p;
            });
            OfflineStorageService.savePins(updated);
            return updated;
          });
        }
      });
    }
  };

  // Resultados de busca rápida
  const searchResults = searchTerm.trim()
    ? pinsList.filter(
        (p) =>
          p.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.humanLocation && p.humanLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (pin: SignagePin) => {
    setSelectedMapKey(pin.sector);
    setSelectedPin(pin);
    setSearchTerm('');
  };

  const handlePhotoUploadRequest = async (photo: CapturedPhoto) => {
    if (!fotoPin) return;
    try {
      const result = await mediaService.uploadPhotoToMinIO(photo);
      if (result.success) {
        const updatedPhotos = (fotoPin.photos || []).map((ph) =>
          ph.id === photo.id ? { ...ph, uploadedToS3: true, storageKey: result.storageKey } : ph
        );
        const updatedPin = { ...fotoPin, photos: updatedPhotos };
        setFotoPin(updatedPin);
        setPinsList((prev) => {
          const nextPins = prev.map((p) => (p.id === updatedPin.id ? updatedPin : p));
          OfflineStorageService.savePins(nextPins);
          return nextPins;
        });
        if (selectedPin?.id === updatedPin.id) {
          setSelectedPin(updatedPin);
        }
      }
    } catch (e: any) {
      console.warn('Erro ao sincronizar foto com MinIO:', e);
    }
  };

  const getNetworkBadgeStyle = () => {
    switch (networkState) {
      case 'ONLINE':
        return { bg: LegacyTheme.colors.onlineBg, text: LegacyTheme.colors.onlineText, label: 'Online' };
      case 'DEGRADADO':
        return { bg: '#FFF3E0', text: '#E08B00', label: 'Degradado' };
      case 'OFFLINE':
        return { bg: '#FFEBEE', text: '#D94841', label: 'Offline' };
      case 'RECUPERANDO':
        return { bg: '#E3F2FD', text: '#00C8FF', label: 'Recuperando…' };
    }
  };

  const netBadge = getNetworkBadgeStyle();
  const pendingQueueCount = outboxItems.filter((i) => i.status !== 'CONCLUIDO').length;

  return (
    <View style={styles.container}>
      {/* 1. Header Legado (.app-header) */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Sinalização do Mall</Text>
          <Text style={styles.headerVersion}>MVP-3.28.1-SINALIZACAO-S26.6.1</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            id="connectionBadge"
            style={[styles.connectionBadge, { backgroundColor: netBadge.bg }]}
            onPress={() => {
              // Alterna dinamicamente entre os estados de rede ao clicar na badge
              const states: ('ONLINE' | 'DEGRADADO' | 'OFFLINE' | 'RECUPERANDO')[] = [
                'ONLINE',
                'DEGRADADO',
                'OFFLINE',
                'RECUPERANDO',
              ];
              const nextIdx = (states.indexOf(networkState) + 1) % states.length;
              setNetworkState(states[nextIdx]);
            }}
          >
            <Text style={[styles.connectionBadgeText, { color: netBadge.text }]}>
              {netBadge.label}
            </Text>
          </TouchableOpacity>

          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText} numberOfLines={1}>
              {isMobile ? 'davidsilva • ADMIN' : 'davidsilva.centrofashion • ADMIN'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Main Content Layout */}
      <View style={[styles.mainLayout, isMobile && styles.mainLayoutMobile]}>
        {/* Toolbar Card (.toolbar / .map-selector-row-s22513) */}
        <View style={[styles.toolbarCard, isMobile && styles.toolbarCardMobile]}>
          <View style={styles.selectWrapper}>
            <Text style={styles.selectLabel}>Mapa / visualização</Text>

            {Platform.OS === 'web' ? (
              <select
                id="mapaSelect"
                value={selectedMapKey}
                onChange={(e) => {
                  setSelectedMapKey(e.target.value);
                  setSelectedPin(null);
                }}
                style={{
                  width: '100%',
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 9,
                  paddingBottom: 9,
                  borderWidth: 1,
                  borderColor: '#DFE3ED',
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#20233A',
                  marginTop: 4,
                  height: 42,
                }}
              >
                {mapsList.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            ) : (
              <View style={styles.mobileSelectFallback}>
                <Text style={styles.mobileSelectText} numberOfLines={1}>
                  {mapsList.find((m) => m.key === selectedMapKey)?.label}
                </Text>
              </View>
            )}
          </View>

          {/* Botões Compactos da Toolbar */}
          <View style={styles.toolbarButtonGroup}>
            {/* Botão Centralizar (#centralizar) */}
            <TouchableOpacity
              id="centralizar"
              style={styles.btnCentralizar}
              onPress={handleResetView}
              aria-label="Centralizar mapa"
            >
              <Text style={styles.btnCentralizarIcon}>⌖</Text>
            </TouchableOpacity>

            {/* Botão Menu (#appMenuBtnS22513) */}
            <TouchableOpacity
              id="appMenuBtnS22513"
              style={styles.btnMenu}
              onPress={() => setMenuOpen(!menuOpen)}
            >
              <Text style={styles.btnMenuText}>Menu</Text>
              <View style={styles.menuBadge}>
                <Text id="filaCount" style={styles.menuBadgeText}>
                  {pendingQueueCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de Filtros de Ronda e Busca Rápida (UI-6) */}
        <View style={[styles.filterBarCard, isMobile && styles.filterBarCardMobile]}>
          {/* Campo de Busca Rápida (#buscaSinalizacao) */}
          <View style={styles.searchBox}>
            <Text style={styles.searchBoxIcon}>🔍</Text>
            <TextInput
              id="buscaSinalizacao"
              style={styles.searchInput}
              placeholder="Buscar por protocolo, título ou local..."
              placeholderTextColor="#94A3B8"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchBtnText}>×</Text>
              </TouchableOpacity>
            )}

            {/* Dropdown de Resultados */}
            {searchResults.length > 0 && (
              <View id="buscaResultadosDropdown" style={styles.searchResultsDropdown}>
                {searchResults.slice(0, 5).map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectSearchResult(p)}
                  >
                    <Text style={styles.searchResultCode}>{p.assetCode}</Text>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      {p.notes || p.category}
                    </Text>
                    <Text style={styles.searchResultSector}>{p.sector}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Chips de Filtro por Conservação */}
          <View style={styles.rondaFiltersGroup}>
            {[
              { key: 'TODOS', label: 'Todos' },
              { key: 'ATENCAO', label: '⚠️ Atenção / Danificada' },
              { key: 'MANUTENCAO', label: '🔧 Manutenção' },
              { key: 'ATIVAS', label: '✓ Ativas' },
            ].map((f) => (
              <TouchableOpacity
                key={f.key}
                id={`filtro-ronda-${f.key.toLowerCase()}`}
                style={[
                  styles.filterChip,
                  filterConservation === f.key && styles.filterChipActive,
                ]}
                onPress={() => setFilterConservation(f.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterConservation === f.key && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Viewport Principal Cartográfico (.map-card / .viewport) */}
        <View style={styles.mapCard}>
          <InteractiveMallMap
            selectedMapKey={selectedMapKey}
            pins={pinsList}
            selectedPinId={selectedPin?.id}
            onSelectPin={(pin) => {
              if (!positioningMode) setSelectedPin(pin);
            }}
            filterConservation={filterConservation}
            showSinalizacoes={showSinalizacoes}
            positioningMode={positioningMode}
            draftPin={draftPin}
            onMapClick={handleMapClick}
          />

          {/* Card da Sinalização Selecionada (#sinalizacaoMapaCard) */}
          {!positioningMode && (
            <SinalizacaoCard
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
              onActionClick={handleActionClick}
            />
          )}

          {/* Card de Confirmação da Localização (#localCard) */}
          <LocalCardConfirmation
            visible={localCardVisible}
            sectorName={mapsList.find((m) => m.key === selectedMapKey)?.label || 'Setor Azul'}
            normalizedX={draftPin?.normalizedX || 0}
            normalizedY={draftPin?.normalizedY || 0}
            onCancel={handleCancelPositioning}
            onConfirm={handleConfirmLocation}
          />
        </View>
      </View>

      {/* Modais & Painéis Contextuais */}
      <AppMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectMenu={handleSelectMenuOption}
      />

      <CamadasModal
        visible={camadasOpen}
        onClose={() => setCamadasOpen(false)}
        showSinalizacoes={showSinalizacoes}
        onToggleSinalizacoes={(enabled) => setShowSinalizacoes(enabled)}
        totalPinsCount={pinsList.length}
        initialShowCentral={showCentralCamadas}
      />

      <FormPanelModal
        visible={formPanelVisible}
        mode={formMode}
        initialPin={editingPin}
        confirmedSector={mapsList.find((m) => m.key === selectedMapKey)?.label || 'Setor Azul'}
        normalizedX={draftPin?.normalizedX || editingPin?.normalizedX || 0.35}
        normalizedY={draftPin?.normalizedY || editingPin?.normalizedY || 0.45}
        onClose={() => setFormPanelVisible(false)}
        onSave={handleSaveForm}
      />

      {/* Modais de Cache e Fila Outbox (UI-4) */}
      <OfflineCacheModal
        visible={offlineCacheOpen}
        onClose={() => setOfflineCacheOpen(false)}
        networkState={networkState}
      />

      <FilaOutboxModal
        visible={filaOutboxOpen}
        onClose={() => setFilaOutboxOpen(false)}
        items={outboxItems}
        onSyncNow={handleSyncOutbox}
        onRetryItem={handleRetryItem}
        isSyncing={isSyncing}
      />

      {/* 9. Modal de Galeria Fotográfica (Superfície #9 - S22.5) */}
      <FotoGaleriaModal
        visible={fotoModalOpen}
        pin={fotoPin}
        onClose={() => setFotoModalOpen(false)}
        onUploadRequest={handlePhotoUploadRequest}
      />

      {/* 10. Modal de Nova Inspeção (Superfície #13 - S23) */}
      <InspecaoModal
        visible={inspecaoModalOpen}
        pin={inspecaoPin}
        onClose={() => setInspecaoModalOpen(false)}
        onSave={handleSaveInspecao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LegacyTheme.colors.bg,
  },

  /* Header Styles (.app-header) */
  header: {
    height: 64,
    backgroundColor: LegacyTheme.colors.navy,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: LegacyTheme.colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
    zIndex: 50,
  },
  headerMobile: {
    height: 56,
    paddingHorizontal: 12,
  },
  headerTitleGroup: {
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerVersion: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionBadge: {
    backgroundColor: LegacyTheme.colors.onlineBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: LegacyTheme.borderRadius.pill,
  },
  connectionBadgeText: {
    color: LegacyTheme.colors.onlineText,
    fontSize: 12,
    fontWeight: '700',
  },
  userBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: LegacyTheme.borderRadius.pill,
    maxWidth: 240,
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Main Layout & Toolbar Area (.toolbar) */
  mainLayout: {
    flex: 1,
    padding: 14,
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  mainLayoutMobile: {
    padding: 8,
  },
  toolbarCard: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    gap: 12,
    shadowColor: LegacyTheme.colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  toolbarCardMobile: {
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  /* Barra de Filtros de Ronda e Busca Rápida (UI-6) */
  filterBarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE3ED',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    zIndex: 100,
  },
  filterBarCardMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 8,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    position: 'relative',
  },
  searchBoxIcon: {
    fontSize: 14,
    marginRight: 6,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    height: 36,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: 'bold',
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 999,
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  searchResultCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchResultTitle: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  searchResultSector: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  rondaFiltersGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  filterChipActive: {
    backgroundColor: '#11184F',
    borderColor: '#11184F',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectWrapper: {
    flex: 1,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: LegacyTheme.colors.text,
  },
  mobileSelectFallback: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  mobileSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: LegacyTheme.colors.text,
  },
  toolbarButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnCentralizar: {
    width: 48,
    height: 42,
    minWidth: 48,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCentralizarIcon: {
    color: '#171B68',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnMenu: {
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnMenuText: {
    color: LegacyTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  menuBadge: {
    backgroundColor: LegacyTheme.colors.pink,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  /* Viewport Cartográfico (.map-card / .viewport) */
  mapCard: {
    flex: 1,
    backgroundColor: LegacyTheme.colors.surface,
    borderWidth: 1,
    borderColor: LegacyTheme.colors.border,
    borderRadius: 18,
    padding: 10,
    overflow: 'hidden',
    position: 'relative',
  },
});
