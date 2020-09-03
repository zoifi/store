<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class RequiredFields extends Constraint
{
    public $message = '';
    public $fields = [];
}
