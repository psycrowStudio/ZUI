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