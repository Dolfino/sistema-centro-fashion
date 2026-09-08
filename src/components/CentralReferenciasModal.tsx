import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  PontoReferenciaOficial,
  CartografiaService,
  CORES_PADRAO_TIPOS_REFERENCIA,
  NOMES_PADRAO_TIPOS_REFERENCIA,
} from '../services/cartografiaService';

export interface CentralReferenciasModalProps {
  visible: boolean;
  onClose: () => void;
  referencias?: PontoReferenciaOficial[];
  onSalvarReferencia?: (ref: PontoReferenciaOficial) => void;
  onExcluirReferencia?: (id: string) => void;
  onReposicionarNoMapa?: (ref: PontoReferenciaOficial) => void;
}

const SETORES_MAPA: Record<string, string> = {
  'MAP-CFF-N1-AZUL': 'Setor Azul',
  SETOR_AZUL: 'Setor Azul',
  'MAP-CFF-N1-VERDE': 'Setor Verde',
  SETOR_VERDE: 'Setor Verde',
  'MAP-CFF-N2-AMARELO': 'Setor Amarelo',
  SETOR_AMARELO: 'Setor Amarelo',
  'MAP-CFF-N3-ROXO': 'Setor Roxo',
  SETOR_ROXO: 'Setor Roxo',
  'MAP-CFF-N2-BRANCO': 'Setor Branco',
  SETOR_BRANCO: 'Setor Branco',
  'PLA-CFF-N1-2025': 'Nível 1',
  NIVEL_1: 'Nível 1',
  'PLA-CFF-N2-2025': 'Nível 2',
  NIVEL_2: 'Nível 2',
  'PLA-CFF-N3-2025': 'Nível 3',
  NIVEL_3: 'Nível 3',
  'PLA-CFF-N0-2025': 'Nível 0',
  NIVEL_0: 'Nível 0',
};

// 31 Referências oficiais pré-carregadas com paridade total aos dados do Mall
const REFERENCIAS_PADRAO: PontoReferenciaOficial[] = [
  {
    id: 'REF-20260801095223-1AD502B2',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Acesso ao elevador torre 2',
    tipo: 'SERVICO',
    subtipo: 'ELEVADOR',
    x: 0.9564,
    y: 0.14799,
    descricao: 'Elevador de acesso ao caixas eletrônicos. Teste',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Rua Princesa Isabel — Início de Rua Princesa Isabel — Loja 1309',
  },
  {
    id: 'REF-AZ-AMBULATORIO',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Ambulatório',
    tipo: 'SERVICO',
    subtipo: 'SAUDE',
    x: 0.13814,
    y: 0.94869,
    descricao: 'Próximo ao ambulatório',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Loja 1102',
  },
  {
    id: 'REF-AZ-CORREIOS',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Correios',
    tipo: 'SERVICO',
    subtipo: 'CORREIOS',
    x: 0.1425,
    y: 0.892,
    descricao: 'Próximo aos Correios',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Avenida Dom Manuel — Início de Avenida Dom Manuel — Loja 1318',
  },
  {
    id: 'REF-AZ-LOTERICA',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Lotérica',
    tipo: 'SERVICO',
    subtipo: 'LOTERICA',
    x: 0.158,
    y: 0.912,
    descricao: 'Próximo à Lotérica e caixas de autoatendimento',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Avenida Alberto Nepomuceno — Loja 1012',
  },
  {
    id: 'REF-AZ-SALAO',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Salão de Beleza',
    tipo: 'SERVICO',
    subtipo: 'SALAO_BELEZA',
    x: 0.145,
    y: 0.88,
    descricao: 'Próximo ao salão de beleza',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Rua José Avelino — Loja 1240',
  },
  {
    id: 'REF-AZ-ESTEIRA-SUP',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Esteira rolante superior',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.521,
    y: 0.445,
    descricao: 'Próximo à esteira rolante superior Setor Azul',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Corredor Central Azul — Próximo ao Vão Central',
  },
  {
    id: 'REF-AZ-ESCADA-CENTRAL',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Escada Central Azul',
    tipo: 'CIRCULACAO',
    subtipo: 'ESCADA',
    x: 0.518,
    y: 0.468,
    descricao: 'Escada de acesso entre Piso 1 e Piso 2',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Rua Senador Pompeu — Cruzamento Central',
  },
  {
    id: 'REF-20260802160138-3A018502',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Restaurante',
    tipo: 'ALIMENTACAO',
    subtipo: 'RESTAURANTE',
    x: 0.10433,
    y: 0.17809,
    descricao: 'Próximo à esteira rolante',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Praça de Alimentação Azul — Loja 1401',
  },
  {
    id: 'REF-20260802162852-A0B74289',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Quiosque',
    tipo: 'QUIOSQUE',
    subtipo: 'QUIOSQUE',
    x: 0.14654,
    y: 0.54513,
    descricao: 'Próximo a Escala de Incêndio',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Rua General Bezerril — Quiosque Q-04',
  },
  {
    id: 'REF-20260802165502-21436D37',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Quiosque 2',
    tipo: 'QUIOSQUE',
    subtipo: 'QUIOSQUE',
    x: 0.14128,
    y: 0.6216,
    descricao: 'Próximo ao cruzamento de ruas',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Rua Castro e Silva — Quiosque Q-09',
  },
  {
    id: 'REF-20260802171717-1FF932A7',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Elevador Torre 5',
    tipo: 'CIRCULACAO',
    subtipo: 'ELEVADOR',
    x: 0.30224,
    y: 0.41349,
    descricao: 'Em frente ao elevador Torre 5',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Torre 5 — Acesso Estacionamento',
  },
  {
    id: 'REF-20260802171908-97886155',
    idMapaSetor: 'MAP-CFF-N1-AZUL',
    nome: 'Quiosque 3',
    tipo: 'QUIOSQUE',
    subtipo: 'QUIOSQUE',
    x: 0.32721,
    y: 0.37164,
    descricao: 'Próxima a esteira rolante',
    status: 'VALIDADO',
    ativo: true,
    confirmada: true,
    localizacaoTexto: 'Corredor Leste — Quiosque Q-12',
  },
  {
    id: 'REF-VD-ESTEIRA-CENTRAL',
    idMapaSetor: 'MAP-CFF-N1-VERDE',
    nome: 'Esteira rolante central',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.505,
    y: 0.485,
    descricao: 'Esteira de acesso vertical Setor Verde',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Verde • Vão Central',
  },
  {
    id: 'REF-VD-ESTEIRA-INF',
    idMapaSetor: 'MAP-CFF-N1-VERDE',
    nome: 'Esteira rolante inferior',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.495,
    y: 0.655,
    descricao: 'Acesso às docas e subsolo Setor Verde',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Verde • Acesso Docas',
  },
  {
    id: 'REF-VD-SANITARIOS',
    idMapaSetor: 'MAP-CFF-N1-VERDE',
    nome: 'Sanitários Setor Verde',
    tipo: 'SERVICO',
    subtipo: 'SANITARIO',
    x: 0.88,
    y: 0.35,
    descricao: 'Bateria de sanitários masculinos, femininos e PCD',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Verde • Próximo à Torre 4',
  },
  {
    id: 'REF-BR-ESTEIRAS-CENTRAIS',
    idMapaSetor: 'MAP-CFF-N2-BRANCO',
    nome: 'Esteiras rolantes centrais',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.51,
    y: 0.49,
    descricao: 'Conjunto de esteiras rolantes centrais Piso 2',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Branco • Piso 2',
  },
  {
    id: 'REF-BR-AREA-EVENTOS',
    idMapaSetor: 'MAP-CFF-N2-BRANCO',
    nome: 'Área de eventos',
    tipo: 'AREA_ESPECIAL',
    subtipo: 'EVENTOS',
    x: 0.35,
    y: 0.62,
    descricao: 'Espaço multiuso para feiras e desfiles',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Branco • Praça de Eventos',
  },
  {
    id: 'REF-BR-DEPOSITO-BOXES',
    idMapaSetor: 'MAP-CFF-N2-BRANCO',
    nome: 'Depósito de boxes',
    tipo: 'APOIO',
    subtipo: 'DEPOSITO',
    x: 0.88,
    y: 0.82,
    descricao: 'Área de guarda e logística operacional',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Branco • Doca Interna',
  },
  {
    id: 'REF-BR-GERENCIA-COMERCIAL',
    idMapaSetor: 'MAP-CFF-N2-BRANCO',
    nome: 'Gerência comercial',
    tipo: 'ADMINISTRATIVO',
    subtipo: 'ADMINISTRATIVO',
    x: 0.15,
    y: 0.25,
    descricao: 'Atendimento a lojistas e contratos',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Branco • Sala Comercial 201',
  },
  {
    id: 'REF-AM-ESTEIRA-CENTRAL',
    idMapaSetor: 'MAP-CFF-N2-AMARELO',
    nome: 'Esteira rolante central',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.505,
    y: 0.505,
    descricao: 'Esteira de conexão Piso 2 Setor Amarelo',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Amarelo • Piso 2',
  },
  {
    id: 'REF-AM-RESTAURANTE',
    idMapaSetor: 'MAP-CFF-N2-AMARELO',
    nome: 'Restaurante Panorâmico',
    tipo: 'ALIMENTACAO',
    subtipo: 'RESTAURANTE',
    x: 0.18,
    y: 0.72,
    descricao: 'Restaurante buffet e cafeteria',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Amarelo • Loja 2410',
  },
  {
    id: 'REF-AM-SANITARIOS',
    idMapaSetor: 'MAP-CFF-N2-AMARELO',
    nome: 'Sanitários Setor Amarelo',
    tipo: 'SERVICO',
    subtipo: 'SANITARIO',
    x: 0.82,
    y: 0.38,
    descricao: 'Sanitários masculinos e femininos',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Amarelo • Próximo à Torre 3',
  },
  {
    id: 'REF-RX-BANCOS-24H',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Bancos 24h',
    tipo: 'SERVICO',
    subtipo: 'CAIXA_ELETRONICO',
    x: 0.22,
    y: 0.35,
    descricao: 'Terminais de autoatendimento bancário',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Piso 3 • Hall 301',
  },
  {
    id: 'REF-RX-ESCADA-RECEPCAO',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Escada da recepção',
    tipo: 'CIRCULACAO',
    subtipo: 'ESCADA',
    x: 0.35,
    y: 0.22,
    descricao: 'Escada principal do mezanino administrativo',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Mezanino',
  },
  {
    id: 'REF-RX-ELEVADOR-ACESS',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Elevador de acessibilidade',
    tipo: 'CIRCULACAO',
    subtipo: 'ELEVADOR',
    x: 0.38,
    y: 0.28,
    descricao: 'Elevador panorâmico acessível',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Hall Panorâmico',
  },
  {
    id: 'REF-RX-SANITARIOS',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Sanitários Setor Roxo',
    tipo: 'SERVICO',
    subtipo: 'SANITARIO',
    x: 0.78,
    y: 0.42,
    descricao: 'Bateria de sanitários Piso 3',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Próximo ao Estacionamento',
  },
  {
    id: 'REF-RX-RESTAURANTE',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Praça de Alimentação Roxo',
    tipo: 'ALIMENTACAO',
    subtipo: 'RESTAURANTE',
    x: 0.52,
    y: 0.24,
    descricao: 'Praça de alimentação gourmet',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Terraço',
  },
  {
    id: 'REF-RX-ESTEIRA-CENTRAL',
    idMapaSetor: 'MAP-CFF-N3-ROXO',
    nome: 'Esteira rolante central',
    tipo: 'CIRCULACAO',
    subtipo: 'ESTEIRA_ROLANTE',
    x: 0.505,
    y: 0.508,
    descricao: 'Próximo à esteira rolante central',
    status: 'SUGERIDO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Setor Roxo • Piso 3',
  },
  {
    id: 'REF-N0-DOCA-SUL',
    idMapaSetor: 'PLA-CFF-N0-2025',
    nome: 'Doca Sul e Expedição',
    tipo: 'SERVICO',
    subtipo: 'INFRAESTRUTURA',
    x: 0.42,
    y: 0.88,
    descricao: 'Acesso operacional de carga pesada',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Nível 0 • Doca Sul',
  },
  {
    id: 'REF-N0-RAMPA-VEICULAR',
    idMapaSetor: 'PLA-CFF-N0-2025',
    nome: 'Rampa de Acesso Veicular R01',
    tipo: 'CIRCULACAO',
    subtipo: 'ACESSO',
    x: 0.42,
    y: 0.21,
    descricao: 'Acesso para veículos leves e vans',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Nível 0 • Rampa R01 • Canal Central',
  },
  {
    id: 'REF-N1-HOTEL-CDM',
    idMapaSetor: 'PLA-CFF-N1-2025',
    nome: 'Acesso Hotel & CDM',
    tipo: 'SERVICO',
    subtipo: 'ACESSO',
    x: 0.62,
    y: 0.6,
    descricao: 'Recepção e passagem conectada ao hotel e CDM',
    status: 'VALIDADO',
    ativo: true,
    confirmada: false,
    localizacaoTexto: 'Nível 1 • Entrada Lateral Hotel',
  },
];

export const CentralReferenciasModal: React.FC<CentralReferenciasModalProps> = ({
  visible,
  onClose,
  referencias: refsExternas,
  onSalvarReferencia,
  onExcluirReferencia,
  onReposicionarNoMapa,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Mescla com referências detalhadas para garantir exibição de localização e status confirmada
  const listaInicial = useMemo(() => {
    if (!refsExternas || refsExternas.length === 0) return REFERENCIAS_PADRAO;
    const mapaPadrao = new Map(REFERENCIAS_PADRAO.map((r) => [r.id, r]));
    const resultado = refsExternas.map((ref) => {
      const base = mapaPadrao.get(ref.id);
      if (base) {
        return {
          ...base,
          ...ref,
          confirmada: ref.confirmada !== undefined ? ref.confirmada : base.confirmada,
          localizacaoTexto: ref.localizacaoTexto || base.localizacaoTexto,
          subtipo: ref.subtipo || base.subtipo,
        };
      }
      return ref;
    });

    // Se houver itens em REFERENCIAS_PADRAO que não estão no array externo, inclui para paridade dos 31
    for (const refPadrao of REFERENCIAS_PADRAO) {
      if (!resultado.some((r) => r.id === refPadrao.id)) {
        resultado.push(refPadrao);
      }
    }
    return resultado;
  }, [refsExternas]);

  const [listaReferencias, setListaReferencias] = useState<PontoReferenciaOficial[]>(listaInicial);

  useEffect(() => {
    setListaReferencias(listaInicial);
  }, [listaInicial]);

  // Filtros
  const [pesquisa, setPesquisa] = useState<string>('');
  const [filtroSetor, setFiltroSetor] = useState<string>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroSubtipo, setFiltroSubtipo] = useState<string>('TODOS');
  const [filtroStatus, setFiltroStatus] = useState<'TODAS' | 'ATIVAS' | 'INATIVAS'>('ATIVAS');
  const [filtroConfirmacao, setFiltroConfirmacao] = useState<'TODAS' | 'CONFIRMADAS' | 'NAO_CONFIRMADAS'>('TODAS');

  // Modal Novo / Edição
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState<boolean>(false);
  const [refEmEdicao, setRefEmEdicao] = useState<Partial<PontoReferenciaOficial> | null>(null);

  if (!visible) return null;

  // Métricas
  const totalTodas = listaReferencias.length;
  const totalAtivas = listaReferencias.filter((r) => r.ativo).length;
  const totalInativas = listaReferencias.filter((r) => !r.ativo).length;
  const totalConfirmadas = listaReferencias.filter((r) => r.confirmada).length;

  // Filtragem da lista
  const listaFiltrada = listaReferencias.filter((ref) => {
    // Busca textual
    if (pesquisa.trim()) {
      const q = pesquisa.toLowerCase();
      const matchTexto =
        ref.nome.toLowerCase().includes(q) ||
        ref.id.toLowerCase().includes(q) ||
        (ref.descricao && ref.descricao.toLowerCase().includes(q)) ||
        (ref.tipo && ref.tipo.toLowerCase().includes(q)) ||
        (ref.subtipo && ref.subtipo.toLowerCase().includes(q)) ||
        (ref.localizacaoTexto && ref.localizacaoTexto.toLowerCase().includes(q));
      if (!matchTexto) return false;
    }

    // Setor
    if (filtroSetor !== 'TODOS') {
      const targetNormal = CartografiaService.normalizarIdMapaSetor(filtroSetor);
      if (ref.idMapaSetor !== targetNormal && ref.idMapaSetor !== filtroSetor) return false;
    }

    // Tipo
    if (filtroTipo !== 'TODOS') {
      if ((ref.tipo || 'OUTRO').toUpperCase() !== filtroTipo.toUpperCase()) return false;
    }

    // Subtipo
    if (filtroSubtipo !== 'TODOS') {
      if ((ref.subtipo || '').toUpperCase() !== filtroSubtipo.toUpperCase()) return false;
    }

    // Status
    if (filtroStatus === 'ATIVAS' && !ref.ativo) return false;
    if (filtroStatus === 'INATIVAS' && ref.ativo) return false;

    // Confirmação
    if (filtroConfirmacao === 'CONFIRMADAS' && !ref.confirmada) return false;
    if (filtroConfirmacao === 'NAO_CONFIRMADAS' && ref.confirmada) return false;

    return true;
  });

  // Lista única de subtipos disponíveis
  const subtiposDisponiveis = Array.from(
    new Set(listaReferencias.map((r) => r.subtipo).filter(Boolean) as string[])
  );

  // Ações em cada card
  const handleToggleAtivo = (ref: PontoReferenciaOficial) => {
    const atualizada = { ...ref, ativo: !ref.ativo };
    setListaReferencias((prev) => prev.map((r) => (r.id === ref.id ? atualizada : r)));
    if (onSalvarReferencia) onSalvarReferencia(atualizada);
  };

  const handleAbrirEdicao = (ref: PontoReferenciaOficial) => {
    setRefEmEdicao(ref);
    setModalEdicaoAberta(true);
  };

  const handleNovaReferencia = () => {
    setRefEmEdicao({
      id: `REF-${Date.now().toString(16).toUpperCase()}`,
      nome: '',
      descricao: '',
      idMapaSetor: 'MAP-CFF-N1-AZUL',
      tipo: 'SERVICO',
      subtipo: 'ELEVADOR',
      status: 'SUGERIDO',
      ativo: true,
      confirmada: false,
      localizacaoTexto: '',
      x: 0.5,
      y: 0.5,
    });
    setModalEdicaoAberta(true);
  };

  const handleSalvarEdicao = () => {
    if (!refEmEdicao || !refEmEdicao.nome?.trim()) return;

    const refFinal: PontoReferenciaOficial = {
      id: refEmEdicao.id || `REF-${Date.now()}`,
      nome: refEmEdicao.nome.trim(),
      descricao: refEmEdicao.descricao || '',
      idMapaSetor: refEmEdicao.idMapaSetor || 'MAP-CFF-N1-AZUL',
      tipo: refEmEdicao.tipo || 'SERVICO',
      subtipo: refEmEdicao.subtipo || '',
      status: refEmEdicao.status || 'VALIDADO',
      ativo: refEmEdicao.ativo ?? true,
      confirmada: refEmEdicao.confirmada ?? false,
      localizacaoTexto: refEmEdicao.localizacaoTexto || '',
      x: refEmEdicao.x ?? 0.5,
      y: refEmEdicao.y ?? 0.5,
    };

    setListaReferencias((prev) => {
      const existe = prev.some((r) => r.id === refFinal.id);
      if (existe) {
        return prev.map((r) => (r.id === refFinal.id ? refFinal : r));
      }
      return [refFinal, ...prev];
    });

    if (onSalvarReferencia) onSalvarReferencia(refFinal);
    setModalEdicaoAberta(false);
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
            width: Math.min(windowWidth * 0.96, 1220),
            height: Math.min(windowHeight * 0.94, 900),
          },
        ]}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerCode}>S26.10-R3</Text>
            <Text style={styles.headerTitle}>Central de Referências</Text>
            <Text style={styles.headerSubtitle}>
              Pesquise, revise e administre os pontos de referência usados na cartografia do Mall.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 4 CARDS SUPERIORES DE MÉTRICAS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalTodas}</Text>
            <Text style={styles.metricCardLabel}>Todas</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalAtivas}</Text>
            <Text style={styles.metricCardLabel}>Ativas</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalInativas}</Text>
            <Text style={styles.metricCardLabel}>Inativas</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalConfirmadas}</Text>
            <Text style={styles.metricCardLabel}>Confirmadas</Text>
          </View>
        </View>

        {/* CORPO PRINCIPAL COM SCROLL */}
        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* BARRA DE FILTROS AVANÇADOS */}
          <View style={styles.filtersContainer}>
            {/* PESQUISAR */}
            <View style={[styles.filterField, { flex: 1.8 }]}>
              <Text style={styles.filterLabel}>Pesquisar</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Nome, descrição, tipo, subtipo ou ID"
                placeholderTextColor="#94a3b8"
                value={pesquisa}
                onChangeText={setPesquisa}
              />
            </View>

            {/* MAPA / SETOR */}
            <View style={[styles.filterField, { flex: 1 }]}>
              <Text style={styles.filterLabel}>Mapa / setor</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={filtroSetor}
                  onChange={(e) => setFiltroSetor(e.target.value)}
                  style={styles.webSelectStyle}
                >
                  <option value="TODOS">Todos</option>
                  <option value="MAP-CFF-N1-AZUL">Setor Azul</option>
                  <option value="MAP-CFF-N1-VERDE">Setor Verde</option>
                  <option value="MAP-CFF-N2-BRANCO">Setor Branco</option>
                  <option value="MAP-CFF-N2-AMARELO">Setor Amarelo</option>
                  <option value="MAP-CFF-N3-ROXO">Setor Roxo</option>
                  <option value="PLA-CFF-N1-2025">Nível 1</option>
                  <option value="PLA-CFF-N2-2025">Nível 2</option>
                  <option value="PLA-CFF-N3-2025">Nível 3</option>
                  <option value="PLA-CFF-N0-2025">Nível 0</option>
                </select>
              ) : (
                <View style={styles.filterInput}>
                  <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroSetor}</Text>
                </View>
              )}
            </View>

            {/* TIPO */}
            <View style={[styles.filterField, { flex: 1 }]}>
              <Text style={styles.filterLabel}>Tipo</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  style={styles.webSelectStyle}
                >
                  <option value="TODOS">Todos</option>
                  <option value="SERVICO">SERVICO</option>
                  <option value="CIRCULACAO">CIRCULACAO</option>
                  <option value="ALIMENTACAO">ALIMENTACAO</option>
                  <option value="QUIOSQUE">QUIOSQUE</option>
                  <option value="AREA_ESPECIAL">AREA_ESPECIAL</option>
                  <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                  <option value="APOIO">APOIO</option>
                  <option value="OUTRO">OUTRO</option>
                </select>
              ) : (
                <View style={styles.filterInput}>
                  <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroTipo}</Text>
                </View>
              )}
            </View>

            {/* SUBTIPO */}
            <View style={[styles.filterField, { flex: 1 }]}>
              <Text style={styles.filterLabel}>Subtipo</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={filtroSubtipo}
                  onChange={(e) => setFiltroSubtipo(e.target.value)}
                  style={styles.webSelectStyle}
                >
                  <option value="TODOS">Todos</option>
                  {subtiposDisponiveis.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              ) : (
                <View style={styles.filterInput}>
                  <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroSubtipo}</Text>
                </View>
              )}
            </View>

            {/* STATUS */}
            <View style={[styles.filterField, { width: 100 }]}>
              <Text style={styles.filterLabel}>Status</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={filtroStatus}
                  onChange={(e) =>
                    setFiltroStatus(e.target.value as 'TODAS' | 'ATIVAS' | 'INATIVAS')
                  }
                  style={styles.webSelectStyle}
                >
                  <option value="ATIVAS">Ativas</option>
                  <option value="INATIVAS">Inativas</option>
                  <option value="TODAS">Todas</option>
                </select>
              ) : (
                <View style={styles.filterInput}>
                  <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroStatus}</Text>
                </View>
              )}
            </View>

            {/* CONFIRMAÇÃO */}
            <View style={[styles.filterField, { width: 110 }]}>
              <Text style={styles.filterLabel}>Confirmação</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={filtroConfirmacao}
                  onChange={(e) =>
                    setFiltroConfirmacao(
                      e.target.value as 'TODAS' | 'CONFIRMADAS' | 'NAO_CONFIRMADAS'
                    )
                  }
                  style={styles.webSelectStyle}
                >
                  <option value="TODAS">Todas</option>
                  <option value="CONFIRMADAS">Confirmadas</option>
                  <option value="NAO_CONFIRMADAS">Não confirmadas</option>
                </select>
              ) : (
                <View style={styles.filterInput}>
                  <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroConfirmacao}</Text>
                </View>
              )}
            </View>

            {/* BOTÃO ATUALIZAR */}
            <View style={{ justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={styles.btnAtualizar}
                onPress={() => {
                  setPesquisa('');
                  setFiltroSetor('TODOS');
                  setFiltroTipo('TODOS');
                  setFiltroSubtipo('TODOS');
                  setFiltroStatus('ATIVAS');
                  setFiltroConfirmacao('TODAS');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.btnAtualizarText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LINHA DE CONTAGEM E BOTÃO + NOVA REFERÊNCIA */}
          <View style={styles.actionHeaderRow}>
            <View>
              <Text style={styles.referenciasTitle}>Referências</Text>
              <Text style={styles.referenciasSubtitle}>
                {listaFiltrada.length} resultado(s) • {totalTodas} referência(s) cadastrada(s)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnNovaReferencia}
              onPress={handleNovaReferencia}
              activeOpacity={0.8}
            >
              <Text style={styles.btnNovaReferenciaText}>+ Nova referência</Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE CARDS DE REFERÊNCIAS */}
          <View style={styles.cardsList}>
            {listaFiltrada.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma referência encontrada com os filtros selecionados.</Text>
              </View>
            ) : (
              listaFiltrada.map((ref) => {
                const nomeSetor = SETORES_MAPA[ref.idMapaSetor] || ref.idMapaSetor;

                return (
                  <View key={ref.id} style={styles.cardItem}>
                    {/* LINHA 1: TÍTULO + ID */}
                    <View style={styles.cardHeaderRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
                        <Text style={styles.cardItemNome}>{ref.nome}</Text>
                        <Text style={styles.cardItemId}>{ref.id}</Text>
                      </View>
                    </View>

                    {/* LINHA 2: BADGES */}
                    <View style={styles.badgesRow}>
                      {ref.ativo ? (
                        <View style={styles.badgeAtiva}>
                          <Text style={styles.badgeAtivaText}>ATIVA</Text>
                        </View>
                      ) : (
                        <View style={styles.badgeInativa}>
                          <Text style={styles.badgeInativaText}>INATIVA</Text>
                        </View>
                      )}

                      {ref.confirmada ? (
                        <View style={styles.badgeConfirmada}>
                          <Text style={styles.badgeConfirmadaText}>CONFIRMADA</Text>
                        </View>
                      ) : (
                        <View style={styles.badgeNaoConfirmada}>
                          <Text style={styles.badgeNaoConfirmadaText}>NÃO CONFIRMADA</Text>
                        </View>
                      )}

                      <View style={styles.badgeStatus}>
                        <Text style={styles.badgeStatusText}>
                          {ref.status || 'VALIDADO'}
                        </Text>
                      </View>
                    </View>

                    {/* LINHA 3: DESCRIÇÃO */}
                    {Boolean(ref.descricao) && (
                      <Text style={styles.cardDescricao}>{ref.descricao}</Text>
                    )}

                    {/* LINHA 4: LOCALIZAÇÃO */}
                    {Boolean(ref.localizacaoTexto) && (
                      <View style={styles.localizacaoBox}>
                        <View style={styles.localizacaoBar} />
                        <View style={{ flex: 1, paddingLeft: 6 }}>
                          <Text style={styles.localizacaoLabel}>LOCALIZAÇÃO</Text>
                          <Text style={styles.localizacaoText}>{ref.localizacaoTexto}</Text>
                        </View>
                      </View>
                    )}

                    {/* LINHA 5: METADADOS TÉCNICOS + BOTÕES DE AÇÃO */}
                    <View style={styles.cardFooterRow}>
                      {/* 4 COLUNAS DE METADADOS */}
                      <View style={styles.metaColsContainer}>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaColLabel}>MAPA</Text>
                          <Text style={styles.metaColValue}>{nomeSetor}</Text>
                        </View>

                        <View style={styles.metaCol}>
                          <Text style={styles.metaColLabel}>TIPO</Text>
                          <Text style={styles.metaColValue}>{ref.tipo || 'SERVICO'}</Text>
                        </View>

                        <View style={styles.metaCol}>
                          <Text style={styles.metaColLabel}>SUBTIPO</Text>
                          <Text style={styles.metaColValue}>{ref.subtipo || '—'}</Text>
                        </View>

                        <View style={styles.metaCol}>
                          <Text style={styles.metaColLabel}>COORDENADA TÉCNICA</Text>
                          <Text style={styles.metaColValue}>
                            X {ref.x.toFixed(5)} • Y {ref.y.toFixed(5)}
                          </Text>
                        </View>
                      </View>

                      {/* BOTÕES DE AÇÃO À DIREITA */}
                      <View style={styles.cardActionsGroup}>
                        <TouchableOpacity
                          style={styles.btnAction}
                          onPress={() => handleAbrirEdicao(ref)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.btnActionText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnAction}
                          onPress={() => {
                            if (onReposicionarNoMapa) {
                              onReposicionarNoMapa(ref);
                              onClose();
                            } else {
                              alert(`Modo reposicionar ativado para: ${ref.nome}`);
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.btnActionText}>Reposicionar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.btnAction}
                          onPress={() => handleToggleAtivo(ref)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.btnActionText}>
                            {ref.ativo ? 'Desativar' : 'Ativar'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* SUBMODAL EDITAR / NOVA REFERÊNCIA */}
        {modalEdicaoAberta && refEmEdicao && (
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContainer}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>
                  {refEmEdicao.nome ? `Editar: ${refEmEdicao.nome}` : 'Nova Referência Cartográfica'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalEdicaoAberta(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
                <View style={{ gap: 4 }}>
                  <Text style={styles.formLabel}>Nome da referência *</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Ex.: Acesso ao elevador torre 2"
                    value={refEmEdicao.nome || ''}
                    onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, nome: txt }))}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={styles.formLabel}>Descrição</Text>
                  <TextInput
                    style={[styles.filterInput, { height: 50 }]}
                    multiline
                    placeholder="Ex.: Próximo aos caixas eletrônicos"
                    value={refEmEdicao.descricao || ''}
                    onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, descricao: txt }))}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={styles.formLabel}>Texto de Localização Oficial</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Ex.: Rua Princesa Isabel — Loja 1309"
                    value={refEmEdicao.localizacaoTexto || ''}
                    onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, localizacaoTexto: txt }))}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>Tipo</Text>
                    {Platform.OS === 'web' ? (
                      <select
                        value={refEmEdicao.tipo || 'SERVICO'}
                        onChange={(e) => setRefEmEdicao((p) => ({ ...p, tipo: e.target.value }))}
                        style={styles.webSelectStyle}
                      >
                        <option value="SERVICO">SERVICO</option>
                        <option value="CIRCULACAO">CIRCULACAO</option>
                        <option value="ALIMENTACAO">ALIMENTACAO</option>
                        <option value="QUIOSQUE">QUIOSQUE</option>
                        <option value="AREA_ESPECIAL">AREA_ESPECIAL</option>
                        <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                        <option value="APOIO">APOIO</option>
                        <option value="OUTRO">OUTRO</option>
                      </select>
                    ) : null}
                  </View>

                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>Subtipo</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Ex.: ELEVADOR, SAUDE"
                      value={refEmEdicao.subtipo || ''}
                      onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, subtipo: txt }))}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>Coordenada X (0 a 1)</Text>
                    <TextInput
                      style={styles.filterInput}
                      keyboardType="numeric"
                      value={String(refEmEdicao.x ?? 0.5)}
                      onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, x: parseFloat(txt) || 0 }))}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>Coordenada Y (0 a 1)</Text>
                    <TextInput
                      style={styles.filterInput}
                      keyboardType="numeric"
                      value={String(refEmEdicao.y ?? 0.5)}
                      onChangeText={(txt) => setRefEmEdicao((p) => ({ ...p, y: parseFloat(txt) || 0 }))}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={styles.btnAtualizar}
                  onPress={() => setModalEdicaoAberta(false)}
                >
                  <Text style={styles.btnAtualizarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnNovaReferencia}
                  onPress={handleSalvarEdicao}
                >
                  <Text style={styles.btnNovaReferenciaText}>Salvar referência</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 14,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  metricCardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterField: {
    gap: 4,
    minWidth: 110,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterInput: {
    height: 36,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  webSelectStyle: {
    height: 36,
    paddingLeft: 10,
    paddingRight: 24,
    fontSize: 12,
    color: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    fontWeight: '500',
    width: '100%',
  },
  btnAtualizar: {
    height: 36,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAtualizarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  actionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  referenciasTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  referenciasSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  btnNovaReferencia: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNovaReferenciaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardsList: {
    gap: 12,
    paddingBottom: 20,
  },
  cardItem: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 16,
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardItemNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardItemId: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badgeAtiva: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAtivaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: 0.5,
  },
  badgeInativa: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeInativaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991b1b',
    letterSpacing: 0.5,
  },
  badgeConfirmada: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeConfirmadaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  badgeNaoConfirmada: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeNaoConfirmadaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  badgeStatus: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  cardDescricao: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  localizacaoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  localizacaoBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#ec4899',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  localizacaoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#be185d',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  localizacaoText: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metaColsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    flex: 1,
  },
  metaCol: {
    gap: 2,
  },
  metaColLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  metaColValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
  },
  cardActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnAction: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  subModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  subModalContainer: {
    width: 480,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  subModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
});

export default CentralReferenciasModal;
