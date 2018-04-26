
	
	//const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    //wait(10000).then(() => saySomething("10 seconds")).catch(failureCallback);
    
define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger'], function(_, Backbone, Common, Logger){
        var _initial;
        var generateSuperScope = function(){
            return new (function(){
                return {

                };
            })();
        }
        
        var generateScope = function(settings){
            
            return new (function(settings){
                settings = typeof settings === 'undefined' ? {} : settings;
                var _ruleLinkages = {};
                var testProp = 0;
    
                var _evaluateLinkages = function(fireAfterEvaluate) {
                    // all linkages must be true for the trigger to fire...
                    for(var key in _ruleLinkages) {
                        if(_ruleLinkages[key].isEvalPending || _ruleLinkages[key].isSatisfied){	return false; }
                    }
                    
                    if(fireAfterEvaluate) {
                        _trigger.fire();
                    }
                };
                
                return { 
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'unprimed', //'primed', 'fired', 'consumed'
                        'keepAlive': false,
                        'resetAfterFire': false,
                        'lastPrimed': 0,
                        'firedCount': 0
                    },
        
                    initialize : function(){   
                        Logger.log('Trigger ' + this.get('id') + ' Created', { tags: 'zui-create' });
                        this.prime();
                    },
        
                    // CONSTRUCTOR 
                    state: function() {	return this.get('state') },
                    
                    addLinkage: function(link){
                        // add new linkages  
                        //check link type,
                        _ruleLinkages.add(link);
                    },
                    
                    // AKA initialize
                    prime: function(){
                        if(this.get('state') == "primed") {

                        }
                        
                        // if event based, we need trigger target or global space filter
                            // listen to subs
                            // payload match
                        // if time based
                            // timeA (at a point in the future): setListenInterval
                            // timeB 
                        // if event and time based, do both
        
                        // if isSet loop through primeConditions and evaluate 
        
                        //lastPrimed : 0, // date.now
                        // isSet = true
                        // return isSet;
        
                        // if(_state !== 'unprimed') {
                        //     return;
                        // }
                        
                        // loop over rules and route subs to eval, check for listenTo
                        // for(var key in _ruleLinkages) {
                        //     var settings = {};
                            
                        //     settings.trigger = _trigger;
                        //     settings.vars = _vars;
                            
                        //     _ruleLinkages[key].prime(settings); 
                        // }

                        var primeEvent = {};
                        var logSettings = {
                            tags: ["zui-trigger"],
                            obj: primeEvent,
                            logLevel: 1
                        }
                        Logger.log(this.get('id') + " Trigger Primed", logSettings);
                        this.trigger("zui-trigger-prime", primeEvent);
                    },
                    
                    fire: function() {
                        /* MODIFIERS POST-FIRE / EVAL / ACTION
                            keepAlive
                            resetAfterFire
                            stickyRules
                            count / increment(x)
                            average, sum
                            max
                            min
                        */

                       if(this.get('state') == "primed") {
                            if(!_keepAlive) {
                                _this.cleanup();
                            } else if(_resetAfterFire) {
                                _this.reset();
                            }
                            var fireEvent = {};
                            var logSettings = {
                                tags: ["zui-trigger"],
                                obj: fireEvent,
                                logLevel: 1
                            }
                            Logger.log(this.get('id') + " Trigger Fired", logSettings);
                            this.trigger("zui-trigger-fire", fireEvent);
                       }
                    },
                    
                    reset: function() {
                        _vars = {};

                        var resetEvent = {};
                        var logSettings = {
                            tags: ["zui-trigger"],
                            obj: resetEvent,
                            logLevel: 1
                        }
                        Logger.log(this.get('id') + " Trigger Reset", logSettings);
                        this.trigger("zui-trigger-reset", resetEvent);
                        
                        for(var key in _ruleLinkages) {
                            if(_ruleLinkages[key].resetWithTrigger){	
                                _ruleLinkages[key].reset(); 
                            }
                        }
                    },
                    
                    cleanup: function() {
                        // do some cleanup actions,
                        // unsub any listeners
                        // call parent to delete trigger?
                        
                        for(var key in _ruleLinkages) {
                            if(_ruleLinkages[key].resetWithTrigger){	
                                _ruleLinkages[key].cleanup(); 
                            }
                        }
                    },
                    
                    evaluate: function(fireAfterEvaluate) {
                        return _evaluateLinkages(fireAfterEvaluate);
                    }
                };
            })(settings);
        };
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            return {
                fab: function( objValues,  options){
                    var trigger = new (_initial.extend(generateScope(objValues)))();
                    return trigger;
                },
                fabFromJson: function(json) {
                    var trigger = new (_initial.extend(generateScope(JSON.parse(json))))();
                    return trigger;
                }
            }
        })();

   
        _initial = Backbone.Model.extend(generateSuperScope(), staticMethods);
        console.log(_initial);
        return _initial;
});