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
            var subscriptions = [];
            var sentEvents = [];
            
            var emit = function(type, body) {
                subscriptions.forEach(function(currentValue, index, array){
                    subscriptions[index](type, body);
                });
            };
            

            return { 
                defaults : {
                    'id' : Common.genId(),
                    'state' : 'unprimed', //'primed', 'fired', 'consumed'
                    'keepAlive': false,
                    'resetAfterFire': false,
                    'resetAfterEval': false,
                    'lastPrimed': 0,
                    'firedCount': 0,
                    'superScore' : 146
                },
    
                initialize : function(){   
                    Logger.log('Trigger ' + this.get('id') + ' Created', { filter: 'create' });
                    this.prime();
                },
                push : function(type, body) { emit(type, body); },
                sub : function(handler) { if(!subscriptions.includes(handler)){ subscriptions.push(handler); }},
                unsub : function(handler) { if(subscriptions.includes(handler)){ subscriptions.splice(subscriptions.indexOf(handler), 1); }},
            };
        })(settings);
    };
    
    //These are the static methods that this type will inherit
    var staticMethods = (function() {
        var eventChannel = (function(){
            // var subscriptions = [];
            // var sentEvents = [];
            
            // var emit = function(type, body) {
            //     subscriptions.forEach(function(currentValue, index, array){
            //         subscriptions[index](type, body);
            //     });
            // };
            
            // return {
            //     push : function(type, body) { emit(type, body); },
            //     sub : function(handler) { if(!subscriptions.includes(handler)){ subscriptions.push(handler); }},
            //     unsub : function(handler) { if(subscriptions.includes(handler)){ subscriptions.splice(subscriptions.indexOf(handler), 1); }},
            // };
        })();
        return {
            fab: function( settings ){
                var eventChannel = new (_initial.extend(generateScope(settings)))();
                return eventChannel;
            }
        }
    })();

    _initial = Backbone.Model.extend(generateSuperScope(), staticMethods);
    return _initial;
});