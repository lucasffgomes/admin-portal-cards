<?php

namespace App\Requests;

class Validator
{
    /**
     * Valida os dados de entrada usando regras básicas parecidas com o Laravel.
     * 
     * @param array $data O payload de entrada.
     * @param array $rules As regras de validação (ex: 'required|in:magic,pokemon').
     * @return array Retorna um array com os erros encontrados, ou array vazio se passou.
     */
    public static function validate(array $data, array $rules)
    {
        $errors = [];

        foreach ($rules as $field => $ruleString) {
            $rulesArray = explode('|', $ruleString);

            foreach ($rulesArray as $rule) {
                if ($rule === 'required') {
                    if (empty($data[$field])) {
                        $errors[$field][] = "O campo {$field} é obrigatório.";
                    }
                }

                if (strpos($rule, 'in:') === 0) {
                    $allowed = explode(',', substr($rule, 3));
                    if (!empty($data[$field]) && !in_array($data[$field], $allowed)) {
                        $errors[$field][] = "O valor fornecido para {$field} é inválido.";
                    }
                }
            }
        }

        return $errors;
    }
}
