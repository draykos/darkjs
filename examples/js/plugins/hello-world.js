(function ($, win) {

  'use strict';

  var dark = win.dark;
  var trace = dark.trace;

  // Default configuration properties.
  var defaults = {
    label : 'hello world!',
    background: ''
  };

  dark.plugins.helloworld = function (e, o) {
    /* ------------------------- */
    /* Variables */
    var $dom = e; //the jquery element we are working with
    var _opt = $.extend({}, defaults, o || {});  //options

    /* ------------------------- */
    /* Declaring functions */
    /* ------------------------- */
    var init,
        bindEvents,
        setDomElements;

    //Functions
    init = function () {
      setDomElements();
      bindEvents();

      //do things here!
      dark.trace('helloworld plugin init');

      $dom.html(_opt.label);
      if(_opt.background)
      {
        $dom.css('background-color', _opt.background);
      }

    };

    bindEvents = function () {
      //bind events here
    };

    setDomElements = function () {
      //set main used elements here

    };


    /* end class */
    return {
      init: init
    };
  };
}(jQuery, window));

