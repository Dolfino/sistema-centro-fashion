-- ==============================================================================
-- SCHEMA INICIAL - PLATAFORMA MALL (SINALIZAÇÃO DO MALL / CENTRO FASHION)
-- Versão: 1.0.1 (PostgreSQL 16)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';

-- 1. ESTRUTURA DE USUÁRIOS E SEGURANÇA
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_role VARCHAR(50) NOT NULL DEFAULT 'INSPECTOR',
    active BOOLEAN NOT NULL DEFAULT true,
    default_sector VARCHAR(100),
    pin_hash VARCHAR(255),
    pin_salt VARCHAR(255),
    login_attempts INT NOT NULL DEFAULT 0,
    blocked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- 2. CARTOGRAFIA, PLANOS E SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    color_hex VARCHAR(10) NOT NULL DEFAULT '#000000',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS floor_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    floor_level INT NOT NULL DEFAULT 1,
    sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
    scale_pixels_per_meter NUMERIC(10, 4) DEFAULT 1.0,
    width_pixels INT NOT NULL DEFAULT 1920,
    height_pixels INT NOT NULL DEFAULT 1080,
    svg_media_id UUID,
    raster_media_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logical_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    area_type VARCHAR(50) NOT NULL DEFAULT 'CORRIDOR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS corridors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commercial_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    space_type VARCHAR(50) NOT NULL DEFAULT 'BOX',
    lat NUMERIC(10, 8),
    lng NUMERIC(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. SINALIZAÇÃO E ATIVOS
CREATE TABLE IF NOT EXISTS signage_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legacy_id VARCHAR(100),
    asset_code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    dimensions VARCHAR(100),
    material VARCHAR(100),
    conservation_status VARCHAR(50) NOT NULL DEFAULT 'GOOD',
    lifecycle_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    installation_date DATE,
    validity_date DATE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_signage_assets_code ON signage_assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_signage_assets_status ON signage_assets(lifecycle_status);

CREATE TABLE IF NOT EXISTS signage_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signage_id UUID NOT NULL REFERENCES signage_assets(id) ON DELETE CASCADE,
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE CASCADE,
    logical_area_id UUID REFERENCES logical_areas(id),
    corridor_id UUID REFERENCES corridors(id),
    commercial_space_id UUID REFERENCES commercial_spaces(id),
    normalized_x NUMERIC(10, 6) NOT NULL DEFAULT 0.5,
    normalized_y NUMERIC(10, 6) NOT NULL DEFAULT 0.5,
    lat NUMERIC(10, 8),
    lng NUMERIC(11, 8),
    human_location_text TEXT,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_signage_positions_signage ON signage_positions(signage_id);

-- 4. FOTOS E ARQUIVOS MÍDIA (MINIO S3)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_media_id UUID UNIQUE,
    legacy_drive_id VARCHAR(255),
    storage_key VARCHAR(512) NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
    size_bytes BIGINT NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    device_id VARCHAR(255),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_assets_sha256 ON media_assets(sha256);

CREATE TABLE IF NOT EXISTS signage_media (
    signage_id UUID NOT NULL REFERENCES signage_assets(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (signage_id, media_id)
);

-- 5. INSPEÇÕES E EVENTOS DE CAMPO
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_inspection_id UUID UNIQUE NOT NULL,
    signage_id UUID NOT NULL REFERENCES signage_assets(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id),
    conservation_state VARCHAR(50) NOT NULL,
    condition_notes TEXT,
    recommended_action VARCHAR(100),
    next_inspection_at DATE,
    device_id VARCHAR(255) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inspections_signage ON inspections(signage_id);
CREATE INDEX IF NOT EXISTS idx_inspections_client_id ON inspections(client_inspection_id);

CREATE TABLE IF NOT EXISTS inspection_media (
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    PRIMARY KEY (inspection_id, media_id)
);

CREATE TABLE IF NOT EXISTS pending_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signage_id UUID REFERENCES signage_assets(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES inspections(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. AUDITORIA E LOG DE SINCRONIZAÇÃO OUTBOX
CREATE TABLE IF NOT EXISTS outbox_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(255) NOT NULL,
    client_mutation_id UUID UNIQUE NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SYNCED',
    conflict_resolution TEXT,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbox_device ON outbox_sync_log(device_id);
