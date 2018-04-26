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
                prime : function(event) {
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
                },
                
                listen : function(event) {
                    // if !isSet, prime()
                    
                    // if isSet loop through rules and evaluate
                    
                    //if all true fire()
                },

                // optional [event] - passed in when this method is called from an event.
                fire : function(event) {
                    // loop over actions and execute
                    
                    // if !keepAlive trigger delete // unsub all
                    // if reset, this.prime()

                },

                subscribe : function(sub) {
                    // route sub to listen,
                    // add to list
                },

                subscribeAll : function() {
                    // route all subs to listen
                },

                unsubscribe: function(sub) {
                    // remove subs
                },

                unsubscribeAll: function() {
                    // remove all subs
                }
            }))();

            return trigger;
        }
    }
});
            
}