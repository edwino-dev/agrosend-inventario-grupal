<?php

namespace Agrosend\Servicios;

class MercadoService extends BaseService
{
    /**
     * Requerimiento: Comparación de precios con mercado
     */
    public function compararPreciosInternos(): array
    {
        $sql = "SELECT nombre, precio_base FROM productos";
        $productos = $this->db->query($sql)->fetchAll();
        $analisis = [];

        foreach ($productos as $p) {
            $precioMercadoReferencia = $p['precio_base'] * 1.06; // Simulación del índice SIPSA
            $analisis[] = [
                "producto"       => $p['nombre'],
                "precio_interno" => (float)$p['precio_base'],
                "precio_mercado" => round($precioMercadoReferencia, 2),
                "estado"         => ($p['precio_base'] > $precioMercadoReferencia) ? "Alto" : "Competitivo"
            ];
        }
        return $analisis;
    }
}