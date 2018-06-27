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
                
                var _eval = function(handle){

                    return new Promise(function(resolve, reject) {
                        handle.resolve = resolve;
                        //console.log(resolve);
                        handle.reject = reject;
                        setTimeout(resolve, Math.floor(Math.random()*(2500-1000+1)+1000));
                    });
                }

                var _successCallback = function(result, handle){
                    console.log('success', result);
                    this.set('underEvaluation', false);

                    
                    this.set('status', true);
                    // sticky enables this to remain true after a successful evaluation
                    if(this.get('becameTrueAt') === 0 || this.get('sticky') === false) {
                        this.set('becameTrueAt', Date.now());
                    }
                    handle.resolve(result);
                    this.trigger("zui-triggerAssembly-evaluate-success");

                    return Promise.resolve(result);
                };

                var _failCallback = function(input){
                    this.trigger("zui-triggerAssembly-evaluate-fail");
                    this.set('underEvaluation', false);
                    return Promise.reject(input);
                };

                var _errorCallback = function(status){
                    this.trigger("zui-triggerAssembly-evaluate-error");
                    this.set('underEvaluation', false);

                    //TODO check for other conditions, to determine if we should cleanup or not
                    return Promise.reject(status);
                };

                var _timerCallback = function(duration){
                    this.trigger("zui-triggerAssembly-timer");
                    return new Promise(function(resolve) {
                        setTimeout(resolve, duration);
                    });
                };

                var _checkAfterResolve = function(result, handle){
                    if(this.get('binding') === 'OR') {
                        //check to make sure not already set to true
                        // resolve all existing promises...
                        if(!this.get('status'))
                        {
                            return _successCallback.call(this,result, handle);
                        }
                    } else if(this.get('binding') === 'AND') {
                        // store success, or reference the handles?
                        //  check over the whole promises array for successes? // or keep a count remaining, and when = 0, then proceed
                        //  fails will end this immediately
                    }
                };

                var _checkAfterReject = function(result, handle){
                    if(this.get('binding') === 'AND') {
                        return _failCallback.call(this, result, handle);
                    }
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
						'mode' : settings.mode ? settings.mode : 'serial',  // or serial
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

                    status: function() {   return this.get('status'); },
                    ownedBy: settings.target, //trigger

                    //properties for evaluation:
                    evaluations: [],
                    //
                    promises: [],
                    
                    conditions: [
                        {
                            evaluate:_eval
                        },
                        {
                            evaluate:_eval
                        }
                    ],

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
                                        _conditions.forEach(function(el){
                                            _scope.evaluations.push(el.evaluate());
                                            //rule / assembly responds with promise, or if solved, promise.resolve(true/false)
                                        });
    
                                        return _scope.evaluations.length === 0 ? _successCallback.call(_scope, undefined, handle) : Promise.all(_scope.evaluations)
                                            .then(function(result) {
                                                return _successCallback.call(_scope, result, handle);
                                            }, function(result){
                                                return _failCallback.call(_scope, result);
                                            }).catch(function(error){
                                                return _errorCallback.call(_scope, error);
                                            });
                                    }
                                    else if(_scope.get('mode') === 'parallel' && _scope.get('binding') === 'OR') {
                                        //       start all
                                        //       return after the first is true

                                        return _scope.conditions.length === 0 ? _successCallback.call(_scope, handle) : new Promise(function(resolve,reject){
                                            _scope.conditions.forEach(function(element){
                                                var pHandle = {};
                                                var promise = element.evaluate(pHandle);
    
                                                pHandle.resolution = promise.then(function(result) {
                                                   return _checkAfterResolve.call(_scope, result, handle);
                                                }, function(result){
                                                    _checkAfterReject.call(_scope, result, handle);
                                                }).catch(function(error){
                                                    _errorCallback.call(_scope, error);
                                                });
    
                                                _scope.promises.push(pHandle);
                                            });
                                        });
    
                                    }
                                    else if(_scope.get('mode') === 'serial') {
                                        // FOR BOTH AND AND OR

                                        // var chain = Promise.resolve();
                                        // for (let i = 0; i < aniMap.length; i++) {
                                        //     chain = chain.then(_ => _startAnimation(aniMap[i].element, aniMap[i].animation, i));
                                        // }
                                        return _scope.conditions.length === 0 ? _successCallback.call(_scope, handle) : new Promise(function(resolve,reject){                                          
                                            var chain = Promise.resolve();
                                            _scope.conditions.forEach(function(element){
                                                var pHandle = {};
                                                chain = chain.then(function() {
                                                    return element.evaluate(pHandle).then(function(result) {
                                                        return _checkAfterResolve.call(_scope, result, handle);
                                                     }, function(result){
                                                        return _checkAfterReject.call(_scope, result, handle);
                                                     }).catch(function(error){
                                                        return _errorCallback.call(_scope, error);
                                                     });
                                                });
                                                _scope.promises.push(pHandle);
                                            });  
                                        });
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
                                    //TODO this is a promise race case
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