// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview A view class for the 'piine'.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.View');

goog.require('goog.color');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');
goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.fx.dom.BgColorTransform');
goog.require('goog.fx.dom.ColorTransform');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('piine.fx.dom.TextShadowAnimation');



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
 * CSS class name for piine button elements.
 * @type {string}
 * @const
 */
piine.View.BUTTON_CLASS_NAME = goog.getCssName('piine-btn');


/**
 * CSS class name for piine view elements.
 * @type {string}
 * @const
 */
piine.View.VIEW_CLASS_NAME = goog.getCssName('piine-view');


/**
 * Background color fir a piine reaction.
 * @enum {Array.<number>}
 */
piine.View.BgColor = {
  /** RGB array for the unreacted view. */
  UNREACTED: goog.color.hslToRgb(0, 0, 0.95),
  /** RGB array for the reacted view. */
  REACTED: goog.color.hslToRgb(42, 0.57, 0.58)
};


/**
 * Text color fir a piine reaction.
 * @enum {Array.<number>}
 */
piine.View.Color = {
  /** RGB array for the unreacted view. */
  UNREACTED: [0, 0, 0],
  /** RGB array for the reacted view. */
  REACTED: [255, 255, 255]
};


/**
 * Text-shadow values for a piine reaction.
 * @enum {piine.View.TextShadowAnimation.Values}
 */
piine.View.TextShadowValue = {
  /** Text-shadow style for the unreacted view. */
  UNREACTED: new piine.fx.dom.TextShadowAnimation.Values(0, 0, 10,
      [255, 255, 255, 0]),
  /** Text-shadow style for the reacted view. */
  REACTED: new piine.fx.dom.TextShadowAnimation.Values(0, 0, 10,
      [255, 255, 255, 1])
};


/**
 * Duration (milliseconds) for a piine reaction.
 * @type {number}
 * @const
 */
piine.View.REACTION_DURATION = 200;;


/**
 * Event handler for the view.
 * @type {goog.events.EventHandler}
 * @private
 */
piine.View.prototype.hundler_ = null;


/**
 * Element for the piine btton.
 * @type {Element}
 * @private
 */
piine.View.prototype.btnElem_ = null;


/**
 * Element for the view.
 * @type {Element}
 * @private
 */
piine.View.prototype.viewElem_ = null;


/**
 * Animation instance for the piine reaction.
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

  this.handler_.listen(
      this.viewElem_,
      [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN],
      this.handleTouchStart);
};


/** @override */
piine.View.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.handler_.removeAll();
  if (this.anim_) this.anim_.dispose();

  delete this.btnElem_;
  delete this.viewElem_;
};


/**
 * Creates event handler for the view.
 * @protected
 */
piine.View.prototype.createHandler = function() {
  this.handler_ = new goog.events.EventHandler(this);
};


/**
 * Reacts to piine.
 */
piine.View.prototype.react = function() {
  if (this.anim_) {
    this.anim_.dispose();
  }

  this.anim_ = new goog.fx.AnimationParallelQueue();

  var tsAnim = new piine.fx.dom.TextShadowAnimation(
      this.btnElem_,
      piine.View.TextShadowValue.REACTED,
      piine.View.TextShadowValue.UNREACTED,
      piine.View.REACTION_DURATION);

  var bgColorAnim = new goog.fx.dom.BgColorTransform(
      this.viewElem_,
      piine.View.BgColor.REACTED,
      piine.View.BgColor.UNREACTED,
      piine.View.REACTION_DURATION);

  var colorAnim = new goog.fx.dom.ColorTransform(
      this.viewElem_,
      piine.View.Color.REACTED,
      piine.View.Color.UNREACTED,
      piine.View.REACTION_DURATION);

   this.anim_.add(tsAnim);
   this.anim_.add(bgColorAnim);
   this.anim_.add(colorAnim);

   this.anim_.play();
};


/**
 * Handles touchstart/mousedown event.
 * @param {goog.events.Event} e The event to handle.
 */
piine.View.prototype.handleTouchStart = function(e) {
  this.react();
  e.preventDefault();
  e.stopPropagation();
};
