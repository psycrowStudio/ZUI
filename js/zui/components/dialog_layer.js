define(['underscore', 'backbone',
    'zuiRoot/common',
    'zuiRoot/logger', 'zuiRoot/types'], function(_, Backbone, Common, Logger, Types){
        var _builtinTemplates = {
            confirm: function(settings){
                var _confirmLabel = settings.buttonLabels[0] || 'Confirm';
                var _cancelLabel = settings.buttonLabels[1] || 'Cancel';
                
                return '<div class="edge zui-dialog-confirm">\
                    <div class="titleBar"><span class="title">Confimation</span><span class="buttons"></span></div>\
                    <div class="content"> <p>'+( settings.query || 'Do you want to continue?' ) + '</p></div>\
                    <div class="footer"><span class="buttons">\
                            <button class="confirmPanel">' + _confirmLabel + '</button>\
                            <button class="dismissPanel">' + _cancelLabel + '</button>\
                        </span>\
                    </div>\
                </div>';
            },
            inputField: function(settings){
                var _injectField = function(buttons){
                    return '<input class="dialog-input" type="'+(settings.subtype || 'text') +'" value="'+ (settings.defaultValue || '') +'" placeholder="' + (settings.placeholder || 'Text here') + '" title="'+ (settings.hoverText || '') +'" autofocus="true"/>';
                };

                var _confirmLabel = settings.buttonLabels[0] || 'Confirm';
                var _cancelLabel = settings.buttonLabels[1] || 'Cancel';
                //TODO validation from regex pattern
                // TODO min / max length 
                // validate call
                
                return '<div class="edge zui-dialog-confirm">\
                    <div class="titleBar"><span class="title">Input Field</span><span class="buttons"></span></div>\
                    <div class="content"> <h3>'+( settings.query || 'Do you want to continue?' ) + '</h3>\
                        <div class="field-box">'+ _injectField(settings) +'</div>\
                    </div>\
                    <div class="footer"><span class="buttons">\
                            <button class="panelResult">' +  _confirmLabel + '</button>\
                            ' + (!settings.buttonLabels[1] ? '' : '<button class="dismissPanel">' +  _cancelLabel + '</button>') +'\
                        </span>\
                    </div>\
                </div>';
            },
            mc: function(settings){
                
                var _injectButtons = function(buttons){
                    var buttonHTML = '';
                    if(buttons && Array.isArray(buttons)){
                        buttons.forEach(function(btn, i){
                            buttonHTML += '<button id="opt_'+i+'" class="mc-option panelResult" data-value="'+ btn.value +'">' + btn.label +'</button>';
                        });
                    }

                    return buttonHTML;
                };

                return '<div class="edge zui-dialog-confirm">\
                    <div class="titleBar"><span class="title">Multiple Choice</span><span class="buttons"><button class="dismissPanel" title="Escape">X</button></span></div>\
                    <div class="content"> <h3>'+( settings.query || 'Do you want to continue?' ) + '</h3>\
                        <div class="mc-box">' + _injectButtons(settings.buttons) + '</div>\
                    </div>\
                    <div class="footer"><span class="buttons"></div>\
                </div>';
            }
            // text
            // form
            // custom / blank
        };

        function _generateTemplate(settings){
            var panelHitBoxes = '<span draggable="false" class="resize-N"></span>\
                                 <span draggable="false" class="resize-NE"></span>\
                                 <span draggable="false" class="resize-E"></span>\
                                 <span draggable="false" class="resize-SE"></span>\
                                 <span draggable="false" class="resize-S"></span>\
                                 <span draggable="false" class="resize-SW"></span>\
                                 <span draggable="false" class="resize-W"></span>\
                                 <span draggable="false" class="resize-NW"></span>';
            var template;
            switch(settings.type){
                case 'confirm':
                    template = _builtinTemplates['confirm'](settings.typeSettings);
                break;
                case 'mc':
                    template = _builtinTemplates['mc'](settings.typeSettings);
                break;
                case 'inputField':
                    template = _builtinTemplates['inputField'](settings.typeSettings);
                break;
                default:
                    template = '<div class="edge">\
                        <div class="titleBar"><span class="title"></span>\
                        <span class="buttons">\
                            <button class="dismissPanel" title="Escape">X</button>\
                        </span>\</div>\
                        <div class="content"></div>\
                        <div class="footer"><span class="buttons">\
                                <button class="dismissPanel" title="Escape">Cancel</button>\
                                <button class="confirmPanel" title="Continue">Accept</button>\
                            </span>\
                        </div>\
                    </div>';
            }
            
            return settings.resizable === false ? template : panelHitBoxes + template;
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

        //TODO add in a check for minimum size (stored on model?)
        var _resizePanel = function(direction, e){
            e = e || window.event;
        
            if(!this.get('isResizing')){ return true };      
            var resizeX = this.get('resizeMouseX');
            var resizeY = this.get('resizeMouseY');

            var originalW = this.get('resizeW');
            var originalH = this.get('resizeH');
            var originalLeft = this.get('resizeX');
            var originalTop = this.get('resizeY');

            var _adustEast = function(){
                var diffX = e.clientX - resizeX;
                this.view.el.style.width = (originalW + diffX) + 'px';
            };

            var _adustWest = function(){
                var diffX = resizeX - e.clientX;
                this.view.el.style.left = (originalLeft - diffX) + 'px';
                this.view.el.style.width = (originalW + diffX) + 'px';
            };

            var _adjustNorth = function(){
                var diffY = resizeY - e.clientY;
                this.view.el.style.top = (originalTop - diffY) + 'px';
                this.view.el.style.height = (originalH + diffY) + 'px';
            };

            var _adjustSouth = function(){
                var diffY = e.clientY - resizeY;
                this.view.el.style.height = (originalH + diffY) + 'px';
            };

            if(direction === 'E') {
                _adustEast.call(this);
            } 
            else if(direction === 'W') {
                _adustWest.call(this);
            } 
            else if(direction === 'N') {
                _adjustNorth.call(this);
            } 
            else if(direction === 'S') {
                _adjustSouth.call(this);
            }
            else if(direction === 'NE') {
                _adustEast.call(this);
                _adjustNorth.call(this);
            } 
            else if(direction === 'NW') {
                _adjustNorth.call(this);
                _adustWest.call(this);
            } 
            else if(direction === 'SE') {
                _adjustSouth.call(this);
                _adustEast.call(this);
            } 
            else if(direction === 'SW') {
                _adjustSouth.call(this);
                _adustWest.call(this);
            }
        };

        var _startResizePanel = function(direction, e){
            e = e || window.event;
      
            var rect = this.view.el.getBoundingClientRect();
            this.set('resizeMouseX', e.clientX);
            this.set('resizeMouseY', e.clientY);
            this.set('resizeX', rect.left);
            this.set('resizeY', rect.top);
            this.set('resizeW', rect.width);
            this.set('resizeH', rect.height);
            this.set('isResizing', true);

            var _scope = this;
            this.parentModel.view.el.onmousemove = function(ev){
                _resizePanel.call(_scope, direction, ev);
                return false;
            };

            this.parentModel.view.el.onmouseup = function(ev){
                _stopResizePanel.call(_scope);
                return false;
            };
        };

        var _stopResizePanel = function(){
            console.log('Stopping Resize...');
            this.set('isResizing', false);
            this.parentModel.view.el.onmousemove = null;
            this.parentModel.view.el.onmouseup = null;
            return false;
        };

        var _panelEval = function(event){
            var settings = { isResolved: false };
            switch(this.get('dialogType')){
                case 'mc':
                settings.isResolved = true;    
                settings.data = event.target.getAttribute('data-value');
                break;
                case 'inputField':
                    settings.isResolved = true;    
                    inputField = this.view.el.querySelector('.dialog-input');
                    settings.data = inputField.value;
                    if(!settings.data){
                         //TODO add custom eval & messaging
                        settings.abort = true;
                    }
                break;
            }

            return settings;
        };

        //floating panel
        var _createPanel = function(settings) {
            var panel = Types.component.fab({  
                parentModel: this,
                parentElementSelector: '.dialogContainer',
                className:' zui-panel zui-dialog zui-drag',
                template: _generateTemplate(settings),
                events: {
                    // 'zui-dialog-resolution': function(e) {

                    // },
                    // 'zui-dialog-rejection': function(e) {
                        
                    // },
                    'keypress input': function(e){
                        if(e.keyCode === 13)
                        {
                            console.log('Eval Panel', e, this.model);
                            var settings = _panelEval.call(this.model, e) || { isResolved: false };
                            
                            if(!settings.abort){
                                this.model.parentModel.resolveDialog(this.model.get('id'), settings);
                            }
                            
                            return false;
                        }
                    },

                    'click .panelResult': function(e) {
                        console.log('Eval Panel', e, this.model);
                        var settings = _panelEval.call(this.model, e) || { isResolved: false };
                        
                        // have a check if continue (ex failed input validation)
                        if(!settings.abort){
                            this.model.parentModel.resolveDialog(this.model.get('id'), settings);
                        }
                        
                        return false;
                    },
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
                        if(this.el.classList.contains('zui-drag')){
                            _startDrag.call(this.model,e);
                        }
                    },
                    'mousedown': function(e){
                        this.model.parentModel.activateDialog(this.model.get('id'));
                    },
                    'mousedown .resize-N': function(e) {
                        _startResizePanel.call(this.model,'N', e);
                    },
                    'mousedown .resize-NE': function(e) {
                        _startResizePanel.call(this.model,'NE', e);
                    },
                    'mousedown .resize-NW': function(e) {
                        _startResizePanel.call(this.model,'NW', e); 
                    },
                    'mousedown .resize-S': function(e) {
                        _startResizePanel.call(this.model, 'S', e); 
                    },
                    'mousedown .resize-SE': function(e) {
                        _startResizePanel.call(this.model,'SE', e);  
                    },
                    'mousedown .resize-SW': function(e) {
                        _startResizePanel.call(this.model,'SW', e);
                    },
                    'mousedown .resize-E': function(e) {
                        _startResizePanel.call(this.model,'E', e);
                    },
                    'mousedown .resize-W': function(e) {
                        _startResizePanel.call(this.model,'W', e);
                    }
                }
            });

            //TODO need a more modular way to do this.
            panel.set('dialogType', settings.type);
            panel.set('dialogTitle', settings.title);
            panel.set('dialogContent', settings.content);
    
            // for(var v in settings.viewAttributes) {
            //     if(settings.viewAttributes.hasOwnProperty(v)) {
            //         panel.set(v, settings.viewAttributes[v]);
            //     }               
            // }

            return panel;
        };

        var _activeDialogs = [];
        var _active;

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
                                this.model.activateDialog();
                            }
                        },

                    }
                });

                prius.triggerDialog = this.triggerDialog.bind(prius);
                prius.toggleOverlay = this.toggleOverlay.bind(prius);
                prius.resolveDialog = this.resolveDialog.bind(prius);
                prius.activateDialog = this.activateDialog.bind(prius);

                return prius;
            },

            // COMMON BOUND TO INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleOverlay(true);
                
                var panel = _createPanel.call(this, settings);
                _activeDialogs.push(panel);
                this.activateDialog(panel.get('id'));

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
            //trigger dialog series
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
                }

                if(activeInstance && activeInstance.view.el && activeInstance.view.el.parentNode){
                    activeInstance.view.el.parentNode.removeChild(activeInstance.view.el);
                }

                if(activeInstance){
                    activeInstance.parentModel.removeComponent(activeInstance);
                    _activeDialogs.splice(_activeDialogs.indexOf(activeInstance), 1);
                }
                
                if(_activeDialogs.length === 0){
                    this.toggleOverlay(false);
                }
            },
            activateDialog: function(id){
                if(!id) {
                    console.log('Deactivating:', _active.get('id'));
                    // TODO dont deactivate modals
                    if(_active)
                    {
                        _active.view.el.classList.remove('active');
                    }
                    _active = null;
                }
                else {
                    
                    var next = _activeDialogs.find(function(item){ return item.get('id') === id; });
                    if(next && next != _active){
                        console.log('Activating:', id);
                        if(_active)
                        {
                            _active.view.el.classList.remove('active');
                        }
                        
                        next.view.el.classList.add('active');
                        _active = next;
                    }
                }
            }
        };
    });
    //TYPES: blank, text input, text area, MC & bool, 
    //MOD: resizeable, movable, modal, KB only, 
    // MISC: fixed w/h, flex w/h, min/max w/h 