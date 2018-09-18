define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger', 'zuiRoot/types'], function(_, Backbone, Common, Logger, Types){
    
        return {
            addToPage: function(page){
                var prius = Types.component.fab({ 
                    id:'dialogLayer', 
                    parentModel: page,
                    className:' zui-hidden',
                    template:'<div class="overlay">\
                    <div class="dialogContainer"></div>\
                    </div>',
                    triggerDialog: function(settings){ },
                    toggleOverlay: function(state){ },
                });

                prius.triggerDialog = this.triggerDialog.bind(prius),
                prius.toggleOverlay = this.toggleOverlay.bind(prius)
                
                return prius;
            },

            // INSTANCE METHODS
            triggerDialog: function(settings){ this.view.el.classList.toggle('zui-hidden'); },
            toggleOverlay: function(state){ 
                var overlay = this.view.el.querySelector('.overlay')
                if(overlay){
                    overlay.classList.toggle('bgClear');
                }
            }
        }
    });