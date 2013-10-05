// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A graph class for piine user counter.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */



goog.provide('piine.graph.UserReactionGraph');

goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.math');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');
goog.require('goog.ui.Component');
goog.require('piine.graph.fx.ReactionEffect');
goog.require('piine.graph.math');



/**
 * A class for user reaction graph.
 * @constructor
 * @extends {goog.ui.Component}
 */
piine.graph.UserReactionGraph = function(opt_domHelper) {
  goog.base(this, opt_domHelper);


  /**
   * The map for user registrations.
   * @type {goog.structs.Map}
   * @private
   */
  this.usersMap_ = new goog.structs.Map();


  /**
   * The active effects set.
   * @type {goog.structs.Map}
   * @private
   */
  this.effects_ = new goog.structs.Set();


  /**
   * The timer for rendering the graph.
   * @type {goog.Timer}
   * @private
   */
  this.timer_ = new goog.Timer(piine.graph.UserReactionGraph.REFRESH_RATE);


  /**
   * The event handler of the graph.
   * @type {goog.events.EventHandler}
   */
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.timer_, goog.Timer.TICK, this.handleTick);
};
goog.inherits(piine.graph.UserReactionGraph, goog.ui.Component);


/**
 * Doubled pi.
 * @type {number}
 * @const
 */
var PI2 = Math.PI * 2;


piine.graph.UserReactionGraph.CLOCKWISE_WIND = 0.0003;


piine.graph.UserReactionGraph.REFRESH_RATE = 33;


piine.graph.UserReactionGraph.COLOR = 'rgb(209, 173, 89)';


piine.graph.UserReactionGraph.MAX_ANGLE_RATE = 0.25;


piine.graph.UserReactionGraph.USER_NODE_RADIUS = 6;


piine.graph.UserReactionGraph.ORBITAAL_RADIUS = 250;


piine.graph.UserReactionGraph.FRICTION_COEFFICIENT = 0.2;


piine.graph.UserReactionGraph.REPULSION_COEFFICIENT = 0.00005;


piine.graph.UserReactionGraph.OUTER_CIRCLE_RADIUS = 250;


piine.graph.UserReactionGraph.INNER_CIRCLE_RADIUS = 230;


piine.graph.UserReactionGraph.OUTER_CIRCLE_LINE_WIDTH = 4;


piine.graph.UserReactionGraph.INNER_CIRCLE_LINE_WIDTH = 1;


piine.graph.UserReactionGraph.WIDTH = 800;


piine.graph.UserReactionGraph.HEIGHT = 600;


piine.graph.UserReactionGraph.MAX_USER_COUNT = 100;


/**
 * Handles the timer tick event.
 */
piine.graph.UserReactionGraph.prototype.handleTick = function() {
  this.reallocate();
  this.refreshEffects();
  this.render(this.getContext());
};


/**
 * Returns average of angle rates.
 * @return {number} Average of angle rates.
 */
piine.graph.UserReactionGraph.prototype.getAngleRateAverage = function() {
  var count = this.usersMap_.getCount();
  var sum = 0;
  goog.structs.forEach(this.usersMap_, function(user) {
    sum += Math.abs(user.angleRate);
  });

  return count > 1 ?  sum / count : 0;
};


/**
 * Returns digit for the average of angle rates.
 * @return {number} Digit number for the average of angle rates.
 */
piine.graph.UserReactionGraph.prototype.getAngleRateAverageOrder = function() {
  var avg = this.getAngleRateAverage();
  return avg > 0 ? Math.floor(Math.log(avg) / Math.log(10)) + 1 : NaN;
};


/**
 * Adds an user by the specified user ID.
 * @param {string} userId User ID for the user to react.
 */
piine.graph.UserReactionGraph.prototype.addUser = function(userId) {
  var userCount = this.usersMap_.getCount();
  if (userCount >= piine.graph.UserReactionGraph.MAX_USER_COUNT) {
    console.log('Too many users!');
    return;
  }

  var user = new piine.graph.UserReactionGraph.UserNode(userId, this);

  if (userCount === 1) {
    user.angle = piine.graph.math.supplementaryAngle(
        this.usersMap_.getValues()[0].angle);
  }
  else if (userCount > 1) {
    var angles = [];
    goog.structs.forEach(this.usersMap_, function(user) {
      angles.push(user.angle);
    });

    goog.array.sort(angles);

    var maxDist = Number.MIN_VALUE;
    var dist = 0;
    var center = 0;

    for (var i = 1; i < userCount; i++) {
      dist = piine.graph.math.angleDifference(angles[i - 1], angles[i]);
      if (Math.abs(dist) > maxDist) {
        maxDist = dist;
        center = piine.graph.math.centerAngle(angles[i - 1], angles[i]);
      }
    }

    user.angle = center;
  }


  this.usersMap_.set(userId, user);
};


/**
 * Removes an user by the specified user ID.
 * @param {string} userId User ID for the user to react.
 */
piine.graph.UserReactionGraph.prototype.removeUser = function(userId) {
  var toRemove = this.usersMap_.get(userId);

  if (goog.isDefAndNotNull(toRemove)) {
    this.usersMap_.remove(userId);
    toRemove.dispose();
  }
};


/**
 * Reacts an user by the specified user ID.
 * @param {string} userId User ID for the user to react.
 */
piine.graph.UserReactionGraph.prototype.reactUser = function(userId) {
  if (this.usersMap_.containsKey(userId)) {
    this.usersMap_.get(userId).react();
  }
};


/**
 * Reallocates all users by the simulation of Dynamic Model.
 */
piine.graph.UserReactionGraph.prototype.reallocate = function() {
  goog.structs.forEach(this.usersMap_, function(user, userId) {

    // Caulurates for each torque.
    user.torque = -piine.graph.UserReactionGraph.FRICTION_COEFFICIENT * user.angleRate;
    goog.structs.forEach(this.usersMap_, function(other, otherId) {
      if (userId !== otherId) {
        var dtheta = piine.graph.math.angleDifference(user.angle, other.angle);
        var df;

        df = dtheta === 0 ? 0 :
            piine.graph.UserReactionGraph.REPULSION_COEFFICIENT / dtheta;

        user.torque -= df;
      }
    }, this);
  }, this);

  // Caulurates for each angle rate and angle.
  goog.structs.forEach(this.usersMap_, function(user, userId) {
    user.angleRate = goog.math.clamp(
        user.angleRate + user.torque,
        -piine.graph.UserReactionGraph.MAX_ANGLE_RATE,
        piine.graph.UserReactionGraph.MAX_ANGLE_RATE);

    user.angle = piine.graph.math.standardAngle(
      user.angle + user.angleRate + piine.graph.UserReactionGraph.CLOCKWISE_WIND);

  }, this);
};


/**
 * Registers the effect.  Only registered effects will be rendered.
 * @param {piine.graph.fx.Effect} effect The effect to be registered.
 */
piine.graph.UserReactionGraph.prototype.registerEffect = function(effect) {
  this.effects_.add(effect);
};


/**
 * Unregisters the effect.  Unregistered effects will be not rendered.
 * @param {piine.graph.fx.Effect} effect The effect to be registered.
 */
piine.graph.UserReactionGraph.prototype.unregisterEffect = function(effect) {
  this.effects_.remove(effect);
  effect.dispose();
};


/**
 * Refreshes all effects.
 */
piine.graph.UserReactionGraph.prototype.refreshEffects = function() {
  var effectsToRemove = [];
  goog.structs.forEach(this.effects_, function(effect) {
    if (effect.finished) {
      effectsToRemove.push(effect);
    }
    else {
      effect.update();
    }
  }, this);

  goog.array.forEach(effectsToRemove, function(effectToRemove) {
    this.unregisterEffect(effectToRemove);
  }, this);
};


/**
 * Renders the graph.
 * @param {CanvasRenderingContext2D} ctx Context where the graph is rendered
 *     on.
 */
piine.graph.UserReactionGraph.prototype.render = function(ctx) {
  ctx.clearRect(0, 0, piine.graph.UserReactionGraph.WIDTH, piine.graph.UserReactionGraph.HEIGHT);

  this.renderCircles(ctx);
  this.renderUsers(ctx);
  this.renderEffects(ctx);
};


/**
 * Renders all user nodes on graph.
 * @param {CanvasRenderingContext2D} ctx Context where the users is rendered
 *     on.
 */
piine.graph.UserReactionGraph.prototype.renderUsers = function(ctx) {
  goog.structs.forEach(this.usersMap_, function(user) {
    user.render(ctx);
  }, this);
};


/**
 * Renders all effects on graph.
 * @param {CanvasRenderingContext2D} ctx Context where the effects is rendered
 *     on.
 */
piine.graph.UserReactionGraph.prototype.renderEffects = function(ctx) {
  goog.structs.forEach(this.effects_, function(effect) {
    effect.render(ctx);
  }, this);
};


/**
 * Renders all circles on graph.
 * @param {CanvasRenderingContext2D} ctx Context where the circles is rendered
 *     on.
 */
piine.graph.UserReactionGraph.prototype.renderCircles = function(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = piine.graph.UserReactionGraph.COLOR;
  ctx.lineWidth = piine.graph.UserReactionGraph.OUTER_CIRCLE_LINE_WIDTH;
  ctx.arc(piine.graph.UserReactionGraph.WIDTH / 2, piine.graph.UserReactionGraph.HEIGHT / 2, piine.graph.UserReactionGraph.OUTER_CIRCLE_RADIUS, 0, PI2, false);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = piine.graph.UserReactionGraph.COLOR;
  ctx.lineWidth = piine.graph.UserReactionGraph.INNER_CIRCLE_LINE_WIDTH;
  ctx.arc(piine.graph.UserReactionGraph.WIDTH / 2, piine.graph.UserReactionGraph.HEIGHT / 2, piine.graph.UserReactionGraph.INNER_CIRCLE_RADIUS, 0, PI2, false);
  ctx.closePath();
  ctx.stroke();
};


/**
 * Returns the context.
 * @return {CanvasRenderingContext2D} The context of the graph.
 */
piine.graph.UserReactionGraph.prototype.getContext = function() {
  return this.ctx_;
};



/** @override */
piine.graph.UserReactionGraph.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.ctx_ = this.getElement().getContext('2d');
  this.timer_.start();
};


/** @override */
piine.graph.UserReactionGraph.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  goog.structs.forEach(this.effects_, function(effect) {
    this.unregisterEffect(effect);
  }, this);

  goog.structs.forEach(this.usersMap_, function(user, userId) {
    this.removeUser(userId);
  }, this);
};



/**
 * A class for user nodes for the graph.
 * @param {string} userId The ID string of the user.
 * @param {piine.graph.UserReactionGraph} graph The graph that this user was
 *     registered to.
 * @constructor
 * @extends {goog.Disposable}
 */
piine.graph.UserReactionGraph.UserNode = function(userId, graph) {
  goog.base(this);
  this.graph_ = graph;
  this.userId = userId;

  this.angle = 0;
  this.angleRate = 0;
  this.torque = 0;

  this.radius = piine.graph.UserReactionGraph.USER_NODE_RADIUS;

  // Intialize coords by double.
  this.coords = [0.0, 0.0];
  this.updateCoords();
};
goog.inherits(piine.graph.UserReactionGraph.UserNode, goog.Disposable);


/**
 * Angle as a number in [0, 1] of the user node position.
 * @type {number}
 * @private
 */
piine.graph.UserReactionGraph.UserNode.prototype.angle;


/**
 * Angle rate as a number of the user node.
 * @type {number}
 * @private
 */
piine.graph.UserReactionGraph.UserNode.prototype.angleRate;


/**
 * Torque as a number of the user node.
 * @type {number}
 * @private
 */
piine.graph.UserReactionGraph.UserNode.prototype.torque;


/**
 * Updates the user node coordinates.
 */
piine.graph.UserReactionGraph.UserNode.prototype.updateCoords = function() {
  goog.asserts.assert(!Number.isNaN(this.angle));
  this.coords[0] = piine.graph.UserReactionGraph.WIDTH / 2 + piine.graph.UserReactionGraph.ORBITAAL_RADIUS * Math.sin(PI2 * this.angle);
  this.coords[1] = piine.graph.UserReactionGraph.HEIGHT / 2 - piine.graph.UserReactionGraph.ORBITAAL_RADIUS * Math.cos(PI2 * this.angle);
};


/**
 * Renders the user node.
 * @param {CanvasRenderingContext2D} ctx Context where the user node is rendered
 *     on.
 */
piine.graph.UserReactionGraph.UserNode.prototype.render = function(ctx) {
  this.updateCoords();
  ctx.beginPath();
  ctx.fillStyle = piine.graph.UserReactionGraph.COLOR;
  ctx.arc(this.coords[0], this.coords[1], this.radius, 0, PI2, false);
  ctx.fill();
};


/**
 * Reacts the user node.
 */
piine.graph.UserReactionGraph.UserNode.prototype.react = function() {
  this.graph_.registerEffect(new piine.graph.fx.ReactionEffect(this));
};


/** @override */
piine.graph.UserReactionGraph.UserNode.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.graph_;
};
