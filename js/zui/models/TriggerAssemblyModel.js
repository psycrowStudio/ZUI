	define(['underscore', 'backbone', 
    'zuiRoot/common',
    'zuiRoot/logger',
    'zuiRoot/models/RuleModel'], function(_, Backbone, Common, Logger, Rule){
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
                var _conditions = {};
                
                var _successCallback = function(input){
                    console.log("Trigger Assembly Success", input);
                    this.set('status', true);

                    // sticky enables this to remain true after a successful evaluation
                    if(this.get('becameTrueAt') === 0 || this.get('sticky') === false) {
                        this.set('becameTrueAt', Date.now());
                        //this.ownedBy.fire(); // assuming this is and will always be a trigger...
                    }

                    this.ownedBy.prime();
                    return true;
                }

                var _failCallback = function(input){
                    console.log("Trigger Assembly Fail", input);
                    return false;
                }

                var _errorCallback = function(status){
                    console.log("Trigger Assembly Error", status);
                    return false;
                }

                
                var _timerCallback = function(resolve, duration){
                    console.log("Trigger Assembly Timer", duration);
                    return new Promise(function(resolve) {
                        setTimeout(resolve, duration, "!!!");
                    });
                }

                return { 
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'uninitialized', //'initialized', 'evaluating'
                        'status' : settings.status ? settings.status : false,
						'sticky': settings.sticky ? settings.sticky : false,
						'binding' : settings.binding ? settings.binding : 'AND',
						'mode' : settings.mode ? settings.mode : 'linear',  // or parallel
						'timing' : settings.timing ? settings.timing : '',  //window or delay
                        'delayLength' : 0,
                        'windowLength' : 0,
                        'lastEvaluation': 0,
						//'evaluationCount' : 0
						'becameTrueAt': 0,
						'evalTimeout': 0
                    },
        
                    initialize : function(){   
                        Logger.log('TriggerLinkage ' + this.get('id') + ' Created', { tags: 'zui-create' });	
						this.set('state', 'initialized');
                    },
        
                    status: function() {	return this.get('status') },
                    ownedBy: settings.target,
                    
                    // AKA initialize
                    evaluate: function(){
                        
						this.set('lastEvaluation', Date.now());
						if(!this.ownedBy) {
                            //TODO -- consume self here...
                            return false;
                        }

                        if(this.get('status') === false || this.get('sticky') === false) {                           
                            var _scope = this;
                            var continueEvaluation = function(){
                                //TODO this is actually parallel
                                var _scope = this;
                                if(this.get('mode') === 'linear') {
                                    var conditionPromisies = [];
                                    for(var each in _conditions) {
                                        conditionPromisies.push(_conditions[each].evaluate());
                                        //rule / assembly responds with promise, or if solved, promise.resolve(true/false)
                                    }
                                    this.set('state', 'evaluating');
                                    return conditionPromisies.length === 0 ? _successCallback.call(this, this.get('id')) : Promise.all(conditionPromisies)
                                        .then(function() {
                                            _successCallback.call(_scope);
                                        }, function(){
                                            _failCallback.call(_scope);
                                        }).catch(_scope_errorCallback);
                                }

                                // else if (this.get('mode') === 'parallel') {

                                // }
                                // if mode: linear setup promises in series
                                // if mode: parallel setup proimises to race
                                
                                // if binding: AND, all evals must complete
                                // if binding: OR, only ones eval must complete+
                            }

                            // if timing, start window or delay.
                            if(this.get('status') === false && this.get('timing') === 'delay')
                            {
                                return _timerCallback(function(){
                                    console.log("@@@@");
                                }, this.get('delayLength')).then(function(result) {
                                    console.log(result);
                                    return continueEvaluation.call(_scope);
                                });
                            }
                            else if(this.get('status') === false && this.get('timing') === 'window'){
                                continueEvaluation.call(_scope);
                                return _timerCallback(function(){
                                   //this.evaluate(); // call at the end of the window, to re-evaluate?
                                   if(_scope.get('status')) {
                                       return true;
                                   }
                                   else {
                                       return false;
                                   }
                                }, this.get('windowLength')); 
                            }
                        }
                        
                        return true;
                    },
                    

                    addRule: function(link){
                        _conditions.add(link);
                    },

                    
                    reset: function() {
                        //_vars = {}; //TODO reset shared vars
                        for(var key in _conditions) {
                            if(_conditions[key].resetWithTrigger){	
                                _conditions[key].reset(); 
                            }
                        }

                        //this.inform("zui-trigger-reset");
                    },
                    
                    cleanup: function() {
                        // do some cleanup actions,
                        // unsub any listeners
                        // call parent to delete trigger?
                        // delete vars

                        for(var key in _conditions) {
                            if(_conditions[key].resetWithTrigger){	
                                _conditions[key].cleanup(); 
                            }
                        }
                        //this.inform("zui-trigger-consumed");
                    },
                    
                    inform: function(event, message) {
                        var eventObject = {
                            id: this.get('id'),
                            source: this
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
                        this.trigger(event, eventObject);

                        //TODO evaluate whether or not its a good idea to blast 2x events, self and parent separately
                        this.ownedBy.trigger(event, eventObject);

                    }
                };
            })(settings);
        };
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            return {
                fab: function( objValues,  options){   
                    var linkage = new (_prius.extend(generateScope(objValues)))();
                    
                    options = options ? options : {};

                    // handling template & template settings
                    switch(options.template) {
                        case "timer-basic":
                            //add
                            linkage.set('timing', 'delay');
                            linkage.set('delayLength', options.templateVars.duration);
                        break;
                    }
   
                    return linkage;
                },

                messageDefaults: {
                    "zui-triggerLinkage-primed": {
                        message: " triggerLinkage Primed",
                    },
                    "zui-triggerLinkage-fired": {
                        message: " triggerLinkage Fired",
                    },
                    "zui-triggerLinkage-reset": {
                        message: " triggerLinkage Reset",
                    },
                    "zui-triggerLinkage-consumed": {
                        message: " triggerLinkage Consumed",
                    }
                }
            }
        })();
   
        _prius = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _prius;
});