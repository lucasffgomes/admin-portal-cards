<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurações de segurança para o cookie de sessão (Mitigação de XSS e CSRF)
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict'
]);

session_start();

require_once 'app/Core/init.php';

// Define o fuso horário global da aplicação
date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'America/Sao_Paulo');

use App\Core\Router;

$router = new Router();

// Carrega as rotas definidas
require_once 'routes/api.php';

// Dispara o roteador
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
