'use strict';

/**
 * Módulo de Productos
 */
const Productos = {
  productos: [],
  productoEditando: null,

  /**
   * Inicializa el módulo
   */
  init: function() {
    this.cargarProductos();
    this.configurarEventos();
  },

  /**
   * Carga los productos desde la API
   */
  cargarProductos: async function() {
    try {
      this.productos = await API.obtenerProductos();
      this.mostrarProductos();
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.mostrarError('No se pudieron cargar los productos');
    }
  },

  /**
   * Muestra los productos en la tabla
   */
  mostrarProductos: function() {
    const tbody = document.getElementById('productos-body');
    if (!tbody) return;

    if (this.productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos registrados</td></tr>';
      return;
    }

    tbody.innerHTML = this.productos.map(producto => `
      <tr>
        <td>${this.escaparHTML(producto.nombre)}</td>
        <td>${producto.stock}</td>
        <td>$${parseFloat(producto.precio || 0).toFixed(2)}</td>
        <td>${this.escaparHTML(producto.categoria || 'N/A')}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit btn-small" onclick="Productos.abrirEditar(${producto.id})">Editar</button>
            <button class="action-btn delete btn-small" onclick="Productos.eliminar(${producto.id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Configura los eventos
   */
  configurarEventos: function() {
    const btnNuevo = document.getElementById('btn-nuevo-producto');
    if (btnNuevo) {
      btnNuevo.addEventListener('click', () => this.abrirModal());
    }

    const modal = document.getElementById('modal-producto');
    const btnCerrar = document.getElementById('modal-close-producto');
    const btnCancelar = document.getElementById('btn-cancelar-producto');
    const form = document.getElementById('form-producto');

    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => this.cerrarModal());
    }

    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => this.cerrarModal());
    }

    if (form) {
      form.addEventListener('submit', (e) => this.guardar(e));
    }

    const busqueda = document.getElementById('busqueda-productos-list');
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
   * Abre el modal para nuevo producto
   */
  abrirModal: function() {
    this.productoEditando = null;
    this.limpiarFormulario();
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    document.getElementById('modal-producto').classList.add('show');
  },

  /**
   * Abre el modal para editar producto
   * @param {number} id
   */
  abrirEditar: function(id) {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) return;

    this.productoEditando = producto;
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-stock').value = producto.stock;
    document.getElementById('producto-precio').value = producto.precio || 0;
    document.getElementById('producto-categoria').value = producto.categoria || '';
    document.getElementById('modal-titulo').textContent = 'Editar Producto';
    document.getElementById('modal-producto').classList.add('show');
  },

  /**
   * Cierra el modal
   */
  cerrarModal: function() {
    document.getElementById('modal-producto').classList.remove('show');
    this.limpiarFormulario();
    this.productoEditando = null;
  },

  /**
   * Limpia el formulario
   */
  limpiarFormulario: function() {
    const form = document.getElementById('form-producto');
    if (form) form.reset();
  },

  /**
   * Guarda un producto
   * @param {Event} e
   */
  guardar: async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('producto-nombre').value.trim();
    const stock = parseInt(document.getElementById('producto-stock').value);
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const categoria = document.getElementById('producto-categoria').value;

    if (!nombre || !stock || !precio || !categoria) {
      this.mostrarError('Por favor completa todos los campos');
      return;
    }

    const producto = { nombre, stock, precio, categoria };

    try {
      if (this.productoEditando) {
        await API.actualizarProducto(this.productoEditando.id, producto);
        this.mostrarExito('Producto actualizado correctamente');
      } else {
        await API.crearProducto(producto);
        this.mostrarExito('Producto creado correctamente');
      }
      this.cerrarModal();
      this.cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      this.mostrarError('Error al guardar el producto');
    }
  },

  /**
   * Elimina un producto
   * @param {number} id
   */
  eliminar: async function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await API.eliminarProducto(id);
      this.mostrarExito('Producto eliminado correctamente');
      this.cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      this.mostrarError('Error al eliminar el producto');
    }
  },

  /**
   * Filtra los productos
   * @param {string} termino
   */
  filtrar: function(termino) {
    const tbody = document.getElementById('productos-body');
    if (!tbody) return;

    const terminoLower = termino.toLowerCase();
    const filas = tbody.querySelectorAll('tr');

    filas.forEach(fila => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(terminoLower) ? '' : 'none';
    });
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
  Productos.init();
});
