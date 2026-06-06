'use strict';

/**
 * Módulo de Comparación de Mercado
 */
const Mercado = {
  datos: [],

  /**
   * Inicializa el módulo
   */
  init: function() {
    this.cargarDatos();
    this.configurarEventos();
  },

  /**
   * Carga los datos del mercado
   */
  cargarDatos: async function() {
    try {
      this.datos = await API.obtenerComparacionMercado();
      this.mostrarDatos();
    } catch (error) {
      console.error('Error al cargar datos del mercado:', error);
      this.mostrarError('No se pudieron cargar los datos del mercado');
    }
  },

  /**
   * Muestra los datos en la tabla
   */
  mostrarDatos: function() {
    const tbody = document.getElementById('mercado-body');
    if (!tbody) return;

    if (this.datos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay datos disponibles</td></tr>';
      return;
    }

    tbody.innerHTML = this.datos.map(item => {
      const precioNuestro = parseFloat(item.precio_nuestro || 0);
      const precioMercado = parseFloat(item.precio_mercado || 0);
      const diferencia = precioNuestro - precioMercado;
      const porcentaje = precioMercado > 0 ? ((diferencia / precioMercado) * 100).toFixed(2) : 0;
      
      const competitividad = this.calcularCompetitividad(diferencia, porcentaje);

      return `
        <tr>
          <td>${this.escaparHTML(item.producto_nombre || 'N/A')}</td>
          <td>$${precioNuestro.toFixed(2)}</td>
          <td>$${precioMercado.toFixed(2)}</td>
          <td class="price-diff ${diferencia > 0 ? 'positive' : 'negative'}">
            $${Math.abs(diferencia).toFixed(2)} (${porcentaje}%)
          </td>
          <td>
            <span class="competitividad ${competitividad.clase}">
              ${competitividad.texto}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Calcula el nivel de competitividad
   * @param {number} diferencia
   * @param {string|number} porcentaje
   * @returns {Object}
   */
  calcularCompetitividad: function(diferencia, porcentaje) {
    porcentaje = parseFloat(porcentaje);
    
    if (porcentaje <= -15) {
      return { clase: 'excellent', texto: 'Excelente' };
    } else if (porcentaje <= -5) {
      return { clase: 'good', texto: 'Buena' };
    } else if (porcentaje <= 5) {
      return { clase: 'fair', texto: 'Regular' };
    } else {
      return { clase: 'poor', texto: 'Baja' };
    }
  },

  /**
   * Configura los eventos
   */
  configurarEventos: function() {
    const btnActualizar = document.getElementById('btn-actualizar-mercado');
    if (btnActualizar) {
      btnActualizar.addEventListener('click', () => this.cargarDatos());
    }

    const busqueda = document.getElementById('busqueda-mercado');
    if (busqueda) {
      busqueda.addEventListener('input', (e) => this.filtrar(e.target.value));
    }
  },

  /**
   * Filtra los datos
   * @param {string} termino
   */
  filtrar: function(termino) {
    const tbody = document.getElementById('mercado-body');
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
  }
};

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  Mercado.init();
});
