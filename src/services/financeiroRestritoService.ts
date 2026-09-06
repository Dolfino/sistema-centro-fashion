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
  status: 'PAGO' | 'ABERTO' | 'VENCIDO' | 'A_VENCER';
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
  nomeFantasia?: string;
  documento: string;
  grupoEconomico?: string;
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

export interface ItemCarteiraFinanceira {
  idPermissionario: string;
  razaoSocial: string;
  nomeFantasia?: string;
  documento: string;
  grupoEconomico?: string;
  situacao: SituacaoFinanceira;
  saldoTotalAberto: number;
  saldoTotalVencido: number;
  quantidadeLancamentosVencidos: number;
  maiorAtrasoDias: number;
  contratosAtivos: number;
  acordosAtivos: number;
  boxes: string[];
  venceEmAte90Dias: boolean;
  temAcordoAtivo: boolean;
  numeroPrincipalContrato?: string;
}

export interface KPIsCentralFinanceira {
  totalPermissionarios: number;
  totalInadimplentes: number;
  saldoTotalAberto: number;
  saldoTotalVencido: number;
  contratosAtivos: number;
  contratosVencem90Dias: number;
  permissionariosSemContrato: number;
  acordosAtivos: number;
}

export interface FiltrosCarteiraFinanceira {
  busca?: string;
  situacao?: string;
  contrato?: string;
  acordo?: string;
  ordenacao?: 'MAIOR_SALDO_ABERTO' | 'MAIOR_ATRASO' | 'VENCIMENTO_CONTRATO' | 'NOME';
}

// Base segura de dados financeiros fictícios e idempotentes da Fase L3.4 e L3.5
const DADOS_FINANCEIROS_PERMISSIONARIOS: Record<string, ResumoFinanceiroPermissionario> = {
  'PERM-002': {
    idPermissionario: 'PERM-002',
    razaoSocial: 'Comercial Bella 0001',
    nomeFantasia: 'Bella Jeans',
    documento: 'TESTE-CNPJ-00000001',
    grupoEconomico: 'Holding Jeanswear Nordeste',
    situacao: 'INADIMPLENTE',
    saldoTotalAberto: 7000.0,
    saldoTotalVencido: 3500.0,
    quantidadeLancamentosVencidos: 1,
    maiorAtrasoDias: 12,
    dataUltimoPagamento: '15/07/2026',
    contratos: [
      {
        idContrato: 'CTR-BELLA-001',
        numeroContrato: 'TESTE-CTR-00001',
        tipoContrato: 'LOCACAO_BOX',
        status: 'ATIVO',
        dataInicio: '01/01/2024',
        dataFim: '31/12/2026',
        aluguelMinimoMensal: 3500.0,
        percentualFaturamento: 5.0,
        fundoPromocao: 400.0,
        diaVencimento: 10,
        espacosVinculados: ['1318'],
        observacoes: 'Contrato padrão de locação comercial Box 1318.',
      },
    ],
    lancamentosRecentes: [
      {
        idLancamento: 'LAN-BELLA-01',
        competencia: '07/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1318',
        dataVencimento: '10/07/2026',
        dataPagamento: '08/07/2026',
        valorOriginal: 3500.0,
        valorPago: 3500.0,
        saldoAberto: 0.0,
        status: 'PAGO',
        diasAtraso: 0,
      },
      {
        idLancamento: 'LAN-BELLA-02',
        competencia: '08/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1318',
        dataVencimento: '10/08/2026',
        valorOriginal: 3500.0,
        valorPago: 0.0,
        saldoAberto: 3500.0,
        status: 'VENCIDO',
        diasAtraso: 12,
      },
      {
        idLancamento: 'LAN-BELLA-03',
        competencia: '08/2026',
        tipoCobranca: 'FUNDO_PROMOCAO',
        descricao: 'Fundo de Promoção e Propaganda',
        dataVencimento: '10/08/2026',
        dataPagamento: '09/08/2026',
        valorOriginal: 400.0,
        valorPago: 400.0,
        saldoAberto: 0.0,
        status: 'PAGO',
        diasAtraso: 0,
      },
      {
        idLancamento: 'LAN-BELLA-04',
        competencia: '09/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Box 1318',
        dataVencimento: '10/09/2026',
        valorOriginal: 3500.0,
        valorPago: 0.0,
        saldoAberto: 3500.0,
        status: 'A_VENCER',
        diasAtraso: 0,
      },
    ],
    acordos: [
      {
        idAcordo: 'ACD-BELLA-01',
        tipo: 'PARCELAMENTO',
        dataAcordo: '20/08/2026',
        valorOriginal: 3500.0,
        valorNegociado: 3500.0,
        quantidadeParcelas: 2,
        parcelasPagas: 0,
        status: 'EM_ANDAMENTO',
        responsavelNegociacao: 'Gerência Financeira • Dr. Roberto',
        observacao: 'Parcelamento em andamento para quitação do título de agosto.',
      },
    ],
  },
  'PERM-001': {
    idPermissionario: 'PERM-001',
    razaoSocial: 'Aurora Confecções do Ceará Ltda',
    nomeFantasia: 'Moda Aurora',
    documento: '08.432.190/0001-44',
    grupoEconomico: 'Grupo Aurora Fashion',
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
        status: 'A_VENCER',
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
        status: 'A_VENCER',
        diasAtraso: 0,
      },
    ],
    acordos: [],
  },
  'PERM-003': {
    idPermissionario: 'PERM-003',
    razaoSocial: 'Kids & Cia Moda Infantil ME',
    nomeFantasia: 'Estilo Fashion',
    documento: '22.109.845/0001-19',
    grupoEconomico: 'Grupo Varejo Infantil CE',
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
        dataFim: '15/10/2026', // Vence em menos de 90 dias
        aluguelMinimoMensal: 1800.0,
        percentualFaturamento: 4.0,
        fundoPromocao: 300.0,
        diaVencimento: 10,
        espacosVinculados: ['1288', '1274'],
      },
    ],
    lancamentosRecentes: [
      {
        idLancamento: 'LAN-202609-03',
        competencia: '09/2026',
        tipoCobranca: 'ALUGUEL_MINIMO',
        descricao: 'Aluguel Mínimo Mensal - Boxes 1288 e 1274',
        dataVencimento: '10/09/2026',
        valorOriginal: 1800.0,
        valorPago: 0.0,
        saldoAberto: 1800.0,
        status: 'A_VENCER',
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
        status: 'A_VENCER',
        diasAtraso: 0,
      },
    ],
    acordos: [],
  },
  'PERM-004': {
    idPermissionario: 'PERM-004',
    razaoSocial: 'Estilo Nordestino Artigos de Moda Eireli',
    nomeFantasia: 'Estilo Ceará',
    documento: '00.000.002/0001-20',
    situacao: 'SEM_LANCAMENTOS',
    saldoTotalAberto: 0,
    saldoTotalVencido: 0,
    quantidadeLancamentosVencidos: 0,
    maiorAtrasoDias: 0,
    dataUltimoPagamento: '-',
    contratos: [],
    lancamentosRecentes: [],
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
   * Obtém a lista consolidada da carteira financeira global (Fase L3.5)
   */
  static obterCarteiraGlobal(
    filtros: FiltrosCarteiraFinanceira = {},
    userRole: string = 'ADMIN'
  ): ItemCarteiraFinanceira[] {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error(
        'ACESSO_NEGADO_L34: Usuário não possui privilégios para acessar a Central Financeira.'
      );
    }

    const itens: ItemCarteiraFinanceira[] = Object.values(DADOS_FINANCEIROS_PERMISSIONARIOS).map(
      (p) => {
        const boxes = Array.from(
          new Set(p.contratos.flatMap((c) => c.espacosVinculados || []))
        );
        const contratosAtivos = p.contratos.filter((c) => c.status === 'ATIVO').length;
        const acordosAtivos = p.acordos.filter((a) => a.status === 'EM_ANDAMENTO').length;
        
        // Verifica se algum contrato vence em até 90 dias
        const venceEmAte90Dias = p.contratos.some((c) => {
          if (c.status !== 'ATIVO') return false;
          const partes = c.dataFim.split('/');
          if (partes.length !== 3) return false;
          const dataFim = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
          const hoje = new Date(2026, 8, 6); // Setembro 2026
          const diffDias = Math.floor((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          return diffDias >= 0 && diffDias <= 90;
        });

        return {
          idPermissionario: p.idPermissionario,
          razaoSocial: p.razaoSocial,
          nomeFantasia: p.nomeFantasia,
          documento: p.documento,
          grupoEconomico: p.grupoEconomico,
          situacao: p.situacao,
          saldoTotalAberto: p.saldoTotalAberto,
          saldoTotalVencido: p.saldoTotalVencido,
          quantidadeLancamentosVencidos: p.quantidadeLancamentosVencidos,
          maiorAtrasoDias: p.maiorAtrasoDias,
          contratosAtivos,
          acordosAtivos,
          boxes,
          venceEmAte90Dias,
          temAcordoAtivo: acordosAtivos > 0,
          numeroPrincipalContrato: p.contratos[0]?.numeroContrato,
        };
      }
    );

    let resultado = [...itens];

    // 1. Busca Multi-Índice
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase().trim();
      resultado = resultado.filter((item) => {
        return (
          item.razaoSocial.toLowerCase().includes(termo) ||
          (item.nomeFantasia && item.nomeFantasia.toLowerCase().includes(termo)) ||
          item.documento.toLowerCase().includes(termo) ||
          (item.grupoEconomico && item.grupoEconomico.toLowerCase().includes(termo)) ||
          (item.numeroPrincipalContrato && item.numeroPrincipalContrato.toLowerCase().includes(termo)) ||
          item.boxes.some((b) => b.toLowerCase().includes(termo))
        );
      });
    }

    // 2. Filtro por Situação Financeira
    if (filtros.situacao && filtros.situacao !== 'TODOS') {
      resultado = resultado.filter((item) => item.situacao === filtros.situacao);
    }

    // 3. Filtro por Contratos
    if (filtros.contrato && filtros.contrato !== 'TODOS') {
      if (filtros.contrato === 'ATIVO') {
        resultado = resultado.filter((item) => item.contratosAtivos > 0);
      } else if (filtros.contrato === 'VENCE_90D') {
        resultado = resultado.filter((item) => item.venceEmAte90Dias);
      } else if (filtros.contrato === 'SEM_CONTRATO') {
        resultado = resultado.filter((item) => item.contratosAtivos === 0);
      }
    }

    // 4. Filtro por Acordos
    if (filtros.acordo && filtros.acordo !== 'TODOS') {
      if (filtros.acordo === 'COM_ACORDO') {
        resultado = resultado.filter((item) => item.temAcordoAtivo);
      } else if (filtros.acordo === 'SEM_ACORDO') {
        resultado = resultado.filter((item) => !item.temAcordoAtivo);
      }
    }

    // 5. Ordenação
    if (filtros.ordenacao) {
      switch (filtros.ordenacao) {
        case 'MAIOR_SALDO_ABERTO':
          resultado.sort((a, b) => b.saldoTotalAberto - a.saldoTotalAberto);
          break;
        case 'MAIOR_ATRASO':
          resultado.sort((a, b) => b.maiorAtrasoDias - a.maiorAtrasoDias);
          break;
        case 'VENCIMENTO_CONTRATO':
          resultado.sort((a, b) => (b.venceEmAte90Dias ? 1 : 0) - (a.venceEmAte90Dias ? 1 : 0));
          break;
        case 'NOME':
          resultado.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
          break;
      }
    } else {
      // Padrão: maior saldo em aberto primeiro
      resultado.sort((a, b) => b.saldoTotalAberto - a.saldoTotalAberto);
    }

    return resultado;
  }

  /**
   * Obtém os indicadores agregados da Central Financeira
   */
  static obterKPIsCarteira(userRole: string = 'ADMIN'): KPIsCentralFinanceira {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error(
        'ACESSO_NEGADO_L34: Usuário não possui privilégios para acessar a Central Financeira.'
      );
    }

    const permissionarios = Object.values(DADOS_FINANCEIROS_PERMISSIONARIOS);
    const totalPermissionarios = permissionarios.length;
    const totalInadimplentes = permissionarios.filter((p) => p.situacao === 'INADIMPLENTE').length;
    const saldoTotalAberto = permissionarios.reduce((acc, p) => acc + p.saldoTotalAberto, 0);
    const saldoTotalVencido = permissionarios.reduce((acc, p) => acc + p.saldoTotalVencido, 0);
    const contratosAtivos = permissionarios.reduce(
      (acc, p) => acc + p.contratos.filter((c) => c.status === 'ATIVO').length,
      0
    );
    const acordosAtivos = permissionarios.reduce(
      (acc, p) => acc + p.acordos.filter((a) => a.status === 'EM_ANDAMENTO').length,
      0
    );
    const permissionariosSemContrato = permissionarios.filter(
      (p) => p.contratos.filter((c) => c.status === 'ATIVO').length === 0
    ).length;
    const contratosVencem90Dias = permissionarios.filter((p) =>
      p.contratos.some((c) => {
        if (c.status !== 'ATIVO') return false;
        const partes = c.dataFim.split('/');
        if (partes.length !== 3) return false;
        const dataFim = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
        const hoje = new Date(2026, 8, 6);
        const diffDias = Math.floor((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diffDias >= 0 && diffDias <= 90;
      })
    ).length;

    return {
      totalPermissionarios,
      totalInadimplentes,
      saldoTotalAberto,
      saldoTotalVencido,
      contratosAtivos,
      contratosVencem90Dias,
      permissionariosSemContrato,
      acordosAtivos,
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
