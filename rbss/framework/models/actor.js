define([
	'mod/text',
	'zuiRoot/logger',

	"rbssRoot/framework/models/actor_archetype",
	"rbssRoot/framework/models/actor_race",
	"rbssRoot/framework/models/actor_ability",
	"rbssRoot/framework/models/actor_history_entry",
	"rbssRoot/framework/models/actor_state_modifier",
	"rbssRoot/framework/models/commodity",
	"rbssRoot/framework/models/contact",
	"rbssRoot/framework/models/currency",
	"rbssRoot/framework/models/datum_entry",
	"rbssRoot/framework/models/itinerary_entry",
	"rbssRoot/framework/models/personality",
	"rbssRoot/framework/models/property",
	"rbssRoot/framework/models/quest",
	"rbssRoot/framework/models/statistic",
	"rbssRoot/framework/models/talent",
	"rbssRoot/framework/models/trait",
],
function (
    mod_text,
	Logger,
	rbss_actor_archetype,
	rbss_actor_race,
	rbss_actor_ability,
	rbss_actor_history_entry,
	rbss_actor_state_modifier,
	rbss_commodity,
	rbss_contact,
	rbss_currency,
	rbss_datum_entry,
	rbss_itinerary_entry,
	rbss_personality,
	rbss_property,
	rbss_quest,
	rbss_statistic,
	rbss_talent,
	rbss_trait
) {
	var MODULE_NAME = "rbss_model_actor";
	var MODEL_SINGULAR = "Actor";
	var MODEL_PLURAL = "Actors";

	var _messageDefaults = {
		"zui-trigger-created": {
			message: "Trigger Created",
			logLevel: 1,
			tags: ["zui-create"]
		},
		"zui-trigger-primed": {
			message: "Trigger Primed",
		},
		"zui-trigger-fired": {
			message: "Trigger Fired",
			logLevel: 1
		},
		"zui-trigger-evaluation-error": {
			message: "Trigger Evaluation Rejected",
			logLevel: 1,
			tags: ["error"]
		},
		"zui-trigger-consumed": {
			message: "Trigger Consumed",
			logLevel: 1
		},
		"zui-trigger-reset": {
			message: "Trigger Reset",
			logLevel: 1
		}
	};

	//These are the default instance properties
	var _classDefaults =  { 
		defaults : {
			'id': "",
			name : "New " + MODEL_SINGULAR,
			nickname : "",
			background: "",
			glyph_code:"",
			accent_color:"#000000",
			demographic : {
				age: 0,
				date_of_birth: null,
				height: 0,
				weight: 0,
				race: null,
				gender: "",
				personality: null,
				archetype: null,
				ethical_alignment: 0,  // 1 law-0-chaos -1
				moral_alignment: 0  // 1 good-0-evil -1
			},
			stats: new Backbone.Collection(null, {
				model: rbss_statistic
			}),
			abilities : new Backbone.Collection(null, {
				model: rbss_actor_ability
			}),
			talents : new Backbone.Collection(null, {
				model: rbss_talent
			}),
			traits : new Backbone.Collection(null, {
				model: rbss_trait
			}),
			modifiers: new Backbone.Collection(null, {
				model: 	rbss_actor_state_modifier,
			}),
			logbook : {
				itinerary: new Backbone.Collection(null, {
					model: rbss_itinerary_entry
				}),
				quests: new Backbone.Collection(null, {
					model: rbss_quest
				}),
				contacts: new Backbone.Collection(null, {
					model: rbss_contact
				}),
				history: new Backbone.Collection(null, {
					model: rbss_actor_history_entry
				})
				// family tree
				// newspaper "tips"
				// passport stamps & visas
			},
			resources : {
				inventory:new Backbone.Collection(null, {
					model: rbss_commodity
				}),
				currencies:new Backbone.Collection(null, {
					model: rbss_currency
				}),
				property:new Backbone.Collection(null, {
					model: rbss_property
				}),
				knowledge:new Backbone.Collection(null, {
					model: rbss_datum_entry
				}),
				equipment: new Backbone.Collection(null, {
					model: rbss_commodity
				})
			},
			// Art / Sound / assets?
			// dialogs
		},
		constructor: function(attributes, options) {
			if(!attributes || !this.fromJSON(attributes, options)){
				Backbone.Model.apply(this, arguments);
			}
		},
		initialize : function(attributes, options){   
			if(!this.get('id')){
				this.set('id', mod_text.random.hexColor());
			}

			var demographic = JSON.parse(JSON.stringify(this.get('demographic')));
			if(!demographic['date_of_birth']){
				demographic['date_of_birth'] = luxon.DateTime.utc();
			}
			else if(_.isString(demographic['date_of_birth'])){
				demographic['date_of_birth'] = luxon.DateTime.fromISO(demographic['date_of_birth']);
			}

			if(!demographic.race){
				demographic.race = rbss_actor_race.random_default_race()
			}

			if(!demographic.personality){
				demographic.personality = rbss_personality.random_personality();
			}

			if(!demographic.archetype){
				demographic.archetype = rbss_actor_archetype.random_archetype();
			}

			this.set('demographic', demographic);

			//_inform(this, "rbss-actor-created");
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

	//These are private methods shared by the entire class
	// function _inform(callee, event, message) {
	// 	//var messageDefaults = {}; //TODO bring message defaults in here ?? 
		
	// 	var eventObject = {
	// 		id: callee.get('id'),
	// 		sourceTriggerAssembly: callee
	// 	};
	// 	var logSettings = {
	// 		message: message ? message :  _prius.messageDefaults.hasOwnProperty(event) ? _prius.messageDefaults[event].message : '--',
	// 		tags: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].tags ? ["ZUI", "zui-trigger"].concat(_prius.messageDefaults[event].tags) : ["ZUI", "zui-trigger"],
	// 		eventName: event,
	// 		obj: eventObject,
	// 		logLevel: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].logLevel 
	// 					? _prius.messageDefaults[event].logLevel 
	// 					: 3,
	// 	}
			
	// 	Logger.log(callee.get('id') + ' -- ' + logSettings.message, logSettings);
	// 	callee.trigger(event, eventObject);
	// };

	return _model;
});