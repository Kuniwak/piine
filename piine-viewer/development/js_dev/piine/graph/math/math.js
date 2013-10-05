// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * @fileoverview Math utilities for the piine user reaction graph.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


goog.provide('piine.graph.math');

goog.require('goog.asserts');
goog.require('goog.math');


/**
 * Computes the difference between startAngle and endAngle (angles in degrees).
 * @param {number} startAngle  Start angle in degrees.
 * @param {number} endAngle  End angle in degrees.
 * @return {number} The number of angle rate that when added to
 *     startAngle will result in endAngle. Positive numbers mean that the
 *     direction is clockwise. Negative numbers indicate a counter-clockwise
 *     direction.
 *     The shortest route (clockwise vs counter-clockwise) between the angles
 *     is used.
 *     When the difference is 0.5 degrees, the function returns 0.5 (not -0.5)
 *     angleDifference(0.3, 0.4) is 0.1, and angleDifference(0.4, 0.3) is -0.1.
 *     angleDifference(0.9, 0.1) is 0.2, and angleDifference(1, 0.9) is -0.2.
 */
piine.graph.math.angleDifference = function(startAngle, endAngle) {
  goog.asserts.assertNumber(startAngle);
  goog.asserts.assertNumber(endAngle);

  var diff = piine.graph.math.standardAngle(endAngle) -
      piine.graph.math.standardAngle(startAngle);

  if (diff > 0.5) {
    diff = diff - 1;
  }
  else if (diff <= -0.5) {
    diff = 1 + diff;
  }

  return diff;
};


/**
 * Standardizes an angle to be in range [0-1). Negative angles become positive,
 * and values greater than 1 are returned the decimal part.
 * @param {number} angle Angle to be standardized.
 * @return {number} Standardized angle in [0-1).
 */
piine.graph.math.standardAngle = function(angle) {
  goog.asserts.assertNumber(angle);
  return angle - goog.math.safeFloor(angle);
};


/**
 * Returns a supplementary angle.
 * @param {number} angle Angle to get a supplementary angle.
 * @return {number} Supplementary angle.
 */
piine.graph.math.supplementaryAngle = function(angle) {
  goog.asserts.assertNumber(angle);
  return piine.graph.math.standardAngle(angle + 0.5);
};


/**
 * Returns a center angle in the minor angle of 2 angles.
 * @param {number} angleA The angle.
 * @param {number} angleB Another angle.
 * @param {boolean=} opt_greater Returns the center angle in major angle if
 *     true.
 */
piine.graph.math.centerAngle = function(angleA, angleB, opt_greater) {
  goog.asserts.assertNumber(angleA);
  goog.asserts.assertNumber(angleB);

  var a = piine.graph.math.standardAngle(angleA);
  var b = piine.graph.math.standardAngle(angleB);
  var diff = piine.graph.math.angleDifference(a, b);

  return opt_greater ? piine.graph.math.supplementaryAngle(a + diff / 2) :
      piine.graph.math.standardAngle(a + diff / 2);
};
