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
                    this.set('status', true);
                    this.set('underEvaluation', false);
                    this.trigger("zui-triggerAssembly-evaluate-success");

                    // sticky enables this to remain true after a successful evaluation
                    if(this.get('becameTrueAt') === 0 || this.get('sticky') === false) {
                        this.set('becameTrueAt', Date.now());
                    }
                    return true;
                };

                var _failCallback = function(input){
                    this.trigger("zui-triggerAssembly-evaluate-fail");
                    this.set('underEvaluation', false);
                    return false;
                };

                var _errorCallback = function(status){
                    this.trigger("zui-triggerAssembly-evaluate-error");
                    this.set('underEvaluation', false);
                    return false;
                };
                
                var _timerCallback = function(duration){
                    this.trigger("zui-triggerAssembly-timer");
                    return new Promise(function(resolve) {
                        setTimeout(resolve, duration, duration);
                    });
                };

                var _reset = function() {	
                    //rules.reset(); 
                    this.trigger("zui-triggerAssembly-reset");
                   // _prime();
                };

                return { 
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'uninitialized', //'initialized', 'evaluating'
                        'isRootAssembly': typeof settings.status !== 'undefined' ? settings.status : true,
                        'status' : typeof settings.status !== 'undefined' ? settings.status : false,
                        'sticky': typeof settings.sticky !== 'undefined' ? settings.sticky : false,
                        'underEvaluation' : false,
						'binding' : settings.binding ? settings.binding : 'AND',
						'mode' : settings.mode ? settings.mode : 'linear',  // or parallel
						'timing' : settings.timing ? settings.timing : '',  //window or delay
                        'delayLength' : 0,
                        'windowLength' : 0,
                        'lastEvaluation': 0,
                        'evaluationCount' : 0,
                        'evaluationTimeout': 10,
                        'evaluationExpiration': 0,
						'becameTrueAt': 0
                    },
        
                    initialize : function(){   
                        this.trigger("zui-triggerAssembly-created");
						this.set('state', 'initialized');
                    },
        
                    status: function() {	return this.get('status') },
                    ownedBy: settings.target,
                    //triggerOwner: settings.trigger,
                    
                    // AKA initialize
                    evaluate: function(){
                        var expiration = new Date(Date.now());
                        this.set('evaluationExpiration', expiration.setSeconds(expiration.getSeconds() + this.get('evaluationTimeout')));
                        this.set('lastEvaluation', Date.now());
                        
                        if(!this.ownedBy) {
                            //TODO -- consume self here...
                            this.cleanup();
                            return false;
                        }

                        if(this.get('underEvaluation') === false && (this.get('status') === false || this.get('sticky') === false)) {                           
                            var _scope = this;
                            this.set('underEvaluation', true);
                            var continueEvaluation = function(result){
                                //TODO this is actually parallel
                                var _scope = this;
                                if(this.get('mode') === 'linear') {
                                    var conditionPromises = [];
                                    for(var each in _conditions) {
                                        conditionPromises.push(_conditions[each].evaluate());
                                        //rule / assembly responds with promise, or if solved, promise.resolve(true/false)
                                    }
                                    this.set('state', 'evaluating');
                                    return conditionPromises.length === 0 ? _successCallback.call(this, this.get('id')) : Promise.all(conditionPromises)
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
                                return _timerCallback.call(this, this.get('delayLength')).then(function(result) {
                                    return continueEvaluation.call(_scope, result);
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
                            else {
                                continueEvaluation.call(_scope);
                            }
                        }
                        
                        return this.get('underEvaluation') !== false ? false : true;
                    },
                    
                    addRule: function(rule){
                        _conditions.add(rule);
                    },

                    cleanup : function() {
                        this.trigger("zui-triggerAssembly-consumed");    
                        //_rules.cleanup();
                        this.stopListening();
                        this.ownedBy = null;
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
                }
            }
        })();
   
        _prius = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _prius;
});