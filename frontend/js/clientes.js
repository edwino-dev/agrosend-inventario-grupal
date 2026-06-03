'use strict';

/**
 * Módulo de Clientes
 */
const Clientes = {
  clientes: [],
  clienteEditando: null,

  /**
   * Inicializa el módulo
   */
  init: function() {
    this.cargarClientes();
    this.configurarEventos();
  },

  /**
   * Carga los clientes desde la API
   */
  cargarClientes: async function() {
    try {
      this.clientes = await API.obtenerClientes();
      this.mostrarClientes();
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.mostrarError('No se pudieron cargar los clientes');
    }
  },

  /**
   * Muestra los clientes en la tabla
   */
  mostrarClientes: function() {
    const tbody = document.getElementById('clientes-body');
    if (!tbody) return;

    if (this.clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay clientes registrados</td></tr>';
      return;
    }

    tbody.innerHTML = this.clientes.map(cliente => `
      <tr>
        <td>${this.escaparHTML(cliente.nombre)}</td>
        <td>${this.escaparHTML(cliente.email)}</td>
        <td>${this.escaparHTML(cliente.telefono || 'N/A')}</td>
        <td>${cliente.compras || 0}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit btn-small" onclick="Clientes.abrirEditar(${cliente.id})">Editar</button>
            <button class="action-btn delete btn-small" onclick="Clientes.eliminar(${cliente.id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Configura los eventos
   */
  configurarEventos: function() {
    const btnNuevo = document.getElementById('btn-nuevo-cliente');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => this.abrirModal());
    }

    const modal = document.getElementById('modal-cliente');
    const btnCerrar = document.getElementById('modal-close-cliente');
    const btnCancelar = document.getElementById('btn-cancelar-cliente');
    const form = document.getElementById('form-cliente');

    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => this.cerrarModal());
    }

    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => this.cerrarModal());
    }

    if (form) {
      form.addEventListener('submit', (e) => this.guardar(e));
    }

    const busqueda = document.getElementById('busqueda-clientes');
    if (busqueda) {
      busqueda.addEventListener('input', (e) => this.filtrar(e.target.value));
    }

    if (modal) {
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.cerrarModal();
        }
      });
    }
  },

  /**
   * Abre el modal para nuevo cliente
   */
  abrirModal: function() {
    this.clienteEditando = null;
    this.limpiarFormulario();
    document.getElementById('modal-titulo-cliente').textContent = 'Nuevo Cliente';
    document.getElementById('modal-cliente').classList.add('show');
  },

  /**
   * Abre el modal para editar cliente
   * @param {number} id
   */
  abrirEditar: function(id) {
    const cliente = this.clientes.find(c => c.id === id);
    if (!cliente) return;

    this.clienteEditando = cliente;
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-email').value = cliente.email;
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-direccion').value = cliente.direccion || '';
    document.getElementById('modal-titulo-cliente').textContent = 'Editar Cliente';
    document.getElementById('modal-cliente').classList.add('show');
  },

  /**
   * Cierra el modal
   */
  cerrarModal: function() {
    document.getElementById('modal-cliente').classList.remove('show');
    this.limpiarFormulario();
    this.clienteEditando = null;
  },

  /**
   * Limpia el formulario
   */
  limpiarFormulario: function() {
    const form = document.getElementById('form-cliente');
    if (form) form.reset();
  },

  /**
   * Guarda un cliente
   * @param {Event} e
   */
  guardar: async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();

    if (!nombre || !email) {
      this.mostrarError('Por favor completa los campos obligatorios');
      return;
    }

    // Validar email
    if (!this.esEmailValido(email)) {
      this.mostrarError('Por favor ingresa un email válido');
      return;
    }

    const cliente = { nombre, email, telefono, direccion };

    try {
      if (this.clienteEditando) {
        await API.actualizarProducto(this.clienteEditando.id, cliente);
        this.mostrarExito('Cliente actualizado correctamente');
      } else {
        await API.crearCliente(cliente);
        this.mostrarExito('Cliente creado correctamente');
      }
      this.cerrarModal();
      this.cargarClientes();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      this.mostrarError('Error al guardar el cliente');
    }
  },

  /**
   * Elimina un cliente
   * @param {number} id
   */
  eliminar: async function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      await API.eliminarProducto(id);
      this.mostrarExito('Cliente eliminado correctamente');
      this.cargarClientes();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      this.mostrarError('Error al eliminar el cliente');
    }
  },

  /**
   * Filtra los clientes
   * @param {string} termino
   */
  filtrar: function(termino) {
    const tbody = document.getElementById('clientes-body');
    if (!tbody) return;

    const terminoLower = termino.toLowerCase();
    const filas = tbody.querySelectorAll('tr');

    filas.forEach(fila => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(terminoLower) ? '' : 'none';
    });
  },

  /**
   * Valida si un email es válido
   * @param {string} email
   * @returns {boolean}
   */
  esEmailValido: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Escapa caracteres HTML
   * @param {string} texto
   * @returns {string}
   */
  escaparHTML: function(texto) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Muestra mensaje de error
   * @param {string} mensaje
   */
  mostrarError: function(mensaje) {
    const container = document.getElementById('mensaje-dashboard');
    if (container) {
      container.innerHTML = `<div style="background:#f8d7da;color:#721c24;padding:12px;border-radius:4px;border:1px solid #721c24">${mensaje}</div>`;
    }
  },

  /**
   * Muestra mensaje de éxito
   * @param {string} mensaje
   */
  mostrarExito: function(mensaje) {
    const container = document.getElementById('mensaje-dashboard');
    if (container) {
      container.innerHTML = `<div style="background:#d4edda;color:#155724;padding:12px;border-radius:4px;border:1px solid #155724">${mensaje}</div>`;
      setTimeout(() => {
        container.innerHTML = '';
      }, 5000);
    }
  }
};

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  Clientes.init();
});
