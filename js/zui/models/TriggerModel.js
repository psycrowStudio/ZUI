define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger'], function(_, Backbone, Common, Logger){
        var _initial;
        var generateScope = function(settings){
            return new (function(settings){
                settings = typeof settings === 'undefined' ? {} : settings;
                var _ruleLinkages = {};
                var testProp = 0;
    
                return { 
                    defaults : {
                        'id' : settings.id ? settings.id : Common.genId(),
                        'state' : 'unprimed',
                        'keepAlive': false,
                        'resetAfterFire': false,
                        'resetAfterEval': false,
                        'lastPrimed': 0,
                        'firedCount': 0,
                        'state' : 'init'
                        //'echo'
                    },
                    actions : [], // array of function pointers
        
                    initialize : function(){   
                        Logger.log('Trigger ' + this.get('id') + ' Created', { filter: 'create' });
                        this.prime();
                    },
        
                    // CONSTRUCTOR 
                    state: function() {	return this.get('state') },
                    
                    setProp: function(value) { testProp = value; },
                    getProp: function() { return testProp; },
                    
                    addLinkage: function(link){
                        // add new linkages  
                        //check link type,
                        _ruleLinkages.add(link);
                    },
                    
                    // AKA initialize
                    prime: function(){
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
                        // if(_action && typeof _action === 'function'){
                        //     _action();
                        // }
                        // else {
                        //     console.log('could not fire action. invalid type');
                        // }
                        
                        // if(!_keepAlive) {
                        //     _this.cleanup();
                        // } else if(_resetAfterFire) {
                        //     _this.reset();
                        // }
                    },
                    
                    reset: function() {
                        _vars = {};
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
        
        //console.log(Backbone, Common, Logger);
        var staticMethods = (function() {
            
            return {
                fab: function( settings ){
                    var trigger = new (_initial.extend(generateScope(settings)))();
                    return trigger;
                },
                fabFromJson: function(json) {
                    return JSON.parse(json);
                },
            }
        })();

        //console.log(staticMethods);
        _initial = Backbone.Model.extend(generateScope(), staticMethods);
        return _initial
});