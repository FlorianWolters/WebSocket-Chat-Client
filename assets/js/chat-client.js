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
 * @license      http://gnu.org/licenses/lgpl.txt GNU LGPL
 * @version      0.1.1-beta
 * @see          <a href="http://github.com/FlorianWolters/WebSocket-Chat-Client">FlorianWolters/WebSocket-Chat-Client</a>
 * @since        File available since Release 0.1.0
 * @todo         This is a quick & dirty implementation. Should be refactored to OOP.
 */
$(document).ready(function() {

    /**
     * The JSON configuration.
     *
     * Provides the following objects:
     *
     * * config.host      The hostname for the WebSocket connection.
     * * config.resource  The hostname for the WebSocket connection.
     * * config.port      The port for the WebSocket connection.
     * * config.secure    Whether to use a secure WebSocket connection.
     * * config.protocols The supported protocols.
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
            alert('Unable to read the JSON configuration file.');
        }
    });

    /**
     * Adds a line (HTML list item <li> element) with a specified text and
     * specified type to the chatlog.
     *
     * @param {string} text The text to add.
     * @param {string} type The output type, e.g. 'notice', 'warning', 'error'.
     *
     * @returns {void}
     */
    function addLineToChatlog(text, type) {
        $('#chatlog').append('<li class="' + type + '">' + text + '</li>');
    }

    /**
     * Prepends a specified string to a specified number if it is less than the
     * specified number.
     *
     * @param {integer} number   The number to check and prepend the string to.
     * @param {integer} lessThan The maximum number.
     * @param {string}  text     The text to prepend to the number if the number
     *                           is less that the maximum number.
     *
     * @returns {string} The corrected number.
     */
    function prependIfLessThan(number, lessThan, text) {
        if (number < lessThan) {
            number = text + number;
        }

        return number;
    }

    function prependZeroIfLessThanTen(number) {
        return prependIfLessThan(number, 10, '0');
    }

    addLineToChatlog('The WebSocket client has been loaded.', 'notice');

    if (!('WebSocket' in window)) {
        $('#chatclient').fadeOut('slow');
        $('<p>The web browser does not support the WebSocket protocol.</p>')
            .appendTo('[role="main"]');
    } else {
        // The web browser supports WebSockets.

        /**
         * Connects to the WebSocket server and sets the correct state of the
         * user interface.
         *
         * @returns {WebSocket} The WebSocket connection on success; `null`
         *                      otherwise.
         * @function
         */
        function connect(uri) {
            /**
             * The WebSocket connection.
             *
             * @type WebSocket
             */
            var socket = null;

            try {
                // Triggers event onopen on success.
                socket = new WebSocket(uri);

                $('#connect').attr('disabled', true);
                $('#disconnect').attr('disabled', false);
                $('#send').attr('disabled', false);

                // WebSockets is an event-driven API.

                /**
                 * The WebSocket `onopen` event.
                 *
                 * @event
                 */
                socket.onopen = function() {
                    addLineToChatlog(
                        'Connection opened (socket status: '
                            + socket.readyState + ').', 'open'
                    );
                }

                /**
                 * The WebSocket `onmessage` event.
                 *
                 * @event
                 */
                socket.onmessage = function(json) {
                    var jsonObj = $.parseJSON(json.data);
                    var data = '';

                    if (jsonObj.uid) {
                        data += '<span class="uid">' + jsonObj.uid + '</span>';
                    }

                    if (jsonObj.ts) {
                        var dateTime = new Date(jsonObj.ts * 1000);

                        var year = dateTime.getFullYear();
                        var month = prependZeroIfLessThanTen((dateTime.getMonth() + 1));
                        var day = prependZeroIfLessThanTen(dateTime.getDate());
                        var hours = prependZeroIfLessThanTen(dateTime.getHours());
                        var minutes = prependZeroIfLessThanTen(dateTime.getMinutes());
                        var seconds = prependZeroIfLessThanTen(dateTime.getSeconds());
                        var dateString = year + '-' + month + '-' + day + ' '
                            + hours + ':' + minutes + ':' + seconds

                        data += ' @ <span class="ts">' + dateString + '</span>';
                    }

                    data += ' : ' + jsonObj.msg;

                    addLineToChatlog(data, 'message');
                }

                /**
                * The WebSocket `onclose` event.
                 *
                 * @event
                 */
                socket.onclose = function() {
                    addLineToChatlog(
                        'Connection closed (socket status: '
                            + socket.readyState + ').', 'close'
                    );
                }
            } catch (ex) {
                addLineToChatlog('Exception: ' + ex, 'error');
            }

            return socket;
        }

        /**
         * Disconnect from the WebSocket server and sets the correct state of
         * the user interface.
         *
         * @returns {void}
         * @function
         */
        function disconnect(socket) {
            if (false == isOpened(socket)) {
                addLineToChatlog(
                    'The WebSocket client is not connected.', 'warning'
                );
                return;
            }

            // Triggers event onclose on success.
            socket.close();

            $('#disconnect').attr('disabled', true);
            $('#send').attr('disabled', true);
            $('#connect').attr('disabled', false);
        }

        /**
         * Sends data via the specified WebSocket and sets the correct state of
         * the user interface.
         *
         * @param {WebSocket} socket The WebSocket to send data with.
         *
         * @returns {void}
         * @function
         */
        function send(socket) {
            if (false == isOpened(socket)) {
                addLineToChatlog('Establish a connection first.', 'warning');
                return;
            }

            var uidObj = $('#uid');
            var msgObj = $('#msg');

            var uid = uidObj.val();
            var msg = msgObj.val();

            if (uid == '') {
                addLineToChatlog('Please enter an username.', 'warning');
                return;
            }

            if (msg == '') {
                addLineToChatlog('Please enter a message.', 'warning');
                return;
            }

            // This is the actual protocol of the chat client.
            var jsonObj = {
                // The current UNIX timestamp.
                'ts': Math.round(Date.now() / 1000),
                // The name of the chat user.
                'uid': uid,
                // The text of the chat message.
                'msg': msg
            };

            try {
                socket.send(JSON.stringify(jsonObj));
                msgObj.val('');
            } catch (ex) {
                addLineToChatlog('Exception: ' + ex, 'error');
            }
        }

        /**
         * Checks whether the specified WebSocket is opened.
         *
         * @param {WebSocket} socket The WebSocket to check.
         *
         * @returns {boolean} `true` if the WebSocket is opened; `false` otherwise.
         * @function
         */
        function isOpened(socket) {
            return (null != socket) && (socket.readyState == WebSocket.OPEN);
        }

        /**
         * The WebSocket URI string.
         *
         * @type string
         */
        var uri = '';

        uri = ("true" == config.secure) ? 'wss' : 'ws';
        uri += '://' + config.host + ':' + config.port + config.resource;

        /**
         * The WebSocket connection.
         *
         * @type WebSocket
         */
        var socket = connect(uri);

        // Event handler

        /**
         * Create a new WebSocket if the "Connect" button is clicked.
         *
         * @event
         */
        $('#connect').click(function() {
            socket = connect(uri);
        });

        /**
         * Send data via the WebSocket if the "Send" button is clicked.
         *
         * @event
         */
        $('#send').click(function() {
            send(socket);
        });

        /**
         * Send data via the WebSocket if the "Return" keyboard key is pressed.
         *
         * @event
         */
        $('#text').keypress(function(event) {
            if (event.keyCode == '13') {
                send(socket);
            }
        });

        /**
         * Close the WebSocket if the "Disconnect" button is clicked.
         *
         * @event
         */
        $('#disconnect').click(function() {
            disconnect(socket);
        });
    }

});
