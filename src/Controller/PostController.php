<?php

namespace App\Controller;

use App\Service\PostService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\ConstraintViolation;

class PostController extends AbstractController
{
    private $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * @Route("api/posts", name="posts", methods="POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function getPosts(Request $request)
    {
        $currentPage = $request->get('currentPage', 1);
        $postsPerPage = $request->get('postsPerPage', 5);

        $posts = $this->postService->getPostsWithPagination($currentPage, $postsPerPage);

        $pages = $this->postService->delimiterPagination($postsPerPage);

        return $this->json(['posts' => $posts, 'pages' => $pages]);
    }

    /**
     * @Route("api/delete/{id}", name="deletePost", methods ="POST" )
     * @param string $id
     * @return JsonResponse
     */
    public function deletePost(string $id)
    {
        $status = $this->postService->deletePost($id);

        return $this->json(['status' => $status]);
    }

    /**
     * @Route("api/update", name="update", methods ="PUT" )
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePost(Request $request)
    {
        $id = $request->request->get('id');
        $data = $request->request->all();

        if ($data['id']) {
            foreach ($data as $key => $item) {
                if ($key = 'id')
                    unset($data[$key]);
            }
        }

        $errors = $this->postService->validationCredentials($data);

        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $message = $error->getMessage();
                $path = $errors->getPropertyPath();

                if (!in_array($message, $messages)) {
                    $messages[] = $message;
                }
            }

            return $this->json(['data' => $data, 'status' => false, 'message' => rtrim(implode($messages, '<br>'))]);//
        }

        $this->postService->updatePost($data, $id);

        return $this->json(['status' => true, 'name' => 'update', 'message' => ' Success']);
    }

    /**
     * @Route("api/create", name="create-post", methods ="POST" )
     * @param Request $request
     * @return JsonResponse
     */
    public function addPost(Request $request)
    {
        $data = $request->request->all();

        $ifExist = $this->postService->findPost($data);

        if ($ifExist) {
            return $this->json(['data' => $data, 'status' => false, 'message' => 'Already exist such Title in Posts']);//
        }

        $errors = $this->postService->validationCredentials($data);

        if (count($errors) > 0) {

            $errorArray = [];
            foreach ($errors as $error)
            {
                /** @var ConstraintViolation $error */
                $message = $error->getMessage();
                $field = $error->getPropertyPath();

                if (!in_array($field, $errorArray)) {
                    $errorArray[] = array(
                        'id'=>trim($field,"[]"),
                        'message'=> $message
                    );
                }
            }

            return $this->json(['data' => $data, 'status' => false, 'message'=>$errorArray]);//
        }

        $this->postService->createPost($data);

        return $this->json(['data' => $data, 'status' => true, 'name' => 'addNewPost', 'message' => ' Success']);
    }
}



