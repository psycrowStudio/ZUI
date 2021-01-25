var ContractsFactory = {
	priusList: ["Guard", "Collection", "Mystery / Puzzle", "Supply Line", "PointOfInterest", "Donation", "Salvage", "RoadBuilding", "SendAMessage", "GetAResponse", "Bounty", "Smuggle", "Investment", "Reconnaissance", "Survey", ],

	GetRandom: function(){
		var rng = getRandomInt(0, priusList.length);
		return new Contract(priusList[rng]);
	}

};

