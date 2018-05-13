define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger',
    'zuiRoot/models/TriggerAssemblyModel'], function(_, Backbone, Common, Logger, TriggerAssembly){
        var _prius;

        var generateScope = function(settings){
            return new (function(settings){
                settings = typeof settings === 'undefined' ? {} : settings;
                var _assembly = TriggerAssembly.fab({});  
                
                var _fire = function() {
                    if(this.get('state') === "primed") {
                        this.set('state', 'fired');
                        _inform(this, "zui-trigger-fired");
                        if(!this.get('keepAlive')) {
                            _cleanup.call(this);
                        } else if(this.get('resetAfterFire')) {
                            _reset.call(this);
                        }
                   }
                };
                
                var _reset = function() {	
                    _assembly.reset(); 
                    _inform(this, "zui-trigger-reset");
                    _prime();
                };
                
               var _cleanup = function() {
                    _inform(this, "zui-trigger-consumed");    
                    _assembly.cleanup();
                    this.stopListening();
                    this.ownedBy = null;
                };

                var _processAssemblyEvents = function(event, args) {
                    _inform(this, event);
                    //console.log(event, args);
                    if(event === "zui-triggerAssembly-evaluate-success" || 
                    event === "zui-triggerAssembly-evaluate-fail" ||
                    event === "zui-triggerAssembly-created") {
                        this.prime();
                    }
                }

                return { 
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'unprimed', // 'primed', fired', 'consumed'
                        'keepAlive': settings.keepAlive || false,
                        'resetAfterFire': settings.resetAfterFire || false,
                        'resetCount': 0,
                        'lastRest' : 0,
                        'firedCount': 0,
                        'lastFired': 0
                    },
        
                    initialize : function(){   
                        _inform(this, "zui-trigger-created");
                    },
        
                    state: function() {	return this.get('state') },
                    ownedBy: settings.target,

                    addAssembly: function(link){
                        if(_assembly)
                        {
                            this.stopListening(_assembly);
                        }
                        
                        link.ownedBy = this;
                        _assembly = link;
                        
                        this.listenTo(_assembly, "all", _processAssemblyEvents);
                        // TODO consider listneing to prop:status changed, to trigger re-eval
                        this.prime();
                    },
    
                    // AKA initialize
                    prime: function(){
                        if(!this.ownedBy) {
                            _cleanup.call(this);
                            return false;
                        }

                        if(this.get('state') === "unprimed") {
                            this.set('state', 'primed');
                            _inform(this, "zui-trigger-primed");
                        }

                        if(_assembly.get('status') === true || _assembly.evaluate() === true){	
                            _fire.call(this);
                            return true;
                        }
                        return false;
                    }
                };
            })(settings);
        };
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            return {
                fab: function(objValues,  options){   
                    var trigger = new (_prius.extend(generateScope(objValues)))();
                    
                    options = options ? options : {};

                    // handling template & template settings
                    switch(options.template) {
                        case "timer-basic":
                            var timerAssembly = TriggerAssembly.fab({
                                target: trigger
                            },{
                                template: "timer-basic",
                                templateVars: {
                                    template:  options.template,
                                    duration: options.templateVars.duration
                                }
                            });

                            trigger.addAssembly(timerAssembly);
                        break;
                    }

                    return trigger;
                },
                fabFromJson: function(json) {
                    var trigger = new (_prius.extend(generateScope(JSON.parse(json))))();
                    return trigger;
                },

                messageDefaults: {
                    "zui-trigger-created": {
                        message: "Trigger Created",
                        logLevel: 1,
                        tags: ["zui-create"]
                    },
                    "zui-trigger-primed": {
                        message: "Trigger Primed",
                    },
                    "zui-trigger-fired": {
                        message: "Trigger Fired",
                        logLevel: 1
                    },
                    "zui-trigger-reset": {
                        message: "Trigger Reset",
                    },
                    "zui-trigger-consumed": {
                        message: "Trigger Consumed",
                        logLevel: 1
                    },
                    "zui-triggerAssembly-evaluate-success": {
                        message: "Trigger Assembly Evaluate Success",
                        logLevel: 1
                    },
                    "zui-triggerAssembly-evaluate-fail": {
                        message: "Trigger Assembly Evaluate Fail"
                    },
                    "zui-triggerAssembly-evaluate-error": {
                        message: "Trigger Assembly Evaluate Error"
                    },
                    "zui-triggerAssembly-created": {
                        message: "Trigger Assembly Created",
                        logLevel: 1,
                        tags: ["zui-create"]
                    }

                    /*
                    * assembly events;
                    *   - added
                    *   - evaluate (success)
                    *   - conditions changed
                    *   - 
                    * assembly rule evemts:
                    *   - added
                    *   - evaluate (success)
                    *   - conditions changed
                    *   
                    */
                }
            }
        })();

        //These are private methods shared by the entire class
        function _inform(callee, event, message) {
            //var messageDefaults = {}; //TODO bring message defaults in here ?? 
            
            var eventObject = {
                id: callee.get('id'),
                sourceTriggerAssembly: callee
            };
            var logSettings = {
                message: message ? message :  _prius.messageDefaults.hasOwnProperty(event) ? _prius.messageDefaults[event].message : '--',
                tags: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].tags ? ["ZUI", "zui-trigger"].concat(_prius.messageDefaults[event].tags) : ["ZUI", "zui-trigger"],
                eventName: event,
                obj: eventObject,
                logLevel: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].logLevel 
                            ? _prius.messageDefaults[event].logLevel 
                            : 3,
            }
                
            Logger.log(callee.get('id') + ' -- ' + logSettings.message, logSettings);
            callee.trigger(event, eventObject);
        };
   
        _prius = Backbone.Model.extend({}, staticMethods);
        return _prius;
});