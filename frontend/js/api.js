'use strict';

/**
 * Módulo API - Gestiona todas las llamadas a la API
 */
const API = {
  /**
   * Obtiene los productos desde la API
   * @returns {Promise<Array>}
   */
  obtenerProductos: async function() {
    try {
      const response = await fetch('api.php?action=productos');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  /**
   * Obtiene un producto por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  obtenerProducto: async function(id) {
    try {
      const response = await fetch(`api.php?action=producto&id=${id}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  },

  /**
   * Crea un nuevo producto
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  crearProducto: async function(producto) {
    try {
      const response = await fetch('api.php?action=crear_producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto)
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto
   * @param {number} id
   * @param {Object} producto
   * @returns {Promise<Object>}
   */
  actualizarProducto: async function(id, producto) {
    try {
      const response = await fetch(`api.php?action=actualizar_producto&id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto)
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Elimina un producto
   * @param {number} id
   * @returns {Promise<Object>}
   */
  eliminarProducto: async function(id) {
    try {
      const response = await fetch(`api.php?action=eliminar_producto&id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Obtiene los clientes
   * @returns {Promise<Array>}
   */
  obtenerClientes: async function() {
    try {
      const response = await fetch('api.php?action=clientes');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} cliente
   * @returns {Promise<Object>}
   */
  crearCliente: async function(cliente) {
    try {
      const response = await fetch('api.php?action=crear_cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  /**
   * Obtiene las ventas
   * @returns {Promise<Array>}
   */
  obtenerVentas: async function() {
    try {
      const response = await fetch('api.php?action=ventas');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return [];
    }
  },

  /**
   * Crea una nueva venta
   * @param {Object} venta
   * @returns {Promise<Object>}
   */
  crearVenta: async function(venta) {
    try {
      const response = await fetch('api.php?action=crear_venta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venta)
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  },

  /**
   * Obtiene la comparación de mercado
   * @returns {Promise<Array>}
   */
  obtenerComparacionMercado: async function() {
    try {
      const response = await fetch('api.php?action=mercado');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener comparación de mercado:', error);
      return [];
    }
  },

  /**
   * Obtiene los datos del usuario actual
   * @returns {Promise<Object|null>}
   */
  obtenerUsuarioActual: async function() {
    try {
      const response = await fetch('api.php?action=usuario_actual');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  /**
   * Realiza login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  login: async function(email, password) {
    try {
      const response = await fetch('api.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw error;
    }
  },

  /**
   * Realiza logout
   * @returns {Promise<Object>}
   */
  logout: async function() {
    try {
      const response = await fetch('api.php?action=logout', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al hacer logout:', error);
      throw error;
    }
  }
};
