<?php

namespace App\Controllers;

use App\Models\User;
use App\Core\ResponseTrait;
use App\Requests\Validator;

class AuthController
{
    use ResponseTrait;

    private $db;
    private $user;

    public function __construct($db)
    {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function login($data)
    {
        $errors = Validator::validate($data ?? [], [
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->errorResponse("Preencha usuário e senha.", 400, $errors);
        }

        $userData = $this->user->findByUsername($data['username']);

        if ($userData && password_verify($data['password'], $userData['password_hash'])) {
            $_SESSION['user_id'] = $userData['id'];
            $_SESSION['username'] = $userData['username'];

            return $this->successResponse(["user" => $userData['username']], "Login realizado com sucesso.");
        } else {
            return $this->errorResponse("Credenciais inválidas.", 401);
        }
    }

    public function logout()
    {
        session_destroy();
        return $this->successResponse(null, "Logout realizado com sucesso.");
    }

    public function checkAuth()
    {
        if (!isset($_SESSION['user_id'])) {
            echo $this->errorResponse("Não autorizado.", 401);
            exit();
        }
    }
}
