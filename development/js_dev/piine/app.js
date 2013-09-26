// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A web app class for the 'piine'.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.App');

goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.WebSocket');
goog.require('piine.View');



/**
 * A web app class for the 'piine'.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
piine.App = function() {
  this.createHandler();
  this.createWebSocket();
  this.createView();

  this.attachEvents();

  this.render();
};
goog.inherits(piine.App, goog.events.EventTarget);
goog.addSingletonGetter(piine.App);


/**
 * @type {string}
 * @const
 */
piine.App.VIEW_ID = 'piine-view';


/**
 * @type {goog.ui.Control}
 * @private
 */
piine.App.prototype.view_ = null;


/**
 * @type {goog.net.WebSocket}
 * @private
 */
piine.App.prototype.socket_ = null;


/**
 * @type {goog.events.EventHandler}
 * @private
 */
piine.App.prototype.handler_ = null;


/**
 * @type {boolean}
 * @private
 */
piine.App.prototype.attached_ = false;


piine.App.prototype.attachEvents = function() {
  var socketEvents = goog.net.WebSocket.EventType;

  if (!this.attached_) {
    this.handler_.listen(window, goog.events.EventType.UNLOAD, this.handleUnload);
    this.handler_.listen(this.socket_, socketEvents.MESSAGE, this.handleServerResponse);
    this.handler_.listen(this.socket_, socketEvents.ERROR, this.handleServerError);
    this.attached_ = true;
  }
};


piine.App.prototype.detachEvents = function() {
  if (this.attached_) {
    this.handler_.removeAll();
    this.attached_ = false;
  }
};


/** @override */
piine.App.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.view_.dispose();
  this.socket_.dispose();
  this.handler_.dispose();
};


/**
 * @protected
 */
piine.App.prototype.createView = function() {
  this.view_ = new piine.View();
};


/**
 * @protected
 */
piine.App.prototype.createWebSocket = function() {
  this.socket_ = new goog.net.WebSocket();
};


/**
 * @protected
 */
piine.App.prototype.createHandler = function() {
  this.handler_ = new goog.events.EventHandler(this);
};


/**
 * @param {goog.events.Event} e The event.
 * @protected
 */
piine.App.prototype.handleUnload = function(e) {
  this.dispose();
};


/**
 * @param {goog.net.WebSocket.MessageEvent} e The event.
 * @protected
 */
piine.App.prototype.handleServerResponse = function(e) {
  this.view_.blink();
};


/**
 * Renders the view.
 */
piine.App.prototype.render = function() {
  var viewElem = goog.dom.getElement(piine.App.VIEW_ID);
  this.view_.decorate(viewElem);
};
