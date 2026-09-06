/**
 * Serviço de Auditoria de Vendas e Faturamento (Fase L3.8) - Centro Fashion Fortaleza
 *
 * Responsável pela gestão de declaração de faturamento de lojistas, aferições/auditorias
 * presenciais e fiscais, cálculo de divergências, apuração de aluguel variável contratual
 * e manutenção de trilha de auditoria append-only imutável.
 *
 * Políticas:
 * - Acesso restrito a perfis autorizados (ADMIN, FINANCEIRO, AUDITORIA).
 * - Zero-Cache para dados de auditoria/faturamento.
 * - Aluguel percentual funciona como referência de auditoria e não gera lançamento
 *   financeiro automaticamente sem intervenção contábil expressa.
 */

export type StatusAuditoriaVenda =
  | 'CONFORME'
  | 'DIVERGENTE'
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'CONTESTADA'
  | 'CONCLUIDA';

export type OrigemDadoAuditoria =
  | 'DECLARACAO_PORTAL'
  | 'AUDITORIA_PRESENCIAL'
  | 'INTEGRACAO_FISCAL'
  | 'AFERICAO_AMOSTRAL'
  | 'OUTRO';

export interface RegistroAuditoriaVenda {
  idAuditoriaVenda: string;
  idLoja: string;
  nomeLoja: string;
  idEspaco: string;
  numeroEspaco: string;
  setorEspaco: string;
  idOcupacao: string;
  idPermissionario: string;
  nomePermissionario: string;
  idContrato: string;
  competencia: string; // Formato YYYY-MM (ex: "2026-08")
  faturamentoDeclarado: number;
  faturamentoAuditado: number;
  diferencaValor: number; // faturamentoAuditado - faturamentoDeclarado
  diferencaPercentual: number; // (diferencaValor / faturamentoDeclarado) * 100
  status: StatusAuditoriaVenda;
  origemDado: OrigemDadoAuditoria;
  documentoId?: string;
  documentoUrl?: string;
  documentoNome?: string;
  auditadoPor: string;
  auditadoEm: string;
  percentualContratual: number; // ex: 4.0 para 4%
  aluguelMinimoReferencia: number;
  aluguelVariavelCalculado: number; // faturamentoAuditado * (percentualContratual / 100)
  aluguelReferencia: number; // Math.max(aluguelMinimoReferencia, aluguelVariavelCalculado)
  baseCalculo: 'FATURAMENTO_AUDITADO' | 'FATURAMENTO_DECLARADO';
  observacao?: string;
  ativo: boolean;
  clientRequestId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type TipoEventoAuditoriaVenda =
  | 'AUDITORIA_CRIADA'
  | 'AUDITORIA_ATUALIZADA'
  | 'EVIDENCIA_ANEXADA'
  | 'STATUS_ALTERADO';

export interface HistoricoAuditoriaVenda {
  idEvento: string;
  idAuditoriaVenda: string;
  tipoEvento: TipoEventoAuditoriaVenda;
  dataHora: string;
  usuarioId: string;
  usuarioEmail: string;
  detalhes: string;
  faturamentoDeclaradoAnterior?: number;
  faturamentoAuditadoAnterior?: number;
  faturamentoDeclaradoNovo?: number;
  faturamentoAuditadoNovo?: number;
  statusAnterior?: StatusAuditoriaVenda;
  statusNovo?: StatusAuditoriaVenda;
  justificativa?: string;
  snapshot: Partial<RegistroAuditoriaVenda>;
}

export interface KPIsAuditoriaVendas {
  totalAuditorias: number;
  totalConformes: number;
  totalDivergentes: number;
  totalPendentes: number;
  faturamentoDeclaradoTotal: number;
  faturamentoAuditadoTotal: number;
  diferencaTotalValor: number;
  aluguelReferenciaTotal: number;
  comEvidenciaTotal: number;
}

export interface FiltrosAuditoriaVendas {
  busca?: string;
  competencia?: string;
  status?: string;
  divergencia?: 'TODAS' | 'APENAS_DIVERGENTES' | 'CONFORMES';
  ordenacao?: 'MAIOR_DIFERENCA' | 'MAIOR_FATURAMENTO' | 'NOME_LOJA' | 'MAIS_RECENTE';
}

export interface PreviewCalculoAuditoria {
  diferencaValor: number;
  diferencaPercentual: number;
  aluguelVariavelCalculado: number;
  aluguelReferencia: number;
  statusSugerido: StatusAuditoriaVenda;
}

// -------------------------------------------------------------
// Seed Oficial do Gate L3.8 (Aurora Concept / Nº 1106 / 2026-08)
// -------------------------------------------------------------
const SEED_AUDITORIAS: RegistroAuditoriaVenda[] = [
  {
    idAuditoriaVenda: 'AUD-VND-2026-0001',
    idLoja: 'SEBRAE-0024',
    nomeLoja: 'Aurora Concept',
    idEspaco: 'ESP-1106',
    numeroEspaco: '1106',
    setorEspaco: 'Setor Azul',
    idOcupacao: 'OCUP-1106-001',
    idPermissionario: 'PERM-0024',
    nomePermissionario: 'Comercial Aurora 0024',
    idContrato: 'TESTE-L36-0001',
    competencia: '2026-08',
    faturamentoDeclarado: 120000,
    faturamentoAuditado: 135000,
    diferencaValor: 15000,
    diferencaPercentual: 12.5,
    status: 'DIVERGENTE',
    origemDado: 'AUDITORIA_PRESENCIAL',
    documentoId: 'DOC-AUD-001',
    documentoUrl: 'https://storage.cfmall.com.br/auditorias/fita_resumo_1106_202608.pdf',
    documentoNome: 'fita_resumo_1106_202608.pdf',
    auditadoPor: 'AUDITOR-01',
    auditadoEm: '2026-08-20T14:30:00Z',
    percentualContratual: 4.0,
    aluguelMinimoReferencia: 5500,
    aluguelVariavelCalculado: 5400,
    aluguelReferencia: 5500,
    baseCalculo: 'FATURAMENTO_AUDITADO',
    observacao: 'Aferição presencial por amostragem de cupons fiscais e fita detalhe.',
    ativo: true,
    clientRequestId: 'SEED-AUD-001',
    criadoEm: '2026-08-20T14:30:00Z',
    atualizadoEm: '2026-08-20T14:30:00Z',
  },
  {
    idAuditoriaVenda: 'AUD-VND-2026-0002',
    idLoja: 'SEBRAE-0025',
    nomeLoja: 'Bella Jeans',
    idEspaco: 'ESP-1318',
    numeroEspaco: '1318',
    setorEspaco: 'Setor Verde',
    idOcupacao: 'OCUP-1318-001',
    idPermissionario: 'PERM-0025',
    nomePermissionario: 'Confecções Bella Mar EIRELI',
    idContrato: 'CTR-2024-0015',
    competencia: '2026-08',
    faturamentoDeclarado: 85000,
    faturamentoAuditado: 85000,
    diferencaValor: 0,
    diferencaPercentual: 0,
    status: 'CONFORME',
    origemDado: 'INTEGRACAO_FISCAL',
    documentoId: 'DOC-AUD-002',
    documentoUrl: 'https://storage.cfmall.com.br/auditorias/dre_fiscal_1318_202608.pdf',
    documentoNome: 'dre_fiscal_1318_202608.pdf',
    auditadoPor: 'SISTEMA-INTEGRACAO',
    auditadoEm: '2026-08-22T09:15:00Z',
    percentualContratual: 3.5,
    aluguelMinimoReferencia: 3200,
    aluguelVariavelCalculado: 2975,
    aluguelReferencia: 3200,
    baseCalculo: 'FATURAMENTO_AUDITADO',
    observacao: 'Faturamento validado eletronicamente com SPED Fiscal.',
    ativo: true,
    clientRequestId: 'SEED-AUD-002',
    criadoEm: '2026-08-22T09:15:00Z',
    atualizadoEm: '2026-08-22T09:15:00Z',
  },
  {
    idAuditoriaVenda: 'AUD-VND-2026-0003',
    idLoja: 'SEBRAE-0026',
    nomeLoja: 'Estilo Fashion',
    idEspaco: 'ESP-1288',
    numeroEspaco: '1288',
    setorEspaco: 'Setor Azul',
    idOcupacao: 'OCUP-1288-001',
    idPermissionario: 'PERM-0026',
    nomePermissionario: 'Estilo & Moda Atacado Ltda',
    idContrato: 'CTR-2024-0016',
    competencia: '2026-08',
    faturamentoDeclarado: 210000,
    faturamentoAuditado: 245000,
    diferencaValor: 35000,
    diferencaPercentual: 16.67,
    status: 'DIVERGENTE',
    origemDado: 'AFERICAO_AMOSTRAL',
    documentoId: 'DOC-AUD-003',
    documentoUrl: 'https://storage.cfmall.com.br/auditorias/relatorio_afericao_1288.pdf',
    documentoNome: 'relatorio_afericao_1288.pdf',
    auditadoPor: 'AUDITOR-02',
    auditadoEm: '2026-08-25T16:45:00Z',
    percentualContratual: 4.5,
    aluguelMinimoReferencia: 7800,
    aluguelVariavelCalculado: 11025,
    aluguelReferencia: 11025,
    baseCalculo: 'FATURAMENTO_AUDITADO',
    observacao: 'Aluguel variável supera o mínimo contratual em virtude do volume de vendas auditado.',
    ativo: true,
    clientRequestId: 'SEED-AUD-003',
    criadoEm: '2026-08-25T16:45:00Z',
    atualizadoEm: '2026-08-25T16:45:00Z',
  },
];

const SEED_HISTORICO: HistoricoAuditoriaVenda[] = [
  {
    idEvento: 'EVT-AUD-0001',
    idAuditoriaVenda: 'AUD-VND-2026-0001',
    tipoEvento: 'AUDITORIA_CRIADA',
    dataHora: '2026-08-20T14:30:00Z',
    usuarioId: 'AUDITOR-01',
    usuarioEmail: 'auditoria@cfmall.com.br',
    detalhes: 'Auditoria de vendas cadastrada inicialmente com divergência detectada.',
    faturamentoDeclaradoNovo: 120000,
    faturamentoAuditadoNovo: 135000,
    statusNovo: 'DIVERGENTE',
    justificativa: 'Cadastro inicial do Gate L3.8',
    snapshot: { ...SEED_AUDITORIAS[0] },
  },
];

// Estado volátil em memória (Zero-Cache no cliente)
let bancoAuditorias: RegistroAuditoriaVenda[] = [...SEED_AUDITORIAS];
let bancoHistorico: HistoricoAuditoriaVenda[] = [...SEED_HISTORICO];

export class AuditoriaVendasService {
  /**
   * Validação de permissão RBAC estrita
   */
  public static verificarPermissaoLeitura(userRole: string = 'ADMIN'): boolean {
    const role = (userRole || '').toUpperCase();
    return role === 'ADMIN' || role === 'FINANCEIRO' || role === 'AUDITORIA';
  }

  public static verificarPermissaoEscrita(userRole: string = 'ADMIN'): boolean {
    const role = (userRole || '').toUpperCase();
    return role === 'ADMIN' || role === 'AUDITORIA';
  }

  /**
   * Utilitário para normalizar busca sem depender de helpers privados (L3.8.1)
   */
  public static normalizarBuscaL38(texto: string): string {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Formatação monetária BRL
   */
  public static formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  }

  /**
   * Cálculo em tempo real dos indicadores de auditoria
   */
  public static calcularPreview(
    faturamentoDeclarado: number,
    faturamentoAuditado: number,
    percentualContratual: number = 4.0,
    aluguelMinimoReferencia: number = 5500
  ): PreviewCalculoAuditoria {
    const declarado = Math.max(0, faturamentoDeclarado || 0);
    const auditado = Math.max(0, faturamentoAuditado || 0);
    const perc = Math.max(0, percentualContratual || 0);
    const minimo = Math.max(0, aluguelMinimoReferencia || 0);

    const diferencaValor = auditado - declarado;
    const diferencaPercentual =
      declarado > 0 ? (diferencaValor / declarado) * 100 : auditado > 0 ? 100 : 0;

    const aluguelVariavelCalculado = auditado * (perc / 100);
    const aluguelReferencia = Math.max(minimo, aluguelVariavelCalculado);

    let statusSugerido: StatusAuditoriaVenda = 'CONFORME';
    if (Math.abs(diferencaValor) > 100) {
      statusSugerido = 'DIVERGENTE';
    } else if (auditado === 0 && declarado === 0) {
      statusSugerido = 'PENDENTE';
    }

    return {
      diferencaValor,
      diferencaPercentual: Number(diferencaPercentual.toFixed(2)),
      aluguelVariavelCalculado: Number(aluguelVariavelCalculado.toFixed(2)),
      aluguelReferencia: Number(aluguelReferencia.toFixed(2)),
      statusSugerido,
    };
  }

  /**
   * Consulta a carteira global de auditorias com filtros dinâmicos
   */
  public static obterCarteiraAuditorias(
    filtros: FiltrosAuditoriaVendas = {},
    userRole: string = 'ADMIN'
  ): RegistroAuditoriaVenda[] {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error('ACESSO_NEGADO_L38: Usuário não possui privilégios de auditoria de vendas.');
    }

    let resultado = bancoAuditorias.filter((a) => a.ativo);

    // Filtro de Competência
    if (filtros.competencia && filtros.competencia !== 'TODAS') {
      resultado = resultado.filter((a) => a.competencia === filtros.competencia);
    }

    // Filtro de Status
    if (filtros.status && filtros.status !== 'TODOS') {
      resultado = resultado.filter((a) => a.status === filtros.status);
    }

    // Filtro de Divergência
    if (filtros.divergencia === 'APENAS_DIVERGENTES') {
      resultado = resultado.filter((a) => a.status === 'DIVERGENTE');
    } else if (filtros.divergencia === 'CONFORMES') {
      resultado = resultado.filter((a) => a.status === 'CONFORME');
    }

    // Busca textual
    if (filtros.busca && filtros.busca.trim().length > 0) {
      const termo = this.normalizarBuscaL38(filtros.busca);
      resultado = resultado.filter((a) => {
        return (
          this.normalizarBuscaL38(a.nomeLoja).includes(termo) ||
          this.normalizarBuscaL38(a.nomePermissionario).includes(termo) ||
          this.normalizarBuscaL38(a.numeroEspaco).includes(termo) ||
          this.normalizarBuscaL38(a.idContrato).includes(termo) ||
          this.normalizarBuscaL38(a.competencia).includes(termo) ||
          this.normalizarBuscaL38(a.setorEspaco).includes(termo)
        );
      });
    }

    // Ordenação
    const ord = filtros.ordenacao || 'MAIS_RECENTE';
    resultado.sort((a, b) => {
      switch (ord) {
        case 'MAIOR_DIFERENCA':
          return Math.abs(b.diferencaValor) - Math.abs(a.diferencaValor);
        case 'MAIOR_FATURAMENTO':
          return b.faturamentoAuditado - a.faturamentoAuditado;
        case 'NOME_LOJA':
          return a.nomeLoja.localeCompare(b.nomeLoja);
        case 'MAIS_RECENTE':
        default:
          return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      }
    });

    return resultado;
  }

  /**
   * Consolidação de KPIs executivos da auditoria
   */
  public static obterKPIs(userRole: string = 'ADMIN'): KPIsAuditoriaVendas {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error('ACESSO_NEGADO_L38: Acesso não autorizado.');
    }

    const ativas = bancoAuditorias.filter((a) => a.ativo);

    let totalConformes = 0;
    let totalDivergentes = 0;
    let totalPendentes = 0;
    let faturamentoDeclaradoTotal = 0;
    let faturamentoAuditadoTotal = 0;
    let diferencaTotalValor = 0;
    let aluguelReferenciaTotal = 0;
    let comEvidenciaTotal = 0;

    for (const a of ativas) {
      if (a.status === 'CONFORME') totalConformes++;
      if (a.status === 'DIVERGENTE') totalDivergentes++;
      if (a.status === 'PENDENTE') totalPendentes++;

      faturamentoDeclaradoTotal += a.faturamentoDeclarado;
      faturamentoAuditadoTotal += a.faturamentoAuditado;
      diferencaTotalValor += a.diferencaValor;
      aluguelReferenciaTotal += a.aluguelReferencia;

      if (a.documentoUrl || a.documentoNome) {
        comEvidenciaTotal++;
      }
    }

    return {
      totalAuditorias: ativas.length,
      totalConformes,
      totalDivergentes,
      totalPendentes,
      faturamentoDeclaradoTotal,
      faturamentoAuditadoTotal,
      diferencaTotalValor,
      aluguelReferenciaTotal,
      comEvidenciaTotal,
    };
  }

  /**
   * Consulta auditoria por ID
   */
  public static obterAuditoriaPorId(
    idAuditoria: string,
    userRole: string = 'ADMIN'
  ): RegistroAuditoriaVenda | null {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error('ACESSO_NEGADO_L38: Acesso não autorizado.');
    }
    const item = bancoAuditorias.find((a) => a.idAuditoriaVenda === idAuditoria && a.ativo);
    return item ? { ...item } : null;
  }

  /**
   * Salva ou Atualiza uma Auditoria de Venda (Idempotente e com auditoria append-only)
   */
  public static salvarAuditoria(
    dados: {
      idAuditoriaVenda?: string;
      idLoja: string;
      nomeLoja: string;
      idEspaco: string;
      numeroEspaco: string;
      setorEspaco: string;
      idOcupacao?: string;
      idPermissionario: string;
      nomePermissionario: string;
      idContrato: string;
      competencia: string;
      faturamentoDeclarado: number;
      faturamentoAuditado: number;
      percentualContratual?: number;
      aluguelMinimoReferencia?: number;
      origemDado?: OrigemDadoAuditoria;
      status?: StatusAuditoriaVenda;
      documentoUrl?: string;
      documentoNome?: string;
      observacao?: string;
      justificativa?: string;
    },
    userRole: string = 'ADMIN',
    userId: string = 'AUDITOR-01',
    userEmail: string = 'auditoria@cfmall.com.br',
    clientRequestId?: string
  ): RegistroAuditoriaVenda {
    if (!this.verificarPermissaoEscrita(userRole)) {
      throw new Error('ACESSO_NEGADO_L38: Usuário não possui permissão para editar auditorias.');
    }

    // Regra de Unicidade: impede duplicidade para a mesma (idLoja, idEspaco, competencia)
    const duplicata = bancoAuditorias.find(
      (a) =>
        a.ativo &&
        a.idLoja === dados.idLoja &&
        a.idEspaco === dados.idEspaco &&
        a.competencia === dados.competencia &&
        a.idAuditoriaVenda !== dados.idAuditoriaVenda
    );

    if (duplicata) {
      throw new Error(
        `DUPLICIDADE_BLOQUEADA: Já existe auditoria ativa (${duplicata.idAuditoriaVenda}) para ${dados.nomeLoja} no espaço ${dados.numeroEspaco} para a competência ${dados.competencia}.`
      );
    }

    const agora = new Date().toISOString();
    const percentual = dados.percentualContratual !== undefined ? dados.percentualContratual : 4.0;
    const aluguelMinimo = dados.aluguelMinimoReferencia !== undefined ? dados.aluguelMinimoReferencia : 5500;

    const preview = this.calcularPreview(
      dados.faturamentoDeclarado,
      dados.faturamentoAuditado,
      percentual,
      aluguelMinimo
    );

    const statusFinal = dados.status || preview.statusSugerido;

    // Caso de Edição
    if (dados.idAuditoriaVenda) {
      const index = bancoAuditorias.findIndex((a) => a.idAuditoriaVenda === dados.idAuditoriaVenda);
      if (index === -1) {
        throw new Error(`Auditoria não encontrada: ${dados.idAuditoriaVenda}`);
      }

      const anterior = bancoAuditorias[index];

      const atualizado: RegistroAuditoriaVenda = {
        ...anterior,
        nomeLoja: dados.nomeLoja || anterior.nomeLoja,
        numeroEspaco: dados.numeroEspaco || anterior.numeroEspaco,
        setorEspaco: dados.setorEspaco || anterior.setorEspaco,
        idPermissionario: dados.idPermissionario || anterior.idPermissionario,
        nomePermissionario: dados.nomePermissionario || anterior.nomePermissionario,
        idContrato: dados.idContrato || anterior.idContrato,
        competencia: dados.competencia || anterior.competencia,
        faturamentoDeclarado: dados.faturamentoDeclarado,
        faturamentoAuditado: dados.faturamentoAuditado,
        diferencaValor: preview.diferencaValor,
        diferencaPercentual: preview.diferencaPercentual,
        percentualContratual: percentual,
        aluguelMinimoReferencia: aluguelMinimo,
        aluguelVariavelCalculado: preview.aluguelVariavelCalculado,
        aluguelReferencia: preview.aluguelReferencia,
        status: statusFinal,
        origemDado: dados.origemDado || anterior.origemDado,
        documentoUrl: dados.documentoUrl !== undefined ? dados.documentoUrl : anterior.documentoUrl,
        documentoNome: dados.documentoNome !== undefined ? dados.documentoNome : anterior.documentoNome,
        observacao: dados.observacao !== undefined ? dados.observacao : anterior.observacao,
        auditadoPor: userId,
        auditadoEm: agora,
        atualizadoEm: agora,
        clientRequestId: clientRequestId || anterior.clientRequestId,
      };

      bancoAuditorias[index] = atualizado;

      // Registro na trilha imutável
      const eventoHist: HistoricoAuditoriaVenda = {
        idEvento: `EVT-AUD-${Date.now()}`,
        idAuditoriaVenda: atualizado.idAuditoriaVenda,
        tipoEvento: 'AUDITORIA_ATUALIZADA',
        dataHora: agora,
        usuarioId: userId,
        usuarioEmail: userEmail,
        detalhes: `Auditoria atualizada. Auditado: ${this.formatarMoeda(anterior.faturamentoAuditado)} → ${this.formatarMoeda(atualizado.faturamentoAuditado)}. Dif: ${this.formatarMoeda(atualizado.diferencaValor)}.`,
        faturamentoDeclaradoAnterior: anterior.faturamentoDeclarado,
        faturamentoAuditadoAnterior: anterior.faturamentoAuditado,
        faturamentoDeclaradoNovo: atualizado.faturamentoDeclarado,
        faturamentoAuditadoNovo: atualizado.faturamentoAuditado,
        statusAnterior: anterior.status,
        statusNovo: atualizado.status,
        justificativa: dados.justificativa || 'Ajuste de aferição de faturamento.',
        snapshot: { ...atualizado },
      };

      bancoHistorico.unshift(eventoHist);

      return atualizado;
    }

    // Caso de Criação
    const novoId = `AUD-VND-${Date.now().toString().slice(-6)}`;
    const novoRegistro: RegistroAuditoriaVenda = {
      idAuditoriaVenda: novoId,
      idLoja: dados.idLoja,
      nomeLoja: dados.nomeLoja,
      idEspaco: dados.idEspaco,
      numeroEspaco: dados.numeroEspaco,
      setorEspaco: dados.setorEspaco,
      idOcupacao: dados.idOcupacao || `OCUP-${dados.numeroEspaco}-001`,
      idPermissionario: dados.idPermissionario,
      nomePermissionario: dados.nomePermissionario,
      idContrato: dados.idContrato,
      competencia: dados.competencia,
      faturamentoDeclarado: dados.faturamentoDeclarado,
      faturamentoAuditado: dados.faturamentoAuditado,
      diferencaValor: preview.diferencaValor,
      diferencaPercentual: preview.diferencaPercentual,
      status: statusFinal,
      origemDado: dados.origemDado || 'AUDITORIA_PRESENCIAL',
      documentoUrl: dados.documentoUrl,
      documentoNome: dados.documentoNome,
      auditadoPor: userId,
      auditadoEm: agora,
      percentualContratual: percentual,
      aluguelMinimoReferencia: aluguelMinimo,
      aluguelVariavelCalculado: preview.aluguelVariavelCalculado,
      aluguelReferencia: preview.aluguelReferencia,
      baseCalculo: 'FATURAMENTO_AUDITADO',
      observacao: dados.observacao || '',
      ativo: true,
      clientRequestId: clientRequestId || `REQ-${Date.now()}`,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    bancoAuditorias.unshift(novoRegistro);

    // Registro na trilha imutável
    const eventoHist: HistoricoAuditoriaVenda = {
      idEvento: `EVT-AUD-${Date.now()}`,
      idAuditoriaVenda: novoId,
      tipoEvento: 'AUDITORIA_CRIADA',
      dataHora: agora,
      usuarioId: userId,
      usuarioEmail: userEmail,
      detalhes: `Nova auditoria cadastrada. Declarado: ${this.formatarMoeda(novoRegistro.faturamentoDeclarado)}, Auditado: ${this.formatarMoeda(novoRegistro.faturamentoAuditado)}. Status: ${novoRegistro.status}.`,
      faturamentoDeclaradoNovo: novoRegistro.faturamentoDeclarado,
      faturamentoAuditadoNovo: novoRegistro.faturamentoAuditado,
      statusNovo: novoRegistro.status,
      justificativa: dados.justificativa || 'Cadastro inicial da competência.',
      snapshot: { ...novoRegistro },
    };

    bancoHistorico.unshift(eventoHist);

    return novoRegistro;
  }

  /**
   * Consulta o histórico/trilha imutável de uma auditoria
   */
  public static obterHistoricoAuditoria(
    idAuditoriaVenda: string,
    userRole: string = 'ADMIN'
  ): HistoricoAuditoriaVenda[] {
    if (!this.verificarPermissaoLeitura(userRole)) {
      throw new Error('ACESSO_NEGADO_L38: Acesso não autorizado.');
    }
    return bancoHistorico.filter((h) => h.idAuditoriaVenda === idAuditoriaVenda);
  }

  /**
   * Obter lista de competências disponíveis
   */
  public static obterCompetenciasDisponiveis(): string[] {
    const comps = new Set<string>();
    bancoAuditorias.forEach((a) => comps.add(a.competencia));
    return Array.from(comps).sort().reverse();
  }
}
