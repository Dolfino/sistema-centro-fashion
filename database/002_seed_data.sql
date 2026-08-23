-- ==============================================================================
-- DADOS DE SEED E MIGRAÇÃO DO LEGADO (MAPA - SINALIZAÇÃO DO MALL)
-- Gerado em: 2026-08-23T15:34:33.625702Z
-- ==============================================================================

-- 1. SETORES
INSERT INTO sectors (code, name, color_hex)
VALUES ('AZUL', 'Setor Azul', '#1D4ED8')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_hex = EXCLUDED.color_hex;
INSERT INTO sectors (code, name, color_hex)
VALUES ('VERDE', 'Setor Verde', '#16A34A')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, color_hex = EXCLUDED.color_hex;

-- 2. USUÁRIOS
INSERT INTO users (email, name, profile_role, active)
VALUES ('davidsilva.centrofashion@gmail.com', 'davidsilva.centrofashion', 'ADMIN', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;
INSERT INTO users (email, name, profile_role, active)
VALUES ('centrofashionmarketing@gmail.com', 'David Nascimento da Silva', 'ADMIN', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;
INSERT INTO users (email, name, profile_role, active)
VALUES ('wendellucas@centrofashion.com', 'Wendel', 'CONSULTA', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;
INSERT INTO users (email, name, profile_role, active)
VALUES ('albaniramerico@centrofashion.com', 'Albanir', 'CONSULTA', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;
INSERT INTO users (email, name, profile_role, active)
VALUES ('charlessantiago@centrofashion.com', 'Charles', 'CONSULTA', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;

-- 3. SINALIZAÇÕES DE CAMPO (REGISTROS)
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6ba71132-d2c8-46f9-8fb7-9ff589b368a3', 'SIG-1D3E95FD449D431B', 'SIG-20260814-0001', 'Placa informativa', 'GOOD', 'ACTIVE', 'Rua General Bezerril')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('ee32fbbf-5d58-4530-97ef-ab97dcbdb479', 'SIG-4F4AC8D742EE4D17', 'SIG-20260814-0002', 'Placa informativa', 'GOOD', 'ACTIVE', 'Rua São José')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('dd99d1ea-3f52-409f-9f85-151f1fa22d7c', 'SIG-8BDB3C55B1B04EEB', 'SIG-20260814-0003', 'Adesivo de piso', 'GOOD', 'DECOMMISSIONED', 'Adesivo de uma amarelinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5b7fb52a-b68f-4d5c-9af8-0182fa41852c', 'SIG-368881E4A1044C31', 'SIG-20260814-0004', 'Placa de emergência', 'GOOD', 'DECOMMISSIONED', 'Ambulatório ->')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f2204998-3fb1-438c-a219-eb7da715b89c', 'SIG-56206DD558764D80', 'SIG-20260814-0005', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo da loja')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c730658a-f2f2-4bd4-9f2e-360907bbf1d8', 'SIG-2717E8E2EE784026', 'SIG-20260814-0006', 'Placa informativa', 'GOOD', 'DECOMMISSIONED', 'Boas Vinda')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('bc0a6e7a-57bb-43b2-85fb-d410d712e83c', 'SIG-6057ADC3D09443B9', 'SIG-20260814-0007', 'Totem', 'GOOD', 'ACTIVE', 'Promoção mês dos Pais
Calendário Agosto
Em branco')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('90fa76e3-2985-40fe-b0a8-0634b009267d', 'SIG-6A417291FB094080', 'SIG-20260814-0008', 'Placa de serviço', 'GOOD', 'DECOMMISSIONED', 'Placa')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e0ee55d8-9442-4458-bd7e-c84b709cfcf2', 'SIG-45043890510B41A8', 'SIG-20260814-0009', 'Placa direcional', 'GOOD', 'DECOMMISSIONED', 'Okey')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('28601d3b-33f1-428d-8a18-4abba7cda1d2', 'SIG-E1DBF43D0C404C09', 'SIG-20260816-0001', 'Painel', 'GOOD', 'DECOMMISSIONED', 'Placa de comemoração aniversário')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('929587b8-e7dc-448b-8145-39d922fc14fa', 'SIG-F7C6394B32604F8C', 'SIG-20260816-0002', 'Placa de segurança', 'GOOD', 'ACTIVE', 'Placa de segurança porta')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b4ddcc76-4a00-42fc-926b-8e09cb9b6250', 'SIG-1E751170D66B4453', 'SIG-20260817-0001', 'Placa de setor', 'GOOD', 'ACTIVE', 'Setor Branco
Setor Azul')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e661299f-948a-4e55-ab3c-188e432101b1', 'SIG-0F7BCC40CC1A4813', 'SIG-20260817-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'RUA 25 DE MARÇO / AV. DOM MANUEL')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('50bbc307-0dc9-45fd-98f3-9289fd49d62b', 'SIG-DB2E0C95B81B4F14', 'SIG-20260817-0003', 'Placa informativa', 'GOOD', 'ACTIVE', 'Sanitários | Espaço Família | Saídas 
SETOR ROXO')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('51420751-85f2-451e-b5d9-038fd3b267d0', 'SIG-687A5E9B3ADA4B19', 'SIG-20260818-0001', 'Placa informativa', 'GOOD', 'ACTIVE', 'TEMOS CARRINHOS DISPONÍVEIS.
SETOR VERDE,
AO LADO DA ESTEIRA
ROLANTE.')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('93a5fc23-e3b0-45b3-a9df-cb7e95524fa4', 'SIG-2FB7461A5718469C', 'SIG-20260818-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'AV. PRES.
CASTELO BRANCO

RUA SENADOR
JAGUARIBE

SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e123bd36-0da0-4ca8-aa03-fc7c56ee00e9', 'SIG-BE4476B8FF0D4D7A', 'SIG-20260818-0003', 'Totem', 'GOOD', 'ACTIVE', 'Campanha mês dos Pais
Agenda de Agosto
Aniversário 9 anos')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', 'SIG-F7D9B2426BB94F1F', 'SIG-20260818-0004', 'Totem', 'GOOD', 'DECOMMISSIONED', 'Triedo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a7af05ec-4ae4-4224-b5a6-7757596340bd', 'SIG-233A0D3550B147AA', 'SIG-20260818-0005', 'Placa de rua', 'GOOD', 'ACTIVE', 'AV. PRES.
CASTELO BRANCO

RUA SENADOR
JAGUARIBE

SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c67ff5ff-9432-49fd-ad94-d636ceeebf83', 'SIG-DAF898ED310E4F05', 'SIG-20260819-0001', 'Placa de loja', 'GOOD', 'ACTIVE', '← Loja')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7e876aaf-98f3-4bb0-925d-91f6b9af9d1f', 'SIG-68C838AB7910487F', 'SIG-20260819-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa Doutor João Moreira')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9779630d-c01e-4ddb-af3a-8ae57bf72e47', 'SIG-026494A3EE9744DB', 'SIG-20260819-0003', 'Você Está Aqui', 'GOOD', 'ACTIVE', 'Você Está Aqui')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('832d0a5d-6c0f-404e-8f40-1744c305875e', 'SIG-2BAA0C4CA03E45DA', 'SIG-20260819-0004', 'Você Está Aqui', 'GOOD', 'ACTIVE', 'Você Está Aqui')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1db04fca-9cdf-4b2c-bd10-2f0c680693cb', 'SIG-DCF7CC474EF64D9C', 'SIG-20260819-0005', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Adesivo na parede')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('bd0869d0-1ad0-4bb7-af44-5e2b471eab1a', 'SIG-9DE6EAEB99064341', 'SIG-20260819-0006', 'Outra', 'GOOD', 'ACTIVE', 'Outdoor')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e1da24aa-2021-4615-9ee1-e50dd5279872', 'SIG-2E467F84A3E540EC', 'SIG-20260820-0001', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa de galeria')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0026d4f4-6f5b-439e-adb3-aa69177cdb3d', 'SIG-AAEABEB5A5F94850', 'SIG-20260820-0002', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('65bf2515-7e57-4d4c-81b8-23be4c662524', 'SIG-C078CA4037A04E8A', 'SIG-20260820-0003', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5ee02251-82a6-48e3-a7bc-330220f70649', 'SIG-2A9ACABBCAEB4943', 'SIG-20260820-0004', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('43dd7f9c-4e9a-49c6-bb88-9bf4b05324dc', 'SIG-2EAC7B1BAC214052', 'SIG-20260820-0005', 'Placa informativa', 'GOOD', 'ACTIVE', 'Placas de sinalização aérea em cubo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('de79b4a4-3d31-4f74-b4fd-f4ec7415f3ff', 'SIG-371D3BAA91EC4943', 'SIG-20260820-0006', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Jôely Jeans')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('19b2db88-1709-479a-8210-5c89b9c71c06', 'SIG-C78B30588EB64BA2', 'SIG-20260820-0007', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7ecc84d1-4553-4d1d-a370-771e57c05a90', 'SIG-852FC0FEE3234C41', 'SIG-20260820-0008', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('8165ebff-5803-424c-831a-ec8fe4bbad87', 'SIG-328C0B8D504E413C', 'SIG-20260820-0009', 'Triedo', 'GOOD', 'ACTIVE', 'Calendário agosto
Campanha 9 anos Centro Fashion
Campanha mês dos Pais')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7a01303d-fbf7-4ff2-a386-12652534e2a6', 'SIG-EBE53732B8564432', 'SIG-20260820-0010', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria F
1204 - 1168
Castro e Silva')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('483a37dd-af4a-4b61-90f1-10d5b7a4ff1c', 'SIG-E7EB24AE26D94E8C', 'SIG-20260820-0011', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Castro e Silva')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('34a291a5-b3f2-4683-9f2d-1136396a2973', 'SIG-1CB7C473877A4A58', 'SIG-20260820-0012', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria G
1160 - 1108
Senador Alencar')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3b6e6527-556d-4caa-866d-56edfda40ae4', 'SIG-F467117C4A6A41EC', 'SIG-20260820-0013', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Senador Alencar
SETOR VERDE
Visite o nosso quiosque')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('ad90f82a-b6f3-43fd-8619-26361eca253c', 'SIG-07C2469A27DF4B3B', 'SIG-20260820-0014', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Senador Alencar
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('8369c02e-9be1-45fe-b887-b9d33131273d', 'SIG-CC854FEB33824568', 'SIG-20260820-0015', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua São Paulo
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d5adf50c-4e9a-4876-b6a2-697aeeb2fa47', 'SIG-7632A4149E914654', 'SIG-20260820-0016', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua São Paulo
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7573e9dc-0311-4d49-b73d-84891ce579b3', 'SIG-3096DEA617D6496A', 'SIG-20260820-0017', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Laduna')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f40f146d-add8-414f-abf8-7ce188376892', 'SIG-3A510E83CF09484A', 'SIG-20260820-0018', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Laduna')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7cbd345d-b11e-46f3-9c77-bbebbbe24ea6', 'SIG-4F7297F586C44EE2', 'SIG-20260820-0019', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('19d0ba5c-e36b-4246-ac25-8c9265c2eba8', 'SIG-5ACDAD4309B448D2', 'SIG-20260820-0020', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Guilherme Rocha
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6cb82142-f2a6-48df-8565-95af2c8ac70d', 'SIG-C88D73BCB0764AC2', 'SIG-20260820-0021', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Guilherme Rocha
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('636d4329-a4c7-428f-9b60-c60e449994ce', 'SIG-632DE97A214A4277', 'SIG-20260820-0022', 'Totem', 'GOOD', 'ACTIVE', 'Setor Verde
Sanitários
Escada e Elevadores
Esteira Rolante')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c0979b52-b7d4-4ce8-8fc3-725ce065212b', 'SIG-687382674B7D4535', 'SIG-20260820-0023', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('50b237ec-d9c0-4489-9411-afafcde677bc', 'SIG-2F431A5D66F14D24', 'SIG-20260820-0024', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3831c7cf-e2c5-4a12-924e-b2801d36a89b', 'SIG-98E4A5BFEDDC407C', 'SIG-20260820-0025', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d4307f17-5cd3-4673-9b85-fb7be2ab1c55', 'SIG-456B57BD112A4020', 'SIG-20260820-0026', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('cde9e407-e8f7-4536-9bba-198bc447c7b2', 'SIG-6BD8076E0AF641A3', 'SIG-20260820-0027', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('974ac5a7-e269-4ae6-8eff-7895bdabcd31', 'SIG-8865C60073DD47AC', 'SIG-20260820-0028', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Pedro Pereira
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0a15bc69-1729-452a-ab98-2cafeeef3861', 'SIG-77864E2682A34C89', 'SIG-20260820-0029', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Dom Pedro I
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('cd8328e0-c87d-4293-9ea5-d2e73f018fa4', 'SIG-8B87A1B33B3448DC', 'SIG-20260820-0030', 'Outra', 'GOOD', 'ACTIVE', 'Balcão Brisanet')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c18c292b-3eaa-4e10-a207-9e3f3c0b159d', 'SIG-706CDE9B94694528', 'SIG-20260820-0031', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Dom Pedro I')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('4f645804-cb2e-496f-b80c-0bed913e2afd', 'SIG-E1C0439E1D4F41C6', 'SIG-20260821-0001', 'Outra', 'GOOD', 'ACTIVE', 'Campanha dos Pais')
ON CONFLICT (asset_code) DO NOTHING;

-- 4. FOTOS E MÍDIAS DE CAMPO
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b3eebcd1-8bba-49f0-9ba3-9771dae885d1', '17PZ7zj7mDP5OF2lbD6AetVCBoNxlwDxm', 'photos/migrated/SIG-20260814-0009_bad2913c.jpg', 'image/jpeg', 1024, 'b3eebcd18bba49f09ba39771dae885d1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e0ee55d8-9442-4458-bd7e-c84b709cfcf2', 'b3eebcd1-8bba-49f0-9ba3-9771dae885d1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b67185aa-986b-4483-870f-8c2941a73774', '1RL8f_u0Ciu9SKni7Ulc9n9suMDfI3BXr', 'photos/migrated/SIG-20260817-0001_0af60012.jpg', 'image/jpeg', 1024, 'b67185aa986b4483870f8c2941a73774')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b4ddcc76-4a00-42fc-926b-8e09cb9b6250', 'b67185aa-986b-4483-870f-8c2941a73774', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c07c6f76-fe46-45f9-9b01-f26692cc47ec', '1oOQO3y3nTzCQgiaSbQwViNSYc7rrimnp', 'photos/migrated/SIG-20260817-0001_999c8354.jpg', 'image/jpeg', 1024, 'c07c6f76fe4645f99b01f26692cc47ec')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b4ddcc76-4a00-42fc-926b-8e09cb9b6250', 'c07c6f76-fe46-45f9-9b01-f26692cc47ec', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7755fda2-ddde-45cd-bc6b-6596801cd0ab', '1r4VNa7m7m5sfcPFtgZxJ8hWqRhVKWugp', 'photos/migrated/SIG-20260817-0002_1c1bcd7a.jpg', 'image/jpeg', 1024, '7755fda2ddde45cdbc6b6596801cd0ab')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e661299f-948a-4e55-ab3c-188e432101b1', '7755fda2-ddde-45cd-bc6b-6596801cd0ab', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f2bc8e9b-ce76-484a-b7df-272bbb7f4017', '1SoQQuM83vK83IkM9Dt-avn08UemKyF7L', 'photos/migrated/SIG-20260817-0002_5a4d48a9.jpg', 'image/jpeg', 1024, 'f2bc8e9bce76484ab7df272bbb7f4017')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e661299f-948a-4e55-ab3c-188e432101b1', 'f2bc8e9b-ce76-484a-b7df-272bbb7f4017', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('45ca416f-a26f-49d5-9cdf-82f28e8bf112', '1wKCj87aFnTl6s0clFVj49LKjHpKSxD6_', 'photos/migrated/SIG-20260817-0003_18a80080.jpg', 'image/jpeg', 1024, '45ca416fa26f49d59cdf82f28e8bf112')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('50bbc307-0dc9-45fd-98f3-9289fd49d62b', '45ca416f-a26f-49d5-9cdf-82f28e8bf112', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('13dea850-0a8f-43ba-bf4a-05598b02ff05', '1_UHhHbo_HzvlAvBhFOoQ-OhMv2qNtRNg', 'photos/migrated/SIG-20260817-0003_e63fa3a9.jpg', 'image/jpeg', 1024, '13dea8500a8f43babf4a05598b02ff05')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('50bbc307-0dc9-45fd-98f3-9289fd49d62b', '13dea850-0a8f-43ba-bf4a-05598b02ff05', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('df03330c-d9eb-44da-9718-82cf867cd8fe', '1AxtcJRwkF_GLwTluk_87xyX2IBB8N0yK', 'photos/migrated/SIG-20260818-0001_9494371a.jpg', 'image/jpeg', 1024, 'df03330cd9eb44da971882cf867cd8fe')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('51420751-85f2-451e-b5d9-038fd3b267d0', 'df03330c-d9eb-44da-9718-82cf867cd8fe', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('954618b9-8b0f-4239-82cb-3115217d2cf8', '1UXv9Eg1os9agKQvNBlgwqC8-avUoyJ81', 'photos/migrated/SIG-20260818-0001_da8c5cc6.jpg', 'image/jpeg', 1024, '954618b98b0f423982cb3115217d2cf8')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('51420751-85f2-451e-b5d9-038fd3b267d0', '954618b9-8b0f-4239-82cb-3115217d2cf8', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('174a34aa-9054-49b8-a9af-53c26f937f67', '1r28TYe4b8JHfUrNlMrtV-utawOKwxqI2', 'photos/migrated/SIG-20260818-0001_da8c5cc6.jpg', 'image/jpeg', 1024, '174a34aa905449b8a9af53c26f937f67')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('51420751-85f2-451e-b5d9-038fd3b267d0', '174a34aa-9054-49b8-a9af-53c26f937f67', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8d122a07-c1d1-4059-b51c-13cd8b7df9e3', '1UbY4mZl59Eil2BSS5DTv-R1YkPL5UqpK', 'photos/migrated/SIG-20260818-0002_7880fdad.jpg', 'image/jpeg', 1024, '8d122a07c1d14059b51c13cd8b7df9e3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('93a5fc23-e3b0-45b3-a9df-cb7e95524fa4', '8d122a07-c1d1-4059-b51c-13cd8b7df9e3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('32b37700-9711-4682-9a5f-adcf013ca2fc', '1ERu2AQirl9JbLZXnMdmaqghQPo2DE8Gl', 'photos/migrated/SIG-20260818-0002_82e989cf.jpg', 'image/jpeg', 1024, '32b37700971146829a5fadcf013ca2fc')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('93a5fc23-e3b0-45b3-a9df-cb7e95524fa4', '32b37700-9711-4682-9a5f-adcf013ca2fc', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2d315360-ff64-45b4-a5ad-77f3ea3cb660', '1x9aXFUAhsZr2c8wheKGf9iqowXaCLDFy', 'photos/migrated/SIG-20260818-0003_05849a33.jpg', 'image/jpeg', 1024, '2d315360ff6445b4a5ad77f3ea3cb660')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e123bd36-0da0-4ca8-aa03-fc7c56ee00e9', '2d315360-ff64-45b4-a5ad-77f3ea3cb660', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('aaa37fa1-0cf0-45c1-9ef6-81626f59abfc', '1eayF_2K55R8lfeA6memb2hM-hm1m--3p', 'photos/migrated/SIG-20260818-0003_0be87f72.jpg', 'image/jpeg', 1024, 'aaa37fa10cf045c19ef681626f59abfc')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e123bd36-0da0-4ca8-aa03-fc7c56ee00e9', 'aaa37fa1-0cf0-45c1-9ef6-81626f59abfc', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('26b5e387-c333-4e19-800d-66e2f1de3874', '1tU9Y9oum8Oxi25VjhOgg1kOGDANwluMi', 'photos/migrated/SIG-20260818-0003_fe5d4cce.jpg', 'image/jpeg', 1024, '26b5e387c3334e19800d66e2f1de3874')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e123bd36-0da0-4ca8-aa03-fc7c56ee00e9', '26b5e387-c333-4e19-800d-66e2f1de3874', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9888ca8f-ae3f-4c5d-993a-7e3aa859468f', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, '9888ca8fae3f4c5d993a7e3aa859468f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '9888ca8f-ae3f-4c5d-993a-7e3aa859468f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0e8568a1-8d03-4f3a-95e9-730fbdc953ca', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, '0e8568a18d034f3a95e9730fbdc953ca')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '0e8568a1-8d03-4f3a-95e9-730fbdc953ca', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6ecb2958-c86e-41e1-ad93-1c5b28dd397b', '1Rwu20e6fqJwaUmXoY5mSiBUMCktnCobz', 'photos/migrated/SIG-20260818-0004_cff280f8.jpg', 'image/jpeg', 1024, '6ecb2958c86e41e1ad931c5b28dd397b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '6ecb2958-c86e-41e1-ad93-1c5b28dd397b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e0776d2b-d02c-4c03-b52d-e289036c57bd', '1KR9dAHiHUxex_Yu8R2bhUaeFU1acWYd-', 'photos/migrated/SIG-20260818-0003_INSP_aea99b51_07c46cc5.jpg', 'image/jpeg', 1024, 'e0776d2bd02c4c03b52de289036c57bd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e123bd36-0da0-4ca8-aa03-fc7c56ee00e9', 'e0776d2b-d02c-4c03-b52d-e289036c57bd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3f34e3ef-3c7f-4dff-b5f4-17240ffab2ea', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, '3f34e3ef3c7f4dffb5f417240ffab2ea')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '3f34e3ef-3c7f-4dff-b5f4-17240ffab2ea', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a9a5bf01-a07d-4380-8f44-6da827698085', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, 'a9a5bf01a07d43808f446da827698085')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', 'a9a5bf01-a07d-4380-8f44-6da827698085', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a0997a0c-e9cd-4c0e-8990-f3fbbd99311c', '1uZmZd3mbVC8QUl8rDLiNkrPR2Z4bMzQb', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_a63aa3a5.jpg', 'image/jpeg', 1024, 'a0997a0ce9cd4c0e8990f3fbbd99311c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', 'a0997a0c-e9cd-4c0e-8990-f3fbbd99311c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('df34f00a-af59-4668-a167-e4798a75e2f2', '1r5CmNzRU-BLjdblV5d0DRdPQGoyigSdi', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_4aa66a72.jpg', 'image/jpeg', 1024, 'df34f00aaf594668a167e4798a75e2f2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', 'df34f00a-af59-4668-a167-e4798a75e2f2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ec9a5e99-1c28-42b5-ac52-900567d496ed', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, 'ec9a5e991c2842b5ac52900567d496ed')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', 'ec9a5e99-1c28-42b5-ac52-900567d496ed', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4625c1f8-e866-45e3-ad1a-8209a3d1d023', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, '4625c1f8e86645e3ad1a8209a3d1d023')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '4625c1f8-e866-45e3-ad1a-8209a3d1d023', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('27cab70c-ef66-41bb-a14a-e586969f772f', '1r5CmNzRU-BLjdblV5d0DRdPQGoyigSdi', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_4aa66a72.jpg', 'image/jpeg', 1024, '27cab70cef6641bba14ae586969f772f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1c43be66-a6ab-4db6-b6c2-daec45934742', '27cab70c-ef66-41bb-a14a-e586969f772f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('82e112ca-c2ff-4533-8f5d-14a35facb5ed', '1eOFN2Ft0m6m3BAQ1SlWUkeAMl_POBJdC', 'photos/migrated/SIG-20260818-0005_63fd5e25.jpg', 'image/jpeg', 1024, '82e112cac2ff45338f5d14a35facb5ed')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a7af05ec-4ae4-4224-b5a6-7757596340bd', '82e112ca-c2ff-4533-8f5d-14a35facb5ed', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b707d067-a7a0-40f2-bf9e-f3eadfe6159f', '1AFMeQFQKdfamgJwC_zuClq1d16-k8Pgj', 'photos/migrated/SIG-20260818-0005_839a1c13.jpg', 'image/jpeg', 1024, 'b707d067a7a040f2bf9ef3eadfe6159f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a7af05ec-4ae4-4224-b5a6-7757596340bd', 'b707d067-a7a0-40f2-bf9e-f3eadfe6159f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0d9e3bac-4233-49bc-ac28-d8347bb480d7', '1z-ZKL3gOtvtplUv7QJx9s-ddwLO28fAD', 'photos/migrated/SIG-20260819-0001_f65fccdd.jpg', 'image/jpeg', 1024, '0d9e3bac423349bcac28d8347bb480d7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c67ff5ff-9432-49fd-ad94-d636ceeebf83', '0d9e3bac-4233-49bc-ac28-d8347bb480d7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e6f7d540-5697-4b0d-bed8-083e06b70525', '1gaicYz1rUyi0ofIUhsqhWR0WOIRylAKe', 'photos/migrated/SIG-20260819-0001_75251a84.jpg', 'image/jpeg', 1024, 'e6f7d54056974b0dbed8083e06b70525')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c67ff5ff-9432-49fd-ad94-d636ceeebf83', 'e6f7d540-5697-4b0d-bed8-083e06b70525', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0b042286-0a2e-433a-beb9-01f901b1dc6c', '1eV8yVScQlGvm8TqoO3DiTybg11l6o5-u', 'photos/migrated/SIG-20260819-0002_61338272.jpg', 'image/jpeg', 1024, '0b0422860a2e433abeb901f901b1dc6c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7e876aaf-98f3-4bb0-925d-91f6b9af9d1f', '0b042286-0a2e-433a-beb9-01f901b1dc6c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7c1712c1-d64c-477a-87c8-f2a9a8ce5632', '1TWiaf54uPCd994WfO-aeNnj5WkYbhj1r', 'photos/migrated/SIG-20260819-0002_803a8cd8.jpg', 'image/jpeg', 1024, '7c1712c1d64c477a87c8f2a9a8ce5632')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7e876aaf-98f3-4bb0-925d-91f6b9af9d1f', '7c1712c1-d64c-477a-87c8-f2a9a8ce5632', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a54ee347-f3b0-4823-b8fe-fc46e59d11bb', '1A5CeRjmxBxUdrAERk1SVbTUhBSlPbQJG', 'photos/migrated/SIG-20260819-0003_40aa7db1.jpg', 'image/jpeg', 1024, 'a54ee347f3b04823b8fefc46e59d11bb')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9779630d-c01e-4ddb-af3a-8ae57bf72e47', 'a54ee347-f3b0-4823-b8fe-fc46e59d11bb', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ebfadac2-7c7c-4713-959b-72d3f183daf4', '1KcppJZIX6rPezTjsP4Z6iBNvBnJpAPl_', 'photos/migrated/SIG-20260819-0004_33d3ab88.jpg', 'image/jpeg', 1024, 'ebfadac27c7c4713959b72d3f183daf4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('832d0a5d-6c0f-404e-8f40-1744c305875e', 'ebfadac2-7c7c-4713-959b-72d3f183daf4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('92676024-cfe5-46fe-917f-9526a5256f69', '1-rj35k1Q-mtebR2SZbzy8ZSACj3ve3lr', 'photos/migrated/SIG-20260819-0005_9b1e29cd.jpg', 'image/jpeg', 1024, '92676024cfe546fe917f9526a5256f69')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1db04fca-9cdf-4b2c-bd10-2f0c680693cb', '92676024-cfe5-46fe-917f-9526a5256f69', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('96f5efc8-518c-4ab0-b3c2-e6431dfaed29', '1-rj35k1Q-mtebR2SZbzy8ZSACj3ve3lr', 'photos/migrated/SIG-20260819-0005_9b1e29cd.jpg', 'image/jpeg', 1024, '96f5efc8518c4ab0b3c2e6431dfaed29')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1db04fca-9cdf-4b2c-bd10-2f0c680693cb', '96f5efc8-518c-4ab0-b3c2-e6431dfaed29', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f1f271d2-77e9-4e01-a5c1-fc74f2e554a1', '1rTS9Lg8pjjl8EHymACKFB0tPsptNagd-', 'photos/migrated/SIG-20260819-0005_INSP_d2185740_b8dcb5d8.jpg', 'image/jpeg', 1024, 'f1f271d277e94e01a5c1fc74f2e554a1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1db04fca-9cdf-4b2c-bd10-2f0c680693cb', 'f1f271d2-77e9-4e01-a5c1-fc74f2e554a1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4d572653-c082-45ac-bad6-c47807799eed', '1TjqK9j5-SPMovq-toam1NIcmgj5tSehC', 'photos/migrated/SIG-20260819-0006_00bab5c1.jpg', 'image/jpeg', 1024, '4d572653c08245acbad6c47807799eed')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('bd0869d0-1ad0-4bb7-af44-5e2b471eab1a', '4d572653-c082-45ac-bad6-c47807799eed', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3ecc9b67-d11a-49b3-af56-3f8a0fa3489a', '1i-ow59P0_5iKB_bDieq_DmjjtE5c615r', 'photos/migrated/SIG-20260819-0006_3be8914c.jpg', 'image/jpeg', 1024, '3ecc9b67d11a49b3af563f8a0fa3489a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('bd0869d0-1ad0-4bb7-af44-5e2b471eab1a', '3ecc9b67-d11a-49b3-af56-3f8a0fa3489a', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('978ade57-9de4-4eb0-a53a-99b4da784e61', '1Gv0PXc7sAylhjqqq2DnzRjsZRw39oD1a', 'photos/migrated/SIG-20260820-0001_f6a14e39.jpg', 'image/jpeg', 1024, '978ade579de44eb0a53a99b4da784e61')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e1da24aa-2021-4615-9ee1-e50dd5279872', '978ade57-9de4-4eb0-a53a-99b4da784e61', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('15a8fca6-2a23-4cb9-ae50-042b773c2487', '1lsFiStt6U4zgp_DRpTHJtbwhbrJTlNh-', 'photos/migrated/SIG-20260820-0002_35cd7300.jpg', 'image/jpeg', 1024, '15a8fca62a234cb9ae50042b773c2487')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0026d4f4-6f5b-439e-adb3-aa69177cdb3d', '15a8fca6-2a23-4cb9-ae50-042b773c2487', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('034c9d88-9718-4c16-8ab9-96af06eb70a1', '1keqkya5zbDhtYo8KOjD2bGUCVo8gkgVl', 'photos/migrated/SIG-20260820-0002_c4b48580.jpg', 'image/jpeg', 1024, '034c9d8897184c168ab996af06eb70a1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0026d4f4-6f5b-439e-adb3-aa69177cdb3d', '034c9d88-9718-4c16-8ab9-96af06eb70a1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('df1bd73f-8ede-4266-a820-d6bbc4d9b070', '1DCmdaLk7d_LK_lFiFo74cMFJExy0_foV', 'photos/migrated/SIG-20260820-0003_1a191aa8.jpg', 'image/jpeg', 1024, 'df1bd73f8ede4266a820d6bbc4d9b070')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('65bf2515-7e57-4d4c-81b8-23be4c662524', 'df1bd73f-8ede-4266-a820-d6bbc4d9b070', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('94ff30f0-9f11-4cb1-9cee-9a9051cae6e9', '1Px72Bnrupm0qWSd_qaSvmTr73gnpLu5u', 'photos/migrated/SIG-20260820-0003_734f2c33.jpg', 'image/jpeg', 1024, '94ff30f09f114cb19cee9a9051cae6e9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('65bf2515-7e57-4d4c-81b8-23be4c662524', '94ff30f0-9f11-4cb1-9cee-9a9051cae6e9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7d7c562f-118a-4788-b2a5-7f1539f1f895', '1KLqPxAuBfNiJdC5v3cLVIiy_F-T6E8in', 'photos/migrated/SIG-20260820-0004_40b88f61.jpg', 'image/jpeg', 1024, '7d7c562f118a4788b2a57f1539f1f895')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5ee02251-82a6-48e3-a7bc-330220f70649', '7d7c562f-118a-4788-b2a5-7f1539f1f895', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('397ee30a-d5f4-4ff2-b12b-270d4a5d7c96', '1ELaKfVACw1QQd6iHAQWzLzwxZsx3SoWF', 'photos/migrated/SIG-20260820-0004_72b244fe.jpg', 'image/jpeg', 1024, '397ee30ad5f44ff2b12b270d4a5d7c96')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5ee02251-82a6-48e3-a7bc-330220f70649', '397ee30a-d5f4-4ff2-b12b-270d4a5d7c96', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('45c35392-dbf7-448c-9b90-e5b01a494ce0', '1-9bDVMzmgmfobEUb5RSd8sP1tJt3MIZp', 'photos/migrated/SIG-20260820-0005_24d645b1.jpg', 'image/jpeg', 1024, '45c35392dbf7448c9b90e5b01a494ce0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('43dd7f9c-4e9a-49c6-bb88-9bf4b05324dc', '45c35392-dbf7-448c-9b90-e5b01a494ce0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0fec8b71-45d7-4c57-95c2-1c72307df5b2', '180T5R5ATA6gZlPoLel26PqD1HncIBZUP', 'photos/migrated/SIG-20260820-0005_da2f08da.jpg', 'image/jpeg', 1024, '0fec8b7145d74c5795c21c72307df5b2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('43dd7f9c-4e9a-49c6-bb88-9bf4b05324dc', '0fec8b71-45d7-4c57-95c2-1c72307df5b2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f55432e2-0e22-4efe-9eee-4c2f76f2b731', '1fFB6Sw7R4bDeEqmiFgJf7L8IjS5Yn9uS', 'photos/migrated/SIG-20260820-0006_42db19c8.jpg', 'image/jpeg', 1024, 'f55432e20e224efe9eee4c2f76f2b731')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('de79b4a4-3d31-4f74-b4fd-f4ec7415f3ff', 'f55432e2-0e22-4efe-9eee-4c2f76f2b731', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9e4965a2-5f93-426a-8d4a-29f20387a079', '1HaGTQ73tnPXRuyfyAG2pzVEgkpbkCKrx', 'photos/migrated/SIG-20260820-0007_f954201e.jpg', 'image/jpeg', 1024, '9e4965a25f93426a8d4a29f20387a079')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('19b2db88-1709-479a-8210-5c89b9c71c06', '9e4965a2-5f93-426a-8d4a-29f20387a079', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7e32c8e8-d4df-4644-89d8-33a3326a69cb', '1yJKlNDPEVqIg_6hBMPzdLRGvTzmv4FSA', 'photos/migrated/SIG-20260820-0008_191e290e.jpg', 'image/jpeg', 1024, '7e32c8e8d4df464489d833a3326a69cb')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7ecc84d1-4553-4d1d-a370-771e57c05a90', '7e32c8e8-d4df-4644-89d8-33a3326a69cb', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f5d52e82-eea8-470b-afce-923e7802de0d', '1wpHYI92Q_j73EL4GCawWysaWLG7cR2ft', 'photos/migrated/SIG-20260820-0009_f4db8e7e.jpg', 'image/jpeg', 1024, 'f5d52e82eea8470bafce923e7802de0d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8165ebff-5803-424c-831a-ec8fe4bbad87', 'f5d52e82-eea8-470b-afce-923e7802de0d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d058aa0f-7951-466f-8fe4-d40685438ae6', '1xblpydb0ewjeJspbNvk3OBfgPgC29e9P', 'photos/migrated/SIG-20260820-0009_0e83334e.jpg', 'image/jpeg', 1024, 'd058aa0f7951466f8fe4d40685438ae6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8165ebff-5803-424c-831a-ec8fe4bbad87', 'd058aa0f-7951-466f-8fe4-d40685438ae6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('945e09d3-df37-4778-941f-730c43212838', '12yjATJpj6guwwv1Grd_WQjppZGK1rDlb', 'photos/migrated/SIG-20260820-0009_c0438fdf.jpg', 'image/jpeg', 1024, '945e09d3df374778941f730c43212838')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8165ebff-5803-424c-831a-ec8fe4bbad87', '945e09d3-df37-4778-941f-730c43212838', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fb0e2307-bf58-42a8-b47a-4782bddadc69', '1Dkz5m7hyq04wIq54tvGwT4u-cgFrfuyQ', 'photos/migrated/SIG-20260820-0010_25c2a2d5.jpg', 'image/jpeg', 1024, 'fb0e2307bf5842a8b47a4782bddadc69')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7a01303d-fbf7-4ff2-a386-12652534e2a6', 'fb0e2307-bf58-42a8-b47a-4782bddadc69', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('882fb434-76a7-402e-bbe7-c391d59ea67c', '1CaylBzs3XKMx5wdXHPeWcA35lZi2dE4-', 'photos/migrated/SIG-20260820-0010_cd7c2116.jpg', 'image/jpeg', 1024, '882fb43476a7402ebbe7c391d59ea67c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7a01303d-fbf7-4ff2-a386-12652534e2a6', '882fb434-76a7-402e-bbe7-c391d59ea67c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9adf8f13-1252-4adc-bf2c-0d5729ba0eff', '1dro8pKuYImnm-0vFvq_DDducobB8jp_J', 'photos/migrated/SIG-20260820-0011_431f9e2f.jpg', 'image/jpeg', 1024, '9adf8f1312524adcbf2c0d5729ba0eff')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('483a37dd-af4a-4b61-90f1-10d5b7a4ff1c', '9adf8f13-1252-4adc-bf2c-0d5729ba0eff', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3c667c0c-4ef5-4463-b882-d28c63453ed4', '1REEnvUR-6m8nAB-JBDK7dtQl_DasQ3nC', 'photos/migrated/SIG-20260820-0012_a0143806.jpg', 'image/jpeg', 1024, '3c667c0c4ef54463b882d28c63453ed4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('34a291a5-b3f2-4683-9f2d-1136396a2973', '3c667c0c-4ef5-4463-b882-d28c63453ed4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('57560d75-6829-4d07-b08d-9c4b5eeecd4c', '1Vd1HctvPbjt3nJREnVhWfCRb_enrNkG3', 'photos/migrated/SIG-20260820-0012_ae8b891a.jpg', 'image/jpeg', 1024, '57560d7568294d07b08d9c4b5eeecd4c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('34a291a5-b3f2-4683-9f2d-1136396a2973', '57560d75-6829-4d07-b08d-9c4b5eeecd4c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0655824a-84ea-40bc-9bbd-de02a8186a68', '10Ea9ZeobQk5NvY6oDCUzlTHWeakKBICc', 'photos/migrated/SIG-20260820-0013_69e09953.jpg', 'image/jpeg', 1024, '0655824a84ea40bc9bbdde02a8186a68')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3b6e6527-556d-4caa-866d-56edfda40ae4', '0655824a-84ea-40bc-9bbd-de02a8186a68', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7d867921-f056-484f-b729-41ecedd05719', '1MELYrQn-wEfGEEgBhJmFOqkySQxJFaLj', 'photos/migrated/SIG-20260820-0013_efa1e408.jpg', 'image/jpeg', 1024, '7d867921f056484fb72941ecedd05719')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3b6e6527-556d-4caa-866d-56edfda40ae4', '7d867921-f056-484f-b729-41ecedd05719', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b01f9555-ee9b-46ed-897b-bcb1fcbf202b', '1ICb1_4eVJ5xk5snlfj6iTpkMAapd_nw5', 'photos/migrated/SIG-20260820-0014_f6b3b322.jpg', 'image/jpeg', 1024, 'b01f9555ee9b46ed897bbcb1fcbf202b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ad90f82a-b6f3-43fd-8619-26361eca253c', 'b01f9555-ee9b-46ed-897b-bcb1fcbf202b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c55f4fe1-be31-4603-8dc7-f1f7adf4f523', '17Y9EhA8eZfFs0UP_NmDHyx7ku_L35BPI', 'photos/migrated/SIG-20260820-0014_ec50f364.jpg', 'image/jpeg', 1024, 'c55f4fe1be3146038dc7f1f7adf4f523')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ad90f82a-b6f3-43fd-8619-26361eca253c', 'c55f4fe1-be31-4603-8dc7-f1f7adf4f523', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('48a8a16c-3e29-4d4a-8f4c-8ac4585f0067', '1ZgsBbLii0BWkcseW0vxYLKS8P-nKbaBd', 'photos/migrated/SIG-20260820-0015_b46edd0b.jpg', 'image/jpeg', 1024, '48a8a16c3e294d4a8f4c8ac4585f0067')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8369c02e-9be1-45fe-b887-b9d33131273d', '48a8a16c-3e29-4d4a-8f4c-8ac4585f0067', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2c09e8f5-74ed-4cb3-becc-6eac89e94691', '1yj1z_Z4ZWOnVzeYvV0e7kKTsrAOMNB-e', 'photos/migrated/SIG-20260820-0015_28e118b8.jpg', 'image/jpeg', 1024, '2c09e8f574ed4cb3becc6eac89e94691')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8369c02e-9be1-45fe-b887-b9d33131273d', '2c09e8f5-74ed-4cb3-becc-6eac89e94691', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5ceb44f2-2923-4642-b349-d436cfc77fd8', '1SWQdnztcilUv6pOUnUNd3gKSRcXtlWSB', 'photos/migrated/SIG-20260820-0016_fb1b794a.jpg', 'image/jpeg', 1024, '5ceb44f229234642b349d436cfc77fd8')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d5adf50c-4e9a-4876-b6a2-697aeeb2fa47', '5ceb44f2-2923-4642-b349-d436cfc77fd8', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f954d6bc-7049-4d96-9c01-ab422d32fdef', '1Kt8yT05XvZFTUz0JhqnmkgqA_szohk23', 'photos/migrated/SIG-20260820-0016_f9dba9d8.jpg', 'image/jpeg', 1024, 'f954d6bc70494d969c01ab422d32fdef')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d5adf50c-4e9a-4876-b6a2-697aeeb2fa47', 'f954d6bc-7049-4d96-9c01-ab422d32fdef', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8e081de2-ca73-4647-b609-211ba1d987ff', '13vt3CUgj0xUnmXdS1YIsWqwnvZR4BQJT', 'photos/migrated/SIG-20260820-0017_70b9489d.jpg', 'image/jpeg', 1024, '8e081de2ca734647b609211ba1d987ff')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7573e9dc-0311-4d49-b73d-84891ce579b3', '8e081de2-ca73-4647-b609-211ba1d987ff', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7dc0af25-18ce-4e1d-87e2-ce8fea805da1', '15EN7tVy_TAUmrIRAam3n70A1PJcfQ26g', 'photos/migrated/SIG-20260820-0017_ae66b1c6.jpg', 'image/jpeg', 1024, '7dc0af2518ce4e1d87e2ce8fea805da1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7573e9dc-0311-4d49-b73d-84891ce579b3', '7dc0af25-18ce-4e1d-87e2-ce8fea805da1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1356e18d-48a2-45a4-8fa4-c2aba82c0976', '1hj_vky2NiDrjvQamzP4F_JGXWj53FBLh', 'photos/migrated/SIG-20260820-0018_c433e05c.jpg', 'image/jpeg', 1024, '1356e18d48a245a48fa4c2aba82c0976')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f40f146d-add8-414f-abf8-7ce188376892', '1356e18d-48a2-45a4-8fa4-c2aba82c0976', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('beda8965-d0b6-436b-a0c4-58b4ed8f92c2', '1RQNI8p3pwwAurpQiMXDyFON_FvwtK3b6', 'photos/migrated/SIG-20260820-0018_905fec93.jpg', 'image/jpeg', 1024, 'beda8965d0b6436ba0c458b4ed8f92c2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f40f146d-add8-414f-abf8-7ce188376892', 'beda8965-d0b6-436b-a0c4-58b4ed8f92c2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9e5643b1-c18a-41b4-8b92-fc8a50899ad1', '1MKy--M-Hchs03cW-pXoF4C2Ea4k5rEJq', 'photos/migrated/SIG-20260820-0019_df6f25dc.jpg', 'image/jpeg', 1024, '9e5643b1c18a41b48b92fc8a50899ad1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7cbd345d-b11e-46f3-9c77-bbebbbe24ea6', '9e5643b1-c18a-41b4-8b92-fc8a50899ad1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f581510f-a694-48f6-8a82-204b90b575e8', '1FKIeRhEkXyRKwJ77xptgC4OR6ErKRFHR', 'photos/migrated/SIG-20260820-0019_a8504cfd.jpg', 'image/jpeg', 1024, 'f581510fa69448f68a82204b90b575e8')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7cbd345d-b11e-46f3-9c77-bbebbbe24ea6', 'f581510f-a694-48f6-8a82-204b90b575e8', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5d16987f-bfaf-4b0a-951e-10aa090908dd', '1gnLP1WexG4xHUmU7r51xhobJ_Livl-la', 'photos/migrated/SIG-20260820-0020_280bcba1.jpg', 'image/jpeg', 1024, '5d16987fbfaf4b0a951e10aa090908dd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('19d0ba5c-e36b-4246-ac25-8c9265c2eba8', '5d16987f-bfaf-4b0a-951e-10aa090908dd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6739d816-9678-4c3b-8c2c-72f914a648a3', '1PqpXbjyNPD98GgyhwYtLB7x4exdMJkj5', 'photos/migrated/SIG-20260820-0020_6db418e9.jpg', 'image/jpeg', 1024, '6739d81696784c3b8c2c72f914a648a3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('19d0ba5c-e36b-4246-ac25-8c9265c2eba8', '6739d816-9678-4c3b-8c2c-72f914a648a3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('bd7f7d6f-bf69-48c6-bcf9-6e8a182bea9b', '1SPUabdw4y3YZii5T8Ih1hWw-kJFrNZef', 'photos/migrated/SIG-20260820-0021_cab14312.jpg', 'image/jpeg', 1024, 'bd7f7d6fbf6948c6bcf96e8a182bea9b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6cb82142-f2a6-48df-8565-95af2c8ac70d', 'bd7f7d6f-bf69-48c6-bcf9-6e8a182bea9b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('42991ee1-b7fb-4112-a209-dde2dcf979c0', '1K_8xj6RQ7tizVe9TJq2Snv6LwJDiIN2Y', 'photos/migrated/SIG-20260820-0021_88b7ae3a.jpg', 'image/jpeg', 1024, '42991ee1b7fb4112a209dde2dcf979c0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6cb82142-f2a6-48df-8565-95af2c8ac70d', '42991ee1-b7fb-4112-a209-dde2dcf979c0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('bfe2dd25-e46c-45da-9deb-1f3e1d8e8233', '1ydZFJpYvax0IlvWbJCQxrctnimyWNBxE', 'photos/migrated/SIG-20260820-0022_f3acc395.jpg', 'image/jpeg', 1024, 'bfe2dd25e46c45da9deb1f3e1d8e8233')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('636d4329-a4c7-428f-9b60-c60e449994ce', 'bfe2dd25-e46c-45da-9deb-1f3e1d8e8233', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ad2fdd14-8ec2-414d-968d-ddedb98dc4ec', '1gx-TTZbYfgnXzdg9huidFCv4-F0BMpIu', 'photos/migrated/SIG-20260820-0023_316af4a0.jpg', 'image/jpeg', 1024, 'ad2fdd148ec2414d968dddedb98dc4ec')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c0979b52-b7d4-4ce8-8fc3-725ce065212b', 'ad2fdd14-8ec2-414d-968d-ddedb98dc4ec', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3e93532e-de0c-45b7-bf94-027f856c8724', '1cnCMN8fSNj7gqmS648U48O_D7uEaEs4b', 'photos/migrated/SIG-20260820-0023_d53e355b.jpg', 'image/jpeg', 1024, '3e93532ede0c45b7bf94027f856c8724')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c0979b52-b7d4-4ce8-8fc3-725ce065212b', '3e93532e-de0c-45b7-bf94-027f856c8724', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d0e78c60-9cd6-4e89-a172-81089f861e14', '1ZT4ZjUlemCSNxsAFjKq-eMktmMbA2WKl', 'photos/migrated/SIG-20260820-0024_883c7d88.jpg', 'image/jpeg', 1024, 'd0e78c609cd64e89a17281089f861e14')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('50b237ec-d9c0-4489-9411-afafcde677bc', 'd0e78c60-9cd6-4e89-a172-81089f861e14', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a862d87f-f00a-4276-963c-0054c575df65', '1xeWoK-ckOK7Nvn6wPH81raTQQgVoE3jh', 'photos/migrated/SIG-20260820-0024_8a8e5eee.jpg', 'image/jpeg', 1024, 'a862d87ff00a4276963c0054c575df65')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('50b237ec-d9c0-4489-9411-afafcde677bc', 'a862d87f-f00a-4276-963c-0054c575df65', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b492c6d1-cdc5-4c0d-a0a1-aecab9689e6a', '1VUP5eVMQCO5BsM8HXKUqqax6NpVReAvR', 'photos/migrated/SIG-20260820-0025_e4457aa1.jpg', 'image/jpeg', 1024, 'b492c6d1cdc54c0da0a1aecab9689e6a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3831c7cf-e2c5-4a12-924e-b2801d36a89b', 'b492c6d1-cdc5-4c0d-a0a1-aecab9689e6a', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5b3d541d-4e1e-4f2f-98f2-f6031a0e78a6', '1NJg6shRT3GIkztGlbl6iEQhKrhLWiT-a', 'photos/migrated/SIG-20260820-0025_21496aea.jpg', 'image/jpeg', 1024, '5b3d541d4e1e4f2f98f2f6031a0e78a6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3831c7cf-e2c5-4a12-924e-b2801d36a89b', '5b3d541d-4e1e-4f2f-98f2-f6031a0e78a6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('22765f06-52f0-46d6-8b0f-150885486073', '1YWVPm4IuX1IUTYwEabYR65uiOUWSSLah', 'photos/migrated/SIG-20260820-0026_7eb2511b.jpg', 'image/jpeg', 1024, '22765f0652f046d68b0f150885486073')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d4307f17-5cd3-4673-9b85-fb7be2ab1c55', '22765f06-52f0-46d6-8b0f-150885486073', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('73a24f01-74d5-48ae-928c-370c74fae4d6', '1FPF42qat1ex9AkRoeULm85kGyBlbipDl', 'photos/migrated/SIG-20260820-0026_7d4dd6f7.jpg', 'image/jpeg', 1024, '73a24f0174d548ae928c370c74fae4d6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d4307f17-5cd3-4673-9b85-fb7be2ab1c55', '73a24f01-74d5-48ae-928c-370c74fae4d6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f6a8bf5f-33ff-4248-8a2f-972f58d6a48d', '1g3JL2qKShHaolAnjWk9UeAB2xACEtnda', 'photos/migrated/SIG-20260820-0027_787c183a.jpg', 'image/jpeg', 1024, 'f6a8bf5f33ff42488a2f972f58d6a48d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cde9e407-e8f7-4536-9bba-198bc447c7b2', 'f6a8bf5f-33ff-4248-8a2f-972f58d6a48d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1032ecc6-368e-4b49-82c0-e1077226d0d6', '1sw9IjUnV39Pmcv19CTrhjqCF24xep0BX', 'photos/migrated/SIG-20260820-0027_732c4df9.jpg', 'image/jpeg', 1024, '1032ecc6368e4b4982c0e1077226d0d6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cde9e407-e8f7-4536-9bba-198bc447c7b2', '1032ecc6-368e-4b49-82c0-e1077226d0d6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('60f2ef89-8808-4a38-bb52-7c7bf906de41', '1FfMdbgj54aedkcOFcGi0srRGVMetYTgd', 'photos/migrated/SIG-20260820-0028_ad6969cf.jpg', 'image/jpeg', 1024, '60f2ef8988084a38bb527c7bf906de41')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('974ac5a7-e269-4ae6-8eff-7895bdabcd31', '60f2ef89-8808-4a38-bb52-7c7bf906de41', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ef0b0910-c191-4c6e-9e8b-c7c0c9e46dc8', '1arwtXg7na4tBb9yIniIeulmIvL5PWhoN', 'photos/migrated/SIG-20260820-0028_64f2afda.jpg', 'image/jpeg', 1024, 'ef0b0910c1914c6e9e8bc7c0c9e46dc8')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('974ac5a7-e269-4ae6-8eff-7895bdabcd31', 'ef0b0910-c191-4c6e-9e8b-c7c0c9e46dc8', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('834574f1-879e-4175-b96e-d07efb04fa34', '1AWMN_Kh5V8wCBz4lfTyvb6tDRdogFSfU', 'photos/migrated/SIG-20260820-0029_c5b9be53.jpg', 'image/jpeg', 1024, '834574f1879e4175b96ed07efb04fa34')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0a15bc69-1729-452a-ab98-2cafeeef3861', '834574f1-879e-4175-b96e-d07efb04fa34', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4a038178-5beb-4fef-b316-7de757d00124', '1hN5BWh3H4ncfOP770_SbM3nZ4jtPKzPO', 'photos/migrated/SIG-20260820-0030_ce8b4da3.jpg', 'image/jpeg', 1024, '4a0381785beb4fefb3167de757d00124')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cd8328e0-c87d-4293-9ea5-d2e73f018fa4', '4a038178-5beb-4fef-b316-7de757d00124', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('08149295-287e-41e1-83cf-ce7a0f6cae55', '1H1789U2OCA2R87BkD-u3Kz-2rWZXUMsL', 'photos/migrated/SIG-20260820-0030_20e59c13.jpg', 'image/jpeg', 1024, '08149295287e41e183cfce7a0f6cae55')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cd8328e0-c87d-4293-9ea5-d2e73f018fa4', '08149295-287e-41e1-83cf-ce7a0f6cae55', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d6ae17fd-c236-4e46-9902-fcb41b66e29d', '1bVEBN2w3Zw5gbUSEA44rTh5yoU7mtq9_', 'photos/migrated/SIG-20260820-0031_400ada14.jpg', 'image/jpeg', 1024, 'd6ae17fdc2364e469902fcb41b66e29d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c18c292b-3eaa-4e10-a207-9e3f3c0b159d', 'd6ae17fd-c236-4e46-9902-fcb41b66e29d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('157cfd4a-e00c-44b2-b7e4-5bd73f6e2b96', '1CHg9bA6qbUg1lUNZn7JfqerOwqtj-lQO', 'photos/migrated/SIG-20260820-0031_637c5ab0.jpg', 'image/jpeg', 1024, '157cfd4ae00c44b2b7e45bd73f6e2b96')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c18c292b-3eaa-4e10-a207-9e3f3c0b159d', '157cfd4a-e00c-44b2-b7e4-5bd73f6e2b96', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('efce4922-1137-404b-aee7-e70c4d946695', '1dnLZ_h_0qBUp5z1Zl6Xs5HAG-CyNRnbN', 'photos/migrated/SIG-20260821-0001_2a82d130.jpg', 'image/jpeg', 1024, 'efce49221137404baee7e70c4d946695')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('4f645804-cb2e-496f-b80c-0bed913e2afd', 'efce4922-1137-404b-aee7-e70c4d946695', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('12d154e4-5cf4-49f0-8d69-0da1adda9a4a', '1YzN_AK4wlEpumw1UU_ZWq7MvqyDx4QxI', 'photos/migrated/SIG-20260821-0001_b6372114.jpg', 'image/jpeg', 1024, '12d154e45cf449f08d690da1adda9a4a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('4f645804-cb2e-496f-b80c-0bed913e2afd', '12d154e4-5cf4-49f0-8d69-0da1adda9a4a', true)
ON CONFLICT DO NOTHING;
