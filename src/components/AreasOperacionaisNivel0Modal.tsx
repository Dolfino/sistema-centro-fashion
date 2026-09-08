import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';

export interface AreasOperacionaisNivel0ModalProps {
  visible: boolean;
  onClose: () => void;
  contextoSetor?: string;
}

export type CategoriaNivel0 =
  | 'ESTACIONAMENTO'
  | 'CIRCULACAO'
  | 'RAMPA'
  | 'PEDESTRES'
  | 'EXTERNA'
  | 'SUBSOLO_GERAL';

export interface SegmentoAreaOperacional {
  id: string;
  nome: string;
  categoria: CategoriaNivel0;
  status: 'VALIDADA' | 'EM_AJUSTE';
  pontos: { x: number; y: number }[]; // Coordenadas percentuais de 0 a 1
}

const CATEGORIAS_CONFIG: {
  key: CategoriaNivel0;
  label: string;
  tipoNomeSingular: string;
  botaoAdicionar: string;
  botaoSalvar: string;
}[] = [
  {
    key: 'ESTACIONAMENTO',
    label: 'Estacionamento / blocos de vagas',
    tipoNomeSingular: 'bloco',
    botaoAdicionar: '+ Adicionar bloco',
    botaoSalvar: 'Salvar bloco',
  },
  {
    key: 'CIRCULACAO',
    label: 'Circulação veicular / corredores',
    tipoNomeSingular: 'corredor',
    botaoAdicionar: '+ Adicionar corredor',
    botaoSalvar: 'Salvar bloco',
  },
  {
    key: 'RAMPA',
    label: 'Rampa / acesso veicular',
    tipoNomeSingular: 'rampa',
    botaoAdicionar: '+ Adicionar rampa',
    botaoSalvar: 'Salvar bloco',
  },
  {
    key: 'PEDESTRES',
    label: 'Acesso de pedestres',
    tipoNomeSingular: 'acesso',
    botaoAdicionar: '+ Adicionar acesso',
    botaoSalvar: 'Salvar bloco',
  },
  {
    key: 'EXTERNA',
    label: 'Área externa',
    tipoNomeSingular: 'área',
    botaoAdicionar: '+ Adicionar área externa',
    botaoSalvar: 'Salvar bloco',
  },
  {
    key: 'SUBSOLO_GERAL',
    label: 'Subsolo geral',
    tipoNomeSingular: 'segmento',
    botaoAdicionar: '+ Adicionar segmento',
    botaoSalvar: 'Salvar bloco',
  },
];

const SEGMENTOS_INICIAIS: SegmentoAreaOperacional[] = [
  // --- Estacionamento / blocos de vagas ---
  {
    id: 'B01',
    nome: 'Bloco B01',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.54 },
      { x: 0.52, y: 0.54 },
      { x: 0.52, y: 0.59 },
      { x: 0.22, y: 0.59 },
    ],
  },
  {
    id: 'B02',
    nome: 'Bloco B02',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.60 },
      { x: 0.52, y: 0.60 },
      { x: 0.52, y: 0.65 },
      { x: 0.22, y: 0.65 },
    ],
  },
  {
    id: 'B03',
    nome: 'Bloco B03',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.66 },
      { x: 0.52, y: 0.66 },
      { x: 0.52, y: 0.71 },
      { x: 0.22, y: 0.71 },
    ],
  },
  {
    id: 'B04',
    nome: 'Bloco B04',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.72 },
      { x: 0.52, y: 0.72 },
      { x: 0.52, y: 0.77 },
      { x: 0.22, y: 0.77 },
    ],
  },
  {
    id: 'B05',
    nome: 'Bloco B05',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.78 },
      { x: 0.52, y: 0.78 },
      { x: 0.52, y: 0.83 },
      { x: 0.22, y: 0.83 },
    ],
  },
  {
    id: 'B06',
    nome: 'Bloco B06',
    categoria: 'ESTACIONAMENTO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.84 },
      { x: 0.52, y: 0.84 },
      { x: 0.52, y: 0.88 },
      { x: 0.38, y: 0.89 },
      { x: 0.22, y: 0.88 },
    ],
  },

  // --- Circulação veicular / corredores ---
  {
    id: 'C01',
    nome: 'Corredor C01',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.52 },
      { x: 0.54, y: 0.52 },
      { x: 0.54, y: 0.54 },
      { x: 0.20, y: 0.54 },
    ],
  },
  {
    id: 'C02',
    nome: 'Corredor C02',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.58 },
      { x: 0.54, y: 0.58 },
      { x: 0.54, y: 0.60 },
      { x: 0.20, y: 0.60 },
    ],
  },
  {
    id: 'C03',
    nome: 'Corredor C03',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.64 },
      { x: 0.54, y: 0.64 },
      { x: 0.54, y: 0.66 },
      { x: 0.20, y: 0.66 },
    ],
  },
  {
    id: 'C04',
    nome: 'Corredor C04',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.70 },
      { x: 0.54, y: 0.70 },
      { x: 0.54, y: 0.72 },
      { x: 0.20, y: 0.72 },
    ],
  },
  {
    id: 'C05',
    nome: 'Corredor C05',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.76 },
      { x: 0.54, y: 0.76 },
      { x: 0.54, y: 0.78 },
      { x: 0.20, y: 0.78 },
    ],
  },
  {
    id: 'C06',
    nome: 'Corredor C06',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.82 },
      { x: 0.54, y: 0.82 },
      { x: 0.54, y: 0.84 },
      { x: 0.20, y: 0.84 },
    ],
  },
  {
    id: 'C07',
    nome: 'Corredor C07',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.18, y: 0.50 },
      { x: 0.21, y: 0.50 },
      { x: 0.21, y: 0.88 },
      { x: 0.18, y: 0.88 },
    ],
  },
  {
    id: 'C08',
    nome: 'Corredor C08',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.53, y: 0.50 },
      { x: 0.56, y: 0.50 },
      { x: 0.56, y: 0.88 },
      { x: 0.53, y: 0.88 },
    ],
  },
  {
    id: 'C09',
    nome: 'Corredor C09',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.35, y: 0.50 },
      { x: 0.38, y: 0.50 },
      { x: 0.38, y: 0.88 },
      { x: 0.35, y: 0.88 },
    ],
  },
  {
    id: 'C10',
    nome: 'Corredor C10',
    categoria: 'CIRCULACAO',
    status: 'VALIDADA',
    pontos: [
      { x: 0.20, y: 0.88 },
      { x: 0.54, y: 0.88 },
      { x: 0.54, y: 0.91 },
      { x: 0.20, y: 0.91 },
    ],
  },

  // --- Rampa / acesso veicular ---
  {
    id: 'R01',
    nome: 'Rampa R01',
    categoria: 'RAMPA',
    status: 'VALIDADA',
    // Delimitação da rampa no canal central superior conforme imagem de referência oficial
    pontos: [
      { x: 0.298, y: 0.171 },
      { x: 0.559, y: 0.171 },
      { x: 0.559, y: 0.213 },
      { x: 0.654, y: 0.222 },
      { x: 0.298, y: 0.222 },
      { x: 0.298, y: 0.191 },
    ],
  },
  {
    id: 'R02',
    nome: 'Rampa R02',
    categoria: 'RAMPA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.288, y: 0.145 },
      { x: 0.315, y: 0.145 },
      { x: 0.315, y: 0.195 },
      { x: 0.650, y: 0.195 },
      { x: 0.650, y: 0.230 },
      { x: 0.288, y: 0.230 },
    ],
  },

  // --- Acesso de pedestres ---
  {
    id: 'P01',
    nome: 'Acesso P01',
    categoria: 'PEDESTRES',
    status: 'VALIDADA',
    pontos: [
      { x: 0.22, y: 0.50 },
      { x: 0.27, y: 0.50 },
      { x: 0.27, y: 0.53 },
      { x: 0.22, y: 0.53 },
    ],
  },
  {
    id: 'P02',
    nome: 'Acesso P02',
    categoria: 'PEDESTRES',
    status: 'VALIDADA',
    pontos: [
      { x: 0.51, y: 0.50 },
      { x: 0.56, y: 0.50 },
      { x: 0.56, y: 0.53 },
      { x: 0.51, y: 0.53 },
    ],
  },

  // --- Área externa ---
  {
    id: 'E01',
    nome: 'Área E01 (Macro Agregada)',
    categoria: 'EXTERNA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.15, y: 0.10 },
      { x: 0.70, y: 0.10 },
      { x: 0.70, y: 0.95 },
      { x: 0.15, y: 0.95 },
    ],
  },
  {
    id: 'E02',
    nome: 'Área E02 (Lateral Azul)',
    categoria: 'EXTERNA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.14, y: 0.45 },
      { x: 0.19, y: 0.45 },
      { x: 0.19, y: 0.92 },
      { x: 0.14, y: 0.92 },
    ],
  },
  {
    id: 'E03',
    nome: 'Área E03 (Lateral Verde)',
    categoria: 'EXTERNA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.56, y: 0.45 },
      { x: 0.62, y: 0.45 },
      { x: 0.62, y: 0.92 },
      { x: 0.56, y: 0.92 },
    ],
  },
  {
    id: 'E04',
    nome: 'Área E04 (Frente)',
    categoria: 'EXTERNA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.18, y: 0.92 },
      { x: 0.58, y: 0.92 },
      { x: 0.58, y: 0.96 },
      { x: 0.18, y: 0.96 },
    ],
  },
  {
    id: 'E05',
    nome: 'Área E05 (Hotel/CDM)',
    categoria: 'EXTERNA',
    status: 'VALIDADA',
    pontos: [
      { x: 0.58, y: 0.52 },
      { x: 0.66, y: 0.52 },
      { x: 0.66, y: 0.68 },
      { x: 0.58, y: 0.68 },
    ],
  },

  // --- Subsolo geral ---
  {
    id: 'SG01',
    nome: 'Subsolo Geral',
    categoria: 'SUBSOLO_GERAL',
    status: 'VALIDADA',
    pontos: [
      { x: 0.18, y: 0.48 },
      { x: 0.58, y: 0.48 },
      { x: 0.58, y: 0.92 },
      { x: 0.18, y: 0.92 },
    ],
  },
];

export const AreasOperacionaisNivel0Modal: React.FC<AreasOperacionaisNivel0ModalProps> = ({
  visible,
  onClose,
  contextoSetor = 'Nível 0',
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaNivel0>('ESTACIONAMENTO');
  const [segmentos, setSegmentos] = useState<SegmentoAreaOperacional[]>(SEGMENTOS_INICIAIS);
  const [segmentoSelecionadoId, setSegmentoSelecionadoId] = useState<string>('B01');
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);

  const containerMapaRef = useRef<any>(null);

  if (!visible) return null;

  const catConfig =
    CATEGORIAS_CONFIG.find((c) => c.key === categoriaAtiva) || CATEGORIAS_CONFIG[0];
  const segmentosFiltrados = segmentos.filter((s) => s.categoria === categoriaAtiva);
  const segmentoAtual =
    segmentosFiltrados.find((s) => s.id === segmentoSelecionadoId) ||
    segmentosFiltrados[0] || {
      id: 'NOVO',
      nome: 'Novo Segmento',
      categoria: categoriaAtiva,
      status: 'EM_AJUSTE' as const,
      pontos: [],
    };

  // Trata a mudança de categoria
  const handleTrocarCategoria = (novaCat: CategoriaNivel0) => {
    setCategoriaAtiva(novaCat);
    const prim = segmentos.find((s) => s.categoria === novaCat);
    if (prim) {
      setSegmentoSelecionadoId(prim.id);
    }
  };

  // Clique no mapa para adicionar novo ponto
  const handleCliqueMapa = (e: any) => {
    let clientX = 0;
    let clientY = 0;
    let target = e.currentTarget || e.target;

    if (e.nativeEvent) {
      clientX = e.nativeEvent.clientX ?? e.nativeEvent.pageX ?? 0;
      clientY = e.nativeEvent.clientY ?? e.nativeEvent.pageY ?? 0;
    } else {
      clientX = e.clientX || 0;
      clientY = e.clientY || 0;
    }

    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect();
      const xPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const yPct = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      const novosPontos = [...segmentoAtual.pontos, { x: xPct, y: yPct }];
      atualizarPontosSegmentoAtual(novosPontos);
    }
  };

  const atualizarPontosSegmentoAtual = (novosPontos: { x: number; y: number }[]) => {
    setSegmentos((prev) =>
      prev.map((s) => (s.id === segmentoAtual.id ? { ...s, pontos: novosPontos } : s))
    );
  };

  // Desfazer o último ponto
  const handleDesfazerPonto = () => {
    if (segmentoAtual.pontos.length > 0) {
      const novos = segmentoAtual.pontos.slice(0, -1);
      atualizarPontosSegmentoAtual(novos);
    }
  };

  // Reiniciar todos os pontos
  const handleReiniciarPontos = () => {
    atualizarPontosSegmentoAtual([]);
  };

  // Adicionar novo bloco/segmento
  const handleAdicionarSegmento = () => {
    const totalMesmaCat = segmentosFiltrados.length + 1;
    const prefixo =
      categoriaAtiva === 'ESTACIONAMENTO'
        ? 'B'
        : categoriaAtiva === 'CIRCULACAO'
        ? 'C'
        : categoriaAtiva === 'RAMPA'
        ? 'R'
        : categoriaAtiva === 'PEDESTRES'
        ? 'P'
        : categoriaAtiva === 'EXTERNA'
        ? 'E'
        : 'SG';

    const novoId = `${prefixo}${totalMesmaCat < 10 ? '0' : ''}${totalMesmaCat}`;
    const novoNome = `${catConfig.tipoNomeSingular.toUpperCase()} ${novoId}`;

    const novoSegmento: SegmentoAreaOperacional = {
      id: novoId,
      nome: novoNome,
      categoria: categoriaAtiva,
      status: 'EM_AJUSTE',
      pontos: [],
    };

    setSegmentos((prev) => [...prev, novoSegmento]);
    setSegmentoSelecionadoId(novoId);
    mostrarToast(`Novo ${catConfig.tipoNomeSingular} criado! Clique no mapa para marcar os pontos.`);
  };

  // Salvar bloco
  const handleSalvarBloco = () => {
    setSegmentos((prev) =>
      prev.map((s) => (s.id === segmentoAtual.id ? { ...s, status: 'VALIDADA' } : s))
    );
    mostrarToast(`✓ ${segmentoAtual.nome} validado e salvo com sucesso!`);
  };

  const mostrarToast = (msg: string) => {
    setMensagemStatus(msg);
    setTimeout(() => {
      setMensagemStatus(null);
    }, 3500);
  };

  // Gerar SVG path para o polígono
  const renderSvgPolygon = () => {
    if (segmentoAtual.pontos.length < 2) return null;

    if (Platform.OS === 'web') {
      const pointsString = segmentoAtual.pontos
        .map((pt) => `${(pt.x * 100).toFixed(2)}% ${(pt.y * 100).toFixed(2)}%`)
        .join(', ');

      return (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Polígono preenchido */}
          <polygon
            points={segmentoAtual.pontos
              .map((pt) => `${pt.x * 1000},${pt.y * 1000}`)
              .join(' ')}
            fill="rgba(16, 185, 129, 0.12)"
            stroke="#1e293b"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeDasharray="none"
            transform="scale(0.001)"
          />
          {/* Linhas conectando os pontos */}
          {segmentoAtual.pontos.map((pt, idx) => {
            const prox = segmentoAtual.pontos[(idx + 1) % segmentoAtual.pontos.length];
            return (
              <line
                key={`line-${idx}`}
                x1={`${pt.x * 100}%`}
                y1={`${pt.y * 100}%`}
                x2={`${prox.x * 100}%`}
                y2={`${prox.y * 100}%`}
                stroke="#0f172a"
                strokeWidth="1.6"
              />
            );
          })}
        </svg>
      );
    }

    return null;
  };

  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.modalContainer,
          {
            width: Math.min(windowWidth * 0.96, 1200),
            height: Math.min(windowHeight * 0.94, 900),
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerCode}>S26.8-D4</Text>
            <Text style={styles.headerTitle}>Áreas operacionais do Nível 0</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* CORPO SCROLLÁVEL */}
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TOAST FLUTUANTE */}
          {mensagemStatus && (
            <View style={styles.toastCard}>
              <Text style={styles.toastText}>{mensagemStatus}</Text>
            </View>
          )}

          {/* LINHA 1: FILTROS CATEGORIA + BLOCO/SEGMENTO + ADICIONAR */}
          <View style={styles.controlsRow}>
            {/* SELECT CATEGORIA */}
            <View style={styles.controlField}>
              <Text style={styles.controlLabel}>Categoria</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={categoriaAtiva}
                  onChange={(e) => handleTrocarCategoria(e.target.value as CategoriaNivel0)}
                  style={{
                    height: 38,
                    paddingLeft: 12,
                    paddingRight: 32,
                    fontSize: 13,
                    color: '#0f172a',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {CATEGORIAS_CONFIG.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              ) : (
                <View style={styles.dummySelect}>
                  <Text style={styles.dummySelectText}>{catConfig.label}</Text>
                </View>
              )}
            </View>

            {/* SELECT BLOCO / SEGMENTO */}
            <View style={[styles.controlField, { flex: 1.4 }]}>
              <Text style={styles.controlLabel}>Bloco / segmento</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={segmentoAtual.id}
                  onChange={(e) => setSegmentoSelecionadoId(e.target.value)}
                  style={{
                    height: 38,
                    paddingLeft: 12,
                    paddingRight: 32,
                    fontSize: 13,
                    color: '#0f172a',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {segmentosFiltrados.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} — {s.status} • {s.pontos.length} pts
                    </option>
                  ))}
                </select>
              ) : (
                <View style={styles.dummySelect}>
                  <Text style={styles.dummySelectText}>
                    {segmentoAtual.nome} — {segmentoAtual.status} • {segmentoAtual.pontos.length} pts
                  </Text>
                </View>
              )}
            </View>

            {/* BOTÃO + ADICIONAR */}
            <View style={{ justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={styles.btnAddSegmento}
                onPress={handleAdicionarSegmento}
                activeOpacity={0.7}
              >
                <Text style={styles.btnAddSegmentoText}>{catConfig.botaoAdicionar}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LINHA 2: BANNER ROSA + BOTÕES DE AÇÃO */}
          <View style={styles.bannerActionsRow}>
            {/* BANNER DINÂMICO ROSA */}
            <View style={styles.statusBanner}>
              <View style={styles.statusBannerBar} />
              <Text style={styles.statusBannerText}>
                {catConfig.tipoNomeSingular.charAt(0).toUpperCase() +
                  catConfig.tipoNomeSingular.slice(1)}{' '}
                — {segmentoAtual.nome}{' '}
                {segmentoAtual.status === 'VALIDADA' ? 'já VALIDADO.' : 'em edição.'} Ajuste os
                pontos se necessário e salve novamente.
              </Text>
            </View>

            {/* BOTÕES: REINICIAR / DESFAZER / SALVAR */}
            <View style={styles.actionsBtnGroup}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleReiniciarPontos}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSecondaryText}>Reiniciar pontos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={handleDesfazerPonto}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSecondaryText}>Desfazer ponto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleSalvarBloco}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>{catConfig.botaoSalvar}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LINHA 3: CARD 'COMO DELIMITAR' */}
          <View style={styles.dicaCard}>
            <Text style={styles.dicaText}>
              <Text style={styles.dicaTextBold}>Como delimitar: </Text>
              Vagas e corredores são geometrias diferentes. Na Área externa, E01 é macro agregada e
              não concorre espacialmente; E02–E05 representam Lateral Azul, Lateral Verde, Frente e
              Hotel/CDM no Nível 0.
            </Text>
          </View>

          {/* ÁREA DO MAPA CENTRAL (NÍVEL 0) */}
          <View style={styles.mapCard}>
            <ScrollView
              style={styles.mapScrollContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              <View
                ref={containerMapaRef}
                style={styles.mapCanvasWrapper}
                {...({
                  onClick: handleCliqueMapa,
                  cursor: 'crosshair',
                } as any)}
              >
                {/* PLANTA NÍVEL 0 */}
                <Image
                  source={require('../../assets/maps/Layout Comercial CF Niveis_0.png')}
                  style={styles.mapImage as any}
                  resizeMode="contain"
                />

                {/* OVERLAY SVG COM O POLÍGONO */}
                {renderSvgPolygon()}

                {/* PONTOS / VÉRTICES SOBRE O MAPA */}
                {segmentoAtual.pontos.map((pt, idx) => (
                  <View
                    key={`vertice-${idx}`}
                    style={[
                      styles.verticeMarker,
                      {
                        left: `${pt.x * 100}%`,
                        top: `${pt.y * 100}%`,
                      },
                    ]}
                  >
                    <View style={styles.verticeMarkerDot} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#475569',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 12,
  },
  toastCard: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  controlField: {
    flex: 1,
    minWidth: 200,
    gap: 6,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  dummySelect: {
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  dummySelectText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  btnAddSegmento: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAddSegmentoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  bannerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBanner: {
    flex: 1,
    minWidth: 320,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  statusBannerBar: {
    width: 4,
    height: '100%',
    backgroundColor: '#ec4899',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  statusBannerText: {
    color: '#be185d',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    lineHeight: 18,
  },
  actionsBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnSecondary: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  btnPrimary: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  dicaCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dicaText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  dicaTextBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    height: 580,
  },
  mapScrollContainer: {
    flex: 1,
    width: '100%',
  },
  mapCanvasWrapper: {
    width: '100%',
    aspectRatio: 2339 / 3307,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  verticeMarker: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  verticeMarkerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
export default AreasOperacionaisNivel0Modal;
