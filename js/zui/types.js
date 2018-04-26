define(['zuiRoot/models/ComponentModel',
    'zuiRoot/models/PageModel',
    'zuiRoot/models/EventModel',
    'zuiRoot/models/TriggerModel'
], function(componentModel, pageModel, eventModel, triggerModel){
    
    //TODO for each in arguements, apply ZUI common functions (unless already exists)

    return {
        Component : componentModel,
        Event: eventModel,
        Page: pageModel,
        Trigger: triggerModel
    }
});