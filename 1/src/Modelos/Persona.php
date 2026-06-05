<?php

namespace Agrosend\Modelos;

abstract class Persona
{
    protected int $id;
    protected string $nombre;
    protected string $email;

    public function __construct(int $id, string $nombre, string $email)
    {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->email = $email;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}