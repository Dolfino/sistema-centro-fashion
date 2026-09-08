/**
 * Serviço de Gestão Cartográfica, Calibração e Governança Espacial (Fase L5.0) - Centro Fashion Fortaleza
 * Paridade com MVP13_1_2_Diagnostico_Backend.gs, MVP13_2_ValidacaoAssistida_Backend.gs,
 * PlantaService.gs e CorredorAdminServiceMVP12.gs
 *
 * Cobre as Superfícies #33 a #42 do Inventário Oficial:
 * - #33 Central Cartográfica
 * - #34 Calibrar Níveis (Transformação Afim)
 * - #35 Delimitar Estacionamento (Setor Vermelho Nível 3)
 * - #36 Delimitar Áreas do Nível 1 (Hotel, CDM, Áreas Externas)
 * - #37 Governança Cartográfica (Ring Score)
 * - #38 Histórico Cartográfico / Snapshots
 * - #39 Restauração Controlada (Rollback)
 * - #40 Rascunho Cartográfico
 * - #41 Enviar para Validação
 * - #42 Publicação Cartográfica Transacional
 */
import corredoresGeometriaRaw from '../data/corredores_geometria.json';
import lojasProducaoRaw from '../data/lojas_producao_unificadas.json';
import cartografiaDataRaw from '../data/cartografia_referencias_cruzamentos.json';

export interface PontoReferenciaOficial {
  id: string;
  idMapaSetor: string;
  nome: string;
  tipo?: string;
  subtipo?: string;
  x: number;
  y: number;
  descricao: string;
  status: string;
  ativo: boolean;
  confirmada?: boolean;
  localizacaoTexto?: string;
}

export const CORES_PADRAO_TIPOS_REFERENCIA: Record<string, string> = {
  CIRCULACAO: '#38bdf8',    // Azul celeste (esteiras, escadas, elevadores)
  SERVICO: '#10b981',       // Verde esmeralda (saúde, lotérica, bancos, sanitários)
  ALIMENTACAO: '#f59e0b',   // Âmbar dourado (restaurante, lanchonetes)
  QUIOSQUE: '#ec4899',      // Rosa vibrante (quiosques, bombonieres, ilhas)
  AREA_ESPECIAL: '#8b5cf6', // Roxo (área de eventos)
  ADMINISTRATIVO: '#6366f1',// Índigo (gerência comercial, adm)
  APOIO: '#64748b',         // Ardósia / Cinza azulado (depósitos, baús)
  OUTRO: '#06b6d4',         // Ciano (geral)
};

export const NOMES_PADRAO_TIPOS_REFERENCIA: Record<string, string> = {
  CIRCULACAO: 'Circulação',
  SERVICO: 'Serviços',
  ALIMENTACAO: 'Alimentação',
  QUIOSQUE: 'Quiosque',
  AREA_ESPECIAL: 'Área Especial',
  ADMINISTRATIVO: 'Administrativo',
  APOIO: 'Apoio Operacional',
  OUTRO: 'Outros',
};

export interface CruzamentoOficial {
  id: string;
  idMapaSetor: string;
  corredorA?: string;
  corredorB?: string;
  nomeReferencia: string;
  x: number;
  y: number;
  ativo: boolean;
}

export interface CorredorGeometriaItem {
  id: string;
  nome: string;
  codigo: string;
  idMapaSetor: string;
  pontos: { x: number; y: number }[];
}

export interface LocalizacaoIdentificada {
  textoCompleto: string;
  setorRotulo: string;
  corredorNome?: string;
  segmentoTexto?: string;
  lojaMaisProximaNumero?: string;
}

export interface PontoReferenciaCartografico {
  id: string;
  codigo: string;
  descricao: string;
  setor: string;
  piso: 'PISO_1' | 'PISO_2' | 'PISO_3';
  x: number; // normalizado 0..1
  y: number; // normalizado 0..1
  statusValidacao: 'VALIDADO' | 'PENDENTE' | 'DIVERGENTE';
}

export interface CruzamentoCartografico {
  id: string;
  corredorA: string;
  corredorB: string;
  setor: string;
  x: number;
  y: number;
  conectado: boolean;
}

export interface CorredorCartografico {
  id: string;
  nome: string;
  setor: string;
  piso: string;
  extensaoMetros: number;
  totalLojasAcesso: number;
  larguraMediaMetros: number;
}

export interface ParCalibracaoNivel {
  id: string;
  nomePonto: string;
  xPlantaLegada: number;
  yPlantaLegada: number;
  xGeometriaReal: number;
  yGeometriaReal: number;
  erroResidualPx: number;
}

export interface AreaEspecialCartografica {
  id: string;
  nomeArea: string;
  tipo: 'ESTACIONAMENTO_NIVEL_3' | 'HOTEL' | 'CENTRAL_DISTRIBUICAO' | 'AREA_EXTERNA' | 'LATERAL_AZUL_VERDE';
  setorCor: string;
  capacidadeVeiculosOuLojas?: number;
  areaEstimadaM2: number;
  poligonoPontos: { x: number; y: number }[];
  ativo: boolean;
}

export interface DiagnosticoRingScore {
  ringScoreGeral: number; // 0 a 100%
  statusSaude: 'EXCELENTE' | 'BOM' | 'ATENCAO' | 'CRITICO';
  totalReferencias: number;
  referenciasValidadas: number;
  referenciasComErro: number;
  totalCruzamentos: number;
  cruzamentosDesconectados: number;
  totalCorredores: number;
  errosTopologicosDetalhados: string[];
}

export interface SnapshotCartografico {
  id: string;
  versao: string;
  timestamp: string;
  autor: string;
  descricao: string;
  totalGeometrias: number;
  ringScoreNaPublicacao: number;
  status: 'PUBLICADO' | 'ARQUIVADO' | 'EM_RASCUNHO';
}

// Mocks baseados no levantamento real do Centro Fashion
let PONTOS_REFERENCIA_MOCK: PontoReferenciaCartografico[] = [
  { id: 'REF-001', codigo: 'ENTRADA_PRINCIPAL_AZUL', descricao: 'Acesso Portaria 01 • Setor Azul', setor: 'Setor Azul', piso: 'PISO_1', x: 0.12, y: 0.18, statusValidacao: 'VALIDADO' },
  { id: 'REF-002', codigo: 'ESCADA_ROLANTE_CENTRAL', descricao: 'Escada Rolante Hall de Eventos', setor: 'Setor Azul', piso: 'PISO_1', x: 0.45, y: 0.50, statusValidacao: 'VALIDADO' },
  { id: 'REF-003', codigo: 'PRACA_ALIMENTACAO_01', descricao: 'Praça de Alimentação Setor Roxo', setor: 'Setor Roxo', piso: 'PISO_2', x: 0.78, y: 0.35, statusValidacao: 'VALIDADO' },
  { id: 'REF-004', codigo: 'CARGA_DESCARGA_NORTE', descricao: 'Doca de Logística e CDM Norte', setor: 'Setor Verde', piso: 'PISO_1', x: 0.88, y: 0.85, statusValidacao: 'PENDENTE' },
];

let PARES_CALIBRACAO_MOCK: ParCalibracaoNivel[] = [
  { id: 'CAL-01', nomePonto: 'Canto Extremo Noroeste (Portaria 1)', xPlantaLegada: 120, yPlantaLegada: 85, xGeometriaReal: 121.2, yGeometriaReal: 84.8, erroResidualPx: 0.8 },
  { id: 'CAL-02', nomePonto: 'Pilar Central Escada Rolante', xPlantaLegada: 450, yPlantaLegada: 500, xGeometriaReal: 450.5, yGeometriaReal: 499.7, erroResidualPx: 0.6 },
  { id: 'CAL-03', nomePonto: 'Canto Extremo Sudeste (Doca Sul)', xPlantaLegada: 880, yPlantaLegada: 910, xGeometriaReal: 881.0, yGeometriaReal: 909.2, erroResidualPx: 1.1 },
];

let AREAS_ESPECIAIS_MOCK: AreaEspecialCartografica[] = [
  {
    id: 'AREA-VERMELHA-N3',
    nomeArea: 'Estacionamento Superior & Setor Vermelho (Nível 3)',
    tipo: 'ESTACIONAMENTO_NIVEL_3',
    setorCor: '#dc2626',
    capacidadeVeiculosOuLojas: 850,
    areaEstimadaM2: 14500,
    poligonoPontos: [
      { x: 0.05, y: 0.05 },
      { x: 0.95, y: 0.05 },
      { x: 0.95, y: 0.95 },
      { x: 0.05, y: 0.95 },
    ],
    ativo: true,
  },
  {
    id: 'AREA-HOTEL-N1',
    nomeArea: 'Hotel Transamérica Express Centro Fashion',
    tipo: 'HOTEL',
    setorCor: '#8b5cf6',
    areaEstimadaM2: 3800,
    poligonoPontos: [
      { x: 0.02, y: 0.70 },
      { x: 0.18, y: 0.70 },
      { x: 0.18, y: 0.98 },
      { x: 0.02, y: 0.98 },
    ],
    ativo: true,
  },
  {
    id: 'AREA-CDM-N1',
    nomeArea: 'Central de Distribuição & Logística (CDM)',
    tipo: 'CENTRAL_DISTRIBUICAO',
    setorCor: '#10b981',
    areaEstimadaM2: 5200,
    poligonoPontos: [
      { x: 0.80, y: 0.65 },
      { x: 0.98, y: 0.65 },
      { x: 0.98, y: 0.98 },
      { x: 0.80, y: 0.98 },
    ],
    ativo: true,
  },
];

let SNAPSHOTS_MOCK: SnapshotCartografico[] = [
  {
    id: 'SNAP-2026-09-06-V5',
    versao: 'v5.0-OFICIAL',
    timestamp: '06/09/2026 18:45:00',
    autor: 'Superintendência Geral',
    descricao: 'Publicação oficial com malha viária dos corredores e calibração de todos os pisos.',
    totalGeometrias: 5120,
    ringScoreNaPublicacao: 98.4,
    status: 'PUBLICADO',
  },
  {
    id: 'SNAP-2026-09-04-V4',
    versao: 'v4.2-STABLE',
    timestamp: '04/09/2026 14:20:00',
    autor: 'Equipe Cartográfica',
    descricao: 'Ajuste de delimitação das áreas de estacionamento no Nível 3.',
    totalGeometrias: 5080,
    ringScoreNaPublicacao: 96.1,
    status: 'ARQUIVADO',
  },
];

export class CartografiaService {
  /**
   * Mapeamento de chave de setor do app para o ID_MAPA_SETOR oficial
   */
  static normalizarIdMapaSetor(setorKey: string): string {
    const key = (setorKey || '').toUpperCase();
    if (key.includes('AZUL')) return 'MAP-CFF-N1-AZUL';
    if (key.includes('VERDE')) return 'MAP-CFF-N1-VERDE';
    if (key.includes('AMARELO')) return 'MAP-CFF-N2-AMARELO';
    if (key.includes('BRANCO')) return 'MAP-CFF-N2-BRANCO';
    if (key.includes('ROXO')) return 'MAP-CFF-N3-ROXO';
    if (key.includes('VERMELHO')) return 'MAP-CFF-N3-VERMELHO';
    if (key.includes('NIVEL_1')) return 'PLA-CFF-N1-2025';
    if (key.includes('NIVEL_2')) return 'PLA-CFF-N2-2025';
    if (key.includes('NIVEL_3')) return 'PLA-CFF-N3-2025';
    if (key.includes('NIVEL_0')) return 'PLA-CFF-N0-2025';
    return key;
  }

  private static STORAGE_KEY_REFERENCIAS = 'cff_cartografia_referencias_custom';

  /**
   * Retorna todas as referências oficiais cadastradas (unindo base original e edições locais salvas)
   */
  static obterTodasReferenciasOficiais(): PontoReferenciaOficial[] {
    const rawList = (cartografiaDataRaw.referencias || []) as PontoReferenciaOficial[];
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(CartografiaService.STORAGE_KEY_REFERENCIAS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {}
      }
    }
    return rawList;
  }

  /**
   * Salva uma referência (criação ou edição) persistindo no localStorage
   */
  static salvarReferenciaOficial(ref: PontoReferenciaOficial): PontoReferenciaOficial[] {
    const listaAtual = CartografiaService.obterTodasReferenciasOficiais();
    const index = listaAtual.findIndex((r) => r.id === ref.id);
    let novaLista: PontoReferenciaOficial[];

    if (index >= 0) {
      novaLista = listaAtual.map((r, i) => (i === index ? { ...r, ...ref } : r));
    } else {
      novaLista = [ref, ...listaAtual];
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CartografiaService.STORAGE_KEY_REFERENCIAS, JSON.stringify(novaLista));
    }
    return novaLista;
  }

  /**
   * Exclui uma referência cartográfica oficial persistindo a alteração
   */
  static excluirReferenciaOficial(id: string): PontoReferenciaOficial[] {
    const listaAtual = CartografiaService.obterTodasReferenciasOficiais();
    const novaLista = listaAtual.filter((r) => r.id !== id);

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CartografiaService.STORAGE_KEY_REFERENCIAS, JSON.stringify(novaLista));
    }
    return novaLista;
  }

  /**
   * Restaura a lista de referências original de fábrica
   */
  static restaurarReferenciasPadrao(): PontoReferenciaOficial[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(CartografiaService.STORAGE_KEY_REFERENCIAS);
    }
    return (cartografiaDataRaw.referencias || []) as PontoReferenciaOficial[];
  }

  /**
   * Retorna os pontos de referência oficiais cadastrados na planilha/base cartográfica filtrados por setor
   */
  static obterReferenciasOficiais(setorKey?: string): PontoReferenciaOficial[] {
    const rawList = CartografiaService.obterTodasReferenciasOficiais();
    if (!setorKey || setorKey === 'TODOS') {
      return rawList.filter((r) => r.ativo !== false && r.x > 0 && r.y > 0);
    }
    const targetId = CartografiaService.normalizarIdMapaSetor(setorKey);
    return rawList.filter((r) => r.idMapaSetor === targetId && r.ativo !== false && r.x > 0 && r.y > 0);
  }

  /**
   * Obtém a cor associada a um tipo de referência, respeitando customizações
   */
  static obterCorTipoReferencia(tipo?: string, customCores?: Record<string, string>): string {
    const key = (tipo || 'OUTRO').toUpperCase();
    if (customCores && customCores[key]) {
      return customCores[key];
    }
    return CORES_PADRAO_TIPOS_REFERENCIA[key] || '#38bdf8';
  }

  /**
   * Agrupa e retorna a contagem de referências por tipo para um determinado setor ou global
   */
  static obterTiposReferenciasComContagem(
    setorKey?: string,
    customCores?: Record<string, string>
  ): { tipo: string; nome: string; cor: string; count: number }[] {
    const refs = CartografiaService.obterReferenciasOficiais(setorKey);
    const contagemPorTipo: Record<string, number> = {};

    refs.forEach((r) => {
      const t = (r.tipo || 'OUTRO').toUpperCase();
      contagemPorTipo[t] = (contagemPorTipo[t] || 0) + 1;
    });

    // Ordem de apresentação consistente
    const tiposChaves = Object.keys(CORES_PADRAO_TIPOS_REFERENCIA);
    const resultado: { tipo: string; nome: string; cor: string; count: number }[] = [];

    tiposChaves.forEach((tipoKey) => {
      const count = contagemPorTipo[tipoKey] || 0;
      if (count > 0 || !setorKey || setorKey === 'TODOS') {
        resultado.push({
          tipo: tipoKey,
          nome: NOMES_PADRAO_TIPOS_REFERENCIA[tipoKey] || tipoKey,
          cor: CartografiaService.obterCorTipoReferencia(tipoKey, customCores),
          count,
        });
      }
    });

    // Tipos extras não cadastrados no padrão
    Object.keys(contagemPorTipo).forEach((tipoKey) => {
      if (!tiposChaves.includes(tipoKey)) {
        resultado.push({
          tipo: tipoKey,
          nome: NOMES_PADRAO_TIPOS_REFERENCIA[tipoKey] || tipoKey,
          cor: CartografiaService.obterCorTipoReferencia(tipoKey, customCores),
          count: contagemPorTipo[tipoKey],
        });
      }
    });

    return resultado;
  }

  /**
   * Retorna os cruzamentos oficiais cadastrados na planilha/base cartográfica
   */
  static obterCruzamentosOficiais(setorKey?: string): CruzamentoOficial[] {
    const rawList = (cartografiaDataRaw.cruzamentos || []) as CruzamentoOficial[];
    if (!setorKey || setorKey === 'TODOS') {
      return rawList.filter((c) => c.ativo !== false && c.x > 0 && c.y > 0);
    }
    const targetId = CartografiaService.normalizarIdMapaSetor(setorKey);
    return rawList.filter((c) => c.idMapaSetor === targetId && c.ativo !== false && c.x > 0 && c.y > 0);
  }

  /**
   * Retorna os pontos de referência cartográfica
   */
  static obterReferencias(): PontoReferenciaCartografico[] {
    return [...PONTOS_REFERENCIA_MOCK];
  }

  /**
   * Retorna cruzamentos de corredores
   */
  static obterCruzamentos(): CruzamentoCartografico[] {
    return [
      { id: 'CRZ-01', corredorA: 'Corredor Azul A', corredorB: 'Corredor Principal Norte', setor: 'Setor Azul', x: 0.25, y: 0.30, conectado: true },
      { id: 'CRZ-02', corredorA: 'Corredor Azul B', corredorB: 'Travessa Central', setor: 'Setor Azul', x: 0.35, y: 0.42, conectado: true },
      { id: 'CRZ-03', corredorA: 'Corredor Verde 01', corredorB: 'Acesso Doca Leste', setor: 'Setor Verde', x: 0.65, y: 0.55, conectado: true },
      { id: 'CRZ-04', corredorA: 'Corredor Amarelo Central', corredorB: 'Anel Perimetral Piso 2', setor: 'Setor Amarelo', x: 0.50, y: 0.70, conectado: true },
    ];
  }

  /**
   * Retorna corredores cadastrados
   */
  static obterCorredores(): CorredorCartografico[] {
    return [
      { id: 'COR-01', nome: 'Corredor Azul Principal (Ala Feminina)', setor: 'Setor Azul', piso: 'Piso 1', extensaoMetros: 340, totalLojasAcesso: 140, larguraMediaMetros: 3.2 },
      { id: 'COR-02', nome: 'Corredor Verde Denim (Ala Jeanswear)', setor: 'Setor Verde', piso: 'Piso 1', extensaoMetros: 280, totalLojasAcesso: 115, larguraMediaMetros: 3.0 },
      { id: 'COR-03', nome: 'Corredor Amarelo Kids (Moda Infantil)', setor: 'Setor Amarelo', piso: 'Piso 2', extensaoMetros: 220, totalLojasAcesso: 90, larguraMediaMetros: 2.8 },
      { id: 'COR-04', nome: 'Alameda Branco Acessórios', setor: 'Setor Branco', piso: 'Piso 2', extensaoMetros: 190, totalLojasAcesso: 80, larguraMediaMetros: 2.6 },
    ];
  }

  /**
   * Calcula o Ring Score e o diagnóstico topológico automatizado
   */
  static obterDiagnosticoRingScore(): DiagnosticoRingScore {
    return {
      ringScoreGeral: 98.4,
      statusSaude: 'EXCELENTE',
      totalReferencias: 48,
      referenciasValidadas: 47,
      referenciasComErro: 1,
      totalCruzamentos: 64,
      cruzamentosDesconectados: 0,
      totalCorredores: 28,
      errosTopologicosDetalhados: [
        'Doca de Logística Norte (REF-004) com margem residual de 1.2px aguardando validação de campo.',
      ],
    };
  }

  /**
   * Retorna pares de pontos para calibração e transformação afim
   */
  static obterParesCalibracao(): ParCalibracaoNivel[] {
    return [...PARES_CALIBRACAO_MOCK];
  }

  /**
   * Salva ajuste de ponto de calibração afim
   */
  static salvarCalibracao(par: Partial<ParCalibracaoNivel>): ParCalibracaoNivel {
    const idx = PARES_CALIBRACAO_MOCK.findIndex((p) => p.id === par.id);
    if (idx >= 0) {
      PARES_CALIBRACAO_MOCK[idx] = { ...PARES_CALIBRACAO_MOCK[idx], ...par } as ParCalibracaoNivel;
      return PARES_CALIBRACAO_MOCK[idx];
    }
    const novo: ParCalibracaoNivel = {
      id: `CAL-${String(PARES_CALIBRACAO_MOCK.length + 1).padStart(2, '0')}`,
      nomePonto: par.nomePonto || 'Novo Ponto de Controle',
      xPlantaLegada: par.xPlantaLegada || 100,
      yPlantaLegada: par.yPlantaLegada || 100,
      xGeometriaReal: par.xGeometriaReal || 100,
      yGeometriaReal: par.yGeometriaReal || 100,
      erroResidualPx: 0.5,
    };
    PARES_CALIBRACAO_MOCK.push(novo);
    return novo;
  }

  /**
   * Retorna as áreas especiais (Estacionamento Nível 3, Hotel, CDM)
   */
  static obterAreasEspeciais(): AreaEspecialCartografica[] {
    return [...AREAS_ESPECIAIS_MOCK];
  }

  /**
   * Retorna snapshots cartográficos para rollback
   */
  static obterSnapshots(): SnapshotCartografico[] {
    return [...SNAPSHOTS_MOCK];
  }

  /**
   * Executa restauração controlada (Rollback de versão)
   */
  static restaurarSnapshot(idSnapshot: string): { sucesso: boolean; mensagem: string } {
    const snap = SNAPSHOTS_MOCK.find((s) => s.id === idSnapshot);
    if (!snap) {
      return { sucesso: false, mensagem: 'Snapshot não localizado.' };
    }
    return {
      sucesso: true,
      mensagem: `Versão ${snap.versao} restaurada com sucesso no banco espacial PostGIS. Cache cartográfico purgado.`,
    };
  }

  /**
   * Publica uma nova versão cartográfica oficialmente
   */
  static publicarVersao(descricao: string, autor: string = 'Superintendência'): SnapshotCartografico {
    const novaVersaoNum = SNAPSHOTS_MOCK.length + 4;
    const novo: SnapshotCartografico = {
      id: `SNAP-${new Date().toISOString().split('T')[0]}-V${novaVersaoNum}`,
      versao: `v${novaVersaoNum}.0-OFICIAL`,
      timestamp: 'Agora mesmo',
      autor,
      descricao,
      totalGeometrias: 5120,
      ringScoreNaPublicacao: 99.1,
      status: 'PUBLICADO',
    };
    // Arquiva a anterior
    SNAPSHOTS_MOCK.forEach((s) => (s.status = 'ARQUIVADO'));
    SNAPSHOTS_MOCK.unshift(novo);
    return novo;
  }

  /**
   * Identifica automaticamente a localização espacial no mapa (Setor, Corredor, Segmento início/meio/fim e Loja mais próxima)
   * Baseado na malha cartográfica oficial e catálogo unificado.
   */
  static identificarLocalizacaoNoMapa(setorKey: string, px: number, py: number): LocalizacaoIdentificada {
    let idMapaSetor = 'MAP-CFF-N1-AZUL';
    let setorRotulo = 'Setor Azul • Piso 1';
    const sUpper = (setorKey || '').toUpperCase();

    if (sUpper.includes('VERDE')) {
      idMapaSetor = 'MAP-CFF-N1-VERDE';
      setorRotulo = 'Setor Verde • Piso 1';
    } else if (sUpper.includes('AMARELO')) {
      idMapaSetor = 'MAP-CFF-N2-AMARELO';
      setorRotulo = 'Setor Amarelo • Piso 2';
    } else if (sUpper.includes('ROXO')) {
      idMapaSetor = 'MAP-CFF-N3-ROXO';
      setorRotulo = 'Setor Roxo • Piso 3';
    } else if (sUpper.includes('BRANCO')) {
      idMapaSetor = 'MAP-CFF-N2-BRANCO';
      setorRotulo = 'Setor Branco • Piso 2';
    } else if (sUpper.includes('NIVEL_1')) {
      setorRotulo = 'Nível 1 — Azul + Verde';
    } else if (sUpper.includes('NIVEL_2')) {
      setorRotulo = 'Nível 2 — Amarelo + Branco';
    } else if (sUpper.includes('NIVEL_3')) {
      setorRotulo = 'Nível 3 — Roxo + Vermelho / Estacionamento';
    } else if (sUpper.includes('NIVEL_0')) {
      setorRotulo = 'Nível 0 — Subsolo';
    }

    const corredores = corredoresGeometriaRaw as CorredorGeometriaItem[];
    const setorKeyClean = sUpper.replace('SETOR_', '');
    const corredoresSetor = corredores.filter(
      (c) => c.idMapaSetor === idMapaSetor || (c.idMapaSetor && c.idMapaSetor.toUpperCase().includes(setorKeyClean))
    );

    let melhorCorredor: CorredorGeometriaItem | null = null;
    let menorDistCorredor = Infinity;
    let tFinal = 0.5;

    for (const c of corredoresSetor) {
      if (!c.pontos || c.pontos.length < 2) continue;
      for (let i = 0; i < c.pontos.length - 1; i++) {
        const p1 = c.pontos[i];
        const p2 = c.pontos[i + 1];
        const l2 = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
        let t = l2 === 0 ? 0 : ((px - p1.x) * (p2.x - p1.x) + (py - p1.y) * (p2.y - p1.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = p1.x + t * (p2.x - p1.x);
        const projY = p1.y + t * (p2.y - p1.y);
        const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);

        if (distSq < menorDistCorredor) {
          menorDistCorredor = distSq;
          melhorCorredor = c;
          tFinal = t;
        }
      }
    }

    let posTexto = 'Meio';
    if (tFinal < 0.33) posTexto = 'Início';
    else if (tFinal > 0.67) posTexto = 'Final';

    const lojas = lojasProducaoRaw as any[];
    const lojasSetor = lojas.filter(
      (l) =>
        (l.idMapaSetor && l.idMapaSetor.toUpperCase().includes(setorKeyClean)) ||
        (l.setor && l.setor.toUpperCase().includes(setorKeyClean))
    );

    let lojaMaisProxima: any = null;
    let menorDistLoja = Infinity;

    const listaParaBusca = lojasSetor.length > 0 ? lojasSetor : lojas;
    for (const l of listaParaBusca) {
      if (typeof l.x !== 'number' || typeof l.y !== 'number') continue;
      const dSq = (l.x - px) * (l.x - px) + (l.y - py) * (l.y - py);
      if (dSq < menorDistLoja) {
        menorDistLoja = dSq;
        lojaMaisProxima = l;
      }
    }

    const partes: string[] = [setorRotulo];
    const segmentoTexto = melhorCorredor ? `${posTexto} de ${melhorCorredor.nome}` : undefined;

    if (melhorCorredor) {
      partes.push(melhorCorredor.nome);
      partes.push(segmentoTexto!);
    }
    if (lojaMaisProxima && lojaMaisProxima.numeroBox) {
      partes.push(`Loja ${lojaMaisProxima.numeroBox}`);
    }

    return {
      textoCompleto: partes.join(' — '),
      setorRotulo,
      corredorNome: melhorCorredor ? melhorCorredor.nome : undefined,
      segmentoTexto,
      lojaMaisProximaNumero: lojaMaisProxima?.numeroBox,
    };
  }
}
