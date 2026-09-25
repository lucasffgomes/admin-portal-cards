<?php

use App\Controllers\CardController;
use App\Controllers\AuthController;

global $db, $router;

$cardCtrl = new CardController($db);
$auth = new AuthController($db);

// Cards Routes
$router->add('GET', '/api/cards', function () use ($auth, $cardCtrl) {
    $auth->checkAuth();
    echo $cardCtrl->getAll();
});

$router->add('POST', '/api/cards', function () use ($auth, $cardCtrl) {
    $auth->checkAuth();
    $inputData = json_decode(file_get_contents("php://input"), true) ?? $_POST;
    
    // Suporte para simular PUT usando POST (necessário para upload de arquivos em formulários)
    if (isset($inputData['_method']) && strtoupper($inputData['_method']) === 'PUT') {
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($inputData['id']) ? $inputData['id'] : null);
        echo $cardCtrl->update($id, $inputData, $_FILES);
        return;
    }

    echo $cardCtrl->create($inputData, $_FILES);
});

$router->add('PUT', '/api/cards', function () use ($auth, $cardCtrl) {
    $auth->checkAuth();
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $inputData = json_decode(file_get_contents("php://input"), true) ?? $_POST;
    echo $cardCtrl->update($id, $inputData, $_FILES);
});

$router->add('DELETE', '/api/cards', function () use ($auth, $cardCtrl) {
    $auth->checkAuth();
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    echo $cardCtrl->delete($id);
});
