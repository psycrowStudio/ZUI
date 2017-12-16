window.rbss.factoryManager.addFactory("Actor", (function() {
	return {
		CollectionManager: (function()
		{
			var _actorCollection = Backbone.Collection.extend({
				model: window.rbss.modelManager.getModel('Actor')
			});

			var _collections = {};
			_collections['actorsLoaded'] = new _actorCollection();

			_collections['actorsLoaded'].fetch({
				url: './data/allActors.json',
				success: function() {
          			console.log("JSON file load was successful", _collections['actorsLoaded']);
				},
				error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
			});

			return {
				returnAllCollections()
				{
					return _collections;
				},
				returnNamedCollection(name)
				{
					if(_collections.hasOwnProperty(name))
					{
						return _collections[name];
					}
					else
					{
						return null;
					}
				}

			}	
		})(), 

		Random: function (count)
		{
			count = count === undefined ? 1 : count;

			if(count > 1)
			{
				var actors = [];
				for(var z = 0; z < count; z++)
				{
					//actors.push(new Actor());
					// this.SetRandomBaseAttributes(actors[z]);
					// this.SetRandomPersonality(actors[z]);
					// this.SetRandomDemographic(actors[z]);
					// this.SetRandomSkills(actors[z]);
					// this.SetRandomPersonality(actors[z]);
					// this.SetRandomLogBook(actors[z]);
					// this.SetRandomResources(actors[z]);
				}

				return actors;
			}
			else
			{
					//var actor = new Actor();
					// this.SetRandomBaseAttributes(actor);
					// this.SetRandomPersonality(actor);
					// this.SetRandomDemographic(actor);
					// this.SetRandomSkills(actor);
					// this.SetRandomPersonality(actor);
					// this.SetRandomLogBook(actor);
					// this.SetRandomResources(actor);
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

	};
})());