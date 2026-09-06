/**
 * Serviço de Gestão Administrativa de Lojistas e Permissionários (Fases L3.0 e L3.1)
 * Paridade com L30_CentralGestaoService.gs e L31_CentralPermissionariosService.gs
 */

export interface Permissionario {
  idPermissionario: string;
  razaoSocial: string;
  nomeResponsavel: string;
  documento: string; // CNPJ ou CPF
  telefone: string;
  whatsapp: string;
  email: string;
  grupoEconomico?: string;
  status: 'REGULAR' | 'PENDENCIA_CADASTRAL' | 'NOTIFICADO';
  totalPontos: number;
  pontosOcupados: {
    numeroBox: string;
    idLojaMapa: string;
    setor: string;
    corredor: string;
    nomeOperacao: string;
  }[];
  operacoesNomes: string[];
  cadastradoEm: string;
}

export interface OperacaoComercial {
  idOperacao: string;
  idLojaMapa: string;
  nomeFantasia: string;
  razaoSocial: string;
  idPermissionario: string;
  nomePermissionario: string;
  segmento: string;
  setor: string;
  corredor: string;
  boxes: string[];
  status: 'ATIVA' | 'FECHADA' | 'REFORMA' | 'DESOCUPADA';
  completude: number;
  dataInicio: string;
  whatsapp: string;
  contatoPrincipal: string;
  campanhasAtivas: string[];
}

export interface MetricasGestao {
  totalOperacoes: number;
  totalPermissionarios: number;
  mediaPontosPorTitular: number;
  completudeMedia: number;
  operacoesAtivas: number;
  permissionariosMultiplosPontos: number;
}

// Base mockada federada representando os lojistas reais do Centro Fashion
const PERMISSIONARIOS_MOCK: Permissionario[] = [
  {
    idPermissionario: 'PERM-001',
    razaoSocial: 'Aurora Confecções do Ceará Ltda',
    nomeResponsavel: 'Maria Aurora Silveira',
    documento: '08.432.190/0001-44',
    telefone: '(85) 3214-5500',
    whatsapp: '5585998765432',
    email: 'contato@auroraconfeccoes.com.br',
    grupoEconomico: 'Grupo Aurora Fashion',
    status: 'REGULAR',
    totalPontos: 2,
    pontosOcupados: [
      {
        numeroBox: '1176',
        idLojaMapa: '1',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Moda Aurora Principal',
      },
      {
        numeroBox: '1177',
        idLojaMapa: '2',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Aurora Acessórios',
      },
    ],
    operacoesNomes: ['Moda Aurora Principal', 'Aurora Acessórios'],
    cadastradoEm: '15/01/2024',
  },
  {
    idPermissionario: 'PERM-002',
    razaoSocial: 'Comercial Bella Jeans Ltda',
    nomeResponsavel: 'João Paulo Vasconcelos',
    documento: '14.887.234/0001-82',
    telefone: '(85) 3214-8899',
    whatsapp: '5585988112233',
    email: 'financeiro@bellajeans.com.br',
    grupoEconomico: 'Holding Nordeste Jeans',
    status: 'REGULAR',
    totalPontos: 3,
    pontosOcupados: [
      {
        numeroBox: '1178',
        idLojaMapa: '3',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Bella Jeans Fortaleza',
      },
      {
        numeroBox: '1240',
        idLojaMapa: '12',
        setor: 'Setor Verde',
        corredor: 'Rua José Avelino',
        nomeOperacao: 'Bella Denim Outlet',
      },
      {
        numeroBox: '1241',
        idLojaMapa: '13',
        setor: 'Setor Verde',
        corredor: 'Rua José Avelino',
        nomeOperacao: 'Bella Denim Outlet',
      },
    ],
    operacoesNomes: ['Bella Jeans Fortaleza', 'Bella Denim Outlet'],
    cadastradoEm: '20/03/2023',
  },
  {
    idPermissionario: 'PERM-003',
    razaoSocial: 'Kids & Cia Moda Infantil ME',
    nomeResponsavel: 'Fernanda Albuquerque Lima',
    documento: '22.109.845/0001-19',
    telefone: '(85) 3344-9988',
    whatsapp: '5585991223344',
    email: 'fernanda@estilofashionkids.com.br',
    status: 'PENDENCIA_CADASTRAL',
    totalPontos: 1,
    pontosOcupados: [
      {
        numeroBox: '1179',
        idLojaMapa: '4',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Estilo Fashion Kids',
      },
    ],
    operacoesNomes: ['Estilo Fashion Kids'],
    cadastradoEm: '10/08/2024',
  },
  {
    idPermissionario: 'PERM-004',
    razaoSocial: 'Brilho Tropical Acessórios Eireli',
    nomeResponsavel: 'Carla Beatriz Mendes',
    documento: '31.542.901/0001-90',
    telefone: '(85) 3455-1122',
    whatsapp: '5585987334455',
    email: 'carla@acessoriosbrilho.com',
    status: 'REGULAR',
    totalPontos: 1,
    pontosOcupados: [
      {
        numeroBox: '1180',
        idLojaMapa: '5',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Acessórios & Brilho',
      },
    ],
    operacoesNomes: ['Acessórios & Brilho'],
    cadastradoEm: '05/11/2024',
  },
  {
    idPermissionario: 'PERM-005',
    razaoSocial: 'Sol & Mar Beachwear Cearense Ltda',
    nomeResponsavel: 'Rodrigo Fontenele',
    documento: '18.990.412/0001-63',
    telefone: '(85) 3255-7788',
    whatsapp: '5585996554433',
    email: 'rodrigo@solemarbeachwear.com.br',
    status: 'REGULAR',
    totalPontos: 1,
    pontosOcupados: [
      {
        numeroBox: '1181',
        idLojaMapa: '6',
        setor: 'Setor Azul',
        corredor: 'Rua Gov. Sampaio',
        nomeOperacao: 'Beachwear Sol & Mar',
      },
    ],
    operacoesNomes: ['Beachwear Sol & Mar'],
    cadastradoEm: '02/02/2025',
  },
];

const OPERACOES_MOCK: OperacaoComercial[] = [
  {
    idOperacao: 'OP-001',
    idLojaMapa: '1',
    nomeFantasia: 'Moda Aurora Principal',
    razaoSocial: 'Aurora Confecções do Ceará Ltda',
    idPermissionario: 'PERM-001',
    nomePermissionario: 'Maria Aurora Silveira',
    segmento: 'Moda Feminina',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1176'],
    status: 'ATIVA',
    completude: 100,
    dataInicio: '15/01/2024',
    whatsapp: '5585998765432',
    contatoPrincipal: 'Maria Aurora (Titular)',
    campanhasAtivas: ['Bazar Centro Fashion 2026', 'Festival Verão Fashion'],
  },
  {
    idOperacao: 'OP-002',
    idLojaMapa: '2',
    nomeFantasia: 'Aurora Acessórios',
    razaoSocial: 'Aurora Confecções do Ceará Ltda',
    idPermissionario: 'PERM-001',
    nomePermissionario: 'Maria Aurora Silveira',
    segmento: 'Bijuterias e Bolsas',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1177'],
    status: 'ATIVA',
    completude: 85,
    dataInicio: '01/06/2024',
    whatsapp: '5585998765432',
    contatoPrincipal: 'Clara Silveira (Gerente)',
    campanhasAtivas: ['Bazar Centro Fashion 2026'],
  },
  {
    idOperacao: 'OP-003',
    idLojaMapa: '3',
    nomeFantasia: 'Bella Jeans Fortaleza',
    razaoSocial: 'Comercial Bella Jeans Ltda',
    idPermissionario: 'PERM-002',
    nomePermissionario: 'João Paulo Vasconcelos',
    segmento: 'Jeanswear & Denim',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1178'],
    status: 'ATIVA',
    completude: 95,
    dataInicio: '20/03/2023',
    whatsapp: '5585988112233',
    contatoPrincipal: 'João Paulo (Diretor)',
    campanhasAtivas: ['Liquida Jeans 50% OFF', 'Bazar Centro Fashion 2026'],
  },
  {
    idOperacao: 'OP-004',
    idLojaMapa: '4',
    nomeFantasia: 'Estilo Fashion Kids',
    razaoSocial: 'Kids & Cia Moda Infantil ME',
    idPermissionario: 'PERM-003',
    nomePermissionario: 'Fernanda Albuquerque Lima',
    segmento: 'Moda Infantil',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1179'],
    status: 'ATIVA',
    completude: 70,
    dataInicio: '10/08/2024',
    whatsapp: '5585991223344',
    contatoPrincipal: 'Fernanda Lima (Sócia)',
    campanhasAtivas: ['Bazar Centro Fashion 2026'],
  },
  {
    idOperacao: 'OP-005',
    idLojaMapa: '5',
    nomeFantasia: 'Acessórios & Brilho',
    razaoSocial: 'Brilho Tropical Acessórios Eireli',
    idPermissionario: 'PERM-004',
    nomePermissionario: 'Carla Beatriz Mendes',
    segmento: 'Bijuterias e Bolsas',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1180'],
    status: 'ATIVA',
    completude: 60,
    dataInicio: '05/11/2024',
    whatsapp: '5585987334455',
    contatoPrincipal: 'Carla Mendes',
    campanhasAtivas: [],
  },
  {
    idOperacao: 'OP-006',
    idLojaMapa: '6',
    nomeFantasia: 'Beachwear Sol & Mar',
    razaoSocial: 'Sol & Mar Beachwear Cearense Ltda',
    idPermissionario: 'PERM-005',
    nomePermissionario: 'Rodrigo Fontenele',
    segmento: 'Moda Praia',
    setor: 'Setor Azul',
    corredor: 'Rua Gov. Sampaio',
    boxes: ['1181'],
    status: 'ATIVA',
    completude: 80,
    dataInicio: '02/02/2025',
    whatsapp: '5585996554433',
    contatoPrincipal: 'Rodrigo Fontenele',
    campanhasAtivas: ['Festival Verão Fashion'],
  },
];

export class GestaoLojistasService {
  /**
   * Retorna os indicadores globais da Central de Gestão
   */
  static obterMetricas(): MetricasGestao {
    const totalOperacoes = OPERACOES_MOCK.length;
    const totalPermissionarios = PERMISSIONARIOS_MOCK.length;
    const operacoesAtivas = OPERACOES_MOCK.filter((o) => o.status === 'ATIVA').length;
    const totalPontosOcupados = PERMISSIONARIOS_MOCK.reduce((acc, p) => acc + p.totalPontos, 0);
    const mediaPontosPorTitular = totalPermissionarios > 0 ? Number((totalPontosOcupados / totalPermissionarios).toFixed(1)) : 1;
    const somaCompletude = OPERACOES_MOCK.reduce((acc, o) => acc + o.completude, 0);
    const completudeMedia = totalOperacoes > 0 ? Math.round(somaCompletude / totalOperacoes) : 0;
    const permissionariosMultiplosPontos = PERMISSIONARIOS_MOCK.filter((p) => p.totalPontos > 1).length;

    return {
      totalOperacoes,
      totalPermissionarios,
      mediaPontosPorTitular,
      completudeMedia,
      operacoesAtivas,
      permissionariosMultiplosPontos,
    };
  }

  /**
   * Retorna a listagem de operações com filtros
   */
  static listarOperacoes(filtros?: {
    segmento?: string;
    status?: string;
    busca?: string;
  }): OperacaoComercial[] {
    let list = [...OPERACOES_MOCK];

    if (filtros?.segmento && filtros.segmento !== 'TODOS') {
      list = list.filter((o) => o.segmento === filtros.segmento);
    }

    if (filtros?.status && filtros.status !== 'TODOS') {
      list = list.filter((o) => o.status === filtros.status);
    }

    if (filtros?.busca && filtros.busca.trim() !== '') {
      const termo = filtros.busca.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.nomeFantasia.toLowerCase().includes(termo) ||
          o.nomePermissionario.toLowerCase().includes(termo) ||
          o.razaoSocial.toLowerCase().includes(termo) ||
          o.boxes.some((b) => b.includes(termo)) ||
          o.corredor.toLowerCase().includes(termo)
      );
    }

    return list;
  }

  /**
   * Retorna a listagem de permissionários com filtros
   */
  static listarPermissionarios(filtros?: {
    status?: string;
    apenasMultiplos?: boolean;
    busca?: string;
  }): Permissionario[] {
    let list = [...PERMISSIONARIOS_MOCK];

    if (filtros?.status && filtros.status !== 'TODOS') {
      list = list.filter((p) => p.status === filtros.status);
    }

    if (filtros?.apenasMultiplos) {
      list = list.filter((p) => p.totalPontos > 1);
    }

    if (filtros?.busca && filtros.busca.trim() !== '') {
      const termo = filtros.busca.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.razaoSocial.toLowerCase().includes(termo) ||
          p.nomeResponsavel.toLowerCase().includes(termo) ||
          p.documento.includes(termo) ||
          p.grupoEconomico?.toLowerCase().includes(termo) ||
          p.pontosOcupados.some((pt) => pt.numeroBox.includes(termo)) ||
          p.operacoesNomes.some((op) => op.toLowerCase().includes(termo))
      );
    }

    return list;
  }

  /**
   * Retorna o detalhe de um permissionário específico por ID
   */
  static obterPermissionario(idPermissionario: string): Permissionario | null {
    return PERMISSIONARIOS_MOCK.find((p) => p.idPermissionario === idPermissionario) || null;
  }
}
