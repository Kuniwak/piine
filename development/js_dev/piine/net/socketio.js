// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A wrapper class for Socket.IO.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.net.SocketIo');

goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * A class for Socket.IO.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
piine.net.SocketIo = function() {
  goog.base(this);

  this.handler_ = new goog.events.EventHandler(this);
};
goog.inherits(piine.net.SocketIo, goog.events.EventTarget);


/**
 * Client-side script path of Socket.IO.
 * @type {string}
 * @const
 */
piine.net.SocketIo.SCRIPT_PATH = '/socket.io/socket.io.js';


/**
 * Event type fot the Socket.IO.
 * See: https://github.com/LearnBoost/socket.io/wiki/Exposed-events#client
 * @enum {string}
 */
piine.net.SocketIo.EventType = {
  /** "connect" is emitted when the socket connected successfully. */
  CONNECT: 'connect',

  /** "disconnect" is emitted when the socket disconnected. */
  DISCONNECT: 'disconnect',

  /**
   * "connect_failed" is emitted when socket.io fails to establish a connection
   * to the server and has no more transports to fallback to.
   */
  CONNECT_FAILED: 'connect_failed',

  /**
   * "error" is emitted when an error occurs and it cannot be handled by the
   * other event types.
   */
  ERROR: 'error',

  /**
   * "message" is emitted when a message sent with socket.send is received.
   *  message is the sent message, and callback is an optional acknowledgement
   *  function.
   */
  MESSAGE: 'message'
};


/**
 * Whether the client-side Socket.IO script was imported.
 * @type {boolean}
 * @private
 */
piine.net.SocketIo.imported_ = false;


/**
 * SocketNamespace object from Socket.IO.
 * @type {SocketNamespace}
 * @private
 */
piine.net.SocketIo.prototype.socket_ = null;


/**
 * Asserts whether this socket is opened.
 * @private
 */
piine.net.SocketIo.prototype.assertSocketExists_ = function() {
  goog.asserts.assert(goog.isDef(this.socket_), 'This socket is not opened.');
};


/**
 * Adds an event listener to the event target.
 * The mechanism to listen customize events by Socket.IO, so methods from
 * {@link goog.events.EventTarget} do not work well when your listener was
 * attached by the method.
 *
 * @param {string} type The type of the event to listen for.
 * @param {Function|Object} handler The function to handle the event. The
 *     handler can also be an object that implements the handleEvent method
 *     which takes the event object as argument.
 */
piine.net.SocketIo.prototype.addCustomEventListener = function(type, handler) {
  this.socket_['on'](type, goog.bind(handler, this));
};


/**
 * Checks to see if the web socket is open or not.
 *
 * @return {boolean} True if the web socket is open, false otherwise.
 */
piine.net.SocketIo.prototype.isOpen = function() {
  return piine.net.SocketIo.imported_ && this.socket_ &&
      this.socket_['socket']['open'];
};


/**
 * Creates and opens the Socket.IO.
 *
 * @param {string} url The URL to which to connect.
 */
piine.net.SocketIo.prototype.open = function(url) {
  this.serverAddr_ = url;
  this.importSocketIo();
};


/**
 * Imports client-side Socket.IO script.
 *
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 */
piine.net.SocketIo.prototype.importSocketIo = function(opt_domHelper) {
  if (piine.net.SocketIo.imported_) {
    this.handleScriptLoad();
    return;
  }

  var dom = opt_domHelper || goog.dom.getDomHelper();
  var uriObj = goog.Uri.parse(this.serverAddr_);
  uriObj.setPath(piine.net.SocketIo.SCRIPT_PATH);

  var script = goog.dom.createDom('script', { 'src': uriObj.toString(),
      'type': 'text/javascript' });

  this.handler_.listen(script, goog.events.EventType.LOAD,
      this.handleScriptLoad);

  dom.getDocument().body.appendChild(script)
  piine.net.SocketIo.imported_ = true;
};


/**
 * Closes the web socket connection.
 */

piine.net.SocketIo.prototype.close = function() {
  this.assertSocketExists_();
  this.socket_['disconnect']();
};


/**
 * Sends the message over the web socket.
 *
 * @param {string} message The message to send.
 */
piine.net.SocketIo.prototype.send = function(message) {
  this.assertSocketExists_();
  this.socket_['send'](message);
};


/**
 * Dispatechs event on the connected server.
 * @param {{type: string, data: *}} e The event to dispatch.
 */
piine.net.SocketIo.prototype.dispatchEventOnServer = function(e) {
  this.assertSocketExists_();
  this.socket_['emit'](e.type, e.data);
};


/**
 * Handles Socket.IO connect event.
 * @private
 */
piine.net.SocketIo.prototype.handleConnect_ = function() {
  this.dispatchEvent({ type: piine.net.SocketIo.EventType.CONNECT });
};


/**
 * Handles Socket.IO connect_failed event.
 * @private
 */
piine.net.SocketIo.prototype.handleConnectFailed_ = function(reason) {
  this.dispatchEvent({ type: piine.net.SocketIo.EventType.CONNECT_FAILED,
      reason: reason });
};


/**
 * Handles Socket.IO disconnect event.
 * @private
 */
piine.net.SocketIo.prototype.handleDisConnect_ = function(reason) {
  this.dispatchEvent({ type: piine.net.SocketIo.EventType.DISCONNECT,
      reason: reason });
};


/**
 * Handles Socket.IO error event.
 * @private
 */
piine.net.SocketIo.prototype.handleError_ = function(reason) {
  this.dispatchEvent({ type: piine.net.SocketIo.EventType.ERROR,
      reason: reason });
};


/**
 * Handles Socket.IO message event.
 * @private
 */
piine.net.SocketIo.prototype.handleMessage_ = function(msg) {
  this.dispatchEvent({ type: piine.net.SocketIo.EventType.MESSAGE,
      message: msg });
};


/**
 * Handles the event when fired client-side Socket.IO script was loaded.
 */
piine.net.SocketIo.prototype.handleScriptLoad = function() {
  var io = goog.global['io'];

  if (!goog.isDefAndNotNull(io)) {
    throw Error('Cannot find io: ' + io);
  }

  this.socket_ = io['connect'](this.serverAddr_);

  this.addCustomEventListener('connect', this.handleConnect_);
  this.addCustomEventListener('disconnect', this.handleDisConnect_);
  this.addCustomEventListener('connect_failed', this.handleConnectFailed_);
  this.addCustomEventListener('error', this.handleError_);
  this.addCustomEventListener('message', this.handleMessage_);
};


/** @override */
piine.net.SocketIo.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.isOpen()) {
    this.close();
  }

  this.handler_.dispose();

  delete this.socket_;
};
