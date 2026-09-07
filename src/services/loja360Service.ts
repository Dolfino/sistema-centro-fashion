/**
 * Serviço Loja 360 - Centro Fashion
 * Paridade com Loja360Service.gs e LojaMapaService.gs
 */

import { CatalogoProducaoService } from './catalogoProducaoService';

export interface ContatoLoja {
  id: string;
  nome: string;
  funcao: string;
  tipo: 'OPERACIONAL' | 'COMERCIAL' | 'EMERGENCIA' | 'FINANCEIRO';
  telefone: string;
  whatsapp: string;
  email: string;
  principal: boolean;
}

export interface OcorrenciaVinculada {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTA' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'VALIDACAO' | 'CONCLUIDA' | 'CANCELADA';
  setorResponsavel: string;
  criadoEm: string;
  concluidoEm?: string;
}

export interface HistoricoOcupacao {
  id: string;
  inicio: string;
  fim?: string;
  responsavel: string;
  motivoEncerramento?: string;
  atual: boolean;
}

export interface ProdutoLoja {
  id: string;
  nome: string;
  categoria: string;
  subcategoria?: string;
  precoNormal: number;
  precoPromocional?: number;
  emPromocao: boolean;
  vigenciaPromocao?: string;
  destaque: boolean;
  atacado: boolean;
  precoAtacado?: number;
  qtdMinimaAtacado?: number;
  fotoUrl?: string;
  descricao?: string;
}

export interface PromocaoLoja {
  id: string;
  titulo: string;
  descricao?: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  status: 'ATIVA' | 'ENCERRADA' | 'FUTURA';
  produtosVinculadosIds: string[];
}

export interface FotoEstabelecimento {
  id: string;
  tipo: 'FACHADA' | 'INTERIOR' | 'VITRINE' | 'EXPOSICAO' | 'PRODUTO' | 'EQUIPE';
  url: string;
  descricao?: string;
  cadastradoEm: string;
}

export interface FichaLoja360 {
  idLojaMapa: string;
  idLoja?: string;
  numeroLoja: string;
  nomeLoja: string;
  razaoSocial?: string;
  cnpj?: string;
  luc?: string;
  tipoUnidade: 'LOJA' | 'BOX' | 'QUIOSQUE' | 'DEPOSITO' | 'ALIMENTACAO';
  segmentoPrincipal: string;
  statusOperacao: 'ATIVA' | 'FECHADA' | 'REFORMA' | 'DESOCUPADA';
  statusOcupacao?: string;
  corStatus?: string;
  descricaoStatus?: string;
  parcelasAtraso?: number;
  valorPendente?: number;
  setor: string;
  corredor: string;
  ladoCorredor: string;
  x: number;
  y: number;
  espacosVinculados?: string[];
  produtos?: ProdutoLoja[];
  promocoes?: PromocaoLoja[];
  fotos?: FotoEstabelecimento[];
  contatos: ContatoLoja[];
  ocorrencias: OcorrenciaVinculada[];
  historicoOcupacoes: HistoricoOcupacao[];
  indicadores: {
    ocorrenciasAbertas: number;
    ocorrenciasTotal: number;
    taxaResolucao: number;
  };
}

// Dados mock baseados nos 4954 boxes do Centro Fashion
const LOJAS_MOCK: FichaLoja360[] = [
  {
    idLojaMapa: 'LMP-AZ-1176',
    idLoja: 'LOJ-DEMO-001',
    numeroLoja: '1176',
    nomeLoja: 'Moda Aurora',
    razaoSocial: 'Moda Aurora Comércio de Confecções Ltda.',
    cnpj: '00.000.001/0001-10',
    luc: 'LUC-1176',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Feminina',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'DIREITO',
    x: 0.1072,
    y: 0.1063,
    contatos: [
      {
        id: 'CONT-1',
        nome: 'Maria Aurora Silva',
        funcao: 'Proprietária / Responsável',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1001',
        whatsapp: '5585990001001',
        email: 'aurora@modafashion.com.br',
        principal: true,
      },
      {
        id: 'CONT-2',
        nome: 'Carlos Eduardo',
        funcao: 'Gerente da Loja',
        tipo: 'COMERCIAL',
        telefone: '(85) 98888-1176',
        whatsapp: '5585988881176',
        email: 'gerencia@modafashion.com.br',
        principal: false,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-101',
        protocolo: 'CF-2026-0891',
        titulo: 'Infiltração no teto próximo ao painel',
        descricao: 'Goteira identificada após fortes chuvas, risco na fiação.',
        prioridade: 'ALTA',
        status: 'EM_ANDAMENTO',
        setorResponsavel: 'Manutenção Predial',
        criadoEm: '2026-09-04 09:15',
      },
      {
        id: 'OC-094',
        protocolo: 'CF-2026-0812',
        titulo: 'Troca de lâmpada do corredor em frente ao box',
        descricao: 'Substituição por refletor de LED.',
        prioridade: 'BAIXA',
        status: 'CONCLUIDA',
        setorResponsavel: 'Elétrica',
        criadoEm: '2026-08-20 14:00',
        concluidoEm: '2026-08-21 11:30',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-1',
        inicio: '2024-01-10',
        responsavel: 'Maria Aurora Silva',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 2,
      taxaResolucao: 50,
    },
  },
  {
    idLojaMapa: 'LMP-AZ-1172',
    idLoja: 'LOJ-DEMO-002',
    numeroLoja: '1172',
    nomeLoja: 'Estilo Ceará',
    razaoSocial: 'Estilo Nordestino Artigos de Moda Eireli',
    cnpj: '00.000.002/0001-20',
    luc: 'LUC-1172',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Masculina',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'ESQUERDO',
    x: 0.1245,
    y: 0.1189,
    contatos: [
      {
        id: 'CONT-3',
        nome: 'Francisco José Lima',
        funcao: 'Lojista Titular',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1002',
        whatsapp: '5585990001002',
        email: 'estiloceara@lojas.com.br',
        principal: true,
      },
    ],
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-2',
        inicio: '2023-06-15',
        responsavel: 'Francisco José Lima',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-AM-1104',
    idLoja: 'LOJ-DEMO-003',
    numeroLoja: '1104',
    nomeLoja: 'Vitrine Urbana',
    razaoSocial: 'Vitrine Urbana Varejo Fashion Ltda.',
    cnpj: '00.000.003/0001-30',
    luc: 'LUC-1104',
    tipoUnidade: 'LOJA',
    segmentoPrincipal: 'Moda Feminina & Jeans',
    statusOperacao: 'ATIVA',
    setor: 'Setor Amarelo - Piso 1',
    corredor: 'Corredor Central Amarelo',
    ladoCorredor: 'DIREITO',
    x: 0.2830,
    y: 0.3540,
    contatos: [
      {
        id: 'CONT-4',
        nome: 'Renata Vasconcelos',
        funcao: 'Sócia Gerente',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1003',
        whatsapp: '5585990001003',
        email: 'renata@vitrineurbana.com.br',
        principal: true,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-105',
        protocolo: 'CF-2026-0902',
        titulo: 'Disjuntor desarmando em pico de consumo',
        descricao: 'Queda de energia no circuito interno das tomadas.',
        prioridade: 'CRITICA',
        status: 'ABERTA',
        setorResponsavel: 'Elétrica',
        criadoEm: '2026-09-06 08:30',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-3',
        inicio: '2022-11-01',
        responsavel: 'Renata Vasconcelos',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 1,
      taxaResolucao: 0,
    },
  },
  {
    idLojaMapa: 'LMP-VD-2045',
    idLoja: 'LOJ-DEMO-004',
    numeroLoja: '2045',
    nomeLoja: 'Cores do Verão',
    razaoSocial: 'Praia & Sol Confecções ME',
    cnpj: '00.000.004/0001-40',
    luc: 'LUC-2045',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Praia & Fitness',
    statusOperacao: 'ATIVA',
    setor: 'Setor Verde - Piso 2',
    corredor: 'Rua do Sol',
    ladoCorredor: 'DIREITO',
    x: 0.4120,
    y: 0.2180,
    contatos: [
      {
        id: 'CONT-5',
        nome: 'Juliana Castro',
        funcao: 'Proprietária',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-2045',
        whatsapp: '5585990002045',
        email: 'juliana@coresdoverao.com.br',
        principal: true,
      },
    ],
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-4',
        inicio: '2025-02-01',
        responsavel: 'Juliana Castro',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-RX-3120',
    idLoja: 'LOJ-DEMO-005',
    numeroLoja: '3120',
    nomeLoja: 'Espaço em Reforma (Box 3120)',
    razaoSocial: 'Centro Fashion Gestão Predial',
    cnpj: '00.000.000/0001-00',
    luc: 'LUC-3120',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Acessórios & Bijuterias',
    statusOperacao: 'REFORMA',
    setor: 'Setor Roxo - Piso 1',
    corredor: 'Alameda das Flores',
    ladoCorredor: 'ESQUERDO',
    x: 0.5890,
    y: 0.4410,
    contatos: [
      {
        id: 'CONT-6',
        nome: 'Engenharia Operacional CF',
        funcao: 'Fiscal de Obras',
        tipo: 'EMERGENCIA',
        telefone: '(85) 3000-0000',
        whatsapp: '5585999990000',
        email: 'obras@centrofashion.com.br',
        principal: true,
      },
    ],
    ocorrencias: [
      {
        id: 'OC-108',
        protocolo: 'CF-2026-0915',
        titulo: 'Vistoria pré-inauguração de mezanino',
        descricao: 'Verificação da estrutura metálica e extintor.',
        prioridade: 'MEDIA',
        status: 'EM_ANALISE',
        setorResponsavel: 'Segurança & Engenharia',
        criadoEm: '2026-09-05 16:45',
      },
    ],
    historicoOcupacoes: [
      {
        id: 'OCUP-5',
        inicio: '2026-08-15',
        responsavel: 'Engenharia CF',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 1,
      ocorrenciasTotal: 1,
      taxaResolucao: 0,
    },
  },
  {
    idLojaMapa: 'LMP-AZ-1318',
    idLoja: 'LOJ-DEMO-1318',
    numeroLoja: '1318',
    nomeLoja: 'Bella Jeans',
    razaoSocial: 'Bella Jeans Fortaleza Confecções Eireli',
    cnpj: '08.921.442/0001-90',
    luc: 'LUC-1318',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Jeanswear & Denim',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'DIREITO',
    x: 0.1380,
    y: 0.1240,
    contatos: [
      {
        id: 'CONT-BJ-1',
        nome: 'Mariana Duarte',
        funcao: 'Gerente Comercial',
        tipo: 'COMERCIAL',
        telefone: '(85) 3000-1318',
        whatsapp: '5585990001318',
        email: 'mariana@bellajeans.com.br',
        principal: true,
      },
    ],
    produtos: [
      {
        id: 'PROD-BJ-1',
        nome: 'Camisa Casual',
        categoria: 'Camisaria',
        subcategoria: 'Manga Longa',
        precoNormal: 308.90,
        emPromocao: false,
        destaque: false,
        atacado: true,
        precoAtacado: 280.00,
        qtdMinimaAtacado: 6,
        descricao: 'Camisa casual em algodão egípcio com caimento slim.',
      },
      {
        id: 'PROD-BJ-2',
        nome: 'Bermuda Sarja',
        categoria: 'Bermudas',
        subcategoria: 'Sarja Premium',
        precoNormal: 349.90,
        emPromocao: false,
        destaque: false,
        atacado: true,
        precoAtacado: 310.00,
        qtdMinimaAtacado: 6,
        descricao: 'Bermuda em sarja com elastano e acabamento resinado.',
      },
      {
        id: 'PROD-BJ-3',
        nome: 'Calça Masculina',
        categoria: 'Calças',
        subcategoria: 'Jeans Tradicional',
        precoNormal: 40.90,
        emPromocao: false,
        destaque: false,
        atacado: true,
        precoAtacado: 35.00,
        qtdMinimaAtacado: 10,
        descricao: 'Calça jeans tradicional em lavagem stone wash.',
      },
      {
        id: 'PROD-BJ-4',
        nome: 'Polo Básica',
        categoria: 'Polos',
        subcategoria: 'Piquet Tradicional',
        precoNormal: 81.90,
        precoPromocional: 63.88,
        emPromocao: true,
        vigenciaPromocao: '31/08/2026',
        destaque: true,
        atacado: true,
        precoAtacado: 55.00,
        qtdMinimaAtacado: 6,
        descricao: 'Polo básica em malha piquet com gola retilínea encorpada.',
      },
    ],
    promocoes: [
      {
        id: 'PROM-BJ-1',
        titulo: 'Liquidação Especial Polo Básica',
        descricao: 'Desconto direto de R$ 81,90 por R$ 63,88 até o fim do mês.',
        vigenciaInicio: '01/08/2026',
        vigenciaFim: '31/08/2026',
        status: 'ATIVA',
        produtosVinculadosIds: ['PROD-BJ-4'],
      },
    ],
    fotos: [], // Vazia conforme o Gate L2.2
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-BJ-1',
        inicio: '2023-03-01',
        responsavel: 'Mariana Duarte',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-AZ-1288',
    idLoja: 'LOJ-DEMO-1288',
    numeroLoja: '1288',
    nomeLoja: 'Estilo Fashion',
    razaoSocial: 'Estilo Fashion Moda & Confecções Ltda',
    cnpj: '14.512.789/0001-34',
    luc: 'LUC-1288',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Infantil',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'ESQUERDO',
    espacosVinculados: ['1288', '1274'],
    x: 0.1290,
    y: 0.1180,
    contatos: [
      {
        id: 'CONT-EF-1',
        nome: 'Ana Cláudia Martins',
        funcao: 'Proprietária & Gestora',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1288',
        whatsapp: '5585990001288',
        email: 'estilo@estilofashionkids.com.br',
        principal: true,
      },
    ],
    produtos: [
      {
        id: 'PROD-EF-1',
        nome: 'Conjunto Infantil',
        categoria: 'Moda Infantil',
        subcategoria: 'Verão',
        precoNormal: 89.90,
        precoPromocional: 69.90,
        emPromocao: true,
        vigenciaPromocao: '31/08/2026',
        destaque: true,
        atacado: true,
        precoAtacado: 59.90,
        qtdMinimaAtacado: 6,
        descricao: 'Conjunto infantil com camiseta estampada e bermuda moletom leve.',
      },
      {
        id: 'PROD-EF-2',
        nome: 'Vestido Infantil',
        categoria: 'Moda Infantil',
        subcategoria: 'Festas',
        precoNormal: 119.90,
        precoPromocional: 89.90,
        emPromocao: true,
        vigenciaPromocao: '31/08/2026',
        destaque: true,
        atacado: true,
        precoAtacado: 79.90,
        qtdMinimaAtacado: 4,
        descricao: 'Vestido infantil rodado com forro 100% algodão antialérgico.',
      },
    ],
    promocoes: [
      {
        id: 'PROM-EF-0002',
        titulo: 'Promoção Especial de Verão 0002',
        descricao: 'Desconto imperdível em vestidos e conjuntos da coleção infantil.',
        vigenciaInicio: '15/08/2026',
        vigenciaFim: '31/08/2026',
        status: 'ATIVA',
        produtosVinculadosIds: ['PROD-EF-1', 'PROD-EF-2'],
      },
    ],
    fotos: [], // Vazia conforme o Gate L2.2
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-EF-1',
        inicio: '2024-05-10',
        responsavel: 'Ana Cláudia Martins',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
  {
    idLojaMapa: 'LMP-AZ-1274',
    idLoja: 'LOJ-DEMO-1274',
    numeroLoja: '1274',
    nomeLoja: 'Estilo Fashion (Espaço 2)',
    razaoSocial: 'Estilo Fashion Moda & Confecções Ltda',
    cnpj: '14.512.789/0001-34',
    luc: 'LUC-1274',
    tipoUnidade: 'BOX',
    segmentoPrincipal: 'Moda Infantil',
    statusOperacao: 'ATIVA',
    setor: 'Setor Azul - Piso 1',
    corredor: 'Rua Governador Sampaio',
    ladoCorredor: 'ESQUERDO',
    espacosVinculados: ['1288', '1274'],
    x: 0.1265,
    y: 0.1170,
    contatos: [
      {
        id: 'CONT-EF-2',
        nome: 'Ana Cláudia Martins',
        funcao: 'Proprietária & Gestora',
        tipo: 'OPERACIONAL',
        telefone: '(85) 3000-1288',
        whatsapp: '5585990001288',
        email: 'estilo@estilofashionkids.com.br',
        principal: true,
      },
    ],
    produtos: [
      {
        id: 'PROD-EF-1',
        nome: 'Conjunto Infantil',
        categoria: 'Moda Infantil',
        subcategoria: 'Verão',
        precoNormal: 89.90,
        precoPromocional: 69.90,
        emPromocao: true,
        vigenciaPromocao: '31/08/2026',
        destaque: true,
        atacado: true,
        precoAtacado: 59.90,
        qtdMinimaAtacado: 6,
        descricao: 'Conjunto infantil com camiseta estampada e bermuda moletom leve.',
      },
      {
        id: 'PROD-EF-2',
        nome: 'Vestido Infantil',
        categoria: 'Moda Infantil',
        subcategoria: 'Festas',
        precoNormal: 119.90,
        precoPromocional: 89.90,
        emPromocao: true,
        vigenciaPromocao: '31/08/2026',
        destaque: true,
        atacado: true,
        precoAtacado: 79.90,
        qtdMinimaAtacado: 4,
        descricao: 'Vestido infantil rodado com forro 100% algodão antialérgico.',
      },
    ],
    promocoes: [
      {
        id: 'PROM-EF-0002',
        titulo: 'Promoção Especial de Verão 0002',
        descricao: 'Desconto imperdível em vestidos e conjuntos da coleção infantil.',
        vigenciaInicio: '15/08/2026',
        vigenciaFim: '31/08/2026',
        status: 'ATIVA',
        produtosVinculadosIds: ['PROD-EF-1', 'PROD-EF-2'],
      },
    ],
    fotos: [], // Vazia conforme o Gate L2.2
    ocorrencias: [],
    historicoOcupacoes: [
      {
        id: 'OCUP-EF-2',
        inicio: '2024-05-10',
        responsavel: 'Ana Cláudia Martins',
        atual: true,
      },
    ],
    indicadores: {
      ocorrenciasAbertas: 0,
      ocorrenciasTotal: 0,
      taxaResolucao: 100,
    },
  },
];

export const Loja360Service = {
  /**
   * Lista todas as lojas/boxes disponíveis
   */
  listarLojas(filtro?: { termo?: string; setor?: string; status?: string }): FichaLoja360[] {
    let resultado = [...LOJAS_MOCK];

    if (filtro?.termo) {
      const termoLimpo = filtro.termo.toLowerCase().trim();
      resultado = resultado.filter(
        (l) =>
          l.numeroLoja.toLowerCase().includes(termoLimpo) ||
          l.nomeLoja.toLowerCase().includes(termoLimpo) ||
          l.segmentoPrincipal.toLowerCase().includes(termoLimpo) ||
          l.corredor.toLowerCase().includes(termoLimpo) ||
          l.contatos.some((c) => c.nome.toLowerCase().includes(termoLimpo))
      );
    }

    if (filtro?.setor && filtro.setor !== 'TODOS') {
      resultado = resultado.filter((l) => l.setor.toLowerCase().includes(filtro.setor!.toLowerCase()));
    }

    if (filtro?.status && filtro.status !== 'TODOS') {
      resultado = resultado.filter((l) => l.statusOperacao === filtro.status);
    }

    return resultado;
  },

  /**
   * Obtém a ficha detalhada de uma loja por idLojaMapa ou número do box
   */
  obterFicha(identificador: string): FichaLoja360 | null {
    const idLimpo = identificador.trim().toLowerCase();

    // 1. Consulta prioritária no Catálogo Real de Produção (sincronizado com as planilhas oficiais)
    const realItem = CatalogoProducaoService.buscarPorIdentificador(identificador);
    if (realItem) {
      return {
        idLojaMapa: realItem.idLojaMapa,
        idLoja: realItem.idLoja,
        numeroLoja: realItem.numeroBox,
        nomeLoja: realItem.nomeFantasia,
        razaoSocial: realItem.permissionario.razaoSocial || realItem.nomeFantasia,
        cnpj: realItem.permissionario.documento,
        tipoUnidade: 'LOJA',
        segmentoPrincipal: realItem.segmento,
        statusOperacao: (realItem.statusOperacao as any) || 'ATIVA',
        statusOcupacao: realItem.statusOcupacao,
        corStatus: realItem.corStatus,
        descricaoStatus: realItem.descricaoStatus,
        parcelasAtraso: realItem.parcelasAtraso,
        valorPendente: realItem.valorPendente,
        setor: `Setor ${realItem.setor} • Piso 1`,
        corredor: realItem.corredor,
        ladoCorredor: realItem.lado || 'PADRAO',
        x: realItem.x,
        y: realItem.y,
        contatos: realItem.contato.nome ? [
          {
            id: `CONT-${realItem.idLoja || realItem.numeroBox}`,
            nome: realItem.contato.nome,
            funcao: realItem.contato.cargo || 'Responsável',
            tipo: 'COMERCIAL',
            telefone: realItem.permissionario.telefone || '(85) 3000-0000',
            whatsapp: realItem.contato.whatsapp || realItem.permissionario.whatsapp || '5585990000000',
            email: realItem.permissionario.email || '',
            principal: true,
          }
        ] : (realItem.permissionario.nomeFantasia ? [
          {
            id: `CONT-${realItem.idLoja || realItem.numeroBox}`,
            nome: realItem.permissionario.nomeFantasia,
            funcao: 'Permissionário / Titular',
            tipo: 'OPERACIONAL',
            telefone: realItem.permissionario.telefone || '(85) 3000-0000',
            whatsapp: realItem.permissionario.whatsapp || '5585990000000',
            email: realItem.permissionario.email || '',
            principal: true,
          }
        ] : []),
        ocorrencias: [],
        historicoOcupacoes: [
          {
            id: `OCUP-${realItem.idLoja || realItem.numeroBox}`,
            inicio: '2024-01-01',
            responsavel: realItem.permissionario.razaoSocial || realItem.nomeFantasia,
            atual: true,
          }
        ],
        indicadores: {
          ocorrenciasAbertas: 0,
          ocorrenciasTotal: 0,
          taxaResolucao: 100,
        },
      };
    }

    const loja = LOJAS_MOCK.find(
      (l) => l.idLojaMapa.toLowerCase() === idLimpo || l.numeroLoja.toLowerCase() === idLimpo
    );

    if (loja) return loja;

    // Se for uma busca por número de box não cadastrado no mock, gera a ficha dinâmica
    if (/^\d+$/.test(idLimpo)) {
      return {
        idLojaMapa: `LMP-GEN-${idLimpo}`,
        numeroLoja: identificador,
        nomeLoja: `Box ${identificador}`,
        tipoUnidade: 'BOX',
        segmentoPrincipal: 'Moda & Acessórios',
        statusOperacao: 'ATIVA',
        setor: 'Setor Geral - Piso 1',
        corredor: 'Corredor Geral',
        ladoCorredor: 'PADRAO',
        x: 0.5,
        y: 0.5,
        contatos: [
          {
            id: `CONT-${idLimpo}`,
            nome: `Lojista Box ${identificador}`,
            funcao: 'Responsável Operacional',
            tipo: 'OPERACIONAL',
            telefone: '(85) 3000-0000',
            whatsapp: '5585990000000',
            email: `box${identificador}@centrofashion.com.br`,
            principal: true,
          },
        ],
        ocorrencias: [],
        historicoOcupacoes: [
          {
            id: `OCUP-${idLimpo}`,
            inicio: '2026-01-01',
            responsavel: `Lojista Box ${identificador}`,
            atual: true,
          },
        ],
        indicadores: {
          ocorrenciasAbertas: 0,
          ocorrenciasTotal: 0,
          taxaResolucao: 100,
        },
      };
    }

    return null;
  },

  /**
   * Obtém os produtos cadastrados de uma loja/box
   */
  obterProdutos(identificador: string): ProdutoLoja[] {
    const ficha = this.obterFicha(identificador);
    return ficha?.produtos || [];
  },

  /**
   * Obtém as promoções ativas de uma loja/box
   */
  obterPromocoes(identificador: string): PromocaoLoja[] {
    const ficha = this.obterFicha(identificador);
    return ficha?.promocoes || [];
  },

  /**
   * Obtém a galeria de fotos do estabelecimento
   */
  obterFotos(identificador: string): FotoEstabelecimento[] {
    const ficha = this.obterFicha(identificador);
    return ficha?.fotos || [];
  },
};
