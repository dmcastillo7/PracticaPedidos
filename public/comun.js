//Funciones compartidas por las dos páginas: dibujar la tabla y medir el retraso
const ESTADOS = ['Recibido', 'En preparación', 'En camino', 'Entregado'];
const vistos = {}; //id -> actualizadoEn del último cambio mostrado
const retrasos = [];
let bytesRecibidos = 0;

function $(id) { return document.getElementById(id); }

//Registra cuánto tardó en llegar cada cambio desde que ocurrió en el servidor
function medirRetraso(pedido, cargaInicial) {
    const anterior = vistos[pedido.id];
    vistos[pedido.id] = pedido.actualizadoEn;
    if (cargaInicial || anterior === pedido.actualizadoEn) return false;
    const retraso = Date.now() - pedido.actualizadoEn;
    retrasos.push(retraso);
    $('ultimoRetraso').textContent = retraso + ' ms';
    $('promedioRetraso').textContent = Math.round(retrasos.reduce((a, b) => a + b, 0) / retrasos.length) + ' ms';
    log(`Pedido #${pedido.id} → ${pedido.estado} (retraso ${retraso} ms)`);
    return true;
}

function sumarBytes(texto) {
    bytesRecibidos += new Blob([texto]).size;
    $('bytes').textContent = (bytesRecibidos / 1024).toFixed(1) + ' KB';
}

function dibujarTabla(pedidos, cambiados, alAvanzar) {
    $('tabla').innerHTML = pedidos.map(p => {
        const i = ESTADOS.indexOf(p.estado);
        return `<tr class="${cambiados.includes(p.id) ? 'nuevo' : ''}">
            <td>#${p.id}</td><td>${escapar(p.cliente)}</td><td>${escapar(p.producto)}</td>
            <td><span class="estado e${i}">${p.estado}</span></td>
            <td>${new Date(p.actualizadoEn).toLocaleTimeString()}</td>
            <td><button data-id="${p.id}" ${i === 3 ? 'disabled' : ''}>Avanzar</button></td></tr>`;
    }).join('');
    $('tabla').querySelectorAll('button').forEach(b => b.onclick = () => alAvanzar(Number(b.dataset.id)));
}

function escapar(t) {
    return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function log(texto) {
    const linea = document.createElement('div');
    linea.textContent = `[${new Date().toLocaleTimeString()}] ${texto}`;
    $('registro').prepend(linea);
}
