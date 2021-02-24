define([
	'mod/text',
	'zuiRoot/logger'
],
function (
    mod_text,
	Logger
) {
	var RaceOptions = ["Human"];
	var HumanMaleFirsts = ["Arne", "Bjørn", "Eirik", "Geir", "Gisle", "Gunnar", "Harald",  "Håkon", "Inge", "Ivar", "Knut", "Leif", "Magnus", "Olav", "Rolf", "Sigurd", "Snorre", "Steinar", "Torstein", "Trygve", "Ulf", "Valdemar", "Vidar", "Yngve"];
	var HumanFemaleFirsts = ["Astrid", "Brynhild", "Freydis", "Gudrun", "Gunnhild", "Gunnvor", "Hilde", "Ingrid", "Ragnhilid", "Ranveig", "Sigrid", "Sigrunn", "Siv", "Solveig", "Svanhild", "Torhild"];
	var HumanLasts = ["Albertsen", "Andréasson", "Bengtsson", "Danielsen", "Kron", "Karlsen", "Knutson", "Steensen", "Ostberg", "Prebensen", "Ericson", "Jakobsen", "Rask", "Solberg", "Vång", "Vinter"];
	var AlignmentOptions = ["C-", "N-", "L-", "CN", "TN", "LN", "C+", "N+", "L+"];
	var ArchetypeOptions = ["Outlaw", "Jester", "Lover", "Caregiver", "Everyman", "Innocent", "Ruler", "Sage", "Magician", "Hero", "Creator", "Explorer"];

	var _prius;

	var generateScope = function(settings){
		return new (function(settings){
			settings = typeof settings === 'undefined' ? {} : settings; 

			return { 
				defaults : {
					'id': typeof settings.id !== "undefined" ? settings.id : mod_text.random.hexColor(),
					'title': (settings && settings.title) ? settings.title : 'New Page',
					'state': 'solo',
					'echo': false,
					'isActive': (settings && settings.isActive) ? settings.isActive : false,
					'isLoading': false,
					'bodyClasses': settings && Array.isArray(settings.bodyClasses) ? settings.bodyClasses : []
				},
	
				initialize : function(){   
					_inform(this, "rbss-actor-created");
				},
				actorId : ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6),
				name : "New Actor",
				baseAttributes : {
					Intelligence: 1,
					Strength: 1,
					Presence: 1,
					Wits: 1,
					Dexterity: 1,
					Manipulation: 1,
					Resolve: 1,
					Stamina: 1,
					Composure: 1
				},
				modifiers : {
					total_INT: 0,
					total_STR: 0,
					total_PRE: 0,
					total_WIT: 0,
					total_DEX: 0,
					total_MAN: 0,
					total_RES: 0,
					total_STA: 0,
					total_COM: 0,
					//skillModifiers: [],
					statModifiers: []
					//afflictions: "" //confusion // sleepy, 
		
					// function StatModifiers(cat, amt)
					// {
					// 	this.category = cat;
					// 	this.amount = amt;
					// }
				},
				demographic : {
					age: 0,
					race: "Human",
					sex: "Neutral",
					bodySize: 0,
					archetype: "Fool",
					alignment: "Neutral"
				},
				skills : {
					instantSkills:[],
					extendedSkills:[],
					contestedSkills:[]
				},
				personalitySystem : { // what happens when these values change (up and down)
					will: 1, 
					anger: 0,
					fear: 0,
					traits: [], //virtue / vice
					mood: "Neutral"  // fear, anger, disgust, contempt, joy, sadness, surprise
					/*  methods needed: */
					// CompatabilityCheck // what gets called in pre-check to set up initial behaviors & options
					// Reveal // what gets called when other actors inspect
					// 
				},
				logbook : {
					occupations: [], // objectives (Titles?)
					contracts: [],
					contacts: [] // contacts, factions and reputation
					// trading trends (highest / Lowest)
					// newspaper "tips"
					// passport stamps & visas
					// journey stats // background & merits (Experience)
					// daily / weekly itinerary
				},
				resources : {
					// inventory
					// currency
					// real estate & titles / deeds
					// transport & parts & livestock? & cargo?
					// knowledge 
				},
		

			};
		})(settings);
	};
	
	//These are the static methods that this type will inherit
	var staticMethods = (function() {
		return {
			fab: function(objValues,  options){   
				var trigger = new (_prius.extend(generateScope(objValues)))();
				
				options = options ? options : {};

				return trigger;
			},
			fabFromJson: function(json) {
				var trigger = new (_prius.extend(generateScope(JSON.parse(json))))();
				return trigger;
			},

			messageDefaults: {
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
			}
		}
	})();

	//These are private methods shared by the entire class
	function _inform(callee, event, message) {
		//var messageDefaults = {}; //TODO bring message defaults in here ?? 
		
		var eventObject = {
			id: callee.get('id'),
			sourceTriggerAssembly: callee
		};
		var logSettings = {
			message: message ? message :  _prius.messageDefaults.hasOwnProperty(event) ? _prius.messageDefaults[event].message : '--',
			tags: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].tags ? ["ZUI", "zui-trigger"].concat(_prius.messageDefaults[event].tags) : ["ZUI", "zui-trigger"],
			eventName: event,
			obj: eventObject,
			logLevel: _prius.messageDefaults.hasOwnProperty(event) && _prius.messageDefaults[event].logLevel 
						? _prius.messageDefaults[event].logLevel 
						: 3,
		}
			
		Logger.log(callee.get('id') + ' -- ' + logSettings.message, logSettings);
		callee.trigger(event, eventObject);
	};

	_prius = Backbone.Model.extend({}, staticMethods);
	
	return _prius;


		// events : {
		// 	myEvents : BootStrap.Events.gen
		// }


		// this.OnActorChanged = function()
		// {

		// };

		// this.OnBaseAttributesChanged = function()
		// {

		// };

		// this.OnModifiersChanges = function()
		// {

		// };

		// this.OnDemographicChanged = function()
		// {

		// };

		// this.OnSkillsChanged = function()
		// {
			
		// };

		// this.OnLogBookChanged = function()
		// {
			
		// };

		// this.OnResourcesChanged = function()
		// {
			
		// };

		// GetTotalAttributes = function()
		// {
		// 	return GetTotalBaseAttributes() + GetTotalModifiers();
		// },

		// GetTotalBaseAttributes = function()
		// {
		// 	return this.GetTotalBaseMental() + this.GetTotalBasePhysical() + this.GetTotalBaseSocial();
		// },	

		// GetTotalModifiers = function()
		// {
		// 	return this.GetTotalModMental() + this.GetTotalModPhysical() + this.GetTotalModSocial();
		// },


		// GetBaseAttribute = function (attr)
		// {
		// 	switch(attr)
		// 	{
		// 		case "INT":
		// 			return this.baseAttributes.Intelligence;
		// 		case "STR":
		// 			return this.baseAttributes.Strength;
		// 		case "PRE":
		// 			return this.baseAttributes.Presence;
		// 		case "WIT":
		// 			return this.baseAttributes.Wits;
		// 		case "DEX":
		// 			return this.baseAttributes.Dexterity;
		// 		case "MAN":
		// 			return this.baseAttributes.Manipulation;
		// 		case "RES":
		// 			return this.baseAttributes.Resolve;
		// 		case "STA":
		// 			return this.baseAttributes.Stamina;
		// 		case "COM":
		// 			return this.baseAttributes.Composure;
		// 	}
		// },

		// GetAttributeModifier = function(attr)
		// {
		// 	switch(attr)
		// 	{
		// 		case "INT":
		// 			return this.modifiers.total_INT;
		// 		case "STR":
		// 			return this.modifiers.total_STR;
		// 		case "PRE":
		// 			return this.modifiers.total_PRE;
		// 		case "WIT":
		// 			return this.modifiers.total_WIT;
		// 		case "DEX":
		// 			return this.modifiers.total_DEX;
		// 		case "MAN":
		// 			return this.modifiers.total_MAN;
		// 		case "RES":
		// 			return this.modifiers.total_RES;
		// 		case "STA":
		// 			return this.modifiers.total_STA;
		// 		case "COM":
		// 			return this.modifiers.total_COM;
		// 	}
		// },

		// GetTotalAttribute = function(attr)
		// {
		// 	return GetBaseAttribute(attr) + GetAttributeModifier(attr);
		// },

		// // MENTAL METHODS -----

		// GetTotalMental = function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBaseMental() + this.GetTotalModMental();
		// },

		// GetTotalBaseMental = function()
		// {
		// 	return this.baseAttributes.Intelligence + this.baseAttributes.Wits + this.baseAttributes.Resolve;
		// },

		// GetTotalModMental = function()
		// {
		// 	return this.modifiers.total_INT + this.modifiers.total_WIT + this.modifiers.total_RES;
		// },


		// // PHYSICAL METHODS -----

		// GetTotalPhysical = function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBasePhysical() + this.GetTotalModPhysical();
		// },

		// GetTotalBasePhysical = function()
		// {
		// 	return this.baseAttributes.Strength + this.baseAttributes.Dexterity + this.baseAttributes.Stamina;
		// },

		// GetTotalModPhysical = function()
		// {
		// 	return this.modifiers.total_STR + this.modifiers.total_DEX + this.modifiers.total_STA;
		// },

		// // SOCIAL METHODS -----
		// GetTotalSocial= function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBaseSocial() + this.GetTotalModSocial();
		// },

		// GetTotalBaseSocial = function()
		// {
		// 	return this.baseAttributes.Presence + this.baseAttributes.Manipulation + this.baseAttributes.Composure;
		// },

		// GetTotalModSocial = function()
		// {
		// 	return this.modifiers.total_PRE + this.modifiers.total_MAN + this.modifiers.total_COM;
		// },

		// // POWER METHODS -----
		// GetTotalPower = function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBasePower() + this.GetTotalModPower();
		// },

		// GetTotalBasePower= function()
		// {
		// 	return this.baseAttributes.Intelligence + this.baseAttributes.Strength + this.baseAttributes.Presence;
		// },

		// GetTotalModPower= function()
		// {
		// 	return this.modifiers.total_INT + this.modifiers.total_STR + this.modifiers.total_PRE;
		// },

		// // FINESSE METHODS -----
		// GetTotalFinesse= function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBaseFinesse() + this.GetTotalModFinesse();
		// },

		// GetTotalBaseFinesse = function()
		// {
		// 	return this.baseAttributes.Wits + this.baseAttributes.Dexterity + this.baseAttributes.Manipulation;
		// },

		// GetTotalModFinesse= function()
		// {
		// 	return this.modifiers.total_WIT + this.modifiers.total_DEX + this.modifiers.total_MAN;
		// },

		// // RESILIENCE METHODS -----
		// GetTotalResilience = function()
		// {
		// 	// sum of all mental attributes:
		// 	return this.GetTotalBasePhysical() + this.GetTotalModPhysical();
		// },

		// GetTotalBaseResilience = function()
		// {
		// 	return this.baseAttributes.Resolve + this.baseAttributes.Stamina + this.baseAttributes.Composure;
		// },

		// GetTotalModResilience= function()
		// {
		// 	return this.modifiers.total_RES + this.modifiers.total_STA + this.modifiers.total_COM;
		// },

		// // DECSION MODEL
		// GetDecisionModel = function()
		// {
		// 	if(this.GetTotalMental() > this.GetTotalPhysical() && this.GetTotalMental() > this.GetTotalSocial())
		// 	{
		// 		// this actor is polarized towards making mental decisions
		// 		return "Mental";
		// 	}
		// 	else if (this.GetTotalPhysical() > this.GetTotalMental && this.GetTotalPhysical() > this.GetTotalSocial())
		// 	{
		// 		return "Physical";
		// 	}
		// 	else if(this.GetTotalSocial() > this.GetTotalMental() && this.GetTotalSocial() > this.GetTotalPhysical())
		// 	{
		// 		return "Social";
		// 	}
		// 	else
		// 	{
		// 		return "Balanced";
		// 	}
		// }
	}
);