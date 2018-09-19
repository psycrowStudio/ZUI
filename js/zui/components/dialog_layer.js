define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger', 'zuiRoot/types'], function(_, Backbone, Common, Logger, Types){
    
        //floating panel
        var _createPanel = function(settings) {
            var panel = Types.component.fab({  
                parentModel: this,
                parentElementSelector: '.dialogContainer',
                className:' zui-panel zui-dialog',
                template:'<div class="edge">\
                <div class="titleBar"><span class="title">'+settings.title+'</span>\
                <span class="buttons">\
                    <button class="dismissPanel">X</button></div>\
                </span>\
                <div class="content">'+settings.content+'</div>\
                <div class="footer"><span class="buttons">\
                        <button class="dismissPanel">X</button></div>\
                    </span>\
                </div>\
                </div>',
                events: {
                    'click .dismissPanel': function(e) {
                        console.log('Dismiss Panel', e, this.model);
                        this.model.parentModel.resolveDialog(this.model.get('id'));
                        return false;
                    }
                }
            });

            return panel;
        }

        return {
            addToPage: function(page){
                var prius = Types.component.fab({ 
                    id:'dialogLayer', 
                    parentModel: page,
                    className:' zui-hidden',
                    template:'<div class="overlay">\
                    <div class="dialogContainer"></div>\
                    </div>'
                });

                prius.triggerDialog = this.triggerDialog.bind(prius);
                prius.toggleOverlay = this.toggleOverlay.bind(prius);
                prius.resolveDialog = this.resolveDialog.bind(prius);

                return prius;
            },

            // INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleOverlay(true);
                var settings = {
                    title: 'Blank Dialog',
                    content: 'some test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content here'
                }
                var panel = _createPanel.call(this, settings);
                this.view.render();

            },
            toggleOverlay: function(state){ 
                if(state === true){
                    this.view.el.classList.remove('zui-hidden');
                }
                else if(state === false) {
                    this.view.el.classList.add('zui-hidden');
                }
                else {
                    this.view.el.classList.toggle('zui-hidden');
                }
                // var overlay = this.view.elremoving.querySelector('.overlay')
                // if(overlay){
                //     overlay.classList.toggle('bgClear');
                // }
            },
            resolveDialog: function(settings){
                //TODO remove dialog from DOM
                console.log('resolving dialog', settings);
                this.toggleOverlay(false);
            }
        }
    });


    //TYPES: blank, text input, text area, MC & bool, 
    //MOD: resizeable, movable, modal, KB only, 
    // MISC: fixed w/h, flex w/h, min/max w/h 