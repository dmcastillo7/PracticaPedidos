//Servidor principal: sirve las páginas, la API REST y el WebSocket
const http = require('http');
const express = require('express');
const restPolling = require('./rest-polling');
const iniciarWebSocket = require('./websocket');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api', restPolling);

const servidor = http.createServer(app);
iniciarWebSocket(servidor);

servidor.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`  REST + Polling: http://localhost:${PORT}/polling.html`);
    console.log(`  WebSockets:     http://localhost:${PORT}/websocket.html`);
});
