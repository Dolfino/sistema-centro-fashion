-- ==============================================================================
-- DADOS DE SEED E MIGRAÇÃO DO LEGADO (MAPA - SINALIZAÇÃO DO MALL)
-- Gerado em: 2026-09-05T16:15:51.192680Z
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
INSERT INTO users (email, name, profile_role, active)
VALUES ('davidnascimentodasilva@gmail.com', 'David', 'ADMIN', true)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, profile_role = EXCLUDED.profile_role;

-- 3. SINALIZAÇÕES DE CAMPO (REGISTROS)
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('af56fc53-6b01-4a7a-9f0a-9974cb6b1a06', 'SIG-1D3E95FD449D431B', 'SIG-20260814-0001', 'Placa informativa', 'GOOD', 'DECOMMISSIONED', 'Rua General Bezerril')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('81a1e5cc-5946-4545-a023-9e0cbc3bc0e2', 'SIG-4F4AC8D742EE4D17', 'SIG-20260814-0002', 'Placa informativa', 'GOOD', 'DECOMMISSIONED', 'Rua São José')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('18c3bc3c-d00a-41e1-92a5-52ad21dd798e', 'SIG-8BDB3C55B1B04EEB', 'SIG-20260814-0003', 'Adesivo de piso', 'GOOD', 'DECOMMISSIONED', 'Adesivo de uma amarelinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('aff9e4af-9701-4492-8cd2-006f805ed0ae', 'SIG-368881E4A1044C31', 'SIG-20260814-0004', 'Placa de emergência', 'GOOD', 'DECOMMISSIONED', 'Ambulatório ->')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('34008f4f-e220-46b0-b73e-7e1bd9cc919b', 'SIG-56206DD558764D80', 'SIG-20260814-0005', 'Adesivo de piso', 'GOOD', 'DECOMMISSIONED', 'Adesivo da loja')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d91f593b-f207-4af0-a6ab-6a693f5f3da2', 'SIG-2717E8E2EE784026', 'SIG-20260814-0006', 'Placa informativa', 'GOOD', 'DECOMMISSIONED', 'Boas Vinda')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9a0fac1f-a6a4-415e-bdea-ab39845788c0', 'SIG-6057ADC3D09443B9', 'SIG-20260814-0007', 'Totem', 'GOOD', 'DECOMMISSIONED', 'Promoção mês dos Pais
Calendário Agosto
Em branco')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('91dc77e8-fe3e-4c77-aa8f-4902b41e59bd', 'SIG-6A417291FB094080', 'SIG-20260814-0008', 'Placa de serviço', 'GOOD', 'DECOMMISSIONED', 'Placa')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('17a07e91-6b3b-4aaf-9f1d-cc7df1a1a941', 'SIG-45043890510B41A8', 'SIG-20260814-0009', 'Placa direcional', 'GOOD', 'DECOMMISSIONED', 'Okey')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('992464ae-c78b-4e94-a05f-4d4c4f008f7f', 'SIG-E1DBF43D0C404C09', 'SIG-20260816-0001', 'Painel', 'GOOD', 'DECOMMISSIONED', 'Placa de comemoração aniversário')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b18abba0-791f-4076-9bb1-7f2ed422f347', 'SIG-F7C6394B32604F8C', 'SIG-20260816-0002', 'Placa de segurança', 'GOOD', 'ACTIVE', 'Placa de segurança porta')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a6fabd1f-73cb-4d6a-83e6-918be4d0ebbd', 'SIG-1E751170D66B4453', 'SIG-20260817-0001', 'Placa de setor', 'GOOD', 'DECOMMISSIONED', 'Setor Branco
Setor Azul')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3bf3bce2-6189-46d5-9cae-817ecb454f7f', 'SIG-0F7BCC40CC1A4813', 'SIG-20260817-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'RUA 25 DE MARÇO / AV. DOM MANUEL')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f3070f25-b0dd-4401-ace0-89561e85f5ad', 'SIG-DB2E0C95B81B4F14', 'SIG-20260817-0003', 'Placa informativa', 'GOOD', 'ACTIVE', 'Sanitários | Espaço Família | Saídas 
SETOR ROXO')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('24862f8b-8503-4471-a416-16610d0fb732', 'SIG-687A5E9B3ADA4B19', 'SIG-20260818-0001', 'Placa informativa', 'GOOD', 'ACTIVE', 'TEMOS CARRINHOS DISPONÍVEIS.
SETOR VERDE,
AO LADO DA ESTEIRA
ROLANTE.')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('176fcc88-f87f-442c-b260-1d880eb895a2', 'SIG-2FB7461A5718469C', 'SIG-20260818-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'AV. PRES.
CASTELO BRANCO

RUA SENADOR
JAGUARIBE

SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('8841b60b-2fb6-4fd2-8689-7a3115bee396', 'SIG-BE4476B8FF0D4D7A', 'SIG-20260818-0003', 'Totem', 'GOOD', 'ACTIVE', 'Campanha mês dos Pais
Agenda de Agosto
Aniversário 9 anos')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'SIG-F7D9B2426BB94F1F', 'SIG-20260818-0004', 'Totem', 'GOOD', 'DECOMMISSIONED', 'Triedo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2028780f-3963-4bd3-9f1b-d1e10269f4e9', 'SIG-233A0D3550B147AA', 'SIG-20260818-0005', 'Placa de rua', 'GOOD', 'ACTIVE', 'AV. PRES.
CASTELO BRANCO

RUA SENADOR
JAGUARIBE

SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('906f7c65-596a-4758-af98-0530d0ee7196', 'SIG-DAF898ED310E4F05', 'SIG-20260819-0001', 'Placa de loja', 'GOOD', 'ACTIVE', '← Loja')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('38580ec1-7373-4ac5-a21e-9ea4a81bfc94', 'SIG-68C838AB7910487F', 'SIG-20260819-0002', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa Doutor João Moreira')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3f8f587f-3d2b-454f-8349-2348a91b4b03', 'SIG-026494A3EE9744DB', 'SIG-20260819-0003', 'Você Está Aqui', 'GOOD', 'DECOMMISSIONED', 'Você Está Aqui')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c4a7ce3d-b842-49ce-8511-38dd35a39c80', 'SIG-2BAA0C4CA03E45DA', 'SIG-20260819-0004', 'Você Está Aqui', 'GOOD', 'DECOMMISSIONED', 'Você Está Aqui')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('fc0382d6-e616-4f1f-ae9c-a318191959d3', 'SIG-DCF7CC474EF64D9C', 'SIG-20260819-0005', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Adesivo na parede')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2a7f412f-82ff-4246-80d0-45518080c33e', 'SIG-9DE6EAEB99064341', 'SIG-20260819-0006', 'Outra', 'GOOD', 'ACTIVE', 'Outdoor')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('834be9e8-b999-47fc-bdc8-b1da6d5ced8a', 'SIG-2E467F84A3E540EC', 'SIG-20260820-0001', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa de galeria')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('8443b826-9de5-4c69-94d2-f4aae5b91c27', 'SIG-AAEABEB5A5F94850', 'SIG-20260820-0002', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9bcb96a5-1cff-4290-8234-568353b3a7bf', 'SIG-C078CA4037A04E8A', 'SIG-20260820-0003', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('dc7dfeaa-c270-410c-84f4-c0953bb599f9', 'SIG-2A9ACABBCAEB4943', 'SIG-20260820-0004', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('57cf18ad-8615-48dc-8e30-d7373861d0c3', 'SIG-2EAC7B1BAC214052', 'SIG-20260820-0005', 'Placa informativa', 'GOOD', 'ACTIVE', 'Placas de sinalização aérea em cubo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3b85162a-bad4-4729-94ee-4631601c5c85', 'SIG-371D3BAA91EC4943', 'SIG-20260820-0006', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Jôely Jeans')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5721774f-e284-411c-8ade-018df217c7aa', 'SIG-C78B30588EB64BA2', 'SIG-20260820-0007', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('04f6d2ae-ad82-4ddc-a4d1-4fbe8a4a57f8', 'SIG-852FC0FEE3234C41', 'SIG-20260820-0008', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a9ed79f6-a350-4ba4-9093-b4b7382d663a', 'SIG-328C0B8D504E413C', 'SIG-20260820-0009', 'Triedo', 'GOOD', 'ACTIVE', 'Calendário agosto
Campanha 9 anos Centro Fashion
Campanha mês dos Pais')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('4f64d946-3e60-422a-933a-7ebc44510983', 'SIG-EBE53732B8564432', 'SIG-20260820-0010', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria F
1204 - 1168
Castro e Silva')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('492eeba6-77fb-417d-a68c-67472d15eda9', 'SIG-E7EB24AE26D94E8C', 'SIG-20260820-0011', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Castro e Silva')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f8efb7bb-366f-437b-bca7-e7f0288c51f0', 'SIG-1CB7C473877A4A58', 'SIG-20260820-0012', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria G
1160 - 1108
Senador Alencar')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('cf56b37e-1f37-4f79-9058-5f9c12f6a254', 'SIG-F467117C4A6A41EC', 'SIG-20260820-0013', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Senador Alencar
SETOR VERDE
Visite o nosso quiosque')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e1c0e7e7-5e32-46a4-a1bd-ba9ea8c67a8f', 'SIG-07C2469A27DF4B3B', 'SIG-20260820-0014', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Senador Alencar
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('884dfaec-2ec5-4ac9-89af-f17d86b9cc3f', 'SIG-CC854FEB33824568', 'SIG-20260820-0015', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua São Paulo
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c4c7c658-cfd4-4ed6-b64b-bb90201d8df2', 'SIG-7632A4149E914654', 'SIG-20260820-0016', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua São Paulo
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('51bab845-df60-46a7-b2ec-f522fe184a14', 'SIG-3096DEA617D6496A', 'SIG-20260820-0017', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Laduna')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('93fa44ed-7d4c-4cd9-95d8-c7e30c292c17', 'SIG-3A510E83CF09484A', 'SIG-20260820-0018', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Laduna')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('150f431d-6c53-4a52-9225-b0375bcd126b', 'SIG-4F7297F586C44EE2', 'SIG-20260820-0019', 'Sinalização temporária', 'GOOD', 'ACTIVE', 'Dona de mim')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('024948cf-916b-4933-8112-c0d5ce98a5d7', 'SIG-5ACDAD4309B448D2', 'SIG-20260820-0020', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Guilherme Rocha
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a86c6293-2585-4b09-8a92-7e9cbffa0dcc', 'SIG-C88D73BCB0764AC2', 'SIG-20260820-0021', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Guilherme Rocha
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('49e7dc9c-d2ce-480a-ad0a-c6b6523d0faf', 'SIG-632DE97A214A4277', 'SIG-20260820-0022', 'Totem', 'GOOD', 'ACTIVE', 'Setor Verde
Sanitários
Escada e Elevadores
Esteira Rolante')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('719441ca-d8bd-4456-bf0e-288f48aeddd5', 'SIG-687382674B7D4535', 'SIG-20260820-0023', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('23399c92-ca16-4725-aebb-aeb1c74fb858', 'SIG-2F431A5D66F14D24', 'SIG-20260820-0024', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9482ab14-9e63-4cd9-80b3-caa7acd9c50d', 'SIG-98E4A5BFEDDC407C', 'SIG-20260820-0025', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('41d084a9-23ca-4ea0-aa33-4d378cce9f33', 'SIG-456B57BD112A4020', 'SIG-20260820-0026', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('48e8b555-e93c-4255-9c9e-97379df73713', 'SIG-6BD8076E0AF641A3', 'SIG-20260820-0027', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Liberato Barroso')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b74f7c98-00a1-47b0-a9d4-9d198aa1222e', 'SIG-8865C60073DD47AC', 'SIG-20260820-0028', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Pedro Pereira
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('82afafcf-aed2-4082-b224-30704419e357', 'SIG-77864E2682A34C89', 'SIG-20260820-0029', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Dom Pedro I
SETOR VERDE')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c0b923af-7060-4d2e-bb03-f19c60fb2c5b', 'SIG-8B87A1B33B3448DC', 'SIG-20260820-0030', 'Outra', 'GOOD', 'ACTIVE', 'Balcão Brisanet')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5cf65432-d846-45d2-9048-510532a94076', 'SIG-706CDE9B94694528', 'SIG-20260820-0031', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Dom Pedro I')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1006e399-98c0-4ad5-8e54-213527a43e32', 'SIG-E1C0439E1D4F41C6', 'SIG-20260821-0001', 'Outra', 'GOOD', 'ACTIVE', 'Campanha dos Pais')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9e8d40f6-8ba7-424e-a23a-c75126fbce4d', 'SIG-38375E1BBF934164', 'SIG-20260824-0001', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d0b189f4-e4be-4578-8c08-86b81c2f19ff', 'SIG-71349E5916EA44CE', 'SIG-20260824-0002', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa numeração box')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('495a67a2-f18a-471e-a602-1412f341343f', 'SIG-E4025337D1944177', 'SIG-20260824-0003', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria M
1160 - 1108
Duque de Caxias')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9fd27e30-5f68-4cf3-b969-36c5b902a342', 'SIG-B4F9889208934B9C', 'SIG-20260824-0004', 'Placa de rua', 'GOOD', 'ACTIVE', 'Av. Duque de Caxias')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2603a2ee-01b7-4478-981d-c838c1376729', 'SIG-E1B512F52DE54057', 'SIG-20260824-0005', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Farmácia
Elevador
Sanitário
Av. Filomeno Gomes')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('78e604ba-9d70-4281-ade5-a5ef7dfdc42d', 'SIG-F102C333ACFF4918', 'SIG-20260824-0006', 'Placa de rua', 'GOOD', 'ACTIVE', 'Av. Duque de Caxias')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5b699fd6-c754-4275-8bd7-293e60cdba76', 'SIG-C1F97B731B874DB8', 'SIG-20260824-0007', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Clarindo de Queiroz')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f373c938-0509-4faf-885f-0f50ca4a359f', 'SIG-813CABEF0F244AC6', 'SIG-20260824-0008', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('516a6579-ee76-40d0-90b5-720e0da8cf2d', 'SIG-13B852124626473F', 'SIG-20260824-0009', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Campanha 9 anos Centro Fashion')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d18cb45f-d3b2-42ed-be46-17b9463094b1', 'SIG-5592B4E40382482E', 'SIG-20260824-0010', 'Banner', 'GOOD', 'ACTIVE', 'Achadinhos')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('99634f8d-9814-4175-99bc-59975856adc7', 'SIG-C662CFACF81247F0', 'SIG-20260824-0011', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Clarindo de Queiroz')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0cc6f2db-387a-4d82-bc6b-616829752afe', 'SIG-847BABD48C314513', 'SIG-20260824-0012', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Central de Operações
Primeiros Socorros')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('54d973a5-e730-4666-9d74-6eb22c7af727', 'SIG-42B0F2C0ABA541C6', 'SIG-20260824-0013', 'Placa informativa', 'GOOD', 'ACTIVE', 'Central de Operações
Primeiros socorros
Lojas')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f229eae7-6e80-47d2-b6b2-8b9c48c4c355', 'SIG-D45CFAC5FA8F48E4', 'SIG-20260824-0014', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa direcional')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('697d399e-9c95-4064-bbdd-cadd9c37c4a2', 'SIG-769F89924915497F', 'SIG-20260824-0015', 'Placa de loja', 'GOOD', 'ACTIVE', 'Lojas')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('39256188-dde0-4c91-b776-823b765147ac', 'SIG-DEF7575992714EBB', 'SIG-20260824-0016', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Meton de Alencar
Rua Antônio Pompeu')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a9235d94-3f57-46a5-82eb-7648dbd91813', 'SIG-9F388D87BEE944BA', 'SIG-20260824-0017', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Placa informativa')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e5cb55f2-8dab-4bb8-a725-40dce669b324', 'SIG-49510FA8BA12474E', 'SIG-20260824-0018', 'Painel', 'GOOD', 'ACTIVE', 'Setor Azul
Sanitários
Escadas
Esteira rolante')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0296606d-a1f8-4f5b-84b3-f8c4cca744d7', 'SIG-DC7A035C65E945BE', 'SIG-20260824-0019', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Placa de serviços')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b7f53a4f-1707-4c10-afd0-1932daa42c32', 'SIG-50ACEE8A6F5742D8', 'SIG-20260824-0020', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Placa de serviços')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('15dc4056-4077-479d-803e-f00a9f104343', 'SIG-3D69D8A471764442', 'SIG-20260824-0021', 'Placa informativa', 'GOOD', 'DECOMMISSIONED', 'Chuveiro')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7b60406d-1f39-4c55-a97a-f40335eaa3bb', 'SIG-B3015AD0822B4FA5', 'SIG-20260824-0022', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Adesivo na parede')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('04e44e3a-dd04-4d43-b05a-67448461cb38', 'SIG-98AA6B9F73394884', 'SIG-20260824-0023', 'Placa de rua', 'GOOD', 'ACTIVE', 'Rua Princesa Isabel')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('81342d2e-782f-4bae-9710-68a4435d45b3', 'SIG-9DA3F349B39B41D6', 'SIG-20260824-0024', 'Placa informativa', 'GOOD', 'ACTIVE', 'Placa direcional')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9440611a-b6de-4456-8abf-30f3c4cc029e', 'SIG-177080D0AA3D45C8', 'SIG-20260825-0001', 'Banner', 'GOOD', 'DECOMMISSIONED', 'Banner')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('fa8f84b0-87b0-41ea-87a6-a174d0b3ff98', 'SIG-4322938D45E24A0C', 'SIG-20260825-0002', 'Adesivo de piso', 'GOOD', 'DECOMMISSIONED', 'Adesivo Direciional')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('fa80c701-35d6-4543-b011-24a3f1d91e19', 'SIG-C2F06C8960AF491F', 'SIG-20260826-0001', 'Adesivo de piso', 'GOOD', 'DECOMMISSIONED', 'Adesivo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e3649e83-0945-49db-bf83-e3551befb1c6', 'SIG-40F4AB303EF440FB', 'SIG-20260826-0002', 'Adesivo de parede', 'GOOD', 'DECOMMISSIONED', 'Adesivo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d838974d-a976-4fdd-9a5d-f3462d9bc0f4', 'SIG-1D444E688DC1446A', 'SIG-20260826-0003', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Adesivo Loja SIGA')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('92aeddef-5ffb-4b47-80e1-a119e9240ba0', 'SIG-597ECE10809A471F', 'SIG-20260827-0001', 'Placa de sinalização', 'GOOD', 'ACTIVE', 'BANHOS
EXCLUSIVOS
PARA LOJISTAS')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1aa09d48-38dc-4161-a8e6-0902eea791cd', 'SIG-A63D39F047B34BD0', 'SIG-20260827-0002', 'Panfleto', 'GOOD', 'ACTIVE', 'Panfleto Achadinho')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6ccdaa14-7c04-4eea-acc8-f9f255f23923', 'SIG-E9C740CB7E3D4A07', 'SIG-20260827-0003', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Festo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2ac53bae-c84a-4cec-9e2b-ef575d1a14c8', 'SIG-AE6C01F1DB58412C', 'SIG-20260827-0004', 'Metalon & Lona', 'GOOD', 'ACTIVE', 'Estrutura com Lona Loja')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c6dc4d42-2c23-4de5-b13c-d275dd89c9c6', 'SIG-0BD9ABEFFFDE478F', 'SIG-20260827-0005', 'Triedo', 'GOOD', 'ACTIVE', 'Triedo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9171efdf-cde4-4970-9771-da87e34fa253', 'SIG-C35255A3BF4140DB', 'SIG-20260830-0001', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e1329028-a399-48fd-b5d7-0c51741e1882', 'SIG-87DA306BC79D4653', 'SIG-20260830-0002', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('32fc3e32-7a82-480a-803b-6016d8c6f8cd', 'SIG-38F337388F564381', 'SIG-20260830-0003', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('85c47396-1df5-49f9-a93e-0116dba97050', 'SIG-74137E17F35246FE', 'SIG-20260830-0004', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('bdbe1801-31b7-4da7-b358-218371de3534', 'SIG-269F6BE3F152427A', 'SIG-20260830-0005', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7f4435bd-c3c7-4ff9-98d4-33b20d9645f2', 'SIG-1073443D7F114291', 'SIG-20260830-0006', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('63fe6146-cc7a-49f5-8332-ad8724b5cb92', 'SIG-27FE019C03384D6C', 'SIG-20260830-0007', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('256e1e0d-5bf4-4dba-a2e3-5069ceb9af64', 'SIG-75451EE229804938', 'SIG-20260830-0008', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('991203af-25e2-4e3a-a1a5-e10d998d27d2', 'SIG-58B24ADC531643EC', 'SIG-20260830-0009', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('9be3d3d7-9a8f-4d3e-acd0-f4bf286d4014', 'SIG-CC4839BDD4024BFA', 'SIG-20260830-0010', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3f3ef318-66d2-4f7c-b2b9-ab89eb5deb61', 'SIG-E1AAE48420A5486B', 'SIG-20260830-0011', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('adf5da28-655b-4c40-b6da-2464e7451bd8', 'SIG-8BA9DD7FC58746BE', 'SIG-20260830-0012', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('51eddc72-4361-4d2d-9c72-73de01a3998b', 'SIG-C09193AE3E7C41F6', 'SIG-20260830-0013', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a73dea68-cd0a-4ea2-aace-f96507fca5b3', 'SIG-225AA5E3CF52446D', 'SIG-20260830-0014', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('be1ecba0-5b9f-4518-8dae-23b012ed4cce', 'SIG-426B9C641A5445F1', 'SIG-20260830-0015', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c3eb016f-8a2c-4a27-9f2a-adcc54610f40', 'SIG-F56779E01E4E4D64', 'SIG-20260830-0016', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6b633c52-36f3-4e16-a1b5-c08b4b04b620', 'SIG-3895343D3C114658', 'SIG-20260830-0017', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('05073272-fe6d-4393-b953-5be1fd925d56', 'SIG-44E2AFC7250B4B64', 'SIG-20260830-0018', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c183620e-9b4f-4007-904d-b95e7baf72fe', 'SIG-47CDB13DCCE14D57', 'SIG-20260830-0019', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('556c113f-a3fd-4391-8fcd-554b74d01e28', 'SIG-64D0B29F74BB450D', 'SIG-20260830-0020', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('fb805df6-ceb4-42f8-9164-92d3e87fe794', 'SIG-947747A3DE9342F6', 'SIG-20260830-0021', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('4f8e0a69-ea1c-40b1-9ba2-e202261c5032', 'SIG-3F1AB965BDA74FAC', 'SIG-20260830-0022', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b38b9850-240b-44ff-a3f4-f39dc4a4e221', 'SIG-09C994A01D0A4462', 'SIG-20260830-0023', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('871357d2-6fb2-4d98-ba21-3698b3d33f6b', 'SIG-5E4CB4174A094498', 'SIG-20260830-0024', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6819564f-7a46-4833-80c0-1fcc0ddc2553', 'SIG-9AE4CDD93D634AA3', 'SIG-20260830-0025', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1b62bec4-c784-45e6-bb15-780f1607ed0e', 'SIG-4BB208ED3A934877', 'SIG-20260830-0026', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0011e320-645a-4ceb-87a9-d9baf08403d3', 'SIG-4FDA49611C6A4F1E', 'SIG-20260830-0027', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('b279e75b-89ad-4fdd-92db-e4595cf3a397', 'SIG-9A8FE6D0BB7149CE', 'SIG-20260830-0028', 'PLACA', 'GOOD', 'DECOMMISSIONED', 'REGISTRO E2E CONCORRENCIA — pode remover')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('90f43b77-d355-4ae8-8389-712dcb2d5d8b', 'SIG-DFB0782E4FB34378', 'SIG-20260831-0001', 'Placa de rua', 'GOOD', 'ACTIVE', 'Av. do Imperador')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c33996e1-64c5-4eb0-8083-84e848d4709f', 'SIG-F6D5FEBFDEE14E30', 'SIG-20260831-0002', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria B
1163 - 1196
Avenida do Imperador')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e2876209-bfb9-4e6e-9735-c50728d64e5f', 'SIG-7349BCF2082D48F9', 'SIG-20260831-0003', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria B
1106 - 1156
 Avenida do Imperador')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('8f07dc09-0cd4-47be-b8f3-3a3ccb20c5b2', 'SIG-2C66F3AD88AC4C0E', 'SIG-20260831-0004', 'Placa informativa', 'GOOD', 'ACTIVE', 'Guichê de estacionamento
Estacionamento
Elevador | Sanitários
Hotel Centro Faschion')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6408de1a-324a-4be4-b9ff-2a07078a311e', 'SIG-99BAF2C38D7B471E', 'SIG-20260831-0005', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Galeria A
1101 - 1157
Princesa Isabel')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('bda47682-f10e-4b0a-9c10-c4d178af0901', 'SIG-0747C61425B04B7C', 'SIG-20260831-0006', 'Outra', 'GOOD', 'ACTIVE', 'Almoxerifado')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2a4f79da-d7ac-4f4d-b6ea-bd0fdf7f6952', 'SIG-8F5B664F23AB49E0', 'SIG-20260831-0007', 'Outra', 'GOOD', 'ACTIVE', 'Laduna')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0ae1eeb9-60a1-4982-99f3-37e0a9d42cdf', 'SIG-B3462B8EB244484C', 'SIG-20260831-0008', 'Painel', 'GOOD', 'ACTIVE', 'Loterias
Super Sorte')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5aa3bdb7-89dc-448e-b890-48287705ba13', 'SIG-76473FCCE9A94E91', 'SIG-20260831-0009', 'Metalon & Lona', 'GOOD', 'ACTIVE', 'Informações comercial')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('d5864e7c-3da3-41b0-91b6-567e3d09abfd', 'SIG-6392C744EF334270', 'SIG-20260831-0010', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Cabine Pagamento')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('bad56f88-b8a4-46cb-b1b8-ab0b3e8120ba', 'SIG-B5C48FA8D14E4DE7', 'SIG-20260831-0011', 'Painel', 'GOOD', 'ACTIVE', 'Informativo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('43aa11f2-ae51-4c25-9202-55673da26862', 'SIG-F145FEA562A1465D', 'SIG-20260831-0012', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Loteria
Super Sorte')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('450153cc-f13f-4b1d-bbc2-5bc168f4bb1e', 'SIG-38EB3182CE6C4086', 'SIG-20260831-0013', 'Metalon & Lona', 'GOOD', 'ACTIVE', 'Temos carrinhos disponíveis')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('7665ef1d-e4f6-450b-a325-97a2ca2ef7ec', 'SIG-D1A9E913F9EC44F4', 'SIG-20260831-0014', 'Placa de rua', 'GOOD', 'ACTIVE', 'Av. Dom Manuel
Rua 25 de Março')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e7097c4e-aae1-40e0-9f4a-6bc792d9fbec', 'SIG-1A824D265D9F4A6A', 'SIG-20260831-0015', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'É expressamente proida a prática')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6ca96caf-e4e4-4158-a578-4f92d307fdcd', 'SIG-D4BEE5C4ACAA4AA2', 'SIG-20260831-0016', 'Placa de rua', 'GOOD', 'ACTIVE', 'Av. Dom Manuel
Rua 25 de Março')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2e3bc11b-5a0f-4eb1-954e-3e6d3ba3abd0', 'SIG-0EDDD0D6471340B5', 'SIG-20260831-0017', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Guichês de estacionamento
Estacionamento
Hotel Centro Fashion
Saída Adriano Martins
Saída Tenente Lisboa')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3dc8bc57-acd2-4455-af9c-351eb2060908', 'SIG-37ADCB84E0094768', 'SIG-20260831-0018', 'Totem', 'GOOD', 'ACTIVE', 'Placa Totem')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('55baadb7-eb96-452c-9694-d2d0b7549467', 'SIG-3D7E7FBC634F4274', 'SIG-20260831-0019', 'Painel', 'GOOD', 'ACTIVE', 'Acesso CDM')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('91a988bd-0942-4c30-8d0e-55e03b50e282', 'SIG-5B994514ABEC4CAE', 'SIG-20260831-0020', 'Placa informativa', 'GOOD', 'ACTIVE', 'Conhece o Centro Fashion')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('c9724615-2872-4196-9570-7340f68f93a6', 'SIG-5A465709DF03474D', 'SIG-20260831-0021', 'Totem', 'GOOD', 'ACTIVE', 'Banheiros
Quiosques Alimentação')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('ed8cca96-f30f-4648-905c-9e14d43eeb8e', 'SIG-EDC1D2F19F524C04', 'SIG-20260831-0022', 'Placa de setor', 'GOOD', 'ACTIVE', 'Acesso Pedestres
CDM
Centro de
Distribuição de 
Maercadorias')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('e222fe62-566f-4d92-85ec-f306a091bc55', 'SIG-089A5A7E9C1B4FED', 'SIG-20260831-0023', 'Outra', 'GOOD', 'ACTIVE', 'Logo Centro Fashion')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f757b501-db5e-4eab-8a78-8b206a729e37', 'SIG-11FD5332FAEE4D1A', 'SIG-20260831-0024', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('ab40690d-2a00-4816-8cff-4f228d211229', 'SIG-D41E90A89C8D4A67', 'SIG-20260831-0025', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('1072001a-9d7d-4fdc-b47f-77cd14b2302f', 'SIG-E2197763AC004CBD', 'SIG-20260831-0026', 'Adesivo de piso', 'GOOD', 'ACTIVE', 'Adesivo cirandinha')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('942ebd87-5b55-4696-9354-37a3d67e521f', 'SIG-B2B2CE5E46A647DA', 'SIG-20260831-0027', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa de galeria')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('fbe86c9c-7c84-41f2-9ed1-da856b16345c', 'SIG-222F85AE9C794B39', 'SIG-20260831-0028', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('f1e2197a-a02d-4ed6-8d18-0f896763c8ce', 'SIG-C8BF976A7E6C4A7E', 'SIG-20260831-0029', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa de galeria')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('0d2aef6b-740b-4932-ad98-7333e85fc7fd', 'SIG-95B5875806AC4584', 'SIG-20260831-0030', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('3c01defa-d6b2-481e-bc79-5ace88299339', 'SIG-AA57CE448F2A4CD1', 'SIG-20260831-0031', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2a82ca66-73a9-4431-9527-707dc19d8683', 'SIG-6A0CF71D974B476F', 'SIG-20260831-0032', 'Panfleto', 'GOOD', 'ACTIVE', 'Panfleto')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('5aef456b-6d36-4095-877c-86a1c97ba9b8', 'SIG-A43C1A2DB8DD4D5A', 'SIG-20260831-0033', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6ee5f467-cb32-4023-b930-3d8470ac833e', 'SIG-637074A20CBD4A35', 'SIG-20260831-0034', 'Placa de galeria', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('a9a4444e-32c0-480d-b901-94f70a42f57f', 'SIG-2746F3426B0B48DA', 'SIG-20260831-0035', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('58653964-e548-4bc7-80b4-df266296809a', 'SIG-FB47E32041B441DA', 'SIG-20260831-0036', 'Adesivo de parede', 'GOOD', 'ACTIVE', 'Adesivo')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2d3f1951-2414-4896-8ae2-2e57ae58d4f9', 'SIG-909816F9A2E14B3D', 'SIG-20260831-0037', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Placa de serviços')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('26bbcfdb-b45d-47e2-84bf-e048bbbcf244', 'SIG-9937783C7B01404E', 'SIG-20260831-0038', 'Placa de serviço', 'GOOD', 'ACTIVE', 'Placa de serviços')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('2907c1d6-5139-4ad8-b2c7-76827984a086', 'SIG-78E2CDAB9A744025', 'SIG-20260831-0039', 'Banner', 'GOOD', 'ACTIVE', 'Empoderada
Plus')
ON CONFLICT (asset_code) DO NOTHING;
INSERT INTO signage_assets (id, legacy_id, asset_code, category, conservation_status, lifecycle_status, notes)
VALUES ('6f86fadd-d84d-4ab0-8745-90e213452808', 'SIG-1B1BB102D9484749', 'SIG-20260831-0040', 'Placa de rua', 'GOOD', 'ACTIVE', 'Placa de rua')
ON CONFLICT (asset_code) DO NOTHING;

-- 4. FOTOS E MÍDIAS DE CAMPO
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a9209d9e-c26e-4986-b846-4897e1cb826d', '17PZ7zj7mDP5OF2lbD6AetVCBoNxlwDxm', 'photos/migrated/SIG-20260814-0009_bad2913c.jpg', 'image/jpeg', 1024, 'a9209d9ec26e4986b8464897e1cb826d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('17a07e91-6b3b-4aaf-9f1d-cc7df1a1a941', 'a9209d9e-c26e-4986-b846-4897e1cb826d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('92d8fcc2-e8af-49cc-b8fd-b8b840c0f7f7', '1RL8f_u0Ciu9SKni7Ulc9n9suMDfI3BXr', 'photos/migrated/SIG-20260817-0001_0af60012.jpg', 'image/jpeg', 1024, '92d8fcc2e8af49ccb8fdb8b840c0f7f7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a6fabd1f-73cb-4d6a-83e6-918be4d0ebbd', '92d8fcc2-e8af-49cc-b8fd-b8b840c0f7f7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9468f3c5-5ce3-4771-bad0-d2ed541b458f', '1oOQO3y3nTzCQgiaSbQwViNSYc7rrimnp', 'photos/migrated/SIG-20260817-0001_999c8354.jpg', 'image/jpeg', 1024, '9468f3c55ce34771bad0d2ed541b458f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a6fabd1f-73cb-4d6a-83e6-918be4d0ebbd', '9468f3c5-5ce3-4771-bad0-d2ed541b458f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8a45eae4-82e0-4830-bbcd-62cd75acb52e', '1r4VNa7m7m5sfcPFtgZxJ8hWqRhVKWugp', 'photos/migrated/SIG-20260817-0002_1c1bcd7a.jpg', 'image/jpeg', 1024, '8a45eae482e04830bbcd62cd75acb52e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3bf3bce2-6189-46d5-9cae-817ecb454f7f', '8a45eae4-82e0-4830-bbcd-62cd75acb52e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1d912cf8-9c2c-4db9-a71a-63cc9e700901', '1SoQQuM83vK83IkM9Dt-avn08UemKyF7L', 'photos/migrated/SIG-20260817-0002_5a4d48a9.jpg', 'image/jpeg', 1024, '1d912cf89c2c4db9a71a63cc9e700901')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3bf3bce2-6189-46d5-9cae-817ecb454f7f', '1d912cf8-9c2c-4db9-a71a-63cc9e700901', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e8152f65-dd10-4b05-aa9f-0a1926d2b735', '1wKCj87aFnTl6s0clFVj49LKjHpKSxD6_', 'photos/migrated/SIG-20260817-0003_18a80080.jpg', 'image/jpeg', 1024, 'e8152f65dd104b05aa9f0a1926d2b735')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f3070f25-b0dd-4401-ace0-89561e85f5ad', 'e8152f65-dd10-4b05-aa9f-0a1926d2b735', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('70aa93aa-9943-438b-8a56-ca7bf21d16f3', '1_UHhHbo_HzvlAvBhFOoQ-OhMv2qNtRNg', 'photos/migrated/SIG-20260817-0003_e63fa3a9.jpg', 'image/jpeg', 1024, '70aa93aa9943438b8a56ca7bf21d16f3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f3070f25-b0dd-4401-ace0-89561e85f5ad', '70aa93aa-9943-438b-8a56-ca7bf21d16f3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cb5f7f65-88df-4d6f-85c8-5563f1173f23', '1AxtcJRwkF_GLwTluk_87xyX2IBB8N0yK', 'photos/migrated/SIG-20260818-0001_9494371a.jpg', 'image/jpeg', 1024, 'cb5f7f6588df4d6f85c85563f1173f23')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('24862f8b-8503-4471-a416-16610d0fb732', 'cb5f7f65-88df-4d6f-85c8-5563f1173f23', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('18b64a1c-2e52-47ed-a826-468e50497e5f', '1UXv9Eg1os9agKQvNBlgwqC8-avUoyJ81', 'photos/migrated/SIG-20260818-0001_da8c5cc6.jpg', 'image/jpeg', 1024, '18b64a1c2e5247eda826468e50497e5f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('24862f8b-8503-4471-a416-16610d0fb732', '18b64a1c-2e52-47ed-a826-468e50497e5f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c32b1a0e-e8d4-4cee-9529-e3933c5b60d0', '1r28TYe4b8JHfUrNlMrtV-utawOKwxqI2', 'photos/migrated/SIG-20260818-0001_da8c5cc6.jpg', 'image/jpeg', 1024, 'c32b1a0ee8d44cee9529e3933c5b60d0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('24862f8b-8503-4471-a416-16610d0fb732', 'c32b1a0e-e8d4-4cee-9529-e3933c5b60d0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c361f9cd-fc9d-4f6d-885c-d916892247da', '1UbY4mZl59Eil2BSS5DTv-R1YkPL5UqpK', 'photos/migrated/SIG-20260818-0002_7880fdad.jpg', 'image/jpeg', 1024, 'c361f9cdfc9d4f6d885cd916892247da')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('176fcc88-f87f-442c-b260-1d880eb895a2', 'c361f9cd-fc9d-4f6d-885c-d916892247da', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e2169c89-7f99-40dd-b33a-b5a51cbbdb7c', '1ERu2AQirl9JbLZXnMdmaqghQPo2DE8Gl', 'photos/migrated/SIG-20260818-0002_82e989cf.jpg', 'image/jpeg', 1024, 'e2169c897f9940ddb33ab5a51cbbdb7c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('176fcc88-f87f-442c-b260-1d880eb895a2', 'e2169c89-7f99-40dd-b33a-b5a51cbbdb7c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('61803e1a-2334-4e91-8e74-505e86ac7834', '1x9aXFUAhsZr2c8wheKGf9iqowXaCLDFy', 'photos/migrated/SIG-20260818-0003_05849a33.jpg', 'image/jpeg', 1024, '61803e1a23344e918e74505e86ac7834')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8841b60b-2fb6-4fd2-8689-7a3115bee396', '61803e1a-2334-4e91-8e74-505e86ac7834', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5220c068-3e9a-435c-859f-1bda1e2a7453', '1eayF_2K55R8lfeA6memb2hM-hm1m--3p', 'photos/migrated/SIG-20260818-0003_0be87f72.jpg', 'image/jpeg', 1024, '5220c0683e9a435c859f1bda1e2a7453')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8841b60b-2fb6-4fd2-8689-7a3115bee396', '5220c068-3e9a-435c-859f-1bda1e2a7453', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('46d1cd68-eb06-4711-bfeb-3cd52f0dabf4', '1tU9Y9oum8Oxi25VjhOgg1kOGDANwluMi', 'photos/migrated/SIG-20260818-0003_fe5d4cce.jpg', 'image/jpeg', 1024, '46d1cd68eb064711bfeb3cd52f0dabf4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8841b60b-2fb6-4fd2-8689-7a3115bee396', '46d1cd68-eb06-4711-bfeb-3cd52f0dabf4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('829b29f1-ef8c-4d64-a470-4283ce02eb08', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, '829b29f1ef8c4d64a4704283ce02eb08')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', '829b29f1-ef8c-4d64-a470-4283ce02eb08', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cddda570-8abc-492f-a30a-b6fdd7d55d4d', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, 'cddda5708abc492fa30ab6fdd7d55d4d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'cddda570-8abc-492f-a30a-b6fdd7d55d4d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('76d909bb-b354-4cc0-9775-a5a12e3ecc3c', '1Rwu20e6fqJwaUmXoY5mSiBUMCktnCobz', 'photos/migrated/SIG-20260818-0004_cff280f8.jpg', 'image/jpeg', 1024, '76d909bbb3544cc09775a5a12e3ecc3c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', '76d909bb-b354-4cc0-9775-a5a12e3ecc3c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4f7914ca-bb2e-4b25-81d6-288bbd3386a5', '1KR9dAHiHUxex_Yu8R2bhUaeFU1acWYd-', 'photos/migrated/SIG-20260818-0003_INSP_aea99b51_07c46cc5.jpg', 'image/jpeg', 1024, '4f7914cabb2e4b2581d6288bbd3386a5')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8841b60b-2fb6-4fd2-8689-7a3115bee396', '4f7914ca-bb2e-4b25-81d6-288bbd3386a5', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ab246e64-fa20-44b1-b281-095c48f99c71', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, 'ab246e64fa2044b1b281095c48f99c71')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'ab246e64-fa20-44b1-b281-095c48f99c71', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('aeaa2a0d-0878-4f10-a5b3-ac52c729cb78', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, 'aeaa2a0d08784f10a5b3ac52c729cb78')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'aeaa2a0d-0878-4f10-a5b3-ac52c729cb78', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('37791509-8628-4c5b-9053-cc8c2cb7ccd0', '1uZmZd3mbVC8QUl8rDLiNkrPR2Z4bMzQb', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_a63aa3a5.jpg', 'image/jpeg', 1024, '3779150986284c5b9053cc8c2cb7ccd0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', '37791509-8628-4c5b-9053-cc8c2cb7ccd0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e8b0c19a-3722-4d64-8ad1-c8f1cd39f3df', '1r5CmNzRU-BLjdblV5d0DRdPQGoyigSdi', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_4aa66a72.jpg', 'image/jpeg', 1024, 'e8b0c19a37224d648ad1c8f1cd39f3df')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'e8b0c19a-3722-4d64-8ad1-c8f1cd39f3df', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('aa7db57e-33f1-4386-8d67-87f8fd78e153', '1TAtOZEfXoKwEsl7uwI577qRT-Pki6Kf2', 'photos/migrated/SIG-20260818-0004_38eed246.jpg', 'image/jpeg', 1024, 'aa7db57e33f143868d6787f8fd78e153')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', 'aa7db57e-33f1-4386-8d67-87f8fd78e153', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('69a42548-297d-4be2-9b6b-c5caaae9daf9', '1GTQoaJK7Y3okWv4ZsqbHVHUorHxn67ca', 'photos/migrated/SIG-20260818-0004_2d95480b.jpg', 'image/jpeg', 1024, '69a42548297d4be29b6bc5caaae9daf9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', '69a42548-297d-4be2-9b6b-c5caaae9daf9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4b0e66ce-66ae-4aa7-b305-3c0ea9dfeb1d', '1r5CmNzRU-BLjdblV5d0DRdPQGoyigSdi', 'photos/migrated/SIG-20260818-0004_INSP_6b3ab268_4aa66a72.jpg', 'image/jpeg', 1024, '4b0e66ce66ae4aa7b3053c0ea9dfeb1d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('66f23f02-b2e8-43d3-8cc7-d3c5aa8d628e', '4b0e66ce-66ae-4aa7-b305-3c0ea9dfeb1d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('71072f52-c78a-4b69-abe7-7b659357b9fa', '1eOFN2Ft0m6m3BAQ1SlWUkeAMl_POBJdC', 'photos/migrated/SIG-20260818-0005_63fd5e25.jpg', 'image/jpeg', 1024, '71072f52c78a4b69abe77b659357b9fa')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2028780f-3963-4bd3-9f1b-d1e10269f4e9', '71072f52-c78a-4b69-abe7-7b659357b9fa', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b7230b6e-1d09-41f4-a6c1-073aa72d91e6', '1AFMeQFQKdfamgJwC_zuClq1d16-k8Pgj', 'photos/migrated/SIG-20260818-0005_839a1c13.jpg', 'image/jpeg', 1024, 'b7230b6e1d0941f4a6c1073aa72d91e6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2028780f-3963-4bd3-9f1b-d1e10269f4e9', 'b7230b6e-1d09-41f4-a6c1-073aa72d91e6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ad44b538-9477-40b7-8acc-c34c69608773', '1z-ZKL3gOtvtplUv7QJx9s-ddwLO28fAD', 'photos/migrated/SIG-20260819-0001_f65fccdd.jpg', 'image/jpeg', 1024, 'ad44b538947740b78accc34c69608773')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('906f7c65-596a-4758-af98-0530d0ee7196', 'ad44b538-9477-40b7-8acc-c34c69608773', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fdaa674a-7a0e-4cf9-bb57-1b2ef9cd3557', '1gaicYz1rUyi0ofIUhsqhWR0WOIRylAKe', 'photos/migrated/SIG-20260819-0001_75251a84.jpg', 'image/jpeg', 1024, 'fdaa674a7a0e4cf9bb571b2ef9cd3557')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('906f7c65-596a-4758-af98-0530d0ee7196', 'fdaa674a-7a0e-4cf9-bb57-1b2ef9cd3557', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b93e81d2-9cb1-43f6-91c3-992d2467657e', '1eV8yVScQlGvm8TqoO3DiTybg11l6o5-u', 'photos/migrated/SIG-20260819-0002_61338272.jpg', 'image/jpeg', 1024, 'b93e81d29cb143f691c3992d2467657e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('38580ec1-7373-4ac5-a21e-9ea4a81bfc94', 'b93e81d2-9cb1-43f6-91c3-992d2467657e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6f1e4e4c-a6d8-4ee4-815c-7a9977071876', '1TWiaf54uPCd994WfO-aeNnj5WkYbhj1r', 'photos/migrated/SIG-20260819-0002_803a8cd8.jpg', 'image/jpeg', 1024, '6f1e4e4ca6d84ee4815c7a9977071876')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('38580ec1-7373-4ac5-a21e-9ea4a81bfc94', '6f1e4e4c-a6d8-4ee4-815c-7a9977071876', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c14cdd49-adef-401a-89d3-c20b2f640d2f', '1A5CeRjmxBxUdrAERk1SVbTUhBSlPbQJG', 'photos/migrated/SIG-20260819-0003_40aa7db1.jpg', 'image/jpeg', 1024, 'c14cdd49adef401a89d3c20b2f640d2f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3f8f587f-3d2b-454f-8349-2348a91b4b03', 'c14cdd49-adef-401a-89d3-c20b2f640d2f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ca7f45ab-2483-4f45-a5db-09acb83f2c05', '1KcppJZIX6rPezTjsP4Z6iBNvBnJpAPl_', 'photos/migrated/SIG-20260819-0004_33d3ab88.jpg', 'image/jpeg', 1024, 'ca7f45ab24834f45a5db09acb83f2c05')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c4a7ce3d-b842-49ce-8511-38dd35a39c80', 'ca7f45ab-2483-4f45-a5db-09acb83f2c05', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f28393e5-e4fb-4457-bcb9-5dbe95cbc98f', '1-rj35k1Q-mtebR2SZbzy8ZSACj3ve3lr', 'photos/migrated/SIG-20260819-0005_9b1e29cd.jpg', 'image/jpeg', 1024, 'f28393e5e4fb4457bcb95dbe95cbc98f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fc0382d6-e616-4f1f-ae9c-a318191959d3', 'f28393e5-e4fb-4457-bcb9-5dbe95cbc98f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9ded7e71-73d5-46be-9d7a-bcbe13d75865', '1-rj35k1Q-mtebR2SZbzy8ZSACj3ve3lr', 'photos/migrated/SIG-20260819-0005_9b1e29cd.jpg', 'image/jpeg', 1024, '9ded7e7173d546be9d7abcbe13d75865')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fc0382d6-e616-4f1f-ae9c-a318191959d3', '9ded7e71-73d5-46be-9d7a-bcbe13d75865', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fa2dcc19-0d1f-4f25-b477-dca98dfdcc00', '1rTS9Lg8pjjl8EHymACKFB0tPsptNagd-', 'photos/migrated/SIG-20260819-0005_INSP_d2185740_b8dcb5d8.jpg', 'image/jpeg', 1024, 'fa2dcc190d1f4f25b477dca98dfdcc00')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fc0382d6-e616-4f1f-ae9c-a318191959d3', 'fa2dcc19-0d1f-4f25-b477-dca98dfdcc00', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c89bd2d9-e93f-4a26-9f06-68a0d1d20e16', '1TjqK9j5-SPMovq-toam1NIcmgj5tSehC', 'photos/migrated/SIG-20260819-0006_00bab5c1.jpg', 'image/jpeg', 1024, 'c89bd2d9e93f4a269f0668a0d1d20e16')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a7f412f-82ff-4246-80d0-45518080c33e', 'c89bd2d9-e93f-4a26-9f06-68a0d1d20e16', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b7c7a2b1-6767-4d0b-a491-17e4a0b90f58', '1i-ow59P0_5iKB_bDieq_DmjjtE5c615r', 'photos/migrated/SIG-20260819-0006_3be8914c.jpg', 'image/jpeg', 1024, 'b7c7a2b167674d0ba49117e4a0b90f58')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a7f412f-82ff-4246-80d0-45518080c33e', 'b7c7a2b1-6767-4d0b-a491-17e4a0b90f58', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('23ad400c-c145-4df4-9415-8b780497c8e9', '1Gv0PXc7sAylhjqqq2DnzRjsZRw39oD1a', 'photos/migrated/SIG-20260820-0001_f6a14e39.jpg', 'image/jpeg', 1024, '23ad400cc1454df494158b780497c8e9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('834be9e8-b999-47fc-bdc8-b1da6d5ced8a', '23ad400c-c145-4df4-9415-8b780497c8e9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('02b91c13-e94d-4c0a-a81e-173914010e3f', '1lsFiStt6U4zgp_DRpTHJtbwhbrJTlNh-', 'photos/migrated/SIG-20260820-0002_35cd7300.jpg', 'image/jpeg', 1024, '02b91c13e94d4c0aa81e173914010e3f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8443b826-9de5-4c69-94d2-f4aae5b91c27', '02b91c13-e94d-4c0a-a81e-173914010e3f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('53036a21-9a3a-4958-8136-b2d76fd81115', '1keqkya5zbDhtYo8KOjD2bGUCVo8gkgVl', 'photos/migrated/SIG-20260820-0002_c4b48580.jpg', 'image/jpeg', 1024, '53036a219a3a49588136b2d76fd81115')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8443b826-9de5-4c69-94d2-f4aae5b91c27', '53036a21-9a3a-4958-8136-b2d76fd81115', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('db09b5e7-9017-46aa-a11d-723dc55f38e7', '1DCmdaLk7d_LK_lFiFo74cMFJExy0_foV', 'photos/migrated/SIG-20260820-0003_1a191aa8.jpg', 'image/jpeg', 1024, 'db09b5e7901746aaa11d723dc55f38e7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9bcb96a5-1cff-4290-8234-568353b3a7bf', 'db09b5e7-9017-46aa-a11d-723dc55f38e7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9d5f6e53-5a32-49ee-916d-fa31852a86e5', '1Px72Bnrupm0qWSd_qaSvmTr73gnpLu5u', 'photos/migrated/SIG-20260820-0003_734f2c33.jpg', 'image/jpeg', 1024, '9d5f6e535a3249ee916dfa31852a86e5')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9bcb96a5-1cff-4290-8234-568353b3a7bf', '9d5f6e53-5a32-49ee-916d-fa31852a86e5', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('377fe378-268f-443b-bfb0-1bef629b90a0', '1KLqPxAuBfNiJdC5v3cLVIiy_F-T6E8in', 'photos/migrated/SIG-20260820-0004_40b88f61.jpg', 'image/jpeg', 1024, '377fe378268f443bbfb01bef629b90a0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('dc7dfeaa-c270-410c-84f4-c0953bb599f9', '377fe378-268f-443b-bfb0-1bef629b90a0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d6ca9459-364c-4b43-8744-187bb0b8dfa4', '1ELaKfVACw1QQd6iHAQWzLzwxZsx3SoWF', 'photos/migrated/SIG-20260820-0004_72b244fe.jpg', 'image/jpeg', 1024, 'd6ca9459364c4b438744187bb0b8dfa4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('dc7dfeaa-c270-410c-84f4-c0953bb599f9', 'd6ca9459-364c-4b43-8744-187bb0b8dfa4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5b4db89c-a448-4253-b533-615a93cdf12b', '1-9bDVMzmgmfobEUb5RSd8sP1tJt3MIZp', 'photos/migrated/SIG-20260820-0005_24d645b1.jpg', 'image/jpeg', 1024, '5b4db89ca4484253b533615a93cdf12b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('57cf18ad-8615-48dc-8e30-d7373861d0c3', '5b4db89c-a448-4253-b533-615a93cdf12b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fd015726-4663-458b-a4be-a5798d9a311b', '180T5R5ATA6gZlPoLel26PqD1HncIBZUP', 'photos/migrated/SIG-20260820-0005_da2f08da.jpg', 'image/jpeg', 1024, 'fd0157264663458ba4bea5798d9a311b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('57cf18ad-8615-48dc-8e30-d7373861d0c3', 'fd015726-4663-458b-a4be-a5798d9a311b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('78295109-436a-4d48-b745-f6e5c9fd5264', '1fFB6Sw7R4bDeEqmiFgJf7L8IjS5Yn9uS', 'photos/migrated/SIG-20260820-0006_42db19c8.jpg', 'image/jpeg', 1024, '78295109436a4d48b745f6e5c9fd5264')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3b85162a-bad4-4729-94ee-4631601c5c85', '78295109-436a-4d48-b745-f6e5c9fd5264', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f37b5647-00f8-4764-af16-f512f910299e', '1HaGTQ73tnPXRuyfyAG2pzVEgkpbkCKrx', 'photos/migrated/SIG-20260820-0007_f954201e.jpg', 'image/jpeg', 1024, 'f37b564700f84764af16f512f910299e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5721774f-e284-411c-8ade-018df217c7aa', 'f37b5647-00f8-4764-af16-f512f910299e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('41cce069-f0c5-4e67-96e3-05185fb5eef3', '1yJKlNDPEVqIg_6hBMPzdLRGvTzmv4FSA', 'photos/migrated/SIG-20260820-0008_191e290e.jpg', 'image/jpeg', 1024, '41cce069f0c54e6796e305185fb5eef3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('04f6d2ae-ad82-4ddc-a4d1-4fbe8a4a57f8', '41cce069-f0c5-4e67-96e3-05185fb5eef3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('978910bb-4d18-40de-9805-c3ef8e1d0e40', '1wpHYI92Q_j73EL4GCawWysaWLG7cR2ft', 'photos/migrated/SIG-20260820-0009_f4db8e7e.jpg', 'image/jpeg', 1024, '978910bb4d1840de9805c3ef8e1d0e40')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9ed79f6-a350-4ba4-9093-b4b7382d663a', '978910bb-4d18-40de-9805-c3ef8e1d0e40', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7cb1c939-e8cf-4f2d-b8fa-523c74a929e9', '1xblpydb0ewjeJspbNvk3OBfgPgC29e9P', 'photos/migrated/SIG-20260820-0009_0e83334e.jpg', 'image/jpeg', 1024, '7cb1c939e8cf4f2db8fa523c74a929e9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9ed79f6-a350-4ba4-9093-b4b7382d663a', '7cb1c939-e8cf-4f2d-b8fa-523c74a929e9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d0a05e24-5f27-429e-9684-24c9d87eee69', '12yjATJpj6guwwv1Grd_WQjppZGK1rDlb', 'photos/migrated/SIG-20260820-0009_c0438fdf.jpg', 'image/jpeg', 1024, 'd0a05e245f27429e968424c9d87eee69')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9ed79f6-a350-4ba4-9093-b4b7382d663a', 'd0a05e24-5f27-429e-9684-24c9d87eee69', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7b866bf0-84f8-49c5-b8e5-cc4f11c492d9', '1Dkz5m7hyq04wIq54tvGwT4u-cgFrfuyQ', 'photos/migrated/SIG-20260820-0010_25c2a2d5.jpg', 'image/jpeg', 1024, '7b866bf084f849c5b8e5cc4f11c492d9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('4f64d946-3e60-422a-933a-7ebc44510983', '7b866bf0-84f8-49c5-b8e5-cc4f11c492d9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('595f85b7-bc8b-4a12-b4fc-753e547a7080', '1CaylBzs3XKMx5wdXHPeWcA35lZi2dE4-', 'photos/migrated/SIG-20260820-0010_cd7c2116.jpg', 'image/jpeg', 1024, '595f85b7bc8b4a12b4fc753e547a7080')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('4f64d946-3e60-422a-933a-7ebc44510983', '595f85b7-bc8b-4a12-b4fc-753e547a7080', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('acbc40b0-b0bc-4e34-8146-2f516002b9e1', '1dro8pKuYImnm-0vFvq_DDducobB8jp_J', 'photos/migrated/SIG-20260820-0011_431f9e2f.jpg', 'image/jpeg', 1024, 'acbc40b0b0bc4e3481462f516002b9e1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('492eeba6-77fb-417d-a68c-67472d15eda9', 'acbc40b0-b0bc-4e34-8146-2f516002b9e1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('45ec8ea2-0773-46e2-8292-bd3bd4855722', '1REEnvUR-6m8nAB-JBDK7dtQl_DasQ3nC', 'photos/migrated/SIG-20260820-0012_a0143806.jpg', 'image/jpeg', 1024, '45ec8ea2077346e28292bd3bd4855722')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f8efb7bb-366f-437b-bca7-e7f0288c51f0', '45ec8ea2-0773-46e2-8292-bd3bd4855722', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a8f69511-9af1-47b4-99ab-83cbb73b6821', '1Vd1HctvPbjt3nJREnVhWfCRb_enrNkG3', 'photos/migrated/SIG-20260820-0012_ae8b891a.jpg', 'image/jpeg', 1024, 'a8f695119af147b499ab83cbb73b6821')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f8efb7bb-366f-437b-bca7-e7f0288c51f0', 'a8f69511-9af1-47b4-99ab-83cbb73b6821', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('16208a52-911f-4065-862c-f6b702290112', '10Ea9ZeobQk5NvY6oDCUzlTHWeakKBICc', 'photos/migrated/SIG-20260820-0013_69e09953.jpg', 'image/jpeg', 1024, '16208a52911f4065862cf6b702290112')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cf56b37e-1f37-4f79-9058-5f9c12f6a254', '16208a52-911f-4065-862c-f6b702290112', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e41bd686-dfac-4185-858a-e1a73880f4cf', '1MELYrQn-wEfGEEgBhJmFOqkySQxJFaLj', 'photos/migrated/SIG-20260820-0013_efa1e408.jpg', 'image/jpeg', 1024, 'e41bd686dfac4185858ae1a73880f4cf')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('cf56b37e-1f37-4f79-9058-5f9c12f6a254', 'e41bd686-dfac-4185-858a-e1a73880f4cf', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ab049099-4a15-472e-8549-8f1385c0c993', '1ICb1_4eVJ5xk5snlfj6iTpkMAapd_nw5', 'photos/migrated/SIG-20260820-0014_f6b3b322.jpg', 'image/jpeg', 1024, 'ab0490994a15472e85498f1385c0c993')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e1c0e7e7-5e32-46a4-a1bd-ba9ea8c67a8f', 'ab049099-4a15-472e-8549-8f1385c0c993', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f991883c-27c2-4c3c-b0c0-528de5d7f6c4', '17Y9EhA8eZfFs0UP_NmDHyx7ku_L35BPI', 'photos/migrated/SIG-20260820-0014_ec50f364.jpg', 'image/jpeg', 1024, 'f991883c27c24c3cb0c0528de5d7f6c4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e1c0e7e7-5e32-46a4-a1bd-ba9ea8c67a8f', 'f991883c-27c2-4c3c-b0c0-528de5d7f6c4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('52e773c4-73ca-4ba1-812e-35ce308806ba', '1ZgsBbLii0BWkcseW0vxYLKS8P-nKbaBd', 'photos/migrated/SIG-20260820-0015_b46edd0b.jpg', 'image/jpeg', 1024, '52e773c473ca4ba1812e35ce308806ba')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('884dfaec-2ec5-4ac9-89af-f17d86b9cc3f', '52e773c4-73ca-4ba1-812e-35ce308806ba', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b7a7f4b7-3921-473f-941d-d028069784e4', '1yj1z_Z4ZWOnVzeYvV0e7kKTsrAOMNB-e', 'photos/migrated/SIG-20260820-0015_28e118b8.jpg', 'image/jpeg', 1024, 'b7a7f4b73921473f941dd028069784e4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('884dfaec-2ec5-4ac9-89af-f17d86b9cc3f', 'b7a7f4b7-3921-473f-941d-d028069784e4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fe4306a4-38ed-4e03-9202-41f86f5bb819', '1SWQdnztcilUv6pOUnUNd3gKSRcXtlWSB', 'photos/migrated/SIG-20260820-0016_fb1b794a.jpg', 'image/jpeg', 1024, 'fe4306a438ed4e03920241f86f5bb819')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c4c7c658-cfd4-4ed6-b64b-bb90201d8df2', 'fe4306a4-38ed-4e03-9202-41f86f5bb819', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('84eb2619-acc2-4539-9ef3-9e545b90916d', '1Kt8yT05XvZFTUz0JhqnmkgqA_szohk23', 'photos/migrated/SIG-20260820-0016_f9dba9d8.jpg', 'image/jpeg', 1024, '84eb2619acc245399ef39e545b90916d')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c4c7c658-cfd4-4ed6-b64b-bb90201d8df2', '84eb2619-acc2-4539-9ef3-9e545b90916d', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cb3630ee-e1d6-4043-b8d5-d1a209e5a270', '13vt3CUgj0xUnmXdS1YIsWqwnvZR4BQJT', 'photos/migrated/SIG-20260820-0017_70b9489d.jpg', 'image/jpeg', 1024, 'cb3630eee1d64043b8d5d1a209e5a270')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('51bab845-df60-46a7-b2ec-f522fe184a14', 'cb3630ee-e1d6-4043-b8d5-d1a209e5a270', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1bc338f9-4de8-4803-b8ac-0d4f81e72f57', '15EN7tVy_TAUmrIRAam3n70A1PJcfQ26g', 'photos/migrated/SIG-20260820-0017_ae66b1c6.jpg', 'image/jpeg', 1024, '1bc338f94de84803b8ac0d4f81e72f57')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('51bab845-df60-46a7-b2ec-f522fe184a14', '1bc338f9-4de8-4803-b8ac-0d4f81e72f57', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4afb01e7-f622-4933-96c5-a252c07512e6', '1hj_vky2NiDrjvQamzP4F_JGXWj53FBLh', 'photos/migrated/SIG-20260820-0018_c433e05c.jpg', 'image/jpeg', 1024, '4afb01e7f622493396c5a252c07512e6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('93fa44ed-7d4c-4cd9-95d8-c7e30c292c17', '4afb01e7-f622-4933-96c5-a252c07512e6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('37253632-becb-467b-b7e0-ff9779322934', '1RQNI8p3pwwAurpQiMXDyFON_FvwtK3b6', 'photos/migrated/SIG-20260820-0018_905fec93.jpg', 'image/jpeg', 1024, '37253632becb467bb7e0ff9779322934')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('93fa44ed-7d4c-4cd9-95d8-c7e30c292c17', '37253632-becb-467b-b7e0-ff9779322934', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1f11fdbb-2be8-4c53-9f9a-b7ceb0c37649', '1MKy--M-Hchs03cW-pXoF4C2Ea4k5rEJq', 'photos/migrated/SIG-20260820-0019_df6f25dc.jpg', 'image/jpeg', 1024, '1f11fdbb2be84c539f9ab7ceb0c37649')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('150f431d-6c53-4a52-9225-b0375bcd126b', '1f11fdbb-2be8-4c53-9f9a-b7ceb0c37649', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3e6867d5-cde9-4185-841d-8b5a136ce67e', '1FKIeRhEkXyRKwJ77xptgC4OR6ErKRFHR', 'photos/migrated/SIG-20260820-0019_a8504cfd.jpg', 'image/jpeg', 1024, '3e6867d5cde94185841d8b5a136ce67e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('150f431d-6c53-4a52-9225-b0375bcd126b', '3e6867d5-cde9-4185-841d-8b5a136ce67e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('52bb77ad-3e43-499a-94b2-8aeb3bcf4287', '1gnLP1WexG4xHUmU7r51xhobJ_Livl-la', 'photos/migrated/SIG-20260820-0020_280bcba1.jpg', 'image/jpeg', 1024, '52bb77ad3e43499a94b28aeb3bcf4287')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('024948cf-916b-4933-8112-c0d5ce98a5d7', '52bb77ad-3e43-499a-94b2-8aeb3bcf4287', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9b9e8b2b-a5a7-431b-a993-c6205502b1cf', '1PqpXbjyNPD98GgyhwYtLB7x4exdMJkj5', 'photos/migrated/SIG-20260820-0020_6db418e9.jpg', 'image/jpeg', 1024, '9b9e8b2ba5a7431ba993c6205502b1cf')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('024948cf-916b-4933-8112-c0d5ce98a5d7', '9b9e8b2b-a5a7-431b-a993-c6205502b1cf', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b7ef4e09-2f56-47b8-93f6-f53ab27b7368', '1SPUabdw4y3YZii5T8Ih1hWw-kJFrNZef', 'photos/migrated/SIG-20260820-0021_cab14312.jpg', 'image/jpeg', 1024, 'b7ef4e092f5647b893f6f53ab27b7368')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a86c6293-2585-4b09-8a92-7e9cbffa0dcc', 'b7ef4e09-2f56-47b8-93f6-f53ab27b7368', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6b621643-de85-4130-8208-9b6839026448', '1K_8xj6RQ7tizVe9TJq2Snv6LwJDiIN2Y', 'photos/migrated/SIG-20260820-0021_88b7ae3a.jpg', 'image/jpeg', 1024, '6b621643de85413082089b6839026448')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a86c6293-2585-4b09-8a92-7e9cbffa0dcc', '6b621643-de85-4130-8208-9b6839026448', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f415e9b3-3f30-444b-91af-3cf3be518628', '1ydZFJpYvax0IlvWbJCQxrctnimyWNBxE', 'photos/migrated/SIG-20260820-0022_f3acc395.jpg', 'image/jpeg', 1024, 'f415e9b33f30444b91af3cf3be518628')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('49e7dc9c-d2ce-480a-ad0a-c6b6523d0faf', 'f415e9b3-3f30-444b-91af-3cf3be518628', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f1bdb402-669a-47b2-8bae-2c8ac36fd4be', '1gx-TTZbYfgnXzdg9huidFCv4-F0BMpIu', 'photos/migrated/SIG-20260820-0023_316af4a0.jpg', 'image/jpeg', 1024, 'f1bdb402669a47b28bae2c8ac36fd4be')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('719441ca-d8bd-4456-bf0e-288f48aeddd5', 'f1bdb402-669a-47b2-8bae-2c8ac36fd4be', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a7410191-d937-4948-a2e9-dbbfd9f57695', '1cnCMN8fSNj7gqmS648U48O_D7uEaEs4b', 'photos/migrated/SIG-20260820-0023_d53e355b.jpg', 'image/jpeg', 1024, 'a7410191d9374948a2e9dbbfd9f57695')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('719441ca-d8bd-4456-bf0e-288f48aeddd5', 'a7410191-d937-4948-a2e9-dbbfd9f57695', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('136f17d3-8f46-4f1b-81c7-25dfadc10ae1', '1ZT4ZjUlemCSNxsAFjKq-eMktmMbA2WKl', 'photos/migrated/SIG-20260820-0024_883c7d88.jpg', 'image/jpeg', 1024, '136f17d38f464f1b81c725dfadc10ae1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('23399c92-ca16-4725-aebb-aeb1c74fb858', '136f17d3-8f46-4f1b-81c7-25dfadc10ae1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8fcb8e9e-1238-41ca-9446-a385f6a7aa0a', '1xeWoK-ckOK7Nvn6wPH81raTQQgVoE3jh', 'photos/migrated/SIG-20260820-0024_8a8e5eee.jpg', 'image/jpeg', 1024, '8fcb8e9e123841ca9446a385f6a7aa0a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('23399c92-ca16-4725-aebb-aeb1c74fb858', '8fcb8e9e-1238-41ca-9446-a385f6a7aa0a', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('56169185-ae85-4721-9c69-547f0f71d974', '1VUP5eVMQCO5BsM8HXKUqqax6NpVReAvR', 'photos/migrated/SIG-20260820-0025_e4457aa1.jpg', 'image/jpeg', 1024, '56169185ae8547219c69547f0f71d974')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9482ab14-9e63-4cd9-80b3-caa7acd9c50d', '56169185-ae85-4721-9c69-547f0f71d974', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('df8b2295-ab7a-4d96-ab35-054da9d75aca', '1NJg6shRT3GIkztGlbl6iEQhKrhLWiT-a', 'photos/migrated/SIG-20260820-0025_21496aea.jpg', 'image/jpeg', 1024, 'df8b2295ab7a4d96ab35054da9d75aca')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9482ab14-9e63-4cd9-80b3-caa7acd9c50d', 'df8b2295-ab7a-4d96-ab35-054da9d75aca', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9e04fa9a-3289-458e-9253-18c475781828', '1YWVPm4IuX1IUTYwEabYR65uiOUWSSLah', 'photos/migrated/SIG-20260820-0026_7eb2511b.jpg', 'image/jpeg', 1024, '9e04fa9a3289458e925318c475781828')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('41d084a9-23ca-4ea0-aa33-4d378cce9f33', '9e04fa9a-3289-458e-9253-18c475781828', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('86b3ef07-1688-4edb-a507-bcd136794e67', '1FPF42qat1ex9AkRoeULm85kGyBlbipDl', 'photos/migrated/SIG-20260820-0026_7d4dd6f7.jpg', 'image/jpeg', 1024, '86b3ef0716884edba507bcd136794e67')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('41d084a9-23ca-4ea0-aa33-4d378cce9f33', '86b3ef07-1688-4edb-a507-bcd136794e67', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3bb00ab6-20be-4cc4-a13f-2429bf7fc0aa', '1g3JL2qKShHaolAnjWk9UeAB2xACEtnda', 'photos/migrated/SIG-20260820-0027_787c183a.jpg', 'image/jpeg', 1024, '3bb00ab620be4cc4a13f2429bf7fc0aa')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('48e8b555-e93c-4255-9c9e-97379df73713', '3bb00ab6-20be-4cc4-a13f-2429bf7fc0aa', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5274129f-5fbc-4149-903c-e8fb8549edd0', '1sw9IjUnV39Pmcv19CTrhjqCF24xep0BX', 'photos/migrated/SIG-20260820-0027_732c4df9.jpg', 'image/jpeg', 1024, '5274129f5fbc4149903ce8fb8549edd0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('48e8b555-e93c-4255-9c9e-97379df73713', '5274129f-5fbc-4149-903c-e8fb8549edd0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e0a6a0c1-9ca8-4f66-92f6-d71fa5a34ef3', '1FfMdbgj54aedkcOFcGi0srRGVMetYTgd', 'photos/migrated/SIG-20260820-0028_ad6969cf.jpg', 'image/jpeg', 1024, 'e0a6a0c19ca84f6692f6d71fa5a34ef3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b74f7c98-00a1-47b0-a9d4-9d198aa1222e', 'e0a6a0c1-9ca8-4f66-92f6-d71fa5a34ef3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0dd2684d-c123-4bb8-a5a3-7735817fc9d8', '1arwtXg7na4tBb9yIniIeulmIvL5PWhoN', 'photos/migrated/SIG-20260820-0028_64f2afda.jpg', 'image/jpeg', 1024, '0dd2684dc1234bb8a5a37735817fc9d8')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b74f7c98-00a1-47b0-a9d4-9d198aa1222e', '0dd2684d-c123-4bb8-a5a3-7735817fc9d8', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('30b1554c-0258-4fba-a116-35d4d451255f', '1AWMN_Kh5V8wCBz4lfTyvb6tDRdogFSfU', 'photos/migrated/SIG-20260820-0029_c5b9be53.jpg', 'image/jpeg', 1024, '30b1554c02584fbaa11635d4d451255f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('82afafcf-aed2-4082-b224-30704419e357', '30b1554c-0258-4fba-a116-35d4d451255f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cb7b85fd-5397-444a-b24f-fe8d77944ee7', '1hN5BWh3H4ncfOP770_SbM3nZ4jtPKzPO', 'photos/migrated/SIG-20260820-0030_ce8b4da3.jpg', 'image/jpeg', 1024, 'cb7b85fd5397444ab24ffe8d77944ee7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c0b923af-7060-4d2e-bb03-f19c60fb2c5b', 'cb7b85fd-5397-444a-b24f-fe8d77944ee7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('47d8103a-0d5f-4876-9d68-a32761ed4bd0', '1H1789U2OCA2R87BkD-u3Kz-2rWZXUMsL', 'photos/migrated/SIG-20260820-0030_20e59c13.jpg', 'image/jpeg', 1024, '47d8103a0d5f48769d68a32761ed4bd0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c0b923af-7060-4d2e-bb03-f19c60fb2c5b', '47d8103a-0d5f-4876-9d68-a32761ed4bd0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('dcc8fce0-9a3a-4d36-8764-b79ec2a2c703', '1bVEBN2w3Zw5gbUSEA44rTh5yoU7mtq9_', 'photos/migrated/SIG-20260820-0031_400ada14.jpg', 'image/jpeg', 1024, 'dcc8fce09a3a4d368764b79ec2a2c703')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5cf65432-d846-45d2-9048-510532a94076', 'dcc8fce0-9a3a-4d36-8764-b79ec2a2c703', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('570b63b7-6bd7-4888-a696-bbc5940e92f5', '1CHg9bA6qbUg1lUNZn7JfqerOwqtj-lQO', 'photos/migrated/SIG-20260820-0031_637c5ab0.jpg', 'image/jpeg', 1024, '570b63b76bd74888a696bbc5940e92f5')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5cf65432-d846-45d2-9048-510532a94076', '570b63b7-6bd7-4888-a696-bbc5940e92f5', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('638d6cb8-06dd-4e17-aeaf-a0d81fda0942', '1dnLZ_h_0qBUp5z1Zl6Xs5HAG-CyNRnbN', 'photos/migrated/SIG-20260821-0001_2a82d130.jpg', 'image/jpeg', 1024, '638d6cb806dd4e17aeafa0d81fda0942')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1006e399-98c0-4ad5-8e54-213527a43e32', '638d6cb8-06dd-4e17-aeaf-a0d81fda0942', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fc4b5ee9-ffea-4d6d-a908-c3f04dc86848', '1YzN_AK4wlEpumw1UU_ZWq7MvqyDx4QxI', 'photos/migrated/SIG-20260821-0001_b6372114.jpg', 'image/jpeg', 1024, 'fc4b5ee9ffea4d6da908c3f04dc86848')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1006e399-98c0-4ad5-8e54-213527a43e32', 'fc4b5ee9-ffea-4d6d-a908-c3f04dc86848', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cd91c64d-cc31-4b75-bf30-19d3fb39f32e', '1NKyjmnl-BKrqo27NV_ZveHUV59lO8S2z', 'photos/migrated/SIG-20260824-0001_2832c5a7.jpg', 'image/jpeg', 1024, 'cd91c64dcc314b75bf3019d3fb39f32e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9e8d40f6-8ba7-424e-a23a-c75126fbce4d', 'cd91c64d-cc31-4b75-bf30-19d3fb39f32e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8f8ea0f4-3943-437e-9b0a-4a75c576f87f', '1gOzaWPJi6y0IFZ-y0hC6TS-gTBXHadc_', 'photos/migrated/SIG-20260824-0002_3180f073.jpg', 'image/jpeg', 1024, '8f8ea0f43943437e9b0a4a75c576f87f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d0b189f4-e4be-4578-8c08-86b81c2f19ff', '8f8ea0f4-3943-437e-9b0a-4a75c576f87f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1902ab33-1cef-46bd-9842-ee88f5a8a06c', '1oVeptJUbmPqPdJ2triSzdSM5uUbdDP4Q', 'photos/migrated/SIG-20260824-0003_cd0e7b93.jpg', 'image/jpeg', 1024, '1902ab331cef46bd9842ee88f5a8a06c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('495a67a2-f18a-471e-a602-1412f341343f', '1902ab33-1cef-46bd-9842-ee88f5a8a06c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b05aa3b0-99b7-4e60-8971-8b63014bcc68', '1GeLCJSmgOqGaxVYPoYLe9QPRH4qA37FW', 'photos/migrated/SIG-20260824-0004_4757d553.jpg', 'image/jpeg', 1024, 'b05aa3b099b74e6089718b63014bcc68')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9fd27e30-5f68-4cf3-b969-36c5b902a342', 'b05aa3b0-99b7-4e60-8971-8b63014bcc68', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('775db160-5ccf-494c-83ce-7c5824c31086', '1ytNQ8YFvYBKLbhMTmSKCcr3Ey6Tjnfw1', 'photos/migrated/SIG-20260824-0005_c6af19d8.jpg', 'image/jpeg', 1024, '775db1605ccf494c83ce7c5824c31086')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2603a2ee-01b7-4478-981d-c838c1376729', '775db160-5ccf-494c-83ce-7c5824c31086', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2ba5a8f8-c7a3-4aab-8028-6968649c8f0f', '1SXiLYtKuO481hR3-8Pkp-14QbeXwPcU_', 'photos/migrated/SIG-20260824-0005_5f36c321.jpg', 'image/jpeg', 1024, '2ba5a8f8c7a34aab80286968649c8f0f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2603a2ee-01b7-4478-981d-c838c1376729', '2ba5a8f8-c7a3-4aab-8028-6968649c8f0f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('18ee9520-1bc6-4713-9b3f-1a77134ae29f', '1EtmUgmt7grnK6Hdm_BaGnz1TKy9dP1Nj', 'photos/migrated/SIG-20260824-0006_e8a23169.jpg', 'image/jpeg', 1024, '18ee95201bc647139b3f1a77134ae29f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('78e604ba-9d70-4281-ade5-a5ef7dfdc42d', '18ee9520-1bc6-4713-9b3f-1a77134ae29f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4c8871ad-27f5-4ab9-8f7e-3f17125165d3', '1cQKWR-9y8AL0V5QiHvcj6E-5Y2Trl6pc', 'photos/migrated/SIG-20260824-0006_84c577da.jpg', 'image/jpeg', 1024, '4c8871ad27f54ab98f7e3f17125165d3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('78e604ba-9d70-4281-ade5-a5ef7dfdc42d', '4c8871ad-27f5-4ab9-8f7e-3f17125165d3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('33f1d928-537c-4782-9d7f-256c2bab0326', '1DLBrT0hK4xkDkdO2r_rOu3yoLMDyF9ym', 'photos/migrated/SIG-20260824-0007_78d5a191.jpg', 'image/jpeg', 1024, '33f1d928537c47829d7f256c2bab0326')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5b699fd6-c754-4275-8bd7-293e60cdba76', '33f1d928-537c-4782-9d7f-256c2bab0326', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('87814a22-08db-48c5-9c10-10e9caa762fe', '1fQ2xSZktltkLcb49R6QO_RvuZwWZ8Z95', 'photos/migrated/SIG-20260824-0007_e88ba31f.jpg', 'image/jpeg', 1024, '87814a2208db48c59c1010e9caa762fe')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5b699fd6-c754-4275-8bd7-293e60cdba76', '87814a22-08db-48c5-9c10-10e9caa762fe', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d2d4d2b2-8099-43a2-980b-61f8df6bc2bf', '12SOg3hIERAEwH8Y44uvStsnn46VnBn4V', 'photos/migrated/SIG-20260824-0008_12c17bb6.jpg', 'image/jpeg', 1024, 'd2d4d2b2809943a2980b61f8df6bc2bf')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f373c938-0509-4faf-885f-0f50ca4a359f', 'd2d4d2b2-8099-43a2-980b-61f8df6bc2bf', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ef578507-d8ed-4437-8383-5a337690025b', '17b6oDofC00Aa4U7V1c5Q8YlmA2k4Lvw7', 'photos/migrated/SIG-20260824-0009_b6617f93.jpg', 'image/jpeg', 1024, 'ef578507d8ed443783835a337690025b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('516a6579-ee76-40d0-90b5-720e0da8cf2d', 'ef578507-d8ed-4437-8383-5a337690025b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4db7b383-0829-4073-86b2-72d78bc78d3c', '1XsxTx9_bybcaOTAj2NPS2O96aEbjHFJ1', 'photos/migrated/SIG-20260824-0010_12243d8b.jpg', 'image/jpeg', 1024, '4db7b3830829407386b272d78bc78d3c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d18cb45f-d3b2-42ed-be46-17b9463094b1', '4db7b383-0829-4073-86b2-72d78bc78d3c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1b0330d6-8162-40c5-ad91-2c2c1fb684fe', '1V2ViETSfoYpVVojzBPebUCkizMY4g6Bf', 'photos/migrated/SIG-20260824-0010_a3a34dd1.jpg', 'image/jpeg', 1024, '1b0330d6816240c5ad912c2c1fb684fe')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d18cb45f-d3b2-42ed-be46-17b9463094b1', '1b0330d6-8162-40c5-ad91-2c2c1fb684fe', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('963c8425-1cfb-42cc-8ed8-71a14de8bf82', '1jF59neHB369ZlzNxApG6fQHPRDi-7Iku', 'photos/migrated/SIG-20260824-0011_b70c629e.jpg', 'image/jpeg', 1024, '963c84251cfb42cc8ed871a14de8bf82')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('99634f8d-9814-4175-99bc-59975856adc7', '963c8425-1cfb-42cc-8ed8-71a14de8bf82', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6f56771a-c719-4580-a073-0256bdd058eb', '16KyWsvpEgT1eL6qXayu4_h7swM_o2tSe', 'photos/migrated/SIG-20260824-0011_2f9ebdf6.jpg', 'image/jpeg', 1024, '6f56771ac7194580a0730256bdd058eb')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('99634f8d-9814-4175-99bc-59975856adc7', '6f56771a-c719-4580-a073-0256bdd058eb', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('79902752-ea92-4d82-9959-8a20b5bdf957', '1eoebT2BTIBXuNlU9OL3qz5cuhVY2thvI', 'photos/migrated/SIG-20260824-0012_b8835cf3.jpg', 'image/jpeg', 1024, '79902752ea924d8299598a20b5bdf957')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0cc6f2db-387a-4d82-bc6b-616829752afe', '79902752-ea92-4d82-9959-8a20b5bdf957', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b9112efd-b4cc-409b-aa53-f3598c974ff0', '1efucfctb_w3SdgeyE47ZiQCNWX4Dhxxx', 'photos/migrated/SIG-20260824-0012_9b4ebee9.jpg', 'image/jpeg', 1024, 'b9112efdb4cc409baa53f3598c974ff0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0cc6f2db-387a-4d82-bc6b-616829752afe', 'b9112efd-b4cc-409b-aa53-f3598c974ff0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a111b4f5-6702-44e1-91b5-4e66c6774cc6', '1Lslzsq83E2tuCl4NH45s9by43p9697Tg', 'photos/migrated/SIG-20260824-0013_2225a334.jpg', 'image/jpeg', 1024, 'a111b4f5670244e191b54e66c6774cc6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('54d973a5-e730-4666-9d74-6eb22c7af727', 'a111b4f5-6702-44e1-91b5-4e66c6774cc6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('863da9a2-1586-4cd4-b927-cbfd3018a7d7', '19QY8E4qtfpv62ARWBWLrWbVxiIcm0VVs', 'photos/migrated/SIG-20260824-0013_57935b1c.jpg', 'image/jpeg', 1024, '863da9a215864cd4b927cbfd3018a7d7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('54d973a5-e730-4666-9d74-6eb22c7af727', '863da9a2-1586-4cd4-b927-cbfd3018a7d7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7e9b4a5c-ed4c-4a63-a202-81c73e626c1e', '1qByZKAPlQcMZh2Hoh62q3RB6zXRfwVs5', 'photos/migrated/SIG-20260824-0014_b343b735.jpg', 'image/jpeg', 1024, '7e9b4a5ced4c4a63a20281c73e626c1e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f229eae7-6e80-47d2-b6b2-8b9c48c4c355', '7e9b4a5c-ed4c-4a63-a202-81c73e626c1e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a8857209-5e1a-428d-954b-ea011d7bbf4b', '1qxKd99bJxQtoyZQYAPa3konBHVfGRg5J', 'photos/migrated/SIG-20260824-0014_e0602929.jpg', 'image/jpeg', 1024, 'a88572095e1a428d954bea011d7bbf4b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f229eae7-6e80-47d2-b6b2-8b9c48c4c355', 'a8857209-5e1a-428d-954b-ea011d7bbf4b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('57094bac-1f66-4192-9069-f3802234f03e', '1wX04RNN48B-p0dcXqB5GW1ugOEPQcf9f', 'photos/migrated/SIG-20260824-0015_73e5c128.jpg', 'image/jpeg', 1024, '57094bac1f6641929069f3802234f03e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('697d399e-9c95-4064-bbdd-cadd9c37c4a2', '57094bac-1f66-4192-9069-f3802234f03e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e9a7ca65-e46c-478f-914a-6d4efd7b4624', '1FibkwKX7c9O3cUXnDZsm9MAeneCfD3Ft', 'photos/migrated/SIG-20260824-0015_63f2648c.jpg', 'image/jpeg', 1024, 'e9a7ca65e46c478f914a6d4efd7b4624')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('697d399e-9c95-4064-bbdd-cadd9c37c4a2', 'e9a7ca65-e46c-478f-914a-6d4efd7b4624', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d3f39478-0776-4619-82e1-de518d674a84', '1DW4VX2moff5v92QfiH_428vIUeIcbF37', 'photos/migrated/SIG-20260824-0016_1e7cb054.jpg', 'image/jpeg', 1024, 'd3f394780776461982e1de518d674a84')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('39256188-dde0-4c91-b776-823b765147ac', 'd3f39478-0776-4619-82e1-de518d674a84', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4f91d6af-cc39-45ba-adf3-53ac145e63fa', '1PesO6nhkvfJi8CJas-L7CDlmTiuf3Y2S', 'photos/migrated/SIG-20260824-0016_c7cf2698.jpg', 'image/jpeg', 1024, '4f91d6afcc3945baadf353ac145e63fa')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('39256188-dde0-4c91-b776-823b765147ac', '4f91d6af-cc39-45ba-adf3-53ac145e63fa', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c2e60275-37c2-4724-b58e-d01e71131f1a', '1wTZf3X_XhktGHx8MMel52lUbOJtgVWHY', 'photos/migrated/SIG-20260824-0017_454a3ca8.jpg', 'image/jpeg', 1024, 'c2e6027537c24724b58ed01e71131f1a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9235d94-3f57-46a5-82eb-7648dbd91813', 'c2e60275-37c2-4724-b58e-d01e71131f1a', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8d778816-5234-4e44-a206-b0bad84f8ef6', '1Vefdt4LieInmL270jN_G2D4nIn2BcJP2', 'photos/migrated/SIG-20260824-0018_19d8c77a.jpg', 'image/jpeg', 1024, '8d77881652344e44a206b0bad84f8ef6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e5cb55f2-8dab-4bb8-a725-40dce669b324', '8d778816-5234-4e44-a206-b0bad84f8ef6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cee878fa-99f1-45be-91fd-59071171d1ac', '16hUG3RlmcTfoZ7-z3bDvqPHt5kluX8bp', 'photos/migrated/SIG-20260824-0018_56662f16.jpg', 'image/jpeg', 1024, 'cee878fa99f145be91fd59071171d1ac')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e5cb55f2-8dab-4bb8-a725-40dce669b324', 'cee878fa-99f1-45be-91fd-59071171d1ac', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5e4449fb-0554-433f-9d23-2c81dc59cb56', '1rfxighOv57lqhuihUrvD03yy8ULRgChw', 'photos/migrated/SIG-20260824-0019_fc9d6e52.jpg', 'image/jpeg', 1024, '5e4449fb0554433f9d232c81dc59cb56')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0296606d-a1f8-4f5b-84b3-f8c4cca744d7', '5e4449fb-0554-433f-9d23-2c81dc59cb56', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8b8f95e5-29ca-4651-b64d-8e28559e5274', '1_lDCv7kh9PtAvdEWhuVzWKfFlXvj3f1-', 'photos/migrated/SIG-20260824-0019_ac76be50.jpg', 'image/jpeg', 1024, '8b8f95e529ca4651b64d8e28559e5274')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0296606d-a1f8-4f5b-84b3-f8c4cca744d7', '8b8f95e5-29ca-4651-b64d-8e28559e5274', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('da1920cf-1e48-4c80-b6a4-7a1e1b515262', '1ZqIjH76YMe2uq4Snj1WS4kIFxxjugEnm', 'photos/migrated/SIG-20260824-0020_f160b17f.jpg', 'image/jpeg', 1024, 'da1920cf1e484c80b6a47a1e1b515262')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b7f53a4f-1707-4c10-afd0-1932daa42c32', 'da1920cf-1e48-4c80-b6a4-7a1e1b515262', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e2f659d4-c1e8-4dee-a1f7-70f3c2b7da68', '1FENbPz1ve0DyDsXUx2oMbyRxaJgIuE_8', 'photos/migrated/SIG-20260824-0021_38c2c406.jpg', 'image/jpeg', 1024, 'e2f659d4c1e84deea1f770f3c2b7da68')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('15dc4056-4077-479d-803e-f00a9f104343', 'e2f659d4-c1e8-4dee-a1f7-70f3c2b7da68', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('9e246a82-b25e-4a66-aa08-1525103a7d8e', '1rJk7kjLKh5aBLuld3QyDDblsw_Oaw6aE', 'photos/migrated/SIG-20260824-0021_b51a56dc.jpg', 'image/jpeg', 1024, '9e246a82b25e4a66aa081525103a7d8e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('15dc4056-4077-479d-803e-f00a9f104343', '9e246a82-b25e-4a66-aa08-1525103a7d8e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d292d180-3c01-4dc0-992f-9e0d3e32a427', '1gpyfU8esgJmGZixU8pcCi1xW1unMbTE3', 'photos/migrated/SIG-20260824-0022_8265eb08.jpg', 'image/jpeg', 1024, 'd292d1803c014dc0992f9e0d3e32a427')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7b60406d-1f39-4c55-a97a-f40335eaa3bb', 'd292d180-3c01-4dc0-992f-9e0d3e32a427', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2bfd9691-12d6-4510-b70c-16f5240c49d6', '1u0QTzlBpB7jsAaaG7sfUyV1hPdBDfpWn', 'photos/migrated/SIG-20260824-0022_7346dc1d.jpg', 'image/jpeg', 1024, '2bfd969112d64510b70c16f5240c49d6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7b60406d-1f39-4c55-a97a-f40335eaa3bb', '2bfd9691-12d6-4510-b70c-16f5240c49d6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('38fbba15-7c9d-487c-b9ea-b48fbbafd918', '1R1fM_s-gDK-8LRCtTlX-MuZQMF47rrU9', 'photos/migrated/SIG-20260824-0023_b860096b.jpg', 'image/jpeg', 1024, '38fbba157c9d487cb9eab48fbbafd918')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('04e44e3a-dd04-4d43-b05a-67448461cb38', '38fbba15-7c9d-487c-b9ea-b48fbbafd918', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('013ef881-047f-4416-85a3-cfe6deba545c', '11IN5KLDZPcYisiVbBgCQnDcz_oY6fT5o', 'photos/migrated/SIG-20260824-0023_46249468.jpg', 'image/jpeg', 1024, '013ef881047f441685a3cfe6deba545c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('04e44e3a-dd04-4d43-b05a-67448461cb38', '013ef881-047f-4416-85a3-cfe6deba545c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('257989f2-77e5-4597-baa3-560048e07db2', '1ftYDCCF5rAyWVQiUGZAw-tgRtI19nSUo', 'photos/migrated/SIG-20260824-0024_12cf449b.jpg', 'image/jpeg', 1024, '257989f277e54597baa3560048e07db2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('81342d2e-782f-4bae-9710-68a4435d45b3', '257989f2-77e5-4597-baa3-560048e07db2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1675963e-ecb0-4792-a45f-409697d77045', '1Me5dVRY9_08OELWTQQYKR1p90JrK_BqS', 'photos/migrated/SIG-20260824-0024_abb77505.jpg', 'image/jpeg', 1024, '1675963eecb04792a45f409697d77045')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('81342d2e-782f-4bae-9710-68a4435d45b3', '1675963e-ecb0-4792-a45f-409697d77045', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1fbec5fd-5349-4617-a8c3-35194263e9d4', '1Qwu5CEpSuhi-AllLLkxdaFYoEfj8SQHb', 'photos/migrated/SIG-20260825-0001_501a3c82.jpg', 'image/jpeg', 1024, '1fbec5fd53494617a8c335194263e9d4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('9440611a-b6de-4456-8abf-30f3c4cc029e', '1fbec5fd-5349-4617-a8c3-35194263e9d4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b20eb08a-743c-45ac-8534-abb196e7200e', '18bUgsrHxOc2aq1ILYzmY1740pVbbkNlb', 'photos/migrated/SIG-20260825-0002_8587f5fd.jpg', 'image/jpeg', 1024, 'b20eb08a743c45ac8534abb196e7200e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fa8f84b0-87b0-41ea-87a6-a174d0b3ff98', 'b20eb08a-743c-45ac-8534-abb196e7200e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c42bd7cf-fe61-49b4-ad58-553f645853da', '1SD18YLtUoJ76on9Qmn2u8RPw0wScvoSp', 'photos/migrated/SIG-20260826-0001_4f48c9f9.jpg', 'image/jpeg', 1024, 'c42bd7cffe6149b4ad58553f645853da')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fa80c701-35d6-4543-b011-24a3f1d91e19', 'c42bd7cf-fe61-49b4-ad58-553f645853da', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6d941859-06f1-4426-9c66-f257d1104839', '1-JnzgVacKgFgg2KvYd1KYLAPhSUq5e7p', 'photos/migrated/SIG-20260826-0002_ca749096.jpg', 'image/jpeg', 1024, '6d94185906f144269c66f257d1104839')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e3649e83-0945-49db-bf83-e3551befb1c6', '6d941859-06f1-4426-9c66-f257d1104839', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('12908757-08ac-425e-be22-647c60113ce3', '13Vk-kVjA4oAfg-ci8WE73JxCkEGsHLqS', 'photos/migrated/SIG-20260826-0003_824b7530.jpg', 'image/jpeg', 1024, '1290875708ac425ebe22647c60113ce3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d838974d-a976-4fdd-9a5d-f3462d9bc0f4', '12908757-08ac-425e-be22-647c60113ce3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('117a6e6a-7720-4a64-812c-d6fadf648d71', '1BHUAja04NqR15NuRWecSdyoOT2xEs1Be', 'photos/migrated/SIG-20260827-0001_c2273493.jpg', 'image/jpeg', 1024, '117a6e6a77204a64812cd6fadf648d71')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('92aeddef-5ffb-4b47-80e1-a119e9240ba0', '117a6e6a-7720-4a64-812c-d6fadf648d71', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('50940531-3e55-462d-b57d-130624d82ed6', '1OWDvcVBn_0siW_KmgdVBtxJmVLxSca06', 'photos/migrated/SIG-20260827-0001_eb428f21.jpg', 'image/jpeg', 1024, '509405313e55462db57d130624d82ed6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('92aeddef-5ffb-4b47-80e1-a119e9240ba0', '50940531-3e55-462d-b57d-130624d82ed6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d2f8e291-3a6b-4b5e-b0ec-975914190032', '1rUkARMOeNyop7ffBS6CKGKwYnLV6yeNc', 'photos/migrated/SIG-20260827-0002_a4d95a8f.jpg', 'image/jpeg', 1024, 'd2f8e2913a6b4b5eb0ec975914190032')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1aa09d48-38dc-4161-a8e6-0902eea791cd', 'd2f8e291-3a6b-4b5e-b0ec-975914190032', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4681bb6f-9108-41c2-b941-d47a7615df53', '1Jed7bNXkVaLS00f9ltlCiIh87vuQ7plG', 'photos/migrated/SIG-20260827-0003_65edebbb.jpg', 'image/jpeg', 1024, '4681bb6f910841c2b941d47a7615df53')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6ccdaa14-7c04-4eea-acc8-f9f255f23923', '4681bb6f-9108-41c2-b941-d47a7615df53', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('fca2899c-35e5-4c04-96e8-9c8395545d75', '1mfgpwOdNw0i4o9Tyc4dtELhwfvVpvo_l', 'photos/migrated/SIG-20260827-0004_cadc7e8b.jpg', 'image/jpeg', 1024, 'fca2899c35e54c0496e89c8395545d75')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2ac53bae-c84a-4cec-9e2b-ef575d1a14c8', 'fca2899c-35e5-4c04-96e8-9c8395545d75', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('82cd4a72-e266-42b7-a51e-e0ae1887e246', '1h8RjYBDJw1boueRKRTBR_TDyKCeGetFn', 'photos/migrated/SIG-20260827-0005_fc46666b.jpg', 'image/jpeg', 1024, '82cd4a72e26642b7a51ee0ae1887e246')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c6dc4d42-2c23-4de5-b13c-d275dd89c9c6', '82cd4a72-e266-42b7-a51e-e0ae1887e246', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d67c3a8f-1915-4388-9e71-b166abcf9050', '1LhjDEdtgqFa8X7VEM2VKn2wVOnEW4X_j', 'photos/migrated/SIG-20260827-0005_2e5fc71f.jpg', 'image/jpeg', 1024, 'd67c3a8f191543889e71b166abcf9050')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c6dc4d42-2c23-4de5-b13c-d275dd89c9c6', 'd67c3a8f-1915-4388-9e71-b166abcf9050', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('867f4307-18b7-45ac-98e7-95bd604395e6', '1e2M_fGptrokEHCETBQbckhhxcdwxwqkO', 'photos/migrated/SIG-20260830-0011_E2E-FOTO.png', 'image/png', 1024, '867f430718b745ac98e795bd604395e6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3f3ef318-66d2-4f7c-b2b9-ab89eb5deb61', '867f4307-18b7-45ac-98e7-95bd604395e6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('758b59a1-0be1-4f88-86b9-05a5895b7ea9', '1MrMtXXbIwMKJnfRYuOOSqT-qqx7F42RD', 'photos/migrated/SIG-20260830-0012_E2E-FOTO.png', 'image/png', 1024, '758b59a10be14f8886b905a5895b7ea9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('adf5da28-655b-4c40-b6da-2464e7451bd8', '758b59a1-0be1-4f88-86b9-05a5895b7ea9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3317abc1-b765-411e-92c2-eecc66a99d0a', '1bUYVsxza9zAndpGCtgio2bmYrxC-gUbx', 'photos/migrated/SIG-20260830-0014_E2E-FOTO.png', 'image/png', 1024, '3317abc1b765411e92c2eecc66a99d0a')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a73dea68-cd0a-4ea2-aace-f96507fca5b3', '3317abc1-b765-411e-92c2-eecc66a99d0a', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('4afbdbc7-eb69-489b-8314-04fea887dfcd', '1zfNpU8_JYjQbrCnz1zccCVIXyvZ6I58a', 'photos/migrated/SIG-20260830-0016_E2E-FOTO.png', 'image/png', 1024, '4afbdbc7eb69489b831404fea887dfcd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c3eb016f-8a2c-4a27-9f2a-adcc54610f40', '4afbdbc7-eb69-489b-8314-04fea887dfcd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f8579b53-5fc5-4020-8a2b-f5e5188f194e', '15giYs4i9TpKqK3Aukv_WMsLEyie91cN4', 'photos/migrated/SIG-20260830-0018_E2E-FOTO.png', 'image/png', 1024, 'f8579b535fc540208a2bf5e5188f194e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('05073272-fe6d-4393-b953-5be1fd925d56', 'f8579b53-5fc5-4020-8a2b-f5e5188f194e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f624ec68-8c3c-4601-999c-5b560bda03eb', '1SdwnmfMhGH2A04Oehe8BNhElwNVXVMiS', 'photos/migrated/SIG-20260830-0020_E2E-FOTO.png', 'image/png', 1024, 'f624ec688c3c4601999c5b560bda03eb')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('556c113f-a3fd-4391-8fcd-554b74d01e28', 'f624ec68-8c3c-4601-999c-5b560bda03eb', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b8493989-c125-4b0e-aa2c-40dfad3bec41', '1dGJHEgtikR_Muol27G0WJ35BH9fmjIzX', 'photos/migrated/SIG-20260830-0022_E2E-FOTO.png', 'image/png', 1024, 'b8493989c1254b0eaa2c40dfad3bec41')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('4f8e0a69-ea1c-40b1-9ba2-e202261c5032', 'b8493989-c125-4b0e-aa2c-40dfad3bec41', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('41556194-f081-456e-bac4-2512194ee7e4', '1yJrhXrnSnAVV6b2GSd7RcbbhTorrX9cZ', 'photos/migrated/SIG-20260830-0024_E2E-FOTO.png', 'image/png', 1024, '41556194f081456ebac42512194ee7e4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('871357d2-6fb2-4d98-ba21-3698b3d33f6b', '41556194-f081-456e-bac4-2512194ee7e4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6fe0b914-1d88-46bd-a199-6628e79c98de', '1BelFEqmm1C3qYWjtKd6_VnF955ZVbf2w', 'photos/migrated/SIG-20260830-0026_E2E-FOTO.png', 'image/png', 1024, '6fe0b9141d8846bda1996628e79c98de')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1b62bec4-c784-45e6-bb15-780f1607ed0e', '6fe0b914-1d88-46bd-a199-6628e79c98de', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d0d42652-a9d8-4586-939b-954cb14f3724', '107jB5O9EKy0K8Bq62YL0g-ykU9kRCOYz', 'photos/migrated/SIG-20260830-0028_E2E-FOTO.png', 'image/png', 1024, 'd0d42652a9d84586939b954cb14f3724')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('b279e75b-89ad-4fdd-92db-e4595cf3a397', 'd0d42652-a9d8-4586-939b-954cb14f3724', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('02a22c08-1e16-4cb8-ad10-b742dea99fd2', '1UyBWryxXZORBCz9SVaCWJ5s5zPgXeVmf', 'photos/migrated/SIG-20260831-0001_6d30bff2.jpg', 'image/jpeg', 1024, '02a22c081e164cb8ad10b742dea99fd2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('90f43b77-d355-4ae8-8389-712dcb2d5d8b', '02a22c08-1e16-4cb8-ad10-b742dea99fd2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('07a0a2ed-174a-4018-9522-b7f87fef4dda', '1O_UaVoy7Uqa_K_ipA1Zgd0ONf3EylzJM', 'photos/migrated/SIG-20260831-0001_2fd9d735.jpg', 'image/jpeg', 1024, '07a0a2ed174a40189522b7f87fef4dda')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('90f43b77-d355-4ae8-8389-712dcb2d5d8b', '07a0a2ed-174a-4018-9522-b7f87fef4dda', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('bc5a6e45-7d9a-4614-9921-7988142f5ff9', '1-zKtzsLH_GY6sbdIhJk-aia9krbETBqH', 'photos/migrated/SIG-20260831-0002_7b85fe61.jpg', 'image/jpeg', 1024, 'bc5a6e457d9a461499217988142f5ff9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c33996e1-64c5-4eb0-8083-84e848d4709f', 'bc5a6e45-7d9a-4614-9921-7988142f5ff9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('35a3fea2-24b6-4abe-b0d7-8993d712bbd2', '12aRX1Pv-hItCo_xVwVRjzGxRI6E39yed', 'photos/migrated/SIG-20260831-0002_64f938e1.jpg', 'image/jpeg', 1024, '35a3fea224b64abeb0d78993d712bbd2')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c33996e1-64c5-4eb0-8083-84e848d4709f', '35a3fea2-24b6-4abe-b0d7-8993d712bbd2', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('cf315abe-3630-47ab-8d5e-be9ad6d7cc4b', '17wMeJ4Uw1X39f7OlMme25a38myUbGHyd', 'photos/migrated/SIG-20260831-0003_58e23247.jpg', 'image/jpeg', 1024, 'cf315abe363047ab8d5ebe9ad6d7cc4b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e2876209-bfb9-4e6e-9735-c50728d64e5f', 'cf315abe-3630-47ab-8d5e-be9ad6d7cc4b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f599e2f7-9022-4711-b7d6-583229bdbf08', '1TlStd-wA8wD0eFnMLX90RWYrnNSRy7Ay', 'photos/migrated/SIG-20260831-0003_784e171a.jpg', 'image/jpeg', 1024, 'f599e2f790224711b7d6583229bdbf08')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e2876209-bfb9-4e6e-9735-c50728d64e5f', 'f599e2f7-9022-4711-b7d6-583229bdbf08', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c1fc71af-731a-454c-a585-db9be83c0e13', '1VnuwAiaIp4n_FI5KpiMzaKyuEr8ttPdt', 'photos/migrated/SIG-20260831-0004_459ce845.jpg', 'image/jpeg', 1024, 'c1fc71af731a454ca585db9be83c0e13')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8f07dc09-0cd4-47be-b8f3-3a3ccb20c5b2', 'c1fc71af-731a-454c-a585-db9be83c0e13', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('eb09c8a7-78fc-493e-bc7e-e12b50e907d0', '1xfLygkoGXN8qwbSeVVWcZMrXK9Ibro9M', 'photos/migrated/SIG-20260831-0004_e6ce9ca1.jpg', 'image/jpeg', 1024, 'eb09c8a778fc493ebc7ee12b50e907d0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('8f07dc09-0cd4-47be-b8f3-3a3ccb20c5b2', 'eb09c8a7-78fc-493e-bc7e-e12b50e907d0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('99ad53d9-dc2d-4245-b105-c4dc5c7f0124', '1WelOsULE0J1jOYtBEUGhhTWZgB4CLBL_', 'photos/migrated/SIG-20260831-0005_61ed728a.jpg', 'image/jpeg', 1024, '99ad53d9dc2d4245b105c4dc5c7f0124')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6408de1a-324a-4be4-b9ff-2a07078a311e', '99ad53d9-dc2d-4245-b105-c4dc5c7f0124', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('81cba9e2-5f5b-441f-9aee-341a087eed4e', '199tHJvw6bf0QJii9_2sRmRvY6yVDCoT9', 'photos/migrated/SIG-20260831-0005_5d951431.jpg', 'image/jpeg', 1024, '81cba9e25f5b441f9aee341a087eed4e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6408de1a-324a-4be4-b9ff-2a07078a311e', '81cba9e2-5f5b-441f-9aee-341a087eed4e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('bda81158-dccd-443f-9234-a02190fd0049', '1tvk_9IhEr5hrqm7pDlhdV02vHd6Ig3w-', 'photos/migrated/SIG-20260831-0006_78b24f59.jpg', 'image/jpeg', 1024, 'bda81158dccd443f9234a02190fd0049')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('bda47682-f10e-4b0a-9c10-c4d178af0901', 'bda81158-dccd-443f-9234-a02190fd0049', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('28a88552-baf2-4dee-99a3-e0fa8864aaff', '18RjLBUVHEFU6tab1e58t769vMCSuhP6K', 'photos/migrated/SIG-20260831-0007_8f891055.jpg', 'image/jpeg', 1024, '28a88552baf24dee99a3e0fa8864aaff')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a4f79da-d7ac-4f4d-b6ea-bd0fdf7f6952', '28a88552-baf2-4dee-99a3-e0fa8864aaff', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1a8153ac-1aaa-4361-97f1-8a5275303016', '1lIAI4w1Tw3nJxA0yJ7ECT-9m9jTbvb-M', 'photos/migrated/SIG-20260831-0007_d23819c9.jpg', 'image/jpeg', 1024, '1a8153ac1aaa436197f18a5275303016')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a4f79da-d7ac-4f4d-b6ea-bd0fdf7f6952', '1a8153ac-1aaa-4361-97f1-8a5275303016', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f312532a-c676-4226-b42e-eee352fc67b9', '1NppX0xnr_p5hwex7TVWiGCIZUMQE-MEG', 'photos/migrated/SIG-20260831-0008_28e80ab8.jpg', 'image/jpeg', 1024, 'f312532ac6764226b42eeee352fc67b9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0ae1eeb9-60a1-4982-99f3-37e0a9d42cdf', 'f312532a-c676-4226-b42e-eee352fc67b9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('b2cf25a5-a4d5-4d55-9fb2-cc43464219f9', '1Zw73qNBxJ_HTZq8-7bq5VwrUhcDvuBRO', 'photos/migrated/SIG-20260831-0008_6ed27664.jpg', 'image/jpeg', 1024, 'b2cf25a5a4d54d559fb2cc43464219f9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0ae1eeb9-60a1-4982-99f3-37e0a9d42cdf', 'b2cf25a5-a4d5-4d55-9fb2-cc43464219f9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('81de503f-e85e-4f7e-8e8e-ac70b44f9bd9', '1KzEAOnOcuhS2nnIOkOESV_bQFQ0gvWpP', 'photos/migrated/SIG-20260831-0009_8ea4e24d.jpg', 'image/jpeg', 1024, '81de503fe85e4f7e8e8eac70b44f9bd9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5aa3bdb7-89dc-448e-b890-48287705ba13', '81de503f-e85e-4f7e-8e8e-ac70b44f9bd9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('024f9f27-15b6-4389-b878-27f708810582', '1wlK8piX3aJ88_sIAxhOCWRwaBqTg7QdR', 'photos/migrated/SIG-20260831-0010_1d9d6c77.jpg', 'image/jpeg', 1024, '024f9f2715b64389b87827f708810582')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d5864e7c-3da3-41b0-91b6-567e3d09abfd', '024f9f27-15b6-4389-b878-27f708810582', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('48ba9c3c-7bd9-491a-8e8c-77d8c6e6d2b0', '12jJQaetXJnaJC7xaRLso65GLAE_DnBvw', 'photos/migrated/SIG-20260831-0010_41cf7956.jpg', 'image/jpeg', 1024, '48ba9c3c7bd9491a8e8c77d8c6e6d2b0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('d5864e7c-3da3-41b0-91b6-567e3d09abfd', '48ba9c3c-7bd9-491a-8e8c-77d8c6e6d2b0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7af48dc6-3dee-4ce0-a0e0-5885ec5901c3', '1nOlwaNSdyAVeZicILTfQdMR_7jTJsAjH', 'photos/migrated/SIG-20260831-0011_33174885.jpg', 'image/jpeg', 1024, '7af48dc63dee4ce0a0e05885ec5901c3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('bad56f88-b8a4-46cb-b1b8-ab0b3e8120ba', '7af48dc6-3dee-4ce0-a0e0-5885ec5901c3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ac5f323d-30fa-4a63-8168-df55100b039e', '1qf75u-adFpfFMNNWnZxSBczpRxGMidXP', 'photos/migrated/SIG-20260831-0012_42a483d3.jpg', 'image/jpeg', 1024, 'ac5f323d30fa4a638168df55100b039e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('43aa11f2-ae51-4c25-9202-55673da26862', 'ac5f323d-30fa-4a63-8168-df55100b039e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('be759391-a19d-4f5d-befa-97a372b274fd', '1sj9WVGfMJwS_K7vrLLeoCcUfYnT0GdMo', 'photos/migrated/SIG-20260831-0013_1ab9bee5.jpg', 'image/jpeg', 1024, 'be759391a19d4f5dbefa97a372b274fd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('450153cc-f13f-4b1d-bbc2-5bc168f4bb1e', 'be759391-a19d-4f5d-befa-97a372b274fd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('768792db-e31c-4237-a2d3-5fad0fcf04ca', '1sSwF0GKfmLL2eem-OKy7rGBiU1bdlht_', 'photos/migrated/SIG-20260831-0013_af26cd32.jpg', 'image/jpeg', 1024, '768792dbe31c4237a2d35fad0fcf04ca')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('450153cc-f13f-4b1d-bbc2-5bc168f4bb1e', '768792db-e31c-4237-a2d3-5fad0fcf04ca', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('60a73438-7a40-46b0-82f1-96857f9d550e', '1XrrV4KYOMKdMUQBjNa85pIfWk12qfVoG', 'photos/migrated/SIG-20260831-0014_3ebc1466.jpg', 'image/jpeg', 1024, '60a734387a4046b082f196857f9d550e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('7665ef1d-e4f6-450b-a325-97a2ca2ef7ec', '60a73438-7a40-46b0-82f1-96857f9d550e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('09e859fe-ea79-4318-8634-42ecfdeb6f30', '1wCZpUfor80e3fpQbjLZH1C9wEuwkBWUk', 'photos/migrated/SIG-20260831-0015_4338bbfc.jpg', 'image/jpeg', 1024, '09e859feea794318863442ecfdeb6f30')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e7097c4e-aae1-40e0-9f4a-6bc792d9fbec', '09e859fe-ea79-4318-8634-42ecfdeb6f30', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('27b783e4-0823-474e-a480-9b7b1eadfc0e', '18wsSwG7YB04xVJyqnHmJcogA0wR5MZ3S', 'photos/migrated/SIG-20260831-0015_92db3c3e.jpg', 'image/jpeg', 1024, '27b783e40823474ea4809b7b1eadfc0e')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e7097c4e-aae1-40e0-9f4a-6bc792d9fbec', '27b783e4-0823-474e-a480-9b7b1eadfc0e', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e234355c-1ea9-4a38-a6ba-6f79f0084451', '1S0aZSslfNhcFgCcz2kvi4evy5DGdJt5E', 'photos/migrated/SIG-20260831-0016_bf6e631c.jpg', 'image/jpeg', 1024, 'e234355c1ea94a38a6ba6f79f0084451')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6ca96caf-e4e4-4158-a578-4f92d307fdcd', 'e234355c-1ea9-4a38-a6ba-6f79f0084451', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('dbfb82e7-f174-49e3-8894-c87a035b2e12', '1peVvuNrPp4_1_WhjZRf4-U7nre1IDwTH', 'photos/migrated/SIG-20260831-0016_28dc6865.jpg', 'image/jpeg', 1024, 'dbfb82e7f17449e38894c87a035b2e12')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6ca96caf-e4e4-4158-a578-4f92d307fdcd', 'dbfb82e7-f174-49e3-8894-c87a035b2e12', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('48980f84-f224-4220-8128-25d3c480b994', '1c_kVSZtClMfK1pGGEOJ38NAvdkXAjzCF', 'photos/migrated/SIG-20260831-0017_c120c3f3.jpg', 'image/jpeg', 1024, '48980f84f2244220812825d3c480b994')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2e3bc11b-5a0f-4eb1-954e-3e6d3ba3abd0', '48980f84-f224-4220-8128-25d3c480b994', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('a90cbf86-e6dc-4dbf-819d-754319b7f01c', '1AMHWJ_Fb4IPj9sWEMHqFUgr0N-tM6ugC', 'photos/migrated/SIG-20260831-0017_a2405db0.jpg', 'image/jpeg', 1024, 'a90cbf86e6dc4dbf819d754319b7f01c')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2e3bc11b-5a0f-4eb1-954e-3e6d3ba3abd0', 'a90cbf86-e6dc-4dbf-819d-754319b7f01c', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('f46af368-1ca6-43d5-8054-b8c25ec98ce3', '1MOI8PII3nAp5NASkBRbv7-umhfUCefJI', 'photos/migrated/SIG-20260831-0018_421dd7c9.jpg', 'image/jpeg', 1024, 'f46af3681ca643d58054b8c25ec98ce3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3dc8bc57-acd2-4455-af9c-351eb2060908', 'f46af368-1ca6-43d5-8054-b8c25ec98ce3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('942d1068-84cc-44af-87a6-06c9d977c5c1', '1JvA0FUICel7LU0VL7OuIvkx68LwUqsiT', 'photos/migrated/SIG-20260831-0018_281986b6.jpg', 'image/jpeg', 1024, '942d106884cc44af87a606c9d977c5c1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3dc8bc57-acd2-4455-af9c-351eb2060908', '942d1068-84cc-44af-87a6-06c9d977c5c1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('3c84da1c-1b7d-4a58-8e18-9991c618c9a0', '1XP2Qhxrzd9rgiuJfwNyQQDZV-YlANBZP', 'photos/migrated/SIG-20260831-0019_499de206.jpg', 'image/jpeg', 1024, '3c84da1c1b7d4a588e189991c618c9a0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('55baadb7-eb96-452c-9694-d2d0b7549467', '3c84da1c-1b7d-4a58-8e18-9991c618c9a0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('572df2e7-40c9-4048-aeb7-b09bfa7669c6', '1z86e-tRe_Sc4t4gcVUGeKIWoNaOv1ndg', 'photos/migrated/SIG-20260831-0020_89f67227.jpg', 'image/jpeg', 1024, '572df2e740c94048aeb7b09bfa7669c6')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('91a988bd-0942-4c30-8d0e-55e03b50e282', '572df2e7-40c9-4048-aeb7-b09bfa7669c6', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e232a4b1-e237-41b2-9db0-635c9b2691a3', '1nUivUj_jJrAmOsVPnzc7UCvGKRFrUTvS', 'photos/migrated/SIG-20260831-0021_9af8944d.jpg', 'image/jpeg', 1024, 'e232a4b1e23741b29db0635c9b2691a3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c9724615-2872-4196-9570-7340f68f93a6', 'e232a4b1-e237-41b2-9db0-635c9b2691a3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8fef53b4-6f41-4091-9ae6-b4ca5cc5bfbe', '1jnJped1tqiNU2NpElWb6fZxAiZ7al1xh', 'photos/migrated/SIG-20260831-0021_e44b7dcf.jpg', 'image/jpeg', 1024, '8fef53b46f4140919ae6b4ca5cc5bfbe')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('c9724615-2872-4196-9570-7340f68f93a6', '8fef53b4-6f41-4091-9ae6-b4ca5cc5bfbe', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5271258c-d6e4-4c75-9ec4-cecbd9113624', '1eWyWH_OHjIeAmI6YqpkU28A4przcETQb', 'photos/migrated/SIG-20260831-0022_4a24591d.jpg', 'image/jpeg', 1024, '5271258cd6e44c759ec4cecbd9113624')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ed8cca96-f30f-4648-905c-9e14d43eeb8e', '5271258c-d6e4-4c75-9ec4-cecbd9113624', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1369c0b4-2487-4b71-9c98-6eee22eca8d1', '1K5prKcJUyUWdjew46xazkGVbtM4L1iGC', 'photos/migrated/SIG-20260831-0022_f2620282.jpg', 'image/jpeg', 1024, '1369c0b424874b719c986eee22eca8d1')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ed8cca96-f30f-4648-905c-9e14d43eeb8e', '1369c0b4-2487-4b71-9c98-6eee22eca8d1', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('de1b7a21-fff8-452f-95cd-7bfc9faac893', '1AqBSkgGrR5jl5NmaouAxTAp-FIKey6aq', 'photos/migrated/SIG-20260831-0023_e9b03a38.jpg', 'image/jpeg', 1024, 'de1b7a21fff8452f95cd7bfc9faac893')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e222fe62-566f-4d92-85ec-f306a091bc55', 'de1b7a21-fff8-452f-95cd-7bfc9faac893', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5ce49db0-830e-4f5a-b479-7777b6d924bd', '1Ze4tPLrcgK7BxOnMKJQGPuseP_hN6jVE', 'photos/migrated/SIG-20260831-0023_bf57640c.jpg', 'image/jpeg', 1024, '5ce49db0830e4f5ab4797777b6d924bd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('e222fe62-566f-4d92-85ec-f306a091bc55', '5ce49db0-830e-4f5a-b479-7777b6d924bd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c778bf58-7a86-4eb3-bd03-7186c914ccdd', '1RaYb6I5-RCUOTTRj_dtzoVXgWkb3RSzs', 'photos/migrated/SIG-20260831-0024_e738e19c.jpg', 'image/jpeg', 1024, 'c778bf587a864eb3bd037186c914ccdd')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f757b501-db5e-4eab-8a78-8b206a729e37', 'c778bf58-7a86-4eb3-bd03-7186c914ccdd', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('68bf2821-3c47-4bb0-bb5a-b72dd582db38', '1h9-EUWGZ8yLy92HsCOEsUz2zPeXMb8ly', 'photos/migrated/SIG-20260831-0024_38e268fb.jpg', 'image/jpeg', 1024, '68bf28213c474bb0bb5ab72dd582db38')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f757b501-db5e-4eab-8a78-8b206a729e37', '68bf2821-3c47-4bb0-bb5a-b72dd582db38', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('68110d1b-0ff4-4f91-912e-c49e7f048719', '1qeJZI9nMjcn2ACLKjkatMv2B2ai1mrfe', 'photos/migrated/SIG-20260831-0025_70f11200.jpg', 'image/jpeg', 1024, '68110d1b0ff44f91912ec49e7f048719')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ab40690d-2a00-4816-8cff-4f228d211229', '68110d1b-0ff4-4f91-912e-c49e7f048719', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8682d67d-28e7-4cec-a7fb-f6f72094321b', '11j5NQdbgpvqpMFFXxZwGy5Vtj8HtvFJO', 'photos/migrated/SIG-20260831-0025_9f6bd030.jpg', 'image/jpeg', 1024, '8682d67d28e74ceca7fbf6f72094321b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('ab40690d-2a00-4816-8cff-4f228d211229', '8682d67d-28e7-4cec-a7fb-f6f72094321b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('77153841-a17e-49d7-8463-2ebb12a2a9e0', '1D07b_1rHh0svKS3MJMSWRx_c65rYuo7y', 'photos/migrated/SIG-20260831-0026_e4780c5f.jpg', 'image/jpeg', 1024, '77153841a17e49d784632ebb12a2a9e0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('1072001a-9d7d-4fdc-b47f-77cd14b2302f', '77153841-a17e-49d7-8463-2ebb12a2a9e0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2abbb653-b853-444c-ac66-29c245b941f7', '1HfClJ_anaiySiDs3ZTKPgxJ1wAJigVh_', 'photos/migrated/SIG-20260831-0027_f0542c65.jpg', 'image/jpeg', 1024, '2abbb653b853444cac6629c245b941f7')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('942ebd87-5b55-4696-9354-37a3d67e521f', '2abbb653-b853-444c-ac66-29c245b941f7', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1d79d0e7-a801-43a7-bfce-02f1639351c3', '1uGHN3HmA8eVDn0ibo4C5BmjiWIyoYmIH', 'photos/migrated/SIG-20260831-0028_4a39227f.jpg', 'image/jpeg', 1024, '1d79d0e7a80143a7bfce02f1639351c3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fbe86c9c-7c84-41f2-9ed1-da856b16345c', '1d79d0e7-a801-43a7-bfce-02f1639351c3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('63039299-0059-4c55-ac94-8b4c424102ac', '13fAU01_REvyLFBQMGCZEDTw-kF1lC5Rp', 'photos/migrated/SIG-20260831-0028_94b9eea4.jpg', 'image/jpeg', 1024, '6303929900594c55ac948b4c424102ac')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('fbe86c9c-7c84-41f2-9ed1-da856b16345c', '63039299-0059-4c55-ac94-8b4c424102ac', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('7503be4d-73e4-4007-9386-2a0981f86384', '18Z_SNgdAKsS1wWjLxca_SG67fiGpPv-K', 'photos/migrated/SIG-20260831-0029_f458062f.jpg', 'image/jpeg', 1024, '7503be4d73e4400793862a0981f86384')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f1e2197a-a02d-4ed6-8d18-0f896763c8ce', '7503be4d-73e4-4007-9386-2a0981f86384', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0f0d9b10-7dc3-4d25-ac49-ab1c78f5a191', '1Hb5sqUy1BJNZYb0TFXjq_swaCP05CWrQ', 'photos/migrated/SIG-20260831-0029_6656594c.jpg', 'image/jpeg', 1024, '0f0d9b107dc34d25ac49ab1c78f5a191')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('f1e2197a-a02d-4ed6-8d18-0f896763c8ce', '0f0d9b10-7dc3-4d25-ac49-ab1c78f5a191', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c7572fb1-134c-4951-8459-1a98df62faa9', '1885Tz83oIk-y9qkWKRzG1gbZW1XIjOOs', 'photos/migrated/SIG-20260831-0030_8c63639a.jpg', 'image/jpeg', 1024, 'c7572fb1134c495184591a98df62faa9')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0d2aef6b-740b-4932-ad98-7333e85fc7fd', 'c7572fb1-134c-4951-8459-1a98df62faa9', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('55a95607-7f70-4ae2-bbd6-abb592eca93f', '1isbMx6hBklAUKtvMxDxkakcwlSxtcmm_', 'photos/migrated/SIG-20260831-0030_234c0087.jpg', 'image/jpeg', 1024, '55a956077f704ae2bbd6abb592eca93f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('0d2aef6b-740b-4932-ad98-7333e85fc7fd', '55a95607-7f70-4ae2-bbd6-abb592eca93f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('1cd6c900-db70-41dc-a768-b93f0a6f2544', '1jj7KFckQOPayAvuG3C4j1Y-wu8svQtfi', 'photos/migrated/SIG-20260831-0031_8c629552.jpg', 'image/jpeg', 1024, '1cd6c900db7041dca768b93f0a6f2544')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3c01defa-d6b2-481e-bc79-5ace88299339', '1cd6c900-db70-41dc-a768-b93f0a6f2544', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('47cbb79b-654c-4a44-be5a-eb11d707d7a0', '1Oh_zI-YYyyROjc6FDpifudQ2uJ-r2GBT', 'photos/migrated/SIG-20260831-0031_f1210c19.jpg', 'image/jpeg', 1024, '47cbb79b654c4a44be5aeb11d707d7a0')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('3c01defa-d6b2-481e-bc79-5ace88299339', '47cbb79b-654c-4a44-be5a-eb11d707d7a0', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e3ba4ef1-aa7c-4eb6-8d62-aeaa897535c4', '13wEExAx9AlOMjvGK1bJTYM4HxxZFo8jI', 'photos/migrated/SIG-20260831-0032_1ccf391a.jpg', 'image/jpeg', 1024, 'e3ba4ef1aa7c4eb68d62aeaa897535c4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a82ca66-73a9-4431-9527-707dc19d8683', 'e3ba4ef1-aa7c-4eb6-8d62-aeaa897535c4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('c99f7858-b408-4e41-ad24-d6db21760025', '1kIcBWmRVwnGrARxZoybsUdN68927RxcF', 'photos/migrated/SIG-20260831-0032_59806b64.jpg', 'image/jpeg', 1024, 'c99f7858b4084e41ad24d6db21760025')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2a82ca66-73a9-4431-9527-707dc19d8683', 'c99f7858-b408-4e41-ad24-d6db21760025', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ae829c4c-c398-40e8-b273-dc229741d23f', '1BC4oRyyfjgiUIsvHy7JHvV5z6OFQYi5x', 'photos/migrated/SIG-20260831-0033_b634ba3a.jpg', 'image/jpeg', 1024, 'ae829c4cc39840e8b273dc229741d23f')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('5aef456b-6d36-4095-877c-86a1c97ba9b8', 'ae829c4c-c398-40e8-b273-dc229741d23f', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('e9778d08-fdff-4e6a-a58e-2a4e14b93063', '1hPRK9APvR1fz2R7qSpuQdMiTzg8EcjWV', 'photos/migrated/SIG-20260831-0034_8f6243bc.jpg', 'image/jpeg', 1024, 'e9778d08fdff4e6aa58e2a4e14b93063')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6ee5f467-cb32-4023-b930-3d8470ac833e', 'e9778d08-fdff-4e6a-a58e-2a4e14b93063', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8168c2e2-61c2-4cec-b709-512ee5ed140b', '1Gc69dAoZNvZnfbE2PMdlVAjYlkLwzMwe', 'photos/migrated/SIG-20260831-0035_85b56d25.jpg', 'image/jpeg', 1024, '8168c2e261c24cecb709512ee5ed140b')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9a4444e-32c0-480d-b901-94f70a42f57f', '8168c2e2-61c2-4cec-b709-512ee5ed140b', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('752c7fcf-f775-4669-9ebf-cae633f3df64', '1qNsQDWotkCAFT08ocRr63OhIsraLTWiA', 'photos/migrated/SIG-20260831-0035_572d407c.jpg', 'image/jpeg', 1024, '752c7fcff77546699ebfcae633f3df64')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('a9a4444e-32c0-480d-b901-94f70a42f57f', '752c7fcf-f775-4669-9ebf-cae633f3df64', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('d311c1a5-51ae-4d9e-a019-6009f5152b14', '1pWNicq0gLOPyDtHw6JrVWOVk-H-kSIDS', 'photos/migrated/SIG-20260831-0036_fab3ae0f.jpg', 'image/jpeg', 1024, 'd311c1a551ae4d9ea0196009f5152b14')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('58653964-e548-4bc7-80b4-df266296809a', 'd311c1a5-51ae-4d9e-a019-6009f5152b14', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('bea55564-ee9d-4019-84bb-2658ff019753', '1Qcb4tTganQFR39856vOHunlosWUzqyvP', 'photos/migrated/SIG-20260831-0037_5c28db97.jpg', 'image/jpeg', 1024, 'bea55564ee9d401984bb2658ff019753')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2d3f1951-2414-4896-8ae2-2e57ae58d4f9', 'bea55564-ee9d-4019-84bb-2658ff019753', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('2db4f1b7-70b4-4761-abd6-486eca292e82', '15HHaq1sG5HHW10KzDPlFinp_RT64JCVm', 'photos/migrated/SIG-20260831-0038_6e6304c7.jpg', 'image/jpeg', 1024, '2db4f1b770b44761abd6486eca292e82')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('26bbcfdb-b45d-47e2-84bf-e048bbbcf244', '2db4f1b7-70b4-4761-abd6-486eca292e82', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('0fae69ea-15dc-487e-af11-b35830bebdf3', '1C9GTZIS1VBEFg4tz24_fbXzEc6YQ0lbs', 'photos/migrated/SIG-20260831-0038_235c5764.jpg', 'image/jpeg', 1024, '0fae69ea15dc487eaf11b35830bebdf3')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('26bbcfdb-b45d-47e2-84bf-e048bbbcf244', '0fae69ea-15dc-487e-af11-b35830bebdf3', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('5cabb6b1-55b6-45c4-9414-36b580647cb4', '1OILgGn6x-suFSBSqUU51zl_zoyHsLt-f', 'photos/migrated/SIG-20260831-0039_ce58961b.jpg', 'image/jpeg', 1024, '5cabb6b155b645c4941436b580647cb4')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2907c1d6-5139-4ad8-b2c7-76827984a086', '5cabb6b1-55b6-45c4-9414-36b580647cb4', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('ddb37e09-f572-47da-8bf9-3b9da0ebfd07', '1rjwa0UbpSVm4-f9DDuhhhuhu8wPXD_4X', 'photos/migrated/SIG-20260831-0039_bf659758.jpg', 'image/jpeg', 1024, 'ddb37e09f57247da8bf93b9da0ebfd07')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('2907c1d6-5139-4ad8-b2c7-76827984a086', 'ddb37e09-f572-47da-8bf9-3b9da0ebfd07', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('8044c018-1518-4be7-8c9c-f6b4094e67af', '1sdWyTENkwuK2-O_hJpe5k0sQosx0pmmd', 'photos/migrated/SIG-20260831-0040_3452c24b.jpg', 'image/jpeg', 1024, '8044c01815184be78c9cf6b4094e67af')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6f86fadd-d84d-4ab0-8745-90e213452808', '8044c018-1518-4be7-8c9c-f6b4094e67af', true)
ON CONFLICT DO NOTHING;
INSERT INTO media_assets (id, legacy_drive_id, storage_key, mime_type, size_bytes, sha256)
VALUES ('6fc73eae-d596-48a7-92f1-0888767e4016', '1IgSwMgW52hMtVQrk6II1j5-YTJAqqUbx', 'photos/migrated/SIG-20260831-0040_9bdd9306.jpg', 'image/jpeg', 1024, '6fc73eaed59648a792f10888767e4016')
ON CONFLICT DO NOTHING;
INSERT INTO signage_media (signage_id, media_id, is_primary)
VALUES ('6f86fadd-d84d-4ab0-8745-90e213452808', '6fc73eae-d596-48a7-92f1-0888767e4016', true)
ON CONFLICT DO NOTHING;
