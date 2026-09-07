#!/usr/bin/env python3
"""
Sincronizador Oficial do Ecossistema de Gestão de Lojistas - Centro Fashion Fortaleza
Conecta via Google Sheets API (Service Account) às 8 planilhas de produção:
  00_CORE_CONTROLE
  01_CARTOGRAFIA_ESPACOS
  02_CADASTRO_360
  03_MIDIA_CATALOGO
  04_CAMPANHAS_MARKETING
  05_CAMPO_LEVANTAMENTOS
  06_AUDITORIA_HISTORICO
  07_FINANCEIRO_CONTRATOS
"""

import os
import sys
import json
import time
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "src" / "data" / "sheets_cache"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CREDS_FILE = BASE_DIR / "credentials" / "google_service_account.json"

SHEETS_REGISTRY = {
    "00_CORE_CONTROLE": {
        "id": "1lGPTk1dFNmbb1xinCVxznYdB3e4qRIrlTs18bDh32Rs",
        "description": "Controle central, usuários, configurações e perfis",
    },
    "01_CARTOGRAFIA_ESPACOS": {
        "id": "1alyS3yEI0V1df8s5De1ODhoK1WVOzMFhwxdur04PAm0",
        "description": "Planta cartográfica, setores, corredores, lojas do mapa e espaços",
    },
    "02_CADASTRO_360": {
        "id": "1pzCRZ2799jKCGWFJETjLz2TjVs2JkIs1iYQV468HZNA",
        "description": "Ficha 360, lojistas, permissionários, contatos e ocupações",
    },
    "03_MIDIA_CATALOGO": {
        "id": "16sSERnYgCG8iot9iBpAHgO0ZheDyiDT6MtGA9K__8_I",
        "description": "Catálogo de produtos, fotos de lojas e redes sociais",
    },
    "04_CAMPANHAS_MARKETING": {
        "id": "1_mqZpQBMOBOshFykemxCSuKbhj7I0JOkTy_HxV8gT4g",
        "description": "Campanhas ativas, adesões de lojistas e histórico",
    },
    "05_CAMPO_LEVANTAMENTOS": {
        "id": "1pe7e_PumhpZGVvEsnZrIxLku6bkmZ6aD5cMtNXEaT4U",
        "description": "Roteiros de campo, inspeções e checklists operacionais",
    },
    "06_AUDITORIA_HISTORICO": {
        "id": "1nG4BKtm-rxsflnwDZfkQe3D8NHN63b86AXoIPjje7z8",
        "description": "Logs de auditoria, eventos de integração e relatórios",
    },
    "07_FINANCEIRO_CONTRATOS": {
        "id": "1f9-I94mjByCnoKXKBSSQPUL5ZdnHiYnmuZDmWKoeiN0",
        "description": "Contratos, lançamentos financeiros, auditoria de vendas e acordos",
    },
}

def get_service():
    if not CREDS_FILE.exists():
        raise FileNotFoundError(f"Arquivo de credenciais não encontrado: {CREDS_FILE}")
    creds = service_account.Credentials.from_service_account_file(
        str(CREDS_FILE),
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )
    return build("sheets", "v4", credentials=creds)

def sync_all(delay=1.5):
    print("==================================================================")
    print(" Centro Fashion - Sincronizador das 8 Planilhas de Gestão Lojistas ")
    print("==================================================================")
    
    service = get_service()
    summary = {}

    for sheet_key, meta_info in SHEETS_REGISTRY.items():
        spreadsheet_id = meta_info["id"]
        print(f"\n📥 Processando [{sheet_key}] ({meta_info['description']})...")
        time.sleep(delay)

        try:
            meta = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheet_titles = [s["properties"]["title"] for s in meta.get("sheets", [])]
            print(f"   Abas encontradas ({len(sheet_titles)}): {', '.join(sheet_titles)}")

            sheet_data = {}
            for title in sheet_titles:
                time.sleep(delay)
                try:
                    res = service.spreadsheets().values().get(
                        spreadsheetId=spreadsheet_id,
                        range=title
                    ).execute()
                    rows = res.get("values", [])
                    if rows:
                        headers = [str(h).strip() for h in rows[0]]
                        records = []
                        for row in rows[1:]:
                            record = {}
                            for i, h in enumerate(headers):
                                if h:
                                    record[h] = row[i] if i < len(row) else ""
                            records.append(record)
                        sheet_data[title] = {
                            "total_rows": len(records),
                            "headers": headers,
                            "records": records
                        }
                        print(f"   ✓ Aba '{title}': {len(records)} linhas sincronizadas.")
                    else:
                        sheet_data[title] = {"total_rows": 0, "headers": [], "records": []}
                        print(f"   ℹ Aba '{title}': vazia.")
                except Exception as ex_tab:
                    print(f"   ⚠️ Erro ao ler aba '{title}': {ex_tab}")
                    sheet_data[title] = {"error": str(ex_tab)}

            # Salva o arquivo JSON consolidado da planilha
            out_file = OUTPUT_DIR / f"{sheet_key}.json"
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(sheet_data, f, indent=2, ensure_ascii=False)
            
            summary[sheet_key] = {
                "file": str(out_file.name),
                "tabs_count": len(sheet_titles),
                "total_records": sum(v.get("total_rows", 0) for v in sheet_data.values() if isinstance(v, dict))
            }
            print(f"   💾 Arquivo salvo: {out_file.name}")

        except Exception as ex_sheet:
            print(f"   ❌ Falha ao processar [{sheet_key}]: {ex_sheet}")
            summary[sheet_key] = {"error": str(ex_sheet)}

    # Salva o índice geral
    summary_file = OUTPUT_DIR / "_index_gestao_lojistas.json"
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print("\n==================================================================")
    print(f"🎉 Sincronização Concluída! Dados disponíveis em: {OUTPUT_DIR}")
    print("==================================================================")

if __name__ == "__main__":
    delay_param = 1.2
    if len(sys.argv) > 1:
        try:
            delay_param = float(sys.argv[1])
        except ValueError:
            pass
    sync_all(delay=delay_param)
