
USE dulce_capricho;

-- 1. INSERT: REGISTRO DE ROLES


INSERT INTO roles (nombre_rol, descripcion)
SELECT 'Administrador', 'Administra el sistema'
WHERE NOT EXISTS (
    SELECT 1 FROM roles
    WHERE nombre_rol = 'Administrador'
);

INSERT INTO roles (nombre_rol, descripcion)
SELECT 'Cliente', 'Realiza compras en la tienda'
WHERE NOT EXISTS (
    SELECT 1 FROM roles
    WHERE nombre_rol = 'Cliente'
);


-- 2. INSERT: CATEGORIAS


INSERT INTO categorias (
    nombre_categoria,
    descripcion
)
SELECT 'Tortas', 'Tortas para diferentes ocasiones'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias
    WHERE nombre_categoria = 'Tortas'
);

INSERT INTO categorias (
    nombre_categoria,
    descripcion
)
SELECT 'Postres', 'Postres individuales y familiares'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias
    WHERE nombre_categoria = 'Postres'
);

INSERT INTO categorias (
    nombre_categoria,
    descripcion
)
SELECT 'Cupcakes y galletas',
       'Productos pequeños de repostería'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias
    WHERE nombre_categoria = 'Cupcakes y galletas'
);


-- 3. SELECT: CONSULTAR TODAS LAS TABLAS


SELECT * FROM roles;
SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM direcciones;
SELECT * FROM categorias;
SELECT * FROM productos;
SELECT * FROM ingredientes;
SELECT * FROM producto_ingredientes;
SELECT * FROM carritos;
SELECT * FROM detalle_carrito;
SELECT * FROM pedidos;
SELECT * FROM detalle_pedidos;
SELECT * FROM pagos;
SELECT * FROM facturas;


-- 4. SELECT: CONSULTAR PRODUCTOS Y CATEGORIAS


SELECT
    p.id_producto,
    p.nombre_producto,
    c.nombre_categoria,
    p.sabor,
    p.tamano,
    p.precio,
    p.stock,
    p.estado
FROM productos p
INNER JOIN categorias c
ON p.id_categoria = c.id_categoria;


-- 5. SELECT: CONSULTAR CLIENTES


SELECT
    c.id_cliente,
    u.nombres,
    u.apellidos,
    u.correo,
    c.tipo_documento,
    c.numero_documento,
    c.telefono
FROM clientes c
INNER JOIN usuarios u
ON c.id_usuario = u.id_usuario;


-- 6. SELECT: CONSULTAR DIRECCIONES DE CLIENTES


SELECT
    d.id_direccion,
    CONCAT(u.nombres, ' ', u.apellidos) AS cliente,
    d.departamento,
    d.ciudad,
    d.barrio,
    d.direccion_exacta,
    d.complemento
FROM direcciones d
INNER JOIN clientes c
ON d.id_cliente = c.id_cliente
INNER JOIN usuarios u
ON c.id_usuario = u.id_usuario;


-- 7. SELECT: CONSULTAR CARRITOS Y SUS PRODUCTOS


SELECT
    ca.id_carrito,
    ca.id_cliente,
    p.nombre_producto,
    dc.cantidad,
    dc.precio_unitario,
    dc.subtotal
FROM carritos ca
INNER JOIN detalle_carrito dc
ON ca.id_carrito = dc.id_carrito
INNER JOIN productos p
ON dc.id_producto = p.id_producto;


-- 8. SELECT: TOTAL DE CADA CARRITO


SELECT
    ca.id_carrito,
    ca.id_cliente,
    COALESCE(SUM(dc.subtotal), 0) AS total_carrito
FROM carritos ca
LEFT JOIN detalle_carrito dc
ON ca.id_carrito = dc.id_carrito
GROUP BY ca.id_carrito, ca.id_cliente;


-- 9. SELECT: CONSULTAR PEDIDOS


SELECT
    pe.id_pedido,
    CONCAT(u.nombres, ' ', u.apellidos) AS cliente,
    pe.fecha_pedido,
    pe.estado,
    pe.subtotal,
    pe.descuento,
    pe.costo_envio,
    pe.total
FROM pedidos pe
INNER JOIN clientes c
ON pe.id_cliente = c.id_cliente
INNER JOIN usuarios u
ON c.id_usuario = u.id_usuario;


-- 10. SELECT: DETALLE DE LOS PEDIDOS


SELECT
    dp.id_pedido,
    p.nombre_producto,
    dp.cantidad,
    dp.precio_unitario,
    dp.subtotal,
    dp.personalizacion
FROM detalle_pedidos dp
INNER JOIN productos p
ON dp.id_producto = p.id_producto
ORDER BY dp.id_pedido;


-- 11. SELECT: CONSULTAR PAGOS


SELECT
    pa.id_pago,
    pa.id_pedido,
    pa.metodo_pago,
    pa.referencia_pago,
    pa.monto,
    pa.estado,
    pa.fecha_pago
FROM pagos pa;


-- 12. SELECT: CONSULTAR FACTURAS


SELECT
    f.id_factura,
    f.numero_factura,
    f.fecha_emision,
    f.estado,
    pe.id_pedido,
    pe.total
FROM facturas f
INNER JOIN pedidos pe
ON f.id_pedido = pe.id_pedido;


-- 13. INSERT: REGISTRO DE INGREDIENTES DE EJEMPLO
-- Ejecutar solamente si no existen estos ingredientes.


INSERT INTO ingredientes (
    nombre_ingrediente,
    descripcion,
    unidad_medida,
    cantidad_stock,
    stock_minimo,
    precio_unitario,
    estado
)
SELECT
    'Harina de trigo',
    'Harina para preparación de repostería',
    'Kilogramos',
    20,
    5,
    4500,
    'Disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM ingredientes
    WHERE nombre_ingrediente = 'Harina de trigo'
);

INSERT INTO ingredientes (
    nombre_ingrediente,
    descripcion,
    unidad_medida,
    cantidad_stock,
    stock_minimo,
    precio_unitario,
    estado
)
SELECT
    'Azúcar',
    'Azúcar blanca para repostería',
    'Kilogramos',
    15,
    3,
    4000,
    'Disponible'
WHERE NOT EXISTS (
    SELECT 1 FROM ingredientes
    WHERE nombre_ingrediente = 'Azúcar'
);


-- 14. UPDATE: ACTUALIZAR PRODUCTOS
-- Ejemplo: cambiar el precio de un producto.


-- UPDATE productos
-- SET precio = 65000
-- WHERE id_producto = 1;


-- 15. UPDATE: ACTUALIZAR ESTADO DE UN PEDIDO


-- UPDATE pedidos
-- SET estado = 'Confirmado'
-- WHERE id_pedido = 1;


-- 16. UPDATE: ACTUALIZAR ESTADO DE UN PAGO


-- UPDATE pagos
-- SET estado = 'Aprobado'
-- WHERE id_pago = 1;


-- 17. UPDATE: ACTUALIZAR STOCK DE UN INGREDIENTE


-- UPDATE ingredientes
-- SET cantidad_stock = cantidad_stock + 5
-- WHERE id_ingrediente = 1;


-- 18. DELETE: ELIMINAR UN DETALLE DE CARRITO
-- Ejemplo. Cambiar el ID por uno existente.


-- DELETE FROM detalle_carrito
-- WHERE id_detalle_carrito = 999;


-- 19. CONSULTA GENERAL: RESUMEN DE VENTAS


SELECT
    COUNT(*) AS cantidad_pedidos,
    SUM(subtotal) AS subtotal_ventas,
    SUM(descuento) AS descuentos,
    SUM(costo_envio) AS total_envios,
    SUM(total) AS total_ventas
FROM pedidos;


-- 20. CONSULTA: PRODUCTOS MAS VENDIDOS


SELECT
    p.nombre_producto,
    SUM(dp.cantidad) AS unidades_vendidas
FROM detalle_pedidos dp
INNER JOIN productos p
ON dp.id_producto = p.id_producto
GROUP BY p.id_producto, p.nombre_producto
ORDER BY unidades_vendidas DESC;


-- 21. CONSULTA: INGREDIENTES CON STOCK BAJO


SELECT
    nombre_ingrediente,
    cantidad_stock,
    stock_minimo,
    unidad_medida
FROM ingredientes
WHERE cantidad_stock <= stock_minimo;


-- 22. CONSULTA: PEDIDO DE PRUEBA


SELECT
    id_pedido,
    subtotal,
    descuento,
    costo_envio,
    total,
    estado
FROM pedidos
WHERE id_pedido = 1;


-- FIN DEL ARCHIVO DML

