-- Insertar pedidos de prueba con fechas variadas
INSERT INTO pedidos (cliente_id, usuario_id, fecha, total, estatus, notas) VALUES 
-- Pedidos recientes (últimos 3 días)
(1, 1, NOW() - INTERVAL '1 day', 450.00, 'Entregado', 'Entrega en horario matutino'),
(2, 1, NOW() - INTERVAL '2 days', 320.50, 'En Ruta', 'Cliente prefiere entrega después de las 2 PM'),
(3, 2, NOW() - INTERVAL '3 days', 180.00, 'Pendiente', 'Confirmar disponibilidad de productos'),
(4, 1, NOW() - INTERVAL '4 days', 275.00, 'Entregado', 'Pago en efectivo'),

-- Pedidos de la semana pasada
(1, 2, NOW() - INTERVAL '5 days', 390.00, 'Cancelado', 'Cliente canceló por cambio de proveedor'),
(2, 1, NOW() - INTERVAL '6 days', 520.00, 'Entregado', 'Pedido especial - productos premium'),
(3, 2, NOW() - INTERVAL '7 days', 210.50, 'Entregado', 'Entrega sin problemas'),
(4, 1, NOW() - INTERVAL '8 days', 340.00, 'Entregado', 'Cliente satisfecho con el servicio'),

-- Pedidos del mes pasado
(1, 2, NOW() - INTERVAL '10 days', 425.00, 'Entregado', 'Pedido recurrente mensual'),
(2, 1, NOW() - INTERVAL '12 days', 380.50, 'Entregado', 'Promoción aplicada'),
(3, 2, NOW() - INTERVAL '15 days', 290.00, 'Entregado', 'Entrega programada'),
(4, 1, NOW() - INTERVAL '18 days', 315.00, 'Entregado', 'Pago con tarjeta'),

-- Pedidos adicionales para completar estadísticas
(1, 1, NOW() - INTERVAL '20 days', 195.50, 'Entregado', 'Pedido pequeño'),
(2, 2, NOW() - INTERVAL '22 days', 445.00, 'Entregado', 'Pedido grande'),
(3, 1, NOW() - INTERVAL '25 days', 267.50, 'Entregado', 'Entrega express'),
(4, 2, NOW() - INTERVAL '28 days', 398.00, 'Entregado', 'Cliente VIP'),
(1, 1, NOW() - INTERVAL '30 days', 156.00, 'Entregado', 'Pedido de prueba'),
(2, 2, NOW() - INTERVAL '32 days', 478.50, 'Entregado', 'Pedido completo'),

-- Insertar pedidos de prueba
(1, 2, '2024-01-15 10:30:00', 450.00, 'Entregado'),
(2, 2, '2024-01-15 14:15:00', 320.50, 'Pendiente'),
(3, 3, '2024-01-16 09:45:00', 180.00, 'En Ruta'),
(4, 2, '2024-01-16 11:20:00', 275.00, 'Entregado'),
(5, 3, '2024-01-17 08:30:00', 390.00, 'Cancelado'),
(6, 2, '2024-01-17 15:45:00', 520.00, 'Entregado'),
(7, 3, '2024-01-18 10:15:00', 210.50, 'Entregado'),
(8, 2, '2024-01-18 13:30:00', 340.00, 'Entregado'),
(1, 2, '2024-01-19 09:00:00', 480.00, 'En Ruta'),
(3, 3, '2024-01-19 16:20:00', 295.50, 'Pendiente'),
(5, 2, '2024-01-20 11:45:00', 425.00, 'Entregado'),
(7, 3, '2024-01-20 14:10:00', 380.00, 'Pendiente');

-- Insertar detalles de pedidos (ejemplos para los primeros pedidos)
-- Pedido 1: Tienda La Esquina - $450.00
INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(1, 1, 10, 15.50, 155.00), -- Coca Cola 600ml
(1, 3, 15, 12.00, 180.00), -- Agua Natural 1L
(1, 4, 5, 18.50, 92.50),   -- Sabritas Original
(1, 7, 2, 12.00, 24.00);   -- Chocolate Carlos V

-- Pedido 2: Súper Mercado Norte - $320.50
INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(2, 2, 8, 15.00, 120.00),  -- Pepsi 600ml
(2, 3, 10, 12.00, 120.00), -- Agua Natural 1L
(2, 5, 3, 22.00, 66.00),   -- Doritos Nacho
(2, 6, 2, 8.50, 17.00);    -- Galletas Marías

-- Pedido 3: Abarrotes El Sur - $180.00
INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(3, 1, 5, 15.50, 77.50),   -- Coca Cola 600ml
(3, 6, 8, 8.50, 68.00),    -- Galletas Marías
(3, 8, 5, 6.50, 32.50);    -- Chicles Trident

-- Pedido 4: Minisuper Central - $275.00
INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(4, 1, 6, 15.50, 93.00),   -- Coca Cola 600ml
(4, 2, 4, 15.00, 60.00),   -- Pepsi 600ml
(4, 4, 4, 18.50, 74.00),   -- Sabritas Original
(4, 7, 4, 12.00, 48.00);   -- Chocolate Carlos V

-- Pedido 5
INSERT INTO pedidos_detalle (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(5, 1, 8, 15.50, 124.00),
(5, 5, 7, 15.00, 105.00),
(5, 7, 6, 15.00, 90.00),
(5, 8, 3, 19.00, 57.00),

-- Pedido 6
(6, 3, 15, 12.00, 180.00),
(6, 2, 10, 18.00, 180.00),
(6, 4, 6, 22.00, 132.00),
(6, 10, 1, 23.00, 23.00),

-- Pedido 7
(7, 9, 4, 15.00, 60.00),
(7, 6, 3, 20.00, 60.00),
(7, 8, 2, 19.00, 38.00),
(7, 1, 3, 15.50, 46.50),

-- Pedido 8
(8, 5, 9, 15.00, 135.00),
(8, 7, 8, 15.00, 120.00),
(8, 2, 4, 18.00, 72.00),
(8, 4, 1, 22.00, 22.00),

-- Pedido 9
(9, 1, 12, 15.50, 186.00),
(9, 3, 10, 12.00, 120.00),
(9, 6, 5, 20.00, 100.00),
(9, 10, 2, 23.00, 46.00),

-- Pedido 10
(10, 2, 7, 18.00, 126.00),
(10, 8, 4, 19.00, 76.00),
(10, 9, 3, 15.00, 45.00),
(10, 4, 2, 22.00, 44.00),

-- Pedido 11
(11, 5, 11, 15.00, 165.00),
(11, 7, 9, 15.00, 135.00),
(11, 1, 6, 15.50, 93.00),
(11, 3, 2, 12.00, 24.00),

-- Pedido 12
(12, 6, 8, 20.00, 160.00),
(12, 10, 5, 23.00, 115.00),
(12, 2, 3, 18.00, 54.00),
(12, 8, 2, 19.00, 38.00);

-- Actualizar inventarios basado en las ventas
UPDATE inventarios SET cantidad = cantidad - 39 WHERE producto_id = 1; -- Coca Cola vendidas
UPDATE inventarios SET cantidad = cantidad - 12 WHERE producto_id = 2; -- Pepsi vendidas
UPDATE inventarios SET cantidad = cantidad - 25 WHERE producto_id = 3; -- Agua vendida
UPDATE inventarios SET cantidad = cantidad - 9 WHERE producto_id = 4;  -- Sabritas vendidas
UPDATE inventarios SET cantidad = cantidad - 3 WHERE producto_id = 5;  -- Doritos vendidos
UPDATE inventarios SET cantidad = cantidad - 10 WHERE producto_id = 6; -- Galletas vendidas
UPDATE inventarios SET cantidad = cantidad - 6 WHERE producto_id = 7;  -- Chocolate vendido
UPDATE inventarios SET cantidad = cantidad - 5 WHERE producto_id = 8;  -- Chicles vendidos
UPDATE inventarios SET cantidad = cantidad - 15 WHERE producto_id = 9; -- Otro producto vendido
UPDATE inventarios SET cantidad = cantidad - 10 WHERE producto_id = 10; -- Otro producto vendido

-- Insertar registros de auditoría
INSERT INTO auditorias (usuario_id, descripcion, tabla_afectada, accion) VALUES 
(1, 'Pedido creado para Tienda La Esquina', 'pedidos', 'INSERT'),
(1, 'Pedido creado para Súper Mercado Norte', 'pedidos', 'INSERT'),
(2, 'Pedido creado para Abarrotes El Sur', 'pedidos', 'INSERT'),
(1, 'Pedido creado para Minisuper Central', 'pedidos', 'INSERT'),
(1, 'Inventario actualizado por ventas', 'inventarios', 'UPDATE'),
(2, 'Pedido creado para cliente 2', 'pedidos', 'INSERT'),
(3, 'Pedido creado para cliente 3', 'pedidos', 'INSERT'),
(2, 'Pedido creado para cliente 2', 'pedidos', 'INSERT'),
(3, 'Pedido creado para cliente 3', 'pedidos', 'INSERT'),
(2, 'Pedido creado para cliente 2', 'pedidos', 'INSERT'),
(3, 'Pedido creado para cliente 3', 'pedidos', 'INSERT'),
(2, 'Pedido creado para cliente 2', 'pedidos', 'INSERT');
