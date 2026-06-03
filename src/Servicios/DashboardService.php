<?php

namespace Agrosend\Servicios;

class DashboardService extends BaseService
{
    /**
     * Requerimiento: Alimentar gráficos de stock por producto
     */
    public function obtenerStockPorProducto(): array
    {
        $sql = "SELECT p.nombre AS producto, p.stock, c.nombre AS categoria 
                FROM productos p
                INNER JOIN categorias c ON p.categoria_id = c.id
                ORDER BY p.stock ASC";
        return $this->db->query($sql)->fetchAll();
    }
}