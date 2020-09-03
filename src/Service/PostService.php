<?php


namespace App\Service;

use App\Validator\RequiredFields;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\Validator\Validator\ValidatorInterface;


class PostService
{
    protected $connection;
    private $validator;

    public function __construct(DatabaseConnectionService $connectionService, ValidatorInterface $validator)
    {
        $this->connection = $connectionService->openDatabaseConnection();
        $this->validator = $validator;
    }

    public function findPost(array $data)
    {
        $stmt = $this->connection->prepare("SELECT * FROM posts WHERE title=:title");
        $stmt->execute([
            ':title' => $data['title'],
        ]);
        return $stmt->fetch();

    }

    public function createPost(array $data)
    {
        $sql = "INSERT INTO posts (title, description) VALUES (:title,:description)";

        return $this->connection->prepare($sql)
            ->execute([
                ':title' => $data['title'],
                ':description' => $data['description'],
            ]);
    }

    public function validationCredentials(array $data)
    {
        $requiredFields = [
            'title'=>'',
            'description'=>'',
        ];

        $constraintViolationList = $this->validator->validate($data, new RequiredFields([
            'fields' => $requiredFields,
            'message' => 'Fill required fields',
        ]));

        if ($constraintViolationList->count() > 0) {

            return $constraintViolationList;
        }
//
        $constraintViolationList = $this->validator->validate($data, new Collection([
            'title' => [
                new Assert\Length(['min' => 2])
            ],

            'description' => [
                new Assert\Length(['min' => 5, 'max' => 100])
            ]
        ]));

        return $constraintViolationList;
    }

    public function deletePost(int $id)
    {
        $sql = "DELETE FROM posts WHERE  id=:id";

        $stmt = $this->connection->prepare($sql);

        return $stmt->execute([
            ':id' => $id,
        ]);
    }

    public function updatePost(array $data, int $id)
    {
        $sql = "UPDATE posts SET title=:title, description=:description WHERE id=:id";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':id' => $id,
        ]);
    }

    public function countedPosts()
    {
        $stmt = $this->connection->prepare('SELECT COUNT(id) AS count FROM posts');
        $stmt->execute();

        return $stmt->fetch();
    }

    public function delimiterPagination(int $postsPerPage)
    {
        $allPosts = $this->countedPosts();
        $allPosts = $allPosts['count'];

        return ceil($allPosts / $postsPerPage);
    }

    public function getPostsWithPagination(int $currentPage, int $postsPerPage)
    {
        $fromPost = $currentPage === 1 ? 0 : $currentPage * $postsPerPage - $postsPerPage;

        $sql = $this->connection->query('SELECT * FROM posts  ORDER BY id DESC LIMIT ' . $fromPost . ', ' . $postsPerPage);

        $postsD = [];

        while ($row = $sql->fetch(\PDO::FETCH_ASSOC)) {
            $postsD[] = $row;
        }

        return ($postsD);
    }
}