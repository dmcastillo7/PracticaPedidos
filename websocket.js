//Implementación 2: WebSockets, el servidor envía los cambios al instante
const { WebSocketServer } = require('ws');
const pedidos = require('./pedidos');

function iniciarWebSocket(servidorHttp) {
    const wss = new WebSocketServer({ server: servidorHttp, path: '/ws' });
    let mensajesEnviados = 0;

    //Enviar un mensaje a todos los clientes conectados
    function difundir(datos) {
        const texto = JSON.stringify(datos);
        wss.clients.forEach((cliente) => {
            if (cliente.readyState === cliente.OPEN) {
                cliente.send(texto);
                mensajesEnviados++;
            }
        });
    }

    wss.on('connection', (socket, req) => {
        console.log(`[WS] Cliente conectado desde ${req.socket.remoteAddress}. Conectados: ${wss.clients.size}`);

        //Al conectarse, el cliente recibe el estado completo una sola vez
        socket.send(JSON.stringify({ tipo: 'inicial', ...pedidos.listar() }));

        //Mensajes que llegan del cliente (comunicación bidireccional)
        socket.on('message', (data) => {
            let msg;
            try {
                msg = JSON.parse(data.toString());
            } catch {
                return socket.send(JSON.stringify({ tipo: 'error', error: 'JSON inválido' }));
            }
            if (msg.tipo === 'crear' && msg.cliente && msg.producto) {
                pedidos.crearPedido(msg.cliente, msg.producto);
            } else if (msg.tipo === 'avanzar') {
                pedidos.avanzarPedido(Number(msg.id));
            }
        });

        socket.on('close', () => {
            console.log(`[WS] Cliente desconectado. Conectados: ${wss.clients.size}`);
        });
    });

    //Cada cambio en los pedidos se envía a todos los clientes (push)
    pedidos.eventos.on('cambio', (pedido) => {
        difundir({ tipo: 'actualizacion', version: pedidos.listar().version, pedido });
    });

    setInterval(() => {
        console.log(`[WS] Mensajes enviados en los últimos 10 s: ${mensajesEnviados} (clientes: ${wss.clients.size})`);
        mensajesEnviados = 0;
    }, 10000);
}

module.exports = iniciarWebSocket;
