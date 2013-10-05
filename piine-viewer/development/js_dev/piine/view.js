// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A view class for the 'piine'.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.View');

goog.require('goog.color');
goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('piine.graph.UserReactionGraph');



/**
 * A class for piine view..
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
piine.View = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.graph_ = new piine.graph.UserReactionGraph(opt_domHelper);
  this.addChild(this.graph_);

  this.handler_ = this.createHandler();
};
goog.inherits(piine.View, goog.ui.Component);


/**
 * CSS class name for piine button elements.
 * @type {string}
 * @const
 */
piine.View.COUNTER_CLASS_NAME = goog.getCssName('piine-user-reaction-graph');


/**
 * CSS class name for piine view elements.
 * @type {string}
 * @const
 */
piine.View.VIEW_CLASS_NAME = goog.getCssName('piine-view');


/**
 * User reaction graph of the view.
 * @type {piine.graph.UserReactionGraph}
 * @private
 */
piine.View.prototype.graph_ = null;


/**
 * Event handler for the view.
 * @type {goog.events.EventHandler}
 * @private
 */
piine.View.prototype.handler_ = null;



/** @override */
piine.View.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  var canvas = this.getElementByClass(piine.View.COUNTER_CLASS_NAME);
  this.graph_.decorate(canvas);
};


/** @override */
piine.View.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler_.dispose();
};


/** @override */
piine.View.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.handler_.removeAll();
};


/**
 * Creates event handler for the view.
 * @return {goog.events.EventHandler} Event handler of the view.
 * @protected
 */
piine.View.prototype.createHandler = function() {
  return new goog.events.EventHandler(this);
};


/**
 * Adds an user.
 * @param {number} userId User ID of the user to add.
 */
piine.View.prototype.addUser = function(userId) {
  this.graph_.addUser(userId);
};


/**
 * Removes an user.
 * @param {number} userId User ID of the user to remove.
 */
piine.View.prototype.removeUser = function(userId) {
  this.graph_.removeUser(userId);
};


/**
 * Reacts an user.
 * @param {number} userId User ID of the user to react.
 */
piine.View.prototype.reactUser = function(userId) {
  this.graph_.reactUser(userId);
};
