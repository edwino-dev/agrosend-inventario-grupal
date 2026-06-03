<?php

namespace Agrosend\Modelos;

class Producto
{
    private int $id;
    private string $nombre;
    private float $precioBase;
    private int $stock;
    private int $categoriaId;

    public function __construct(int $id, string $nombre, float $precioBase, int $stock, int $categoriaId)
    {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->precioBase = $precioBase;
        $this->stock = $stock;
        $this->categoriaId = $categoriaId;
    }

    public function getPrecioBase(): float
    {
        return $this->precioBase;
    }

    /**
     * Requerimiento: Cálculo dinámico de IVA (19%)
     */
    public function getPrecioConIva(): float
    {
        return $this->precioBase * 1.19;
    }

    public function getStock(): int
    {
        return $this->stock;
    }
}