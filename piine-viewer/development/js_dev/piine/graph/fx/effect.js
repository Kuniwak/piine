
// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A class for graph effects.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */

goog.provide('piine.graph.fx.Effect');

goog.require('goog.Disposable');



/**
 * A class for graph effects.
 * @constructor
 * @extends {goog.Disposable}
 */
piine.graph.fx.Effect = function() {
  goog.base(this);
  this.time_ = 0;
  this.finished = false;
};
goog.inherits(piine.graph.fx.Effect, goog.Disposable);


/**
 * The progress as a number in [0, 1] of the effect.
 * @type {number}
 */
piine.graph.fx.Effect.prototype.progress = 0;


/**
 * The end time as an integer of the effect.
 * @type {number}
 */
piine.graph.fx.Effect.prototype.end = 0;


/**
 * Whether the effect was finished.
 * The effect will be automatically disposed if this flag is true.
 * @type {boolean}
 */
piine.graph.fx.Effect.prototype.finished;


/**
 * Updates the effect.
 */
piine.graph.fx.Effect.prototype.update = function() {
  if (this.time_ >= this.end) {
    this.finished = true;
  }
  else {
    this.progress = this.time_++ / this.end;
  }
};


/**
 * Renders the effect.
 * @param {CanvasRenderingContext2D} ctx Context where the effect is rendered
 *     on.
 */
piine.graph.fx.Effect.prototype.render = goog.nullFunction;


/** @override */
piine.graph.fx.Effect.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.graph_;
  delete this.user_;
};
