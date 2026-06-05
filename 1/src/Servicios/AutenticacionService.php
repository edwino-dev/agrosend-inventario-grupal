<?php

namespace Agrosend\Servicios;

class AutenticacionService extends BaseService
{
    public function login(string $email, string $password): ?array
    {
        $sql = "SELECT u.*, r.nombre AS rol 
                FROM usuarios u 
                INNER JOIN roles r ON u.role_id = r.id 
                WHERE u.email = :email";
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['email' => $email]);
        $usuario = $stmt->fetch();

        if ($usuario && password_verify($password, $usuario['password'])) {
            return [
                "id" => $usuario['id'],
                "nombre" => $usuario['nombre'],
                "email" => $usuario['email'],
                "rol" => $usuario['rol']
            ];
        }
        return null;
    }
}