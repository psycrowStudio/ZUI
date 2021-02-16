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
            
            return template;
        }

        function _move(x,y) {
            var rawX =  x;
            rawX = rawX < this.box_x_zero ? this.box_x_zero : rawX;
            rawX = rawX > window.innerWidth - (this.offsetWidth - this.box_x_zero) ? window.innerWidth - (this.offsetWidth - this.box_x_zero) : rawX;

            var rawY = y;
            rawY = rawY < this.box_y_zero  ? this.box_y_zero : rawY;
            rawY = rawY > window.innerHeight - (this.offsetHeight - this.box_y_zero) ? window.innerHeight - (this.offsetHeight - this.box_y_zero) : rawY;

            this.style.left = rawX + "px";
            this.style.top  = rawY + "px";
        }

        function _mouseMoveHandler(e) {
            e = e || window.event;
        
            if(!this.isDragging){ return true };
        
            //console.log('dragging!');

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
      
            var dialog_body = this.el.querySelector('.zui-dialog-body');
            var body_rect = dialog_body.getBoundingClientRect();

            var dialog_panel = this.el.querySelector('.zui-base-panel');
            var panel_rect = dialog_panel.getBoundingClientRect();
            
            var dialog_view_rect = this.el.getBoundingClientRect();

            var rect = body_rect;
            
            dialog_panel.box_x_zero = -body_rect.left;
            dialog_panel.box_y_zero = -body_rect.top;

            console.log('starting drag...', rect);
            dialog_panel.offsetX = e.clientX - (panel_rect.left -body_rect.left);
            dialog_panel.offsetY = e.clientY - (panel_rect.top -body_rect.top);
            dialog_panel.isDragging = true;
            var _scope = this;

            this.el.onmousemove = function(ev){
                _mouseMoveHandler.call(dialog_panel, ev);
                return false;
            };

            this.el.onmouseup = function(ev){
                dialog_panel.isDragging = false;
                _stopDrag.call(_scope, ev);
                return false;
            };
            
            // TODO setup an automatic time-out for this drag
            // useful for when mouseup happens outside the window

            return false;
        }

        function _stopDrag() {
            this.isDragging = false;      
      
            console.log('stopping drag...');
            this.el.onmousemove = null;
            this.el.onmouseup = null;
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
                this.style.width = (originalW + diffX) + 'px';
            };

            var _adustWest = function(){
                var diffX = resizeX - e.clientX;
                this.style.left = (originalLeft - diffX) + 'px';
                this.style.width = (originalW + diffX) + 'px';
            };

            var _adjustNorth = function(){
                var diffY = resizeY - e.clientY;
                this.style.top = (originalTop - diffY) + 'px';
                this.innerEdge.style.height = (originalH + diffY) + 'px';
            };

            var _adjustSouth = function(){
                var diffY = e.clientY - resizeY;
                this.innerEdge.style.height = (originalH + diffY) + 'px';
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

            var dialog_panel = this.el.querySelector('.zui-base-panel');
            var panel_rect = dialog_panel.getBoundingClientRect();
            var inner_edge = this.el.querySelector('.edge');
        
            var rect = panel_rect;
            dialog_panel.resizeMouseX = e.clientX;
            dialog_panel.resizeMouseY = e.clientY;
            dialog_panel.resizeX = rect.left;
            dialog_panel.resizeY = rect.top;
            dialog_panel.resizeW = rect.width;
            dialog_panel.resizeH = rect.height;
            dialog_panel.isResizing = true;
            dialog_panel.innerEdge = inner_edge; // used to adjust height with our new grid layout

            var _scope = this;
            this.el.onmousemove = function(ev){
                _resizePanel.call(dialog_panel, direction, ev);
                return false;
            };

            this.el.onmouseup = function(ev){
                dialog_panel.isResizing = false;
                _stopResizePanel.call(_scope);
                return false;
            };
        };

        var _stopResizePanel = function(){
            console.log('Stopping Resize...');
            this.isResizing = false;
            this.el.onmousemove = null;
            this.el.onmouseup = null;
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

        var _createBaseDialog = function(settings) {
            // TODO specific logic for modal type behavior
            
            var base_settings = {
                typeSettings : {
                    glyph_code: settings.glyph_code ? settings.glyph_code : undefined,
                    title: settings.title ? settings.title : "",

                    title_bar_buttons: settings.title_bar_buttons ? settings.title_bar_buttons : [],
                    button_bar_buttons: settings.button_bar_buttons ? settings.button_bar_buttons : [],

                    draggable: settings.draggable === false ? false : true,
                    resizable: settings.resizable === false ? false : true,
                    showTitleBar: settings.showTitleBar === false ? false : true,
                    showTitleBarButtons: settings.showTitleBarButtons === false ? false : true,
                    showButtonBar: settings.showButtonBar === false ? false : true,
                    showOverlay: settings.showOverlay === false ? false : true
                }
            };
            
            var panel = Types.view.fab({  
                parent: this,
                insertionSelector: '.dialogContainer',
                classes: [
                    "zui-dialog",
                    (settings.draggable === false ? "" : "zui-drag"), 
                    (settings.showOverlay === false ? "" : "darken")],
                template: _generateTemplate(base_settings),
                events: {
                    'zui-dialog-resolution': function(e) {

                    },
                    'zui-dialog-rejection': function(e) {
                        
                    },
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
                        //TODO add ESC can close dialog
                    },
                    'click input': function(e){
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
                    'click .zui-dialog-title-bar button:not(.dismissPanel):not(.confirmPanel):not(.panelResult) ': function(e) {
                        console.log('Title Buttons', e, this);
                        //_prius.triggerBasic();
                        return false;
                    },
                    'click .zui-dialog-button-bar button:not(.dismissPanel):not(.confirmPanel):not(.panelResult) ': function(e) {
                        console.log('Title Buttons', e, this);

                        return false;
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
                    'mousedown .zui-dialog-title-bar' : function(e) {
                        if(this.el.classList.contains('zui-drag')){
                            _startDrag.call(this,e);
                        }
                    },
                    'mousedown .zui-base-panel': function(e){
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
                    template:'',
                    events:{
                        // 'mouseup' : function(e) {
                        //     _stopDrag.call(this,e);
                        // },
                        'click' : function(e) {
                            if(e.target.classList.contains('zui-dialog') || e.target.classList.contains('zui-dialog-body')){
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

                _prius.triggerBasic = this.triggerBasic.bind(_prius);

                // grid adds
                _prius.triggerLoading = this.triggerLoading.bind(_prius);
                _prius.clearLoading = this.clearLoading.bind(_prius);
                return _prius;
            },
            triggerLoading: function (loadingMessage) {
                var loadingContainer = _activeLoading ? _activeLoading : null;
                if (!loadingContainer) {
                    this.toggleLayer(true);

                    loadingCount = 0;
                    
                    var loading_settings = {
                        type:'loading',
                        resizable: false,
                        label: loadingMessage !== undefined ? loadingMessage : "Loading..."
                    };

                    loadingContainer = Types.view.fab({  
                        parent: this,
                        classes: ["zui-dialog", LOADING_DIALOG_CLASS, 'darken'],
                        template: _generateTemplate(loading_settings),
                        events: { }
                    });
        
                    //TODO need a more modular way to do this.
                    loadingContainer.dialogType = loading_settings.type;

                    _activeLoading = loadingContainer;
                    loadingContainer.render();

                    var dialog_container = loadingContainer.el;
                    var dialog_body = loadingContainer.el.querySelector('.zui-dialog-body');
                    var inBoundQ = [
                        {
                            element: dialog_container,
                            animation: 'fadeIn'
                        },
                        {
                            element: dialog_body,
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
                    var dialog_container = _activeLoading.el;
                    var dialog_body = _activeLoading.el.querySelector('.zui-dialog-body');
                    var outBoundQ = [
                        {
                            element: dialog_body,
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


            triggerBasic:function(){
                var _default_title_bar_buttons = [
                    {
                        label:"",
                        glyph_code:"cog",
                        hover_text: "Settings",
                        disabled: false,
                        onClick:function(view, ev){
                            console.log("Home", this);
                            var glyph = ev.currentTarget.querySelector('.glyph');
                            if(glyph.classList.contains('fa-' + this.glyph_code)){
                                glyph.classList.remove('fa-' + this.glyph_code);
                                glyph.classList.add('fa-cog');
                            }
                            else {
                                glyph.classList.remove('fa-cog');
                                glyph.classList.add('fa-' + this.glyph_code);
                            }
                        }
                    },
                    {
                        label:"",
                        glyph_code:"times",
                        hover_text: "Close",
                        disabled: false,
                        classes: ["dismissPanel"],
                        onClick:function(view, ev){
                            console.log("Home", this);
                            var glyph = ev.currentTarget.querySelector('.glyph');
                            if(glyph.classList.contains('fa-' + this.glyph_code)){
                                glyph.classList.remove('fa-' + this.glyph_code);
                                glyph.classList.add('fa-cog');
                            }
                            else {
                                glyph.classList.remove('fa-cog');
                                glyph.classList.add('fa-' + this.glyph_code);
                            }
                        }
                    },
                ];
    
                var _default_button_bar_buttons = [
                    {
                        label:"Edit",
                        glyph_code:"pencil",
                        hover_text: "Make Changes",
                        disabled: true,
                        onClick:function(view, ev){
                            console.log("Home", this);
                            var glyph = ev.currentTarget.querySelector('.glyph');
                            if(glyph.classList.contains('fa-' + this.glyph_code)){
                                glyph.classList.remove('fa-' + this.glyph_code);
                                glyph.classList.add('fa-cog');
                            }
                            else {
                                glyph.classList.remove('fa-cog');
                                glyph.classList.add('fa-' + this.glyph_code);
                            }
                        }
                    },
                    {
                        label:"OK",
                        glyph_code:"check",
                        hover_text: "Confirm",
                        disabled: false,
                        classes: ["confirmPanel"],
                        onClick:function(view, ev){
                            console.log("Home", this);
                            var glyph = ev.currentTarget.querySelector('.glyph');
                            if(glyph.classList.contains('fa-' + this.glyph_code)){
                                glyph.classList.remove('fa-' + this.glyph_code);
                                glyph.classList.add('fa-cog');
                            }
                            else {
                                glyph.classList.remove('fa-cog');
                                glyph.classList.add('fa-' + this.glyph_code);
                            }
                        }
                    },
                ];

                var base_settings = {
                    glyph_code:  "globe",
                    title: "BASE DIALOG",
                    title_bar_buttons: _default_title_bar_buttons,
                    button_bar_buttons: _default_button_bar_buttons,
                    resizable: false,
                    draggable: false
                }


                this.toggleLayer(true);
                var panel = _createBaseDialog.call(this, base_settings);
                
                _activeDialogs.push(panel);
                this.activateDialog(panel.id);
                panel.render();
                
                var dialog_container = panel.el;
                var dialog_body = panel.el.querySelector('.zui-base-panel');
                var inBoundQ = [
                    {
                        element: dialog_container,
                        animation: 'fadeIn'
                    },
                    {
                        element: dialog_body,
                        animation: 'fadeInDown'
                    },
                ];
                mod_animation.queueAnimationSequence(inBoundQ).then(function(res){
                    console.log('!! DONE !!', res);
                });


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

                var dialog_container = activeInstance.el;
                var dialog_body = activeInstance.el.querySelector('.zui-base-panel');
                var outBoundQ = [
                    {
                        element: dialog_body,
                        animation: 'fadeOutUp'
                    },
                    {
                        element: dialog_container,
                        animation: 'fadeOut'
                    },
                ];

                var _dialog_layer = this;
                mod_animation.queueAnimationSequence(outBoundQ).then(function(res){
                    if(activeInstance && activeInstance.el && activeInstance.el.parentNode){
                        activeInstance.el.parentNode.removeChild(activeInstance.el);
                    }
    
                    if(activeInstance){
                        activeInstance.parentView.removeView(activeInstance);
                        _activeDialogs.splice(_activeDialogs.indexOf(activeInstance), 1);
                    }
                    
                    if(_activeDialogs.length === 0){
                        _dialog_layer.toggleLayer(false);
                    }
                });


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