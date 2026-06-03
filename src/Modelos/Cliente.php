<?php

namespace Agrosend\Modelos;

class Cliente extends Persona
{
    private string $identificacion;
    private ?string $telefono;

    public function __construct(int $id, string $nombre, string $email, string $identificacion, ?string $telefono = null)
    {
        parent::__construct($id, $nombre, $email);
        $this->identificacion = $identificacion;
        $this->telefono = $telefono;
    }

    public function getIdentificacion(): string
    {
        return $this->identificacion;
    }

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }
}
