<?php

namespace Agrosend\Servicios;

use PDO;

abstract class BaseService
{
    protected PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
}