# WebSocket-Chat-Client

A chat client using the WebSocket protocol.

This is a multi-user chat client that implements [The WebSocket Protocol][1]. It makes use of [HTML5][10], [CSS][11] and the JavaScript library [jQuery][2].

The following compatible chat server implementations do currently exist:

* [FlorianWolters/PHP-WebSocket-Chat-Server][3]: A WebSocket chat server implemented with the [PHP][4] library [Ratchet][5].
* [SteffenSchuette/WebSocket-Chat-Server][4] for an example WebSocket chat server implemented with the [C#][7] library [Fleck][8].

## Features

* The user can enter a username to use in the chat.
* The user can connect and disconnect the client via two buttons.
* Outputs status messages, warnings and errors in the chatlog.
* Chat messages can be send via the return key on the keyboard or a button.
* A chat message (and the output) consists of the the username, the datetime and the text of the message.
* Application Programming Interface (API) documentation with [JSDoc][9].
* Valid [HTML5][10].
* Valid [CSS][11].

## Installation/Usage

1. [optional] Start a WebSocket chat server which implements the defined chat protocol (see below).
2. [optional] Edit the connection options in the configuration file `/config.json` to point to the desired WebSocket chat server.
3. Serve the project directory with a webserver, e.g. [Apache HTTP Server][14] or [Internet Information Services (IIS)][15].
4. Open the address of the previously configured webserver in a web browser.

**Notice:** The project contains a `web.config` file to use with IIS. That file associates the `.json` file extension with the MIME type `application/json`.

## Used Technologies

* [jQuery][2] v1.7.2
* [HTML5][10]
* [CSS][11]
* [normalize.css][12]

## Chat Protocol

All you need to know to implement your own WebSocket chat server is the following:

* The client expects chat messages in the following [JavaScript Object Notation (JSON)][13] format:

  ```json
  {
      "ts" : "2012-07-05 00:00:00",
      "uid": "Florian Wolters",
      "msg": "hello, world"
  }
  ```

* The chat server expects a single string as the message from the chat client. In the example above, the chat message sent to the chat server has been `hello, world`.
* The client sends the username after a connection has been established (on the `onopen` event). In the example above, the first chat message sent to the chat server has been `Florian Wolters`.
* After the processing of the message from the chat client one has to send a multicast (or broadcast) message to all connected chat clients (including the one that has send the message).

## Roadmap/TODO

* Improve documentation.
* Refactoring of the JavaScript source code (`assets/js/chat-client.js`): Use object-oriented programming (OOP).
* Correct [JSDoc][9] documentation (currently only the file comments appear within the HTML output of jsdoc-toolkit).

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program. If not, see http://gnu.org/licenses/lgpl.txt.



[1]: http://tools.ietf.org/html/rfc6455
[2]: http://jquery.com
[3]: https://github.com/FlorianWolters/PHP-WebSocket-Chat-Server
[4]: http://php.net
[5]: http://socketo.me
[6]: https://github.com/SteffenSchuette/WebSocket-Chat-Server
[7]: http://msdn.microsoft.com/vcsharp
[8]: https://github.com/statianzo/Fleck
[9]: http://code.google.com/p/jsdoc-toolkit/w
[10]: http://w3.org/TR/html5
[11]: http://w3.org/Style/CSS
[12]: https://necolas.github.com/normalize.css
[13]: http://json.org
[14]: http://httpd.apache.org
[15]: http://iis.net
