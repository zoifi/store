<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class RequiredFieldsValidator extends ConstraintValidator
{
    public function validate($data, Constraint $constraint)
    {
        $keys = array_keys($data);
        $missingFields = [];
        $emptyFields = [];

        foreach ($data as $field=>$value) {
            if (in_array($field, $keys) && $value==="") {
                $missingFields[] = $field;
                continue;
            }
            $fieldValue = trim($value);


            if (false === $fieldValue || (empty($fieldValue) && '0' != $fieldValue)) {
                $emptyFields[] = $field;
            }
        }

        $errorFields = array_merge($missingFields, $emptyFields);

        if (count($errorFields) > 0) {
            /* @var $constraint RequiredFields */
            $this->context->buildViolation($constraint->message)->atPath(implode(',', $errorFields))->addViolation();
        }
    }
}
