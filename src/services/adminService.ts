/**
 * Serviço da Central de Administração Global (Fase L5.0) - Centro Fashion Fortaleza
 * Paridade com AdminService.gs, UsuarioService.gs, AuthService.gs, SecurityService.gs,
 * LogService.gs, BackupService.gs e DiagnosticoMVP12.gs
 *
 * Cobre as Superfícies #24 a #32 do Inventário Oficial:
 * - #24 Administração Geral
 * - #25 Usuários
 * - #26 Perfis & Permissões RBAC
 * - #27 Auditoria do Sistema
 * - #28 Backup & Integridade
 * - #29 Saúde Operacional
 * - #30 Inventário de Ativos
 * - #31 Planos Preventivos
 * - #32 Comunicação Operacional
 */

export type PapelUsuario =
  | 'ADMIN'
  | 'GESTAO'
  | 'FINANCEIRO'
  | 'MARKETING'
  | 'CAMPO'
  | 'CONSULTA';

export interface UsuarioSistema {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: PapelUsuario;
  ativo: boolean;
  ultimoAcesso: string;
  criadoEm: string;
}

export interface PermissaoModulo {
  modulo: string;
  descricao: string;
  papeisPermitidos: PapelUsuario[];
  operacoes: ('LEITURA' | 'CRIACAO' | 'EDICAO' | 'EXCLUSAO')[];
}

export interface EventoAuditoria {
  id: string;
  timestamp: string;
  operadorEmail: string;
  operadorNome: string;
  acao: string;
  entidade: string;
  idRegistro?: string;
  detalhes: string;
  ipOrigem: string;
}

export interface PontoBackup {
  id: string;
  dataHora: string;
  tipo: 'AUTOMATICO' | 'MANUAL';
  tamanhoMb: number;
  totalRegistros: number;
  status: 'DISPONIVEL' | 'RESTAURANDO' | 'ARQUIVADO';
  hashIntegridade: string;
}

export interface DiagnosticoSaude {
  statusGeral: 'SAUDAVEL' | 'DEGRADADO' | 'CRITICO';
  uptimeDias: number;
  versaoApp: string;
  clusterK3s: {
    status: string;
    podsTotal: number;
    podsRunning: number;
    consumoCpuPercentual: number;
    consumoMemoriaPercentual: number;
  };
  bancoPostgres: {
    status: string;
    conexoesAtivas: number;
    tamanhoBancoMb: number;
    latenciaMs: number;
  };
  storageMinIO: {
    status: string;
    totalObjetos: number;
    espacoOcupadoGb: number;
    bucketHealth: 'OK' | 'ALERTA';
  };
  filaSyncOutbox: {
    pendentes: number;
    erros: number;
    ultimoSyncSucesso: string;
  };
}

export interface PlanoPreventivo {
  id: string;
  titulo: string;
  setorAlvo: string;
  periodicidade: 'SEMANAL' | 'QUINZENAL' | 'MENSAL';
  totalPontosAlvo: number;
  concluidosCiclo: number;
  responsavelEquipe: string;
  proximaExecucao: string;
  status: 'ATIVO' | 'PAUSADO';
}

export interface AvisoComunicacao {
  id: string;
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  autor: string;
  destinatarios: 'TODOS' | 'CAMPO' | 'AUDITORES';
  prioridade: 'NORMAL' | 'ALTA' | 'URGENTE';
  lidoConfirmadoCount: number;
}

// Mock Inicial Baseado no Ecossistema Centro Fashion
let USUARIOS_MOCK: UsuarioSistema[] = [
  {
    id: 'USR-001',
    nome: 'Superintendência Geral',
    email: 'diretoria@centrofashiofortaleza.com.br',
    cargo: 'Diretoria Executiva',
    perfil: 'ADMIN',
    ativo: true,
    ultimoAcesso: 'Hoje, 18:20',
    criadoEm: '2026-01-10',
  },
  {
    id: 'USR-002',
    nome: 'Carlos Auditor Fiscal',
    email: 'auditoria01@centrofashiofortaleza.com.br',
    cargo: 'Auditor Fiscal Presencial',
    perfil: 'FINANCEIRO',
    ativo: true,
    ultimoAcesso: 'Hoje, 17:45',
    criadoEm: '2026-02-15',
  },
  {
    id: 'USR-003',
    nome: 'Juliana Marketing',
    email: 'marketing@centrofashiofortaleza.com.br',
    cargo: 'Coordenadora Comercial',
    perfil: 'MARKETING',
    ativo: true,
    ultimoAcesso: 'Ontem, 16:30',
    criadoEm: '2026-03-01',
  },
  {
    id: 'USR-004',
    nome: 'Roberto Vistoriador',
    email: 'campo01@centrofashiofortaleza.com.br',
    cargo: 'Inspetor de Campo & Levantamento',
    perfil: 'CAMPO',
    ativo: true,
    ultimoAcesso: 'Hoje, 14:10',
    criadoEm: '2026-04-12',
  },
  {
    id: 'USR-005',
    nome: 'Fernanda Controladoria',
    email: 'financeiro@centrofashiofortaleza.com.br',
    cargo: 'Analista Financeira Plena',
    perfil: 'FINANCEIRO',
    ativo: true,
    ultimoAcesso: 'Hoje, 16:00',
    criadoEm: '2026-02-20',
  },
];

let AVISOS_MOCK: AvisoComunicacao[] = [
  {
    id: 'AVS-01',
    titulo: 'Censo de Fachadas e Mídia - Setor Azul',
    mensagem: 'Equipes de campo devem priorizar a checagem das vitrines e totens digitais do Nível 1 antes das 19h.',
    dataEnvio: '06/09/2026 14:00',
    autor: 'Superintendência Geral',
    destinatarios: 'CAMPO',
    prioridade: 'ALTA',
    lidoConfirmadoCount: 4,
  },
  {
    id: 'AVS-02',
    titulo: 'Auditoria Especial de Vendas da Campanha Moda Primavera',
    mensagem: 'Confrontar notas emitidas vs aluguel percentual declarado para as lojas de Jeanswear.',
    dataEnvio: '05/09/2026 09:30',
    autor: 'Diretoria Executiva',
    destinatarios: 'AUDITORES',
    prioridade: 'URGENTE',
    lidoConfirmadoCount: 6,
  },
];

export class AdminService {
  /**
   * Retorna lista de usuários do sistema
   */
  static obterUsuarios(): UsuarioSistema[] {
    return [...USUARIOS_MOCK];
  }

  /**
   * Salva ou edita um usuário
   */
  static salvarUsuario(usuario: Partial<UsuarioSistema>): UsuarioSistema {
    if (usuario.id) {
      const idx = USUARIOS_MOCK.findIndex((u) => u.id === usuario.id);
      if (idx >= 0) {
        USUARIOS_MOCK[idx] = { ...USUARIOS_MOCK[idx], ...usuario } as UsuarioSistema;
        this.registrarLog('USUARIO_ATUALIZADO', 'USUARIOS', usuario.id, `Atualizado perfil de ${usuario.nome}`);
        return USUARIOS_MOCK[idx];
      }
    }
    const novo: UsuarioSistema = {
      id: `USR-${String(USUARIOS_MOCK.length + 1).padStart(3, '0')}`,
      nome: usuario.nome || 'Novo Usuário',
      email: usuario.email || 'usuario@centrofashiofortaleza.com.br',
      cargo: usuario.cargo || 'Operador',
      perfil: usuario.perfil || 'CONSULTA',
      ativo: usuario.ativo !== undefined ? usuario.ativo : true,
      ultimoAcesso: 'Nunca',
      criadoEm: new Date().toISOString().split('T')[0],
    };
    USUARIOS_MOCK.push(novo);
    this.registrarLog('USUARIO_CRIADO', 'USUARIOS', novo.id, `Criado usuário ${novo.nome} (${novo.email})`);
    return novo;
  }

  /**
   * Retorna matriz de permissões RBAC por módulo
   */
  static obterMatrizPermissoes(): PermissaoModulo[] {
    return [
      {
        modulo: 'Cartografia & Mapa',
        descricao: 'Visualização, navegação vetorial e localização de boxes e sinalizações',
        papeisPermitidos: ['ADMIN', 'GESTAO', 'FINANCEIRO', 'MARKETING', 'CAMPO', 'CONSULTA'],
        operacoes: ['LEITURA'],
      },
      {
        modulo: 'Levantamento de Campo & Ronda',
        descricao: 'Aferição de conformidade de lojas, registro de fotos e pendências físicas',
        papeisPermitidos: ['ADMIN', 'GESTAO', 'CAMPO'],
        operacoes: ['LEITURA', 'CRIACAO', 'EDICAO'],
      },
      {
        modulo: 'Campanhas & Marketing',
        descricao: 'Gestão de promoções comerciais, eventos e catálogo da vitrine 360°',
        papeisPermitidos: ['ADMIN', 'GESTAO', 'MARKETING'],
        operacoes: ['LEITURA', 'CRIACAO', 'EDICAO'],
      },
      {
        modulo: 'Central Financeira & Contratos',
        descricao: 'Gestão de títulos, parcelas em atraso, termos de acordo e aluguéis garantidos',
        papeisPermitidos: ['ADMIN', 'GESTAO', 'FINANCEIRO'],
        operacoes: ['LEITURA', 'CRIACAO', 'EDICAO', 'EXCLUSAO'],
      },
      {
        modulo: 'Auditoria de Vendas & Fiscal',
        descricao: 'Aferição de faturamento presencial vs declarado, cálculo de aluguel percentual',
        papeisPermitidos: ['ADMIN', 'FINANCEIRO'],
        operacoes: ['LEITURA', 'CRIACAO', 'EDICAO'],
      },
      {
        modulo: 'Dashboard Executivo BI & Analítica',
        descricao: 'Visão macrogencial de ocupação, vacância, mix e matriz de risco',
        papeisPermitidos: ['ADMIN', 'GESTAO', 'FINANCEIRO', 'MARKETING', 'CONSULTA'],
        operacoes: ['LEITURA'],
      },
      {
        modulo: 'Administração Geral & Governança',
        descricao: 'Gestão de acessos, usuários, backups, calibração cartográfica e auditoria',
        papeisPermitidos: ['ADMIN'],
        operacoes: ['LEITURA', 'CRIACAO', 'EDICAO', 'EXCLUSAO'],
      },
    ];
  }

  /**
   * Retorna extrato consolidado da trilha de auditoria
   */
  static obterLogsAuditoria(): EventoAuditoria[] {
    return [
      {
        id: 'LOG-109',
        timestamp: 'Hoje, 18:46:55',
        operadorEmail: 'diretoria@centrofashiofortaleza.com.br',
        operadorNome: 'Superintendência Geral',
        acao: 'DEPLOY_K3S_ROLLOUT',
        entidade: 'CLUSTER_PRODUCAO',
        idRegistro: 'ROLLOUT-L40',
        detalhes: 'Rollout com sucesso do container web com Dashboard Executivo L4.0',
        ipOrigem: '177.136.241.82',
      },
      {
        id: 'LOG-108',
        timestamp: 'Hoje, 18:35:10',
        operadorEmail: 'auditoria01@centrofashiofortaleza.com.br',
        operadorNome: 'Carlos Auditor Fiscal',
        acao: 'AUDITORIA_VENDAS_ATUALIZADA',
        entidade: 'AUDITORIA_FISCAL',
        idRegistro: 'AUD-VND-2026-0001',
        detalhes: 'Faturamento auditado da Aurora Concept ajustado para R$ 150.000,00 (+25%)',
        ipOrigem: '189.40.72.15',
      },
      {
        id: 'LOG-107',
        timestamp: 'Hoje, 17:34:20',
        operadorEmail: 'financeiro@centrofashiofortaleza.com.br',
        operadorNome: 'Fernanda Controladoria',
        acao: 'ACORDO_CONFIRMADO',
        entidade: 'FINANCEIRO_ACORDOS',
        idRegistro: 'ACD-2026-0001',
        detalhes: 'Termo de confissão de dívida firmado para Bella Jeans Fortaleza (Box 1178)',
        ipOrigem: '189.40.72.15',
      },
      {
        id: 'LOG-106',
        timestamp: 'Hoje, 16:15:00',
        operadorEmail: 'campo01@centrofashiofortaleza.com.br',
        operadorNome: 'Roberto Vistoriador',
        acao: 'LEVANTAMENTO_REGISTRADO',
        entidade: 'LEVANTAMENTO_CAMPO',
        idRegistro: 'LC-1106',
        detalhes: 'Vistoria presencial de fachada e vitrine realizada na loja Aurora Concept',
        ipOrigem: '177.18.99.102',
      },
    ];
  }

  static registrarLog(acao: string, entidade: string, idRegistro?: string, detalhes?: string) {
    // Registra internamente na trilha
    console.log(`[AUDITORIA] ${acao} -> ${entidade} (${idRegistro || ''}): ${detalhes || ''}`);
  }

  /**
   * Retorna pontos de backup e snapshots de segurança
   */
  static obterBackups(): PontoBackup[] {
    return [
      {
        id: 'BKP-2026-09-06-18',
        dataHora: '06/09/2026 18:00:00',
        tipo: 'AUTOMATICO',
        tamanhoMb: 148.5,
        totalRegistros: 12450,
        status: 'DISPONIVEL',
        hashIntegridade: 'sha256:7f9a2c...b81e',
      },
      {
        id: 'BKP-2026-09-06-12',
        dataHora: '06/09/2026 12:00:00',
        tipo: 'AUTOMATICO',
        tamanhoMb: 147.9,
        totalRegistros: 12410,
        status: 'DISPONIVEL',
        hashIntegridade: 'sha256:3a1b5c...e49f',
      },
      {
        id: 'BKP-2026-09-05-PRE-L38',
        dataHora: '05/09/2026 23:55:00',
        tipo: 'MANUAL',
        tamanhoMb: 145.2,
        totalRegistros: 12280,
        status: 'DISPONIVEL',
        hashIntegridade: 'sha256:9c8d7e...a123',
      },
    ];
  }

  /**
   * Retorna diagnóstico em tempo real da saúde operacional do cluster
   */
  static obterDiagnosticoSaude(): DiagnosticoSaude {
    return {
      statusGeral: 'SAUDAVEL',
      uptimeDias: 14,
      versaoApp: 'Centro Fashion v5.0-PROD (K3s)',
      clusterK3s: {
        status: 'OPERACIONAL_NORMAL',
        podsTotal: 29,
        podsRunning: 29,
        consumoCpuPercentual: 18.5,
        consumoMemoriaPercentual: 42.0,
      },
      bancoPostgres: {
        status: 'ONLINE',
        conexoesAtivas: 14,
        tamanhoBancoMb: 328.4,
        latenciaMs: 4.2,
      },
      storageMinIO: {
        status: 'ONLINE',
        totalObjetos: 1845,
        espacoOcupadoGb: 12.8,
        bucketHealth: 'OK',
      },
      filaSyncOutbox: {
        pendentes: 0,
        erros: 0,
        ultimoSyncSucesso: 'Sincronizado agora (0s)',
      },
    };
  }

  /**
   * Retorna planos preventivos de inspeção
   */
  static obterPlanosPreventivos(): PlanoPreventivo[] {
    return [
      {
        id: 'PLN-01',
        titulo: 'Ronda Semanal de Totens Digitais & Painéis LED',
        setorAlvo: 'Todos os Setores (Pisos 1, 2 e 3)',
        periodicidade: 'SEMANAL',
        totalPontosAlvo: 24,
        concluidosCiclo: 24,
        responsavelEquipe: 'Equipe de Mídia & TI',
        proximaExecucao: '13/09/2026',
        status: 'ATIVO',
      },
      {
        id: 'PLN-02',
        titulo: 'Vistoria Mensal de Placas Aéreas e Sinalização de Emergência',
        setorAlvo: 'Setores Azul e Verde (Piso 1)',
        periodicidade: 'MENSAL',
        totalPontosAlvo: 58,
        concluidosCiclo: 46,
        responsavelEquipe: 'Engenharia & Manutenção',
        proximaExecucao: '15/09/2026',
        status: 'ATIVO',
      },
      {
        id: 'PLN-03',
        titulo: 'Inspeção de Conservação de Fachadas de Boxes',
        setorAlvo: 'Setor Amarelo (Piso 2)',
        periodicidade: 'QUINZENAL',
        totalPontosAlvo: 120,
        concluidosCiclo: 98,
        responsavelEquipe: 'Equipe de Levantamento de Campo',
        proximaExecucao: '18/09/2026',
        status: 'ATIVO',
      },
    ];
  }

  /**
   * Retorna avisos e recados da comunicação operacional
   */
  static obterAvisos(): AvisoComunicacao[] {
    return [...AVISOS_MOCK];
  }

  /**
   * Envia novo comunicado oficial para a equipe
   */
  static enviarAviso(aviso: Partial<AvisoComunicacao>): AvisoComunicacao {
    const novo: AvisoComunicacao = {
      id: `AVS-${String(AVISOS_MOCK.length + 1).padStart(2, '0')}`,
      titulo: aviso.titulo || 'Comunicado Geral',
      mensagem: aviso.mensagem || '',
      dataEnvio: 'Agora',
      autor: aviso.autor || 'Superintendência',
      destinatarios: aviso.destinatarios || 'TODOS',
      prioridade: aviso.prioridade || 'NORMAL',
      lidoConfirmadoCount: 0,
    };
    AVISOS_MOCK.unshift(novo);
    this.registrarLog('COMUNICADO_PUBLICADO', 'COMUNICACAO', novo.id, novo.titulo);
    return novo;
  }
}
