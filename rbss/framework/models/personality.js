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
			name : "New " + MODEL_SINGULAR,
			description:"",
			enneagram: {
				type: 0,
				security: 0,
				stress: 0,
				wing: 0
			},
			axis: {
				openness: 0,
				conscientiousness: 0,
				extrovertion: 0,
				neurosis: 0,
				agreeableness: 0
			},
			// traits: {
			// 	healthy: [],
			// 	average: [],
			// 	unhealthy: []
			// }
			// fear
			// motivation

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
			random: function(){
				return _default_collection.length > 0 ? _default_collection.at(mod_text.random.int(0, _default_collection.length-1)) : null;
			},
			default_collection: function(){
				return _default_collection;
			}
		};
	})();

	var _model = Backbone.Model.extend(_classDefaults, _static);

	// Reformer
	// Helper
	// Achiever
	// Individualist
	// Investigator
	// Loyalist
	// Enthusiast
	// Challenger
	// Peacemaker

	// AFTER MODEL TYPE INSTANTIATED
	var _default_collection_json = [
		{
			name : "Perfectionist",
			description:"",
			enneagram: {
				type: 1,
				security: 7,
				stress: 4,
				wing: 0
			},
			axis: {
				openness: -1,
				conscientiousness: -0.5,
				extrovertion: -0.25,
				neurosis: 0.25,
				agreeableness: 0.25
			},
		},
		{
			name : "Giver",
			description:"",
			enneagram: {
				type: 2,
				security: 4,
				stress: 8,
				wing: 0
			},
			axis: {
				openness: 0.25,
				conscientiousness: 1,
				extrovertion: 0.5,
				neurosis: 0,
				agreeableness: 0
			},
		},
		{
			name : "Performer",
			description:"",
			enneagram: {
				type: 3,
				security: 6,
				stress: 9,
				wing: 0
			},
			axis: {
				openness: 0,
				conscientiousness: 0.25,
				extrovertion: 1,
				neurosis: 0,
				agreeableness: 0
			},
		},
		{
			name : "Romantic",
			description:"",
			enneagram: {
				type: 4,
				security: 1,
				stress: 2,
				wing: 0
			},
			axis: {
				openness: 0.5,
				conscientiousness: -0.25,
				extrovertion: -0.5,
				neurosis: 0.5,
				agreeableness: 0
			},
		},
		{
			name : "Observer",
			description:"",
			enneagram: {
				type: 5,
				security: 8,
				stress: 7,
				wing: 0
			},
			axis: {
				openness: 0.5,
				conscientiousness: 0,
				extrovertion: -1,
				neurosis: 0.25,
				agreeableness: -0.5
			},
		},
		{
			name : "Loyal Skeptic",
			description:"",
			enneagram: {
				type: 6,
				security: 9,
				stress: 3,
				wing: 0
			},
			axis: {
				openness: -1,
				conscientiousness: 0,
				extrovertion: 0,
				neurosis: 1,
				agreeableness: 0
			},
		},
		{
			name : "Epicure",
			description:"",
			enneagram: {
				type: 7,
				security: 5,
				stress: 1,
				wing: 0
			},
			axis: {
				openness: 0.5,
				conscientiousness: 0.25,
				extrovertion: 1,
				neurosis: -0.5,
				agreeableness: 0
			},
		},
		{
			name : "Protector",
			description:"",
			enneagram: {
				type: 8,
				security: 2,
				stress: 5,
				wing: 0
			},
			axis: {
				openness: 0.5,
				conscientiousness: 0.25,
				extrovertion: 1,
				neurosis: -1,
				agreeableness: -0.5
			},
		},
		{
			name : "Mediator",
			description:"",
			enneagram: {
				type: 9,
				security: 3,
				stress: 6,
				wing: 0
			},
			axis: {
				openness: -1,
				conscientiousness: -0.5,
				extrovertion: -1,
				neurosis: -0.5,
				agreeableness: 0.5
			},
		},
	];

	var _default_collection = new Backbone.Collection(_default_collection_json, {
		model: _model
	});

	return _model;
});