

var RaceOptions = ["Human"];
var HumanMaleFirsts = ["Arne", "Bjørn", "Eirik", "Geir", "Gisle", "Gunnar", "Harald",  "Håkon", "Inge", "Ivar", "Knut", "Leif", "Magnus", "Olav", "Rolf", "Sigurd", "Snorre", "Steinar", "Torstein", "Trygve", "Ulf", "Valdemar", "Vidar", "Yngve"];
var HumanFemaleFirsts = ["Astrid", "Brynhild", "Freydis", "Gudrun", "Gunnhild", "Gunnvor", "Hilde", "Ingrid", "Ragnhilid", "Ranveig", "Sigrid", "Sigrunn", "Siv", "Solveig", "Svanhild", "Torhild"];
var HumanLasts = ["Albertsen", "Andréasson", "Bengtsson", "Danielsen", "Kron", "Karlsen", "Knutson", "Steensen", "Ostberg", "Prebensen", "Ericson", "Jakobsen", "Rask", "Solberg", "Vång", "Vinter"];
var AlignmentOptions = ["C-", "N-", "L-", "CN", "TN", "LN", "C+", "N+", "L+"];
var ArchetypeOptions = ["Outlaw", "Jester", "Lover", "Caregiver", "Everyman", "Innocent", "Ruler", "Sage", "Magician", "Hero", "Creator", "Explorer"];


var Actor = Backbone.Model.extend({

	initialize: function() {  },

	author: function() {  },

	coordinates: function() {  },

	allowedToEdit: function(account) {
		return true;
	},

	defaults: {
		"appetizer":  "caesar salad",
		"entree":     "ravioli",
		"dessert":    "cheesecake"
	}

});





var ActorFactory = {
	
	Random: function (count)
	{
		count = count === undefined ? 1 : count;

		if(count > 1)
		{
			var actors = [];
			for(var z = 0; z < count; z++)
			{
				actors.push(new Actor());
				this.SetRandomBaseAttributes(actors[z]);
				this.SetRandomPersonality(actors[z]);
				this.SetRandomDemographic(actors[z]);
				this.SetRandomSkills(actors[z]);
				this.SetRandomPersonality(actors[z]);
				this.SetRandomLogBook(actors[z]);
				this.SetRandomResources(actors[z]);
			}

			return actors;
		}
		else
		{
				var actor = new Actor();
				this.SetRandomBaseAttributes(actor);
				this.SetRandomPersonality(actor);
				this.SetRandomDemographic(actor);
				this.SetRandomSkills(actor);
				this.SetRandomPersonality(actor);
				this.SetRandomLogBook(actor);
				this.SetRandomResources(actor);
				return actor;
		}

	},


	SetRandomBaseAttributes: function(actor)
	{
		//TODO distribute a fixed amount // scale a base to a more experienced level

		//var totalAttributes = Object.keys(actor.baseAttributes).length;

		//var totalPointsRemaining = 18;
		//var totalAttributesRemaining = totalAttributes;

		for(var z in actor.baseAttributes)
		{
			if (actor.baseAttributes.hasOwnProperty(z)) 
			{
				actor.baseAttributes[z] = getRandomIntInc(1,3);
	    	}
		}
	},


	SetRandomDemographic: function(actor){

		// human demographic (other races / types may need a demographic template)
		actor.demographic.race = RaceOptions[0]; // just human for now
		actor.demographic.alignment = AlignmentOptions[getRandomInt(0, AlignmentOptions.length)];
		//TODO pull skills and traits for race, alignment, sex, bodysize and archetype

		actor.demographic.age = getRandomIntInc(18, 118);
		actor.demographic.sex = getRandomIntInc(0, 1) == 0 ? "Male" : "Female";

		var name = "";
		if(actor.demographic.sex == "Male")
		{	
 			name += HumanMaleFirsts[getRandomInt(0, HumanMaleFirsts.length)] + " ";
		}
		else if(actor.demographic.sex == "Female")
		{
			name += HumanFemaleFirsts[getRandomInt(0, HumanFemaleFirsts.length)] + " ";
		}

		name += HumanLasts[getRandomInt(0, HumanLasts.length)];
		actor.name = name;

		actor.demographic.bodySize = getRandomIntInc(3, 7);
		actor.demographic.archetype = ArchetypeOptions[getRandomIntInc(0, ArchetypeOptions.length)];
	},
	SetRandomSkills: function(actor){},
	SetRandomPersonality: function(actor){

	},
	SetRandomLogBook: function(actor){},
	SetRandomResources: function(actor){},

}

//BACKBONE NOTES FOR FUTURE REFERECE
// Actor = Backbone.Model.extend({
// 	defaults:
// 	{

// 	}
// });
//var newActor = new Actor({name: 'Alec'});
//var faction = new Backbone.Collection.extend({
// 	model: Actor,
// 	url: "#"
// });


//BB VIEWS
//  Backbone.Views.extend({})


function Actor() 
{
	this.actorId = ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
	this.name = "New Actor";
	this.baseAttributes = {
		Intelligence: 1,
		Strength: 1,
		Presence: 1,
		Wits: 1,
		Dexterity: 1,
		Manipulation: 1,
		Resolve: 1,
		Stamina: 1,
		Composure: 1
	};
	this.modifiers = {
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
	};
	this.demographic = {
		age: 0,
		race: "Human",
		sex: "Neutral",
		bodySize: 0,
		archetype: "Fool",
		alignment: "Neutral"
	};
	this.skills ={
		instantSkills:[],
		extendedSkills:[],
		contestedSkills:[]
	};
	//var supernatural = {};
	this.personalitySystem = { // what happens when these values change (up and down)
		will: 1, 
		anger: 0,
		fear: 0,
		traits: [], //virtue / vice
		mood: "Neutral"  // fear, anger, disgust, contempt, joy, sadness, surprise
		/*  methods needed: */
		// CompatabilityCheck // what gets called in pre-check to set up initial behaviors & options
		// Reveal // what gets called when other actors inspect
		// 

	};

	this.logbook = {
		occupations: [], // objectives (Titles?)
		contracts: [],
		contacts: [] // contacts, factions and reputation
		// trading trends (highest / Lowest)
		// newspaper "tips"
		// passport stamps & visas
		// journey stats // background & merits (Experience)
		// daily / weekly itinerary
	};

	this.resources = {
		// inventory
		// currency
		// real estate & titles / deeds
		// transport & parts & livestock? & cargo?
		// knowledge 
	};

	this.GetTotalAttributes = function()
	{
		return GetTotalBaseAttributes() + GetTotalModifiers();
	};

	this.GetTotalBaseAttributes = function()
	{
		return this.GetTotalBaseMental() + this.GetTotalBasePhysical() + this.GetTotalBaseSocial();
	};	

	this.GetTotalModifiers = function()
	{
		return this.GetTotalModMental() + this.GetTotalModPhysical() + this.GetTotalModSocial();
	};


	this.GetBaseAttribute = function (attr)
	{
		switch(attr)
		{
			case "INT":
				return this.baseAttributes.Intelligence;
			case "STR":
				return this.baseAttributes.Strength;
			case "PRE":
				return this.baseAttributes.Presence;
			case "WIT":
				return this.baseAttributes.Wits;
			case "DEX":
				return this.baseAttributes.Dexterity;
			case "MAN":
				return this.baseAttributes.Manipulation;
			case "RES":
				return this.baseAttributes.Resolve;
			case "STA":
				return this.baseAttributes.Stamina;
			case "COM":
				return this.baseAttributes.Composure;
		}
	};

	this.GetAttributeModifier = function(attr)
	{
		switch(attr)
		{
			case "INT":
				return this.modifiers.total_INT;
			case "STR":
				return this.modifiers.total_STR;
			case "PRE":
				return this.modifiers.total_PRE;
			case "WIT":
				return this.modifiers.total_WIT;
			case "DEX":
				return this.modifiers.total_DEX;
			case "MAN":
				return this.modifiers.total_MAN;
			case "RES":
				return this.modifiers.total_RES;
			case "STA":
				return this.modifiers.total_STA;
			case "COM":
				return this.modifiers.total_COM;
		}
	};

	this.GetTotalAttribute = function(attr)
	{
		return GetBaseAttribute(attr) + GetAttributeModifier(attr);
	};

	// MENTAL METHODS -----

	this.GetTotalMental = function()
	{
		// sum of all mental attributes:
		return this.GetTotalBaseMental() + this.GetTotalModMental();
	};

	this.GetTotalBaseMental = function()
	{
		return this.baseAttributes.Intelligence + this.baseAttributes.Wits + this.baseAttributes.Resolve;
	};

	this.GetTotalModMental = function()
	{
		return this.modifiers.total_INT + this.modifiers.total_WIT + this.modifiers.total_RES;
	};


	// PHYSICAL METHODS -----

	this.GetTotalPhysical = function()
	{
		// sum of all mental attributes:
		return this.GetTotalBasePhysical() + this.GetTotalModPhysical();
	};

	this.GetTotalBasePhysical = function()
	{
		return this.baseAttributes.Strength + this.baseAttributes.Dexterity + this.baseAttributes.Stamina;
	};

	this.GetTotalModPhysical = function()
	{
		return this.modifiers.total_STR + this.modifiers.total_DEX + this.modifiers.total_STA;
	};

	// SOCIAL METHODS -----
	this.GetTotalSocial= function()
	{
		// sum of all mental attributes:
		return this.GetTotalBaseSocial() + this.GetTotalModSocial();
	};

	this.GetTotalBaseSocial = function()
	{
		return this.baseAttributes.Presence + this.baseAttributes.Manipulation + this.baseAttributes.Composure;
	};

	this.GetTotalModSocial = function()
	{
		return this.modifiers.total_PRE + this.modifiers.total_MAN + this.modifiers.total_COM;
	};

	// POWER METHODS -----
	this.GetTotalPower = function()
	{
		// sum of all mental attributes:
		return this.GetTotalBasePower() + this.GetTotalModPower();
	};

	this.GetTotalBasePower= function()
	{
		return this.baseAttributes.Intelligence + this.baseAttributes.Strength + this.baseAttributes.Presence;
	};

	this.GetTotalModPower= function()
	{
		return this.modifiers.total_INT + this.modifiers.total_STR + this.modifiers.total_PRE;
	};

	// FINESSE METHODS -----
	this.GetTotalFinesse= function()
	{
		// sum of all mental attributes:
		return this.GetTotalBaseFinesse() + this.GetTotalModFinesse();
	};

	this.GetTotalBaseFinesse = function()
	{
		return this.baseAttributes.Wits + this.baseAttributes.Dexterity + this.baseAttributes.Manipulation;
	};

	this.GetTotalModFinesse= function()
	{
		return this.modifiers.total_WIT + this.modifiers.total_DEX + this.modifiers.total_MAN;
	};

	// RESILIENCE METHODS -----
	this.GetTotalResilience = function()
	{
		// sum of all mental attributes:
		return this.GetTotalBasePhysical() + this.GetTotalModPhysical();
	};

	this.GetTotalBaseResilience = function()
	{
		return this.baseAttributes.Resolve + this.baseAttributes.Stamina + this.baseAttributes.Composure;
	};

	this.GetTotalModResilience= function()
	{
		return this.modifiers.total_RES + this.modifiers.total_STA + this.modifiers.total_COM;
	};


	// DECSION MODEL
	this.GetDecisionModel = function()
	{
		if(this.GetTotalMental() > this.GetTotalPhysical() && this.GetTotalMental() > this.GetTotalSocial())
		{
			// this actor is polarized towards making mental decisions
			return "Mental";
		}
		else if (this.GetTotalPhysical() > this.GetTotalMental && this.GetTotalPhysical() > this.GetTotalSocial())
		{
			return "Physical";
		}
		else if(this.GetTotalSocial() > this.GetTotalMental() && this.GetTotalSocial() > this.GetTotalPhysical())
		{
			return "Social";
		}
		else
		{
			return "Balanced";
		}
	}


	// EVENTS 
	this.OnActorChanged = function()
	{

	};

	this.OnBaseAttributesChanged = function()
	{

	};

	this.OnModifiersChanges = function()
	{

	};

	this.OnDemographicChanged = function()
	{

	};

	this.OnSkillsChanged = function()
	{
		
	};

	this.OnLogBookChanged = function()
	{
		
	};

	this.OnResourcesChanged = function()
	{
		
	};
}
//	var transportSystem = {};
//	var combatSystem = {};
//  var dialogSystem = {};
		//dialogOutput
		//dialogContent


var OccupationFactory = {
	priusList: ["Host", "Psychic", "Server", "Coach", "Salesman", "Soldier", "Officer", "Crew", "Engineer", "Cook", "Doctor", "Fireman", "Detective", "Police", "Volunteer", "Socialite", "Investor", "Owner", "Musician", "Painter", "Actor", "Teacher", "Professor", "Artisan", "Scientist", "Navigator", "Academic", "Prospector", "Scavenger", "Pirate", "Raider", "Priest", "Speaker", "Lawyer", "Judge", "Elder", "Bard", "Hunter", "Fisherman", "Outlaw" ],

	GetRandom: function(){
		var rng = getRandomInt(0, priusList.length);
		return new Occupation(priusList[rng]);
	}
};

function Occupation(prius) 
{
	this.employer = "MegaCorp";
	this.category = prius; // this will link to the level up curves
	this.jobTitle = prius; // this will change based on proficiency level
	this.proficiency = 1;
}

function Contact()
{
	this.category = "Individual"; // Organization
	this.relationship = "Neutral"; // Family, Wife, Colleague, Caravan Member, Stranger 
	this.status = "Neutral"; 
	this.contactId = "0"; // actor or organization id
}

var ContractsFactory = {
	priusList: ["Guard", "Collection", "Mystery / Puzzle", "Supply Line", "PointOfInterest", "Donation", "Salvage", "RoadBuilding", "SendAMessage", "GetAResponse", "Bounty", "Smuggle", "Investment", "Reconnaissance", "Survey", ],

	GetRandom: function(){
		var rng = getRandomInt(0, priusList.length);
		return new Contract(priusList[rng]);
	}

};

function Contract(prius)
{
	this.oferer = ""; // contact id 
	this.title = "New Contract";
	this.category = prius; 
	this.agreement = "Lorem Ipsum"; 
	this.terms = []; // How best to represent these? DO X BY Y IN EXCHANGE FOR Z
	// are terms sequential or not (hidden until the predecessor is completed)
	this.expiration = 000;
	//fufillmentActions
	//this will expand
	//contain the counters needed for tracking & achievements
}


var PersonalityFactory = {
	priusList: ["Perfectionist", "Giver", "Performer", "Romantic", "Observer", "LoyalSkeptic", "Epicure", "Protector", "Mediator"],
	GetRandom: function(){
		var rng = getRandomInt(0, priusList.length);
		//var p = new PersonalityTrait(priusList[rng]);
		var p = "";
		switch(rng)
		{
			case 0:

			break;
		}
	},

	// returns a relationship profile update as A relates to B 
	ExecuteCompatabilityCheck: function(actorA, actorB)
	{
		//consideration priority:
		// quest or employment deliverables
		// past history
		// personality match
			// same base type || high openness || high extroversion
			// wing type
			// comfort type
			// 
		// social skill differential
		// occupational commonality 
		// demographic commonality

		//trigger events:
		  // alter mood: fear, stress, anger

	}



};

function PersonalitySystem(baseToUse)
{
	this.will = 0;
	this.stress = 0; 
	this.anger = 0;
	this.fear = 0;
	this.base = PersonalityPriusCollection.hasOwnProperty(baseToUse) ? PersonalityPriusCollection[baseToUse] : PersonalityPriusCollection.Perfectionist;
	//this.decisionModel = "Heart || Mind || Body"; // WILL BE DECIDED BY ACTOR ATTRIBUTE CHECKS.
	this.modifiers = {}; // unsure how this will work, but the gist is that they will add and subtract points to personality indexes
	/* 
		ModId:{
			modName:"",
			modValue:0,
			modMisc:"",
			modAction:"Additive, Subtractive, Replace, MiscReplace"
		}
	*/
	// apply personality modifier
	// update personality modifier
	// remove personality modifier
	// get base stat
	// get mod stat
	// get total stat(will, stress, anger, fear, openness, conscientiousness, extroversion, neurosis, agreeableness)
}

var PersonalityPriusCollection = {
	Perfectionist: {
		openness: 0,
		conscientiousness: 0,
		extrovertion: 0,
		neurosis: 0,
		agreeableness: 0,
		wings: ["Type1", "Type2"],
		stress: "Type8",
		security: "Type4",
		probabilityCurve:[{ Perfectionist:0.55 }, { Romatic:0.05 }, { Giver:0.05 }  ], // AKA look-alikes?


	},
	Giver: {},
	Performer: {},
	Romantic: {},
	Observer: {},
	LoyalSkeptic: {},
	Epicure: {},
	Protector: {},
	Mediator: {}
}

function PersonalityTrait()
{
	this.category = prius; 
	this.proficiency;
}


var SkillFactory = {
	Catagories: {
		instant: "Instant",  // will be very situational
		extended: "Extended",  // will be core loop related
		contested: "Contested" // will always have a target // can be blocked, countered, dodged & evaded
	},

	SkillFamily: {
		mental: "Mental",
		physical: "Physical",
		socail: "Social",
		power: "Power",
		finesse: "Finesse",
		resilience: "Resilience",

	},

	Availability: {
		town: "Town",
		travel: "Travel",
		other: "Other",
	},

	// need a lot of templates

	GetRandom: function(){
		var nuSkill = new skill();
		nuSkill.category = getRandomInt(0, Catagories.length);
		nuSkill.family = getRandomInt(0, SkillFamily.length);
		return nuSkill;
	}

}

function Skill()
{
	this.category = "";
	this.family = "";
	this.availability;
	this.proficiency = 1;
	this.positiveAttributeLinks = [];
	this.negativeAttributeLinks = [];

	//modifiers
	// available conditions check
	// cast check
	// success check
	//result?
}



function StatModifiers(cat, amt)
{
	this.category = cat;
	this.amount = amt;
}

// afflictions


//discrete verbs that are generic enough to be used throughout the world. These are "less valuable" skills
// will also want to keep a running list of actions(keywords used in sentences to move the story forward)
function Action()
{
	// Open, Loot, Hail, Search, Survey, Scan, Greet, ShowAppreciation, Scold, Flirt, Question, Affirmation, Denial, Cheer(+other emotes), quip, challenge, Answer, Banter, Non-sequitur, wait, harvest
}

//essentially demographic check details
function DemographicTarget()
{

}




// RANDOM COMMON METHODS ------------------------------------------------------------------------------------------------

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntInc(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}