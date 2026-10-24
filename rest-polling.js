//Implementación 1: API REST, el cliente consulta periódicamente (Polling)
const express = require('express');
const pedidos = require('./pedidos');

const router = express.Router();
let solicitudes = 0;

router.use((req, res, next) => {
    solicitudes++;
    next();
});

//GET: consultar todos los pedidos y la versión actual
router.get('/pedidos', (req, res) => {
    res.json(pedidos.listar());
});

//POST: crear un pedido nuevo
router.post('/pedidos', (req, res) => {
    const { cliente, producto } = req.body;
    if (!cliente || !producto) {
        return res.status(400).json({ error: 'cliente y producto son obligatorios' });
    }
    res.status(201).json(pedidos.crearPedido(cliente, producto));
});

//PATCH: avanzar el estado de un pedido
router.patch('/pedidos/:id/avanzar', (req, res) => {
    const pedido = pedidos.avanzarPedido(Number(req.params.id));
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
});

//Cada 10 segundos se muestra cuántas solicitudes HTTP llegaron
setInterval(() => {
    console.log(`[REST] Solicitudes HTTP en los últimos 10 s: ${solicitudes}`);
    solicitudes = 0;
}, 10000);

module.exports = router;
