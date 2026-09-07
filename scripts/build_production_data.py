#!/usr/bin/env python3
"""
Compilador e Indexador dos Dados Reais de Gestão de Lojistas do Centro Fashion
Cruza:
  - 01_CARTOGRAFIA_ESPACOS (LOJAS_MAPA, ESPACOS)
  - 02_CADASTRO_360 (LOJAS, PERMISSIONARIOS, OCUPACOES, PESSOAS_CONTATO)
  - 04_CAMPANHAS_MARKETING (CAMPANHAS_MARKETING, LOJA_CAMPANHAS)
  - 07_FINANCEIRO_CONTRATOS (CONTRATOS, AUDITORIA_VENDAS, FINANCEIRO_LANCAMENTOS)
Gera arquivos otimizados e leves em `src/data/` prontos para consumo instantâneo.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CACHE_DIR = BASE_DIR / "src" / "data" / "sheets_cache"
DATA_DIR = BASE_DIR / "src" / "data"

def load_cache(filename):
    p = CACHE_DIR / filename
    if not p.exists():
        return {}
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_float(val):
    if not val:
        return 0.0
    try:
        return float(str(val).replace(",", ".").strip())
    except:
        return 0.0

def build():
    print("Iniciando compilação e indexação dos dados reais do Centro Fashion...")
    
    cartografia = load_cache("01_CARTOGRAFIA_ESPACOS.json")
    cadastro = load_cache("02_CADASTRO_360.json")
    campanhas = load_cache("04_CAMPANHAS_MARKETING.json")
    financeiro = load_cache("07_FINANCEIRO_CONTRATOS.json")

    # 1. Indexar Permissionários por ID
    permissionarios_raw = cadastro.get("PERMISSIONARIOS", {}).get("records", [])
    permissionarios_by_id = {p["ID_PERMISSIONARIO"]: p for p in permissionarios_raw if "ID_PERMISSIONARIO" in p}
    print(f"Indexados {len(permissionarios_by_id)} permissionários.")

    # 2. Indexar Contatos por ID_PERMISSIONARIO ou ID_PESSOA
    contatos_raw = cadastro.get("PESSOAS_CONTATO", {}).get("records", [])
    contatos_by_id = {c["ID_PESSOA"]: c for c in contatos_raw if "ID_PESSOA" in c}

    vinculos_raw = cadastro.get("CONTATO_VINCULOS", {}).get("records", [])
    contatos_by_loja = {}
    for v in vinculos_raw:
        id_loja = v.get("ID_LOJA")
        id_pessoa = v.get("ID_PESSOA")
        if id_loja and id_pessoa in contatos_by_id:
            if id_loja not in contatos_by_loja:
                contatos_by_loja[id_loja] = []
            contatos_by_loja[id_loja].append(contatos_by_id[id_pessoa])

    # 3. Indexar Lojas por ID_LOJA
    lojas_raw = cadastro.get("LOJAS", {}).get("records", [])
    lojas_by_id = {l["ID_LOJA"]: l for l in lojas_raw if "ID_LOJA" in l}
    print(f"Indexadas {len(lojas_by_id)} lojas.")

    # 4. Indexar Ocupações por ID_ESPACO (que equivale ao ID_LOJA_MAPA)
    ocupacoes_raw = cadastro.get("OCUPACOES", {}).get("records", [])
    ocupacoes_by_espaco = {}
    for oc in ocupacoes_raw:
        espaco_id = oc.get("ID_ESPACO")
        if espaco_id and oc.get("OCUPACAO_ATUAL") == "SIM":
            ocupacoes_by_espaco[espaco_id] = oc

    # 5. Indexar Campanhas ativas de Lojas
    loja_campanhas_raw = campanhas.get("LOJA_CAMPANHAS", {}).get("records", [])
    campanhas_by_loja = {}
    for lc in loja_campanhas_raw:
        id_l = lc.get("ID_LOJA")
        if id_l:
            if id_l not in campanhas_by_loja:
                campanhas_by_loja[id_l] = []
            campanhas_by_loja[id_l].append({
                "idCampanha": lc.get("ID_CAMPANHA"),
                "statusAdesao": lc.get("STATUS_ADESAO"),
                "confirmadoEm": lc.get("CONFIRMADO_EM")
            })

    # 6. Compilar Lista Unificada de Pontos do Mapa (LOJAS_MAPA)
    lojas_mapa_raw = cartografia.get("LOJAS_MAPA", {}).get("records", [])
    lojas_compiladas = []

    for lm in lojas_mapa_raw:
        id_loja_mapa = lm.get("ID_LOJA_MAPA")
        numero_box = lm.get("NUMERO_LOJA", "")
        setor_id = lm.get("ID_MAPA_SETOR", "")
        
        # Mapeia setor legível
        setor_nome = "Azul"
        if "AMARELO" in setor_id:
            setor_nome = "Amarelo"
        elif "VERDE" in setor_id:
            setor_nome = "Verde"
        elif "VERMELHO" in setor_id:
            setor_nome = "Vermelho"
        elif "ROXO" in setor_id:
            setor_nome = "Roxo"

        # Coordenadas
        x_norm = parse_float(lm.get("X_NORMALIZADO"))
        y_norm = parse_float(lm.get("Y_NORMALIZADO"))

        # Cruza com ocupação e loja real
        ocupacao = ocupacoes_by_espaco.get(id_loja_mapa, {})
        id_loja_real = ocupacao.get("ID_LOJA") or lm.get("ID_LOJA")
        loja_real = lojas_by_id.get(id_loja_real, {})

        # Permissionário
        id_perm = loja_real.get("ID_PERMISSIONARIO")
        perm_real = permissionarios_by_id.get(id_perm, {})

        # Contatos
        contatos_loja = contatos_by_loja.get(id_loja_real, [])
        contato_principal = contatos_loja[0] if contatos_loja else {}

        # Campanhas
        camps = campanhas_by_loja.get(id_loja_real, [])

        lojas_compiladas.append({
            "idLojaMapa": id_loja_mapa,
            "numeroBox": numero_box,
            "setor": setor_nome,
            "idMapaSetor": setor_id,
            "corredor": lm.get("ID_CORREDOR", ""),
            "lado": lm.get("LADO_CORREDOR", ""),
            "x": x_norm,
            "y": y_norm,
            "rotacao": parse_float(lm.get("ROTACAO_GRAUS")),
            "cor": lm.get("COR_MARCADOR") or "#1457D9",
            "statusMapa": lm.get("STATUS", "POSICIONADA"),
            "idLoja": id_loja_real or "",
            "nomeFantasia": loja_real.get("NOME_FANTASIA") or f"Box {numero_box}",
            "nomeFachada": loja_real.get("NOME_FACHADA") or "",
            "segmento": loja_real.get("SEGMENTO_PRINCIPAL") or "Moda Geral",
            "subsegmento": loja_real.get("SUBSEGMENTO") or "",
            "modeloComercial": loja_real.get("MODELO_COMERCIAL") or "ATACADO_VAREJO",
            "statusOperacao": loja_real.get("STATUS_OPERACAO") or "ATIVA",
            "permissionario": {
                "id": id_perm or "",
                "razaoSocial": perm_real.get("RAZAO_SOCIAL") or "",
                "nomeFantasia": perm_real.get("NOME_FANTASIA") or "",
                "documento": perm_real.get("CNPJ_CPF") or "",
                "telefone": perm_real.get("TELEFONE_PRINCIPAL") or "",
                "whatsapp": perm_real.get("WHATSAPP") or "",
                "email": perm_real.get("EMAIL_PRINCIPAL") or ""
            },
            "contato": {
                "nome": contato_principal.get("NOME_COMPLETO") or "",
                "cargo": contato_principal.get("CARGO_FUNCAO") or "",
                "whatsapp": contato_principal.get("WHATSAPP") or contato_principal.get("TELEFONE_CELULAR") or "",
            },
            "campanhasAtivas": [c["idCampanha"] for c in camps]
        })

    out_file = DATA_DIR / "lojas_producao_unificadas.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(lojas_compiladas, f, indent=2, ensure_ascii=False)

    print(f"Sucesso! Gerado catálogo com {len(lojas_compiladas)} lojas reais em {out_file.name}")
    print(f"Tamanho do arquivo otimizado: {out_file.stat().st_size / (1024*1024):.2f} MB")

if __name__ == "__main__":
    build()
