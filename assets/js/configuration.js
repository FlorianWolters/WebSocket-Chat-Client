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
 * @fileOverview Configuration file for the simple chat client based on the WebSocket protocol.
 * @author       <a href="mailto:florian.wolters.85@googlemail.com">Florian Wolters</a>
 * @author       <a href="mailto:steffen.schuette@web.de">Steffen Schütte</a>
 * @copyright    2012 Florian Wolters, Steffen Schütte
 * @license      http://gnu.org/licenses/lgpl.txt GNU LGPL
 * @version      0.1.0-beta
 * @see          <a href="http://github.com/FlorianWolters/WebSocket-Chat-Client">FlorianWolters/WebSocket-Chat-Client</a>
 * @since        File available since Release 0.1.0
 * @todo         This is a quick & dirty implementation. Should be refactored to OOP.
 */
 
// The global application configuration.
// IMPORTANT: The specified data is not validated.
var config = {
    // The URI scheme for the WebSocket connection.
    scheme: 'ws',
    // The hostname for the WebSocket connection.
    hostname: 'localhost',
    // The port for the WebSocket connection.
    port: 80
};
