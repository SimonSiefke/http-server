# fullExample

Shows how to use the http server together with the web socket server to send messages to the client (browser). The http server injects some javascript code into the `fullExample.html` file which is send to the client. The injected code creates a web socket connection to the websocket server and listens for message. Every two seconds, the web socket server sends a message to tell the client to reload the page.
