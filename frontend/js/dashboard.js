'use strict';

/**
 * Obtiene los productos desde la API.
 * @returns {Promise<Array>} Array de productos válidos
 */
async function fetchProductos() {
  try {
    const response = await fetch('api.php');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('La respuesta no es un array válido');
    }
    
    const productosValidos = data.filter(producto => {
      return (
        producto &&
        typeof producto === 'object' &&
        producto.nombre &&
        typeof producto.nombre === 'string' &&
        producto.stock !== undefined &&
        !isNaN(Number(producto.stock)) &&
        Number(producto.stock) >= 0
      );
    });
    
    return productosValidos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    mostrarMensaje(
      'No se pudieron cargar los productos. Intenta más tarde.',
      'error'
    );
    return [];
  }
}

/**
 * Dibuja un gráfico de barras en canvas mostrando el stock de productos.
 * @param {Array} productos - Array de productos con propiedades id, nombre, stock
 */
function renderGrafico(productos) {
  const canvas = document.getElementById('grafico-stock');
  
  if (!canvas) {
    console.warn('Canvas con id "grafico-stock" no encontrado');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  if (!productos || productos.length === 0) {
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'No hay datos disponibles para mostrar.',
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }
  
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const margenIzq = 50;
  const margenDer = 20;
  const margenArriba = 20;
  const margenAbajo = 40;
  
  const anchoDisponible = canvas.width - margenIzq - margenDer;
  const altoDisponible = canvas.height - margenArriba - margenAbajo;
  
  const stockMaximo = Math.max(...productos.map(p => Number(p.stock)));
  const anchoBarras = anchoDisponible / productos.length;
  const anchoActual = Math.max(anchoBarras * 0.7, 20);
  const separacion = (anchoBarras - anchoActual) / 2;
  
  const colores = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
  ];
  
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margenIzq, margenArriba);
  ctx.lineTo(margenIzq, canvas.height - margenAbajo);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(margenIzq, canvas.height - margenAbajo);
  ctx.lineTo(canvas.width - margenDer, canvas.height - margenAbajo);
  ctx.stroke();
  
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const valor = Math.round((stockMaximo / 5) * i);
    const y = canvas.height - margenAbajo - (altoDisponible / 5) * i;
    ctx.fillText(valor, margenIzq - 10, y + 4);
    
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margenIzq, y);
    ctx.lineTo(canvas.width - margenDer, y);
    ctx.stroke();
  }
  
  productos.forEach((producto, index) => {
    const stock = Number(producto.stock);
    const escala = altoDisponible / stockMaximo;
    const alturaBarra = stock * escala;
    
    const x = margenIzq + index * anchoBarras + separacion;
    const y = canvas.height - margenAbajo - alturaBarra;
    
    const color = colores[index % colores.length];
    ctx.fillStyle = color;
    ctx.fillRect(x, y, anchoActual, alturaBarra);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, anchoActual, alturaBarra);
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(stock, x + anchoActual / 2, y - 5);
    
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    const nombreTruncado = producto.nombre.length > 12
      ? producto.nombre.substring(0, 10) + '...'
      : producto.nombre;
    ctx.fillText(
      nombreTruncado,
      x + anchoActual / 2,
      canvas.height - margenAbajo + 15
    );
  });
}

/**
 * Filtra la tabla de productos según el término de búsqueda.
 * @param {string} termino - Término a buscar
 */
function filtrarTabla(termino) {
  const tabla = document.getElementById('tabla-productos');
  
  if (!tabla) {
    console.warn('Tabla con id "tabla-productos" no encontrada');
    return;
  }
  
  const filas = tabla.querySelectorAll('tbody tr');
  const terminoLower = termino.toLowerCase().trim();
  
  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase();
    const visible = texto.includes(terminoLower);
    fila.style.display = visible ? '' : 'none';
  });
}

/**
 * Muestra un mensaje al usuario en el contenedor de mensajes.
 * @param {string} texto - Texto del mensaje
 * @param {string} tipo - Tipo de mensaje: 'error', 'success', 'warning', 'info'
 */
function mostrarMensaje(texto, tipo = 'info') {
  let contenedor = document.getElementById('mensaje-dashboard');
  
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'mensaje-dashboard';
    document.body.insertBefore(contenedor, document.body.firstChild);
  }
  
  const colores = {
    error: '#f8d7da',
    success: '#d4edda',
    warning: '#fff3cd',
    info: '#d1ecf1'
  };
  
  const colorTexto = {
    error: '#721c24',
    success: '#155724',
    warning: '#856404',
    info: '#0c5460'
  };
  
  contenedor.style.cssText = `
    padding: 15px;
    margin: 10px 0;
    background-color: ${colores[tipo] || colores.info};
    color: ${colorTexto[tipo] || colorTexto.info};
    border: 1px solid ${colorTexto[tipo] || colorTexto.info};
    border-radius: 4px;
    display: block;
  `;
  
  contenedor.textContent = texto;
  
  if (tipo === 'success') {
    setTimeout(() => {
      contenedor.style.display = 'none';
    }, 5000);
  }
}

/**
 * Muestra el indicador de carga.
 */
function mostrarCarga() {
  let loading = document.getElementById('loading-dashboard');
  
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading-dashboard';
    document.body.appendChild(loading);
  }
  
  loading.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  `;
  
  loading.innerHTML = `
    <div style="
      background: white;
      padding: 20px 40px;
      border-radius: 8px;
      text-align: center;
    ">
      <div style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      "></div>
      <p style="margin-top: 10px; color: #333;">Cargando...</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
}

/**
 * Oculta el indicador de carga.
 */
function ocultarCarga() {
  const loading = document.getElementById('loading-dashboard');
  
  if (loading) {
    loading.style.display = 'none';
  }
}

/**
 * Inicializa el dashboard cargando productos, renderizando gráfico y configurando búsqueda.
 */
async function initDashboard() {
  mostrarCarga();
  
  try {
    const productos = await fetchProductos();
    
    renderGrafico(productos);
    
    const inputBusqueda = document.getElementById('busqueda-producto');
    if (inputBusqueda) {
      inputBusqueda.addEventListener('input', (e) => {
        filtrarTabla(e.target.value);
      });
    }
    
    mostrarMensaje('Productos cargados correctamente.', 'success');
  } catch (error) {
    console.error('Error durante la inicialización del dashboard:', error);
    mostrarMensaje(
      'Error al inicializar el dashboard. Recarga la página.',
      'error'
    );
  } finally {
    ocultarCarga();
  }
}

// Se inicializa cuando se carga la sección de dashboard
document.addEventListener('DOMContentLoaded', () => {
  const dashboardSection = document.getElementById('dashboard');
  if (dashboardSection && dashboardSection.classList.contains('active')) {
    initDashboard();
  }
});
