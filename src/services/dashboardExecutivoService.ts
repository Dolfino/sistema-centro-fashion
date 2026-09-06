/**
 * Serviço de Inteligência Executiva e Dashboard (Fase L4.0) - Centro Fashion Fortaleza
 * Paridade com L40_DashboardExecutivoService.gs
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

export interface DadosDashboardExecutivo {
  dataGeracao: string;
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
   * Consolida e retorna todos os indicadores da L4.0 respeitando o perfil RBAC
   */
  static obterDadosDashboard(userRole: string = 'ADMIN'): DadosDashboardExecutivo {
    const isAdminOuFinanceiro = userRole === 'ADMIN' || userRole === 'FINANCEIRO';

    const agora = new Date();
    const dataGeracao = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

    // 1. Resumo Executivo
    const resumoKPIs: ResumoExecutivoKPIs = {
      totalOperacoes: 4954,
      espacosAtuais: 5120,
      completudeMedia: 78.5,
      operacoesConcluidas: 3410,
      operacoesComContato: 4280,
      operacoesComMixProduto: 3890,
      operacoesComCampanha: 2150,
      visitadasUltimos30Dias: 3120,
    };

    // 2. Mix Comercial por Segmento (Barras Visuais)
    const mixSegmentos: MixSegmentoItem[] = [
      { segmento: 'Moda Feminina', quantidadeLojas: 1420, percentual: 28.7, corHex: '#ec4899' },
      { segmento: 'Jeanswear & Denim', quantidadeLojas: 1150, percentual: 23.2, corHex: '#3b82f6' },
      { segmento: 'Moda Masculina', quantidadeLojas: 780, percentual: 15.7, corHex: '#06b6d4' },
      { segmento: 'Moda Infantil', quantidadeLojas: 540, percentual: 10.9, corHex: '#f59e0b' },
      { segmento: 'Bijuterias & Acessórios', quantidadeLojas: 410, percentual: 8.3, corHex: '#a855f7' },
      { segmento: 'Moda Praia & Fitness', quantidadeLojas: 360, percentual: 7.3, corHex: '#10b981' },
      { segmento: 'Calçados & Bolsas', quantidadeLojas: 294, percentual: 5.9, corHex: '#f97316' },
    ];

    // 3. Cobertura por Setor / Piso
    const coberturaSetores: CoberturaSetorItem[] = [
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

    // 4. Recência das Visitas
    const recenciaVisitas: RecenciaVisitas = {
      ate7Dias: 1250,
      de8A30Dias: 1870,
      de31A90Dias: 980,
      maisDe90Dias: 520,
      semVisitaRegistrada: 334,
    };

    // 5. Qualidade da Base & Governança
    const qualidadeGovernanca: QualidadeBaseGovernanca = {
      semContato: 674,
      semProdutoMix: 1064,
      semCampanhaAtiva: 2804,
      semVisitaRecente: 1834,
      cadastroPendente: 1544,
    };

    // 6. Prioridades Executivas (Gestão por Exceção)
    const prioridadesExecutivas: PrioridadeExecutivaItem[] = [
      {
        idOperacao: 'OP-003',
        idLojaMapa: '3',
        nomeFantasia: 'Bella Jeans Fortaleza',
        razaoSocial: 'Comercial Bella Jeans Ltda',
        numeroBox: '1178',
        setor: 'Setor Azul • Piso 1',
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
        setor: 'Setor Azul • Piso 1',
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
        setor: 'Setor Azul • Piso 1',
        segmento: 'Bijuterias e Bolsas',
        totalSinaisAtencao: 2,
        sinais: ['Não aderiu a nenhuma campanha', 'Completude 60%'],
      },
    ];

    // 7. Bloco Restrito (Apenas para Administrador ou Diretor Financeiro)
    let blocoRestrito: BlocoRestritoFinanceiro | undefined = undefined;
    if (isAdminOuFinanceiro) {
      blocoRestrito = {
        contratosAtivos: 4720,
        permissionariosInadimplentes: 142,
        saldoTotalVencido: 348500.0,
        auditoriasComDivergencia: 28,
      };
    }

    return {
      dataGeracao,
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
