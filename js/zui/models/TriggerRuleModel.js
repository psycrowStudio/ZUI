
	define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger'], function(_, Backbone, Common, Logger){
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
                    this.set('underEvaluation', false);

                    this.set('status', true);
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

                var _eventCallback = function(event){
                    this.trigger("zui-triggerRule-event-callback");
                };

                return {
                    defaults : {
                        'id' : Common.genId(),
                        'state' : 'uninitialized', //'initialized', 'evaluating'
                        'status' : typeof settings.status !== 'undefined' ? settings.status : false,
                        'sticky': typeof settings.sticky !== 'undefined' ? settings.sticky : false,
                        'underEvaluation' : false,
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
                    ownedBy: settings.target,
                    //triggerOwner: settings.trigger,
                    //root assembly

                    // AKA initialize
                    //{}
                    // 
                    evaluate: function(externalRef){
                        if(!this.ownedBy) {
                            //TODO -- consume self here...
                            this.cleanup();
                            return false;
                        }

                        if(this.get('underEvaluation') === false && (this.get('status') === false || this.get('sticky') === false)) {
                            var _scope = this;
                            var expiration = new Date(Date.now());
                            this.evaluations = {};
                            this.set('evaluationExpiration', expiration.setSeconds(expiration.getSeconds() + this.get('evaluationTimeout')));
                            this.set('lastEvaluation', Date.now());
                            this.set('underEvaluation', true);
                            this.set('state', 'evaluating');

                            /* types of rules: 
                            * function runner, chain runner (template), option to respect return vals or not
                            * event response
                            *   RESPONSES:
                            *   - function runner
                            *   - trigger event
                            *   - consume trigger?
                            *   - 
                            */ 
                           if(this.functionToRun){
                               var x = this.functionToRun();
                           }

                           //else if(this.) Does event call this?

                            var continueEvaluation = function(result){
                                //inject cancelation
                                return _successCallback.call(_scope);
                            }
                        }

                        return this.get('underEvaluation') !== false ? false : this.get('status');
                    },

                    addRule: function(rule){
                       //TODO subscribe to rule object for events...
                        _conditions.add(rule);
                    },

                    //TODO rule event handler

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
                    var rule = new (_prius.extend(generateScope(objValues)))();

                    options = options ? options : {};

                    // handling template & template settings
                    switch(options.template) {
                        case "function-runner":
                            /* types of rules: 
                            * function runner, chain runner (template), option to respect return vals or not
                            * event response
                            *   RESPONSES:
                            *   - function runner
                            *   - trigger event
                            *   - consume trigger?
                            *   - count 
                            * Object exists 
                            * property compare (include internal #s)
                            */ 
                        break;
                    }

                    // TODO for reset, set save point ??
                    return rule;
                }
            }
        })();

        _prius = Backbone.Model.extend(generateSuperScope(), staticMethods);
        return _prius;
});

    // == RULE ==
    //     TYPE: 
    //         * EventEquality: does an event name, and or body match a pattern
    //         * linkagesEquality: does a _var[] property match a pattern
    //         * triggerEquality: does a specific trigger match a pattern
    //         * objectExists: does a specific JS object exist in memory?
    //         * DOMObjectExists: same as above but for DOM selectors
    //     STATES: 
    //         * idle: intial state
    //         * pending: an async evaluation is underway
    //         * satisfied: evaluation is complete and satisfies the condition

    //     METHODS:
    //         * prime()^: Called automatically on init(), makes registrations, sets variables and counters, 
    //             * EventEquality: subscribe to _evChannel for _evName and call evaluate()
    //             * linkagesEquality: create
    //             * triggerEquality: does a specific trigger match a pattern
    //             * objectExists: does a specific JS object exist in memory?

                            
                        // if event based, we need trigger target or global space filter
                            // listen to subs
                            // payload match
                        // if time based
                            // timeA (at a point in the future): setListenInterval
                            // timeB 
                        // if event and time based, do both

    //         * evaluate()^: 
    //             * EventEquality: _evName == ev.name && ev.data === _evExactMatch || {_variables contained match _evContians }
    //             * linkagesEquality: does a _var[] property match a pattern
    //             * triggerEquality: does a specific trigger match a pattern
    //             * objectExists: does a specific JS object exist in memory?
    //         * reset()^: Called to reset the trigger to the unprimed state. 

    //     MODIFIERS:
    //         * clearCustomVarsOnReset
    //         * clearInternalVarsOnReset
   
    //     INTERNAL VARIABLES:
    //         * count / increment(x)
    //         * average, sum
    //         * max
    //         * min