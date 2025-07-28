-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INT REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de rutas
CREATE TABLE IF NOT EXISTS rutas (
    id SERIAL PRIMARY KEY,
    numero_identificador VARCHAR(20) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Preventa', 'Reparto', 'Vending', 'Auditoría', 'Convencional')),
    descripcion TEXT,
    vendedor_id INT REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Inactiva', 'Mantenimiento')),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    rfc VARCHAR(13),
    latitud DECIMAL(10, 7),
    longitud DECIMAL(10, 7),
    ruta_id INT REFERENCES rutas(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    precio DECIMAL(10, 2) NOT NULL,
    costo DECIMAL(10, 2),
    unidad_medida VARCHAR(20) DEFAULT 'PZA',
    codigo_barras VARCHAR(50),
    tipo_producto VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inventarios
CREATE TABLE IF NOT EXISTS inventarios (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id),
    ubicacion VARCHAR(50) DEFAULT 'ALMACEN',
    cantidad INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 1000,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE,
    cliente_id INT REFERENCES clientes(id),
    usuario_id INT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    descuento DECIMAL(10, 2) DEFAULT 0,
    impuestos DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    estatus VARCHAR(20) DEFAULT 'Pendiente' CHECK (estatus IN ('Pendiente', 'Confirmado', 'En Ruta', 'Entregado', 'Cancelado')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de detalles de pedidos
CREATE TABLE IF NOT EXISTS pedidos_detalle (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
-- Roles
INSERT INTO roles (nombre, descripcion) VALUES 
('Administrador', 'Acceso completo al sistema'),
('Vendedor', 'Acceso a ventas y pedidos'),
('Supervisor', 'Supervisión de rutas y vendedores')
ON CONFLICT (nombre) DO NOTHING;

-- Usuarios
INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES 
('Juan Pérez', 'juan@cdf.com', 'hashed_password_123', 1),
('María García', 'maria@cdf.com', 'hashed_password_456', 2),
('Carlos López', 'carlos@cdf.com', 'hashed_password_789', 2),
('Ana Rodríguez', 'ana@cdf.com', 'hashed_password_012', 3)
ON CONFLICT (correo) DO NOTHING;

-- Rutas
INSERT INTO rutas (numero_identificador, nombre, tipo, descripcion, vendedor_id, activa) VALUES 
('CV-0001', 'Ruta Centro', 'Convencional', 'Zona centro de la ciudad', 2, true),
('CV-0002', 'Ruta Norte', 'Convencional', 'Zona norte de la ciudad', 3, true),
('CV-0003', 'Ruta Sur', 'Convencional', 'Zona sur de la ciudad', 2, true),
('CV-0004', 'Ruta Oriente', 'Convencional', 'Zona oriente industrial', 3, true),
('PV-0001', 'Ruta Preventa Centro', 'Preventa', 'Preventa zona centro', NULL, true)
ON CONFLICT (numero_identificador) DO NOTHING;

-- Clientes
INSERT INTO clientes (nombre, direccion, telefono, correo, ruta_id, latitud, longitud, activo) VALUES 
('Tienda El Sol', 'Av. Principal 123, Col. Centro, CP 01000, Ciudad de México, CDMX', '555-0101', 'contacto@tiendaelsol.com', 1, 19.432608, -99.133209, true),
('Supermercado Luna', 'Calle Comercio 456, Col. Norte, CP 02000, Ciudad de México, CDMX', '555-0102', 'info@superluna.com', 2, 19.445123, -99.125456, true),
('Abarrotes Central', 'Plaza Mayor 789, Col. Sur, CP 03000, Ciudad de México, CDMX', '555-0103', 'ventas@central.com', 3, 19.420456, -99.140789, true),
('Minisuper Estrella', 'Av. Reforma 321, Col. Norte, CP 02100, Ciudad de México, CDMX', '555-0104', 'admin@estrella.com', 2, 19.450123, -99.120456, true),
('Tienda La Esquina', 'Calle Juárez 654, Col. Centro, CP 01100, Ciudad de México, CDMX', '555-0105', 'contacto@esquina.com', 1, 19.435789, -99.130123, true),
('Súper Mercado Norte', 'Blvd. Norte 987, Col. Norte, CP 02200, Ciudad de México, CDMX', '555-0106', 'ventas@supernorte.com', 2, 19.460456, -99.115789, true),
('Abarrotes El Sur', 'Av. Sur 147, Col. Sur, CP 03100, Ciudad de México, CDMX', '555-0107', 'info@elsur.com', 3, 19.415123, -99.145456, true),
('Minisuper Central', 'Plaza Central 258, Col. Centro, CP 01200, Ciudad de México, CDMX', '555-0108', 'admin@minicentral.com', 1, 19.430456, -99.135789, true)
ON CONFLICT DO NOTHING;

-- Productos
INSERT INTO productos (nombre, sku, categoria, precio, tipo_producto, descripcion, activo) VALUES 
('Coca Cola 600ml', 'CC600', 'Bebidas', 15.50, 'Bebida', 'Refresco de cola 600ml', true),
('Sabritas Original', 'SAB001', 'Snacks', 18.00, 'Snack', 'Papas fritas sabor original', true),
('Agua Bonafont 1L', 'BON1L', 'Bebidas', 12.00, 'Bebida', 'Agua purificada 1 litro', true),
('Doritos Nacho', 'DOR001', 'Snacks', 22.00, 'Snack', 'Tortillas de maíz sabor nacho', true),
('Pepsi 600ml', 'PEP600', 'Bebidas', 15.00, 'Bebida', 'Refresco de cola Pepsi', true),
('Cheetos Flamin Hot', 'CHE001', 'Snacks', 20.00, 'Snack', 'Frituras de maíz picantes', true),
('Sprite 600ml', 'SPR600', 'Bebidas', 15.00, 'Bebida', 'Refresco de limón', true),
('Ruffles Original', 'RUF001', 'Snacks', 19.00, 'Snack', 'Papas onduladas original', true),
('Fanta Naranja 600ml', 'FAN600', 'Bebidas', 15.00, 'Bebida', 'Refresco sabor naranja', true),
('Takis Fuego', 'TAK001', 'Snacks', 23.00, 'Snack', 'Rollitos de maíz picantes', true)
ON CONFLICT (sku) DO NOTHING;

-- Inventarios
INSERT INTO inventarios (producto_id, cantidad, ubicacion, stock_minimo, stock_maximo) VALUES 
(1, 150, 'Almacén Principal', 20, 500),
(2, 200, 'Almacén Principal', 30, 400),
(3, 300, 'Almacén Principal', 50, 600),
(4, 180, 'Almacén Principal', 25, 350),
(5, 120, 'Almacén Principal', 20, 400),
(6, 160, 'Almacén Principal', 30, 300),
(7, 140, 'Almacén Principal', 20, 400),
(8, 190, 'Almacén Principal', 25, 350),
(9, 110, 'Almacén Principal', 20, 400),
(10, 170, 'Almacén Principal', 30, 300)
ON CONFLICT DO NOTHING;

-- Pedidos de ejemplo
INSERT INTO pedidos (numero_pedido, cliente_id, usuario_id, fecha, total, estatus) VALUES 
('PED-001', 1, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', 150.50, 'Entregado'),
('PED-002', 2, 3, CURRENT_TIMESTAMP - INTERVAL '2 hours', 320.75, 'En Ruta'),
('PED-003', 3, 2, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 89.25, 'Pendiente'),
('PED-004', 4, 3, CURRENT_TIMESTAMP - INTERVAL '3 days', 245.00, 'Entregado'),
('PED-005', 5, 2, CURRENT_TIMESTAMP - INTERVAL '1 hour', 67.80, 'Confirmado')
ON CONFLICT (numero_pedido) DO NOTHING;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_ruta ON clientes(ruta_id);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha);
CREATE INDEX IF NOT EXISTS idx_pedidos_estatus ON pedidos(estatus);
CREATE INDEX IF NOT EXISTS idx_inventarios_producto ON inventarios(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_rutas_activa ON rutas(activa);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a las tablas que tienen updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
DROP TRIGGER IF EXISTS update_rutas_updated_at ON rutas;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rutas_updated_at BEFORE UPDATE ON rutas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
