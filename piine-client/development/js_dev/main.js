/**
 * @fileoverview An entry point for the web app.
 */


goog.provide('main');/*@provide_main@*/

goog.require('piine.App');


/**
 * Entry point of the web app.
 */
main = function() {/*@main_fn@*/
  if (goog.DEBUG) {
    goog.global.app_ = piine.App.getInstance();
  }
  else {
    piine.App.getInstance();
  }
};


// Start the web app.
main();/*@exec_main@*/
