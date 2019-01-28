/* Dark.js */
/* v. 0.1 
/*  
Base & Helpers functions 
-----------------------------------
*/

(function () {

  'use strict';

  //Declare namespaces
  window.dark = window.dark || {};
  var dark = window.dark;


  //define variable if you want always log enabled
  //check in querystring & cookies
  dark.IS_DEBUG = (/isdebug/i).test(document.location.href);

  dark.trace = function () {

    if (window.console) {
      if (dark.IS_DEBUG === true) {
        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
          console.log.apply(console, arguments);
        } else {
          console.log(Array.prototype.slice.call(arguments));
        }
      }
    }
  };

  //container for plugins
  dark.plugins = {};


  dark.util = (function () {

    var getUrlParameters,
      getQueryString,
      getHashParameters,
      splitQueryString,
      extend,
      parseURL;

    getUrlParameters = function () {
      var search = document.location.search;
      if (!search) {
        //no query pars
        return {};
      }
      var q = search.substr(1);
      var _pars = splitQueryString(q);
      return _pars;
    };

    getHashParameters = function () {
      var hash = document.location.hash;
      if (!hash) {
        //no hash pars
        return {};
      }
      var q = hash.substr(1);
      return splitQueryString(q);
    };

    splitQueryString = function (q) {
      var pars = q.split("&");
      var qq = {};
      var i = 0;
      for (i = 0; i < pars.length; i++) {
        var ret = pars[i].toString().split("=");
        qq[ret[0]] = decodeURIComponent(ret[1]);
      }
      return qq;
    };

    getQueryString = function (pars) {
      var q = '';
      var value;
      var key;
      for (key in pars) {
        if (pars.hasOwnProperty(key)) {
          value = pars[key];
          if (!(typeof key === 'undefined' || value === null)) {
            q += '&' + key + '=' + encodeURIComponent(value);
          }
        }
      }

      if (q.length > 0) {
        //remove first
        q = q.substr(1);
      }

      return q;
    };

    //a custom and simplified extend function (if jQuery not available)
    extend = function (obj1, obj2) {
      var obj3 = {};
      var attrname;
      for (attrname in obj1) {
        if (obj1.hasOwnProperty(attrname)) {
          obj3[attrname] = obj1[attrname];
        }
      }
      for (attrname in obj2) {
        if (obj2.hasOwnProperty(attrname)) {
          obj3[attrname] = obj2[attrname];
        }
      }
      return obj3;
    };

    parseURL = function (url) {
      var parser = document.createElement('a');
      // Let the browser do the work
      parser.href = url;
      return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        hash: parser.hash
      };
    };

    //Create a namespace if it doesn't exist
    //It returns object of created namespace
    var namespace = function (name) {

      var build = function (parts) {
        var part = parts.splice(0, 1);
        if (!root[part]) {
          root[part] = {};
        }
        root = root[part];

        if (parts.length === 0) {
          return root;
        }

        //build it
        return build(parts);
      }

      //Exec 
      var root = window;
      var parts = name.split('.');

      if (parts[0] === 'window') {
        //remove window if is a starting point
        parts.splice(0, 1);
      }

      //build first node
      return build(parts);

    };


    //create a base object (defined in .extend) and extend it with new properties 
    /*
    sample: 
    var objdefinition = {
    extend: 'MyNamespace.MyBaseClass',
    onReady: function () {
    //your code here...
    }
    };  
    dark.create(objdefinition, par1, par2, par3)
    */
    var create = function () {
      var prototype = arguments[0];
      var constructor = dark.namespace(prototype.extend);      //base class constructor

      var pars = Array.prototype.slice.call(arguments, 1);

      var child = function () { };
      child.prototype = prototype;
      var obj = new child();

      var parent;

      if (constructor.extend) {
        //extend options with base class options
        pars[1] = this.util.extend(prototype.options || {}, pars[1]);
        //it has a base class to inherit from, create it with right scope
        var p = [constructor].concat(pars);
        parent = this.create.apply(obj, p);
      }
      else {
        //create a parent with right scope
        parent = constructor.apply(obj, pars);
      }

      obj.base = parent;     //store the base class

      //extend child with parent properties
      var attrname;
      for (attrname in parent) {
        if (parent.hasOwnProperty(attrname)) {
          obj[attrname] = obj[attrname] || parent[attrname];
        }
      }
      return obj;
    };

    return {
      getUrlParameters: getUrlParameters,
      getHashParameters: getHashParameters,
      getQueryString: getQueryString,
      extend: extend,
      parseURL: parseURL,
      create: create,
      namespace: namespace
    };

  }());
}());