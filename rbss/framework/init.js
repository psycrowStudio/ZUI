//ROLE-BASE SCENARIO SIMULATOR (R.B.S.S.)

// requirejs.config({
//     paths: {
//         // rbss: 'js/framework/init.js'
//     }
// });

define([
    'zui', 
    //'models'
    //'factories'
    //'views'
    // logger
], 
function(
    zui
){ 

    // logger.subscribe('zui-all', 'zui-load', function(options) {
    //     logger.log('All ZUI modules loaded!', { tags: 'ZUI', logLevel:1 });
    // });
    var _rbss = {
        message: "hello world!"
    };


    return _rbss;
}
);




// window.rbss = new function(){};

// window.rbss.modelManager = (function() {
//     var _allModels = {};
//     var _loadingCount = 0;
//     var _frameworkModelsSrc = [
//         './js/framework/models/actor.model.bb.js'
//     ];

//     function _loadAllModels (callback)
//     {
//         for(let z = 0; z < _frameworkModelsSrc.length; z++)
//         {
//             let capture = _frameworkModelsSrc[z];
//            _loadingCount++;
//             $.getScript( capture, function()
//             {
//                 window.rbss.log.message(capture + ' loaded.');
//                 --_loadingCount >= 0 ? _loadingCount : 0;
                
//                 if(_loadingCount === 0)
//                 {
//                     //done loading
//                     if(callback && typeof callback === 'function')
//                     {
//                         callback();
//                     }
//                 }
//             });
//         }
//     }

//     //kicks off the loading process;
//     _loadAllModels (function(){
        
//         var afterFactoriesLoad = function()
//         {
            
//         };

//         window.rbss.factoryManager.loadAllFactories(afterFactoriesLoad);
        
//         window.rbss.viewManager.loadAllViews();

//     });

//     //TODO explore making these extended from a base model type
//     return {
//         getModel : function(name)
//         {
//             if(_allModels.hasOwnProperty(name))
//             {
//                 return _allModels[name];
//             }
//             else
//             {
//                 return null;
//             }
//         },
//         addModel : function(key, model)
//         {
//             // does not check if already exists.
//             _allModels[key] = model;
//         },

//         getLoadingCount : function()
//         {
//             return _loadingCount;
//         },

//         areAllModelsLoaded : function()
//         {
//             return _loadingCount === 0;
//         },

//         loadAllModels : function(callback)
//         {
//             _loadAllModels(callback);
//         }
//     }
// })();


// window.rbss.factoryManager = (function()
// {
//     var _allFactories = {};
//     var _loadingCount = 0;
//     var _frameworkFactoriesSrc = [
//             './js/framework/factories/actor.factory.bb.js'
//         ];

//     function _loadAllFactories (callback)
//     {
//         for(let z = 0; z < _frameworkFactoriesSrc.length; z++)
//         {
//             let capture = _frameworkFactoriesSrc[z];
//            _loadingCount++;
//             $.getScript( capture, function()
//             {
//                 window.rbss.log.message(capture + ' loaded.');
//                  --_loadingCount >= 0 ? _loadingCount : 0;
                
//                 if(_loadingCount === 0)
//                 {
//                     //done loading
//                     if(callback && typeof callback === 'function')
//                     {
//                         callback();
//                     }
//                 }
//             });
//         }
//     }

//     return {
//         getFactory : function(name)
//         {
//             if(_allFactories.hasOwnProperty(name))
//             {
//                 return _allFactories[name];
//             }
//             else
//             {
//                 return null;
//             }
//         },
//         addFactory : function(key, model)
//         {
//             /// does not check if already exists.
//             _allFactories[key] = model;
//         },

//         getLoadingCount : function()
//         {
//             return _loadingCount;
//         },

//         areAllFactoriesLoaded : function()
//         {
//             return _loadingCount === 0;
//         },

//         loadAllFactories : function(callback)
//         {
//             _loadAllFactories(callback);
//         }
//     }
// })();


// window.rbss.viewManager = (function()
// {
//     var _allViews = {};
//     var _loadingCount = 0;
//     var _frameworkViewsSrc = [
//         './js/framework/views/actor.view.bb.js'
//         ];

//     function _loadAllViews(callback)
//     {
//         for(let z = 0; z < _frameworkViewsSrc.length; z++)
//         {
//             let capture = _frameworkViewsSrc[z];
//             _loadingCount++;
//             $.getScript( capture, function()
//             {
//                 window.rbss.log.message(capture + ' loaded.');
//                 _loadingCount = --_loadingCount >= 0 ? _loadingCount : 0;
                
//                 if(_loadingCount === 0)
//                 {
//                     //done loading
//                     if(callback && typeof callback === 'function')
//                     {
//                         callback();
//                     }
//                 }
//             });
//         }
//     }

//     return {
//         getView : function(name)
//         {
//             if(_allViews.hasOwnProperty(name))
//             {
//                 return _allViews[name];
//             }
//             else
//             {
//                 return null;
//             }
//         },
//         addView : function(key, model)
//         {
//             // does not check if already exists.
//             _allViews[key] = model;
//         },

//         getLoadingCount : function()
//         {
//             return _loadingCount;
//         },

//         areAllViewsLoaded : function()
//         {
//             return _loadingCount === 0;
//         },

//         loadAllViews : function(callback)
//         {
//             _loadAllViews(callback);
//         }
//     }
// })();

// //TODO EXTENSIONS (EXTENDING CLASSES FROM ABOVE)

// window.rbss.log = (function() {
//     var logPrefix = '[RBSS]:';

//     return {
//         message : function (msg) {
//             console.log(logPrefix + ' ' + msg);
//         },

//         warn : function(msg) {
//             console.warn(logPrefix + ' ' + msg);
//         },

//         error : function(msg) {
//             console.error(logPrefix + ' ' + msg);
//         }
//     }
// })();
