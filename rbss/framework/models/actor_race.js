define([
	'mod/text',
	'zuiRoot/logger',
	"rbssRoot/framework/models/talent",
	"rbssRoot/framework/models/trait",
],
function (
    mod_text,
	Logger,
	rbss_talent,
	rbss_trait
) {
	var MODULE_NAME = "rbss_model_actor_race";
	var MODEL_SINGULAR = "Actor Race";
	var MODEL_PLURAL = "Actor Race";

	//These are the default instance properties
	var _classDefaults =  {
		defaults: {
			'id': "",
			type : "New " + MODEL_SINGULAR,
			subtype: "",
			class:"",
			description:"",
			male_weight_range:"",
			male_height_range:"",
			female_weight_range:"",
			female_height_range:"",
			age_range:"",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
			talents : new Backbone.Collection(null, {
				model: rbss_talent
			}),
			traits : new Backbone.Collection(null, {
				model: rbss_trait
			})
			// history
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
			model_type: MODEL_SINGULAR,
			model_plural: MODEL_PLURAL,
			random: function () {
				return _default_collection.length > 0 ? _default_collection.at(mod_text.random.int(0, _default_collection.length-1)) : null;
			},
			random_name: function(race_attributes, gender){
				// name || class || subclass
				var race = _default_collection.findWhere(race_attributes);
				// DB lookup once established

				var fName = "";
				var lName = race.get('last_names').length > 0 ? race.get('last_names')[mod_text.random.int(0, race.get('last_names').length-1)] : "";
				if(race && (gender.toLowerCase() === "female" || gender.toLowerCase() === "f") &&  race.get('female_first_names').length > 0){
					fName = race.get('female_first_names')[mod_text.random.int(0, race.get('female_first_names').length-1)];
				}
				else if(race && race.get('male_first_names').length > 0){
					fName = race.get('male_first_names')[mod_text.random.int(0, race.get('male_first_names').length-1)];
				}

				return (fName + " " + lName).trim();
			},
			random_age : function(race_attributes){
				var race = _default_collection.findWhere(race_attributes);

				if(race && race.get('age_range')){
					var aRange = race.get('age_range').split('-');
					return mod_text.random.int(parseInt(aRange[0]),parseInt(aRange[1]));
				}
				else {
					return 0;
				}
			},
			random_body_size : function(race_attributes, gender){
				var race = _default_collection.findWhere(race_attributes);

				if(race && (gender.toLowerCase() === "female" || gender.toLowerCase() === "f") && race.get('female_height_range') && race.get('female_weight_range')) {
					var hRange = race.get('female_height_range').split('-');
					var wRange = race.get('female_weight_range').split('-');
					return {
						height: mod_text.random.int(parseInt(hRange[0]), parseInt(hRange[1])),
						weight: mod_text.random.int(parseInt(wRange[0]), parseInt(wRange[1]))
					};
				}
				else if(race && race.get('male_height_range') && race.get('male_weight_range')) {
					var hRange = race.get('male_height_range').split('-');
					var wRange = race.get('male_weight_range').split('-');
					return {
						height: mod_text.random.int(parseInt(hRange[0]), parseInt(hRange[1])),
						weight: mod_text.random.int(parseInt(wRange[0]), parseInt(wRange[1]))
					};
				}
				else {
					return null;
				}
			},
			default_collection: function(){
				return _default_collection;
			}
		};
	})();

	var _model = Backbone.Model.extend(_classDefaults, _static);
	
	// AFTER MODEL TYPE INSTANTIATED
	var _default_collection_json = [
		{
			type:"Humanoid",
			subtype:"Human",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
			male_weight_range:"100-300",
			male_height_range:"60-84",
			female_weight_range:"80-275",
			female_height_range:"48-78",
			age_range:"16-80",
		},
		{
			type:"Humanoid",
			subtype:"Dwarf",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: ["Arne", "Bjørn", "Eirik", "Geir", "Gisle", "Gunnar", "Harald",  "Håkon", "Inge", "Ivar", "Knut", "Leif", "Magnus", "Olav", "Rolf", "Sigurd", "Snorre", "Steinar", "Torstein", "Trygve", "Ulf", "Valdemar", "Vidar", "Yngve"],
			female_first_names: ["Astrid", "Brynhild", "Freydis", "Gudrun", "Gunnhild", "Gunnvor", "Hilde", "Ingrid", "Ragnhilid", "Ranveig", "Sigrid", "Sigrunn", "Siv", "Solveig", "Svanhild", "Torhild"],
			last_names: ["Albertsen", "Andréasson", "Bengtsson", "Danielsen", "Kron", "Karlsen", "Knutson", "Steensen", "Ostberg", "Prebensen", "Ericson", "Jakobsen", "Rask", "Solberg", "Vång", "Vinter"]
		},
		{
			type:"Humanoid",
			subtype:"Elf",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],

		},
		{
			type:"Humanoid",
			subtype:"Gnome",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],

		},
		{
			type:"Humanoid",
			subtype:"Goblinoid",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: ["Hudrurg", "Dulk", "Zrus", "Regrulk", "Cachorg", "Brokenleg", "Paleknuckles", "Shrilleyes", "Moldnose", "Baitworm"],
			female_first_names: ["Balnor", "Met", "Bandoyit", "Janvas", "Janvas", "Galnizut", "Peon", "Pinkeye", "Benteyes", "Widecheek", "Globcheek"],
			last_names: [],

		},
		{
			type:"Humanoid",
			subtype:"Kobold",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],

		},
		{
			type:"Humanoid",
			subtype:"Orc",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],

		},
		{
			type:"Humanoid",
			subtype:"Gnoll",
			class:"",
			description:"The main peoples of a fantasy gaming world, both civilized and savage, including humans and a tremendous variety of other species. They have language and culture, few if any innate magical abilities (though most humanoids can learn spellcasting), and a bipedal form. The most common humanoid races are the ones most suitable as player characters: humans, dwarves, elves, and halflings. Almost as numerous but far more savage and brutal, and almost uniformly evil, are the races of goblinoids (goblins, hobgoblins, and bugbears), orcs, gnolls, lizardfolk, and kobolds.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],

		},
		{
			type:"Aberration",
			subtype:"",
			class:"",
			description:"Utterly alien beings. Many of them have innate magical abilities drawn from the creature's alien mind rather than the mystical forces of the world. The quintessential aberrations are aboleths, and slaadi.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Beast",
			subtype:"",
			class:"",
			description:"Nonhumanoid creatures that are a natural part of the fantasy ecology. Some of them have magical powers, but most are unintelligent and lack any society or language. Beasts include all varieties of ordinary animals, dinosaurs, and giant versions of animals.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Celestial",
			subtype:"",
			class:"",
			description:"Creatures native to the Upper Planes. Many of them are the servants of deities, employed as messengers or agents in the mortal realm and throughout the planes. Celestials are good by nature, so the exceptional celestial who strays from a good alignment is a horrifying rarity. Celestials include angels, couatls, and pegasi.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Construct",
			subtype:"",
			class:"",
			description:"Made, not born. Some are programmed by their creators to follow a simple set of instructions, while others are imbued with sentience and capable of independent thought. Golems are the iconic constructs. Many creatures native to the outer plane of Mechanus, such as modrons, are constructs shaped from the raw material of the plane by the will of more powerful creatures.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Dragon",
			subtype:"",
			class:"",
			description:"Large reptilian creatures of ancient origin and tremendous power. True dragons, including the good metallic dragons and the evil chromatic dragons, are highly intelligent and have innate magic. Also in this category are creatures distantly related to true dragons, but less powerful, less intelligent, and less magical, such as wyverns and pseudodragons.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Elemental",
			subtype:"",
			class:"",
			description:"Creatures native to the elemental planes. Some creatures of this type are little more than animate masses of their respective elements, including the creatures simply called elementals. Others have biological forms infused with elemental energy. The races of genies, including djinn and efreet, form the most important civilizations on the elemental planes. Other elemental creatures include azers, invisible stalkers, and water weirds",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Fey",
			subtype:"",
			class:"",
			description:"Magical creatures closely tied to the forces of nature. They dwell in twilight groves and misty forests. In some worlds, they are closely tied to the Feywild, also called the Plane of Faerie. Some are also found in the Outer Planes, particularly the planes of Arborea and the Beastlands. Fey include dryads, pixies, and satyrs.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Fiend",
			subtype:"",
			class:"",
			description:"Creatures of wickedness that are native to the Lower Planes. A few are the servants of deities, but many more labor under the leadership of archdevils and demon princes. Evil priests and mages sometimes summon fiends to the material world to do their bidding. If an evil celestial is a rarity, a good fiend is almost inconceivable. Fiends include demons, devils, hell hounds, rakshasas, and yugoloths.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Giant",
			subtype:"",
			class:"",
			description:"Tower over humans and their kind. They are humanlike in shape, though some have multiple heads (ettins) or deformities (fomorians). The six varieties of true giant are hill giants, stone giants, frost giants, fire giants, cloud giants, and storm giants. Besides these, creatures such as ogres and trolls are giants.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Monstrosity",
			subtype:"",
			class:"",
			description:"Monsters in the strictest sense--frightening creatures that are not ordinary, not truly natural, and almost never benign. Some are the results of magical experimentation gone awry (such as owlbears), and others are the product of terrible curses (including minotaurs). They defy categorization, and in some sense serve as a catch-all category for creatures that don't fit into any other type.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Ooze",
			subtype:"",
			class:"",
			description:"Gelatinous creatures that rarely have a fixed shape. They are mostly subterranean, dwelling in caves and dungeons and feeding on refuse, carrion, or creatures unlucky enough to get in their way. Black puddings and gelatinous cubes are among the most recognizable oozes.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Plant",
			subtype:"",
			class:"",
			description:"Vegetable creatures, not ordinary flora. Most of them are ambulatory, and some are carnivorous. The quintessential plants are the shambling mound and the treant. Fungal creatures such as the gas spore and the myconid also fall into this category.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		},
		{
			type:"Undead",
			subtype:"",
			class:"",
			description:"Once-living creatures brought to a horrifying state of undeath through the practice of necromantic magic or some unholy curse. Undead include walking corpses, such as vampires and zombies, as well as bodiless spirits, such as ghosts and specters.",
			male_first_names: [],
			female_first_names: [],
			last_names: [],
		}
	];

	var _default_collection = new Backbone.Collection(_default_collection_json, {
		model: _model
	});

	return _model;
});