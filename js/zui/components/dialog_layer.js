define([
    'zuiRoot/common',
    'zuiRoot/logger', 
    'zuiRoot/types',
    'mod/dom_helper',
    "zuiRoot/view_templates/dialogs",
], 
    function(
        Common, 
        Logger, 
        Types,
        mod_dom,
        dialogs
    ){
        var MODULE_NAME = "zui_dialog_layer";

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
                    template = dialogs.templates['confirm'].compile(settings.typeSettings);
                break;
                case 'mc':
                    template = dialogs.templates['mc'].compile(settings.typeSettings);
                break;
                case 'inputField':
                    template = dialogs.templates['input'].compile(settings.typeSettings);
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
            rawX = rawX > window.innerWidth - this.el.offsetWidth ? window.innerWidth - this.el.offsetWidth : rawX;

            var rawY = y;
            rawY = rawY < 0 ? 0 : rawY;
            rawY = rawY > window.innerHeight - this.el.offsetHeight ? window.innerHeight - this.el.offsetHeight : rawY;

            this.el.style.left = rawX + "px";
            this.el.style.top  = rawY + "px";
        }

        function _mouseMoveHandler(e) {
            e = e || window.event;
        
            if(!this.isDragging){ return true };
        
            console.log('dragging!');

            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

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
      
            var rect = this.el.getBoundingClientRect();
            console.log('starting drag...', rect);
            
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;
            this.isDragging = true;
            var _scope = this;

            this.parentView.el.onmousemove = function(ev){
                _mouseMoveHandler.call(_scope, ev);
                return false;
            };

            this.parentView.el.onmouseup = function(ev){
                _stopDrag.call(_scope, ev);
                return false;
            };
            
            return false;
        }

        var _stopDrag = function () {
            this.isDragging = false;      
      
            console.log('stopping drag...');
            this.parentView.el.onmousemove = null;
            this.parentView.el.onmouseup = null;
            return false;
        }

        //TODO add in a check for minimum size (stored on model?)
        var _resizePanel = function(direction, e){
            e = e || window.event;
        
            if(!this.isResizing){ return true };      
            var resizeX = this.resizeMouseX;
            var resizeY = this.resizeMouseY;

            var originalW = this.resizeW;
            var originalH = this.resizeH;
            var originalLeft = this.resizeX;
            var originalTop = this.resizeY;

            var _adustEast = function(){
                var diffX = e.clientX - resizeX;
                this.el.style.width = (originalW + diffX) + 'px';
            };

            var _adustWest = function(){
                var diffX = resizeX - e.clientX;
                this.el.style.left = (originalLeft - diffX) + 'px';
                this.el.style.width = (originalW + diffX) + 'px';
            };

            var _adjustNorth = function(){
                var diffY = resizeY - e.clientY;
                this.el.style.top = (originalTop - diffY) + 'px';
                this.el.style.height = (originalH + diffY) + 'px';
            };

            var _adjustSouth = function(){
                var diffY = e.clientY - resizeY;
                this.el.style.height = (originalH + diffY) + 'px';
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
      
            var rect = this.el.getBoundingClientRect();
            this.resizeMouseX = e.clientX;
            this.resizeMouseY = e.clientY;
            this.resizeX = rect.left;
            this.resizeY = rect.top;
            this.resizeW = rect.width;
            this.resizeH = rect.height;
            this.isResizing = true;

            var _scope = this;
            this.parentView.el.onmousemove = function(ev){
                _resizePanel.call(_scope, direction, ev);
                return false;
            };

            this.parentView.el.onmouseup = function(ev){
                _stopResizePanel.call(_scope);
                return false;
            };
        };

        var _stopResizePanel = function(){
            console.log('Stopping Resize...');
            this.isResizing = false;
            this.parentView.el.onmousemove = null;
            this.parentView.el.onmouseup = null;
            return false;
        };

        var _panelEval = function(event){
            var settings = { isResolved: false };
            switch(this.dialogType){
                case 'mc':
                settings.isResolved = true;    
                settings.data = event.target.getAttribute('data-value');
                break;
                case 'inputField':
                    settings.isResolved = true;    
                    inputField = this.el.querySelector('.dialog-input');
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
            var panel = Types.view.fab({  
                parent: this,
                insertionSelector: '.dialogContainer',
                classes: ['zui-panel', 'zui-dialog', 'zui-drag'],
                template: _generateTemplate(settings),
                events: {
                    // 'zui-dialog-resolution': function(e) {

                    // },
                    // 'zui-dialog-rejection': function(e) {
                        
                    // },
                    'keypress input': function(e){
                        if(e.keyCode === 13)
                        {
                            console.log('Eval Panel', e, this);
                            var settings = _panelEval.call(this, e) || { isResolved: false };
                            
                            if(!settings.abort){
                                this.parentView.resolveDialog(this.id, settings);
                            }
                            
                            return false;
                        }
                    },

                    'click .panelResult': function(e) {
                        console.log('Eval Panel', e, this);
                        var settings = _panelEval.call(this, e) || { isResolved: false };
                        
                        // have a check if continue (ex failed input validation)
                        if(!settings.abort){
                            this.parentView.resolveDialog(this.id, settings);
                        }
                        
                        return false;
                    },
                    'click .dismissPanel': function(e) {
                        console.log('Dismiss Panel', e, this);
                        var settings = {
                            isResolved: false
                        };

                        this.parentView.resolveDialog(this.id, settings);
                        return false;
                    },
                    'click .confirmPanel': function(e) {
                        console.log('Confirm Panel', e, this);
                        var settings = { 
                            isResolved: true
                        };

                        this.parentView.resolveDialog(this.id, settings);
                        return false;
                    },
                    'mousedown .titleBar' : function(e) {
                        if(this.el.classList.contains('zui-drag')){
                            _startDrag.call(this,e);
                        }
                    },
                    'mousedown': function(e){
                        this.parentView.activateDialog(this.id);
                    },
                    'mousedown .resize-N': function(e) {
                        _startResizePanel.call(this,'N', e);
                    },
                    'mousedown .resize-NE': function(e) {
                        _startResizePanel.call(this,'NE', e);
                    },
                    'mousedown .resize-NW': function(e) {
                        _startResizePanel.call(this,'NW', e); 
                    },
                    'mousedown .resize-S': function(e) {
                        _startResizePanel.call(this, 'S', e); 
                    },
                    'mousedown .resize-SE': function(e) {
                        _startResizePanel.call(this,'SE', e);  
                    },
                    'mousedown .resize-SW': function(e) {
                        _startResizePanel.call(this,'SW', e);
                    },
                    'mousedown .resize-E': function(e) {
                        _startResizePanel.call(this,'E', e);
                    },
                    'mousedown .resize-W': function(e) {
                        _startResizePanel.call(this,'W', e);
                    }
                }
            });

            //TODO need a more modular way to do this.
            panel.dialogType = settings.type;
            panel.dialogTitle = settings.title;
            panel.dialogContent = settings.content;

            return panel;
        };

        var _activeDialogs = [];
        var _active;
        var _prius;
        return {
            current: function(){ return _prius; },
            addToPage: function(page){
                _prius = Types.view.fab({ 
                    id:'dialogLayer', 
                    parent: page,
                    classes: ['zui-hidden'],
                    template:'<div class="overlay">\
                    <div class="dialogContainer"></div>\
                    </div>',
                    events:{
                        // 'mouseup' : function(e) {
                        //     _stopDrag.call(this,e);
                        // },
                        'click' : function(e) {
                            if(e.target.classList.contains('dialogContainer')){
                                console.log('deactivating non-modal dialogs...');
                                this.activateDialog();
                            }
                        },

                    }
                });

                _prius.triggerDialog = this.triggerDialog.bind(_prius);
                _prius.toggleOverlay = this.toggleOverlay.bind(_prius);
                _prius.resolveDialog = this.resolveDialog.bind(_prius);
                _prius.activateDialog = this.activateDialog.bind(_prius);

                return _prius;
            },

            // COMMON BOUND TO INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleOverlay(true);
                
                var panel = _createPanel.call(this, settings);
                _activeDialogs.push(panel);
                this.activateDialog(panel.id);

                this.render();
                //APPLY MODIFIERS:
                panel.isDragging = false
                panel.offsetX = 0;
                panel.offsetY = 0;
                panel.el.style.left = (window.innerWidth /2 - panel.el.offsetWidth /2) + 'px';
                panel.el.style.top = (window.innerHeight /2 - panel.el.offsetHeight /2) + 'px';
                
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
                    this.el.classList.remove('zui-hidden');
                }
                else if(state === false) {
                    this.el.classList.add('zui-hidden');
                }
                else {
                    this.el.classList.toggle('zui-hidden');
                }
            },
            resolveDialog: function(id, settings){
                //TODO remove dialog from DOM
                console.log('resolving dialog', id, settings);
                var activeInstance = _activeDialogs.find(function(item){ return item.id === id; });
                if(activeInstance && settings.isResolved) {
                    activeInstance.handle.resolve(settings);
                }
                else if (activeInstance && !settings.isResolved){
                    activeInstance.handle.reject(settings)
                }

                if(activeInstance && activeInstance.el && activeInstance.el.parentNode){
                    activeInstance.el.parentNode.removeChild(activeInstance.el);
                }

                if(activeInstance){
                    activeInstance.parentView.removeView(activeInstance);
                    _activeDialogs.splice(_activeDialogs.indexOf(activeInstance), 1);
                }
                
                if(_activeDialogs.length === 0){
                    this.toggleOverlay(false);
                }
            },
            activateDialog: function(id){
                if(!id) {
                    if(_active)
                    {
                        console.log('Deactivating:', _active.id);
                        _active.el.classList.remove('active');
                    }
                    _active = null;
                }
                else {
                    
                    var next = _activeDialogs.find(function(item){ return item.id === id; });
                    if(next && next != _active){
                        console.log('Activating:', id);
                        if(_active)
                        {
                            _active.el.classList.remove('active');
                        }
                        
                        next.el.classList.add('active');
                        _active = next;
                    }
                }
            }
        };
    });
    //TYPES: blank, text input, text area, MC & bool, 
    //MOD: resizeable, movable, modal, KB only, 
    // MISC: fixed w/h, flex w/h, min/max w/h 