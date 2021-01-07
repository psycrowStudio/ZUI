var OccupationFactory = {
	priusList: ["Host", "Psychic", "Server", "Coach", "Salesman", "Soldier", "Officer", "Crew", "Engineer", "Cook", "Doctor", "Fireman", "Detective", "Police", "Volunteer", "Socialite", "Investor", "Owner", "Musician", "Painter", "Actor", "Teacher", "Professor", "Artisan", "Scientist", "Navigator", "Academic", "Prospector", "Scavenger", "Pirate", "Raider", "Priest", "Speaker", "Lawyer", "Judge", "Elder", "Bard", "Hunter", "Fisherman", "Outlaw" ],

	GetRandom: function(){
		var rng = getRandomInt(0, priusList.length);
		return new Occupation(priusList[rng]);
	}
};
