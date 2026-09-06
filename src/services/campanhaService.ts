/**
 * Serviço de Campanhas de Marketing do Centro Fashion
 * Paridade com L2.3, L2.4, L2.4.1 e L2.5 (Gestão de Lojistas e Campanhas no Mapa)
 */

export type StatusAdesaoCampanha =
  | 'CONFIRMADA'
  | 'INTERESSADA'
  | 'CONTATADA'
  | 'NAO_CONTATADA'
  | 'NAO_PARTICIPARA';

export interface CampanhaMarketing {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  tipo: 'MEGA_PROMOCAO' | 'LIQUIDACAO' | 'SAZONAL' | 'BAZAR';
  dataInicio: string;
  dataFim: string;
  metaLojas: number;
  status: 'ATIVA' | 'PLANEJADA' | 'ENCERRADA';
  linkRegulamento?: string;
}

export interface ParticipacaoLojaCampanha {
  idParticipacao: string;
  idCampanha: string;
  idLojaMapa: string;
  numeroBox: string;
  nomeLoja: string;
  segmento: string;
  setor: string;
  corredor: string;
  status: StatusAdesaoCampanha;
  dataContato?: string;
  regulamentoAceito: boolean;
  produtosOfertasCount: number;
  observacao?: string;
  contatoNome?: string;
}

export const CORES_STATUS_CAMPANHA: Record<
  StatusAdesaoCampanha,
  { bg: string; text: string; label: string; markerColor: string }
> = {
  CONFIRMADA: {
    bg: '#065f46',
    text: '#34d399',
    label: 'Confirmada',
    markerColor: '#10b981', // Verde esmeralda
  },
  INTERESSADA: {
    bg: '#854d0e',
    text: '#facc15',
    label: 'Interessada / Aguardando',
    markerColor: '#f59e0b', // Âmbar
  },
  CONTATADA: {
    bg: '#1e3a8a',
    text: '#60a5fa',
    label: 'Contatada',
    markerColor: '#3b82f6', // Azul
  },
  NAO_CONTATADA: {
    bg: '#334155',
    text: '#94a3b8',
    label: 'Não Contatada',
    markerColor: '#64748b', // Cinza ardósia
  },
  NAO_PARTICIPARA: {
    bg: '#991b1b',
    text: '#f87171',
    label: 'Não Participará',
    markerColor: '#ef4444', // Vermelho
  },
};

const CAMPANHAS_MOCK: CampanhaMarketing[] = [
  {
    id: 'CAMP-001',
    codigo: 'BAZAR-2026',
    nome: 'Bazar Centro Fashion 2026',
    descricao: 'Grande queima de estoque de atacado e varejo com descontos de até 70%.',
    tipo: 'BAZAR',
    dataInicio: '2026-09-20',
    dataFim: '2026-09-30',
    metaLojas: 300,
    status: 'ATIVA',
  },
  {
    id: 'CAMP-002',
    codigo: 'BF-2026',
    nome: 'Black Friday Centro Fashion 2026',
    descricao: 'Mega promoção anual de Black Friday em todos os setores do mall.',
    tipo: 'MEGA_PROMOCAO',
    dataInicio: '2026-11-25',
    dataFim: '2026-11-30',
    metaLojas: 500,
    status: 'PLANEJADA',
  },
  {
    id: 'CAMP-003',
    codigo: 'LIQ-JEANS-2026',
    nome: 'Liquida Jeans & Moda Outono',
    descricao: 'Festival de confecções de jeans com condições especiais para sacoleiros e lojistas.',
    tipo: 'LIQUIDACAO',
    dataInicio: '2026-08-15',
    dataFim: '2026-09-15',
    metaLojas: 200,
    status: 'ATIVA',
  },
  {
    id: 'CAMP-004',
    codigo: 'PRAIA-2026',
    nome: 'Festival da Moda Praia & Fitness',
    descricao: 'Apresentação das coleções de moda praia e fitness para a alta estação.',
    tipo: 'SAZONAL',
    dataInicio: '2026-10-10',
    dataFim: '2026-10-20',
    metaLojas: 150,
    status: 'PLANEJADA',
  },
];

// Dados iniciais de adesão para as lojas e boxes conhecidos
const PARTICIPACOES_MOCK: Record<string, ParticipacaoLojaCampanha[]> = {
  'CAMP-001': [
    {
      idParticipacao: 'PART-001',
      idCampanha: 'CAMP-001',
      idLojaMapa: '1',
      numeroBox: '1176',
      nomeLoja: 'Moda Aurora',
      segmento: 'Moda Feminina',
      setor: 'Setor Azul',
      corredor: 'Rua Governador Sampaio',
      status: 'CONFIRMADA',
      dataContato: '2026-09-02',
      regulamentoAceito: true,
      produtosOfertasCount: 5,
      observacao: 'Ofertas de vestidos e blusas de atacado confirmadas.',
      contatoNome: 'Maria Aurora Silva',
    },
    {
      idParticipacao: 'PART-002',
      idCampanha: 'CAMP-001',
      idLojaMapa: '2',
      numeroBox: '1172',
      nomeLoja: 'Estilo Ceará',
      segmento: 'Moda Masculina',
      setor: 'Setor Azul',
      corredor: 'Rua Governador Sampaio',
      status: 'INTERESSADA',
      dataContato: '2026-09-04',
      regulamentoAceito: false,
      produtosOfertasCount: 2,
      observacao: 'Aguardando aprovação da gerência para envio da lista de bermudas.',
      contatoNome: 'Francisco José Lima',
    },
    {
      idParticipacao: 'PART-003',
      idCampanha: 'CAMP-001',
      idLojaMapa: '3',
      numeroBox: '1104',
      nomeLoja: 'Vitrine Urbana',
      segmento: 'Moda Feminina',
      setor: 'Setor Amarelo',
      corredor: 'Corredor Central Amarelo',
      status: 'CONTATADA',
      dataContato: '2026-09-05',
      regulamentoAceito: false,
      produtosOfertasCount: 0,
      observacao: 'Ficha entregue, lojista verificando estoque.',
      contatoNome: 'Renata Vasconcelos',
    },
    {
      idParticipacao: 'PART-004',
      idCampanha: 'CAMP-001',
      idLojaMapa: '4',
      numeroBox: '2045',
      nomeLoja: 'Cores do Verão',
      segmento: 'Moda Praia',
      setor: 'Setor Verde',
      corredor: 'Rua do Sol',
      status: 'CONFIRMADA',
      dataContato: '2026-09-01',
      regulamentoAceito: true,
      produtosOfertasCount: 4,
      observacao: 'Confirmou participação com 4 conjuntos de biquíni.',
      contatoNome: 'Juliana Castro',
    },
    {
      idParticipacao: 'PART-005',
      idCampanha: 'CAMP-001',
      idLojaMapa: '5',
      numeroBox: '3120',
      nomeLoja: 'Espaço em Reforma',
      segmento: 'Acessórios',
      setor: 'Setor Roxo',
      corredor: 'Alameda das Flores',
      status: 'NAO_PARTICIPARA',
      dataContato: '2026-09-03',
      regulamentoAceito: false,
      produtosOfertasCount: 0,
      observacao: 'Loja estará em obras de mezanino durante o período do bazar.',
      contatoNome: 'Engenharia CF',
    },
    {
      idParticipacao: 'PART-006',
      idCampanha: 'CAMP-001',
      idLojaMapa: '6',
      numeroBox: '1288',
      nomeLoja: 'Estilo Fashion Kids',
      segmento: 'Moda Infantil',
      setor: 'Setor Azul',
      corredor: 'Rua General Bezerril',
      status: 'INTERESSADA',
      dataContato: '2026-09-05',
      regulamentoAceito: false,
      produtosOfertasCount: 3,
      observacao: 'Interessada na promoção de dia das crianças e bazar.',
      contatoNome: 'Davidsilva • Operações',
    },
  ],
  'CAMP-003': [
    {
      idParticipacao: 'PART-101',
      idCampanha: 'CAMP-003',
      idLojaMapa: '1',
      numeroBox: '1176',
      nomeLoja: 'Moda Aurora',
      segmento: 'Moda Feminina',
      setor: 'Setor Azul',
      corredor: 'Rua Governador Sampaio',
      status: 'CONFIRMADA',
      dataContato: '2026-08-14',
      regulamentoAceito: true,
      produtosOfertasCount: 8,
      observacao: 'Participando ativamente da Liquidação de Jeans.',
      contatoNome: 'Maria Aurora Silva',
    },
    {
      idParticipacao: 'PART-102',
      idCampanha: 'CAMP-003',
      idLojaMapa: '2',
      numeroBox: '1172',
      nomeLoja: 'Estilo Ceará',
      segmento: 'Moda Masculina',
      setor: 'Setor Azul',
      corredor: 'Rua Governador Sampaio',
      status: 'NAO_CONTATADA',
      regulamentoAceito: false,
      produtosOfertasCount: 0,
      contatoNome: 'Francisco José Lima',
    },
  ],
};

export const CampanhaService = {
  listarCampanhas(): CampanhaMarketing[] {
    return [...CAMPANHAS_MOCK];
  },

  obterCampanha(id: string): CampanhaMarketing | null {
    return CAMPANHAS_MOCK.find((c) => c.id === id || c.codigo === id) || null;
  },

  listarParticipacoes(
    campanhaId: string,
    filtro?: { status?: string; termo?: string; setor?: string }
  ): ParticipacaoLojaCampanha[] {
    let lista = PARTICIPACOES_MOCK[campanhaId] || [];

    if (filtro?.status && filtro.status !== 'TODOS') {
      lista = lista.filter((p) => p.status === filtro.status);
    }

    if (filtro?.setor && filtro.setor !== 'TODOS') {
      lista = lista.filter((p) => p.setor.toLowerCase().includes(filtro.setor!.toLowerCase()));
    }

    if (filtro?.termo) {
      const t = filtro.termo.toLowerCase().trim();
      lista = lista.filter(
        (p) =>
          p.numeroBox.toLowerCase().includes(t) ||
          p.nomeLoja.toLowerCase().includes(t) ||
          p.segmento.toLowerCase().includes(t) ||
          p.corredor.toLowerCase().includes(t) ||
          (p.contatoNome && p.contatoNome.toLowerCase().includes(t))
      );
    }

    return lista;
  },

  /**
   * Retorna um mapa de ID_LOJA_MAPA -> Status e Cor para renderização no mapa interativo
   */
  obterMapaCoresAdesao(campanhaId: string): Record<string, { status: StatusAdesaoCampanha; cor: string; label: string }> {
    const participacoes = PARTICIPACOES_MOCK[campanhaId] || [];
    const mapaCores: Record<string, { status: StatusAdesaoCampanha; cor: string; label: string }> = {};

    participacoes.forEach((p) => {
      const info = CORES_STATUS_CAMPANHA[p.status] || CORES_STATUS_CAMPANHA.NAO_CONTATADA;
      mapaCores[p.idLojaMapa] = {
        status: p.status,
        cor: info.markerColor,
        label: info.label,
      };
    });

    return mapaCores;
  },

  obterMetricasCampanha(campanhaId: string) {
    const participacoes = PARTICIPACOES_MOCK[campanhaId] || [];
    const total = participacoes.length;
    const confirmadas = participacoes.filter((p) => p.status === 'CONFIRMADA').length;
    const interessadas = participacoes.filter((p) => p.status === 'INTERESSADA').length;
    const contatadas = participacoes.filter((p) => p.status === 'CONTATADA').length;
    const naoContatadas = participacoes.filter((p) => p.status === 'NAO_CONTATADA').length;
    const naoParticipara = participacoes.filter((p) => p.status === 'NAO_PARTICIPARA').length;
    const taxaAdesao = total > 0 ? Math.round((confirmadas / total) * 100) : 0;

    return {
      total,
      confirmadas,
      interessadas,
      contatadas,
      naoContatadas,
      naoParticipara,
      taxaAdesao,
    };
  },

  atualizarStatusAdesao(
    campanhaId: string,
    idLojaMapa: string,
    novoStatus: StatusAdesaoCampanha,
    observacao?: string
  ): boolean {
    const lista = PARTICIPACOES_MOCK[campanhaId];
    if (!lista) return false;

    const item = lista.find((p) => p.idLojaMapa === idLojaMapa);
    if (item) {
      item.status = novoStatus;
      if (observacao) item.observacao = observacao;
      if (novoStatus === 'CONFIRMADA') item.regulamentoAceito = true;
      item.dataContato = new Date().toISOString().slice(0, 10);
      return true;
    }
    return false;
  },
};
