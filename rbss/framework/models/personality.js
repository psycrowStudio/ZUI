define([
	'mod/text',
	'zuiRoot/logger'
],
function (
    mod_text,
	Logger
) {
	var MODULE_NAME = "rbss_model_personality";
	var MODEL_SINGULAR = "Personality";
	var MODEL_PLURAL = "Personalities";

	//These are the default instance properties
	var _classDefaults =  { 
		defaults : {
			'id': "",
			name : "New " + MODEL_SINGULAR
		},

		initialize : function(){   
			if(!this.get('id')){
				this.set('id', mod_text.random.hexColor());
			}
		}
	};
	
	//These are the static methods that this type will inherit
	var _staticMethods = (function() {
		return {
			model_name: MODEL_SINGULAR,
			model_plural: MODEL_PLURAL
		};
	})();

	return Backbone.Model.extend(_classDefaults, _staticMethods);
});