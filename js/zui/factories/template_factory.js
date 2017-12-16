define([''], function(){
   return function (settings) {
        //TODO track instances (within the models that instantiate them)
        var _builtinTemplates = {
            screen: _.template('<div class="zui-screen zui-invis"><div class="zui-message"><%= message %></div></div>')
            
            // (function(data){
            //     var _compile = _.template('<div class="zui-message"><%= message %></div>');
                
            //     return function(data)
            //     {
            //         var el = document.createElement('div');
            //         el.classList = 'zui-screen zui-invis';
            //         el.innerHTML = _compile(data);
            //         return el;
            //     }
            // })(),
            // spinner: function(){
            //     var el = document.createElement('div');
            //     el.classList = 'zui-spinner';
            //     return el;
            // }
        };

        //init routine

        


        // var _allModels = {};
        // var _loadingCount = 0;
        
        // var _templateSrc = {
            
        // };

        // //TODO convert this to its own promise service
        // function _loadAllModels (callback) {
        //     for(let key in _templateSrc) {
        //         let capture = _templateSrc[z];
        //        _loadingCount++;
        //         $.getScript( capture, function() {
        //             window.rbss.log.message(capture + ' loaded.');
                    
        //             --_loadingCount >= 0 ? _loadingCount : 0;
                    
        //             if(_loadingCount === 0) {
        //                 //done loading
        //                 if(callback && typeof callback === 'function')
        //                 {
        //                     callback();
        //                 }
        //             }
        //         });
        //     }
        // }


        return {
            get: function(type) {},
            use: function(type, data) {
                if(!_builtinTemplates.hasOwnProperty(type)) {
                    return null;
                }

                return _builtinTemplates[type](data);
            }
            //TODO create a register function / set

        }
    }
});