define([
	'mod/text',
	'zuiRoot/logger'
],
function (
    mod_text,
	Logger
) {
	var MODULE_NAME = "rbss_model_actor_archetype";
	var MODEL_SINGULAR = "Actor Archetype";
	var MODEL_PLURAL = "Actor Archetypes";

	//These are the default instance properties
	var _classDefaults =  { 
		defaults : {
			'id': "",
			name : "New " + MODEL_SINGULAR,
			descriptions: "",
			ideal:"",
			motto: "",
			motivation:"",
			desire:"",
			traits:[]
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
			model_plural: MODEL_PLURAL,
			random_archetype: function(){
				return _default_archetypes.length > 0 ? _default_archetypes.at(mod_text.random.int(0, _default_archetypes.length-1)) : null;
			}
		};
	})();

	var _model = Backbone.Model.extend(_classDefaults, _static);

	//https://iconicfox.com.au/brand-archetypes/
	//	var ArchetypeOptions = ["Outlaw", "Jester", "Lover", "Caregiver", "Everyman", "Innocent", "Ruler", "Sage", "Magician", "Hero", "Creator", "Explorer"];

	// AFTER MODEL TYPE INSTANTIATED
	var _default_archetypes_json = [
		{
			name : "Creator",
			descriptions: "",
			ideal:"Innovation",
			motto: "If it can be imagined, it can be created.",
			motivation:"Stability & Control",
			desire:"Create something of value.",
			traits:["Inspirational", "Daring", "Provocative"]
		},
		{
			name : "Caregiver",
			descriptions: "",
			ideal:"Service",
			motto: "Love your neighbors as yourself.",
			motivation:"Stability & Control",
			desire:"Protect people from harm",
			traits:["Caring", "Warm", "Reassuring"]
		},
		{
			name : "Ruler",
			descriptions: "",
			ideal:"Control",
			motto: "Power isnt everything, its the only thing.",
			motivation:"Stability & Control",
			desire:"Control.",
			traits:["Commanding", "Refined", "Articulate"]
		},
		{
			name : "Jester",
			descriptions: "",
			ideal:"Pleasure",
			motto: "If I can't dance, I don't want to be part of your revolution.",
			motivation:"Belonging & Enjoyment",
			desire:"Live in the moment with full enjoyment.",
			traits:["Fun-loving", "Playful", "Optimistic"]
		},
		{
			name : "Everyman",
			descriptions: "",
			ideal:"Belonging",
			motto: "All men and women are created equal.",
			motivation:"Belonging & Enjoyment",
			desire:"Connection with others.",
			traits:["Friendly", "Humble", "Authentic"]
		},
		{
			name : "Lover",
			descriptions: "",
			ideal:"Intimacy",
			motto: "I only have eyes for you.",
			motivation:"Belonging & Enjoyment",
			desire:"Attain intimacy and experience sexual pleasure.",
			traits:["Sensual", "Empathetic", "Soothing"]
		},
		{
			name : "Hero",
			descriptions: "",
			ideal:"Mastery",
			motto: "Where there's a will, there's a way.",
			motivation:"Risk & Mastery",
			desire:"To prove one's worth through corageous and difficult action.",
			traits:["Honest", "Candid", "Brave"]
		},
		{
			name : "Outlaw",
			descriptions: "",
			ideal:"Liberation",
			motto: "Rules are ment to be broken.",
			motivation:"Risk & Mastery",
			desire:"Revenge or revolution.",
			traits:["Disruptive", "Rebellious", "Combative"]
		},
		{
			name : "Magician",
			descriptions: "",
			ideal:"Power",
			motto: "It can happen!",
			motivation:"Risk & Mastery",
			desire:"Knowledge of the fundamental laws of how the universe works.",
			traits:["Mystical", "Informed", "Reassuring"]
		},
		{
			name : "Innocent",
			descriptions: "",
			ideal:"Safety",
			motto: "Free to be you and me.",
			motivation:"Independance & Fulfillment",
			desire:"To experience paradise.",
			traits:["Optimistic", "Honest", "Humble"]
		},
		{
			name : "Explorer",
			descriptions: "",
			ideal:"Freedom",
			motto: "Don't fence me in.",
			motivation:"Independance & Fulfillment",
			desire:"The freedom to find out who you are through exploring the world.",
			traits:["Exciting", "Fearless", "Daring"]
		},
		{
			name : "Sage",
			descriptions: "",
			ideal:"Knowledge",
			motto: "The truth will set you free.",
			motivation:"Independance & Fulfillment",
			desire:"The discovery of truth.",
			traits:["Knowlegeable", "Assured", "Guiding"]
		}
	];

	var _default_archetypes = new Backbone.Collection(_default_archetypes_json, {
		model: _model
	});


	return _model;
});