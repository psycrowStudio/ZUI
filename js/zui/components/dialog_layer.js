define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger', 'zuiRoot/types'], function(_, Backbone, Common, Logger, Types){
    
        function _generateTemplate(){
            return '<div class="edge">\
            <div class="titleBar"><span class="title"> <%= get("dialogTitle") %> </span>\
            <span class="buttons">\
                <button class="dismissPanel" title="Escape">X</button></div>\
            </span>\
            <div class="content"> <%= get("dialogContent") %> </div>\
            <div class="footer"><span class="buttons">\
                    <button class="dismissPanel" title="Escape">Cancel</button>\
                    <button class="confirmPanel" title="Continue">Accept</button>\
                </span>\
            </div>\
            </div>';
        }

        //floating panel
        var _createPanel = function(settings) {
            var panel = Types.component.fab({  
                parentModel: this,
                parentElementSelector: '.dialogContainer',
                className:' zui-panel zui-dialog',
                template: _generateTemplate(),
                events: {
                    'click .dismissPanel': function(e) {
                        console.log('Dismiss Panel', e, this.model);
                        var settings = {
                            isResolved: false
                        };

                        this.model.parentModel.resolveDialog(this.model.get('id'), settings);
                        return false;
                    },
                    'click .confirmPanel': function(e) {
                        console.log('Confirm Panel', e, this.model);
                        var settings = { 
                            isResolved: true
                        };

                        this.model.parentModel.resolveDialog(this.model.get('id'), settings);
                        return false;
                    }
                }
            });

            //TODO need a more modular way to do this.
            panel.set('dialogTitle', settings.title);
            panel.set('dialogContent', settings.content);

            // for(var v in settings.viewAttributes) {
            //     if(settings.viewAttributes.hasOwnProperty(v)) {
            //         panel.set(v, settings.viewAttributes[v]);
            //     }               
            // }

            return panel;
        }

        var _activeDialogs = [];

        return {
            addToPage: function(page){
                var prius = Types.component.fab({ 
                    id:'dialogLayer', 
                    parentModel: page,
                    className:'zui-hidden',
                    template:'<div class="overlay">\
                    <div class="dialogContainer"></div>\
                    </div>'
                });

                prius.triggerDialog = this.triggerDialog.bind(prius);
                prius.toggleOverlay = this.toggleOverlay.bind(prius);
                prius.resolveDialog = this.resolveDialog.bind(prius);

                return prius;
            },

            // COMMON BOUND TO INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleOverlay(true);
                var settings = {
                    title: 'Blank Dialog',
                    content: 'some test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content heresome test content here'
                }
                var panel = _createPanel.call(this, settings);
                _activeDialogs.push(panel);
                this.view.render();
                
                //TODO start here
                var generator =  function(handle){
                    var promise = new Promise(function(resolve, reject){
                        handle.resolve = resolve;
                        handle.reject = reject;
                    });
                    panel.handle = handle;
                    return promise;
                } 

                var promise = Common.QuerablePromise.call(panel, generator);
                return promise;
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
            resolveDialog: function(id, settings){
                //TODO remove dialog from DOM
                console.log('resolving dialog', id, settings);
                var activeInstance = _activeDialogs.find(function(item){ return item.get('id') === id; });
                if(activeInstance && settings.isResolved) {
                    activeInstance.handle.resolve(settings);
                }
                else if (activeInstance && !settings.isResolved){
                    activeInstance.handle.reject(settings)
                } else {
                    activeInstance.handle.reject('Canceled');
                }

                if(activeInstance && activeInstance.view.el && activeInstance.view.el.parentNode){
                    activeInstance.view.el.parentNode.removeChild(activeInstance.view.el);
                }

                if(activeInstance){
                    _activeDialogs.splice(_activeDialogs.indexOf(activeInstance), 1);
                }
                
                if(_activeDialogs.length === 0){
                    this.toggleOverlay(false);
                }
            }
        }
    });
    //TYPES: blank, text input, text area, MC & bool, 
    //MOD: resizeable, movable, modal, KB only, 
    // MISC: fixed w/h, flex w/h, min/max w/h 