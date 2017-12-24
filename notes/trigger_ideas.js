var eventChannel = (function(){
	var subscriptions = [];
	var sentEvents = [];
	
	var emit = function(type, body) {
		subscriptions.forEach(function(currentValue, index, array){
			subscriptions[index](type, body);
		});
	};
	
	return {
		push : function(type, body) { emit(type, body); },
		sub : function(handler) { if(!subscriptions.includes(handler)){ subscriptions.push(handler); }},
		unsub : function(handler) { if(subscriptions.includes(handler)){ subscriptions.splice(subscriptions.indexOf(handler), 1); }},
	};
})();

window.addEventListener('load', function(event) {
	var testHandler = function(type, body) {
		console.log(type, body);
	};
	
	eventChannel.sub(testHandler);
	
	eventChannel.push('Exclaimation', '!!');
	
	eventChannel.unsub(testHandler);
	
	var settings = { 
		isSatisfied : false,
		subscriptions: {
			'error' : eventChannel
		}
	};
	
	//const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
	//wait(10000).then(() => saySomething("10 seconds")).catch(failureCallback);
});

var Trigger = function(settings) {
	var _trigger = this;
	var _owner;
	var _vars = {};
	var _ruleLinkages = [];  
	var _action;
	var _resetAfterFire = false;
	var _keepAlive = false;
	var _state = 'unprimed', // primed, fired, 
	var _guid = '0000';
	
	//var eventChannel = Backbone.Events....
	
	var _evaluateLinkages = function(fireAfterEvaluate) {
		// all linkages must be true for the trigger to fire...
		for(var key in _ruleLinkages) {
			if(_ruleLinkages[key].isEvalPending || _ruleLinkages[key].isSatisfied){	return false; }
		}
		
		if(fireAfterEvaluate) {
			_trigger.fire();
		}
	};
	
	return {
		// CONSTRUCTOR 
		state: function() {	return _state; },
	 	
		addLinkage: function(link){
			// add new linkages
			
			//check link type,
			_ruleLinkages.add(link);
		},
		
		// AKA initialize
		prime: function(){
			if(_state !== 'unprimed') {
				return;
			}
			
			// loop over rules and route subs to eval, check for listenTo
			for(var key in _ruleLinkages) {
				var settings = {};
				
				settings.trigger = _trigger;
				settings.vars = _vars;
				
				_ruleLinkages[key].prime(settings); 
			}
		},
		
		fire: function() {
			/* MODIFIERS POST-FIRE / EVAL / ACTION
				keepAlive
				resetAfterFire
				stickyRules
				count / increment(x)
				average, sum
				max
				min
			*/
			if(_action && typeof _action === 'function'){
				_action();
			}
			else {
				console.log('could not fire action. invalid type');
			}
			
			if(!_keepAlive) {
				_this.cleanup();
			} else (_resetAfterFire) {
				_this.reset();
			}
		},
		
		reset: function() {
			_vars = {};
			for(var key in _ruleLinkages) {
				if(_ruleLinkages[key].resetWithTrigger){	
					_ruleLinkages[key].reset(); 
				}
			}
		},
		
		cleanup: function() {
			// do some cleanup actions,
			// unsub any listeners
			// call parent to delete trigger?
			
			for(var key in _ruleLinkages) {
				if(_ruleLinkages[key].resetWithTrigger){	
					_ruleLinkages[key].cleanup(); 
				}
			}
		},
		
		evaluate: function(fireAfterEvaluate) {
			return _evaluateLinkages(fireAfterEvaluate);
		}
	};
};

// TODO think about how Triggers, Linkages, and Rules communicate with one another.

/** Linkage Building and Processing
*		Linkages map 1 (linkage) -> Many (rules)
*		linkage = 
*/
var Linkage = function(settings) {
	// SET ON PRIME()
	var _guid = 'jfksdahjfkqa';
	var _type = 'sequence-parallel';  // 'sequence-linear' 'sequence-parallel' 'race'	
	// references
	var _trigger = {};
	var _link = this;

	// BASIC SETTINGS
	var _isPrimed = false;
	var _isPending = false;
	var _isSatisfied = false;
	var _resetWithTrigger = false;
	var _stickyRules = false;
	
	//var _clearCustomVarsOnReset = true;
	//var _clearInternalVarsOnReset = true;

	var _delayLength = 0;
	var _timeWindowDuration = 0;
	var _timeWindowStart = Date.now();
	var _bornOn = Date.now();
	
	var _variables = {};
	var _rules = [];
	var _evaluations = []; // promises 
	
	var _startSequenceLinear = function() {
		
	};
	
	var _startSequenceParallel = function() {
		
	};
	
	var _startRace = function() {
		
	};
	 
	return {
		isPending : function(){ return _isPending; },
		isSatisfied: function(){ return _isSatisfied; },
		resetWithTrigger : function() { return _resetWithTrigger; },
		addRule: function(r) { _rule.push(r); },
		prime: function(settings){
			switch(_type)
			{
				case 'sequence-linear':
					_startSequenceLinear();
				break;
				
				case 'sequence-parallel':
					_startSequenceParallel();
				break;
				
				case 'race':
					_startRace();
				break;
			}
		},
		evaluate : function() {
			// loop over collection and re-evaluate the logical links
			// if all good, isEvalPending = false	

			// TODO HOW TO USE PENDING BOOL: _isPending, depends on _type
			if(_type === 'sequence-parallel' || _type === 'sequence-linear') {
				for(var rule in _rules) {
					if(!rule.isSatisfied){
						_isSatisfied = false;
						return _isSatisfied;
					}
				}
				_isSatisfied = true;
				return _isSatisfied;
			} else if(_type === 'race') {
				for(var rule in _rules) {
					if(rule.isSatisfied){
						_isSatisfied = true;
						return _isSatisfied;
					}
				}
				_isSatisfied = false;
				return _isSatisfied;
			}
		},
		reset : function() {
			// reset linkage
		},
		
		cleanup: function() {
			// do some cleanup actions,
			// unsub any listeners
			// call parent to delete trigger?
		}
	};
};


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
		/

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
