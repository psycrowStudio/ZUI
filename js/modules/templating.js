define([
        "mod/dom_helper"
    ],
    function (
        s5_dom
    ) {
        
        var MODULE_NAME = "templating";
        var _templateCache = {};
        var _domParser = new DOMParser();

        var _defaultTemplateCompile = function(key, data){
            return _module.compileToRawHtml(key, data);
        };        
        
        var _defaultTemplateUnload = function(key){
            return s5_dom.css.unloadFromDom(key);
        };

        var _module = {
            // TODO create cache management helpers, clear, etc
            createFromEjs : function(key, ejs) { 
                _templateCache[key] = _.template(ejs);
                return _templateCache[key];
            },
            compileToRawHtml: function(key, data){
                return _templateCache.hasOwnProperty(key) ? _templateCache[key](data) : "";
            },
            buildTemplateHarness: function(settings){
                // cache our template code
                if(settings.ejs && typeof settings.ejs === "string") {
                    _module.createFromEjs(settings.key, settings.ejs);
                }
                else if(settings.ejs && typeof settings.ejs === "function"){
                    _module.createFromEjs(settings.key, settings.ejs());
                }

                return {
                    name: settings.key,
                    context: settings.context || {},
                    compile: function(data){
                        var context = data ? data : settings.context;

                        if(settings.compile && typeof settings.compile === "function"){
                            return settings.compile(settings.key, context);
                        }
                        else {
                            for(key in context){
                                if(typeof context[key] === "function"){
                                    // parameters?
                                    context_exec = {};
                                    context_exec[key] = context[key]();
                                }
                            }
                            return _defaultTemplateCompile(settings.key, context);
                        }
                    },
                    unload: function(key){
                        if(settings.unload && typeof settings.unload === "function"){
                            settings.unload(key);
                        }
                        else {
                            _defaultTemplateUnload(key);
                        }
                    }
                };
            }
        };

        return _module;
    }
);