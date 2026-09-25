<?php

namespace App\Controllers;

use App\Models\Card;
use App\Core\ResponseTrait;
use App\Requests\Validator;
use PDO;

class CardController
{
    use ResponseTrait;

    private $card;

    public function __construct($db)
    {
        $this->card = new Card($db);
    }

    public function getAll()
    {
        $stmt = $this->card->readAll();
        $cards = [];

        $appUrl = rtrim($_ENV['APP_URL'] ?? 'http://localhost:8080', '/');
        $baseImageUrl = $appUrl . '/api/storage/uploads/cards/';

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (!empty($row['image_url'])) {
                $row['image_url'] = $baseImageUrl . $row['image_url'];
            }
            $cards[] = $row;
        }

        return $this->successResponse($cards, "Cartas recuperadas com sucesso.");
    }

    public function create($data, $files = [])
    {
        if (isset($data['_method'])) {
            unset($data['_method']);
        }
        if (isset($data['id'])) {
            unset($data['id']);
        }

        $errors = Validator::validate($data ?? [], [
            'name_en' => 'required',
            'game' => 'required|in:magic,pokemon,yugioh',
            'edition_id' => 'required'
        ]);

        if (!isset($files['image']) || $files['image']['error'] === UPLOAD_ERR_NO_FILE) {
            $errors['image'][] = "O envio da imagem da carta é obrigatório.";
        }

        if (!empty($errors)) {
            return $this->errorResponse("Dados inválidos.", 400, $errors);
        }

        try {
            $data['image_url'] = $this->uploadImage($files['image']);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }

        $id = $this->card->create($data);
        if ($id) {
            return $this->successResponse(["id" => $id], "Carta criada com sucesso.", 201);
        } else {
            return $this->errorResponse("Não foi possível criar a carta.", 503);
        }
    }

    public function update($id, $data, $files = [])
    {
        if (isset($data['_method'])) {
            unset($data['_method']);
        }
        if (isset($data['id'])) {
            unset($data['id']);
        }

        $errors = Validator::validate($data ?? [], [
            'name_en' => 'required',
            'game' => 'required|in:magic,pokemon,yugioh',
            'edition_id' => 'required'
        ]);

        if (!empty($errors)) {
            return $this->errorResponse("Dados inválidos.", 400, $errors);
        }

        if (isset($files['image']) && $files['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            try {
                $cardData = $this->card->readOne($id);
                $data['image_url'] = $this->uploadImage($files['image']);

                // Exclui a imagem antiga
                if ($cardData && !empty($cardData['image_url'])) {
                    $oldPath = __DIR__ . '/../../storage/uploads/cards/' . $cardData['image_url'];
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }
            } catch (\Exception $e) {
                return $this->errorResponse($e->getMessage(), 400);
            }
        }

        if ($this->card->update($id, $data)) {
            return $this->successResponse(null, "Carta atualizada.");
        } else {
            return $this->errorResponse("Não foi possível atualizar a carta.", 503);
        }
    }

    public function delete($id)
    {
        if (empty($id)) {
            return $this->errorResponse("ID não fornecido.", 400);
        }

        $cardData = $this->card->readOne($id);

        if ($this->card->delete($id)) {
            // Delete image file if exists
            if ($cardData && !empty($cardData['image_url'])) {
                $filePath = __DIR__ . '/../../storage/uploads/cards/' . $cardData['image_url'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            return $this->successResponse(null, "Carta deletada.");
        } else {
            return $this->errorResponse("Não foi possível deletar a carta.", 503);
        }
    }

    private function uploadImage($file)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception("Erro ao processar o upload da imagem.");
        }

        // Validação de Tamanho: Máximo de 2MB
        if ($file['size'] > 2 * 1024 * 1024) {
            throw new \Exception("A imagem excede o tamanho máximo permitido de 2MB.");
        }

        $targetDir = __DIR__ . '/../../storage/uploads/cards/';
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array(strtolower($extension), $allowed)) {
            throw new \Exception("Formato de imagem inválido. Use apenas JPG, PNG, WEBP ou GIF.");
        }

        $filename = uniqid('card_') . '.' . $extension;
        $targetFile = $targetDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            return $filename;
        }

        throw new \Exception("Falha ao salvar a imagem no disco.");
    }
}
