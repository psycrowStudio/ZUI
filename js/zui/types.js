define(['zuiRoot/models/ComponentModel',
    'zuiRoot/models/PageModel',
    'zuiRoot/models/TriggerModel'
], function(componentModel, pageModel, triggerModel){
    
    //TODO for each in arguements, apply ZUI common functions (unless already exists)

    return {
        Component : componentModel,
        Page: pageModel,
        Trigger: triggerModel
    }
});