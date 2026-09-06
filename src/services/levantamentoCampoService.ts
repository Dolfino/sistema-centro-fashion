/**
 * Serviço de Levantamento de Campo (Fase L2.6) - Centro Fashion Fortaleza
 * Paridade com L26_LevantamentoCampoService.gs
 */

export type SituacaoEncontrada =
  | 'EM_OPERACAO'
  | 'FECHADO_TEMPORARIAMENTE'
  | 'VAGO'
  | 'EM_MONTAGEM'
  | 'EM_REFORMA'
  | 'NAO_IDENTIFICADO'
  | 'RECUSOU_ATENDIMENTO'
  | 'OUTRO';

export type ResultadoCadastro =
  | 'CONCLUIDO'
  | 'INCOMPLETO'
  | 'REVISAR'
  | 'RECUSOU'
  | 'FECHADO'
  | 'INACESSIVEL'
  | 'PENDENTE';

export interface PontoLevantamento {
  idPonto: string;
  idSessao: string;
  idLojaMapa: string;
  idEspaco: string;
  numeroBox: string;
  nomeLoja: string;
  segmento: string;
  setor: string;
  corredor: string;
  ordemNoCorredor: number;
  situacao: SituacaoEncontrada;
  resultado: ResultadoCadastro;
  percentualCompletude: number;
  observacao?: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
  statusSync: 'SINCRONIZADO' | 'PENDENTE_SYNC';
}

export interface RegistroVisita {
  idVisita: string;
  idSessao: string;
  idPonto: string;
  idLojaMapa: string;
  numeroBox: string;
  nomeLoja: string;
  situacaoEncontrada: SituacaoEncontrada;
  resultado: ResultadoCadastro;
  completudeAntes: number;
  completudeDepois: number;
  observacao: string;
  usuario: string;
  registradoEm: string;
  clientRequestId: string;
  statusSync: 'SINCRONIZADO' | 'PENDENTE_SYNC';
}

export interface SessaoLevantamento {
  idSessao: string;
  titulo: string;
  descricao: string;
  status: 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA';
  setorAlvo: string;
  dataInicio: string;
  responsavel: string;
  indicadores: {
    totalPrevisto: number;
    concluidos: number;
    incompletos: number;
    pendentes: number;
    recusas: number;
    fechados: number;
    inacessiveis: number;
    percentualProgresso: number;
    completudeMedia: number;
  };
}

export const SITUACOES_LABELS: Record<SituacaoEncontrada, string> = {
  EM_OPERACAO: 'Em operação',
  FECHADO_TEMPORARIAMENTE: 'Fechado temporariamente',
  VAGO: 'Vago / Disponível',
  EM_MONTAGEM: 'Em montagem',
  EM_REFORMA: 'Em reforma',
  NAO_IDENTIFICADO: 'Não identificado',
  RECUSOU_ATENDIMENTO: 'Recusou atendimento',
  OUTRO: 'Outro',
};

export const RESULTADOS_CONFIG: Record<
  ResultadoCadastro,
  { label: string; cor: string; bg: string; icon: string }
> = {
  CONCLUIDO: { label: 'Concluído', cor: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '✅' },
  INCOMPLETO: { label: 'Incompleto', cor: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '⚠️' },
  REVISAR: { label: 'Revisar', cor: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: '🔍' },
  RECUSOU: { label: 'Recusou', cor: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '🚫' },
  FECHADO: { label: 'Fechado', cor: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '🔒' },
  INACESSIVEL: { label: 'Inacessível', cor: '#64748b', bg: 'rgba(100, 116, 139, 0.15)', icon: '🚧' },
  PENDENTE: { label: 'Pendente', cor: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.12)', icon: '⏳' },
};

// Base inicial de pontos de levantamento sincronizada com os boxes reais do shopping
let PONTOS_SESSAO: PontoLevantamento[] = [
  {
    idPonto: 'PL-001',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '1',
    idEspaco: 'ESP-1176',
    numeroBox: '1176',
    nomeLoja: 'Moda Aurora',
    segmento: 'Moda Feminina',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 1,
    situacao: 'EM_OPERACAO',
    resultado: 'CONCLUIDO',
    percentualCompletude: 100,
    observacao: 'Cadastro completo validado em campo. Lojista presente.',
    atualizadoPor: 'Fiscal Carlos',
    atualizadoEm: '06/09/2026 10:15',
    statusSync: 'SINCRONIZADO',
  },
  {
    idPonto: 'PL-002',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '2',
    idEspaco: 'ESP-1177',
    numeroBox: '1177',
    nomeLoja: 'Bella Jeans Fortaleza',
    segmento: 'Jeanswear & Denim',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 2,
    situacao: 'EM_OPERACAO',
    resultado: 'PENDENTE',
    percentualCompletude: 20,
    statusSync: 'SINCRONIZADO',
  },
  {
    idPonto: 'PL-003',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '3',
    idEspaco: 'ESP-1178',
    numeroBox: '1178',
    nomeLoja: 'Estilo Fashion Kids',
    segmento: 'Moda Infantil',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 3,
    situacao: 'EM_OPERACAO',
    resultado: 'PENDENTE',
    percentualCompletude: 0,
    statusSync: 'SINCRONIZADO',
  },
  {
    idPonto: 'PL-004',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '4',
    idEspaco: 'ESP-1179',
    numeroBox: '1179',
    nomeLoja: 'Acessórios & Brilho',
    segmento: 'Bijuterias e Bolsas',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 4,
    situacao: 'EM_OPERACAO',
    resultado: 'PENDENTE',
    percentualCompletude: 10,
    statusSync: 'SINCRONIZADO',
  },
  {
    idPonto: 'PL-005',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '5',
    idEspaco: 'ESP-1180',
    numeroBox: '1180',
    nomeLoja: 'Beachwear Sol & Mar',
    segmento: 'Moda Praia',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 5,
    situacao: 'EM_OPERACAO',
    resultado: 'PENDENTE',
    percentualCompletude: 0,
    statusSync: 'SINCRONIZADO',
  },
  {
    idPonto: 'PL-006',
    idSessao: 'SESSAO-CENSO-2026',
    idLojaMapa: '6',
    idEspaco: 'ESP-1181',
    numeroBox: '1181',
    nomeLoja: 'Box Disponível',
    segmento: 'Desocupado',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    ordemNoCorredor: 6,
    situacao: 'VAGO',
    resultado: 'FECHADO',
    percentualCompletude: 80,
    observacao: 'Box livre para comercialização.',
    atualizadoPor: 'Fiscal Carlos',
    atualizadoEm: '06/09/2026 10:45',
    statusSync: 'SINCRONIZADO',
  },
];

let HISTORICO_VISITAS: RegistroVisita[] = [
  {
    idVisita: 'VIS-001',
    idSessao: 'SESSAO-CENSO-2026',
    idPonto: 'PL-001',
    idLojaMapa: '1',
    numeroBox: '1176',
    nomeLoja: 'Moda Aurora',
    situacaoEncontrada: 'EM_OPERACAO',
    resultado: 'CONCLUIDO',
    completudeAntes: 40,
    completudeDepois: 100,
    observacao: 'Cadastro completo validado em campo. Lojista presente.',
    usuario: 'Fiscal Carlos',
    registradoEm: '06/09/2026 10:15',
    clientRequestId: 'req-init-001',
    statusSync: 'SINCRONIZADO',
  },
];

let FILA_OUTBOX: RegistroVisita[] = [];

/**
 * Recalcula e retorna os indicadores da sessão de levantamento ativa
 */
export function getSessaoAtiva(): SessaoLevantamento {
  const totalPrevisto = PONTOS_SESSAO.length;
  const concluidos = PONTOS_SESSAO.filter((p) => p.resultado === 'CONCLUIDO').length;
  const incompletos = PONTOS_SESSAO.filter((p) => p.resultado === 'INCOMPLETO').length;
  const pendentes = PONTOS_SESSAO.filter((p) => p.resultado === 'PENDENTE').length;
  const recusas = PONTOS_SESSAO.filter((p) => p.resultado === 'RECUSOU').length;
  const fechados = PONTOS_SESSAO.filter((p) => p.resultado === 'FECHADO').length;
  const inacessiveis = PONTOS_SESSAO.filter((p) => p.resultado === 'INACESSIVEL').length;

  const somaCompletude = PONTOS_SESSAO.reduce((acc, p) => acc + (p.percentualCompletude || 0), 0);
  const completudeMedia = totalPrevisto > 0 ? Math.round(somaCompletude / totalPrevisto) : 0;
  const finalizados = concluidos + recusas + fechados + inacessiveis;
  const percentualProgresso = totalPrevisto > 0 ? Math.round((finalizados / totalPrevisto) * 100) : 0;

  return {
    idSessao: 'SESSAO-CENSO-2026',
    titulo: 'Censo Geral do Mall 2026',
    descricao: 'Levantamento cadastral de campo e qualificação de lojistas por corredor.',
    status: 'EM_ANDAMENTO',
    setorAlvo: 'Setor Azul • Piso 1',
    dataInicio: '01/09/2026',
    responsavel: 'Equipe de Operações & Fiscalização',
    indicadores: {
      totalPrevisto,
      concluidos,
      incompletos,
      pendentes,
      recusas,
      fechados,
      inacessiveis,
      percentualProgresso,
      completudeMedia,
    },
  };
}

/**
 * Retorna todos os pontos cadastrados para a sessão de campo com filtros opcionais
 */
export function getPontosSessao(filtros?: {
  resultado?: ResultadoCadastro;
  termoBusca?: string;
}): PontoLevantamento[] {
  let pontos = [...PONTOS_SESSAO];

  if (filtros?.resultado) {
    pontos = pontos.filter((p) => p.resultado === filtros.resultado);
  }

  if (filtros?.termoBusca && filtros.termoBusca.trim() !== '') {
    const termo = filtros.termoBusca.toLowerCase().trim();
    pontos = pontos.filter(
      (p) =>
        p.numeroBox.toLowerCase().includes(termo) ||
        p.nomeLoja.toLowerCase().includes(termo) ||
        p.segmento.toLowerCase().includes(termo) ||
        p.corredor.toLowerCase().includes(termo)
    );
  }

  // Ordena por Corredor, Ordem no Corredor e Número
  return pontos.sort((a, b) => {
    if (a.corredor !== b.corredor) return a.corredor.localeCompare(b.corredor);
    if (a.ordemNoCorredor !== b.ordemNoCorredor) return a.ordemNoCorredor - b.ordemNoCorredor;
    return a.numeroBox.localeCompare(b.numeroBox);
  });
}

/**
 * Encontra o próximo ponto pendente de atendimento na sequência da rota física
 */
export function obterProximoPontoPendente(idPontoAtual?: string): PontoLevantamento | null {
  const pontosOrdenados = getPontosSessao();
  const indexAtual = idPontoAtual ? pontosOrdenados.findIndex((p) => p.idPonto === idPontoAtual) : -1;

  // Primeiro busca à frente do ponto atual
  if (indexAtual >= 0) {
    for (let i = indexAtual + 1; i < pontosOrdenados.length; i++) {
      const p = pontosOrdenados[i];
      if (p.resultado === 'PENDENTE' || p.resultado === 'INCOMPLETO' || p.resultado === 'REVISAR') {
        return p;
      }
    }
  }

  // Se não encontrou à frente, busca do início
  for (let i = 0; i < pontosOrdenados.length; i++) {
    const p = pontosOrdenados[i];
    if (p.idPonto !== idPontoAtual && (p.resultado === 'PENDENTE' || p.resultado === 'INCOMPLETO' || p.resultado === 'REVISAR')) {
      return p;
    }
  }

  return null;
}

/**
 * Registra o levantamento/vistoria de um ponto (com idempotência por clientRequestId)
 */
export function registrarLevantamento(payload: {
  idPonto: string;
  situacao: SituacaoEncontrada;
  resultado: ResultadoCadastro;
  percentualCompletude: number;
  observacao: string;
  usuario?: string;
  clientRequestId?: string;
}): { ok: boolean; visita: RegistroVisita; pontoAtualizado: PontoLevantamento } {
  const pontoIndex = PONTOS_SESSAO.findIndex((p) => p.idPonto === payload.idPonto);
  if (pontoIndex === -1) {
    throw new Error(`Ponto de levantamento não encontrado: ${payload.idPonto}`);
  }

  const ponto = PONTOS_SESSAO[pontoIndex];
  const reqId = payload.clientRequestId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Checa idempotência
  const visitaExistente = HISTORICO_VISITAS.find((v) => v.clientRequestId === reqId);
  if (visitaExistente) {
    return { ok: true, visita: visitaExistente, pontoAtualizado: ponto };
  }

  const completudeAntes = ponto.percentualCompletude;
  const agora = new Date();
  const dataFormatada = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

  const novaVisita: RegistroVisita = {
    idVisita: `VIS-${Date.now()}`,
    idSessao: ponto.idSessao,
    idPonto: ponto.idPonto,
    idLojaMapa: ponto.idLojaMapa,
    numeroBox: ponto.numeroBox,
    nomeLoja: ponto.nomeLoja,
    situacaoEncontrada: payload.situacao,
    resultado: payload.resultado,
    completudeAntes,
    completudeDepois: payload.percentualCompletude,
    observacao: payload.observacao,
    usuario: payload.usuario || 'Fiscal em Campo',
    registradoEm: dataFormatada,
    clientRequestId: reqId,
    statusSync: 'SINCRONIZADO',
  };

  HISTORICO_VISITAS.unshift(novaVisita);

  // Atualiza ponto
  const pontoAtualizado: PontoLevantamento = {
    ...ponto,
    situacao: payload.situacao,
    resultado: payload.resultado,
    percentualCompletude: payload.percentualCompletude,
    observacao: payload.observacao,
    atualizadoPor: payload.usuario || 'Fiscal em Campo',
    atualizadoEm: dataFormatada,
    statusSync: 'SINCRONIZADO',
  };

  PONTOS_SESSAO[pontoIndex] = pontoAtualizado;

  return { ok: true, visita: novaVisita, pontoAtualizado };
}

/**
 * Retorna o histórico de visitas registradas
 */
export function getHistoricoVisitas(idPonto?: string): RegistroVisita[] {
  if (idPonto) {
    return HISTORICO_VISITAS.filter((v) => v.idPonto === idPonto);
  }
  return HISTORICO_VISITAS;
}

/**
 * Quantidade de itens pendentes na fila de outbox offline
 */
export function getFilaOutboxCount(): number {
  return FILA_OUTBOX.length;
}

/**
 * Sincroniza os itens pendentes na fila local
 */
export function sincronizarFilaOffline(): { sincronizados: number } {
  const count = FILA_OUTBOX.length;
  FILA_OUTBOX = [];
  return { sincronizados: count };
}
