/**
 * Serviço de Contratos e Financeiro Restrito (Fase L3.4) - Centro Fashion Fortaleza
 * Paridade com L34_FinanceiroRestritoService.gs
 */

export type SituacaoFinanceira =
  | 'ADIMPLENTE'
  | 'PENDENTE'
  | 'INADIMPLENTE'
  | 'SEM_LANCAMENTOS';

export interface ContratoLocacao {
  idContrato: string;
  numeroContrato: string;
  tipoContrato: 'LOCACAO_BOX' | 'QUIOSQUE' | 'TEMPORARIO' | 'LOJA_ANCORA';
  status: 'ATIVO' | 'VENCIDO' | 'RESCINDIDO' | 'EM_RENOVACAO';
  dataInicio: string;
  dataFim: string;
  aluguelMinimoMensal: number;
  percentualFaturamento: number;
  fundoPromocao: number;
  diaVencimento: number;
  espacosVinculados: string[]; // Números dos boxes
  observacoes?: string;
}

export interface LancamentoFinanceiro {
  idLancamento: string;
  competencia: string; // MM/AAAA
  tipoCobranca: 'ALUGUEL_MINIMO' | 'CONDOMINIO' | 'FUNDO_PROMOCAO' | 'ENERGIA' | 'TAXA_OPERACIONAL';
  descricao: string;
  dataVencimento: string;
  dataPagamento?: string;
  valorOriginal: number;
  valorPago: number;
  saldoAberto: number;
  status: 'PAGO' | 'ABERTO' | 'VENCIDO';
  diasAtraso: number;
}

export interface AcordoFinanceiro {
  idAcordo: string;
  tipo: 'PARCELAMENTO' | 'DESCONTO_PONTUAL' | 'COMPOSICAO_DIVIDA';
  dataAcordo: string;
  valorOriginal: number;
  valorNegociado: number;
  quantidadeParcelas: number;
  parcelasPagas: number;
  status: 'CUMPRIDO' | 'EM_ANDAMENTO' | 'INADIMPLIDO';
  responsavelNegociacao: string;
  observacao?: string;
}

export interface ResumoFinanceiroPermissionario {
  idPermissionario: string;
  razaoSocial: string;
  documento: string;
  situacao: SituacaoFinanceira;
  saldoTotalAberto: number;
  saldoTotalVencido: number;
  quantidadeLancamentosVencidos: number;
  maiorAtrasoDias: number;
  dataUltimoPagamento: string;
  contratos: ContratoLocacao[];
  lancamentosRecentes: LancamentoFinanceiro[];
  acordos: AcordoFinanceiro[];
}

// Base segura de dados financeiros fictícios e idempotentes da Fase L3.4
const DADOS_FINANCEIROS_PERMISSIONARIOS: Record<string, ResumoFinanceiroPermissionario> = {
  'PERM-001': {
    idPermissionario: 'PERM-001',
    razaoSocial: 'Aurora Confecções do Ceará Ltda',
    documento: '08.432.190/0001-44',
    situacao: 'ADIMPLENTE',
    saldoTotalAberto: 3500.0,
    saldoTotalVencido: 0.0,
    quantidadeLancamentosVencidos: 0,
    maiorAtrasoDias: 0,
    dataUltimoPagamento: '05/09/2026',
    contratos: [
      {
        idContrato: 'CTR-2024-0014',
        numeroContrato: 'CTR-2024-0014',
        tipoContrato: 'LOCACAO_BOX',
        status: 'ATIVO',
        dataInicio: '15/01/2024',
        dataFim: '14/01/2027',
        aluguelMinimoMensal: 2800.0,
        percentualFaturamento: 4.5,
        fundoPromocao: 350.0,
        diaVencimento: 10,
        espacosVinculados: ['1176', '1177'],
        observacoes: 'Contrato padrão de box comercial com direito de renovação.',
      },
    ],
    lancamentosRecentes: [
      {
        idLancamento: 'LAN-202609-01',
        competencia: '09/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1176 e 1177',
        dataVencimento: '10/09/2026',
        valorOriginal: 2800.0,
        valorPago: 0.0,
        saldoAberto: 2800.0,
        status: 'ABERTO',
        diasAtraso: 0,
      },
      {
        idLancamento: 'LAN-202609-02',
        competencia: '09/2026',
        tipoCobranca: 'CONDOMINIO',
        descricao: 'Taxa Condominial Mensal',
        dataVencimento: '10/09/2026',
        valorOriginal: 700.0,
        valorPago: 0.0,
        saldoAberto: 700.0,
        status: 'ABERTO',
        diasAtraso: 0,
      },
      {
        idLancamento: 'LAN-202608-01',
        competencia: '08/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1176 e 1177',
        dataVencimento: '10/08/2026',
        dataPagamento: '08/08/2026',
        valorOriginal: 2800.0,
        valorPago: 2800.0,
        saldoAberto: 0.0,
        status: 'PAGO',
        diasAtraso: 0,
      },
    ],
    acordos: [],
  },
  'PERM-002': {
    idPermissionario: 'PERM-002',
    razaoSocial: 'Comercial Bella Jeans Ltda',
    documento: '14.887.234/0001-82',
    situacao: 'INADIMPLENTE',
    saldoTotalAberto: 14200.0,
    saldoTotalVencido: 9800.0,
    quantidadeLancamentosVencidos: 2,
    maiorAtrasoDias: 45,
    dataUltimoPagamento: '15/07/2026',
    contratos: [
      {
        idContrato: 'CTR-2023-0088',
        numeroContrato: 'CTR-2023-0088',
        tipoContrato: 'LOCACAO_BOX',
        status: 'ATIVO',
        dataInicio: '20/03/2023',
        dataFim: '19/03/2026',
        aluguelMinimoMensal: 4500.0,
        percentualFaturamento: 5.0,
        fundoPromocao: 500.0,
        diaVencimento: 10,
        espacosVinculados: ['1178', '1240', '1241'],
        observacoes: 'Titular de 3 unidades comerciais. Negociação em andamento.',
      },
    ],
    lancamentosRecentes: [
      {
        idLancamento: 'LAN-202607-01',
        competencia: '07/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - 3 Boxes',
        dataVencimento: '10/07/2026',
        valorOriginal: 4500.0,
        valorPago: 0.0,
        saldoAberto: 4500.0,
        status: 'VENCIDO',
        diasAtraso: 57,
      },
      {
        idLancamento: 'LAN-202608-01',
        competencia: '08/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - 3 Boxes',
        dataVencimento: '10/08/2026',
        valorOriginal: 4500.0,
        valorPago: 0.0,
        saldoAberto: 4500.0,
        status: 'VENCIDO',
        diasAtraso: 26,
      },
      {
        idLancamento: 'LAN-202608-02',
        competencia: '08/2026',
        tipoCobranca: 'CONDOMINIO',
        descricao: 'Condomínio e Rateio de Ar Condicionado',
        dataVencimento: '10/08/2026',
        valorOriginal: 800.0,
        valorPago: 0.0,
        saldoAberto: 800.0,
        status: 'VENCIDO',
        diasAtraso: 26,
      },
      {
        idLancamento: 'LAN-202609-01',
        competencia: '09/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - 3 Boxes',
        dataVencimento: '10/09/2026',
        valorOriginal: 4400.0,
        valorPago: 0.0,
        saldoAberto: 4400.0,
        status: 'ABERTO',
        diasAtraso: 0,
      },
    ],
    acordos: [
      {
        idAcordo: 'ACD-2026-003',
        tipo: 'PARCELAMENTO',
        dataAcordo: '25/08/2026',
        valorOriginal: 9800.0,
        valorNegociado: 9800.0,
        quantidadeParcelas: 4,
        parcelasPagas: 0,
        status: 'EM_ANDAMENTO',
        responsavelNegociacao: 'Gerência Financeira • Dr. Roberto',
        observacao: 'Termo de confissão de dívida aguardando assinatura.',
      },
    ],
  },
  'PERM-003': {
    idPermissionario: 'PERM-003',
    razaoSocial: 'Kids & Cia Moda Infantil ME',
    documento: '22.109.845/0001-19',
    situacao: 'PENDENTE',
    saldoTotalAberto: 2100.0,
    saldoTotalVencido: 0.0,
    quantidadeLancamentosVencidos: 0,
    maiorAtrasoDias: 0,
    dataUltimoPagamento: '10/08/2026',
    contratos: [
      {
        idContrato: 'CTR-2024-0105',
        numeroContrato: 'CTR-2024-0105',
        tipoContrato: 'LOCACAO_BOX',
        status: 'ATIVO',
        dataInicio: '10/08/2024',
        dataFim: '09/08/2025',
        aluguelMinimoMensal: 1800.0,
        percentualFaturamento: 4.0,
        fundoPromocao: 300.0,
        diaVencimento: 10,
        espacosVinculados: ['1179'],
      },
    ],
    lancamentosRecentes: [
      {
        idLancamento: 'LAN-202609-03',
        competencia: '09/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1179',
        dataVencimento: '10/09/2026',
        valorOriginal: 1800.0,
        valorPago: 0.0,
        saldoAberto: 1800.0,
        status: 'ABERTO',
        diasAtraso: 0,
      },
      {
        idLancamento: 'LAN-202609-04',
        competencia: '09/2026',
        tipoCobranca: 'FUNDO_PROMOCAO',
        descricao: 'Fundo Promocional de Marketing',
        dataVencimento: '10/09/2026',
        valorOriginal: 300.0,
        valorPago: 0.0,
        saldoAberto: 300.0,
        status: 'ABERTO',
        diasAtraso: 0,
      },
    ],
    acordos: [],
  },
};

export class FinanceiroRestritoService {
  /**
   * Verifica permissões RBAC para leitura financeira
   */
  static verificarPermissaoLeitura(userRole: string = 'ADMIN'): boolean {
    return userRole === 'ADMIN' || userRole === 'FINANCEIRO';
  }

  /**
   * Obtém a ficha financeira confidencial de um permissionário
   */
  static obterResumoFinanceiro(
    idPermissionario: string,
    userRole: string = 'ADMIN'
  ): ResumoFinanceiroPermissionario {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error(
        'ACESSO_NEGADO_L34: Usuário não possui privilégios de auditoria ou gerência financeira.'
      );
    }

    const dados = DADOS_FINANCEIROS_PERMISSIONARIOS[idPermissionario];
    if (dados) {
      return dados;
    }

    // Fallback fictício seguro caso o permissionário não tenha lançamentos registrados
    return {
      idPermissionario,
      razaoSocial: 'Titular sem lançamentos',
      documento: '00.000.000/0000-00',
      situacao: 'SEM_LANCAMENTOS',
      saldoTotalAberto: 0,
      saldoTotalVencido: 0,
      quantidadeLancamentosVencidos: 0,
      maiorAtrasoDias: 0,
      dataUltimoPagamento: '-',
      contratos: [],
      lancamentosRecentes: [],
      acordos: [],
    };
  }

  /**
   * Formata valores para moeda Real brasileiro (BRL)
   */
  static formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}
