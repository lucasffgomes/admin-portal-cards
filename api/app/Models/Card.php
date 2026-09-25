<?php

namespace App\Models;

use PDO;

class Card
{
    private $conn;
    private $table_name = "cards";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function readAll()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name_en=:name_en, name_pt=:name_pt, game=:game, edition_id=:edition_id, image_url=:image_url, rarity=:rarity";

        $stmt = $this->conn->prepare($query);

        // Sanitize could be added here, but PDO binds protect against SQL Injection
        $stmt->bindParam(":name_en", $data['name_en']);
        $stmt->bindParam(":name_pt", $data['name_pt']);
        $stmt->bindParam(":game", $data['game']);
        $stmt->bindParam(":edition_id", $data['edition_id']);
        $stmt->bindParam(":image_url", $data['image_url']);
        $stmt->bindParam(":rarity", $data['rarity']);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $data)
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "{$key}=:{$key}";
        }

        $query = "UPDATE " . $this->table_name . " SET " . implode(", ", $fields) . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":{$key}", $value);
        }
        $stmt->bindValue(":id", $id);

        return $stmt->execute();
    }

    public function delete($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        return $stmt->execute();
    }
}
