// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A web app class for the piine.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.App');

goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('socketio.Socket');
goog.require('piine.View');



/**
 * A web app class for the piine.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
piine.App = function() {
  goog.base(this);
  this.handler_ = this.createHandler();
  this.socket_ = this.createWebSocket();
  this.view_ = this.createView();

  this.attachEvents();

  this.render();
};
goog.inherits(piine.App, goog.events.EventTarget);
goog.addSingletonGetter(piine.App);


/**
 * ID attribute for the piine view element.
 * @type {string}
 * @const
 */
piine.App.VIEW_ID = 'piine-view';


/**
 * IP address of the Socket.IO server.
 * @type {string}
 * @const
 */
piine.App.SERVER_ADDRESS = 'http://54.238.162.99:8888/';


/**
 * Event type string for the app.
 * @enum {string}
 */
piine.App.EventType = {
  SEND_PIINE: 'send_piine',
  RECEIVE_PIINE: 'receive_piine'
};


/**
 * View copoment for the app.
 * @type {goog.ui.Control}
 * @private
 */
piine.App.prototype.view_ = null;


/**
 * Web socket receiver for the app.
 * @type {goog.net.WebSocket}
 * @private
 */
piine.App.prototype.socket_ = null;


/**
 * Event handler for the app.
 * @type {goog.events.EventHandler}
 * @private
 */
piine.App.prototype.handler_ = null;


/**
 * Whether events are already attached.
 * @type {boolean}
 * @private
 */
piine.App.prototype.attached_ = false;


/** @override */
piine.App.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.view_.dispose();
  this.socket_.dispose();
  this.handler_.dispose();
};


/**
 * Attaches all events.
 */
piine.App.prototype.attachEvents = function() {
  if (!this.attached_) {
    this.handler_.listen(
        window,
        goog.events.EventType.UNLOAD,
        this.handleUnload);

    this.handler_.listenOnce(
        this.socket_,
        socketio.Socket.EventType.LOAD,
        this.handleLoad);

    this.handler_.listen(
        this.view_,
        piine.View.EventType.PIINE,
        this.handlePiineFromView);

    this.socket_.open(piine.App.SERVER_ADDRESS);
    this.attached_ = true;
  }
};


/**
 * Detaches all events.
 */
piine.App.prototype.detachEvents = function() {
  if (this.attached_) {
    this.handler_.removeAll();
    this.attached_ = false;
  }
};


/**
 * Creates a view component.
 * @protected
 */
piine.App.prototype.createView = function() {
  return new piine.View();
};


/**
 * Creates a web socket receivert.
 * @protected
 */
piine.App.prototype.createWebSocket = function() {
  return new socketio.Socket();
};


/**
 * Creates an event handler.
 * @protected
 */
piine.App.prototype.createHandler = function() {
  return new goog.events.EventHandler(this);
};


/**
 * Renders the view.
 */
piine.App.prototype.render = function() {
  var viewElem = goog.dom.getElement(piine.App.VIEW_ID);
  this.view_.decorate(viewElem);
};


/**
 * Send piine to sever.
 */
piine.App.prototype.sendPiine = function() {
  this.socket_.dispatchEventOnServer(piine.App.EventType.SEND_PIINE);
};


/**
 * Handles an load event.
 * @protected
 */
piine.App.prototype.handleLoad = function() {
  this.handler_.listen(
     this.socket_,
     piine.App.EventType.RECEIVE_PIINE,
     this.handleReceivePiine);

  this.handler_.listen(
      this.socket_,
      socketio.Socket.EventType.ERROR,
      this.handleServerError);
};


/**
 * Handles an unload event.
 * @param {goog.events.Event} e The event to handle.
 * @protected
 */
piine.App.prototype.handleUnload = function(e) {
  this.dispose();
};


/**
 * Handles a server response.
 * @param {goog.net.WebSocket.MessageEvent} e The event to handle.
 * @protected
 */
piine.App.prototype.handleReceivePiine = function(e) {
  this.view_.react();
};


/**
 * Handles a piine event.
 */
piine.App.prototype.handlePiineFromView = function() {
  this.sendPiine();
};
