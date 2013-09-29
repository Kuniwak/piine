// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A class for pinne reaction effects.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.graph.fx.ReactionEffect');

goog.require('piine.graph.fx.Effect');



/**
 * A class for graph effects.
 * @param {piine.graph.UserReactionGraph.UserNode} user The user is effected by
 *     this.
 * @constructor
 * @extends {piine.graph.fx.Effect}
 */
piine.graph.fx.ReactionEffect = function(user) {
  goog.base(this);
  this.user_ = user;
  this.end = piine.graph.fx.ReactionEffect.LIFE_TIME;
};
goog.inherits(piine.graph.fx.ReactionEffect, piine.graph.fx.Effect);


/**
 * Life time of the effect.
 * @type {number}
 * @const
 */
piine.graph.fx.ReactionEffect.LIFE_TIME = 10;


/**
 * Maximum radius for the effect.
 * @type {number}
 * @const
 */
piine.graph.fx.ReactionEffect.EFFECT_RADIUS = 200;


/**
 * RGB color array for the effect.  The element should be number in [0, 255].
 * @type {Array.<number>}
 */
piine.graph.fx.ReactionEffect.EFFECT_RGB = [209, 173, 89];


/** @override */
piine.graph.fx.ReactionEffect.prototype.render = function(ctx) {
  goog.base(this, 'render');
  var coords = this.user_.coords;
  var ratio = 1 - (1 - this.progress) * (1 - this.progress);
  ctx.beginPath();
  ctx.fillStyle = 'rgba(' + piine.graph.fx.ReactionEffect.EFFECT_RGB.concat(1 - ratio).join(',') + ')';
  ctx.arc(
    coords[0],
    coords[1],
    ratio * (piine.graph.fx.ReactionEffect.EFFECT_RADIUS - this.user_.radius),
    0,
    2 * Math.PI,
    false);

  ctx.closePath();
  ctx.fill();
};
