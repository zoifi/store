<?php


namespace App\Service;


class UserService
{
    protected $connection;

    public function __construct(DatabaseConnectionService $connectionService)
    {
        $this->connection = $connectionService->openDatabaseConnection();
    }

    public function getAllUsers()
    {
        $result = $this->connection->query('SELECT * FROM users');

        $users = [];

        while ($row = $result->fetch(\PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }

        return $users;
    }


    public function lastFivePosts()
    {
        $result = $this->connection->query('SELECT * FROM posts ORDER BY id DESC LIMIT 5');

        $posts = [];

        while ($row = $result->fetch(\PDO::FETCH_ASSOC)) {
            $posts[] = $row;
        }

        return ($posts);
    }


}