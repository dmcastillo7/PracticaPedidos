# Estado de pedidos: REST + Polling y WebSockets

Aplicación de comparación sobre los mismos pedidos: Recibido → En preparación → En camino → Entregado.

## Instalación y ejecución

Requiere Node.js y npm. Desde esta carpeta:

npm ci
npm start

Abre http://localhost:3000 y las dos páginas lado a lado:

- http://localhost:3000/polling.html
- http://localhost:3000/websocket.html

Para otro equipo en la misma red, sustituye localhost por la IP del servidor y permite el acceso al puerto 3000.

## REST + Polling

- GET /api/pedidos devuelve la versión y la lista completa.
- POST /api/pedidos crea un pedido con JSON que contiene cliente y producto.
- PATCH /api/pedidos/:id/avanzar avanza el estado.
- Consulta inicial y consultas periódicas cada 3 segundos por defecto; permite elegir 1, 3, 5 o 10 segundos.
- La tabla se actualiza automáticamente cuando cambia la versión.
- El registro muestra cada consulta y respuesta HTTP. El contador de la página incluye únicamente GET de polling, sin POST ni PATCH.
- La consola del servidor registra cada 10 segundos todas las solicitudes a la API.

## WebSockets

- Conexión persistente a /ws. Recibe un mensaje inicial con todos los pedidos y después mensajes de actualización con cada pedido modificado.
- El servidor envía cambios sin consultas periódicas del cliente; la tabla se actualiza al recibirlos.
- El cliente envía mensajes crear y avanzar por la misma conexión.
- El registro muestra el contenido de mensajes enviados (→) y recibidos (←). La página cuenta los mensajes recibidos.
- La consola registra cada 10 segundos los envíos de actualizaciones; ese contador excluye mensajes iniciales y errores.
- Si la conexión se cierra, intenta reconectarse tras 3 segundos. Este reintento no es polling de pedidos.

## Demostración y evidencias

1. Abre ambas páginas y deja visible la consola del servidor.
2. Selecciona 10 segundos de polling para apreciar la diferencia.
3. Crea o avanza un pedido desde WebSockets. Observa los mensajes y la actualización al recibir el cambio.
4. Comprueba que polling muestra el mismo pedido en su siguiente consulta.
5. Crea o avanza desde polling y observa que WebSockets recibe el cambio automáticamente.
6. Compara consultas, respuestas sin cambios, mensajes, retrasos y datos recibidos. Guarda capturas como evidencia.
7. La pestaña de red de las herramientas del navegador permite inspeccionar los GET repetidos y los mensajes de /ws.

## Métricas y límites

Ambas implementaciones comparten pedidos.js. El servidor inicia con tres pedidos y simula un cambio cada 5 segundos; cuando todos están entregados, crea otro. Los datos están en memoria y se reinician al detener el servidor.

El retraso compara la hora del servidor con la del cliente; en equipos distintos requiere relojes sincronizados. La carga inicial se excluye del promedio. Los datos recibidos miden el contenido, sin cabeceras ni sobrecarga de red; no representan el tráfico total.

Polling descarga toda la lista y puede omitir estados intermedios entre consultas. WebSockets recibe la lista inicial y después cada pedido modificado. Esta práctica local no incluye autenticación ni almacenamiento permanente.

## Archivos principales

- server.js: servidor HTTP y conexión de los mecanismos.
- pedidos.js: almacén compartido, estados y simulación.
- rest-polling.js: API REST y contador de solicitudes.
- websocket.js: conexiones y difusión de cambios.
- public/polling.html y public/websocket.html: clientes.
- public/comun.js: tabla, métricas y registro compartidos.

## Integrantes Grupo 5
- Dario Castillo
- Dario Chuga
- Esteban Chiliquinga
- Marcos Bajaña
