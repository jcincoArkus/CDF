-- Crear tabla de movimientos de inventario si no existe
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
    cantidad INT NOT NULL,
    cantidad_anterior INT NOT NULL,
    cantidad_nueva INT NOT NULL,
    motivo TEXT,
    usuario_id INT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actualizar tabla inventarios para incluir stock mínimo y máximo
ALTER TABLE inventarios 
ADD COLUMN IF NOT EXISTS stock_minimo INT DEFAULT 10,
ADD COLUMN IF NOT EXISTS stock_maximo INT DEFAULT 1000;

-- Actualizar inventarios existentes con stock mínimo y máximo
UPDATE inventarios SET 
    stock_minimo = CASE 
        WHEN producto_id = 1 THEN 20
        WHEN producto_id = 2 THEN 30
        WHEN producto_id = 3 THEN 50
        ELSE 15
    END,
    stock_maximo = CASE 
        WHEN producto_id = 1 THEN 500
        WHEN producto_id = 2 THEN 400
        WHEN producto_id = 3 THEN 600
        ELSE 300
    END;

-- Insertar productos adicionales para el inventario
INSERT INTO productos (nombre, sku, categoria, precio, tipo_producto) VALUES
('Doritos Nacho', 'DOR001', 'Snacks', 22.00, 'Snack'),
('Pepsi 600ml', 'PEP600', 'Bebidas', 15.00, 'Bebida'),
('Cheetos Flamin Hot', 'CHE001', 'Snacks', 20.00, 'Snack'),
('Sprite 600ml', 'SPR600', 'Bebidas', 15.00, 'Bebida'),
('Ruffles Original', 'RUF001', 'Snacks', 19.00, 'Snack')
ON CONFLICT (sku) DO NOTHING;

-- Insertar inventarios para productos adicionales
INSERT INTO inventarios (producto_id, cantidad, ubicacion, stock_minimo, stock_maximo) 
SELECT p.id, 
    CASE 
        WHEN p.sku = 'DOR001' THEN 15
        WHEN p.sku = 'PEP600' THEN 8
        WHEN p.sku = 'CHE001' THEN 204
        WHEN p.sku = 'SPR600' THEN 180
        WHEN p.sku = 'RUF001' THEN 229
    END,
    'Almacén Principal',
    CASE 
        WHEN p.sku IN ('DOR001', 'RUF001') THEN 25
        WHEN p.sku = 'PEP600' THEN 20
        WHEN p.sku = 'CHE001' THEN 30
        WHEN p.sku = 'SPR600' THEN 20
    END,
    CASE 
        WHEN p.sku IN ('DOR001', 'RUF001') THEN 350
        WHEN p.sku = 'PEP600' THEN 400
        WHEN p.sku = 'CHE001' THEN 300
        WHEN p.sku = 'SPR600' THEN 400
    END
FROM productos p 
WHERE p.sku IN ('DOR001', 'PEP600', 'CHE001', 'SPR600', 'RUF001')
ON CONFLICT DO NOTHING;

-- Insertar movimientos de inventario de ejemplo
INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, cantidad_anterior, cantidad_nueva, motivo, usuario_id) VALUES
-- Movimientos para Coca Cola
(1, 'entrada', 100, 50, 150, 'Restock semanal', 1),
(1, 'salida', 10, 150, 140, 'Venta pedido #1', 2),
(1, 'ajuste', 10, 140, 150, 'Ajuste por conteo físico', 1),

-- Movimientos para Sabritas
(2, 'entrada', 150, 50, 200, 'Restock semanal', 1),
(2, 'salida', 8, 200, 192, 'Venta pedido #1', 2),

-- Movimientos para Agua Bonafont
(3, 'entrada', 200, 100, 300, 'Restock semanal', 1),
(3, 'salida', 12, 300, 288, 'Venta pedido #2', 2),

-- Movimientos para productos con stock bajo
(4, 'entrada', 50, 0, 50, 'Stock inicial', 1),
(4, 'salida', 35, 50, 15, 'Ventas múltiples', 2),
(5, 'entrada', 40, 0, 40, 'Stock inicial', 1),
(5, 'salida', 32, 40, 8, 'Ventas múltiples', 2);
