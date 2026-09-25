<?php

namespace App\Core;

trait ResponseTrait
{
    protected function jsonResponse($data = null, $message = '', $success = true, $statusCode = 200)
    {
        http_response_code($statusCode);

        $response = [
            'success' => $success,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return json_encode($response);
    }

    protected function successResponse($data = null, $message = 'Operação realizada com sucesso.', $statusCode = 200)
    {
        return $this->jsonResponse($data, $message, true, $statusCode);
    }

    protected function errorResponse($message = 'Ocorreu um erro.', $statusCode = 400, $data = null)
    {
        return $this->jsonResponse($data, $message, false, $statusCode);
    }
}
