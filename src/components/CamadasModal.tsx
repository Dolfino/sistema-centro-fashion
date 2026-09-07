import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { ChromeColorPicker } from './ChromeColorPicker';
import {
  CartografiaService,
  CORES_PADRAO_TIPOS_REFERENCIA,
  NOMES_PADRAO_TIPOS_REFERENCIA,
} from '../services/cartografiaService';

export interface PresetCorporativoItem {
  id: string;
  nome: string;
  camadasInfo: string;
  autor: string;
  badges: string[];
  isPadrao: boolean;
  camadas?: {
    sinalizacoes: boolean;
    referencias: boolean;
    cruzamentos: boolean;
    lojas: boolean;
  };
  filtros?: {
    tipo: string;
    finalidade: string;
    responsavel: string;
    status: string;
    conservacao: string;
    condicao: string;
  };
  colorirPor?: string;
}

export interface PresetPessoalItem {
  id: string;
  nome: string;
  dataCriacao: string;
}

interface CamadasModalProps {
  visible: boolean;
  onClose: () => void;
  showSinalizacoes: boolean;
  onToggleSinalizacoes: (enabled: boolean) => void;
  totalPinsCount: number;
  showReferencias?: boolean;
  onToggleReferencias?: (enabled: boolean) => void;
  totalReferenciasCount?: number;
  showCruzamentos?: boolean;
  onToggleCruzamentos?: (enabled: boolean) => void;
  totalCruzamentosCount?: number;
  showLojas?: boolean;
  onToggleLojas?: (enabled: boolean) => void;
  totalLojasCount?: number;
  initialShowCentral?: boolean;
  campanhaAtivaId?: string | null;
  onSelectCampanha?: (campanhaId: string | null) => void;
  onFilterChange?: (filters: {
    query: string;
    tipo: string;
    finalidade: string;
    responsavel: string;
    status: string;
    conservacao: string;
    condicao: string;
  }) => void;
  corReferencia?: string;
  onUpdateCorReferencia?: (cor: string) => void;
  selectedMapKey?: string;
  coresReferencias?: Record<string, string>;
  onUpdateCoresReferencias?: (cores: Record<string, string>) => void;
}

const PRESETS_CORPORATIVOS_INICIAIS: PresetCorporativoItem[] = [
  {
    id: 'corp-visao-geral',
    nome: 'Visão Geral Mall',
    camadasInfo: '3/4 camadas • 0 filtros • Tipo • Todos • davidsilva.centrofashion@gmail.com',
    autor: 'davidsilva.centrofashion@gmail.com',
    badges: ['Corporativo', 'Todos', 'Padrão'],
    isPadrao: true,
  },
  {
    id: 'corp-global-teste-a',
    nome: 'GLOBAL TESTE A',
    camadasInfo: '3/4 camadas • 0 filtros • Tipo • Todos • davidsilva.centrofashion@gmail.com',
    autor: 'davidsilva.centrofashion@gmail.com',
    badges: ['Corporativo', 'Todos'],
    isPadrao: false,
  },
  {
    id: 'corp-global-teste-b',
    nome: 'GLOBAL TESTE B',
    camadasInfo: '3/4 camadas • 0 filtros • Tipo • Todos • davidsilva.centrofashion@gmail.com',
    autor: 'davidsilva.centrofashion@gmail.com',
    badges: ['Corporativo', 'Todos'],
    isPadrao: false,
  },
];

const LEGENDA_SINALIZACOES_PADRAO = [
  { id: 'cat-placa-info', nome: 'Placa informativa', cor: '#D97706', count: 5 },
  { id: 'cat-adesivo-piso', nome: 'Adesivo de piso', cor: '#D97706', count: 3 },
  { id: 'cat-placa-servico', nome: 'Placa de serviço', cor: '#0284C7', count: 2 },
  { id: 'cat-adesivo-parede', nome: 'Adesivo de parede', cor: '#EA580C', count: 1 },
  { id: 'cat-painel', nome: 'Painel', cor: '#9333EA', count: 1 },
  { id: 'cat-placa-rua', nome: 'Placa de rua', cor: '#2563EB', count: 1 },
];

export const CamadasModal: React.FC<CamadasModalProps> = ({
  visible,
  onClose,
  showSinalizacoes,
  onToggleSinalizacoes,
  totalPinsCount = 17,
  showReferencias = true,
  onToggleReferencias,
  totalReferenciasCount = 15,
  showCruzamentos = true,
  onToggleCruzamentos,
  totalCruzamentosCount = 13,
  showLojas = true,
  onToggleLojas,
  totalLojasCount = 1352,
  initialShowCentral = false,
  campanhaAtivaId = null,
  onSelectCampanha,
  onFilterChange,
  corReferencia = '#38bdf8',
  onUpdateCorReferencia,
  selectedMapKey,
  coresReferencias,
  onUpdateCoresReferencias,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [showCentralCamadas, setShowCentralCamadas] = useState<boolean>(initialShowCentral);

  // Estados locais para visibilidade caso não fornecido por callback
  const [internalRef, setInternalRef] = useState<boolean>(showReferencias);
  const [internalCrz, setInternalCrz] = useState<boolean>(showCruzamentos);
  const [internalLoj, setInternalLoj] = useState<boolean>(showLojas);

  // Filtros
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [filtroFinalidade, setFiltroFinalidade] = useState<string>('Todas');
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('Todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [filtroConservacao, setFiltroConservacao] = useState<string>('Todos');
  const [filtroCondicao, setFiltroCondicao] = useState<string>('Todos');

  // Aparência e Cores
  const [colorirPor, setColorirPor] = useState<string>('Tipo');
  const [legendaCores, setLegendaCores] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('sinalizacao_mall_legenda_cores');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return LEGENDA_SINALIZACOES_PADRAO;
  });
  const [colorPickerTargetId, setColorPickerTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sinalizacao_mall_legenda_cores', JSON.stringify(legendaCores));
    }
  }, [legendaCores]);

  const [corReferenciaLocal, setCorReferenciaLocal] = useState<string>(() => {
    if (corReferencia) return corReferencia;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('sinalizacao_mall_cor_referencia') || '#38bdf8';
    }
    return '#38bdf8';
  });

  useEffect(() => {
    if (corReferencia) {
      setCorReferenciaLocal(corReferencia);
    }
  }, [corReferencia]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sinalizacao_mall_cor_referencia', corReferenciaLocal);
    }
  }, [corReferenciaLocal]);

  // Cores personalizadas por Tipo de Referência Cartográfica Oficial
  const [coresReferenciasLocal, setCoresReferenciasLocal] = useState<Record<string, string>>(() => {
    if (coresReferencias && Object.keys(coresReferencias).length > 0) return coresReferencias;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('sinalizacao_mall_cores_tipos_referencia');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return CORES_PADRAO_TIPOS_REFERENCIA;
  });

  const [mostrarTodosTiposRef, setMostrarTodosTiposRef] = useState<boolean>(false);

  useEffect(() => {
    if (coresReferencias && Object.keys(coresReferencias).length > 0) {
      setCoresReferenciasLocal(coresReferencias);
    }
  }, [coresReferencias]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(
        'sinalizacao_mall_cores_tipos_referencia',
        JSON.stringify(coresReferenciasLocal)
      );
    }
  }, [coresReferenciasLocal]);

  const handleMudarCorTipoReferencia = (tipo: string, novaCor: string) => {
    const atualizado = {
      ...coresReferenciasLocal,
      [tipo]: novaCor,
    };
    setCoresReferenciasLocal(atualizado);
    if (onUpdateCoresReferencias) {
      onUpdateCoresReferencias(atualizado);
    }
  };

  // Presets Corporativos e Pessoais
  const [presetsCorp, setPresetsCorp] = useState<PresetCorporativoItem[]>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('sinalizacao_mall_presets_corporativos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return PRESETS_CORPORATIVOS_INICIAIS;
  });
  const [nomeNovoPresetCorp, setNomeNovoPresetCorp] = useState<string>('');
  const [escopoNovoPresetCorp, setEscopoNovoPresetCorp] = useState<string>('Todos os usuários');

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sinalizacao_mall_presets_corporativos', JSON.stringify(presetsCorp));
    }
  }, [presetsCorp]);

  const [minhasVisoes, setMinhasVisoes] = useState<PresetPessoalItem[]>([]);
  const [nomeMinhaVisao, setNomeMinhaVisao] = useState<string>('');

  useEffect(() => {
    if (visible && initialShowCentral) {
      setShowCentralCamadas(true);
    }
  }, [visible, initialShowCentral]);

  useEffect(() => {
    setInternalRef(showReferencias);
    setInternalCrz(showCruzamentos);
    setInternalLoj(showLojas);
  }, [showReferencias, showCruzamentos, showLojas]);

  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;
  const lastFiltersRef = useRef<string>('');

  useEffect(() => {
    const currentKey = `${searchQuery}|${filtroTipo}|${filtroFinalidade}|${filtroResponsavel}|${filtroStatus}|${filtroConservacao}|${filtroCondicao}`;
    if (lastFiltersRef.current !== currentKey) {
      lastFiltersRef.current = currentKey;
      if (onFilterChangeRef.current) {
        onFilterChangeRef.current({
          query: searchQuery,
          tipo: filtroTipo,
          finalidade: filtroFinalidade,
          responsavel: filtroResponsavel,
          status: filtroStatus,
          conservacao: filtroConservacao,
          condicao: filtroCondicao,
        });
      }
    }
  }, [
    searchQuery,
    filtroTipo,
    filtroFinalidade,
    filtroResponsavel,
    filtroStatus,
    filtroConservacao,
    filtroCondicao,
  ]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCentralCamadas) {
          setShowCentralCamadas(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, showCentralCamadas, onClose]);

  const toggleRef = (val: boolean) => {
    setInternalRef(val);
    if (onToggleReferencias) onToggleReferencias(val);
  };

  const toggleCrz = (val: boolean) => {
    setInternalCrz(val);
    if (onToggleCruzamentos) onToggleCruzamentos(val);
  };

  const toggleLoj = (val: boolean) => {
    setInternalLoj(val);
    if (onToggleLojas) onToggleLojas(val);
  };

  const handleLimparFiltros = () => {
    setSearchQuery('');
    setFiltroTipo('Todos');
    setFiltroFinalidade('Todas');
    setFiltroResponsavel('Todos');
    setFiltroStatus('Todos');
    setFiltroConservacao('Todos');
    setFiltroCondicao('Todas');
    if (onFilterChange) {
      onFilterChange({
        query: '',
        tipo: 'Todos',
        finalidade: 'Todas',
        responsavel: 'Todos',
        status: 'Todos',
        conservacao: 'Todos',
        condicao: 'Todas',
      });
    }
  };

  const handleRestaurarPadraoGeral = () => {
    onToggleSinalizacoes(true);
    toggleRef(true);
    toggleCrz(true);
    toggleLoj(true);
    setColorirPor('Tipo');
    setLegendaCores(LEGENDA_SINALIZACOES_PADRAO);
    handleLimparFiltros();
  };

  const handlePublicarPresetCorp = () => {
    if (!nomeNovoPresetCorp.trim()) return;
    const novo: PresetCorporativoItem = {
      id: `corp-${Date.now()}`,
      nome: nomeNovoPresetCorp.trim(),
      camadasInfo: `${camadasAtivasCount}/4 camadas • 0 filtros • ${colorirPor} • ${escopoNovoPresetCorp} • davidsilva.centrofashion@gmail.com`,
      autor: 'davidsilva.centrofashion@gmail.com',
      badges: ['Corporativo', escopoNovoPresetCorp === 'Todos os usuários' ? 'Todos' : escopoNovoPresetCorp],
      isPadrao: false,
      camadas: {
        sinalizacoes: showSinalizacoes,
        referencias: internalRef,
        cruzamentos: internalCrz,
        lojas: internalLoj,
      },
      filtros: {
        tipo: filtroTipo,
        finalidade: filtroFinalidade,
        responsavel: filtroResponsavel,
        status: filtroStatus,
        conservacao: filtroConservacao,
        condicao: filtroCondicao,
      },
      colorirPor,
    };
    setPresetsCorp([novo, ...presetsCorp]);
    setNomeNovoPresetCorp('');
  };

  const handleAtualizarPresetCorp = (id: string) => {
    setPresetsCorp(
      presetsCorp.map((p) => {
        if (p.id === id) {
          const escopoBadge = p.badges.find((b) => b !== 'Corporativo' && b !== 'Padrão') || 'Todos';
          return {
            ...p,
            camadasInfo: `${camadasAtivasCount}/4 camadas • 0 filtros • ${colorirPor} • ${escopoBadge} • davidsilva.centrofashion@gmail.com`,
            camadas: {
              sinalizacoes: showSinalizacoes,
              referencias: internalRef,
              cruzamentos: internalCrz,
              lojas: internalLoj,
            },
            filtros: {
              tipo: filtroTipo,
              finalidade: filtroFinalidade,
              responsavel: filtroResponsavel,
              status: filtroStatus,
              conservacao: filtroConservacao,
              condicao: filtroCondicao,
            },
            colorirPor,
          };
        }
        return p;
      })
    );
  };

  const handleAplicarPresetCorp = (preset: PresetCorporativoItem) => {
    if (preset.camadas) {
      onToggleSinalizacoes(preset.camadas.sinalizacoes);
      toggleRef(preset.camadas.referencias);
      toggleCrz(preset.camadas.cruzamentos);
      toggleLoj(preset.camadas.lojas);
    } else {
      onToggleSinalizacoes(true);
      toggleRef(true);
      toggleCrz(true);
      toggleLoj(false);
    }
    if (preset.colorirPor) {
      setColorirPor(preset.colorirPor);
    }
    setShowCentralCamadas(false);
  };

  const handleSalvarMinhaVisao = () => {
    if (!nomeMinhaVisao.trim()) return;
    const nova: PresetPessoalItem = {
      id: `vis-${Date.now()}`,
      nome: nomeMinhaVisao.trim(),
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };
    setMinhasVisoes([nova, ...minhasVisoes]);
    setNomeMinhaVisao('');
  };

  const handleRemoverMinhaVisao = (id: string) => {
    setMinhasVisoes(minhasVisoes.filter((v) => v.id !== id));
  };

  const handleExcluirCorp = (id: string) => {
    setPresetsCorp(presetsCorp.filter((p) => p.id !== id));
  };

  const handleTogglePadraoCorp = (id: string) => {
    setPresetsCorp(
      presetsCorp.map((p) => {
        if (p.id === id) {
          const novoStatus = !p.isPadrao;
          const badges = novoStatus
            ? [...p.badges.filter((b) => b !== 'Padrão'), 'Padrão']
            : p.badges.filter((b) => b !== 'Padrão');
          return { ...p, isPadrao: novoStatus, badges };
        }
        return p;
      })
    );
  };

  if (!visible) return null;

  const camadasAtivasCount = [showSinalizacoes, internalRef, internalCrz, internalLoj].filter(Boolean).length;

  const selectWebStyle: any = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DFE2EA',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#1E293B',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (showCentralCamadas) {
            setShowCentralCamadas(false);
          } else {
            onClose();
          }
        }}
      >
        <View id="camadasBackdrop" style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* ========================================================
          CARD COMPACTO DE CAMADAS (Imagem 1)
          ======================================================== */}
      {!showCentralCamadas ? (
        <View id="camadas" style={[styles.compactCard, isMobile && styles.compactCardMobile]}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactTitle}>Camadas</Text>
            <TouchableOpacity
              id="fecharCamadasBtn"
              style={styles.compactCloseBtn}
              onPress={onClose}
              aria-label="Fechar camadas"
            >
              <Text style={styles.compactCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.compactList}>
            {/* Camada 1: Sinalizações */}
            <TouchableOpacity
              id="toggleSinalizacoesCompact"
              style={styles.compactRow}
              activeOpacity={0.8}
              onPress={() => onToggleSinalizacoes(!showSinalizacoes)}
            >
              <View style={[styles.checkboxRosa, showSinalizacoes && styles.checkboxRosaChecked]}>
                {showSinalizacoes && <Text style={styles.checkmarkWhite}>✓</Text>}
              </View>
              <Text style={styles.compactLabel}>Sinalizações</Text>
              <View style={styles.compactBadgePill}>
                <Text style={styles.compactBadgeText}>{totalPinsCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Camada 2: Referências */}
            <TouchableOpacity
              id="toggleReferenciasCompact"
              style={styles.compactRow}
              activeOpacity={0.8}
              onPress={() => toggleRef(!internalRef)}
            >
              <View style={[styles.checkboxRosa, internalRef && styles.checkboxRosaChecked]}>
                {internalRef && <Text style={styles.checkmarkWhite}>✓</Text>}
              </View>
              <Text style={styles.compactLabel}>Referências</Text>
              <View style={styles.compactBadgePill}>
                <Text style={styles.compactBadgeText}>{totalReferenciasCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Camada 3: Cruzamentos */}
            <TouchableOpacity
              id="toggleCruzamentosCompact"
              style={styles.compactRow}
              activeOpacity={0.8}
              onPress={() => toggleCrz(!internalCrz)}
            >
              <View style={[styles.checkboxRosa, internalCrz && styles.checkboxRosaChecked]}>
                {internalCrz && <Text style={styles.checkmarkWhite}>✓</Text>}
              </View>
              <Text style={styles.compactLabel}>Cruzamentos</Text>
              <View style={styles.compactBadgePill}>
                <Text style={styles.compactBadgeText}>{totalCruzamentosCount}</Text>
              </View>
            </TouchableOpacity>

            {/* Camada 4: Lojas */}
            <TouchableOpacity
              id="toggleLojasCompact"
              style={styles.compactRow}
              activeOpacity={0.8}
              onPress={() => toggleLoj(!internalLoj)}
            >
              <View style={[styles.checkboxRosa, internalLoj && styles.checkboxRosaChecked]}>
                {internalLoj && <Text style={styles.checkmarkWhite}>✓</Text>}
              </View>
              <Text style={styles.compactLabel}>Lojas</Text>
              <View style={styles.compactBadgePill}>
                <Text style={styles.compactBadgeText}>{totalLojasCount}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.compactFooter}>
            <TouchableOpacity
              id="gerenciarCamadasBtn"
              style={styles.btnGerenciarCamadas}
              onPress={() => setShowCentralCamadas(true)}
            >
              <Text style={styles.btnGerenciarCamadasText}>Gerenciar camadas</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ========================================================
           MODAL COMPLETO: CENTRAL DE CAMADAS (Imagens 2, 3 e 4)
           ======================================================== */
        <View id="centralCamadasS261" style={[styles.centralModalBox, isMobile && styles.centralModalBoxMobile]}>
          {/* Header Superior Fixo */}
          <View style={styles.centralHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.centralEyebrow}>S26.6</Text>
              <Text style={styles.centralTitle}>Central de Camadas</Text>
              <Text style={styles.centralSubtitle}>
                Visibilidade, pesquisa, filtros, simbologia e presets
              </Text>
            </View>
            <TouchableOpacity
              id="fecharCentralCamadasBtn"
              style={styles.centralCloseBtn}
              onPress={() => setShowCentralCamadas(false)}
            >
              <Text style={styles.centralCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Corpo com Scroll Vertical */}
          <ScrollView
            style={styles.centralScrollBody}
            contentContainerStyle={styles.centralScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* ==========================================
                CARD 1: VISIBILIDADE (Imagem 2)
                ========================================== */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionMainTitle}>Visibilidade</Text>
                  <Text style={styles.sectionSubtitle}>Escolha o que deve aparecer no mapa.</Text>
                </View>
                <View style={styles.ativasBadgePill}>
                  <Text style={styles.ativasBadgeText}>{camadasAtivasCount} ativas</Text>
                </View>
              </View>

              <View style={styles.visibilidadeList}>
                {/* Linha 1: Sinalizações */}
                <TouchableOpacity
                  style={styles.visibilidadeRow}
                  activeOpacity={0.7}
                  onPress={() => onToggleSinalizacoes(!showSinalizacoes)}
                >
                  <View style={[styles.checkboxRosa, showSinalizacoes && styles.checkboxRosaChecked]}>
                    {showSinalizacoes && <Text style={styles.checkmarkWhite}>✓</Text>}
                  </View>
                  <View style={[styles.dotSinalizacao, { backgroundColor: '#E11D48' }]} />
                  <View style={styles.visibilidadeTextCol}>
                    <Text style={styles.visibilidadeNome}>Sinalizações</Text>
                    <Text style={styles.visibilidadeDesc}>Ativos SIG posicionados no mapa</Text>
                  </View>
                  <View style={styles.compactBadgePill}>
                    <Text style={styles.compactBadgeText}>{totalPinsCount}</Text>
                  </View>
                </TouchableOpacity>

                {/* Linha 2: Referências */}
                <TouchableOpacity
                  style={styles.visibilidadeRow}
                  activeOpacity={0.7}
                  onPress={() => toggleRef(!internalRef)}
                >
                  <View style={[styles.checkboxRosa, internalRef && styles.checkboxRosaChecked]}>
                    {internalRef && <Text style={styles.checkmarkWhite}>✓</Text>}
                  </View>
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: '#10144d',
                      borderColor: '#ffffff',
                      borderWidth: 1.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 2.5,
                        backgroundColor: corReferenciaLocal,
                      }}
                    />
                  </View>
                  <View style={styles.visibilidadeTextCol}>
                    <Text style={styles.visibilidadeNome}>Referências</Text>
                    <Text style={styles.visibilidadeDesc}>Pontos de referência cartográfica</Text>
                  </View>
                  <View style={styles.compactBadgePill}>
                    <Text style={styles.compactBadgeText}>{totalReferenciasCount}</Text>
                  </View>
                </TouchableOpacity>

                {/* Linha 3: Cruzamentos */}
                <TouchableOpacity
                  style={styles.visibilidadeRow}
                  activeOpacity={0.7}
                  onPress={() => toggleCrz(!internalCrz)}
                >
                  <View style={[styles.checkboxRosa, internalCrz && styles.checkboxRosaChecked]}>
                    {internalCrz && <Text style={styles.checkmarkWhite}>✓</Text>}
                  </View>
                  <View
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 2,
                      backgroundColor: '#22c55e',
                      borderColor: '#15803d',
                      borderWidth: 1.2,
                    }}
                  />
                  <View style={styles.visibilidadeTextCol}>
                    <Text style={styles.visibilidadeNome}>Cruzamentos</Text>
                    <Text style={styles.visibilidadeDesc}>Interseções e pontos de circulação</Text>
                  </View>
                  <View style={styles.compactBadgePill}>
                    <Text style={styles.compactBadgeText}>{totalCruzamentosCount}</Text>
                  </View>
                </TouchableOpacity>

                {/* Linha 4: Lojas */}
                <TouchableOpacity
                  style={styles.visibilidadeRow}
                  activeOpacity={0.7}
                  onPress={() => toggleLoj(!internalLoj)}
                >
                  <View style={[styles.checkboxRosa, internalLoj && styles.checkboxRosaChecked]}>
                    {internalLoj && <Text style={styles.checkmarkWhite}>✓</Text>}
                  </View>
                  <View
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 5.5,
                      backgroundColor: '#38bdf8',
                      borderColor: '#0284c7',
                      borderWidth: 1,
                    }}
                  />
                  <View style={styles.visibilidadeTextCol}>
                    <Text style={styles.visibilidadeNome}>Lojas</Text>
                    <Text style={styles.visibilidadeDesc}>Lojas/LUCs disponíveis na planta</Text>
                  </View>
                  <View style={styles.compactBadgePill}>
                    <Text style={styles.compactBadgeText}>{totalLojasCount}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* ==========================================
                CARD 2: PESQUISAR SINALIZAÇÕES (Imagem 2)
                ========================================== */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionMainTitle}>Pesquisar sinalizações</Text>
              <Text style={styles.sectionSubtitle}>
                Busca local nos dados já carregados, inclusive offline.
              </Text>
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  id="buscaCamadasInput"
                  style={styles.searchInputField}
                  placeholder="Protocolo, título, rua, loja, responsável..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* ==========================================
                CARD 3: FILTROS DE SINALIZAÇÕES (Imagem 2)
                ========================================== */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionMainTitle}>Filtros de sinalizações</Text>
              <Text style={styles.sectionSubtitle}>
                Combine critérios para reduzir os pins exibidos no mapa.
              </Text>

              <View style={styles.gridFiltros}>
                {/* Tipo */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Tipo</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroTipoSelect"
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Placa informativa">Placa informativa</option>
                      <option value="Adesivo de piso">Adesivo de piso</option>
                      <option value="Placa de serviço">Placa de serviço</option>
                      <option value="Adesivo de parede">Adesivo de parede</option>
                      <option value="Painel">Painel</option>
                      <option value="Placa de rua">Placa de rua</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroTipo}</Text>
                  )}
                </View>

                {/* Finalidade */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Finalidade</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroFinalidadeSelect"
                      value={filtroFinalidade}
                      onChange={(e) => setFiltroFinalidade(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todas">Todas</option>
                      <option value="Orientação">Orientação</option>
                      <option value="Segurança">Segurança</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Operacional">Operacional</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroFinalidade}</Text>
                  )}
                </View>

                {/* Responsável */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Responsável</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroResponsavelSelect"
                      value={filtroResponsavel}
                      onChange={(e) => setFiltroResponsavel(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Davidsilva • Operações">Davidsilva • Operações</option>
                      <option value="Fiscal de Ronda">Fiscal de Ronda</option>
                      <option value="CEOP • Manutenção">CEOP • Manutenção</option>
                      <option value="Limpeza • Equipe Operacional">Limpeza • Equipe Operacional</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroResponsavel}</Text>
                  )}
                </View>

                {/* Status */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Status</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroStatusSelect"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todos">Todos</option>
                      <option value="ATIVA">Ativa</option>
                      <option value="MANUTENCAO">Manutenção</option>
                      <option value="SUBSTITUIR">Substituir</option>
                      <option value="CONCLUIDA">Concluída</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroStatus}</Text>
                  )}
                </View>

                {/* Estado de conservação */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Estado de conservação</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroConservacaoSelect"
                      value={filtroConservacao}
                      onChange={(e) => setFiltroConservacao(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Ótima">Ótima</option>
                      <option value="Boa">Boa</option>
                      <option value="Regular">Regular</option>
                      <option value="Danificada">Danificada</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroConservacao}</Text>
                  )}
                </View>

                {/* Condição */}
                <View style={styles.filtroItem}>
                  <Text style={styles.filtroLabel}>Condição</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="filtroCondicaoSelect"
                      value={filtroCondicao}
                      onChange={(e) => setFiltroCondicao(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todas">Todas</option>
                      <option value="Adequada">Adequada</option>
                      <option value="Inadequada">Inadequada</option>
                      <option value="Obsoleta">Obsoleta</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{filtroCondicao}</Text>
                  )}
                </View>
              </View>

              {/* Resumo de itens visíveis + Botão Limpar Filtros */}
              <View style={styles.filtrosSummaryRow}>
                <View>
                  <Text style={styles.filtrosSummaryTitle}>{totalPinsCount} de {totalPinsCount}</Text>
                  <Text style={styles.filtrosSummarySub}>sinalizações visíveis</Text>
                </View>
                <TouchableOpacity
                  id="limparFiltrosBtn"
                  style={styles.btnLimparFiltros}
                  onPress={handleLimparFiltros}
                >
                  <Text style={styles.btnLimparFiltrosText}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ==========================================
                CARD 4: APARÊNCIA DAS SINALIZAÇÕES (Imagem 3)
                ========================================== */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionMainTitle}>Aparência das sinalizações</Text>
                  <Text style={styles.sectionSubtitle}>
                    Escolha como os pins devem ser coloridos. A configuração é somente visual.
                  </Text>
                </View>
                <View style={styles.tipoBadgePill}>
                  <Text style={styles.tipoBadgeText}>Tipo</Text>
                </View>
              </View>

              {/* Colorir por */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.filtroLabel}>Colorir por</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="colorirPorSelect"
                    value={colorirPor}
                    onChange={(e) => setColorirPor(e.target.value)}
                    style={selectWebStyle}
                  >
                    <option value="Tipo">Tipo</option>
                    <option value="Status">Status</option>
                    <option value="Finalidade">Finalidade</option>
                    <option value="Responsável">Responsável</option>
                    <option value="Conservação">Estado de conservação</option>
                  </select>
                ) : (
                  <Text style={styles.fallbackText}>{colorirPor}</Text>
                )}
              </View>

              {/* Bloco da Legenda */}
              <View style={styles.legendaHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.legendaTitle}>Legenda</Text>
                  <Text style={styles.legendaSub}>Somente categorias presentes na visão corrente.</Text>
                </View>
                <TouchableOpacity
                  id="restaurarCoresBtn"
                  style={styles.btnRestaurarCores}
                  onPress={() => {
                    setColorPickerTargetId(null);
                    setLegendaCores(LEGENDA_SINALIZACOES_PADRAO);
                    setCorReferenciaLocal('#38bdf8');
                    setCoresReferenciasLocal(CORES_PADRAO_TIPOS_REFERENCIA);
                    if (onUpdateCorReferencia) onUpdateCorReferencia('#38bdf8');
                    if (onUpdateCoresReferencias) onUpdateCoresReferencias(CORES_PADRAO_TIPOS_REFERENCIA);
                  }}
                >
                  <Text style={styles.btnRestaurarCoresText}>Restaurar cores</Text>
                </TouchableOpacity>
              </View>

              {/* Lista com as categorias das fotos + Tipos de Referências */}
              <View style={styles.legendaLista}>
                {/* Tipos de Referências Cartográficas Oficiais com Cores Customizáveis */}
                {(() => {
                  const todosTiposRef = CartografiaService.obterTiposReferenciasComContagem(
                    selectedMapKey,
                    coresReferenciasLocal
                  );
                  const tiposAtivos = todosTiposRef.filter((t) => t.count > 0);
                  const tiposInativos = todosTiposRef.filter((t) => t.count === 0);
                  const listaExibicao = mostrarTodosTiposRef || tiposAtivos.length === 0
                    ? todosTiposRef
                    : tiposAtivos;

                  return (
                    <>
                      {listaExibicao.map((refTipoItem) => {
                        const targetId = `cat-ref-${refTipoItem.tipo.toLowerCase()}`;
                        const isPickerRefOpen = colorPickerTargetId === targetId;

                        return (
                          <View
                            key={targetId}
                            style={[styles.legendaRow, isPickerRefOpen && styles.legendaRowActive]}
                          >
                            <TouchableOpacity
                              id={`cor-btn-${targetId}`}
                              style={[
                                styles.legendaColorSquare,
                                { backgroundColor: refTipoItem.cor, cursor: 'pointer' as any },
                              ]}
                              onPress={() => setColorPickerTargetId(isPickerRefOpen ? null : targetId)}
                              activeOpacity={0.8}
                            />
                            {/* Miniatura do anel oficial com o miolo na cor do tipo */}
                            <View
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: 7,
                                backgroundColor: '#10144d',
                                borderColor: '#ffffff',
                                borderWidth: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <View
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: 2.5,
                                  backgroundColor: refTipoItem.cor,
                                }}
                              />
                            </View>
                            <Text style={styles.legendaCatNome}>Ref: {refTipoItem.nome}</Text>
                            <View style={styles.compactBadgePill}>
                              <Text style={styles.compactBadgeText}>{refTipoItem.count}</Text>
                            </View>

                            {/* Popover do Seletor de Cores para o Tipo de Referência */}
                            {isPickerRefOpen && (
                              <>
                                {Platform.OS === 'web' && (
                                  <TouchableOpacity
                                    style={styles.colorPickerBackdrop}
                                    onPress={() => setColorPickerTargetId(null)}
                                    activeOpacity={1}
                                  />
                                )}
                                <View style={styles.colorPickerPopover}>
                                  <ChromeColorPicker
                                    color={refTipoItem.cor}
                                    onChange={(newHex) => {
                                      handleMudarCorTipoReferencia(refTipoItem.tipo, newHex);
                                    }}
                                    onClose={() => setColorPickerTargetId(null)}
                                  />
                                </View>
                              </>
                            )}
                          </View>
                        );
                      })}

                      {/* Botão de expansão sutil caso existam tipos sem referências na visão corrente */}
                      {tiposInativos.length > 0 && tiposAtivos.length > 0 && (
                        <TouchableOpacity
                          style={{
                            paddingVertical: 3,
                            paddingHorizontal: 6,
                            marginTop: 1,
                            marginBottom: 6,
                            alignSelf: 'flex-start',
                          }}
                          onPress={() => setMostrarTodosTiposRef(!mostrarTodosTiposRef)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ fontSize: 11, color: '#0284c7', fontWeight: '600' }}>
                            {mostrarTodosTiposRef
                              ? '▴ Ocultar tipos de referências sem itens nesta visão'
                              : `▾ +${tiposInativos.length} outros tipos de referências`}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  );
                })()}

                {legendaCores.map((cat) => {
                  const isPickerOpen = colorPickerTargetId === cat.id;
                  return (
                    <View
                      key={cat.id}
                      style={[styles.legendaRow, isPickerOpen && styles.legendaRowActive]}
                    >
                      <TouchableOpacity
                        id={`cor-btn-${cat.id}`}
                        style={[
                          styles.legendaColorSquare,
                          { backgroundColor: cat.cor, cursor: 'pointer' as any },
                        ]}
                        onPress={() => setColorPickerTargetId(isPickerOpen ? null : cat.id)}
                        activeOpacity={0.8}
                      />
                      <View style={[styles.dotSinalizacao, { backgroundColor: cat.cor }]} />
                      <Text style={styles.legendaCatNome}>{cat.nome}</Text>
                      <View style={styles.compactBadgePill}>
                        <Text style={styles.compactBadgeText}>{cat.count}</Text>
                      </View>

                      {/* Popover do Seletor de Cores (ChromeColorPicker) */}
                      {isPickerOpen && (
                        <>
                          {Platform.OS === 'web' && (
                            <TouchableOpacity
                              style={styles.colorPickerBackdrop}
                              onPress={() => setColorPickerTargetId(null)}
                              activeOpacity={1}
                            />
                          )}
                          <View style={styles.colorPickerPopover}>
                            <ChromeColorPicker
                              color={cat.cor}
                              onChange={(newHex) => {
                                setLegendaCores((prev) =>
                                  prev.map((item) =>
                                    item.id === cat.id ? { ...item, cor: newHex } : item
                                  )
                                );
                              }}
                              onClose={() => setColorPickerTargetId(null)}
                            />
                          </View>
                        </>
                      )}
                    </View>
                  );
                })}
              </View>

              <Text style={styles.legendaNota}>
                As cores desta seção não alteram a cor física cadastrada no SIG e continuam disponíveis offline neste navegador.
              </Text>
            </View>

            {/* ==========================================
                CARD 5: VISUALIZAÇÕES CORPORATIVAS (Imagens 3 e 4)
                ========================================== */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionMainTitle}>Visualizações corporativas</Text>
              <Text style={styles.sectionSubtitle}>
                Presets publicados pela Administração para todos ou para um perfil específico.
              </Text>

              {/* Formulário de Publicação */}
              <View style={styles.formPublicarCorp}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroLabel}>Nome</Text>
                  <TextInput
                    id="nomePresetCorpInput"
                    style={styles.inputCorpNome}
                    placeholder="Ex.: Visão C"
                    placeholderTextColor="#94A3B8"
                    value={nomeNovoPresetCorp}
                    onChangeText={setNomeNovoPresetCorp}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroLabel}>Escopo</Text>
                  {Platform.OS === 'web' ? (
                    <select
                      id="escopoPresetCorpSelect"
                      value={escopoNovoPresetCorp}
                      onChange={(e) => setEscopoNovoPresetCorp(e.target.value)}
                      style={selectWebStyle}
                    >
                      <option value="Todos os usuários">Todos os usuários</option>
                      <option value="Operações">Operações</option>
                      <option value="Administração">Administração</option>
                      <option value="Segurança">Segurança</option>
                    </select>
                  ) : (
                    <Text style={styles.fallbackText}>{escopoNovoPresetCorp}</Text>
                  )}
                </View>

                <TouchableOpacity
                  id="publicarVisaoCorpBtn"
                  style={styles.btnPublicarCorp}
                  onPress={handlePublicarPresetCorp}
                >
                  <Text style={styles.btnPublicarCorpText}>Publicar visão atual</Text>
                </TouchableOpacity>
              </View>

              {/* Status e Contador */}
              <View style={styles.corpDisponiveisRow}>
                <Text style={styles.corpDisponiveisText}>
                  {presetsCorp.length} visualizações corporativas disponíveis.
                </Text>
                <TouchableOpacity
                  id="atualizarPresetsCorpBtn"
                  style={styles.btnAtualizarCorp}
                  onPress={() => setPresetsCorp(PRESETS_CORPORATIVOS_INICIAIS)}
                >
                  <Text style={styles.btnAtualizarCorpText}>Atualizar</Text>
                </TouchableOpacity>
              </View>

              {/* Lista dos 3 Presets Corporativos Oficiais */}
              <View style={styles.presetsList}>
                {presetsCorp.map((preset) => (
                  <View key={preset.id} style={styles.presetCard}>
                    <Text style={styles.presetTitle}>{preset.nome}</Text>
                    <Text style={styles.presetMetaText}>{preset.camadasInfo}</Text>

                    {/* Badges */}
                    <View style={styles.presetBadgesRow}>
                      {preset.badges.map((b, i) => (
                        <View
                          key={i}
                          style={[
                            styles.badgeGeral,
                            b === 'Padrão' ? styles.badgeRosaPadrao : styles.badgeCinza,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeGeralText,
                              b === 'Padrão' ? styles.badgeRosaPadraoText : styles.badgeCinzaText,
                            ]}
                          >
                            {b}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Ações */}
                    <View style={styles.presetActionsRow}>
                      <TouchableOpacity
                        style={styles.btnPresetAplicar}
                        onPress={() => handleAplicarPresetCorp(preset)}
                      >
                        <Text style={styles.btnPresetAplicarText}>Aplicar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnPresetAtualizar}
                        onPress={() => handleAtualizarPresetCorp(preset.id)}
                      >
                        <Text style={styles.btnPresetAtualizarText}>Atualizar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnPresetPadrao}
                        onPress={() => handleTogglePadraoCorp(preset.id)}
                      >
                        <Text style={styles.btnPresetPadraoText}>
                          {preset.isPadrao ? 'Remover padrão' : 'Definir padrão'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnPresetExcluir}
                        onPress={() => handleExcluirCorp(preset.id)}
                      >
                        <Text style={styles.btnPresetExcluirText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={styles.corpNotaPrecedencia}>
                Padrão por perfil tem precedência sobre padrão global. O padrão corporativo é aplicado automaticamente e prevalece sobre o padrão pessoal local na abertura.
              </Text>
            </View>

            {/* ==========================================
                CARD 6: MINHAS VISUALIZAÇÕES (Imagem 4)
                ========================================== */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionMainTitle}>Minhas visualizações</Text>
              <Text style={styles.sectionSubtitle}>
                Presets pessoais salvos somente neste navegador e disponíveis offline.
              </Text>

              <View style={styles.formMinhaVisao}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.filtroLabel}>Nome da visualização</Text>
                  <TextInput
                    id="nomeMinhaVisaoInput"
                    style={styles.inputCorpNome}
                    placeholder="Ex.: Visão Manutenção"
                    placeholderTextColor="#94A3B8"
                    value={nomeMinhaVisao}
                    onChangeText={setNomeMinhaVisao}
                  />
                </View>

                <TouchableOpacity
                  id="salvarMinhaVisaoBtn"
                  style={styles.btnSalvarMinhaVisao}
                  onPress={handleSalvarMinhaVisao}
                >
                  <Text style={styles.btnSalvarMinhaVisaoText}>Salvar visualização</Text>
                </TouchableOpacity>
              </View>

              {minhasVisoes.length === 0 ? (
                <View style={styles.emptyMinhasVisoes}>
                  <Text style={styles.emptyTitle}>Nenhuma visualização salva.</Text>
                  <Text style={styles.emptySub}>
                    Salve a visão atual para reutilizar filtros, camadas e cores com um clique.
                  </Text>
                </View>
              ) : (
                <View style={styles.presetsList}>
                  {minhasVisoes.map((v) => (
                    <View key={v.id} style={styles.presetCard}>
                      <Text style={styles.presetTitle}>{v.nome}</Text>
                      <Text style={styles.presetMetaText}>Criado em {v.dataCriacao} • Privado</Text>
                      <View style={styles.presetActionsRow}>
                        <TouchableOpacity
                          style={styles.btnPresetAplicar}
                          onPress={() => setShowCentralCamadas(false)}
                        >
                          <Text style={styles.btnPresetAplicarText}>Aplicar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnPresetExcluir}
                          onPress={() => handleRemoverMinhaVisao(v.id)}
                        >
                          <Text style={styles.btnPresetExcluirText}>Excluir</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.corpNotaPrecedencia}>
                Presets pessoais continuam privados deste navegador. Quando existir um padrão corporativo publicado, ele terá precedência na abertura da aplicação.
              </Text>
            </View>
          </ScrollView>

          {/* Rodapé Fixo */}
          <View style={styles.centralFooter}>
            <TouchableOpacity
              id="restaurarPadraoGlobalBtn"
              style={styles.btnFooterRestaurar}
              onPress={handleRestaurarPadraoGeral}
            >
              <Text style={styles.btnFooterRestaurarText}>Restaurar padrão</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="verMapaCentralBtn"
              style={styles.btnFooterVerMapa}
              onPress={() => setShowCentralCamadas(false)}
            >
              <Text style={styles.btnFooterVerMapaText}>Ver mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  // Card Compacto (Imagem 1)
  compactCard: {
    position: 'absolute',
    top: 140,
    left: 24,
    width: 310,
    maxWidth: '92%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
    zIndex: 210,
  },
  compactCardMobile: {
    top: 'auto',
    bottom: 20,
    left: 14,
    right: 14,
    width: 'auto',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  compactCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCloseBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  compactList: {
    gap: 14,
    marginBottom: 20,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkboxRosa: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxRosaChecked: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  checkmarkWhite: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginTop: -2,
  },
  compactLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  compactBadgePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  compactBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  compactFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  btnGerenciarCamadas: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGerenciarCamadasText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171B68',
  },

  // Central de Camadas Modal (Imagens 2, 3 e 4)
  centralModalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -260 }, { translateY: -380 }],
    width: 520,
    maxWidth: '94%',
    height: 760,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.25,
    shadowRadius: 36,
    elevation: 12,
    zIndex: 220,
    overflow: 'hidden',
  },
  centralModalBoxMobile: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    transform: [],
    width: 'auto',
    height: 'auto',
    borderRadius: 18,
  },
  centralHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  centralEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  centralTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  centralSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  centralCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralCloseBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  centralScrollBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centralScrollContent: {
    padding: 18,
    gap: 16,
  },

  // Cards de Seção
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionMainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  ativasBadgePill: {
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ativasBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DB2777',
  },

  // Linhas de Visibilidade
  visibilidadeList: {
    gap: 14,
    marginTop: 4,
  },
  visibilidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotSinalizacao: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  visibilidadeTextCol: {
    flex: 1,
  },
  visibilidadeNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  visibilidadeDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },

  // Pesquisa
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },

  // Grid Filtros
  gridFiltros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  filtroItem: {
    width: '48%',
    minWidth: 180,
  },
  filtroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  fallbackText: {
    fontSize: 13,
    color: '#0F172A',
  },
  filtrosSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  filtrosSummaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  filtrosSummarySub: {
    fontSize: 12,
    color: '#64748B',
  },
  btnLimparFiltros: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  btnLimparFiltrosText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  // Aparência e Legenda (Imagem 3)
  tipoBadgePill: {
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tipoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DB2777',
  },
  legendaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  legendaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendaSub: {
    fontSize: 12,
    color: '#64748B',
  },
  btnRestaurarCores: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  btnRestaurarCoresText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171B68',
  },
  legendaLista: {
    gap: 10,
    marginBottom: 14,
    position: 'relative',
    zIndex: 100,
  },
  legendaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  legendaRowActive: {
    position: 'relative',
    zIndex: 1000,
  },
  legendaColorSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer' as any,
  },
  colorPickerPopover: {
    position: 'absolute',
    top: 28,
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    zIndex: 999999,
    elevation: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  colorPickerBackdrop: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99990,
  },
  legendaCatNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  legendaNota: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    position: 'relative',
    zIndex: 1,
  },

  // Presets Corporativos (Imagens 3 e 4)
  formPublicarCorp: {
    gap: 10,
    marginBottom: 16,
  },
  inputCorpNome: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  btnPublicarCorp: {
    backgroundColor: '#E11D48',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  btnPublicarCorpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  corpDisponiveisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 12,
  },
  corpDisponiveisText: {
    fontSize: 13,
    color: '#475569',
  },
  btnAtualizarCorp: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  btnAtualizarCorpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171B68',
  },
  presetsList: {
    gap: 14,
    marginBottom: 14,
  },
  presetCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  presetMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  presetBadgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  badgeGeral: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeGeralText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeRosaPadrao: {
    backgroundColor: '#FDF2F8',
  },
  badgeRosaPadraoText: {
    color: '#DB2777',
  },
  badgeCinza: {
    backgroundColor: '#F1F5F9',
  },
  badgeCinzaText: {
    color: '#475569',
  },
  presetActionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  btnPresetAplicar: {
    borderWidth: 1,
    borderColor: '#E11D48',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  btnPresetAplicarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },
  btnPresetAtualizar: {
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  btnPresetAtualizarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171B68',
  },
  btnPresetPadrao: {
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  btnPresetPadraoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171B68',
  },
  btnPresetExcluir: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  btnPresetExcluirText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  corpNotaPrecedencia: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginTop: 6,
  },

  // Minhas Visualizações (Imagem 4)
  formMinhaVisao: {
    gap: 10,
    marginBottom: 16,
  },
  btnSalvarMinhaVisao: {
    backgroundColor: '#E11D48',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSalvarMinhaVisaoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyMinhasVisoes: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  emptyTitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
  },

  // Rodapé Fixo Inferior
  centralFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  btnFooterRestaurar: {
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
  },
  btnFooterRestaurarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnFooterVerMapa: {
    backgroundColor: '#E11D48',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 11,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnFooterVerMapaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
