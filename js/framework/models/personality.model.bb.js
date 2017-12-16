window.rbss.models["Personality"] = function PersonalitySystem(baseToUse)
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

function PersonalityTrait()
{
	this.category = prius; 
	this.proficiency;
}
