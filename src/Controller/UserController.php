<?php

namespace App\Controller;

use App\Service\PostService;
use http\Client\Curl\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;

class UserController extends AbstractController
{

    /**
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null})
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("api/users", name="users")
     * @return JsonResponse
     */
    public function getUsers(UserService $userService)
    {
        $users= $userService->getAllUsers();

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($users));

        return $response;
    }


    /**
     * @Route("api/lastFive", name="LastPosts", methods="GET")
     * @param UserService $userService
     * @return JsonResponse
     */
    public function getLastFivePosts(UserService $userService)
    {
        $posts = $userService->lastFivePosts();

        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($posts));

        return $response;
    }
}
