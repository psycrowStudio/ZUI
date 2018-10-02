define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger', 'zuiRoot/types'], function(_, Backbone, Common, Logger, Types){
        var _builtinTemplates = {
            confirm: function(settings){
                
                return '<div class="edge zui-dialog-confirm">\
                    <div class="titleBar"><span class="title">Confimation</span><span class="buttons"></span></div>\
                    <div class="content"> <p>'+( settings.query || 'Do you want to continue?' ) + '</p></div>\
                    <div class="footer"><span class="buttons">\
                            <button class="confirmPanel">' + (settings.buttonLabels[0] || 'Yes' ) + '</button>\
                            <button class="dismissPanel">' + (settings.buttonLabels[1] || 'No' ) + '</button>\
                        </span>\
                    </div>\
                </div>';
            }
        };

        function _generateTemplate(settings){
            var template;
            switch(settings.type){
                case 'confirm':
                    template = _builtinTemplates['confirm'](settings.typeSettings);
                break;
                default:
                    template = '<div class="edge">\
                        <div class="titleBar"><span class="title"> <%= get("dialogTitle") %> </span>\
                        <span class="buttons">\
                            <button class="dismissPanel" title="Escape">X</button>\
                        </span>\</div>\
                        <div class="content"> <%= get("dialogContent") %> </div>\
                        <div class="footer"><span class="buttons">\
                                <button class="dismissPanel" title="Escape">Cancel</button>\
                                <button class="confirmPanel" title="Continue">Accept</button>\
                            </span>\
                        </div>\
                    </div>';
            }
            
            return template
        }

        function _move(x,y) {
            var rawX =  x;
            rawX = rawX < 0 ? 0 : rawX;
            rawX = rawX > window.innerWidth - this.view.el.offsetWidth ? window.innerWidth - this.view.el.offsetWidth : rawX;


            var rawY = y;
            rawY = rawY < 0 ? 0 : rawY;
            rawY = rawY > window.innerHeight - this.view.el.offsetHeight ? window.innerHeight - this.view.el.offsetHeight : rawY;

            this.view.el.style.left = rawX + "px";
            this.view.el.style.top  = rawY + "px";
        }

        function _mouseMoveHandler(e) {
            e = e || window.event;
        
            if(!this.get('isDragging')){ return true };
        
            console.log('dragging!');

            var offsetX = this.get('offsetX');
            var offsetY = this.get('offsetY');

            var x = e.clientX; //_mouseX(e);
            var y = e.clientY;//_mouseY(e);
            if (x != offsetX || y != offsetY) {
                _move.call(this, x - offsetX, y - offsetY);
                offsetX = x;
                offsetY = y;
            }
            return false;
        };

        function _startDrag(e) {
            e = e || window.event;
      
            var rect = this.view.el.getBoundingClientRect();
            console.log('starting drag...', rect);
            
            this.set('offsetX', e.clientX - rect.left);
            this.set('offsetY', e.clientY - rect.top);
            this.set('isDragging', true);
            var _scope = this;

            this.parentModel.view.el.onmousemove = function(ev){
                _mouseMoveHandler.call(_scope, ev);
                return false;
            };

            this.parentModel.view.el.onmouseup = function(ev){
                _stopDrag.call(_scope, ev);
                return false;
            };
            
            return false;
        }

        var _stopDrag = function () {
            this.set('isDragging', false);      
      
            console.log('stopping drag...');
            this.parentModel.view.el.onmousemove = null;
            this.parentModel.view.el.onmouseup = null;
            return false;
        }

        //floating panel
        var _createPanel = function(settings) {
            var panel = Types.component.fab({  
                parentModel: this,
                parentElementSelector: '.dialogContainer',
                className:' zui-panel zui-dialog zui-drag',
                template: _generateTemplate(settings),
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
                    },
                    'mousedown .titleBar' : function(e) {
                        console.log('TitleBar held', this);
                        if(this.el.classList.contains('zui-drag')){
                            _startDrag.call(this.model,e);
                        }
                    },
                    'mousedown': function(e){
                        console.log('activating dialog:', this.model.get('id'));
                    },
                    'click': function(e) {
                        if(e.target.classList.contains('zui-panel')){
                            console.log('Resize Panel');
                        }
                        
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
                    </div>',
                    events:{
                        // 'mouseup' : function(e) {
                        //     _stopDrag.call(this.model,e);
                        // },
                        'click' : function(e) {
                            if(e.target.classList.contains('dialogContainer')){
                                console.log('deactivating non-modal dialogs...');
                            }
                        },

                    }
                });

                prius.triggerDialog = this.triggerDialog.bind(prius);
                prius.toggleOverlay = this.toggleOverlay.bind(prius);
                prius.resolveDialog = this.resolveDialog.bind(prius);

                return prius;
            },

            // COMMON BOUND TO INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleOverlay(true);
                var panel = _createPanel.call(this, settings);
                _activeDialogs.push(panel);
                this.view.render();
                

                //APPLY MODIFIERS:
                panel.set('isDragging', false);
                panel.set('offsetX', 0);
                panel.set('offsetY', 0);
                panel.view.el.style.left = (window.innerWidth /2 - panel.view.el.offsetWidth /2) + 'px';
                panel.view.el.style.top = (window.innerHeight /2 - panel.view.el.offsetHeight /2) + 'px';

                
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