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

