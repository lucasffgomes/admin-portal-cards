<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\Database;
use App\Core\Env;

// Carrega as variáveis de ambiente do .env manualmente
Env::load(__DIR__ . '/../../.env');

// Inicializa a conexão global com o banco de dados
$database = new Database();
$db = $database->getConnection();
