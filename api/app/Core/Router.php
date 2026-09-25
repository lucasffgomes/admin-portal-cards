<?php

namespace App\Core;

class Router
{
    private $routes = [];

    public function add($method, $path, $handler)
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch($requestMethod, $requestUri)
    {
        $parsedUri = parse_url($requestUri, PHP_URL_PATH);

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $route['path'] === $parsedUri) {
                return call_user_func($route['handler']);
            }
        }

        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Endpoint não encontrado.", "data" => null]);
    }
}
