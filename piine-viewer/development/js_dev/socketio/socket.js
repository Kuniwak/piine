// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A wrapper class for Socket.IO.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('socketio.Socket');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');



/**
 * A wrapper class for Socket.IO.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
socketio.Socket = function() {
  goog.base(this);

  this.handler_ = new goog.events.EventHandler(this);
};
goog.inherits(socketio.Socket, goog.events.EventTarget);


/**
 * Client-side script path of Socket.IO.
 * @type {string}
 * @const
 */
socketio.Socket.SCRIPT_PATH = '/socket.io/socket.io.js';


/**
 * Event type for the Socket.IO.
 * See: https://github.com/LearnBoost/socket.io/wiki/Exposed-events#client
 * @enum {string}
 */
socketio.Socket.EventType = {
  /** "load" is emitted when the socket was loaded. */
  LOAD: 'load',

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
 * State for theSocket.IO sciprt loading.
 * @enum {string}
 */
socketio.Socket.State = {
  /** Has not started loading yet. */
  UNINITIALIZED: 'uninitialized',
  /** Is loading. */
  LOADING: 'loading',
  /** Fully loaded. */
  COMPLETE: 'complete'
};


/**
 * Whether the client-side Socket.IO script was imported.
 * @type {socketio.Socket.State}
 */
socketio.Socket.state = socketio.Socket.State.UNINITIALIZED;


/**
 * Element ID for the Socket.IO script tag.
 * @type {string}
 * @const
 */
socketio.Socket.SCRIPT_ID = 'socket-io-closure';


/**
 * @type {Object.<function>}
 * @private
 */
socketio.Socket.wrapperMap_ = {};


/**
 * SocketNamespace object from Socket.IO.
 * @type {SocketNamespace}
 * @private
 */
socketio.Socket.prototype.socket_ = null;


/** @override */
socketio.Socket.prototype.listen = function(type, listener, opt_useCapture,
      opt_listenerScope) {

  this.setWrapperIfNecessary_(type);
  goog.base(this, 'listen', type, listener, opt_useCapture,
      opt_listenerScope);
};


/** @override */
socketio.Socket.prototype.listenOnce = function(type, listener, opt_useCapture,
      opt_listenerScope) {

  this.setWrapperIfNecessary_(type);
  goog.base(this, 'listenOnce', type, listener, opt_useCapture,
      opt_listenerScope);
};


/**
 * Sets event listener wrapper if necessary.
 * Do not set the wrapper if specified event type was already set.
 * @param {string} type The event type to listen.
 * @private
 */
socketio.Socket.prototype.setWrapperIfNecessary_ = function(type) {
  var wrapperMap = socketio.Socket.wrapperMap_;
  var wrapper;

  if (type !== socketio.Socket.EventType.LOAD && !(type in wrapperMap)) {
    wrapper = wrapperMap[type] = this.createWrapper(type)
    this.addCustomEventListener_(type, wrapper)
  }
};


/**
 * Asserts whether this socket is opened.
 * @private
 */
socketio.Socket.prototype.assertSocketExists_ = function() {
  goog.asserts.assert(goog.isDefAndNotNull(this.socket_),
      'This socket is not opened.');
};


/**
 * Adds a listener to the end of the listeners array for the specified event.
 * @param {string} type The type of the event to listen for.
 * @param {Function|Object} handler The function to handle the event.
 * @private
 */
socketio.Socket.prototype.addCustomEventListener_ = function(type, handler) {
  this.assertSocketExists_();
  this.socket_['on'](type, handler);
};


/**
 * Remove a listener from the listener array for the specified event.
 * Caution: changes array indices in the listener array behind the listener.
 * @param {string} type The type of the event to listen for.
 * @param {Function|Object} handler The function to handle the event.
 * @private
 */
socketio.Socket.prototype.removeCustomEventListener_ = function(type, handler) {
  var wrapperMap = socketio.Socket.wrapperMap_;

  this.assertSocketExists_();
  this.socket_['removeListener'](type, handler);
};


/**
 * Returns created listener wrapper for Socket.IO.
 * @param {string} type The event type of wrapper.
 * @return {Function} Created wrapper function.
 * @protected
 */
socketio.Socket.prototype.createWrapper = function(type) {
  var wrapper;
  var that = this;

  switch (type) {
    case socketio.Socket.EventType.MESSAGE:
      return function(msg) {
        that.dispatchEvent({ type: type, message: msg });
      };
    case socketio.Socket.EventType.CONNECT:
      return function() {
        that.dispatchEvent({ type: type });
      };
    case socketio.Socket.EventType.DISCONNECT:
    case socketio.Socket.EventType.CONNECT_FAILED:
    case socketio.Socket.EventType.ERROR:
      return function(reason) {
        that.dispatchEvent({ type: type, data: reason });
      };
    default:
      return function() {
        var args = goog.array.toArray(arguments);
        that.dispatchEvent({ type: type, data: args });
      };
  }
};


/**
 * Checks to see if the web socket is open or not.
 *
 * @return {boolean} True if the web socket is open, false otherwise.
 */
socketio.Socket.prototype.isOpen = function() {
  return socketio.Socket.imported_ && this.socket_ &&
      this.socket_['socket']['open'];
};


/**
 * Creates and opens the Socket.IO.
 *
 * @param {string} url The URL to which to connect.
 * @param {boolean=} opt_enableDup Optional flag to enable duplicated
 *     connections.
 */
socketio.Socket.prototype.open = function(url, opt_enableDup) {
  this.serverAddr_ = url;
  this.enableDup_ = !!opt_enableDup;
  this.importSocketIo(opt_enableDup);
};


/**
 * Imports client-side Socket.IO script.
 */
socketio.Socket.prototype.importSocketIo = function() {
  var script;

  switch (socketio.Socket.state) {
    case socketio.Socket.State.COMPLETE:
      this.handleScriptLoad_();
      break;
    case socketio.Socket.State.LOADING:
      script = goog.dom.getElement(socketio.Socket.SCRIPT_ID);
      this.handler_.listen(script, goog.events.EventType.LOAD,
          this.handleScriptLoad_);
      break;
    case socketio.Socket.State.UNINITIALIZED:
      var uriObj = goog.Uri.parse(this.serverAddr_);
      uriObj.setPath(socketio.Socket.SCRIPT_PATH);

      script = goog.dom.createDom('script', {
          'src': uriObj.toString(),
          'type': 'text/javascript',
          'id': socketio.Socket.SCRIPT_ID });

      this.handler_.listen(script, goog.events.EventType.LOAD,
          this.handleScriptLoad_);

      goog.dom.getDocument().body.appendChild(script)
      socketio.Socket.state = socketio.Socket.State.LOADING;
      break;
    default:
      throw Error('Invalid state: ' + socketio.Socket.state);
  }
};


/**
 * Closes the web socket connection.
 */

socketio.Socket.prototype.close = function() {
  this.assertSocketExists_();
  this.socket_['disconnect']();
};


/**
 * Sends the message over the web socket.
 *
 * @param {string} message The message to send.
 */
socketio.Socket.prototype.send = function(message) {
  this.assertSocketExists_();
  this.socket_['send'](message);
};


/**
 * Dispatechs event on the connected server.
 * @param {{type: string, data: *}} e The event to dispatch.
 */
socketio.Socket.prototype.dispatchEventOnServer = function(e) {
  var type, data;

  if (goog.isString(e)) {
    type = e;
    data = null;
  }
  else {
    type = e.type;
    data = e.data;
  }

  goog.asserts.assertString(type);

  this.assertSocketExists_();
  this.socket_['emit'](type, data);
};


/**
 * Handles Socket.IO message event.
 * @private
 */
socketio.Socket.prototype.onmessage_ = function(msg) {
  this.dispatchEvent({ type: socketio.Socket.EventType.MESSAGE,
      message: msg });
};


/**
 * Handles the event when fired client-side Socket.IO script was loaded.
 * @private
 */
socketio.Socket.prototype.handleScriptLoad_ = function() {
  var io = goog.global['io'];

  if (!goog.isDefAndNotNull(io)) {
    throw Error('Cannot find io: ' + io);
  }

  socketio.Socket.state = socketio.Socket.State.COMPLETE;

  if (this.enableDup_) {
    this.socket_ = io['connect'](this.serverAddr_, { 'force new connection' : true });
  }
  else {
    this.socket_ = io['connect'](this.serverAddr_);
  }
  this.dispatchEvent(socketio.Socket.EventType.LOAD);
};


/** @override */
socketio.Socket.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.isOpen()) {
    this.close();
  }

  this.handler_.dispose();

  delete this.socket_;
};
