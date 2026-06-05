<?php

namespace Agrosend\Servicios;

use PDO;

class MarketComparisonService
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Compara los precios internos con referencias del mercado nacional
     */
    public function obtenerComparativaPrecios(): array
    {
        $sql = "SELECT id, nombre, precio_base FROM productos";
        $stmt = $this->db->query($sql);
        $productos = $stmt->fetchAll();

        $comparativa = [];
        foreach ($productos as $prod) {
            // Simulación de índice externo (En producción se consumiría una API externa o tabla de referencias)
            $precioMercadoReferencia = $prod['precio_base'] * var_market_index($prod['id']);
            $diferenciaDolar = $prod['precio_base'] - $precioMercadoReferencia;
            $porcentaje = ($diferenciaDolar / $precioMercadoReferencia) * 100;

            $comparativa[] = [
                "producto_id" => $prod['id'],
                "nombre" => $prod['nombre'],
                "precio_interno" => (float)$prod['precio_base'],
                "precio_mercado" => round($precioMercadoReferencia, 2),
                "desviacion_porcentaje" => round($porcentaje, 2),
                "estado" => $porcentaje > 0 ? "Más costoso" : "Competitivo"
            ];
        }

        return $comparativa;
    }
}

/**
 * Función auxiliar interna para simular variaciones del mercado
 */
function var_market_index(int $id): float
{
    $indices = [1 => 1.05, 2 => 0.92, 3 => 0.98, 4 => 1.12];
    return $indices[$id] ?? 1.00;
}
