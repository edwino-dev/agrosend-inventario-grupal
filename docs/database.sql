CREATE DATABASE IF NOT EXISTS agrosend_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrosend_db;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cliente_id INT NOT NULL,
    total_base DECIMAL(10, 2) NOT NULL,
    total_iva DECIMAL(10, 2) NOT NULL,
    total_neto DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB;

CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario_base DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

INSERT INTO roles (nombre) VALUES ('administrador'), ('tecnico'), ('operario');
INSERT INTO categorias (nombre) VALUES ('Semillas'), ('Fertilizantes'), ('Herbicidas'), ('Herramientas');

-- Contraseña encriptada para desarrollo: '123456'
INSERT INTO usuarios (nombre, email, password, role_id) VALUES 
('Admin Agro', 'admin@agrosend.com', '$2y$10$9VMDZ1Xq58NvFR0K6h8xpusfDX6O4fRnTuvESNMxSotK6tkwgvaci', 1),
('Tecnico Campo', 'tecnico@agrosend.com', '$2y$10$9VMDZ1Xq58NvFR0K6h8xpusfDX6O4fRnTuvESNMxSotK6tkwgvaci', 2),
('Operario Caja', 'caja@agrosend.com', '$2y$10$9VMDZ1Xq58NvFR0K6h8xpusfDX6O4fRnTuvESNMxSotK6tkwgvaci', 3);

INSERT INTO clientes (nombre, identificacion, telefono, email) VALUES 
('Asociación de Cultivadores del Valle', '900123456-1', '3157778899', 'contacto@asocultivos.org'),
('Finca La Esperanza', '16777888', '3102223344', 'esperanza@agro.com'),
('Cliente Mostrador', '22222222', '0000000', 'mostrador@agrosend.com');

INSERT INTO productos (nombre, precio_base, stock, categoria_id) VALUES
-- SEMILLAS
('Semilla de Maíz Híbrido 1kg', 25000.00, 150, 1), ('Semilla de Arroz Fedearroz 50kg', 120000.00, 80, 1),
('Semilla de Tomate Chonto 100gr', 45000.00, 200, 1), ('Semilla de Cebolla Cabezona 500gr', 65000.00, 95, 1),
('Semilla de Pimentón Nathalie 1000y', 85000.00, 40, 1), ('Semilla de Zanahoria Royal 500gr', 38000.00, 110, 1),
('Semilla de Lechuga Crespa 100gr', 22000.00, 300, 1), ('Semilla de Cilantro Patetoro 1kg', 18000.00, 500, 1),
('Semilla de Fríjol Cargamanto 5kg', 55000.00, 60, 1), ('Semilla de Arveja Santa Isabel 5kg', 48000.00, 75, 1),
('Semilla de Soya Variedad 1kg', 15000.00, 250, 1), ('Semilla de Algodón Certificada 10kg', 95000.00, 30, 1),
('Semilla de Pasto Mombasa 1kg', 32000.00, 400, 1), ('Semilla de Pasto Brachiaria 5kg', 140000.00, 120, 1),
('Semilla de Sandía Santa Amalia 100gr', 52000.00, 85, 1), ('Semilla de Melón Híbrido 100gr', 58000.00, 70, 1),
('Semilla de Pepino Cohombro 100gr', 29000.00, 140, 1), ('Semilla de Calabacín Zucchini 100gr', 34000.00, 90, 1),
('Semilla de Repollo Corazón de Buey', 27000.00, 115, 1), ('Semilla de Espinaca Viroflay 500gr', 41000.00, 130, 1),
('Semilla de Remolacha Early Wonder', 23000.00, 180, 1), ('Semilla de Rábano Crimson Giant', 19000.00, 220, 1),
('Semilla de Brócoli Legacy 100gr', 62000.00, 65, 1), ('Semilla de Coliflor White Cloud', 64000.00, 50, 1),
('Semilla de Berenjena Long Purple', 26000.00, 95, 1), ('Semilla de Ají Jalapeño 100gr', 48000.00, 80, 1),
('Semilla de Maracuyá Criollo 50gr', 39000.00, 100, 1), ('Semilla de Lulo Variedad Castilla 25gr', 45000.00, 60, 1),
('Semilla de Papa Única Minituberculo', 110000.00, 25, 1), ('Semilla de Trigo Variedad Sol 20kg', 78000.00, 45, 1),
-- FERTILIZANTES
('Urea Granulada 46% 50kg', 145000.00, 500, 2), ('Fertilizante Triple 15 (15-15-15) 50kg', 160000.00, 450, 2),
('DAP (Fosfato Diamónico) 50kg', 175000.00, 300, 2), ('Cloruro de Potasio (KCl) 50kg', 155000.00, 280, 2),
('Abono Orgánico Compostado 40kg', 22000.00, 1000, 2), ('Humus de Lombriz Líquido 20L', 85000.00, 60, 2),
('Nitrato de Calcio Bolsa 25kg', 92000.00, 140, 2), ('Sulfato de Magnesio 25kg', 68000.00, 190, 2),
('Micorrizas Concentradas 1kg', 35000.00, 200, 2), ('Elementos Menores MenorEx 1L', 42000.00, 150, 2),
('Fertilizante Foliar Desarrollo 1L', 29000.00, 300, 2), ('Fertilizante Foliar Floración 1L', 31000.00, 250, 2),
('Acidos Húmicos Concentrados 5L', 115000.00, 80, 2), ('Sulfato de Amonio 50kg', 110000.00, 210, 2),
('Roca Fosfórica Molida 50kg', 45000.00, 400, 2), ('Cal Dolomita Sacos de 50kg', 18000.00, 1500, 2),
('Cal Agrícola Corrector PH 50kg', 15000.00, 2000, 2), ('Silicato de Potasio Soluble 1kg', 54000.00, 90, 2),
('Fertilizante Hidropónico Polvo 1kg', 47000.00, 120, 2), ('Abono de Pescado Orgánico 4L', 76000.00, 70, 2),
('Extracto de Algas Marinas 1L', 89000.00, 110, 2), ('Superfosfato Simple 50kg', 125000.00, 130, 2),
('Nitrato de Potasio Soluble 25kg', 165000.00, 95, 2), ('Quelato de Hierro EDDHA 1kg', 72000.00, 65, 2),
('Borax Agrícola Granulado 25kg', 83000.00, 100, 2),
-- HERBICIDAS
('Glifosato Concentrado 74% 1L', 48000.00, 4, 3), ('Paraquat Quema Directa 1L', 39000.00, 180, 3),
('2,4-D Amina Selector Maleza 1L', 35000.00, 220, 3), ('Propanil Control Arroz 5L', 185000.00, 40, 3),
('Atrazina Polvo Mojable 1kg', 42000.00, 130, 3), ('Diuron Herbicida Agrícola 1kg', 46000.00, 95, 3),
('Ametrina Control Caña 4L', 140000.00, 55, 3), ('Pendimetalina Preemergente 1L', 58000.00, 110, 3),
('Oxifluorfen Herbicida 1L', 79000.00, 70, 3), ('Clethodim Postemergente Gramíneas', 92000.00, 85, 3),
('Metsulfuron Metil Pastos Genuino', 18000.00, 400, 3), ('Picloram Potreros Limpios 4L', 210000.00, 30, 3),
('Triclopir Control Arbustivas 1L', 88000.00, 65, 3), ('Fluazifop-p-butyl Selectivo 1L', 95000.00, 50, 3),
('Glufosinato de Amonio Alambre 1L', 64000.00, 140, 3), ('Bentazona Control Hojas Anchas', 73000.00, 80, 3),
('Halosulfuron-metil Coquito 100gr', 120000.00, 150, 3), ('Clomazone Preemergente 1L', 84000.00, 45, 3),
('Linuron Herbicida Selectivo 1kg', 69000.00, 60, 3), ('Molinato Inundación Arroz 5L', 165000.00, 25, 3),
('Quinclorac Control Malezas 1L', 110000.00, 35, 3), ('Bispyribac-sodio Sello Azul 250cc', 98000.00, 90, 3),
('Cyhalofop-butyl Gramíneas 1L', 125000.00, 40, 3), ('Pyrazosulfuron Arrozal 100gr', 32000.00, 200, 3),
('Dicamba Herbicida Hormonal 1L', 53000.00, 75, 3),
-- HERRAMIENTAS
('Machete Colinero 22 Pulgadas', 28000.00, 300, 4), ('Pala Redonda Estampada Herragro', 42000.00, 150, 4),
('Azadón Forjado Mediano sin Cabo', 35000.00, 120, 4), ('Barretón Agrícola Pesado', 55000.00, 80, 4),
('Fumigadora de Espalda Royal 20L', 195000.00, 2, 4), ('Tijera de Poda Altiuna Profesional', 49000.00, 110, 4),
('Tijera de Altura Ramas Altas', 85000.00, 45, 4), ('Rastrillo de Hojas Plástico 22d', 18000.00, 250, 4),
('Rastrillo de Hierro para Suelo', 29000.00, 140, 4), ('Carretilla Platón Metálico 5.5p3', 185000.00, 35, 4),
('Pica de Excavación Con Punta Ojo', 46000.00, 90, 4), ('Zapa Pico con Mango de Fibra', 62000.00, 70, 4),
('Lima de Afilar Machetes Bellota', 12000.00, 600, 4), ('Garlancha de Limpieza Canaletas', 39000.00, 65, 4),
('Hoyadora Manual de Doble Mango', 78000.00, 40, 4), ('Manguera Riego Reforzada 1/2 50m', 115000.00, 55, 4),
('Aspersor de Impacto Bronce 3/4', 34000.00, 200, 4), ('Pistola de Riego Multi-jet Regul', 24000.00, 180, 4),
('Medidor Termo-Higrómetro Digital', 65000.00, 30, 4), ('Cinta métrica de Fibra de Vidrio 50m', 52000.00, 45, 4),
('Bomba de Agua Gasolina Kamipak 2x2', 68000.00, 12, 4), ('Motosierra de Poda Ligera 35cc', 78000.00, 8, 4),
('Guadañadora Profesional 45cc', 92000.00, 14, 4);