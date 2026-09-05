#!/usr/bin/env python3
"""
Sincronizador Google Drive & Google Sheets via Service Account (Opção C)
Sistema Centro Fashion - Rondas, Inspeções e Sinalizações

Uso:
  python3 scripts/sync_google_drive_sheets.py --test-connection
  python3 scripts/sync_google_drive_sheets.py --sync-sheets
  python3 scripts/sync_google_drive_sheets.py --list-drive
  python3 scripts/sync_google_drive_sheets.py --download-photos
"""

import os
import sys
import json
import argparse
from pathlib import Path

# IDs oficiais do projeto Centro Fashion
SPREADSHEET_ID = "1j5bYY-0JpbLd95FyV19lyRPSG6j9kpoM8UCCWZjKchs"
DRIVE_FOLDER_IDS = [
    "1tbGCbyz3gxMHkNgbcSgbl1Zt2baDZ5xh",
    "1XTL1g6wKRjd0vKv7Z55cn3_A4zuYdV3I"
]

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
]

def get_credentials_path(custom_path=None):
    if custom_path and os.path.exists(custom_path):
        return custom_path
    
    env_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    if env_path and os.path.exists(env_path):
        return env_path

    default_paths = [
        os.path.join(os.getcwd(), 'credentials', 'google_service_account.json'),
        os.path.join(os.getcwd(), 'google_service_account.json'),
        os.path.expanduser('~/.config/google/service_account.json')
    ]
    for p in default_paths:
        if os.path.exists(p):
            return p

    # Auto-detectar qualquer arquivo de credencial no root (*client*.json)
    for f in os.listdir(os.getcwd()):
        if f.endswith('.json') and ('client' in f or 'service_account' in f):
            return os.path.join(os.getcwd(), f)

    return None

def get_services(credentials_path):
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    if not credentials_path or not os.path.exists(credentials_path):
        raise FileNotFoundError(
            f"Arquivo de credenciais não encontrado.\n"
            f"Por favor, salve seu arquivo JSON em: credentials/google_service_account.json\n"
            f"Consulte o guia em: credentials/README.md"
        )

    with open(credentials_path, 'r', encoding='utf-8') as f:
        cred_info = json.load(f)
        client_email = cred_info.get('client_email', 'Desconhecido')
        print(f"🔑 Usando Conta de Serviço: {client_email}")

    credentials = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )

    sheets_service = build('sheets', 'v4', credentials=credentials)
    drive_service = build('drive', 'v3', credentials=credentials)
    return sheets_service, drive_service, client_email

def test_connection(sheets_service, drive_service, client_email):
    print("\n" + "=" * 60)
    print("🔍 TESTE DE CONEXÃO E PERMISSÕES (GOOGLE SERVICE ACCOUNT)")
    print("=" * 60)

    # 1. Testar Planilha
    print(f"\n1. Acessando Planilha Base [{SPREADSHEET_ID}]...")
    try:
        sheet_meta = sheets_service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        title = sheet_meta.get('properties', {}).get('title', 'Sem título')
        sheets = [s['properties']['title'] for s in sheet_meta.get('sheets', [])]
        print(f"   ✅ SUCESSO: Conectado à planilha '{title}'")
        print(f"   Abas encontradas ({len(sheets)}): {', '.join(sheets)}")
    except Exception as e:
        print(f"   ❌ ERRO AO ACESSAR PLANILHA: {e}")
        print(f"   👉 Verifique se você compartilhou a planilha com o e-mail:")
        print(f"      {client_email} (Permissão: Leitor)")

    # 2. Testar Pastas do Google Drive
    print("\n2. Acessando Pastas do Google Drive...")
    for idx, folder_id in enumerate(DRIVE_FOLDER_IDS, 1):
        print(f"\n   Pasta {idx} [{folder_id}]:")
        try:
            folder_meta = drive_service.files().get(fileId=folder_id, fields='id, name, mimeType').execute()
            folder_name = folder_meta.get('name', 'Sem nome')
            print(f"   ✅ SUCESSO: Conectado à pasta '{folder_name}'")

            # Listar arquivos
            query = f"'{folder_id}' in parents and trashed = false"
            results = drive_service.files().list(
                q=query, pageSize=10, fields="files(id, name, mimeType, size)"
            ).execute()
            files = results.get('files', [])
            print(f"   Itens encontrados (amostra de até 10): {len(files)}")
            for f in files:
                print(f"    - {f['name']} ({f.get('mimeType', 'desconhecido')})")
        except Exception as e:
            print(f"   ❌ ERRO AO ACESSAR PASTA {folder_id}: {e}")
            print(f"   👉 Compartilhe esta pasta no Google Drive com:")
            print(f"      {client_email} (Permissão: Leitor)")

def sync_sheets(sheets_service, output_dir="database/sync_export"):
    os.makedirs(output_dir, exist_ok=True)
    print(f"\n📥 Baixando dados das abas da planilha [{SPREADSHEET_ID}]...")
    sheet_meta = sheets_service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
    sheets = [s['properties']['title'] for s in sheet_meta.get('sheets', [])]

    exported_files = []
    for sheet_name in sheets:
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID, range=sheet_name
        ).execute()
        rows = result.get('values', [])
        target_json = os.path.join(output_dir, f"{sheet_name}.json")
        with open(target_json, 'w', encoding='utf-8') as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        print(f"   - {sheet_name}: {len(rows)} linhas exportadas para {target_json}")
        exported_files.append(target_json)

    print(f"\n✅ Sincronização de abas concluída com sucesso ({len(exported_files)} abas)!")

def download_photos(drive_service, fotos_json="database/sync_export/REGISTRO_FOTOS.json", output_dir="assets/photos"):
    import io
    from googleapiclient.http import MediaIoBaseDownload

    if not os.path.exists(fotos_json):
        print(f"❌ Arquivo {fotos_json} não encontrado. Execute primeiro: python3 scripts/sync_google_drive_sheets.py --sync-sheets")
        return

    os.makedirs(output_dir, exist_ok=True)
    with open(fotos_json, 'r', encoding='utf-8') as f:
        rows = json.load(f)

    if not rows or len(rows) < 2:
        print("Nenhuma foto registrada encontrada.")
        return

    headers = rows[0]
    id_arquivo_idx = headers.index('ARQUIVO_ID') if 'ARQUIVO_ID' in headers else 7
    nome_arquivo_idx = headers.index('NOME_ARQUIVO') if 'NOME_ARQUIVO' in headers else 8
    sha256_idx = headers.index('SHA256') if 'SHA256' in headers else 11

    print(f"\n🖼️  Iniciando download de fotos da planilha ({len(rows)-1} registros)...")
    success_count = 0
    skip_count = 0
    error_count = 0

    for r in rows[1:]:
        if len(r) <= id_arquivo_idx:
            continue
        file_id = r[id_arquivo_idx]
        file_name = r[nome_arquivo_idx] if len(r) > nome_arquivo_idx and r[nome_arquivo_idx] else f"{file_id}.jpg"
        
        if not file_id:
            continue

        target_file = os.path.join(output_dir, file_name)
        if os.path.exists(target_file) and os.path.getsize(target_file) > 0:
            skip_count += 1
            continue

        try:
            request = drive_service.files().get_media(fileId=file_id)
            with io.FileIO(target_file, 'wb') as fh:
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
            print(f"   ✅ Baixado: {file_name} ({os.path.getsize(target_file)} bytes)")
            success_count += 1
        except Exception as e:
            print(f"   ⚠️ Erro ao baixar {file_name} [{file_id}]: {e}")
            error_count += 1

    print(f"\n✨ Resumo do Download:")
    print(f"   - Novos arquivos baixados: {success_count}")
    print(f"   - Arquivos já existentes: {skip_count}")
    print(f"   - Falhas/Sem permissão: {error_count}")

def main():
    parser = argparse.ArgumentParser(description="Sincronizador Google Drive & Sheets via Service Account")
    parser.add_argument("--credentials", help="Caminho para o JSON da Conta de Serviço")
    parser.add_argument("--test-connection", action="store_true", help="Testar permissões e conexão com a planilha e pastas")
    parser.add_argument("--sync-sheets", action="store_true", help="Exportar todas as abas da planilha em JSON")
    parser.add_argument("--download-photos", action="store_true", help="Baixar fotos do Drive referenciadas em REGISTRO_FOTOS")
    parser.add_argument("--output-dir", default="database/sync_export", help="Diretório para salvar os dados exportados")

    args = parser.parse_args()

    cred_path = get_credentials_path(args.credentials)
    if not cred_path:
        print("❌ Nenhuma credencial do Google Service Account foi encontrada.")
        print("👉 Salve sua chave JSON em: credentials/google_service_account.json")
        print("Consulte o passo a passo em: credentials/README.md")
        sys.exit(1)

    try:
        sheets_service, drive_service, email = get_services(cred_path)
    except Exception as e:
        print(f"❌ Falha ao inicializar serviços da API Google: {e}")
        sys.exit(1)

    if args.test_connection or (not args.sync_sheets and not args.download_photos):
        test_connection(sheets_service, drive_service, email)

    if args.sync_sheets:
        sync_sheets(sheets_service, args.output_dir)

    if args.download_photos:
        download_photos(drive_service)

if __name__ == "__main__":
    main()
