-- Actualizar la tabla de rutas para incluir los nuevos campos
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS numero_identificador VARCHAR(20) UNIQUE;
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Activa';
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS vendedor_id INTEGER REFERENCES usuarios(id);
ALTER TABLE rutas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Actualizar los tipos de ruta existentes si es necesario
UPDATE rutas SET tipo = 'Convencional' WHERE tipo IS NULL OR tipo = '';

-- Generar números identificadores para rutas existentes
DO $$
DECLARE
    ruta_record RECORD;
    prefijo VARCHAR(2);
    numero_id VARCHAR(20);
BEGIN
    FOR ruta_record IN SELECT id, tipo FROM rutas WHERE numero_identificador IS NULL LOOP
        CASE ruta_record.tipo
            WHEN 'Preventa' THEN prefijo := 'PV';
            WHEN 'Reparto' THEN prefijo := 'RP';
            WHEN 'Vending' THEN prefijo := 'VD';
            WHEN 'Auditoría' THEN prefijo := 'AU';
            WHEN 'Convencional' THEN prefijo := 'CV';
            ELSE prefijo := 'CV';
        END CASE;
        
        numero_id := prefijo || '-' || LPAD(ruta_record.id::TEXT, 4, '0');
        
        UPDATE rutas 
        SET numero_identificador = numero_id 
        WHERE id = ruta_record.id;
    END LOOP;
END $$;

-- Insertar datos de ejemplo para los nuevos tipos de ruta
INSERT INTO rutas (nombre, tipo, descripcion, numero_identificador, estado, created_at, updated_at) VALUES
('Ruta Preventa Norte', 'Preventa', 'Toma de pedidos anticipados zona norte', 'PV-0101', 'Activa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruta Reparto Centro', 'Reparto', 'Entrega de productos zona centro', 'RP-0102', 'Activa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruta Vending Plaza', 'Vending', 'Gestión de máquinas expendedoras en plazas comerciales', 'VD-0103', 'Activa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruta Auditoría General', 'Auditoría', 'Supervisión y control de calidad en todas las zonas', 'AU-0104', 'Activa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ruta Convencional Sur', 'Convencional', 'Operaciones estándar zona sur', 'CV-0105', 'Activa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (numero_identificador) DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_rutas_tipo ON rutas(tipo);
CREATE INDEX IF NOT EXISTS idx_rutas_estado ON rutas(estado);
CREATE INDEX IF NOT EXISTS idx_rutas_numero_identificador ON rutas(numero_identificador);
CREATE INDEX IF NOT EXISTS idx_rutas_vendedor_id ON rutas(vendedor_id);

-- Actualizar algunos clientes para que estén asignados a las nuevas rutas
UPDATE clientes SET ruta_id = (SELECT id FROM rutas WHERE numero_identificador = 'PV-0101' LIMIT 1) WHERE id IN (1, 2, 3);
UPDATE clientes SET ruta_id = (SELECT id FROM rutas WHERE numero_identificador = 'RP-0102' LIMIT 1) WHERE id IN (4, 5, 6);
UPDATE clientes SET ruta_id = (SELECT id FROM rutas WHERE numero_identificador = 'VD-0103' LIMIT 1) WHERE id IN (7, 8);
UPDATE clientes SET ruta_id = (SELECT id FROM rutas WHERE numero_identificador = 'AU-0104' LIMIT 1) WHERE id IN (9, 10);
UPDATE clientes SET ruta_id = (SELECT id FROM rutas WHERE numero_identificador = 'CV-0105' LIMIT 1) WHERE id IN (11, 12, 13, 14, 15);
