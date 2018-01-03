define(['zuiRoot/models/ComponentModel',
    'zuiRoot/models/PageModel',
    'zuiRoot/models/EventModel',
    'zuiRoot/models/TriggerModel'
], function(componentModel, pageModel, eventModel, triggerModel){
    return {
        Component : componentModel,
        Event: eventModel,
        Page: pageModel,
        Trigger: triggerModel
    }
});