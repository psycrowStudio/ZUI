	define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger',
    'zuiRoot/models/TriggerRuleModel'], function(_, Backbone, Common, Logger, Rule){
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

                var _successCallback = function(handle){
                    this.set('underEvaluation', false);

                    // if(this.get('mode') === 'parallel' && this.get('binding') === 'AND') {

                    // }
                    //else
                    if(this.get('mode') === 'parallel' && this.get('binding') === 'OR' && this.get('status') === true) {
                        //check to make sure not already set to true
                        // resolve all existing promises...
                        handle.resolve("boy!!");
                        return Promise.resolve(true);
                    }
                    // else if(this.get('mode') === 'serial' && this.get('binding') === 'AND') {

                    // }
                    // else if(this.get('mode') === 'serial' && this.get('binding') === 'OR') {

                    // }

                    //TODO Check timing settings, to see if expired.

                    handle.resolve("yeah!");
                    this.set('status', true);
                    this.trigger("zui-triggerAssembly-evaluate-success");

                    // sticky enables this to remain true after a successful evaluation
                    if(this.get('becameTrueAt') === 0 || this.get('sticky') === false) {
                        this.set('becameTrueAt', Date.now());
                    }
                    
                    return Promise.resolve(true);
                };

                var _failCallback = function(input){
                    this.trigger("zui-triggerAssembly-evaluate-fail");
                    this.set('underEvaluation', false);
                    return Promise.reject(false);
                };

                var _errorCallback = function(status){
                    this.trigger("zui-triggerAssembly-evaluate-error");
                    this.set('underEvaluation', false);
                    return Promise.reject(false);
                };

                var _timerCallback = function(duration){
                    this.trigger("zui-triggerAssembly-timer");
                    return new Promise(function(resolve) {
                        setTimeout(resolve, duration);
                    });
                };

                return {
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'uninitialized', //'initialized', 'evaluating'
                        'isRootAssembly': typeof settings.status !== 'undefined' ? settings.status : true,
                        'status' : typeof settings.status !== 'undefined' ? settings.status : false,
                        'sticky': typeof settings.sticky !== 'undefined' ? settings.sticky : false,
                        'underEvaluation' : false,
						'binding' : settings.binding ? settings.binding : 'OR',
						'mode' : settings.mode ? settings.mode : 'parallel',  // or serial
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
                        this.createResetPoint();
                        this.trigger("zui-triggerAssembly-created");
						this.set('state', 'initialized');
                    },

                    status: function() {	return this.get('status') },
                    ownedBy: settings.target, //trigger

                    //properties for evaluation:
                    evaluations: [],
                    //
                    promises: [],

                    // AKA initialize
                    evaluate: function(handle){
                        //TODO use Promise.Race to get a simple, but effective timeout....
                        if(!this.ownedBy) {
                            //TODO -- consume self here...
                            this.cleanup();
                            return false;
                        }

                        var _scope = this;
                        this.evaluations = [];
                        this.promises = [];
                        
                        var P = new Promise(function(resolve, reject){
                            handle.resolve = resolve;
                            //console.log(resolve);
                            handle.reject = reject;

                            if(_scope.get('underEvaluation') === false && (_scope.get('status') === false || _scope.get('sticky') === false)) {
                                //var expiration = new Date(Date.now());
                                //_scope.set('evaluationExpiration', expiration.setSeconds(expiration.getSeconds() + _scope.get('evaluationTimeout')));
                                _scope.set('lastEvaluation', Date.now());
                                _scope.set('underEvaluation', true);
                                _scope.set('state', 'evaluating');

                                var continueEvaluation = function(){
                                    if(_scope.get('mode') === 'parallel' && _scope.get('binding') === 'AND') {
                                        for(var each in _conditions) {
                                            _scope.evaluations.push(_conditions[each].evaluate());
                                            //rule / assembly responds with promise, or if solved, promise.resolve(true/false)
                                        }
    
                                        return _scope.evaluations.length === 0 ? _successCallback.call(_scope, handle) : Promise.all(_scope.evaluations)
                                            .then(function() {
                                                return _successCallback.call(_scope, handle);
                                            }, function(){
                                                return _failCallback.call(_scope);
                                            }).catch(function(){
                                                return _errorCallback.call(_scope);
                                            });
                                    }
                                    else if(_scope.get('mode') === 'parallel' && _scope.get('binding') === 'OR') {
                                        //       start all
                                        //       return after the first is true
    
                                        return this.evaluations.length === 0 ? _successCallback.call(_scope, handle) : new Promise(function(resolve,reject){
                                            _conditions.forEach(function(element){
                                                var pHandle = {};
                                                var promise = element.evaluate(pHandle)
    
                                                pHandle.resolution = promise.then(function() {
                                                   return _successCallback.call(_scope, handle);
                                                }, function(){
                                                    _failCallback.call(_scope);
                                                }).catch(function(){
                                                    _errorCallback.call(_scope);
                                                });
    
                                                this.promises.push(pHandle);
                                            });
                                        })
    
                                    }
                                    else if(_scope.get('mode') === 'serial' && _scope.get('binding') === 'AND') {
                                        //       sequentially eval
                                        //       return if fail
                                        return Promise.reject();
                                    }
                                    else if(_scope.get('mode') === 'serial' && _scope.get('binding') === 'OR') {
                                        //       sequentially eval
                                        //       return if  true
                                        return Promise.reject();
                                    }
                                }
    
                                // if timing, start window or delay.
                                if(_scope.get('status') === false && _scope.get('timing') === 'delay')
                                {
                                    return _timerCallback.call(_scope, _scope.get('delayLength')).then(function(result) {
                                        return continueEvaluation.call(_scope, result);
                                    });
                                }
                                else if(_scope.get('status') === false && _scope.get('timing') === 'window'){
                                    continueEvaluation.call(_scope);
                                    return timerCallback.call(_scope, _scope.get('delayLength')).then(function(){
                                       //this.evaluate(); // call at the end of the window, to re-evaluate?
                                       if(_scope.get('status') === true) {
                                            return _successCallback.call(_scope, handle);
                                       }
                                       else {
                                            return _failCallback.call(_scope);
                                       }
                                    }, _scope.get('windowLength'));
                                }
                                else {
                                    return continueEvaluation.call(_scope);
                                }
                            }    

                            //this.get('underEvaluation') === false ? Promise.reject(false) :
                        });

                        handle.promise = P;
//                        return P;
                        
                        var timeOut = new Promise(function(resolve, reject) {
                                                    
                                setTimeout(function(){ 
                                    //this.trigger("zui-triggerAssembly-timeOut");    
                                    reject("Trigger Timed Out");
                                    
                                }, _scope.get('evaluationTimeout') * 1000);
                            });

                        return _scope.get('evaluationTimeout') < 0 ? P : Promise.race([P, timeOut]).then(function(){
                            return Promise.resolve();
                        },
                        function(err){
                           throw "Trigger Timed Out";;
                        });
                        
                    },

                    cancelEvaluation: function(){
                        if(_isUnderEvaluation){
                            // loop over promises & cancel 
                            this.promises.forEach(function(handle){
                               handle.handle.reject();
                            });
                        } 
                    },

                    addRule: function(rule){
                       //TODO subscribe to rule object for events...
                        _conditions.add(rule);
                    },

                    cleanup : function() {
                        this.trigger("zui-triggerAssembly-consumed");
                        
                        //_rules.cleanup();+

                        this.stopListening();
                        this.ownedBy = null;
                    },
                    reset : function() {
                        //rules.reset();
                        this.trigger("zui-triggerAssembly-reset");
                        this.set({
                            'state': 'initialized',
                            'status': false,
                            'underEvaluation' : false,
                            'evaluationExpiration': 0,
                            'becameTrueAt': 0
                        });
                    },

                    cancelEvaluation: function(){
                        if(this.get('underEvaluation') === true)
                        {
                            // do some stuff
                            this.set('underEvaluation', false);
                        }
                    },

                    createResetPoint : function(){
                        // rules.forEach().createResetPoint()
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

                    // TODO for reset, set save point ??

                    return linkage;
                }
            }
        })();

        _prius = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _prius;
});