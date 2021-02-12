define([
    'zuiRoot/common',
    'zuiRoot/logger', 
    'zuiRoot/types',
    'mod/dom_helper',
    'mod/animation',
    "zuiRoot/view_templates/dialogs",
], 
    function(
        Common, 
        Logger, 
        Types,
        mod_dom,
        mod_animation,
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
                case 'loading':
                    template = dialogs.templates['loading'].compile(settings);
                break;
                default:
                    template = dialogs.templates['base'].compile(settings.typeSettings);
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

        function _stopDrag() {
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

        // Dialog logic helpers
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

        var _removeDialog = function (id) {
            for (var z = 0; z < openDialogs.length; z++) {
                if (openDialogs[z].id === id) {
                    openDialogs.splice(z, 1);
                    break;
                }
            }

            var d = dialogLayer.querySelector('#' + id);
            if (d) {
                if (d.classList.contains(LOADING_DIALOG_CLASS) && loadingCount === 1) {
                    dialogLayer.removeChild(d);
                    loadingCount--;
                } else if (d.classList.contains(LOADING_DIALOG_CLASS)) {
                    loadingCount--;
                    //return;
                } else {
                    dialogLayer.removeChild(d);
                }
            }

            if (activeDialog && activeDialog.id === id) {
                activeDialog = null;
            }

            if (openDialogPromises.hasOwnProperty(id)) {
                // TODO unsure if this will get cleaned up automatically, rejecting it for now with false to signal canceled
                openDialogPromises[id].reject(false);
                delete openDialogPromises[id];
            }

            //if (openDialogs.length === 0) {
            //    _toggleLayer(false);
            //}
            var allDialogs = Array.from(document.querySelectorAll('.' + BASE_DIALOG_CLASS));
            if (allDialogs.length === 0) {
                _toggleLayer(false);
                loadingCount = 0;
                openDialogs = [];
                // reject promises?
            }
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

        var LOADING_DIALOG_CLASS = "zui-dialog-loading";

        var _activeDialogs = [];
        var loadingCount = 0;
        var _active;
        var _activeLoading;
        var _prius;

        return {
            current: function(){ return _prius; },
            addToPage: function(page){
                _prius = Types.view.fab({ 
                    id:'dialogLayer', 
                    parent: page,
                    classes: ['zui-hidden'],
                    template:'<div class="dialogContainer overlay-bg"></div>',
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
                _prius.toggleLayer = this.toggleLayer.bind(_prius);
                _prius.resolveDialog = this.resolveDialog.bind(_prius);
                _prius.activateDialog = this.activateDialog.bind(_prius);

                // grid adds
                _prius.triggerLoading = this.triggerLoading.bind(_prius);
                _prius.clearLoading = this.clearLoading.bind(_prius);
                return _prius;
            },

            triggerLoading: function (loadingMessage) {
                var loadingContainer = _activeLoading ? _activeLoading : null;
                if (!loadingContainer) {
                    this.toggleLayer(true);

                    var dialog_container = document.querySelector('.dialogContainer');

                    loadingCount = 0;
                    
                    var loading_settings = {
                        type:'loading',
                        resizable: false,
                        label: loadingMessage ? loadingMessage : "Loading...",
                    };

                    loadingContainer = Types.view.fab({  
                        parent: this,
                        insertionSelector: '.dialogContainer',
                        classes: ["zui-dialog-base", LOADING_DIALOG_CLASS],
                        template: _generateTemplate(loading_settings),
                        events: { }
                    });
        
                    //TODO need a more modular way to do this.
                    loadingContainer.dialogType = loading_settings.type;

                    _activeLoading = loadingContainer;
                    loadingContainer.render();

                    var inBoundQ = [
                        {
                            element: dialog_container,
                            animation: 'fadeIn'
                        },
                        {
                            element: loadingContainer.el,
                            animation: 'fadeInDown'
                        },
                    ];
                    mod_animation.queueAnimationSequence(inBoundQ).then(function(res){
                        console.log('!! DONE !!', res);
                    });
                }

                loadingCount++;
                return loadingContainer.id;
            },
            clearLoading: function (clearAll) {
                if (loadingCount > 1 && !clearAll) {
                    loadingCount--;
                }
                else if (loadingCount === 1 || clearAll === true) {
                    var dialog_container = document.querySelector('.dialogContainer');
                    var outBoundQ = [
                        {
                            element: _activeLoading.el,
                            animation: 'fadeOutUp'
                        },
                        {
                            element: dialog_container,
                            animation: 'fadeOut'
                        },
                    ];
                    mod_animation.queueAnimationSequence(outBoundQ).then(function(res){
                        _activeLoading.el.parentNode.removeChild(_activeLoading.el);
                        _prius.removeView(_activeLoading);
                        
                        
                        _prius.toggleLayer(false);
                        _activeLoading = null;
                        loadingCount = 0;
                    });
                }
            },

            // COMMON BOUND TO INSTANCE METHODS
            triggerDialog: function(settings){ 
                this.toggleLayer(true);
                
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
            toggleLayer: function(state){ 
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
                    this.toggleLayer(false);
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