CREATE DATABASE IF NOT EXISTS dulce_capricho
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE dulce_capricho;

-- 1. TABLA ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
) ENGINE=InnoDB;

-- 2. TABLA USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado ENUM('Activo','Inactivo')
        NOT NULL DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (id_rol)
    REFERENCES roles(id_rol)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. TABLA CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    tipo_documento VARCHAR(30),
    numero_documento VARCHAR(30) UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,

    CONSTRAINT fk_clientes_usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. TABLA DIRECCIONES
CREATE TABLE IF NOT EXISTS direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    barrio VARCHAR(100),
    direccion_exacta VARCHAR(200) NOT NULL,
    complemento VARCHAR(150),
    referencia VARCHAR(200),
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_direcciones_clientes
    FOREIGN KEY (id_cliente)
    REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. TABLA CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    estado ENUM('Activa','Inactiva')
        NOT NULL DEFAULT 'Activa'
) ENGINE=InnoDB;

-- 6. TABLA PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre_producto VARCHAR(150) NOT NULL,
    descripcion TEXT,
    sabor VARCHAR(100),
    tamano ENUM('Pequeno','Mediano','Grande'),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    personalizado BOOLEAN NOT NULL DEFAULT FALSE,
    imagen VARCHAR(255),
    estado ENUM('Disponible','No disponible')
        NOT NULL DEFAULT 'Disponible',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_productos_categorias
    FOREIGN KEY (id_categoria)
    REFERENCES categorias(id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. TABLA INGREDIENTES
CREATE TABLE IF NOT EXISTS ingredientes (
    id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ingrediente VARCHAR(120) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    unidad_medida VARCHAR(30) NOT NULL,
    cantidad_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    stock_minimo DECIMAL(10,3) NOT NULL DEFAULT 0,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado ENUM('Disponible','Agotado')
        NOT NULL DEFAULT 'Disponible'
) ENGINE=InnoDB;

-- 8. TABLA PRODUCTO_INGREDIENTES
CREATE TABLE IF NOT EXISTS producto_ingredientes (
    id_producto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad_utilizada DECIMAL(10,3) NOT NULL,

    PRIMARY KEY (id_producto, id_ingrediente),

    CONSTRAINT fk_pi_productos
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_pi_ingredientes
    FOREIGN KEY (id_ingrediente)
    REFERENCES ingredientes(id_ingrediente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 9. TABLA CARRITOS
CREATE TABLE IF NOT EXISTS carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo','Finalizado','Abandonado')
        NOT NULL DEFAULT 'Activo',

    CONSTRAINT fk_carritos_clientes
    FOREIGN KEY (id_cliente)
    REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. TABLA DETALLE_CARRITO
CREATE TABLE IF NOT EXISTS detalle_carrito (
    id_detalle_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_carrito_carritos
    FOREIGN KEY (id_carrito)
    REFERENCES carritos(id_carrito)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT fk_detalle_carrito_productos
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT uq_carrito_producto
    UNIQUE (id_carrito, id_producto),

    CHECK (cantidad > 0),
    CHECK (precio_unitario >= 0),
    CHECK (subtotal >= 0)
) ENGINE=InnoDB;

-- 11. TABLA PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_direccion INT NOT NULL,
    id_carrito INT UNIQUE,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    estado ENUM(
        'Pendiente',
        'Confirmado',
        'En preparacion',
        'Enviado',
        'Entregado',
        'Cancelado'
    ) NOT NULL DEFAULT 'Pendiente',

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0,
    costo_envio DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    observaciones TEXT,

    CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (id_cliente)
    REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_pedidos_direcciones
    FOREIGN KEY (id_direccion)
    REFERENCES direcciones(id_direccion)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_pedidos_carritos
    FOREIGN KEY (id_carrito)
    REFERENCES carritos(id_carrito)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CHECK (
        subtotal >= 0
        AND descuento >= 0
        AND costo_envio >= 0
        AND total >= 0
    )
) ENGINE=InnoDB;

-- 12. TABLA DETALLE_PEDIDOS
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    personalizacion TEXT,

    CONSTRAINT fk_detalle_pedidos_pedidos
    FOREIGN KEY (id_pedido)
    REFERENCES pedidos(id_pedido)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CONSTRAINT fk_detalle_pedidos_productos
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CHECK (cantidad > 0),
    CHECK (precio_unitario >= 0),
    CHECK (subtotal >= 0)
) ENGINE=InnoDB;

-- 13. TABLA PAGOS
CREATE TABLE IF NOT EXISTS pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,

    metodo_pago ENUM(
        'Efectivo',
        'Transferencia',
        'Tarjeta',
        'Pago digital'
    ) NOT NULL,

    referencia_pago VARCHAR(100),
    monto DECIMAL(10,2) NOT NULL,

    estado ENUM(
        'Pendiente',
        'Aprobado',
        'Rechazado',
        'Reembolsado'
    ) NOT NULL DEFAULT 'Pendiente',

    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pagos_pedidos
    FOREIGN KEY (id_pedido)
    REFERENCES pedidos(id_pedido)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

    CHECK (monto > 0)
) ENGINE=InnoDB;

-- 14. TABLA FACTURAS
CREATE TABLE IF NOT EXISTS facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL UNIQUE,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Emitida','Anulada')
        NOT NULL DEFAULT 'Emitida',

    CONSTRAINT fk_facturas_pedidos
    FOREIGN KEY (id_pedido)
    REFERENCES pedidos(id_pedido)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;


