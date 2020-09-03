<?php

namespace App\Service;


class DatabaseConnectionService
{
    public function openDatabaseConnection()
    {
        return new \PDO("mysql:host=localhost;dbname=tutorial", 'root', '');
    }
}