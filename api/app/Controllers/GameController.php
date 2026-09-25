<?php

namespace App\Controllers;

use App\Core\ResponseTrait;

class GameController
{
    use ResponseTrait;

    public function getGames()
    {
        $games = [
            ["id" => "magic", "name" => "Magic"],
            ["id" => "pokemon", "name" => "Pokémon"],
            ["id" => "yugioh", "name" => "Yu-Gi-Oh!"]
        ];
        return $this->successResponse($games, "Jogos recuperados com sucesso.");
    }

    public function getEditions()
    {
        $game = isset($_GET['game']) ? $_GET['game'] : null;

        $data = [
            "magic" => [
                ["id" => "dom", "name" => "Dominaria"],
                ["id" => "war", "name" => "War of the Spark"],
                ["id" => "eld", "name" => "Throne of Eldraine"],
                ["id" => "hob", "name" => "The Hobbit"],
                ["id" => "msh", "name" => "Marvel Super Heroes"]
            ],
            "pokemon" => [
                ["id" => "base1", "name" => "Base Set"],
                ["id" => "swsh1", "name" => "Sword & Shield"],
                ["id" => "sv1", "name" => "Scarlet & Violet"],
                ["id" => "30c", "name" => "30th Celebration"],
                ["id" => "cri", "name" => "Chaos Rising"]
            ],
            "yugioh" => [
                ["id" => "lob", "name" => "Legend of Blue Eyes White Dragon"],
                ["id" => "mrd", "name" => "Metal Raiders"],
                ["id" => "sdy", "name" => "Starter Deck: Yugi"],
                ["id" => "rotd", "name" => "Rise of the Duelist"],
                ["id" => "blzd", "name" => "Blazing Dominion"]
            ]
        ];

        if ($game && isset($data[$game])) {
            return $this->successResponse($data[$game], "Edições recuperadas com sucesso.");
        }

        return $this->successResponse($data, "Edições recuperadas com sucesso.");
    }
}
