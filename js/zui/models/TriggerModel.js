define(['backbone', 
    'zuiRoot/common',
    'zuiRoot/logger'], function(Backbone, Common, Logger){
        var privateScope = (function() {
            var _ruleLinkages = {};
            var testProp = 0;

            return { 
                defaults : {
                    'id' : Common.genId(),
                    'keepAlive': false,
                    'resetAfterFire': false,
                    'resetAfterEval': false,
                    'lastPrimed': 0,
                    'firedCount': 0,
                    'state' : 'init'
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
        })();

        //console.log(Backbone, Common, Logger);
        var staticMethods = (function() {
            
            return {
                fabricate: function( settings ){
                    console.log(this);
                    settings = typeof settings === 'undefined' ? {} : settings;
                    var trigger = new (Types.Trigger.extend(privateScope))();
                    return trigger;
                }
            }
        })();

        //console.log(staticMethods);

        return Backbone.Model.extend(privateScope, staticMethods);
});