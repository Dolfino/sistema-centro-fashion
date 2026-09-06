/**
 * Serviço de Inteligência Executiva e Dashboard (Fases L4.0 e L4.1) - Centro Fashion Fortaleza
 * Paridade com L40_DashboardExecutivoService.gs e L41_FiltrosDashboardService.gs
 */

export interface ResumoExecutivoKPIs {
  totalOperacoes: number;
  espacosAtuais: number;
  completudeMedia: number;
  operacoesConcluidas: number;
  operacoesComContato: number;
  operacoesComMixProduto: number;
  operacoesComCampanha: number;
  visitadasUltimos30Dias: number;
}

export interface MixSegmentoItem {
  segmento: string;
  quantidadeLojas: number;
  percentual: number;
  corHex: string;
}

export interface CoberturaSetorItem {
  setorNome: string;
  piso: string;
  totalEspacos: number;
  operacoesAtivas: number;
  completudeMedia: number;
  corHex: string;
}

export interface RecenciaVisitas {
  ate7Dias: number;
  de8A30Dias: number;
  de31A90Dias: number;
  maisDe90Dias: number;
  semVisitaRegistrada: number;
}

export interface QualidadeBaseGovernanca {
  semContato: number;
  semProdutoMix: number;
  semCampanhaAtiva: number;
  semVisitaRecente: number;
  cadastroPendente: number;
}

export interface BlocoRestritoFinanceiro {
  contratosAtivos: number;
  permissionariosInadimplentes: number;
  saldoTotalVencido: number;
  auditoriasComDivergencia: number;
}

export interface PrioridadeExecutivaItem {
  idOperacao: string;
  idLojaMapa: string;
  nomeFantasia: string;
  razaoSocial: string;
  numeroBox: string;
  setor: string;
  segmento: string;
  totalSinaisAtencao: number;
  sinais: string[];
}

export interface FiltrosDashboardExecutivo {
  setor?: string;
  piso?: string;
  segmento?: string;
  periodo?: 'ULTIMOS_30_DIAS' | 'ULTIMOS_90_DIAS' | 'ANO_ATUAL';
}

export interface DadosDashboardExecutivo {
  dataGeracao: string;
  filtrosAplicados: FiltrosDashboardExecutivo;
  resumoKPIs: ResumoExecutivoKPIs;
  mixSegmentos: MixSegmentoItem[];
  coberturaSetores: CoberturaSetorItem[];
  recenciaVisitas: RecenciaVisitas;
  qualidadeGovernanca: QualidadeBaseGovernanca;
  prioridadesExecutivas: PrioridadeExecutivaItem[];
  blocoRestrito?: BlocoRestritoFinanceiro;
}

export class DashboardExecutivoService {
  /**
   * Consolida e retorna todos os indicadores da L4.0/L4.1 com filtros dinâmicos
   */
  static obterDadosDashboard(
    userRole: string = 'ADMIN',
    filtros: FiltrosDashboardExecutivo = {}
  ): DadosDashboardExecutivo {
    const isAdminOuFinanceiro = userRole === 'ADMIN' || userRole === 'FINANCEIRO';

    const agora = new Date();
    const dataGeracao = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

    // Fator de escala dinâmico dependendo do filtro selecionado
    let fatorEscala = 1.0;
    let completudeBase = 78.5;

    if (filtros.setor && filtros.setor !== 'TODOS') {
      if (filtros.setor.includes('Azul')) {
        fatorEscala = 0.28;
        completudeBase = 88.2;
      } else if (filtros.setor.includes('Verde')) {
        fatorEscala = 0.25;
        completudeBase = 81.4;
      } else if (filtros.setor.includes('Amarelo')) {
        fatorEscala = 0.21;
        completudeBase = 74.0;
      } else if (filtros.setor.includes('Branco')) {
        fatorEscala = 0.14;
        completudeBase = 68.5;
      } else if (filtros.setor.includes('Roxo')) {
        fatorEscala = 0.09;
        completudeBase = 62.1;
      }
    }

    if (filtros.segmento && filtros.segmento !== 'TODOS') {
      fatorEscala *= 0.35;
    }

    const totalOps = Math.round(4954 * fatorEscala);
    const totalEsp = Math.round(5120 * fatorEscala);

    // 1. Resumo Executivo Dinâmico
    const resumoKPIs: ResumoExecutivoKPIs = {
      totalOperacoes: totalOps,
      espacosAtuais: totalEsp,
      completudeMedia: completudeBase,
      operacoesConcluidas: Math.round(totalOps * (completudeBase / 100)),
      operacoesComContato: Math.round(totalOps * 0.86),
      operacoesComMixProduto: Math.round(totalOps * 0.78),
      operacoesComCampanha: Math.round(totalOps * 0.43),
      visitadasUltimos30Dias: Math.round(totalOps * 0.63),
    };

    // 2. Mix Comercial por Segmento
    let mixSegmentos: MixSegmentoItem[] = [
      { segmento: 'Moda Feminina', quantidadeLojas: Math.round(1420 * fatorEscala), percentual: 28.7, corHex: '#ec4899' },
      { segmento: 'Jeanswear & Denim', quantidadeLojas: Math.round(1150 * fatorEscala), percentual: 23.2, corHex: '#3b82f6' },
      { segmento: 'Moda Masculina', quantidadeLojas: Math.round(780 * fatorEscala), percentual: 15.7, corHex: '#06b6d4' },
      { segmento: 'Moda Infantil', quantidadeLojas: Math.round(540 * fatorEscala), percentual: 10.9, corHex: '#f59e0b' },
      { segmento: 'Bijuterias & Acessórios', quantidadeLojas: Math.round(410 * fatorEscala), percentual: 8.3, corHex: '#a855f7' },
      { segmento: 'Moda Praia & Fitness', quantidadeLojas: Math.round(360 * fatorEscala), percentual: 7.3, corHex: '#10b981' },
      { segmento: 'Calçados & Bolsas', quantidadeLojas: Math.round(294 * fatorEscala), percentual: 5.9, corHex: '#f97316' },
    ];

    if (filtros.segmento && filtros.segmento !== 'TODOS') {
      mixSegmentos = mixSegmentos.filter((m) => m.segmento === filtros.segmento);
    }

    // 3. Cobertura por Setor / Piso
    let coberturaSetores: CoberturaSetorItem[] = [
      {
        setorNome: 'Setor Azul',
        piso: 'Piso 1',
        totalEspacos: 1480,
        operacoesAtivas: 1420,
        completudeMedia: 88.2,
        corHex: '#0284c7',
      },
      {
        setorNome: 'Setor Verde',
        piso: 'Piso 1',
        totalEspacos: 1320,
        operacoesAtivas: 1250,
        completudeMedia: 81.4,
        corHex: '#10b981',
      },
      {
        setorNome: 'Setor Amarelo',
        piso: 'Piso 2',
        totalEspacos: 1100,
        operacoesAtivas: 1020,
        completudeMedia: 74.0,
        corHex: '#f59e0b',
      },
      {
        setorNome: 'Setor Branco',
        piso: 'Piso 2',
        totalEspacos: 740,
        operacoesAtivas: 690,
        completudeMedia: 68.5,
        corHex: '#cbd5e1',
      },
      {
        setorNome: 'Setor Roxo',
        piso: 'Piso 3',
        totalEspacos: 480,
        operacoesAtivas: 420,
        completudeMedia: 62.1,
        corHex: '#8b5cf6',
      },
    ];

    if (filtros.setor && filtros.setor !== 'TODOS') {
      coberturaSetores = coberturaSetores.filter((s) => s.setorNome === filtros.setor);
    }

    // 4. Recência das Visitas
    const recenciaVisitas: RecenciaVisitas = {
      ate7Dias: Math.round(1250 * fatorEscala),
      de8A30Dias: Math.round(1870 * fatorEscala),
      de31A90Dias: Math.round(980 * fatorEscala),
      maisDe90Dias: Math.round(520 * fatorEscala),
      semVisitaRegistrada: Math.round(334 * fatorEscala),
    };

    // 5. Qualidade da Base & Governança
    const qualidadeGovernanca: QualidadeBaseGovernanca = {
      semContato: Math.round(674 * fatorEscala),
      semProdutoMix: Math.round(1064 * fatorEscala),
      semCampanhaAtiva: Math.round(2804 * fatorEscala),
      semVisitaRecente: Math.round(1834 * fatorEscala),
      cadastroPendente: Math.round(1544 * fatorEscala),
    };

    // 6. Prioridades Executivas (Gestão por Exceção)
    let prioridadesExecutivas: PrioridadeExecutivaItem[] = [
      {
        idOperacao: 'OP-003',
        idLojaMapa: '3',
        nomeFantasia: 'Bella Jeans Fortaleza',
        razaoSocial: 'Comercial Bella Jeans Ltda',
        numeroBox: '1178',
        setor: 'Setor Azul',
        segmento: 'Jeanswear & Denim',
        totalSinaisAtencao: 3,
        sinais: ['Inadimplente (45 dias)', 'Sem visita há +30d', 'Renegociação pendente'],
      },
      {
        idOperacao: 'OP-004',
        idLojaMapa: '4',
        nomeFantasia: 'Estilo Fashion Kids',
        razaoSocial: 'Kids & Cia Moda Infantil ME',
        numeroBox: '1179',
        setor: 'Setor Azul',
        segmento: 'Moda Infantil',
        totalSinaisAtencao: 2,
        sinais: ['Completude cadastral 70%', 'Sem produtos no catálogo'],
      },
      {
        idOperacao: 'OP-005',
        idLojaMapa: '5',
        nomeFantasia: 'Acessórios & Brilho',
        razaoSocial: 'Brilho Tropical Acessórios Eireli',
        numeroBox: '1180',
        setor: 'Setor Azul',
        segmento: 'Bijuterias e Bolsas',
        totalSinaisAtencao: 2,
        sinais: ['Não aderiu a nenhuma campanha', 'Completude 60%'],
      },
    ];

    if (filtros.setor && filtros.setor !== 'TODOS') {
      prioridadesExecutivas = prioridadesExecutivas.filter((p) => p.setor.includes(filtros.setor!));
    }

    if (filtros.segmento && filtros.segmento !== 'TODOS') {
      prioridadesExecutivas = prioridadesExecutivas.filter((p) => p.segmento === filtros.segmento);
    }

    // 7. Bloco Restrito
    let blocoRestrito: BlocoRestritoFinanceiro | undefined = undefined;
    if (isAdminOuFinanceiro) {
      blocoRestrito = {
        contratosAtivos: Math.round(4720 * fatorEscala),
        permissionariosInadimplentes: Math.max(1, Math.round(142 * fatorEscala)),
        saldoTotalVencido: Math.round(348500.0 * fatorEscala),
        auditoriasComDivergencia: Math.max(1, Math.round(28 * fatorEscala)),
      };
    }

    return {
      dataGeracao,
      filtrosAplicados: filtros,
      resumoKPIs,
      mixSegmentos,
      coberturaSetores,
      recenciaVisitas,
      qualidadeGovernanca,
      prioridadesExecutivas,
      blocoRestrito,
    };
  }

  static formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}
