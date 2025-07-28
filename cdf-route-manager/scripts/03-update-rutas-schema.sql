-- Agregar campos adicionales a la tabla rutas si no existen
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS activa BOOLEAN DEFAULT true;

-- Agregar campo activo a clientes si no existe
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Agregar campo activo a productos si no existe
ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Agregar campos de stock mínimo y máximo a inventarios si no existen
ALTER TABLE inventarios ADD COLUMN IF NOT EXISTS stock_minimo INT DEFAULT 10;
ALTER TABLE inventarios ADD COLUMN IF NOT EXISTS stock_maximo INT DEFAULT 1000;
