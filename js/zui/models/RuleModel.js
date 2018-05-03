var Rule = function(settings) {
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
	
	return {
		isPending : function(){ return _isPending; },
		isSatisfied: function(){ return _isSatisfied; },
		ruleType: function(){ return _type; },

		evaluate: function(rule, trigger, event) {
			// TODO HOW TO USE PENDING BOOL: _isPending, depends on _type
			// listen for destructors / deletes and cleanup self if we get out of sync
			
			// return promise
		},
		
		prime: function() {
			/* varries for each event type:
				  * ComponentEquality
				  * EventEquality
				  * InternalEquality
				  * ObjectExists
			*/
		},
		
		reset: function() {
			_vars = {};
		}
	}
};
