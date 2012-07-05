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
 * @fileOverview A simple chat client based on the WebSocket protocol.
 * @author       <a href="mailto:wolters.fl@gmail.com">Florian Wolters</a>
 * @author       <a href="mailto:steffen.schuette@web.de">Steffen Schütte</a>
 * @copyright    2012 Florian Wolters, Steffen Schütte
 * @license      http://gnu.org/licenses/lgpl.txt LGPL-3.0+
 * @version      0.1.1-beta
 * @see          <a href="http://github.com/FlorianWolters/WebSocket-Chat-Client">FlorianWolters/WebSocket-Chat-Client</a>
 * @since        File available since Release 0.1.0
 */
$(document).ready(function() {

    /**
     * Appends a chat message with the specified username, the specified
     * datetime and the specified text to the chatlog.
     *
     * @param {string} username The username of the user who wrote the message.
     * @param {string} datetime The datetime of the message.
     * @param {string} text     The text of the message.
     *
     * @returns {void}
     */
    function addChatLineToChatlog(username, datetime, text) {
        addLineToChatlog(
            '<span class="uid">' + username + '</span>@<span class="ts">'
                + datetime + '</span>: ' + text,
            'message'
        );
    }

    /**
     * Appends a line (HTML list item <li> element) with a specified text and
     * a specified type to the chatlog.
     *
     * @param {string} text The text to append.
     * @param {string} type The output type ('info', 'warning' or 'error').
     *
     * @returns {void}
     */
    function addLineToChatlog(text, type) {
        $('#chatlog').append('<li class="' + type + '">' + text + '</li>');
    }

    /**
     * Refreshes the state of the form user interface (UI) elements.
     *
     * @param {WebSocketConnection} ws The WebSocketConnection.
     *
     * @returns {void}
     */
    function refreshUserInterface(ws) {
        var disabled = ws.isClosed();
        $('#uid').attr('disabled', !disabled);
        $('#connect').attr('disabled', !disabled);
        $('#disconnect').attr('disabled', disabled);
        $('#msg').attr('disabled', disabled);
        $('#send').attr('disabled', disabled);
    }

    /**
     * The JSON configuration.
     *
     * * config.host      The name of the host to connect to.
     * * config.resource  The name of the resource to connect to.
     * * config.port      The port to connect to.
     * * config.secure    Whether to use a secure connection.
     * * config.protocols One or more sub-protocols that the server must support
     *                    for the connection to be successful.
     */
    var config = null;

    $.ajax({
        url: 'config.json',
        async: false,
        dataType: 'json',
        success: function(response) {
            config = response;
        },
        error: function(response) {
            $('#chatclient').fadeOut('slow');
            $('<p>Unable to read the JSON configuration file.</p>')
                .appendTo('[role="main"]');
        }
    });

    addLineToChatlog('The chat client has been loaded.', 'info');

    if (!('WebSocket' in window)) {
        $('#chatclient').fadeOut('slow');
        $('<p>The web browser does not support the WebSocket protocol.</p>')
            .prependTo('[role="main"]');
    } else {
        // The web browser does support the WebSocket protocol.
        var ws = new WebSocketConnection(
            config.host, config.port, config.resource, config.secure,
            config.protocols
        );

        //$('<p>' . ws.uri . '</p>').appendTo('[role="main"]');
        refreshUserInterface(ws);

        // Event handler

        /**
         * Create a new WebSocket if the "Connect" button is clicked.
         *
         * @event
         */
        $('#connect').click(function() {
            if (ws.isOpened()) {
                addLineToChatlog('The connection is already open.', 'warning');
                return;
            }

            var uid = $('#uid').val();
            if ('' == uid) {
                addLineToChatlog('Please enter an username.', 'warning');
                return;
            }

            addLineToChatlog('Trying to connect to "' + ws.uri + '"...', 'info');

            try {
                // Triggers event onopen on success.
                ws.open();

                // WebSockets is an event-driven API.

                /**
                 * The WebSocket `onopen` event.
                 *
                 * @event
                 */
                ws.socket.onopen = function() {
                    refreshUserInterface(ws);
                    addLineToChatlog('The connection has been opened.', 'info');
                    // Send the username to authenticate the chat client at the
                    // chat server.
                    ws.send(uid);
                }

                /**
                 * The WebSocket `onmessage` event.
                 *
                 * @event
                 */
                ws.socket.onmessage = function(msg) {
                    var json = $.parseJSON(msg.data);
                    addChatLineToChatlog(json.uid, json.ts, json.msg);
                }

                /**
                * The WebSocket `onclose` event.
                 *
                 * @event
                 */
                ws.socket.onclose = function() {
                    refreshUserInterface(ws);
                    addLineToChatlog('The connection has been closed.', 'info');
                }
            } catch (ex) {
                addLineToChatlog('Exception: ' + ex, 'error');
            }
        });

        /**
         * Close the WebSocket if the "Disconnect" button is clicked.
         *
         * @event
         */
        $('#disconnect').click(function() {
            if (ws.isClosed()) {
                addLineToChatlog('The connection is not opened.', 'warning');
                return;
            }

            try {
                ws.close();
            } catch (ex) {
                addLineToChatlog('Exception: ' + ex, 'error');
            }

            refreshUserInterface(ws);
        });

        /**
         * Sets the state of the "Send" button in dependency of the value of the
         * "Message" input text field.
         *
         * @event
         * @todo This is extremely slow, hence commented. Find out why.
         */
        //$('#msg').change(function() {
        //    $('#send').attr('disabled', !$(this).val());
        //});

        /**
         * Send data via the WebSocket if the "Send" button is clicked.
         *
         * @event
         */
        $('#send').click(function() {
            handleSend();
        });

        /**
         * Send data via the WebSocket if the "Return" keyboard key is pressed.
         *
         * @event
         */
        $('#text').keypress(function(event) {
            if (event.keyCode == '13') {
                handleSend();
            }
        });

        /**
         * Sends data via the specified WebSocket and sets the correct state of
         * the user interface.
         *
         * @param {WebSocket} socket The WebSocket to send data with.
         *
         * @returns {void}
         * @function
         */
        function handleSend() {
            if (ws.isClosed()) {
                addLineToChatlog('Establish a connection first.', 'warning');
                return;
            }

            var msgInputField = $('#msg');
            var msg = msgInputField.val();
            if ('' == msg) {
                addLineToChatlog('Please enter a message.', 'warning');
                return;
            }

            try {
                ws.send(msg);
                msgInputField.val('');
            } catch (ex) {
                addLineToChatlog('Exception: ' + ex, 'error');
            }
        }
    }

});
