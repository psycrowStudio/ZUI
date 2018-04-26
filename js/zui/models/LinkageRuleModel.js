// TODO consider runtime rules vs json rules
var Rule = function(settings) {
	var _guid = 'jfksdahjfkqa';
	var _type = 'ObjectEquality';  // 'EventEquality' 'LinkageEquality', 'TriggerEquality' 'ObjectExists'	
	var _typeSettings = {};
		//eventChannel, eventName, evaluate
	
	var _evVarsCompare { name: {initial, target}}


	//EventEquality
		//_evName
		//_evChannel (or object)
		//_evPatternMatch {}
		

	//linkagesEquality
		//_evVarMatch { name: {initial, target}}

	//triggerEquality
		//_evTriggerId 
		//_evTrigger {}
		//_evTriggerMatch { name: {initial, target}}
	
	//objectExists: does a specific JS object exist in memory?
		//_evObjId 
		//_evObj {}
		//_evObjMatch { name: {initial, target}}

	// references
	var _link = {};
	var _rule = this;

	var _isPending = false;
	var _isSatisfied = false;
	var _subscriptions = { };
		// 'error' : { 
			// channel:eventChannel, 
			// lastCapturedEvent: null,
			// handler : function(){}	
		// }
	// },
	
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
