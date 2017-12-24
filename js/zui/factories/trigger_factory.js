define(['zuiRoot/common',
        'zuiRoot/types',
        'zuiRoot/logger'], function(Common, Types, Logger){
    var _this = this;

    return {
        fabricate: function( settings ){
            settings = typeof settings === 'undefined' ? {} : settings;

            var trigger = new (Types.TriggerModel.extend({
                defaults : typeof settings.defaults !== "undefined" ? settings.defaults : {
                    //'type': 'Standard', 
                    'channels' : [], //Object // Obj Dom // Global // Global DOM
                    'id' : typeof settings.id === "string" ? settings.id : Common.genId(),
                    'isSet': false,
                    'keepAlive': false,
                    'reset': false,
                },
                initialize : function(){   
                    Logger.log('Trigger ' + this.get('id') + ' Created', { filter: 'create' });
                    this.prime();
                },
                lastPrimed : 0, // date.now
                firedCount : 0,
                channels : [], // event streams
                actions : [], // array of function pointers
                rules : [], // "name, evaluate(this, event)
                primeConditions : [], // "name, evaluate(this, event?)

                // CONSTRUCTOR 
                state: function() {	return _state; },
                
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
            }))();

            return trigger;
        }
    }
});
