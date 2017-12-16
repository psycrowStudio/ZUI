define([''], function(){
   return function (settings) {
        settings = typeof settings === 'undefined' ? {} : settings;
        var event = new (window.zui.EventModel.extend({
            defaults : typeof settings.defaults !== "undefined" ? settings.defaults : {
                'name': typeof settings.name !== "undefined" ? settings.name : '',
                'type': typeof settings.type !== "undefined" ? settings.type :'ZUI',
                'id' : typeof settings.id !== "undefined" ? settings.id : window.zui.common.genId(),
                'targetId': typeof settings.targetId !== "undefined" ? settings.targetId : '',
                'destinationId': typeof settings.destinationId !== "undefined" ? settings.destinationId : '',
                'level' : typeof settings.level !== "undefined" ? settings.level : 0,
                'filters' : typeof settings.filters !== "undefined" ? settings.filters : ['ZUI']
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
        }))();
    }
});
