<?php

namespace Agrosend\Servicios;

use Exception;

class VentaService extends BaseService
{
    private const PORCENTAJE_IVA = 0.19;

    public function procesarVenta(array $datos): bool
    {
        try {
            $this->db->beginTransaction();
            $subtotal = 0.0;

            foreach ($datos['productos'] as $item) {
                $stmt = $this->db->prepare("SELECT stock FROM productos WHERE id = :id");
                $stmt->execute(['id' => $item['producto_id']]);
                $prod = $stmt->fetch();

                if (!$prod || $prod['stock'] < $item['cantidad']) {
                    throw new Exception("Stock insuficiente.");
                }
                $subtotal += $item['precio_unitario'] * $item['cantidad'];
            }

            $iva = $subtotal * self::PORCENTAJE_IVA;
            $totalNeto = $subtotal + $iva;

            $sqlVenta = "INSERT INTO ventas (usuario_id, cliente_id, total_base, total_iva, total_neto) 
                         VALUES (:usuario_id, :cliente_id, :subtotal, :iva, :totalNeto)";
            $stmtVenta = $this->db->prepare($sqlVenta);
            $stmtVenta->execute([
                'usuario_id' => $datos['usuario_id'],
                'cliente_id' => $datos['cliente_id'],
                'subtotal'   => $subtotal,
                'iva'        => $iva,
                'totalNeto'  => $totalNeto
            ]);

            $ventaId = $this->db->lastInsertId();

            foreach ($datos['productos'] as $item) {
                $sqlDetalle = "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario_base) 
                               VALUES (:venta_id, :producto_id, :cantidad, :precio)";
                $this->db->prepare($sqlDetalle)->execute([
                    'venta_id'    => $ventaId,
                    'producto_id' => $item['producto_id'],
                    'cantidad'    => $item['cantidad'],
                    'precio'      => $item['precio_unitario']
                ]);

                $sqlStock = "UPDATE productos SET stock = stock - :cant WHERE id = :id";
                $this->db->prepare($sqlStock)->execute([
                    'cant' => $item['cantidad'],
                    'id'   => $item['producto_id']
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}