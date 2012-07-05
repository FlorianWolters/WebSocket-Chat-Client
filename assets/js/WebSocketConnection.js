/**
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see http://gnu.org/licenses/lgpl.txt.
 *
 * @fileOverview A simple wrapper class for the WebSocket API.
 * @author       <a href="mailto:wolters.fl@gmail.com">Florian Wolters</a>
 * @author       <a href="mailto:steffen.schuette@web.de">Steffen Schütte</a>
 * @copyright    2012 Florian Wolters, Steffen Schütte
 * @license      http://gnu.org/licenses/lgpl.txt LGPL-3.0+
 * @version      0.1.1-beta
 * @see          <a href="http://github.com/FlorianWolters/WebSocket-Chat-Client">FlorianWolters/WebSocket-Chat-Client</a>
 * @since        File available since Release 0.1.1
 */
(function(window) {

    /**
     * Constructs a new WebSocketConnection.
     */
    function WebSocketConnection(host, port, resource, secure, protocols) {
        /**
         * The WebSocket URI string.
         *
         * @type string
         */
        this.uri = (true == secure) ? 'wss' : 'ws';
        this.uri += '://' + host + ':' + port + resource;
        this.protocol = protocols;

        /**
         * The WebSocket.
         *
         * @type WebSocket
         */
        this.socket = null;
    }

    /**
     * Checks whether this WebSocketConnection is closed.
     *
     * @returns {boolean} `true` if the WebSocketConnection is closed; `false` otherwise.
     */
    WebSocketConnection.prototype.isClosed  = function() {
        return !this.isOpened();
    }

    /**
     * Checks whether this WebSocketConnection is opened.
     *
     * @returns {boolean} `true` if the WebSocketConnection is opened; `false` otherwise.
     */
    WebSocketConnection.prototype.isOpened  = function() {
        return (null != this.socket) && (WebSocket.OPEN == this.getState());
    }

    /**
     * Returns the state of this WebSocketConnection.
     *
     * @returns {integer} The state.
     */
    WebSocketConnection.prototype.getState = function() {
        return this.socket.readyState;
    }

    /**
     * Opens this WebSocketConnection.
     *
     * @returns {void}
     */
    WebSocketConnection.prototype.open = function() {
        // Triggers event onopen on success.
        this.socket = new WebSocket(this.uri, this.protocol);
    }

    /**
     * Closes this WebSocketConnection.
     *
     * @returns {void}
     */
    WebSocketConnection.prototype.close = function() {
        // Triggers event onclose on success.
        this.socket.close();
    }

    /**
     * Sends data via this WebSocketConnection.
     *
     * @returns {void}
     */
    WebSocketConnection.prototype.send = function(data) {
        this.socket.send(data);
    }

    window.WebSocketConnection = WebSocketConnection;

}(window));
