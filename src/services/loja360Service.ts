/**
 * Serviço Loja 360 - Centro Fashion
 * Paridade com Loja360Service.gs e LojaMapaService.gs
 */

export interface ContatoLoja {
  id: string;
  nome: string;
  funcao: string;
  tipo: 'OPERACIONAL' | 'COMERCIAL' | 'EMERGENCIA' | 'FINANCEIRO';
  telefone: string;
  whatsapp: string;
  email: string;
  principal: boolean;
}

export interface OcorrenciaVinculada {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'VALIDACAO' | 'CONCLUIDA' | 'CANCELADA';
  setorResponsavel: string;
  criadoEm: string;
  concluidoEm?: string;
}

export interface HistoricoOcupacao {
  id: string;
  inicio: string;
  fim?: string;
  responsavel: string;
  motivoEncerramento?: string;
  atual: boolean;
}

export interface FichaLoja360 {
  idLojaMapa: string;
  idLoja?: string;
  numeroLoja: string;
  nomeLoja: string;
  razaoSocial?: string;
  cnpj?: string;
  luc?: string;
  tipoUnidade: 'LOJA' | 'BOX' | 'QUIOSQUE' | 'DEPOSITO' | 'ALIMENTACAO';
  segmentoPrincipal: string;
  statusOperacao: 'ATIVA' | 'FECHADA' | 'REFORMA' | 'DESOCUPADA';
  setor: string;
  corredor: string;
  ladoCorredor: string;
  x: number;
  y: number;
  contatos: ContatoLoja[];
  ocorrencias: OcorrenciaVinculada[];
  historicoOcupacoes: HistoricoOcupacao[];
  indicadores: {
    ocorrenciasAbertas: number;
    ocorrenciasTotal: number;
    taxaResolucao: number;
  };
}

// Dados mock baseados nos 4954 boxes do Centro Fashion
const LOJAS_MOCK: FichaLoja360[] = [
  {
    idLojaMapa: 'LMP-AZ-1176',
    idLoja: 'LOJ-DEMO-001',
    numeroLoja: '1176',
    nomeLoja: 'Moda Aurora',
    razaoSocial: 'Moda Aurora Comércio de Confecções Ltda.',
    cnpj: '00.000.001/0001-10',
    luc: 'LUC-1176',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Feminina',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'DIREITO',
    x: 0.1072,
    y: 0.1063,
    contatos: [
      {
        id: 'CONT-1',
        nome: 'Maria Aurora Silva',
        funcao: 'Proprietária / Responsável',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1001',
        whatsapp: '5585990001001',
        email: 'aurora@modafashion.com.br',
        principal: true,
      },
      {
        id: 'CONT-2',
        nome: 'Carlos Eduardo',
        funcao: 'Gerente da Loja',
        tipo: 'COMERCIAL',
        telefone: '(85) 98888-1176',
        whatsapp: '5585988881176',
        email: 'gerencia@modafashion.com.br',
        principal: false,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-101',
        protocolo: 'CF-2026-0891',
        titulo: 'Infiltração no teto próximo ao painel',
        descricao: 'Goteira identificada após fortes chuvas, risco na fiação.',
        prioridade: 'ALTA',
        status: 'EM_ANDAMENTO',
        setorResponsavel: 'Manutenção Predial',
        criadoEm: '2026-09-04 09:15',
      },
      {
        id: 'OC-094',
        protocolo: 'CF-2026-0812',
        titulo: 'Troca de lâmpada do corredor em frente ao box',
        descricao: 'Substituição por refletor de LED.',
        prioridade: 'BAIXA',
        status: 'CONCLUIDA',
        setorResponsavel: 'Elétrica',
        criadoEm: '2026-08-20 14:00',
        concluidoEm: '2026-08-21 11:30',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-1',
        inicio: '2024-01-10',
        responsavel: 'Maria Aurora Silva',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 2,
      taxaResolucao: 50,
    },
  },
  {
    idLojaMapa: 'LMP-AZ-1172',
    idLoja: 'LOJ-DEMO-002',
    numeroLoja: '1172',
    nomeLoja: 'Estilo Ceará',
    razaoSocial: 'Estilo Nordestino Artigos de Moda Eireli',
    cnpj: '00.000.002/0001-20',
    luc: 'LUC-1172',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Masculina',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'ESQUERDO',
    x: 0.1245,
    y: 0.1189,
    contatos: [
      {
        id: 'CONT-3',
        nome: 'Francisco José Lima',
        funcao: 'Lojista Titular',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1002',
        whatsapp: '5585990001002',
        email: 'estiloceara@lojas.com.br',
        principal: true,
      },
    ],
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-2',
        inicio: '2023-06-15',
        responsavel: 'Francisco José Lima',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-AM-1104',
    idLoja: 'LOJ-DEMO-003',
    numeroLoja: '1104',
    nomeLoja: 'Vitrine Urbana',
    razaoSocial: 'Vitrine Urbana Varejo Fashion Ltda.',
    cnpj: '00.000.003/0001-30',
    luc: 'LUC-1104',
    tipoUnidade: 'LOJA',
    segmentoPrincipal: 'Moda Feminina & Jeans',
    statusOperacao: 'ATIVA',
    setor: 'Setor Amarelo - Piso 1',
    corredor: 'Corredor Central Amarelo',
    ladoCorredor: 'DIREITO',
    x: 0.2830,
    y: 0.3540,
    contatos: [
      {
        id: 'CONT-4',
        nome: 'Renata Vasconcelos',
        funcao: 'Sócia Gerente',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1003',
        whatsapp: '5585990001003',
        email: 'renata@vitrineurbana.com.br',
        principal: true,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-105',
        protocolo: 'CF-2026-0902',
        titulo: 'Disjuntor desarmando em pico de consumo',
        descricao: 'Queda de energia no circuito interno das tomadas.',
        prioridade: 'CRITICA',
        status: 'ABERTA',
        setorResponsavel: 'Elétrica',
        criadoEm: '2026-09-06 08:30',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-3',
        inicio: '2022-11-01',
        responsavel: 'Renata Vasconcelos',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 1,
      taxaResolucao: 0,
    },
  },
  {
    idLojaMapa: 'LMP-VD-2045',
    idLoja: 'LOJ-DEMO-004',
    numeroLoja: '2045',
    nomeLoja: 'Cores do Verão',
    razaoSocial: 'Praia & Sol Confecções ME',
    cnpj: '00.000.004/0001-40',
    luc: 'LUC-2045',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Praia & Fitness',
    statusOperacao: 'ATIVA',
    setor: 'Setor Verde - Piso 2',
    corredor: 'Rua do Sol',
    ladoCorredor: 'DIREITO',
    x: 0.4120,
    y: 0.2180,
    contatos: [
      {
        id: 'CONT-5',
        nome: 'Juliana Castro',
        funcao: 'Proprietária',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-2045',
        whatsapp: '5585990002045',
        email: 'juliana@coresdoverao.com.br',
        principal: true,
      },
    ],
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-4',
        inicio: '2025-02-01',
        responsavel: 'Juliana Castro',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-RX-3120',
    idLoja: 'LOJ-DEMO-005',
    numeroLoja: '3120',
    nomeLoja: 'Espaço em Reforma (Box 3120)',
    razaoSocial: 'Centro Fashion Gestão Predial',
    cnpj: '00.000.000/0001-00',
    luc: 'LUC-3120',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Acessórios & Bijuterias',
    statusOperacao: 'REFORMA',
    setor: 'Setor Roxo - Piso 1',
    corredor: 'Alameda das Flores',
    ladoCorredor: 'ESQUERDO',
    x: 0.5890,
    y: 0.4410,
    contatos: [
      {
        id: 'CONT-6',
        nome: 'Engenharia Operacional CF',
        funcao: 'Fiscal de Obras',
        tipo: 'EMERGENCIA',
        telefone: '(85) 3000-0000',
        whatsapp: '5585999990000',
        email: 'obras@centrofashion.com.br',
        principal: true,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-108',
        protocolo: 'CF-2026-0915',
        titulo: 'Vistoria pré-inauguração de mezanino',
        descricao: 'Verificação da estrutura metálica e extintor.',
        prioridade: 'MEDIA',
        status: 'EM_ANALISE',
        setorResponsavel: 'Segurança & Engenharia',
        criadoEm: '2026-09-05 16:45',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-5',
        inicio: '2026-08-15',
        responsavel: 'Engenharia CF',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 1,
      taxaResolucao: 0,
    },
  },
];

export const Loja360Service = {
  /**
   * Lista todas as lojas/boxes disponíveis
   */
  listarLojas(filtro?: { termo?: string; setor?: string; status?: string }): FichaLoja360[] {
    let resultado = [...LOJAS_MOCK];

    if (filtro?.termo) {
      const termoLimpo = filtro.termo.toLowerCase().trim();
      resultado = resultado.filter(
        (l) =>
          l.numeroLoja.toLowerCase().includes(termoLimpo) ||
          l.nomeLoja.toLowerCase().includes(termoLimpo) ||
          l.segmentoPrincipal.toLowerCase().includes(termoLimpo) ||
          l.corredor.toLowerCase().includes(termoLimpo) ||
          l.contatos.some((c) => c.nome.toLowerCase().includes(termoLimpo))
      );
    }

    if (filtro?.setor && filtro.setor !== 'TODOS') {
      resultado = resultado.filter((l) => l.setor.toLowerCase().includes(filtro.setor!.toLowerCase()));
    }

    if (filtro?.status && filtro.status !== 'TODOS') {
      resultado = resultado.filter((l) => l.statusOperacao === filtro.status);
    }

    return resultado;
  },

  /**
   * Obtém a ficha detalhada de uma loja por idLojaMapa ou número do box
   */
  obterFicha(identificador: string): FichaLoja360 | null {
    const idLimpo = identificador.trim().toLowerCase();
    const loja = LOJAS_MOCK.find(
      (l) => l.idLojaMapa.toLowerCase() === idLimpo || l.numeroLoja.toLowerCase() === idLimpo
    );

    if (loja) return loja;

    // Se for uma busca por número de box não cadastrado no mock, gera a ficha dinâmica
    if (/^\d+$/.test(idLimpo)) {
      return {
        idLojaMapa: `LMP-GEN-${idLimpo}`,
        numeroLoja: identificador,
        nomeLoja: `Box ${identificador}`,
        tipoUnidade: 'BOX',
        segmentoPrincipal: 'Moda & Acessórios',
        statusOperacao: 'ATIVA',
        setor: 'Setor Geral - Piso 1',
        corredor: 'Corredor Geral',
        ladoCorredor: 'PADRAO',
        x: 0.5,
        y: 0.5,
        contatos: [
          {
            id: `CONT-${idLimpo}`,
            nome: `Lojista Box ${identificador}`,
            funcao: 'Responsável Operacional',
            tipo: 'OPERACIONAL',
            telefone: '(85) 3000-0000',
            whatsapp: '5585990000000',
            email: `box${identificador}@centrofashion.com.br`,
            principal: true,
          },
        ],
        ocorrencias: [],
        historicoOcupacoes: [
          {
            id: `OCUP-${idLimpo}`,
            inicio: '2026-01-01',
            responsavel: `Lojista Box ${identificador}`,
            atual: true,
          },
        ],
        indicadores: {
          ocorrenciasAbertas: 0,
          ocorrenciasTotal: 0,
          taxaResolucao: 100,
        },
      };
    }

    return null;
  },
};
