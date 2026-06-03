<?php

namespace Agrosend\Modelos;

class Usuario extends Persona
{
    private string $password;
    private int $roleId;

    public function __construct(int $id, string $nombre, string $email, string $password, int $roleId)
    {
        parent::__construct($id, $nombre, $email);
        $this->password = $password;
        $this->roleId = $roleId;
    }

    public function getRoleId(): int
    {
        return $this->roleId;
    }

    public function verificarPassword(string $password): bool
    {
        return password_verify($password, $this->password);
    }
}