//Almacén de pedidos compartido por las dos implementaciones (REST + Polling y WebSockets)
const { EventEmitter } = require('events');

const ESTADOS = ['Recibido', 'En preparación', 'En camino', 'Entregado'];

const eventos = new EventEmitter();
let pedidos = [];
let siguienteId = 1;
let version = 0; //Aumenta con cada cambio, sirve para saber si hubo novedades

function crearPedido(cliente, producto) {
    const pedido = {
        id: siguienteId++,
        cliente,
        producto,
        estado: ESTADOS[0],
        actualizadoEn: Date.now()
    };
    pedidos.push(pedido);
    version++;
    eventos.emit('cambio', pedido);
    return pedido;
}

function avanzarPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return null;
    const i = ESTADOS.indexOf(pedido.estado);
    if (i === ESTADOS.length - 1) return pedido; //Ya fue entregado
    pedido.estado = ESTADOS[i + 1];
    pedido.actualizadoEn = Date.now();
    version++;
    eventos.emit('cambio', pedido);
    return pedido;
}

function listar() {
    return { version, pedidos };
}

//Pedidos iniciales
crearPedido('Ana', 'Laptop');
crearPedido('Luis', 'Mouse inalámbrico');
crearPedido('María', 'Monitor 24"');

const CLIENTES = ['Carlos', 'Sofía', 'Pedro', 'Valeria', 'Jorge', 'Camila'];
const PRODUCTOS = ['Teclado', 'Audífonos', 'Celular', 'Impresora', 'Tablet', 'Parlante'];
const azar = lista => lista[Math.floor(Math.random() * lista.length)];

//Simulación: cada 5 segundos un pedido pendiente avanza de estado.
//Si ya se entregaron todos, llega un pedido nuevo para que la demo no se detenga
setInterval(() => {
    const pendientes = pedidos.filter(p => p.estado !== 'Entregado');
    if (pendientes.length === 0) {
        crearPedido(azar(CLIENTES), azar(PRODUCTOS));
        return;
    }
    const pedido = azar(pendientes);
    avanzarPedido(pedido.id);
}, 5000);

module.exports = { ESTADOS, eventos, crearPedido, avanzarPedido, listar };
