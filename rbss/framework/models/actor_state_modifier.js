define([
	'mod/text',
	'zuiRoot/logger'
],
function (
    mod_text,
	Logger
) {
	var MODULE_NAME = "rbss_model_actor_state_modifier";
	var MODEL_SINGULAR = "Actor State Modifier";
	var MODEL_PLURAL = "Actor State Modifiers";

	//https://iconicfox.com.au/brand-archetypes/
	
	//These are the default instance properties
	var _classDefaults =  { 
		defaults : {
			'id': "",
			name : "New " + MODEL_SINGULAR
		},
		constructor: function(attributes, options) {
			if(!attributes || !this.fromJSON(attributes, options)){
				Backbone.Model.apply(this, arguments);
			}
		},
		initialize : function(){   
			if(!this.get('id')){
				this.set('id', mod_text.random.hexColor());
			}
		},
		get_model: function(){ return _model; }
	};

	//These are the static methods & properties that this type will inherit
	var _static = (function() {
		return {
			model_name: MODEL_SINGULAR,
			model_plural: MODEL_PLURAL
		};
	})();

	var _model = Backbone.Model.extend(_classDefaults, _static);
	return _model;
});