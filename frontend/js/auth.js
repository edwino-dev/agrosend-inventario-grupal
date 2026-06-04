'use strict';

/**
 * Módulo de Autenticación
 */
const Auth = {
  usuario: null,
  token: null,

  /**
   * Inicializa el módulo de autenticación
   */
  init: function() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')) || null;
    this.token = localStorage.getItem('token') || null;
    this.verificarSesion();
  },

  /**
   * Realiza login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  login: async function(email, password) {
    try {
      const resultado = await API.login(email, password);
      
      if (resultado.success) {
        this.usuario = resultado.usuario;
        this.token = resultado.token;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        localStorage.setItem('token', this.token);
        this.actualizarUI();
        return true;
      } else {
        throw new Error(resultado.message || 'Error en login');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      this.mostrarError(error.message || 'No se pudo iniciar sesión');
      return false;
    }
  },

  /**
   * Realiza logout
   */
  logout: async function() {
    try {
      await API.logout();
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      this.usuario = null;
      this.token = null;
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      this.redirigirAlLogin();
    }
  },

  /**
   * Verifica si la sesión es válida
   */
  verificarSesion: function() {
    if (!this.usuario || !this.token) {
      this.redirigirAlLogin();
    }
  },

  /**
   * Comprueba si el usuario está autenticado
   * @returns {boolean}
   */
  estaAutenticado: function() {
    return this.usuario !== null && this.token !== null;
  },

  /**
   * Obtiene el usuario actual
   * @returns {Object|null}
   */
  obtenerUsuario: function() {
    return this.usuario;
  },

  /**
   * Obtiene el nombre del usuario
   * @returns {string}
   */
  obtenerNombre: function() {
    return this.usuario?.nombre || 'Usuario';
  },

  /**
   * Obtiene el rol del usuario
   * @returns {string}
   */
  obtenerRol: function() {
    return this.usuario?.rol || 'usuario';
  },

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} rol
   * @returns {boolean}
   */
  tieneRol: function(rol) {
    return this.usuario?.rol === rol;
  },

  /**
   * Actualiza la interfaz con la información del usuario
   */
  actualizarUI: function() {
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
      userNameEl.textContent = this.obtenerNombre();
    }
  },

  /**
   * Muestra un mensaje de error
   * @param {string} mensaje
   */
  mostrarError: function(mensaje) {
    const errorEl = document.getElementById('mensaje-dashboard');
    if (errorEl) {
      errorEl.style.cssText = `
        padding: 15px;
        margin: 10px 0;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #721c24;
        border-radius: 4px;
        display: block;
      `;
      errorEl.textContent = mensaje;
    }
  },

  /**
   * Redirige al login
   */
  redirigirAlLogin: function() {
    window.location.href = 'login.html';
  }
};

// Inicializar autenticación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
  Auth.actualizarUI();
});
