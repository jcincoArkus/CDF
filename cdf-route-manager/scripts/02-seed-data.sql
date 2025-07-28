-- Insertar roles
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Vendedor'),
('Supervisor');

-- Insertar usuarios
INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES 
('Juan Pérez', 'juan@cdf.com', 'hashed_password', 1),
('María García', 'maria@cdf.com', 'hashed_password', 2),
('Carlos López', 'carlos@cdf.com', 'hashed_password', 2),
('Ana Rodríguez', 'ana@cdf.com', 'hashed_password', 3);

-- Insertar rutas
INSERT INTO rutas (nombre, tipo, descripcion) VALUES 
('Ruta Norte', 'Convencional', 'Zona norte de la ciudad'),
('Ruta Sur', 'Convencional', 'Zona sur de la ciudad'),
('Ruta Centro', 'Convencional', 'Centro histórico y comercial'),
('Ruta Oriente', 'Convencional', 'Zona oriente industrial');

-- Insertar clientes
INSERT INTO clientes (nombre, direccion, telefono, ruta_id, latitud, longitud) VALUES 
('Tienda El Sol', 'Av. Principal 123, Centro', '555-0101', 3, 19.432608, -99.133209),
('Supermercado Luna', 'Calle Comercio 456, Norte', '555-0102', 1, 19.445123, -99.125456),
('Abarrotes Central', 'Plaza Mayor 789, Sur', '555-0103', 2, 19.420456, -99.140789),
('Minisuper Estrella', 'Av. Reforma 321, Norte', '555-0104', 1, 19.450123, -99.120456),
('Tienda La Esquina', 'Calle Juárez 654, Centro', '555-0105', 3, 19.435789, -99.130123),
('Súper Mercado Norte', 'Blvd. Norte 987, Norte', '555-0106', 1, 19.460456, -99.115789),
('Abarrotes El Sur', 'Av. Sur 147, Sur', '555-0107', 2, 19.415123, -99.145456),
('Minisuper Central', 'Plaza Central 258, Centro', '555-0108', 3, 19.430456, -99.135789);

-- Insertar productos
INSERT INTO productos (nombre, sku, categoria, precio, tipo_producto) VALUES 
('Coca Cola 600ml', 'CC600', 'Bebidas', 15.50, 'Bebida'),
('Sabritas Original', 'SAB001', 'Snacks', 18.00, 'Snack'),
('Agua Bonafont 1L', 'BON1L', 'Bebidas', 12.00, 'Bebida'),
('Doritos Nacho', 'DOR001', 'Snacks', 22.00, 'Snack'),
('Pepsi 600ml', 'PEP600', 'Bebidas', 15.00, 'Bebida'),
('Cheetos Flamin Hot', 'CHE001', 'Snacks', 20.00, 'Snack'),
('Sprite 600ml', 'SPR600', 'Bebidas', 15.00, 'Bebida'),
('Ruffles Original', 'RUF001', 'Snacks', 19.00, 'Snack'),
('Fanta Naranja 600ml', 'FAN600', 'Bebidas', 15.00, 'Bebida'),
('Takis Fuego', 'TAK001', 'Snacks', 23.00, 'Snack');

-- Insertar inventarios
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
(10, 170, 'Almacén Principal', 30, 300);
