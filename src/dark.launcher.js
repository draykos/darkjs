(function ($, win) {

  'use strict';

  //Declare namespaces
  win.dark = win.dark || {};

  var dark = win.dark;
  var trace = dark.trace;

  $(document).ready(function () {

    try {

      var core = dark.core;

      //Launch Plugins on all page
      var $el = $('body');
      core.launchPlugins($el);


    } catch (e) {
      dark.trace('darkjs core function error', e);
    }
  });



}(jQuery, window));

