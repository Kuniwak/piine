// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview An animation class for text-shadow.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.fx.dom.TextShadowAnimation');

goog.require('goog.array');
goog.require('goog.fx.dom.PredefinedEffect');



/**
 * A class for text-shadow animation.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {piine.fx.dom.TextShadowAnimation.Values} start Start values.
 * @param {piine.fx.dom.TextShadowAnimation.Values} end End values.
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @extends {goog.fx.dom.PredefinedEffect}
 */
piine.fx.dom.TextShadowAnimation = function(element, start, end, time, opt_acc) {
  goog.base(this, element, start.toCoords(), end.toCoords(), time, opt_acc);
};
goog.inherits(piine.fx.dom.TextShadowAnimation, goog.fx.dom.PredefinedEffect);


/** @override */
piine.fx.dom.TextShadowAnimation.prototype.updateStyle = function() {
  this.setStyle();
};


/**
 * Animation event handler that will set the style of an element.
 */
piine.fx.dom.TextShadowAnimation.prototype.setStyle = function() {
  var coordsAsInts = Array(3);
  for (var i = 0; i < 3; i++) {
    coordsAsInts[i] = Math.round(this.coords[i]) + 'px';
  }

  var colorArray = Array(4);
  for (; i < 6; i++) {
    colorArray[i - 3] = Math.round(this.coords[i]);
  }

  colorArray[3] = this.coords[6];

  this.element.style.textShadow = coordsAsInts.join(' ') + ' rgba(' +
      colorArray.join(',') + ')';
};



/**
 * A class for text-shadow values.
 *
 * @param {?number} opt_offsetX Offset horizontal distance.
 * @param {?number} opt_offsetY Offset vertical distance.
 * @param {?number} opt_blurRadius Blur radius.
 * @param {?Array.<number>} opt_rgbaArray RGBA array. RGB must be an integer in
 *     [0, 255], and A must be number in [0, 1].
 * @constructor
 */
piine.fx.dom.TextShadowAnimation.Values = function(opt_offsetX, opt_offsetY,
    opt_blurRadius, opt_rgbaArray) {

  if (opt_offsetX) this.offsetX = opt_offsetX;
  if (opt_offsetY) this.offsetY = opt_offsetY;
  if (opt_blurRadius) this.blurRadius = opt_blurRadius;
  if (opt_rgbaArray) this.rgbaArray = opt_rgbaArray;
};


/**
 * Offset horizontal distance of the text shadow.
 * @type {number}
 */
piine.fx.dom.TextShadowAnimation.Values.prototype.offsetX = 0;


/**
 * Offset vertical distance of the text shadow.
 * @type {number}
 */
piine.fx.dom.TextShadowAnimation.Values.prototype.offsetY = 0;


/**
 * Blue radius of the text shadow.
 * @type {number}
 */
piine.fx.dom.TextShadowAnimation.Values.prototype.blurRadius = 0;


/**
 * 3D array for the text shadow color RGBA.
 * r (red) must be an integer in [0, 255].
 * g (green) must be an integer in [0, 255].
 * b (blue) must be an integer in [0, 255].
 * a (alpha) must be a number in [0, 1].
 * @type {Array.<number>}
 */
piine.fx.dom.TextShadowAnimation.Values.prototype.rgbaArray = null;


/**
 * Returns a coordinates array for {@link goog.fx.dom.PredefinedEffect}.
 * @return {Array.<number>} Coords array for Textshadowanimation arguments.
 */
piine.fx.dom.TextShadowAnimation.Values.prototype.toCoords = function() {
  return goog.array.concat([this.offsetX, this.offsetY, this.blurRadius],
      this.rgbaArray);
};
