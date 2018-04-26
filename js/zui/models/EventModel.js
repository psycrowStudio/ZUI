define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger'],
    function(_, Backbone, Common, Logger){
        var _initial;
        var generateSuperScope = function(){
            return new (function(){

                return {

                };
            })();
        }
        
        var generateScope = function(settings){
            return new (function(settings){
                var _this = this; 
                return { 
                    defaults : typeof settings.defaults !== "undefined" ? settings.defaults : {
                        'name': typeof settings.name !== "undefined" ? settings.name : '',
                        'type': typeof settings.type !== "undefined" ? settings.type :'ZUI',
                        'id' : typeof settings.id !== "undefined" ? settings.id : Common.genId(),
                        'targetId': typeof settings.targetId !== "undefined" ? settings.targetId : '',
                        'destinationId': typeof settings.destinationId !== "undefined" ? settings.destinationId : '',
                        // 'level' : typeof settings.level !== "undefined" ? settings.level : 0,       
                        'tags' : typeof settings.tags !== "undefined" ? settings.tags : ['ZUI']
                    },
        
                    initialize : function(){   
                        Logger.log('Event ' + this.get('id') + ' Created', { tags: 'zui-create' });
                    },
                    capturedEvent: typeof settings.capturedEvent !== "undefined" ? settings.capturedEvent : undefined,
                    targetObj : typeof settings.targetObj !== "undefined" ? settings.targetObj : undefined,
                    destinationObj : typeof settings.destinationObj !== "undefined" ? settings.destinationObj : undefined,
                    distributionDetails : typeof settings.distributionDetails !== "undefined" ? settings.distributionDetails : undefined,
                    // dataContext : typeof settings.dataContext !== "undefined" ? settings.dataContext : undefined,
                    events: {
                        'takeAction' : this.onActionTaken,
                        'destinationReached' : this.onReachDestination,
                        'destroy' : this.onMessageDestroy
                    },
                    
                    consume: function() {
                        this.destroy();
                    },

                    // list of subscribers? this event is listenTo-able
                    onActionTaken : function(){},
                    onReachDestination : function(){},
                    onMessageDestroy: function(){
                        this.stopListening();
                        this.off();
                    }
                };
            })(settings);
        };
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            var channels = {}; // key : [listeners]
            //var loggerChannel = {};
            //Logger.registerChannel(loggerChannel, 'zui-event');

            return {
                // creates a 'managed' object, as opposed to using new Type()
                //registerChannel(ch) {},
                fab: function( settings ){
                    var event = new (_initial.extend(generateScope(settings)))();
                    return event;
                },
                subscribeToChannel(ch, listener) {
                    if(channels.hasOwnProperty(ch) ){
                        Logger.log("Subscribed to: " + ch, { tags:'zui-trigger', logLevel:1 });
                        channels[ch].push(listener);
                        return true;
                    }
                    else return false;
                },

                //subscribe(ev) {
                //unsubscribe
                //
            }
        })();
   
        _initial = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _initial;
});