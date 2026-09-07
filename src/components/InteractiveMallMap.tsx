import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { LegacyTheme } from '../theme/legacy-theme';
import { CapturedPhoto } from '../services/mediaService';
import { CatalogoProducaoService, LojaProducaoItem } from '../services/catalogoProducaoService';

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

interface InteractiveMallMapProps {
  selectedMapKey: string;
  pins: SignagePin[];
  selectedPinId?: string | null;
  onSelectPin?: (pin: SignagePin | null) => void;
  showSinalizacoes?: boolean;
  showReferencias?: boolean;
  showCruzamentos?: boolean;
  filterConservation?: string;
  positioningMode?: boolean;
  draftPin?: { normalizedX: number; normalizedY: number } | null;
  campanhaAtivaId?: string | null;
  campanhaAdesoesMap?: Record<string, { status: string; cor: string; label: string }>;
  resetTrigger?: number;
  showLojasBoxes?: boolean;
  onSelectLoja?: (loja: LojaProducaoItem) => void;
  onMapClick?: (coords: {
    normalizedX: number;
    normalizedY: number;
    pointerX: number;
    pointerY: number;
    renderedWidth: number;
    renderedHeight: number;
    offsetX: number;
    offsetY: number;
  }) => void;
}

// Componente de Marcador no formato clássico de gota (Gota com ponta para BAIXO)
const TeardropPin: React.FC<{
  color: string;
  isSelected?: boolean;
  isDraft?: boolean;
  size?: number;
}> = ({ color, isSelected = false, isDraft = false, size = 28 }) => {
  const width = size;
  const height = Math.round(size * 1.35); // Proporção áurea de pin: 28w x 38h

  if (Platform.OS === 'web') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 33"
        style={{
          display: 'block',
          overflow: 'visible',
          pointerEvents: 'none',
          filter: isSelected
            ? 'drop-shadow(0 0 8px #F50087) drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
            : isDraft
            ? 'drop-shadow(0 0 8px #00C8FF) drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))',
        }}
      >
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 8.5 10.5 19.8 11.2 20.6.4.4 1.1.4 1.5 0C13.5 31.8 24 20.5 24 12 24 5.373 18.627 0 12 0z"
          fill={color}
          stroke={isSelected ? '#F50087' : '#FFFFFF'}
          strokeWidth={isSelected ? 2.8 : 2}
        />
        <circle cx="12" cy="11.5" r="4.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Fallback nativo
  return (
    <View
      style={[
        styles.nativeMarkerTeardrop,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderColor: isSelected ? '#F50087' : '#FFFFFF',
          borderWidth: isSelected ? 3 : 2.5,
        },
      ]}
    >
      <View style={styles.markerInnerDot} />
    </View>
  );
};

// Componente de Ponto Indicador Circular (Dot) para Boxes e Lojas com Temas de Cores
const BoxDotMarker: React.FC<{
  color: string;
  size: number;
  isSelected?: boolean;
}> = ({ color, size, isSelected = false }) => {
  const isWhite = color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#f8fafc';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: Math.max(1.5, Math.round(size * 0.14)),
        borderColor: isSelected
          ? '#38bdf8'
          : isWhite
          ? '#64748b'
          : 'rgba(15, 23, 42, 0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: isSelected ? '#38bdf8' : color,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isSelected ? 0.95 : 0.7,
        shadowRadius: isSelected ? 6 : 2.5,
        elevation: isSelected ? 8 : 3,
        transform: isSelected ? [{ scale: 1.4 }] : undefined,
      }}
    />
  );
};

export const InteractiveMallMap: React.FC<InteractiveMallMapProps> = ({
  selectedMapKey,
  pins,
  selectedPinId = null,
  onSelectPin,
  showSinalizacoes = true,
  showReferencias = true,
  showCruzamentos = true,
  filterConservation = 'TODOS',
  positioningMode = false,
  draftPin = null,
  campanhaAtivaId = null,
  campanhaAdesoesMap = {},
  resetTrigger = 0,
  showLojasBoxes = false,
  onSelectLoja,
  onMapClick,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  // Filtro interno por tema/status de ocupação dos boxes
  const [filtroStatusOcupacao, setFiltroStatusOcupacao] = useState<string>('TODOS');

  // Lojas e Boxes reais do setor atual (das 8 planilhas sincronizadas)
  const lojasSetor = useMemo(() => {
    if (!showLojasBoxes && filterConservation !== 'LOJAS_BOXES') return [];
    let setorQuery = 'AZUL';
    if (selectedMapKey.includes('VERDE')) setorQuery = 'VERDE';
    else if (selectedMapKey.includes('AMARELO')) setorQuery = 'AMARELO';
    else if (selectedMapKey.includes('ROXO')) setorQuery = 'ROXO';
    else if (selectedMapKey.includes('BRANCO')) setorQuery = 'BRANCO';

    return CatalogoProducaoService.buscarPorSetor(setorQuery);
  }, [selectedMapKey, showLojasBoxes, filterConservation]);

  // Contagem analítica dos status para o setor corrente
  const totaisStatusSetor = useMemo(() => {
    const counts: Record<string, number> = {
      TOTAL: lojasSetor.length,
      VAZIO: 0,
      OCUPADO_ADIMPLENTE: 0,
      EM_ATRASO: 0,
      DEVENDO_PARCELAS: 0,
      EM_REFORMA: 0,
      MONTANDO_INAUGURACAO: 0,
      RESERVADO: 0,
    };
    for (const l of lojasSetor) {
      const st = l.statusOcupacao || 'OCUPADO_ADIMPLENTE';
      if (counts[st] !== undefined) counts[st]++;
    }
    return counts;
  }, [lojasSetor]);

  // Lista filtrada pelo tema de cor selecionado na legenda
  const lojasExibidas = useMemo(() => {
    if (filtroStatusOcupacao === 'TODOS') return lojasSetor;
    return lojasSetor.filter((l) => (l.statusOcupacao || 'OCUPADO_ADIMPLENTE') === filtroStatusOcupacao);
  }, [lojasSetor, filtroStatusOcupacao]);

  const initialVw = isMobile ? windowWidth - 32 : Math.min(windowWidth - 60, 1460);
  const initialVh = isMobile ? Math.max(460, windowHeight - 150) : Math.max(540, windowHeight - 170);

  const [viewportDim, setViewportDim] = useState({ width: initialVw, height: initialVh });
  const viewportRef = useRef<View>(null);

  const natural = NATURAL_DIMENSIONS[selectedMapKey] || NATURAL_DIMENSIONS.SETOR_AZUL;
  const mapSource = MAP_IMAGES[selectedMapKey] || MAP_IMAGES.SETOR_AZUL;

  // Estado de transformação do mapa (idêntico ao Google Apps Script)
  const [scale, setScale] = useState<number>(0.3);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fitScale, setFitScale] = useState<number>(0.3);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  // Função para enquadrar perfeitamente a planta centralizada (resetarMapa)
  const resetarMapa = useCallback((vw: number, vh: number, natW: number, natH: number) => {
    if (vw <= 0 || vh <= 0 || natW <= 0 || natH <= 0) return;
    const sx = vw / natW;
    const sy = vh / natH;
    const initialFit = Math.min(sx, sy, 1);
    const initialX = (vw - natW * initialFit) / 2;
    const initialY = (vh - natH * initialFit) / 2;

    scaleRef.current = initialFit;
    translateRef.current = { x: initialX, y: initialY };
    fitScaleRef.current = initialFit;

    setFitScale(initialFit);
    setScale(initialFit);
    setTranslate({ x: initialX, y: initialY });
  }, []);

  // Recalcula fit quando o viewport ou a planta muda
  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setViewportDim({ width, height });
      resetarMapa(width, height, natural.width, natural.height);
    }
  };

  // Troca de planta
  useEffect(() => {
    if (viewportDim.width > 0 && viewportDim.height > 0) {
      resetarMapa(viewportDim.width, viewportDim.height, natural.width, natural.height);
    }
  }, [selectedMapKey, natural.width, natural.height, resetarMapa]);

  // Acionamento externo de reset (ex: botão Centralizar da toolbar)
  useEffect(() => {
    if (resetTrigger > 0 && viewportDim.width > 0 && viewportDim.height > 0) {
      resetarMapa(viewportDim.width, viewportDim.height, natural.width, natural.height);
    }
  }, [resetTrigger, resetarMapa, viewportDim]);

  // Referências sincronizadas para handlers nativos de touch/wheel sem delay de closure
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  const fitScaleRef = useRef(fitScale);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);

  useEffect(() => {
    fitScaleRef.current = fitScale;
  }, [fitScale]);

  // Zoom focado no ponto (mx, my) com scroll do mouse ou pinça - 100% responsivo e instantâneo
  const zoomAtPoint = useCallback((mx: number, my: number, newScaleTarget: number) => {
    const minScale = Math.max(0.12, fitScaleRef.current * 0.4);
    const maxScale = 6.0;
    const ns = Math.min(maxScale, Math.max(minScale, newScaleTarget));

    const currentScale = scaleRef.current;
    const currentTranslate = translateRef.current;

    const wx = (mx - currentTranslate.x) / currentScale;
    const wy = (my - currentTranslate.y) / currentScale;

    const newX = mx - wx * ns;
    const newY = my - wy * ns;

    scaleRef.current = ns;
    translateRef.current = { x: newX, y: newY };

    setScale(ns);
    setTranslate({ x: newX, y: newY });
  }, []);

  // Listener nativo para web: roda do mouse (wheel) e gestos de toque / pinça (touch / pinch-to-zoom)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = viewportRef.current as any;
    if (!node) return;

    // Roda do mouse com zoom focalizado
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = node.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      zoomAtPoint(mx, my, scaleRef.current * factor);
    };

    // Gerenciamento de Toque Multi-Touch (Pan com 1 dedo e Pinch-to-Zoom com 2 dedos)
    let touchMode: 'none' | 'pan' | 'pinch' = 'none';
    let touchStartX = 0;
    let touchStartY = 0;
    let touchOriginX = 0;
    let touchOriginY = 0;
    let initialPinchDistance = 0;
    let initialPinchScale = 1;
    let initialPinchTranslate = { x: 0, y: 0 };
    let initialPinchMidX = 0;
    let initialPinchMidY = 0;
    let touchHasMoved = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const target = e.target as HTMLElement | null;
        if (target?.closest?.('[data-role="pin"], [id^="pin-marker-"]')) {
          touchMode = 'none';
          return;
        }

        touchMode = 'pan';
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchOriginX = translateRef.current.x;
        touchOriginY = translateRef.current.y;
        touchHasMoved = false;
        setIsPanning(true);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        touchMode = 'pinch';
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchScale = scaleRef.current;
        initialPinchTranslate = { ...translateRef.current };

        const rect = node.getBoundingClientRect();
        initialPinchMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
        initialPinchMidY = (t1.clientY + t2.clientY) / 2 - rect.top;
        touchHasMoved = true;
        setIsPanning(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchMode === 'none') return;
      e.preventDefault(); // Impede rolagem da página inteira e zoom nativo indesejado do browser

      if (touchMode === 'pan' && e.touches.length === 1) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const dx = clientX - touchStartX;
        const dy = clientY - touchStartY;

        if (Math.hypot(dx, dy) > 4) {
          touchHasMoved = true;
        }

        const newX = touchOriginX + dx;
        const newY = touchOriginY + dy;
        translateRef.current = { x: newX, y: newY };
        setTranslate({ x: newX, y: newY });
      } else if (touchMode === 'pinch' && e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

        if (initialPinchDistance > 0) {
          const factor = currentDistance / initialPinchDistance;
          const minScale = Math.max(0.12, fitScaleRef.current * 0.4);
          const maxScale = 6.0;
          const targetScale = Math.min(maxScale, Math.max(minScale, initialPinchScale * factor));

          const rect = node.getBoundingClientRect();
          const currentMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
          const currentMidY = (t1.clientY + t2.clientY) / 2 - rect.top;

          // Ponto no espaço do mapa correspondente ao centro inicial do gesto de pinça
          const wx = (initialPinchMidX - initialPinchTranslate.x) / initialPinchScale;
          const wy = (initialPinchMidY - initialPinchTranslate.y) / initialPinchScale;

          const newX = currentMidX - wx * targetScale;
          const newY = currentMidY - wy * targetScale;

          scaleRef.current = targetScale;
          translateRef.current = { x: newX, y: newY };
          setScale(targetScale);
          setTranslate({ x: newX, y: newY });
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchMode = 'pan';
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchOriginX = translateRef.current.x;
        touchOriginY = translateRef.current.y;
      } else if (e.touches.length === 0) {
        touchMode = 'none';
        setIsPanning(false);
      }
    };

    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('touchstart', onTouchStart, { passive: false });
    node.addEventListener('touchmove', onTouchMove, { passive: false });
    node.addEventListener('touchend', onTouchEnd, { passive: false });
    node.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [zoomAtPoint]);

  // Referência para gerenciamento de arrasto/pan via mouse
  const pointerState = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    hasMoved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    hasMoved: false,
  });

  const handlePointerDown = (e: any) => {
    // Eventos de touch são tratados nativamente pelo listener multi-touch
    if (e.pointerType === 'touch' || e.nativeEvent?.pointerType === 'touch') return;
    // Não inicia pan se clicou em botão ou marcador
    if (e.target?.closest?.('[data-role="hud"], [data-role="pin"], [id^="pin-marker-"]')) return;

    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;

    pointerState.current = {
      isDown: true,
      startX: clientX,
      startY: clientY,
      originX: translate.x,
      originY: translate.y,
      hasMoved: false,
    };
    setIsPanning(true);
  };

  const handlePointerMove = (e: any) => {
    if (e.pointerType === 'touch' || e.nativeEvent?.pointerType === 'touch') return;
    if (!pointerState.current.isDown) return;
    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;
    const dx = clientX - pointerState.current.startX;
    const dy = clientY - pointerState.current.startY;

    if (Math.hypot(dx, dy) > 4) {
      pointerState.current.hasMoved = true;
    }

    setTranslate({
      x: pointerState.current.originX + dx,
      y: pointerState.current.originY + dy,
    });
  };

  const handlePointerUp = (e: any) => {
    if (e.pointerType === 'touch' || e.nativeEvent?.pointerType === 'touch') return;
    const wasMoved = pointerState.current.hasMoved;
    pointerState.current.isDown = false;
    setIsPanning(false);

    // Se foi clique simples (não moveu) e está no modo de posicionamento
    if (!wasMoved && positioningMode && onMapClick) {
      const node = viewportRef.current as any;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
      const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;

      const px = clientX - rect.left;
      const py = clientY - rect.top;

      // Converte para coordenadas normalizadas da planta original
      const normX = (px - translate.x) / (natural.width * scale);
      const normY = (py - translate.y) / (natural.height * scale);

      if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
        onMapClick({
          normalizedX: normX,
          normalizedY: normY,
          pointerX: px,
          pointerY: py,
          renderedWidth: natural.width * scale,
          renderedHeight: natural.height * scale,
          offsetX: translate.x,
          offsetY: translate.y,
        });
      }
    }
  };

  const getPinColor = (pin: SignagePin) => {
    if (pin.status === 'CONCLUIDA') {
      return '#059669'; // Concluída (verde esmeralda)
    }
    if (pin.entityType === 'OCORRENCIA' && pin.categoryColor) {
      return pin.categoryColor;
    }
    if (pin.priority === 'CRITICA') {
      return '#dc2626'; // Vermelho crítico
    }
    switch (pin.status) {
      case 'ATIVA':
        return '#0284c7'; // Azul royal sinalização (ou verde se configurado)
      case 'MANUTENCAO':
      case 'EM_ANDAMENTO':
        return '#e08b00'; // Laranja manutenção
      case 'SUBSTITUIR':
      case 'REMOVER':
        return '#d94841'; // Vermelho alerta
      default:
        return pin.categoryColor || '#68717d';
    }
  };

  // Tamanho do PIN otimizado: compacto e proporcional na visão 100% (15px desktop / 13px mobile)
  // Escala suavemente conforme o zoom aumenta, evitando cobrir múltiplos boxes na visão geral
  const zoomRatio = fitScale > 0 ? scale / fitScale : 1;
  const basePinWidth = isMobile ? 13 : 15;
  const pinWidth = Math.min(22, Math.max(12, Math.round(basePinWidth * Math.pow(zoomRatio, 0.3))));
  const pinHeight = Math.round(pinWidth * 1.35);
  const zoomPercent = Math.round((scale / fitScale) * 100);

  return (
    <View
      id="viewport"
      ref={viewportRef}
      style={[
        styles.viewport,
        isMobile && ({ minHeight: 520, height: Math.max(520, windowHeight - 260) } as any),
        positioningMode
          ? ({ cursor: 'crosshair' } as any)
          : isPanning
          ? ({ cursor: 'grabbing' } as any)
          : ({ cursor: 'grab' } as any),
      ]}
      onLayout={handleLayout}
      // Handlers de ponteiro web para pan e clique
      {...({
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: () => {
          pointerState.current.isDown = false;
          setIsPanning(false);
        },
      } as any)}
    >
      {/* Camada Transformável: Stage (Planta em Alta Resolução) */}
      <View
        id="mapaStage"
        style={[
          styles.mapStage,
          {
            width: natural.width,
            height: natural.height,
            transform: [
              { translateX: translate.x },
              { translateY: translate.y },
              { scale: scale },
            ],
            transformOrigin: '0 0',
          },
        ]}
      >
        <Image
          source={mapSource}
          style={{ width: natural.width, height: natural.height }}
          resizeMode="cover"
        />
      </View>

      {/* Camada de Marcadores / PINs Projetados com Alta Precisão */}
      {showSinalizacoes && (
        <View style={styles.pinsLayer} pointerEvents="box-none">
          {pins
            .filter((p) => {
              if (!filterConservation || filterConservation === 'TODOS') return true;
              if (filterConservation === 'ATENCAO') {
                return (
                  p.conservationState === 'Danificada' ||
                  p.status === 'SUBSTITUIR' ||
                  p.status === 'MANUTENCAO' ||
                  p.priority === 'CRITICA' ||
                  p.priority === 'ALTA'
                );
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
              const infoCampanha = campanhaAtivaId && campanhaAdesoesMap ? campanhaAdesoesMap[pin.id] : null;
              const color = infoCampanha ? infoCampanha.cor : getPinColor(pin);

              // Projeção exata: vértice inferior da gota exatamente na coordenada (X, Y)
              const pinScreenX = translate.x + pin.normalizedX * natural.width * scale;
              const pinScreenY = translate.y + pin.normalizedY * natural.height * scale;

              // Ancoragem: X centralizado (-width/2) e Y na base (-height)
              const posX = pinScreenX - pinWidth / 2;
              const posY = pinScreenY - pinHeight;

              return (
                <TouchableOpacity
                  key={pin.id}
                  id={`pin-marker-${pin.id}`}
                  {...({ dataSet: { role: 'pin' } } as any)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (onSelectPin) {
                      onSelectPin(pin);
                    }
                  }}
                  style={[
                    styles.pinContainer,
                    {
                      left: posX,
                      top: posY,
                      width: pinWidth,
                      height: pinHeight,
                      zIndex: isSelected ? 80 : 20,
                    },
                  ]}
                >
                  <TeardropPin
                    color={color}
                    isSelected={isSelected}
                    size={pinWidth}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      )}

      {/* Camada de Lojas & Boxes Reais das 8 Planilhas Oficiais (Pontos Coloridos por Tema e Status) */}
      {lojasExibidas.length > 0 && (
        <View style={styles.pinsLayer} pointerEvents="box-none">
          {lojasExibidas.map((loja) => {
            const pinScreenX = translate.x + loja.x * natural.width * scale;
            const pinScreenY = translate.y + loja.y * natural.height * scale;
            // Ponto circular elegante com escala progressiva por zoom
            const dotSize = Math.min(24, Math.max(9, Math.round(11 * Math.pow(zoomRatio, 0.4))));

            const posX = pinScreenX - dotSize / 2;
            const posY = pinScreenY - dotSize / 2;

            return (
              <TouchableOpacity
                key={`box-loja-${loja.idLojaMapa}`}
                id={`box-marker-${loja.numeroBox}`}
                {...({
                  dataSet: { role: 'pin' },
                  title: `Box ${loja.numeroBox} • ${loja.nomeFantasia} (${loja.descricaoStatus || loja.statusOcupacao})`,
                } as any)}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                onPress={(e) => {
                  e.stopPropagation();
                  if (onSelectLoja) onSelectLoja(loja);
                }}
                style={[
                  styles.pinContainer,
                  {
                    left: posX,
                    top: posY,
                    width: dotSize,
                    height: dotSize,
                    zIndex: 25,
                  },
                ]}
              >
                <BoxDotMarker
                  color={loja.corStatus || '#10b981'}
                  size={dotSize}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Marcador Provisório / Rascunho (#draftLayer) */}
      {draftPin && (
        <View id="draftLayer" style={styles.draftLayer} pointerEvents="none">
          <View
            style={[
              styles.pinContainer,
              {
                left: translate.x + draftPin.normalizedX * natural.width * scale - pinWidth / 2,
                top: translate.y + draftPin.normalizedY * natural.height * scale - pinHeight,
                width: pinWidth,
                height: pinHeight,
                zIndex: 100,
              },
            ]}
          >
            <TeardropPin
              color="#00C8FF"
              isDraft={true}
              size={pinWidth}
            />
          </View>
        </View>
      )}

      {/* Barra de Temas e Legenda Interativa de Cores dos Boxes */}
      {lojasSetor.length > 0 && (
        <View style={styles.legendContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.legendScroll}
          >
            <Text style={styles.legendTitle}>Temas:</Text>
            {[
              { key: 'TODOS', label: 'Todos', cor: '#38bdf8', count: totaisStatusSetor.TOTAL },
              { key: 'VAZIO', label: 'Vazio', cor: '#ffffff', count: totaisStatusSetor.VAZIO },
              { key: 'OCUPADO_ADIMPLENTE', label: 'Adimplente', cor: '#10b981', count: totaisStatusSetor.OCUPADO_ADIMPLENTE },
              { key: 'EM_ATRASO', label: 'Em atraso (1 parc.)', cor: '#f59e0b', count: totaisStatusSetor.EM_ATRASO },
              { key: 'DEVENDO_PARCELAS', label: 'Devendo >1 parc.', cor: '#ef4444', count: totaisStatusSetor.DEVENDO_PARCELAS },
              { key: 'EM_REFORMA', label: 'Reforma', cor: '#f97316', count: totaisStatusSetor.EM_REFORMA },
              { key: 'MONTANDO_INAUGURACAO', label: 'Inauguração', cor: '#8b5cf6', count: totaisStatusSetor.MONTANDO_INAUGURACAO },
              { key: 'RESERVADO', label: 'Reservado', cor: '#0284c7', count: totaisStatusSetor.RESERVADO },
            ].map((item) => {
              const ativo = filtroStatusOcupacao === item.key;
              const isWhite = item.cor === '#ffffff';
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.legendChip, ativo && styles.legendChipAtivo]}
                  onPress={() => setFiltroStatusOcupacao(ativo && item.key !== 'TODOS' ? 'TODOS' : item.key)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor: item.cor,
                        borderColor: isWhite ? '#94a3b8' : 'rgba(15, 23, 42, 0.7)',
                        borderWidth: isWhite ? 1.5 : 0.5,
                      },
                    ]}
                  />
                  <Text style={[styles.legendChipLabel, ativo && styles.legendChipLabelAtivo]}>
                    {item.label}
                  </Text>
                  <View style={[styles.legendBadge, ativo && styles.legendBadgeAtivo]}>
                    <Text style={[styles.legendBadgeText, ativo && styles.legendBadgeTextAtivo]}>
                      {item.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
    height: '100%',
    minHeight: 460,
    backgroundColor: '#0f172a', // Fundo escuro elegante para o mall
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
    touchAction: 'none',
  } as any,
  mapStage: {
    position: 'absolute',
    top: 0,
    left: 0,
    willChange: 'transform',
  } as any,
  pinsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  draftLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nativeMarkerTeardrop: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 14,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  markerInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  legendScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 4,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  legendChipAtivo: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  legendChipLabelAtivo: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  legendBadge: {
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  legendBadgeAtivo: {
    backgroundColor: '#38bdf8',
  },
  legendBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
  },
  legendBadgeTextAtivo: {
    color: '#0f172a',
  },
});

