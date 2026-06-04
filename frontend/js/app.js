'use strict';

/**
 * Módulo Principal de la Aplicación
 */
const App = {
  seccionActual: 'dashboard',

  /**
   * Inicializa la aplicación
   */
  init: function() {
    this.configurarNavegacion();
    this.configurarMenuUsuario();
    this.configurarTema();
    this.mostrarSeccion('dashboard');
  },

  /**
   * Configura la navegación
   */
  configurarNavegacion: function() {
    const enlaces = document.querySelectorAll('.nav-link[data-section]');
    
    enlaces.forEach(enlace => {
      enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const seccion = enlace.dataset.section;
        this.mostrarSeccion(seccion);
        this.cerrarMenuHamburger();
      });
    });
  },

  /**
   * Muestra una sección
   * @param {string} nombreSeccion
   */
  mostrarSeccion: function(nombreSeccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(seccion => {
      seccion.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const seccion = document.getElementById(nombreSeccion);
    if (seccion) {
      seccion.classList.add('active');
      this.seccionActual = nombreSeccion;
      this.actualizarNavActiva(nombreSeccion);

      // Inicializar datos según la sección
      this.inicializarSeccion(nombreSeccion);
    }
  },

  /**
   * Inicializa los datos de cada sección
   * @param {string} nombreSeccion
   */
  inicializarSeccion: function(nombreSeccion) {
    switch(nombreSeccion) {
      case 'dashboard':
        if (typeof initDashboard === 'function') {
          initDashboard();
        }
        break;
      case 'productos':
        if (typeof Productos !== 'undefined') {
          Productos.cargarProductos();
        }
        break;
      case 'ventas':
        if (typeof Ventas !== 'undefined') {
          Ventas.cargarDatos();
        }
        break;
      case 'mercado':
        if (typeof Mercado !== 'undefined') {
          Mercado.cargarDatos();
        }
        break;
      case 'clientes':
        if (typeof Clientes !== 'undefined') {
          Clientes.cargarClientes();
        }
        break;
      case 'perfil':
        this.mostrarPerfil();
        break;
      case 'configuracion':
        this.mostrarConfiguracion();
        break;
    }
  },

  /**
   * Actualiza el link activo en la navegación
   * @param {string} nombreSeccion
   */
  actualizarNavActiva: function(nombreSeccion) {
    const enlaces = document.querySelectorAll('.nav-link[data-section]');
    enlaces.forEach(enlace => {
      if (enlace.dataset.section === nombreSeccion) {
        enlace.classList.add('active');
      } else {
        enlace.classList.remove('active');
      }
    });
  },

  /**
   * Configura el menú de usuario
   */
  configurarMenuUsuario: function() {
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');

    if (userBtn && dropdown) {
      userBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
      });

      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });

      // Cerrar sesión
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    }
  },

  /**
   * Cierra sesión
   */
  logout: async function() {
    if (confirm('¿Deseas cerrar sesión?')) {
      try {
        if (typeof Auth !== 'undefined') {
          await Auth.logout();
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  },

  /**
   * Configura el tema oscuro
   */
  configurarTema: function() {
    const checkbox = document.getElementById('tema-oscuro');
    
    if (checkbox) {
      // Cargar preferencia guardada
      const temaCargado = localStorage.getItem('tema-oscuro') === 'true';
      checkbox.checked = temaCargado;
      if (temaCargado) {
        document.body.classList.add('dark-theme');
      }

      // Cambiar tema
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          document.body.classList.add('dark-theme');
          localStorage.setItem('tema-oscuro', 'true');
        } else {
          document.body.classList.remove('dark-theme');
          localStorage.setItem('tema-oscuro', 'false');
        }
      });
    }
  },

  /**
   * Muestra el perfil del usuario
   */
  mostrarPerfil: function() {
    if (typeof Auth !== 'undefined' && Auth.usuario) {
      const usuario = Auth.usuario;
      
      document.getElementById('perfil-nombre').textContent = usuario.nombre || '-';
      document.getElementById('perfil-email').textContent = usuario.email || '-';
      document.getElementById('perfil-rol').textContent = usuario.rol || '-';
      document.getElementById('perfil-fecha').textContent = usuario.fecha_registro || '-';
    }
  },

  /**
   * Muestra la configuración
   */
  mostrarConfiguracion: function() {
    const temaOscuro = localStorage.getItem('tema-oscuro') === 'true';
    const notificaciones = localStorage.getItem('notificaciones') !== 'false';

    document.getElementById('tema-oscuro').checked = temaOscuro;
    document.getElementById('notificaciones').checked = notificaciones;

    const checkNotificaciones = document.getElementById('notificaciones');
    if (checkNotificaciones) {
      checkNotificaciones.addEventListener('change', () => {
        localStorage.setItem('notificaciones', checkNotificaciones.checked);
      });
    }
  },

  /**
   * Abre/cierra el menú hamburger
   */
  cerrarMenuHamburger: function() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  },

  /**
   * Configura el menú hamburger
   */
  configurarMenuHamburger: function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  App.configurarMenuHamburger();
});
