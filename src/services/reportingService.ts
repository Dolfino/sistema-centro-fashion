/**
 * Serviço de Relatórios e Auditoria de Gestão
 * Plataforma Mall (Centro Fashion)
 */

export interface AuditReportFilter {
  sector?: string;
  conservationStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface InspectionSummaryReport {
  totalAssets: number;
  goodCount: number;
  regularCount: number;
  badCount: number;
  criticalCount: number;
  goodPercentage: number;
  pendingActionsCount: number;
  sectorDistribution: Record<string, number>;
}

export class ReportingService {
  /**
   * Gera resumo estatístico para o Painel de Gestão
   */
  public generateSummaryReport(pins: any[]): InspectionSummaryReport {
    const total = pins.length;
    let good = 0, regular = 0, bad = 0, critical = 0;
    const sectorDist: Record<string, number> = {};

    for (const pin of pins) {
      const status = pin.conservationStatus || 'GOOD';
      if (status === 'GOOD') good++;
      else if (status === 'REGULAR') regular++;
      else if (status === 'BAD') bad++;
      else if (status === 'CRITICAL') critical++;

      const sec = pin.sector || 'SETOR_AZUL';
      sectorDist[sec] = (sectorDist[sec] || 0) + 1;
    }

    return {
      totalAssets: total,
      goodCount: good,
      regularCount: regular,
      badCount: bad,
      criticalCount: critical,
      goodPercentage: total > 0 ? Math.round((good / total) * 100) : 100,
      pendingActionsCount: bad + critical,
      sectorDistribution: sectorDist,
    };
  }

  /**
   * Exporta o inventário completo em formato CSV
   */
  public exportInventoryCSV(pins: any[]): string {
    const headers = ['Protocolo', 'Categoria', 'Setor', 'Estado', 'Coordenada_X_%', 'Coordenada_Y_%', 'Observacoes'];
    const rows = pins.map((p) => [
      p.assetCode,
      `"${p.category || ''}"`,
      p.sector,
      p.conservationStatus,
      `${(p.normalizedX * 100).toFixed(2)}%`,
      `${(p.normalizedY * 100).toFixed(2)}%`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
