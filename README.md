# http server & websocket server for live reloading

The http server is responsible for injecting javascript code into the html files requested by the client. The injected code creates a web socket connection to the websocket server. If the websocket server sends a command (refreshing CSS, reloading the page, etc.) to the client, the client will execute that command.
