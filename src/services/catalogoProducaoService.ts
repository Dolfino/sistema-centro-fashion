/**
 * Serviço de Catálogo de Dados de Produção - Centro Fashion Fortaleza
 * Consome os dados reais sincronizados das 8 planilhas de Gestão de Lojistas.
 */

import lojasProducaoRaw from '../data/lojas_producao_unificadas.json';

export interface LojaProducaoItem {
  idLojaMapa: string;
  numeroBox: string;
  setor: string;
  idMapaSetor: string;
  corredor: string;
  lado: string;
  x: number;
  y: number;
  rotacao: number;
  cor: string;
  statusMapa: string;
  idLoja: string;
  nomeFantasia: string;
  nomeFachada: string;
  segmento: string;
  subsegmento: string;
  modeloComercial: string;
  statusOperacao: string;
  statusOcupacao?: string;
  corStatus?: string;
  descricaoStatus?: string;
  parcelasAtraso?: number;
  valorPendente?: number;
  permissionario: {
    id: string;
    razaoSocial: string;
    nomeFantasia: string;
    documento: string;
    telefone: string;
    whatsapp: string;
    email: string;
  };
  contato: {
    nome: string;
    cargo: string;
    whatsapp: string;
  };
  campanhasAtivas: string[];
}

const lojas: LojaProducaoItem[] = lojasProducaoRaw as LojaProducaoItem[];

// Índices rápidos em memória
const mapByIdLojaMapa = new Map<string, LojaProducaoItem>();
const mapByNumeroBox = new Map<string, LojaProducaoItem>();
const mapByIdLoja = new Map<string, LojaProducaoItem>();

for (const item of lojas) {
  if (item.idLojaMapa) mapByIdLojaMapa.set(item.idLojaMapa.toLowerCase(), item);
  if (item.numeroBox) mapByNumeroBox.set(item.numeroBox.toLowerCase(), item);
  if (item.idLoja) mapByIdLoja.set(item.idLoja.toLowerCase(), item);
}

export const CatalogoProducaoService = {
  /**
   * Retorna todas as lojas/boxes mapeados
   */
  obterTodas(): LojaProducaoItem[] {
    return lojas;
  },

  /**
   * Total de pontos cadastrados
   */
  totalPontos(): number {
    return lojas.length;
  },

  /**
   * Busca uma loja por idLojaMapa, número do box ou idLoja
   */
  buscarPorIdentificador(identificador: string): LojaProducaoItem | null {
    if (!identificador) return null;
    const key = identificador.trim().toLowerCase();
    return mapByIdLojaMapa.get(key) || mapByNumeroBox.get(key) || mapByIdLoja.get(key) || null;
  },

  /**
   * Filtra lojas por setor
   */
  buscarPorSetor(setor: string): LojaProducaoItem[] {
    const s = setor.toUpperCase().trim();
    return lojas.filter((l) => {
      const idSetor = (l.idMapaSetor || '').toUpperCase();
      const nomeSetor = (l.setor || '').toUpperCase();
      return idSetor.includes(s) || nomeSetor === s;
    });
  },

  /**
   * Busca textual rápida por termo (nome, box, permissionário, segmento)
   */
  pesquisaRapida(termo: string, limite = 10): LojaProducaoItem[] {
    if (!termo || termo.trim().length < 2) return [];
    const t = termo.trim().toLowerCase();
    const resultados: LojaProducaoItem[] = [];

    for (const l of lojas) {
      if (
        l.numeroBox.toLowerCase().includes(t) ||
        l.nomeFantasia.toLowerCase().includes(t) ||
        l.permissionario.razaoSocial.toLowerCase().includes(t) ||
        l.segmento.toLowerCase().includes(t) ||
        l.corredor.toLowerCase().includes(t)
      ) {
        resultados.push(l);
        if (resultados.length >= limite) break;
      }
    }

    return resultados;
  },
};
