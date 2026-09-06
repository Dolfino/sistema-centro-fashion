/**
 * Serviço de Gestão de Ativos do Mall & Mídia Física
 * Paridade com AtivoMallService.gs, AuditoriaMidiaService.gs, MidiaMallService.gs e PontoMidiaService.gs
 */

export type TipoEstruturaMidia =
  | 'TOTEM_DIGITAL'
  | 'PAINEL_LED'
  | 'LONA_AEREA'
  | 'CANCELA_ESTACIONAMENTO'
  | 'ADESIVO_PISO'
  | 'BANNER_FACHADA';

export type StatusValidadeMidia = 'VIGENTE' | 'VENCE_HOJE' | 'VENCIDA' | 'DISPONIVEL';

export type CondicaoFisica = 'BOA' | 'REGULAR' | 'DANIFICADA';

export interface VistoriaMidiaItem {
  id: string;
  data: string;
  auditor: string;
  condicaoVisual: CondicaoFisica;
  midiaPresente: boolean;
  statusCalculado: 'CONFORME' | 'IRREGULAR';
  observacao?: string;
}

export interface AtivoMidiaPonto {
  id: string;
  codigoPonto: string;
  nomePonto: string;
  tipoEstrutura: TipoEstruturaMidia;
  setor: string;
  corredor: string;
  referencia: string;
  dimensoes: string;
  x: number;
  y: number;
  
  // Campanha Atual
  anunciante?: string;
  tituloCampanha?: string;
  dataInicio?: string;
  dataFim?: string;
  statusValidade: StatusValidadeMidia;
  diasRestantes?: number;
  
  // Conservação & Estado Operacional
  condicaoVisual: CondicaoFisica;
  alimentacaoEletrica?: 'LIGADO' | 'DESLIGADO' | 'NA';
  statusAuditoria: 'CONFORME' | 'ALERTA_VENCIMENTO' | 'IRREGULAR' | 'PENDENTE';
  
  // Histórico
  ultimaVistoria?: string;
  historicoVistorias: VistoriaMidiaItem[];
  ocorrenciaId?: string;
}

const PONTOS_MIDIA_MOCK: AtivoMidiaPonto[] = [
  {
    id: 'PM-001',
    codigoPonto: 'TOT-AZ-01',
    nomePonto: 'Totem Digital Interativo 01',
    tipoEstrutura: 'TOTEM_DIGITAL',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Entrada Principal • Praça de Eventos',
    referencia: 'Em frente à escada rolante principal',
    dimensoes: 'Tela 55" Vertical 4K Touch',
    x: 0.15,
    y: 0.20,
    anunciante: 'Banco Bradesco',
    tituloCampanha: 'Campanha Crédito Fácil Lojista',
    dataInicio: '2026-08-01',
    dataFim: '2026-09-30',
    statusValidade: 'VIGENTE',
    diasRestantes: 24,
    condicaoVisual: 'BOA',
    alimentacaoEletrica: 'LIGADO',
    statusAuditoria: 'CONFORME',
    ultimaVistoria: '2026-09-05 14:30',
    historicoVistorias: [
      {
        id: 'VIST-101',
        data: '2026-09-05 14:30',
        auditor: 'Carlos Vistoriador',
        condicaoVisual: 'BOA',
        midiaPresente: true,
        statusCalculado: 'CONFORME',
        observacao: 'Tela limpa e touch respondendo perfeitamente.',
      },
    ],
  },
  {
    id: 'PM-002',
    codigoPonto: 'LED-AL-01',
    nomePonto: 'Painel LED Praça de Alimentação',
    tipoEstrutura: 'PAINEL_LED',
    setor: 'Setor Roxo - Piso 2',
    corredor: 'Praça de Alimentação',
    referencia: 'Parede de fundo do palco gastronômico',
    dimensoes: 'Painel LED 4x2m P2.5',
    x: 0.65,
    y: 0.35,
    anunciante: 'Coca-Cola Nordeste',
    tituloCampanha: 'Refresque seu Estilo no Centro Fashion',
    dataInicio: '2026-08-10',
    dataFim: '2026-09-10',
    statusValidade: 'VIGENTE',
    diasRestantes: 4,
    condicaoVisual: 'REGULAR',
    alimentacaoEletrica: 'LIGADO',
    statusAuditoria: 'ALERTA_VENCIMENTO',
    ultimaVistoria: '2026-09-04 11:00',
    historicoVistorias: [
      {
        id: 'VIST-102',
        data: '2026-09-04 11:00',
        auditor: 'Carlos Vistoriador',
        condicaoVisual: 'REGULAR',
        midiaPresente: true,
        statusCalculado: 'CONFORME',
        observacao: 'Campanha próxima ao vencimento (4 dias restantes).',
      },
    ],
  },
  {
    id: 'PM-003',
    codigoPonto: 'LON-AM-04',
    nomePonto: 'Lona Aérea Dupla Face - Corredor Central',
    tipoEstrutura: 'LONA_AEREA',
    setor: 'Setor Amarelo - Piso 1',
    corredor: 'Rua das Flores',
    referencia: 'Suspenso sobre o cruzamento B-12',
    dimensoes: '3.00m x 1.50m (Lona Frontlight)',
    x: 0.38,
    y: 0.42,
    anunciante: 'Jeans Ceará Fashion',
    tituloCampanha: 'Lançamento Coleção Primavera',
    dataInicio: '2026-07-01',
    dataFim: '2026-08-31',
    statusValidade: 'VENCIDA',
    diasRestantes: -6,
    condicaoVisual: 'DANIFICADA',
    alimentacaoEletrica: 'NA',
    statusAuditoria: 'IRREGULAR',
    ultimaVistoria: '2026-09-06 09:10',
    historicoVistorias: [
      {
        id: 'VIST-103',
        data: '2026-09-06 09:10',
        auditor: 'Mariana Fiscal',
        condicaoVisual: 'DANIFICADA',
        midiaPresente: true,
        statusCalculado: 'IRREGULAR',
        observacao: 'Lona com ilhós rompido no canto direito e campanha vencida há 6 dias.',
      },
    ],
  },
  {
    id: 'PM-004',
    codigoPonto: 'CAN-EST-02',
    nomePonto: 'Adesivação de Cancela - Entrada Carros 02',
    tipoEstrutura: 'CANCELA_ESTACIONAMENTO',
    setor: 'Estacionamento - Nível Térreo',
    corredor: 'Guichê de Acesso Norte',
    referencia: 'Cancela automática nº 2',
    dimensoes: 'Braço de 4.00m com adesivo refletivo',
    x: 0.82,
    y: 0.75,
    anunciante: 'Sem Parar',
    tituloCampanha: 'Passe direto sem filas no estacionamento',
    dataInicio: '2026-06-01',
    dataFim: '2026-12-31',
    statusValidade: 'VIGENTE',
    diasRestantes: 116,
    condicaoVisual: 'BOA',
    alimentacaoEletrica: 'LIGADO',
    statusAuditoria: 'CONFORME',
    ultimaVistoria: '2026-09-02 16:20',
    historicoVistorias: [
      {
        id: 'VIST-104',
        data: '2026-09-02 16:20',
        auditor: 'Carlos Vistoriador',
        condicaoVisual: 'BOA',
        midiaPresente: true,
        statusCalculado: 'CONFORME',
        observacao: 'Adesivo em perfeito estado, sensor operando normalmente.',
      },
    ],
  },
  {
    id: 'PM-005',
    codigoPonto: 'TOT-VD-03',
    nomePonto: 'Totem Digital Direcional - Setor Verde',
    tipoEstrutura: 'TOTEM_DIGITAL',
    setor: 'Setor Verde - Piso 1',
    corredor: 'Alameda Principal Verde',
    referencia: 'Próximo aos sanitários e caixa eletrônico',
    dimensoes: 'Tela 43" Vertical',
    x: 0.22,
    y: 0.68,
    statusValidade: 'DISPONIVEL',
    condicaoVisual: 'DANIFICADA',
    alimentacaoEletrica: 'DESLIGADO',
    statusAuditoria: 'IRREGULAR',
    ultimaVistoria: '2026-09-05 17:40',
    historicoVistorias: [
      {
        id: 'VIST-105',
        data: '2026-09-05 17:40',
        auditor: 'Mariana Fiscal',
        condicaoVisual: 'DANIFICADA',
        midiaPresente: false,
        statusCalculado: 'IRREGULAR',
        observacao: 'Tela sem sinal de vídeo (tela preta), sem campanha vinculada.',
      },
    ],
  },
  {
    id: 'PM-006',
    codigoPonto: 'PIS-AZ-08',
    nomePonto: 'Adesivo de Piso Direcional - Moda Praia',
    tipoEstrutura: 'ADESIVO_PISO',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    referencia: 'Em frente ao Box 1176',
    dimensoes: '1.20m x 1.20m Antiderrapante',
    x: 0.12,
    y: 0.12,
    anunciante: 'Moda Praia CF',
    tituloCampanha: 'Siga a rota do verão',
    dataInicio: '2026-08-15',
    dataFim: '2026-09-15',
    statusValidade: 'VIGENTE',
    diasRestantes: 9,
    condicaoVisual: 'REGULAR',
    alimentacaoEletrica: 'NA',
    statusAuditoria: 'CONFORME',
    ultimaVistoria: '2026-09-03 10:00',
    historicoVistorias: [
      {
        id: 'VIST-106',
        data: '2026-09-03 10:00',
        auditor: 'Mariana Fiscal',
        condicaoVisual: 'REGULAR',
        midiaPresente: true,
        statusCalculado: 'CONFORME',
        observacao: 'Desgaste leve por atrito de pedestres, legível.',
      },
    ],
  },
];

let pontosArmazenados = [...PONTOS_MIDIA_MOCK];

export const AtivoMallService = {
  listarPontos(filtros?: {
    tipo?: string;
    statusAuditoria?: string;
    termo?: string;
  }): AtivoMidiaPonto[] {
    let lista = [...pontosArmazenados];

    if (filtros?.termo) {
      const t = filtros.termo.toLowerCase().trim();
      lista = lista.filter(
        (p) =>
          p.codigoPonto.toLowerCase().includes(t) ||
          p.nomePonto.toLowerCase().includes(t) ||
          p.setor.toLowerCase().includes(t) ||
          p.corredor.toLowerCase().includes(t) ||
          (p.anunciante && p.anunciante.toLowerCase().includes(t)) ||
          (p.tituloCampanha && p.tituloCampanha.toLowerCase().includes(t))
      );
    }

    if (filtros?.tipo && filtros.tipo !== 'TODOS') {
      lista = lista.filter((p) => p.tipoEstrutura === filtros.tipo);
    }

    if (filtros?.statusAuditoria && filtros.statusAuditoria !== 'TODOS') {
      lista = lista.filter((p) => p.statusAuditoria === filtros.statusAuditoria);
    }

    return lista;
  },

  obterPonto(id: string): AtivoMidiaPonto | null {
    return pontosArmazenados.find((p) => p.id === id || p.codigoPonto === id) || null;
  },

  obterMetricas() {
    const total = pontosArmazenados.length;
    const conformes = pontosArmazenados.filter((p) => p.statusAuditoria === 'CONFORME').length;
    const irregulares = pontosArmazenados.filter((p) => p.statusAuditoria === 'IRREGULAR').length;
    const alertas = pontosArmazenados.filter((p) => p.statusAuditoria === 'ALERTA_VENCIMENTO').length;
    const vencidas = pontosArmazenados.filter((p) => p.statusValidade === 'VENCIDA').length;
    const totensDigitais = pontosArmazenados.filter((p) => p.tipoEstrutura === 'TOTEM_DIGITAL').length;
    const taxaConformidade = total > 0 ? Math.round((conformes / total) * 100) : 100;

    return {
      total,
      conformes,
      irregulares,
      alertas,
      vencidas,
      totensDigitais,
      taxaConformidade,
    };
  },

  registrarVistoria(
    pontoId: string,
    dados: {
      condicaoVisual: CondicaoFisica;
      midiaPresente: boolean;
      observacao?: string;
      auditor?: string;
    }
  ): AtivoMidiaPonto {
    const ponto = pontosArmazenados.find((p) => p.id === pontoId);
    if (!ponto) throw new Error('Ponto de mídia não encontrado.');

    const agora = new Date();
    const dataStr = agora.toISOString().slice(0, 16).replace('T', ' ');
    const isConforme = dados.condicaoVisual !== 'DANIFICADA' && dados.midiaPresente;

    let novoStatusAuditoria: 'CONFORME' | 'ALERTA_VENCIMENTO' | 'IRREGULAR' = isConforme
      ? ponto.statusValidade === 'VENCE_HOJE' || (ponto.diasRestantes && ponto.diasRestantes <= 5)
        ? 'ALERTA_VENCIMENTO'
        : 'CONFORME'
      : 'IRREGULAR';

    const novaVistoria: VistoriaMidiaItem = {
      id: `VIST-${Date.now()}`,
      data: dataStr,
      auditor: dados.auditor || 'Auditor Operacional',
      condicaoVisual: dados.condicaoVisual,
      midiaPresente: dados.midiaPresente,
      statusCalculado: isConforme ? 'CONFORME' : 'IRREGULAR',
      observacao: dados.observacao || 'Vistoria de rotina realizada via app móvel.',
    };

    ponto.condicaoVisual = dados.condicaoVisual;
    ponto.statusAuditoria = novoStatusAuditoria;
    ponto.ultimaVistoria = dataStr;
    ponto.historicoVistorias = [novaVistoria, ...ponto.historicoVistorias];

    return { ...ponto };
  },
};
