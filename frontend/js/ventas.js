'use strict';

/**
 * Módulo de Ventas
 */
const Ventas = {
  ventas: [],
  clientes: [],
  productos: [],

  /**
   * Inicializa el módulo
   */
  init: function() {
    this.cargarDatos();
    this.configurarEventos();
  },

  /**
   * Carga los datos necesarios
   */
  cargarDatos: async function() {
    try {
      this.ventas = await API.obtenerVentas();
      this.clientes = await API.obtenerClientes();
      this.productos = await API.obtenerProductos();
      this.mostrarVentas();
      this.llenarSelects();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarError('No se pudieron cargar los datos');
    }
  },

  /**
   * Muestra las ventas en la tabla
   */
  mostrarVentas: function() {
    const tbody = document.getElementById('ventas-body');
    if (!tbody) return;

    if (this.ventas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay ventas registradas</td></tr>';
      return;
    }

    tbody.innerHTML = this.ventas.map(venta => `
      <tr>
        <td>${venta.id}</td>
        <td>${this.escaparHTML(venta.cliente_nombre || 'N/A')}</td>
        <td>${this.escaparHTML(venta.producto_nombre || 'N/A')}</td>
        <td>${venta.cantidad}</td>
        <td>$${parseFloat(venta.total || 0).toFixed(2)}</td>
        <td>${this.formatearFecha(venta.fecha)}</td>
        <td><span class="estado-badge estado-${venta.estado}">${venta.estado}</span></td>
      </tr>
    `).join('');
  },

  /**
   * Llena los selects del formulario
   */
  llenarSelects: function() {
    const selectCliente = document.getElementById('venta-cliente');
    const selectProducto = document.getElementById('venta-producto');

    if (selectCliente) {
      selectCliente.innerHTML = '<option value="">Seleccionar cliente</option>' +
        this.clientes.map(c => `<option value="${c.id}">${this.escaparHTML(c.nombre)}</option>`).join('');
    }

    if (selectProducto) {
      selectProducto.innerHTML = '<option value="">Seleccionar producto</option>' +
        this.productos.map(p => `<option value="${p.id}" data-precio="${p.precio}">${this.escaparHTML(p.nombre)}</option>`).join('');
    }
  },

  /**
   * Configura los eventos
   */
  configurarEventos: function() {
    const btnNuevo = document.getElementById('btn-nueva-venta');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => this.abrirModal());
    }

    const modal = document.getElementById('modal-venta');
    const btnCerrar = document.getElementById('modal-close-venta');
    const btnCancelar = document.getElementById('btn-cancelar-venta');
    const form = document.getElementById('form-venta');

    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => this.cerrarModal());
    }

    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => this.cerrarModal());
    }

    if (form) {
      form.addEventListener('submit', (e) => this.guardar(e));
    }

    const selectProducto = document.getElementById('venta-producto');
    const cantidad = document.getElementById('venta-cantidad');

    if (selectProducto) {
      selectProducto.addEventListener('change', () => this.calcularTotal());
    }

    if (cantidad) {
      cantidad.addEventListener('input', () => this.calcularTotal());
    }

    const busqueda = document.getElementById('busqueda-ventas');
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
   * Abre el modal
   */
  abrirModal: function() {
    this.limpiarFormulario();
    document.getElementById('modal-venta').classList.add('show');
  },

  /**
   * Cierra el modal
   */
  cerrarModal: function() {
    document.getElementById('modal-venta').classList.remove('show');
    this.limpiarFormulario();
  },

  /**
   * Limpia el formulario
   */
  limpiarFormulario: function() {
    const form = document.getElementById('form-venta');
    if (form) form.reset();
    const totalEl = document.getElementById('venta-total');
    if (totalEl) totalEl.value = '';
  },

  /**
   * Calcula el total de la venta
   */
  calcularTotal: function() {
    const selectProducto = document.getElementById('venta-producto');
    const cantidad = document.getElementById('venta-cantidad');
    const totalEl = document.getElementById('venta-total');

    if (!selectProducto || !cantidad || !totalEl) return;

    const opcionSeleccionada = selectProducto.options[selectProducto.selectedIndex];
    const precio = parseFloat(opcionSeleccionada.dataset.precio) || 0;
    const cantidadNum = parseInt(cantidad.value) || 0;
    const total = precio * cantidadNum;

    totalEl.value = total.toFixed(2);
  },

  /**
   * Guarda una venta
   * @param {Event} e
   */
  guardar: async function(e) {
    e.preventDefault();

    const clienteId = document.getElementById('venta-cliente').value;
    const productoId = document.getElementById('venta-producto').value;
    const cantidad = parseInt(document.getElementById('venta-cantidad').value);

    if (!clienteId || !productoId || !cantidad) {
      this.mostrarError('Por favor completa todos los campos');
      return;
    }

    const venta = {
      cliente_id: clienteId,
      producto_id: productoId,
      cantidad: cantidad
    };

    try {
      await API.crearVenta(venta);
      this.mostrarExito('Venta registrada correctamente');
      this.cerrarModal();
      this.cargarDatos();
    } catch (error) {
      console.error('Error al guardar venta:', error);
      this.mostrarError('Error al registrar la venta');
    }
  },

  /**
   * Filtra las ventas
   * @param {string} termino
   */
  filtrar: function(termino) {
    const tbody = document.getElementById('ventas-body');
    if (!tbody) return;

    const terminoLower = termino.toLowerCase();
    const filas = tbody.querySelectorAll('tr');

    filas.forEach(fila => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(terminoLower) ? '' : 'none';
    });
  },

  /**
   * Formatea una fecha
   * @param {string} fecha
   * @returns {string}
   */
  formatearFecha: function(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
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
  Ventas.init();
});
