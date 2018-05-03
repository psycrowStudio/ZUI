define(['zuiRoot/common',
        'zuiRoot/types',
        'zuiRoot/logger'], function(Common, Types, Logger){
    var _this = this;

    return function(objValues,  options){   
        var trigger = new (_prius.extend(generateScope(objValues)))();
        
        options = options ? options : {};

        // handling template & template settings
        switch(options.template) {
            case "timer-basic":
                //add
                trigger.addLinkage()
            break;
        }

        
        return trigger;
    }
});
