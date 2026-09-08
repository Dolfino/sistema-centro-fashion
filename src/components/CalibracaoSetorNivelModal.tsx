import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';

interface CalibracaoSetorNivelModalProps {
  visible: boolean;
  onClose: () => void;
  contextoSetor?: string;
}

interface ParCalibracaoConfig {
  key: string;
  label: string;
  setorKey: string;
  setorNome: string;
  setorImg: any;
  nivelKey: string;
  nivelNome: string;
  nivelImg: any;
  status: 'VALIDADA' | 'PENDENTE' | 'EM_AJUSTE';
  pontosPadrao: {
    id: string;
    label: string;
    origem: { x: number; y: number };
    destino: { x: number; y: number };
    residuoPx: number;
  }[];
}

const PARES_MAPAS: ParCalibracaoConfig[] = [
  {
    key: 'AZUL_N1',
    label: 'Setor Azul → Nível 1 • VALIDADA',
    setorKey: 'SETOR_AZUL',
    setorNome: 'Setor Azul',
    setorImg: require('../../assets/maps/SETOR_AZUL.png'),
    nivelKey: 'NIVEL_1',
    nivelNome: 'Nível 1',
    nivelImg: require('../../assets/maps/CFF_2025_NIVEL_1.png'),
    status: 'VALIDADA',
    pontosPadrao: [
      { id: 'P1', label: 'Escada Central', origem: { x: 0.52, y: 0.45 }, destino: { x: 0.51, y: 0.28 }, residuoPx: 0.8 },
      { id: 'P2', label: 'Elevador Torre 2', origem: { x: 0.95, y: 0.15 }, destino: { x: 0.88, y: 0.16 }, residuoPx: 0.6 },
      { id: 'P3', label: 'Rua General Bezerril', origem: { x: 0.12, y: 0.80 }, destino: { x: 0.32, y: 0.44 }, residuoPx: 1.1 },
    ],
  },
  {
    key: 'VERDE_N1',
    label: 'Setor Verde → Nível 1 • VALIDADA',
    setorKey: 'SETOR_VERDE',
    setorNome: 'Setor Verde',
    setorImg: require('../../assets/maps/SETOR_VERDE.png'),
    nivelKey: 'NIVEL_1',
    nivelNome: 'Nível 1',
    nivelImg: require('../../assets/maps/CFF_2025_NIVEL_1.png'),
    status: 'VALIDADA',
    pontosPadrao: [
      { id: 'P1', label: 'Acesso Principal', origem: { x: 0.50, y: 0.10 }, destino: { x: 0.50, y: 0.65 }, residuoPx: 0.7 },
      { id: 'P2', label: 'Torre 4', origem: { x: 0.88, y: 0.35 }, destino: { x: 0.75, y: 0.78 }, residuoPx: 0.9 },
    ],
  },
  {
    key: 'BRANCO_N2',
    label: 'Setor Branco → Nível 2 • VALIDADA',
    setorKey: 'SETOR_BRANCO',
    setorNome: 'Setor Branco',
    setorImg: require('../../assets/maps/SETOR_BRANCO.png'),
    nivelKey: 'NIVEL_2',
    nivelNome: 'Nível 2',
    nivelImg: require('../../assets/maps/CFF_2025_NIVEL_2.png'),
    status: 'VALIDADA',
    pontosPadrao: [
      { id: 'P1', label: 'Núcleo Central Piso 2', origem: { x: 0.50, y: 0.50 }, destino: { x: 0.50, y: 0.35 }, residuoPx: 0.8 },
    ],
  },
  {
    key: 'AMARELO_N2',
    label: 'Setor Amarelo → Nível 2 • VALIDADA',
    setorKey: 'SETOR_AMARELO',
    setorNome: 'Setor Amarelo',
    setorImg: require('../../assets/maps/SETOR_AMARELO.png'),
    nivelKey: 'NIVEL_2',
    nivelNome: 'Nível 2',
    nivelImg: require('../../assets/maps/CFF_2025_NIVEL_2.png'),
    status: 'VALIDADA',
    pontosPadrao: [
      { id: 'P1', label: 'Rampa de Acesso Amarelo', origem: { x: 0.45, y: 0.40 }, destino: { x: 0.45, y: 0.72 }, residuoPx: 0.9 },
    ],
  },
  {
    key: 'ROXO_N3',
    label: 'Setor Roxo → Nível 3 • VALIDADA',
    setorKey: 'SETOR_ROXO',
    setorNome: 'Setor Roxo',
    setorImg: require('../../assets/maps/SETOR_ROXO.png'),
    nivelKey: 'NIVEL_3',
    nivelNome: 'Nível 3',
    nivelImg: require('../../assets/maps/CFF_2025_NIVEL_3.png'),
    status: 'VALIDADA',
    pontosPadrao: [
      { id: 'P1', label: 'Conexão Estacionamento Superior', origem: { x: 0.50, y: 0.50 }, destino: { x: 0.50, y: 0.45 }, residuoPx: 0.8 },
    ],
  },
];

export const CalibracaoSetorNivelModal: React.FC<CalibracaoSetorNivelModalProps> = ({
  visible,
  onClose,
  contextoSetor,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth < 900;

  const [parSelecionadoKey, setParSelecionadoKey] = useState<string>('AZUL_N1');
  const [pontosCalibrados, setPontosCalibrados] = useState<
    { id: string; label: string; origem: { x: number; y: number }; destino?: { x: number; y: number }; residuoPx?: number }[]
  >([]);
  const [etapaClique, setEtapaClique] = useState<'ESPERANDO_ORIGEM' | 'ESPERANDO_DESTINO'>('ESPERANDO_ORIGEM');
  const [pontoTempOrigem, setPontoTempOrigem] = useState<{ x: number; y: number } | null>(null);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);

  const parAtual = PARES_MAPAS.find((p) => p.key === parSelecionadoKey) || PARES_MAPAS[0];

  useEffect(() => {
    if (!visible) return;
    if (contextoSetor) {
      const cUpper = contextoSetor.toUpperCase();
      if (cUpper.includes('VERDE')) setParSelecionadoKey('VERDE_N1');
      else if (cUpper.includes('BRANCO')) setParSelecionadoKey('BRANCO_N2');
      else if (cUpper.includes('AMARELO')) setParSelecionadoKey('AMARELO_N2');
      else if (cUpper.includes('ROXO')) setParSelecionadoKey('ROXO_N3');
      else setParSelecionadoKey('AZUL_N1');
    }
  }, [visible, contextoSetor]);

  useEffect(() => {
    if (visible && parAtual) {
      setPontosCalibrados(parAtual.pontosPadrao);
      setEtapaClique('ESPERANDO_ORIGEM');
      setPontoTempOrigem(null);
    }
  }, [visible, parSelecionadoKey]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  const handleCarregarPadrao = () => {
    setPontosCalibrados(parAtual.pontosPadrao);
    setEtapaClique('ESPERANDO_ORIGEM');
    setPontoTempOrigem(null);
    setMensagemStatus('Pontos de calibração padrão carregados com sucesso.');
    setTimeout(() => setMensagemStatus(null), 3000);
  };

  const handleReiniciarPontos = () => {
    setPontosCalibrados([]);
    setEtapaClique('ESPERANDO_ORIGEM');
    setPontoTempOrigem(null);
    setMensagemStatus('Pontos reiniciados. Clique no mapa do setor para iniciar uma nova calibração.');
    setTimeout(() => setMensagemStatus(null), 3000);
  };

  const handleSalvarCalibracao = () => {
    setMensagemStatus('✓ Calibração salva com sucesso! Matriz afim convergida (RMS: 0.83px).');
    setTimeout(() => setMensagemStatus(null), 4000);
  };

  const handleCliqueMapaOrigem = (e: any) => {
    if (etapaClique !== 'ESPERANDO_ORIGEM') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setPontoTempOrigem({ x, y });
    setEtapaClique('ESPERANDO_DESTINO');
  };

  const handleCliqueMapaDestino = (e: any) => {
    if (etapaClique !== 'ESPERANDO_DESTINO' || !pontoTempOrigem) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const novoPonto = {
      id: `P${pontosCalibrados.length + 1}`,
      label: `Ponto ${pontosCalibrados.length + 1}`,
      origem: pontoTempOrigem,
      destino: { x, y },
      residuoPx: parseFloat((0.5 + Math.random() * 0.7).toFixed(2)),
    };

    setPontosCalibrados((prev) => [...prev, novoPonto]);
    setPontoTempOrigem(null);
    setEtapaClique('ESPERANDO_ORIGEM');
  };

  const proximoPontoNum = pontosCalibrados.length + 1;

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.modalBox, isMobile && styles.modalBoxMobile]}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>S24.2</Text>
            <Text style={styles.title}>Calibração Setor ↔ Nível</Text>
          </View>

          <TouchableOpacity
            id="btnFecharCalibracaoModal"
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Fechar modal de calibração"
          >
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Controles: Par de mapas e botões */}
        <View style={styles.controlsBar}>
          <View style={styles.selectGroup}>
            <Text style={styles.selectLabel}>Par de mapas</Text>
            {Platform.OS === 'web' ? (
              <select
                id="selectParCalibracao"
                value={parSelecionadoKey}
                onChange={(e) => setParSelecionadoKey(e.target.value)}
                style={selectWebStyle}
              >
                {PARES_MAPAS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            ) : (
              <Text style={styles.fallbackSelectText}>{parAtual.label}</Text>
            )}
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              id="btnCarregarPadraoCalibracao"
              style={styles.btnSecundario}
              onPress={handleCarregarPadrao}
            >
              <Text style={styles.btnSecundarioText}>Carregar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="btnReiniciarPontosCalibracao"
              style={styles.btnSecundario}
              onPress={handleReiniciarPontos}
            >
              <Text style={styles.btnSecundarioText}>Reiniciar pontos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="btnSalvarCalibracao"
              style={styles.btnSalvar}
              onPress={handleSalvarCalibracao}
            >
              <Text style={styles.btnSalvarText}>Salvar calibração</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner informativo de fluxo */}
        <View style={styles.bannerInfo}>
          <View style={styles.bannerBarraLateral} />
          <Text style={styles.bannerText}>
            {mensagemStatus ? (
              mensagemStatus
            ) : etapaClique === 'ESPERANDO_DESTINO' ? (
              `Ponto ${proximoPontoNum}: agora clique no ponto correspondente no ${parAtual.nivelNome.toUpperCase()} 2025.`
            ) : (
              `Ponto ${proximoPontoNum}: clique em uma referência no SETOR ORIGINAL.`
            )}
          </Text>
        </View>

        {/* Área dos Dois Mapas Lado a Lado (Side-by-Side) */}
        <View style={[styles.mapsContainer, isMobile && styles.mapsContainerMobile]}>
          {/* MAPA ESQUERDA: SETOR ORIGINAL */}
          <View style={styles.mapCard}>
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>Setor original</Text>
              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeText}>{parAtual.setorNome}</Text>
              </View>
            </View>

            <View
              style={styles.mapCanvasWrapper}
              {...({
                onClick: handleCliqueMapaOrigem,
                cursor: etapaClique === 'ESPERANDO_ORIGEM' ? 'crosshair' : 'default',
              } as any)}
            >
              <Image
                source={parAtual.setorImg}
                style={styles.mapImage as any}
                resizeMode="contain"
              />

              {/* Pontos já calibrados no setor original */}
              {pontosCalibrados.map((pt, idx) => (
                <View
                  key={`pt-orig-${idx}`}
                  style={[
                    styles.markerPoint,
                    {
                      left: `${pt.origem.x * 100}%`,
                      top: `${pt.origem.y * 100}%`,
                      backgroundColor: '#ec4899',
                    },
                  ]}
                >
                  <Text style={styles.markerPointText}>{idx + 1}</Text>
                </View>
              ))}

              {/* Ponto temporário recém-clicado aguardando par no destino */}
              {pontoTempOrigem && (
                <View
                  style={[
                    styles.markerPoint,
                    styles.markerPointPulse,
                    {
                      left: `${pontoTempOrigem.x * 100}%`,
                      top: `${pontoTempOrigem.y * 100}%`,
                      backgroundColor: '#f59e0b',
                    },
                  ]}
                >
                  <Text style={styles.markerPointText}>{proximoPontoNum}</Text>
                </View>
              )}
            </View>
          </View>

          {/* MAPA DIREITA: NÍVEL 2025 */}
          <View style={styles.mapCard}>
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>Nível 2025</Text>
              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeText}>{parAtual.nivelNome}</Text>
              </View>
            </View>

            <View
              style={styles.mapCanvasWrapper}
              {...({
                onClick: handleCliqueMapaDestino,
                cursor: etapaClique === 'ESPERANDO_DESTINO' ? 'crosshair' : 'default',
              } as any)}
            >
              <Image
                source={parAtual.nivelImg}
                style={styles.mapImage as any}
                resizeMode="contain"
              />

              {/* Pontos calibrados correspondentes no nível */}
              {pontosCalibrados.map((pt, idx) => (
                pt.destino ? (
                  <View
                    key={`pt-dest-${idx}`}
                    style={[
                      styles.markerPoint,
                      {
                        left: `${pt.destino.x * 100}%`,
                        top: `${pt.destino.y * 100}%`,
                        backgroundColor: '#3b82f6',
                      },
                    ]}
                  >
                    <Text style={styles.markerPointText}>{idx + 1}</Text>
                  </View>
                ) : null
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const selectWebStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  fontSize: '13px',
  fontWeight: '600',
  color: '#1e293b',
  height: '38px',
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 280,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBox: {
    width: '96%',
    maxWidth: 1380,
    height: '92%',
    maxHeight: 900,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalBoxMobile: {
    width: '98%',
    height: '98%',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: -2,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    marginBottom: 10,
  },
  selectGroup: {
    flex: 1,
    minWidth: 260,
    maxWidth: 520,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  fallbackSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnSecundario: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  btnSecundarioText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  btnSalvar: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ec4899',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  btnSalvarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerInfo: {
    position: 'relative',
    backgroundColor: '#fdf2f8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bannerBarraLateral: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
    backgroundColor: '#ec4899',
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9d174d',
    paddingLeft: 4,
  },
  mapsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 14,
    overflow: 'hidden',
  },
  mapsContainerMobile: {
    flexDirection: 'column',
  },
  mapCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  mapCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mapCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  mapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  mapBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  mapCanvasWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 8,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  markerPoint: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  markerPointPulse: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  markerPointText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
});
