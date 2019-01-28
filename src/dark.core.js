/* Dark.js */
/* v. 0.1 
/*  
Core class
-----------------------------------
*/

(function ($, win) {

    'use strict';

    //shortcuts
    var dark = win.dark;
    var trace = dark.trace;

    //darkPlugin launch function
    //pn = plugin name 
    $.fn.darkPlugin = function (o, pn) {
        return this.each(function () {
            var $this = $(this);
            var plugins = dark.plugins || {};
            if (!plugins[pn]) {
                dark.trace('darkPlugin:' + pn + ' does not exist');
            }
            var p = new plugins[pn]($this, o);
            p.init();

        });
    };

    /*
    * The core engine.
    *
    */
    var core = function () {

        /* ------------------------- */
        /* Variables */

        var handlers = {};  //event handlers repository
        var _guid = 0; //unique guid counter

        /* ------------------------- */
        /* Declaring functions */
        var existPlugin,
            launchPlugin;


        var _this;          //the instance

        /* ------------------------- */
        /* Event manager  */

        var trigger,
            addListener,
            removeListener,
            checkEvent;

        //Raise event sample
        //EventData = json. Sample {data: data}
        trigger = function (eventName, eventData, publisher) {

            publisher = publisher || _this;

            if (!publisher.guid) {
                return;
            }

            var guid = publisher.guid;
            checkEvent(guid, eventName);

            //eventRegistrationList contains a copy of the original array. The original array can be altered via
            //.addListener and .removeListener without disturbing the current firing loop
            var evtRegistrationList = handlers[guid][eventName].slice(0);
            if (evtRegistrationList.length === 0) {
                return;
            }

            $.each(evtRegistrationList, function () {
                var reg = this;
                var data = $.extend({ publisher: publisher }, reg.customData, eventData);
                try {
                    reg.funct.call(reg.scope, data);
                }
                catch (ex) {
                    dark.trace(ex);
                }
            });
        };

        //Register a callback function to event handler
        //really simple publish/subscriber implementation
        removeListener = function (eventName, eventCallback, publisher) {
            publisher = publisher || _this;

            if (!publisher.guid) {
                return;
            }

            var guid = publisher.guid;
            if (!handlers[guid]) {
                return;
            }
            var cb = handlers[guid];
            if (!cb[eventName]) {
                return;
            }

            var evtRegistrationList = cb[eventName];

            var ii, nn = evtRegistrationList.length;
            var evt;
            for (ii = 0; ii < nn; ii++) {
                evt = evtRegistrationList[ii];
                if (evt.funct === eventCallback) {
                    evtRegistrationList.splice(ii, 1);
                }
            }
            handlers[guid][eventName] = evtRegistrationList;

        };

        //Register a callback function to event handler
        //really simple publish/subscriber implementation
        addListener = function (eventName, eventCallback, publisher, customData) {
            publisher = publisher || this;  //global event

            if (!publisher.guid) {
                publisher.guid = ++_guid;
            }

            var guid = publisher.guid;

            checkEvent(guid, eventName);

            var evtRegistration = {
                scope: publisher,
                funct: eventCallback,
                customData: customData
            };

            handlers[guid][eventName].push(evtRegistration);

        };

        /// <summary>
        /// Checks there's something registered with the passed guid and eventName.
        /// If absent, creates an empty array inside regObjects[guid][eventName] = new Array();
        /// so it's ready to include new events
        /// </summary>
        /// <param name="guid" type="number">The id of the object being checked.</param>
        /// <param name="eventName" type="string">The name of the event being checked.</param>
        checkEvent = function (guid, eventName) {
            handlers[guid] = handlers[guid] || {};
            handlers[guid][eventName] = handlers[guid][eventName] || [];
        };


        /* ------------------------- */
        //Public Functions
        var launchPlugins,
            loadScript;

        //Launch dark plugins attached to selected elements
        //$elements = elements to look for plugins
        launchPlugins = function ($elements, sel) {
            if (!sel) {
                sel = 'dark-plugin';
            }
            var plugin;
            var $list = $elements.find('[' + sel + ']');
            var ii;
            var nn = $list.length;
            var $el;

            for (ii = 0; ii < nn; ii++) {
                $el = $list.eq(ii);
                plugin = $el.attr(sel);

                //check if exist
                if (!plugin) {
                    dark.trace('can not find attribute dark-plugin for element');
                    dark.trace($el);
                    continue;
                }

                //launch
                launchPlugin($el, plugin);
            }
        };

        //load a script asynchronously
        loadScript = function (id, src, loadCallback) {
            var d = document;
            var s = 'script';

            if (d.getElementById(id)) {
                if (loadCallback) {
                    loadCallback();
                }
                return;
            }

            var scripts = d.getElementsByTagName(s);
            var fjs = scripts[scripts.length - 1];
            var js = d.createElement(s);
            js.id = id;
            js.type = 'text/javascript';
            js.async = true;
            js.src = src;


            //http://msdn.microsoft.com/en-us/library/ie/hh180173%28v=vs.85%29.aspx
            if (loadCallback) {
                if (js.addEventListener) {
                    js.addEventListener('load', loadCallback, false);
                } else if (js.readyState) {
                    //this is for IE7-8
                    js.onreadystatechange = function () {
                        if (js.readyState === 'loaded' || js.readyState === 'complete') {
                            loadCallback();
                        }
                    };
                }
            }

            fjs.parentNode.insertBefore(js, fjs);
        };

        /* ------------------------- */
        //Private Functions
        //pn = plugin name
        launchPlugin = function ($elements, pn) {
            var $el, o={}, data;

            //for each elements found
            var options = 'dark-options';
            $elements.each(function (i, el) {
                $el = $(el);
                //plugin options could be stored in element dark-options as json string / serialized js object
                data = $el.attr(options) || '';
                if(data) {
                    //convert in a js object: https://stackoverflow.com/questions/1086404/string-to-object-in-js
                    o = eval("(" + data + ")");
                }

                //add also all other data attributes
                for (var key in $el.data()) {
                    var value = $el.data(key);
                    o[key] = value;
                }

                $el.darkPlugin(o, pn);
            });
        };

        existPlugin = function (pn) {
            return !!dark.plugin[pn];
        };

        //Create instance
        _this = {
            trigger: trigger,
            addListener: addListener,
            removeListener: removeListener,
            existPlugin: existPlugin,
            launchPlugin: launchPlugin,
            launchPlugins: launchPlugins,
            loadScript: loadScript
        };

        return _this;
    };

    dark.core = new core();

}(jQuery, window));
