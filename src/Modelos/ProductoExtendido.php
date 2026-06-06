<?php

namespace App\Modelos;

/**
 * Clase ProductoExtendido
 * * Modela un producto comercial con capacidades avanzadas de cálculo impositivo
 * y análisis comparativo de competitividad de precios en el mercado.
 * * @package App\Modelos
 * @author Tu Nombre / Código de Estudiante
 * @version 1.0.0
 */
class ProductoExtendido
{
    /**
     * @var string Nombre o identificador del producto.
     */
    private string $nombre;

    /**
     * @var float Precio base o coste neto del producto (sin impuestos).
     */
    private float $precioBase;

    /**
     * @var string Categoría a la que pertenece el producto (Requerido por la guía).
     */
    public string $categoria;

    /**
     * Constructor de la clase ProductoExtendido.
     * * @param string $nombre Nombre del producto.
     * @param float $precioBase Precio neto inicial del producto.
     * @param string $categoria Categoría asignada al producto.
     */
    public function __construct(string $nombre, float $precioBase, string $categoria)
    {
        $this->nombre = $nombre;
        $this->precioBase = $precioBase;
        $this->categoria = $categoria;
    }

    /**
     * Calcula el precio final del producto aplicando la tasa del Impuesto al Valor Agregado (IVA).
     * * @param float $tasa Porcentaje de IVA a aplicar (ej: 0.19 para 19% o 19.0 según el estándar del proyecto).
     * @return float El precio final del producto con el IVA incluido.
     */
    public function calcularPrecioConIVA(float $tasa): float
    {
        // Si la tasa viene como porcentaje entero (ej: 19), la convertimos a decimal (0.19)
        $factor = ($tasa > 1) ? ($tasa / 100) : $tasa;
        
        return $this->precioBase * (1 + $factor);
    }

    /**
     * Evalúa si el precio base del producto es inferior o igual al precio promedio del mercado,
     * determinando si es una opción competitiva comercialmente.
     * * @param float $precioMercado Precio de referencia del mismo producto en el mercado competidor.
     * @return bool Retorna true si el producto es competitivo (precio igual o menor), de lo contrario false.
     */
    public function esPrecioCompetitivo(float $precioMercado): bool
    {
        return $this->precioBase <= $precioMercado;
    }

    
    /**
     * Obtiene el nombre del producto.
     * * @return string
     */
    public function getNombre(): string
    {
        return $this->nombre;
    }

    /**
     * Obtiene el precio base del producto.
     * * @return float
     */
    public function getPrecioBase(): float
    {
        return $this->precioBase;
    }
}