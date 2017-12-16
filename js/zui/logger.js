define(['underscore', 'backbone'], function(_, Backbone){
    var _theTime = function (){
        var dateObj = new Date(Date.now());
        return '[' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds() + '-' +  dateObj.getMilliseconds()+']';
    };
    
    var zuiEventStream = {};
    _.extend(zuiEventStream, Backbone.Events);

    var zuiTriggerEventStream = {};
    _.extend(zuiTriggerEventStream, Backbone.Events);
    
    var zuiDomStream = {};
    _.extend(zuiDomStream, Backbone.Events);

    var zuiContentStream = {};
    _.extend(zuiContentStream, Backbone.Events);

    var _logPrefix = function(filter){
        var str = '';
        if(Array.isArray(filter)){
            for(var key in filter)
            {
                str += key + ' ';
            }
        }
        else if(typeof filter === 'string') {
           str += filter;
        }

        if(str === ''){
            str = 'ZUI';
        }

        return '['+ str.trim() +']';
    }

    var routeOutput = function(msg, tags, obj){
        var output =  _theTime() + "-" + _logPrefix(tags) + ': ' + msg;

        if(tags.indexOf('error') > -1) {
            console.error(output);
        } else if(tags.indexOf('warn') > -1) {
            console.warn(output);
        }
        else {
            console.log(output);
        }

        if(typeof obj === 'object' ){
            console.log(obj);
        }
    };

    // Error Logging Levels:
    // 0 - off (or remove from list)
    // 1 - major
    // 2 - minor
    // 3 - verbose
    var logOutputFilter = {
        'error' : 3,
        'warn' : 3,
        'zui-dom' : 1,
        'zui-http' : 1,
        'zui-component' : 1,
        'zui-page' : 2,
        'zui-trigger' : 1,
        'ZUI': 1,
        'misc' : 1,
        //router, html-dom, pageActions
    } ;

    // todo make a context return setup for proper scope.
    return {
        log : function(msg, settings) {
            var tags = settings && settings.tags ? settings.tags : 'misc' ;
            var obj = settings && settings.obj ? settings.obj : undefined;
            var logLevel = settings && settings.logLevel ? settings.logLevel : 3;
            
            // TODO - add the event object to include, or ensure that settings.obj meets the needs
            if(Array.isArray(tags)){
                var sendOutputFilter = false;
                for(var key in tags)
                {  
                    if(this.eventChannels.hasOwnProperty(key)) {
                        this.eventChannels[key].trigger(key, obj);
                    } 

                    if(logOutputFilter.hasOwnProperty(key) && logOutputFilter[key] >= logLevel) {
                        sendOutputFilter = true;
                    }
                }

                if(sendOutputFilter){
                    routeOutput(msg, tags, obj);
                }
            }
            else {
                if(this.eventChannels.hasOwnProperty(tags) && settings.eventName) {
                    this.eventChannels[tags].trigger(settings.eventName, obj);
                } 
                if(logOutputFilter.hasOwnProperty(tags) && logOutputFilter[tags] >= logLevel) {
                    routeOutput(msg, tags, obj);
                }
            }
        },
        subscribe : function(channel, eventName, handler) {
            if(this.eventChannels.hasOwnProperty(channel)) {
                this.eventChannels[channel].on(eventName, handler);
            }
        },
        unsubscribe : function(channel, eventName, handler) {
            if(this.eventChannels.hasOwnProperty(channel)) {
                this.eventChannels[channel].off(eventName, handler);
            }
        },
        eventChannels : {
            'zui-all': zuiEventStream,
            'zui-trigger': zuiTriggerEventStream,
            'zui-dom': zuiDomStream,
            'zui-content' : zuiContentStream
        }
    } 
});