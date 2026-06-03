<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../src/Modelos/Persona.php';
require_once __DIR__ . '/../src/Modelos/Usuario.php';
require_once __DIR__ . '/../src/Modelos/Cliente.php';
require_once __DIR__ . '/../src/Modelos/Producto.php';

require_once __DIR__ . '/../src/Servicios/BaseService.php';
require_once __DIR__ . '/../src/Servicios/AutenticacionService.php';
require_once __DIR__ . '/../src/Servicios/VentaService.php';
require_once __DIR__ . '/../src/Servicios/DashboardService.php';
require_once __DIR__ . '/../src/Servicios/MercadoService.php';

try {
    $db = new PDO("mysql:host=localhost;dbname=agrosend_db;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error crítico de conexión."]);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptDir !== '/' && strpos($uri, $scriptDir) === 0) {
    $uri = substr($uri, strlen($scriptDir));
}

if (strpos($uri, '/index.php') === 0) {
    $uri = substr($uri, strlen('/index.php'));
}

$uri = rtrim($uri, '/');
if ($uri === '') {
    $uri = '/';
}

function getJsonBody(): ?array
{
    $input = file_get_contents('php://input');
    if ($input === false || $input === '') {
        return null;
    }

    $data = json_decode($input, true);
    return json_last_error() === JSON_ERROR_NONE ? $data : null;
}

if ($uri === '/api/auth/login' && $method === 'POST') {
    $data = getJsonBody();
    if (!is_array($data) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "JSON inválido o campos requeridos faltantes."]);
        exit();
    }

    $auth = new \Agrosend\Servicios\AutenticacionService($db);
    $user = $auth->login($data['email'], $data['password']);
    
    if ($user) {
        echo json_encode(["status" => "success", "usuario" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Credenciales inválidas."]);
    }
} elseif ($uri === '/api/ventas' && $method === 'POST') {
    $data = getJsonBody();
    if (!is_array($data) || !isset($data['usuario_id'], $data['cliente_id'], $data['productos']) || !is_array($data['productos'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "JSON inválido o datos de venta incompletos."]);
        exit();
    }

    $venta = new \Agrosend\Servicios\VentaService($db);
    
    if ($venta->procesarVenta($data)) {
        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Factura creada con éxito."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Error de transacción o falta de stock."]);
    }
} elseif ($uri === '/api/dashboard/stock' && $method === 'GET') {
    $dashboard = new \Agrosend\Servicios\DashboardService($db);
    echo json_encode($dashboard->obtenerStockPorProducto());
} elseif ($uri === '/api/mercado/comparar' && $method === 'GET') {
    $mercado = new \Agrosend\Servicios\MercadoService($db);
    echo json_encode($mercado->compararPreciosInternos());
} else {
    http_response_code(404);
    echo json_encode(["error" => "Endpoint inválido."]);
}