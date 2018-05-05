define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger',
    'zuiRoot/models/TriggerAssemblyModel'], function(_, Backbone, Common, Logger, TriggerAssembly){
        var _prius;
        var generateSuperScope = function(){
            return new (function(){
                return {

                };
            })();
        }
        
        var generateScope = function(settings){
            
            return new (function(settings){
                settings = typeof settings === 'undefined' ? {} : settings;
                var _assembly = TriggerAssembly.fab({});  
                
                var _fire = function() {
                    /* MODIFIERS POST-FIRE / EVAL / ACTION
                        keepAlive
                        resetAfterFire
                        stickyRules
                        count / increment(x)
                        average, sum
                        max
                        min
                    */

                   if(this.get('state') === "unprimed") {
                        if(!this.get('keepAlive')) {
                            _cleanup.call(this);
                        } else if(this.get('resetAfterFire')) {
                            _reset.call(this);
                        }

                        _inform.call(this, "zui-trigger-fired");
                   }
                };
                
                var _reset = function() {	
                    _assembly.reset(); 
                    _inform.call(this, "zui-trigger-reset");
                    _prime();
                };
                
               var _cleanup = function() {
                    // do some cleanup actions,
                    // unsub any listeners
                    // call parent to delete trigger?
                    // delete vars

                    _assembly.cleanup();
                    _inform.call(this, "zui-trigger-consumed");
                };
                
                var _inform = function(event, message) {
                    var eventObject = {
                        id: this.get('id'),
                        sourceTriggerAssembly: this
                    };
                    var logSettings = {
                        message: message ? message :  _prius.messageDefaults.hasOwnProperty(event) ? _prius.messageDefaults[event].message : '--',
                        tags: ["zui-trigger"],
                        obj: eventObject,
                        logLevel: 1
                    }
                    
                    //TODO re-take on thee com
                    // if(!message && _prius.messageDefaults.hasOwnProperty(event))
                    // {
                    //     var props = _prius.messageDefaults[event];
                    //     for(var prop in props)
                    //     {
                    //         if(props.hasOwnProperty(prop)){
                    //             Logger.log(this.get('id') + " Trigger Primed", logSettings);
                    //             this.trigger("zui-trigger-prime", primeEvent);
                    //         }
                    //     }
                    // }
                    // else
                    // {
                    //     this.ownedBy.
                    // }

                    Logger.log(this.get('id') + message, logSettings);
                    console.log(this, event);
                    this.trigger(event, eventObject);

                    //TODO evaluate whether or not its a good idea to blast 2x events, self and parent separately
                    this.ownedBy.trigger(event, eventObject);

                };


                return { 
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'unprimed', //'fired', 'consumed'
                        'keepAlive': false,
                        'resetAfterFire': false,
                        'lastPrimed': 0,
                        'firedCount': 0
                    },
        
                    initialize : function(){   
                        Logger.log('Trigger ' + this.get('id') + ' Created', { tags: 'zui-create' });
                    },
        
                    state: function() {	return this.get('state') },
                    ownedBy: settings.target,

                    addAssembly: function(link){
                        link.ownedBy = this;
                        _assembly = link;
                        this.prime();
                    },
    
                    // AKA initialize
                    prime: function(){
                        
                        if(!this.ownedBy) {
                            //TODO -- consume self here...
                            return;
                        }

                        if(this.get('state') === "unprimed") {
                            if(_assembly.evaluate() === true){	
                                _inform.call(this, "zui-trigger-primed");
                                _fire.call(this);
                            }

                        }
                    }
                };
            })(settings);
        };
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            return {
                fab: function( objValues,  options){   
                    var trigger = new (_prius.extend(generateScope(objValues)))();
                    
                    options = options ? options : {};

                    // handling template & template settings
                    switch(options.template) {
                        case "timer-basic":
                            var timerAssembly = TriggerAssembly.fab({},{
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
                    "zui-trigger-primed": {
                        message: " Trigger Primed",
                    },
                    "zui-trigger-fired": {
                        message: " Trigger Fired",
                    },
                    "zui-trigger-reset": {
                        message: " Trigger Reset",
                    },
                    "zui-trigger-consumed": {
                        message: " Trigger Consumed",
                    }
                }
            }
        })();
   
        _prius = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _prius;
});