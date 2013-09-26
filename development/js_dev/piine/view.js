// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A view class for the 'piine'.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.View');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');
goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.fx.dom.BgColorTransform');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * A class for piine view..
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
piine.View = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.createHandler();
};
goog.inherits(piine.View, goog.ui.Component);


/**
 * @type {string}
 * @const
 */
piine.View.BUTTON_CLASS_NAME = goog.getCssName('piine-btn');


/**
 * @type {string}
 * @const
 */
piine.View.BUTTON_CLASS_NAME_LIGHT = goog.getCssName(
    piine.View.BUTTON_CLASS_NAME, 'light');


/**
 * @type {string}
 * @const
 */
piine.View.VIEW_CLASS_NAME = goog.getCssName('piine-view');


/**
 * @type {string}
 * @const
 */
piine.View.VIEW_CLASS_NAME_LIGHT = goog.getCssName(
    piine.View.VIEW_CLASS_NAME, 'light');


/**
 * @type {goog.events.EventHandler}
 * @private
 */
piine.View.prototype.hundler_ = null;


/**
 * @type {Element}
 * @private
 */
piine.View.prototype.btnElem_ = null;


/**
 * @type {Element}
 * @private
 */
piine.View.prototype.viewElem_ = null;


/**
 * @type {goog.fx.Animation}
 * @private
 */
piine.View.prototype.anim_ = null;


/** @override */
piine.View.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.handler_.dispose();
};


/** @override */
piine.View.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.btnElem_ = this.getElementByClass(piine.View.BUTTON_CLASS_NAME);
  this.viewElem_ = this.getElement();;

  this.handler_.listen(this.viewElem_, goog.events.EventType.CLICK,
      this.handleClick);
};


/** @override */
piine.View.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.handler_.removeAll();

  delete this.btnElem_;
  delete this.viewElem_;
};


/**
 * @protected
 */
piine.View.prototype.createHandler = function() {
  this.handler_ = new goog.events.EventHandler(this);
};


/**
 *
 */
piine.View.prototype.blink = function() {
  goog.dom.classes.add(this.btnElem_, piine.View.BUTTON_CLASS_NAME_LIGHT);
  goog.dom.classes.add(this.viewElem_, piine.View.VIEW_CLASS_NAME_LIGHT);

  goog.dom.classes.remove(this.btnElem_, piine.View.BUTTON_CLASS_NAME_LIGHT);
  goog.dom.classes.remove(this.viewElem_, piine.View.VIEW_CLASS_NAME_LIGHT);
};


/**
 *
 */
piine.View.prototype.handleClick = function(e) {
  this.blink();
};
