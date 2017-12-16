define(['underscore',
        'backbone',
        'zuiRoot/common',
        'zuiRoot/types',
        'zuiRoot/Logger'], function(_, Backbone, Common, Types, Logger){
    //TBD on what params will be needed
    //TODO think about saving a reference to all of the components created?
    var _externalComponentTypes = {};
    var _loadingCount = 0;
    var _externalComponentSrc = [
        //'js/zui/components/menu_horizontal.js' // TODO move this component over to RequireJS pattern
    ];

    function _loadExternalComponents(callback)
    {
        for(let z = 0; z < _externalComponentSrc.length; z++)
        {
            let capture = _externalComponentSrc[z];
           _loadingCount++;
            $.getScript( capture, function()
            {
                Logger.log(capture + ' loaded.', { tags:'zui-http', logeLevel:1 });
                --_loadingCount >= 0 ? _loadingCount : 0;
                
                if(_loadingCount === 0)
                {
                    //done loading
                    if(callback && typeof callback === 'function')
                    {
                        callback();
                    }
                }
            });
        }
    }
    
    _loadExternalComponents(function(event){
        //Logger.eventStreams..trigger('zui-load', {});
        console.log(event);
    });

    return {
        fabricate: function( settings ){ // dataContext, [el, renderer, template] view components
            settings = typeof settings === 'undefined' ? {} : settings;

            var component = new (Types.Component.extend({
                // TODO make a better way to set the defaults
                defaults : typeof settings.defaults !== "undefined" ? settings.defaults : {
                    'renderMe': true,
                    'id' : typeof settings.id === "string" ? settings.id : Common.genId(),
                    'disabled': false,
                    'parentElementSelector': typeof settings.parentElementSelector !== "undefined" ? settings.parentElementSelector : 'body'
                },
                initialize : function(){   
                    this.view = new (Backbone.View.extend({
                        model: this,
                        id: typeof settings.id !== "undefined" ? settings.id : this.get('id'),
                        tagName: typeof settings.tagName !== "undefined" ? settings.tagName : 'div',
                        className: typeof settings.className !== "undefined" ? 'zui-component ' + settings.className : 'zui-component',
                        el: typeof settings.el !== "undefined" ? settings.el : undefined,
                        //TODO make template a module loading function that returns promise
                        template : typeof settings.template !== "undefined" ? _.template(settings.template, this.model) : _.template(' <p>I am <%= get("id") %></p>', this.model) , //TODO create the default template for components
                        //domSections : typeof settings.domSections !== "undefined" ? settings.domSections : null, //{ key map for sections} 'MAPPING TO THE RELEVANT SECTIONS WITHIN THIS COMPONENT'
                        render : typeof settings.renderer === "function" ? settings.renderer : function(){
                            //queue render call if loading
                            if(!this.model.get('renderMe') || this.model.get('disabled'))
                                return;
        
                            this.el.innerHTML = this.template(this.model);

                            if(!this.el.parentElement && this.model.get('parentElementSelector')){
                                var parent = document.querySelector(this.model.get('parentElementSelector'));
                                if(parent){
                                    parent.appendChild(this.el);
                                }
                            }

                            for(var component in this.model.childComponents.models) {
                                this.model.childComponents.models[component].view.render();
                            }
                            // for(var z = 0; z < this.model.childComponents.length; z++){
                            //     if(this.model.childComponents[z].view && this.model.childComponents[z].view instanceof Backbone.View){
                            //         this.model.childComponents[z].view.render();
                            //     }
                            // }

                            //TODO (post render?)
                            return this;
                        },
                        attributes: typeof settings.viewAttributes === 'object' ? this.set(settings.viewAttributes) : '',
                        initialize: function() {
                            this.listenTo(this.model, 'all', this.onComponentEvent)
                            this.listenTo(this.model, "change", function(model, options){
                                //this.model.output('component [' + this.model.get('id') + '] Model Changed', { filter: 'changed' });
                                //console.log(model, options); 
                                //this.render();
                            });
                            this.listenTo(this.model, "change:viewState", this.onViewStateChanged);
                            Logger.log('Component View Created', { tags: 'create' });
                        },
                        events : function(){
                            //event mapping & routing
                            var defaultEventMapping = {
                                'keyup' : this.model.onKeyUp,
                                'keydown' : this.model.onKeyDown,
                                'mouseenter' : this.model.onMouseIn,
                                'mouseout' : this.model.onMouseOut,
                                'mousedown' : this.model.onMouseDown,
                                'mouseup' : this.model.onMouseUp,
                                'click' : this.model.onClick
                            };

                            for(var event in settings.events) {
                                if(settings.events.hasOwnProperty(event))
                                {
                                    //override default && || add to object
                                    defaultEventMapping[event] = settings.events[event];
                                }
                            }

                            return defaultEventMapping;
                        },
                        onViewStateChanged : function(model, value, options) {
                            //this.change:[attribute]
                            switch(value){
                              case 'active':
                                this.el.disabled = false;                      
                                break;
                            case 'inactive':
                                this.el.disabled = false;      
                                break;
                            case 'loading':
                                this.el.disabled = true;      
                                break;
                            case 'disabled':
                                this.el.disabled = true;
                                //TODO consider behavior differneces between top-level, nodal, general components
                                var screenElement = this.el.querySelector('.zui-screen');

                                // if(screenElement)
                                // {
                                //     screenElement.querySelector('.zui-screen .zui-message').innerHTML = opt ? opt.message : '';
                                    
                                // }
                                // else
                                // {
                                //     //TODO track components and partials that are added.
                                //     //console.log(window.zui.templateManager.use('screen', { message: opt ? opt.message : '' }));
                                //     //this.view.el.innerHTML = this.view.el.innerHTML + window.zui.templateManager.use('screen', { message: opt ? opt.message : '' });
                                //     // var temp = 
                                //     this.el.insertAdjacentHTML('beforeend', window.zui.templateManager.use('screen', { message: opt ? opt.message : '' }));
                                //     //this.view.render();
                                // }

                                //this.view.el.querySelector('.zui-screen').remove(['zui-invis','zui-hidden', 'zui-noDisplay']);
                                
                            break;
                            case 'error':
                                nextState = 'error';     
                                this.el.disabled = false;  
                            break;
                            case 'transitionIn':
                                nextState = 'transitionIn';  
                                this.el.disabled = true;     
                            break;
                            case 'transitionOut':
                                nextState = 'transitionOut'; 
                                this.el.disabled = true;      
                            break;
                            }
                        },
                        onComponentEvent : function(eventName, options){
                            console.log(eventName);
                            console.log(options);
                        }
                    }))();
                        
                    if(typeof settings.modelAttributes === 'object'){
                        this.set(settings.modelAttributes);
                    }

                    if(Array.isArray(settings.components)) {
                        this.childComponents.add(setings.components);
                    }

                    //TODO map el.sections to domSections
                    //domSections { 'name' : 'selector' }
                    Logger.log('Component Created', { tags: 'create' });
                },
                dataContext : typeof settings.dataContext !== "undefined" ? settings.dataContext : null,
                parentModel : typeof settings.parentModel !== "undefined" ? settings.parentModel : null,
                
                //model instance properties and methods 
                addComponent: function(component) {
                    //TODO add the logic for this
                    if(component instanceof Types.Component && this.childComponents )
                    {
                        if(!this.childComponents.get(component))
                        {
                            Logger.log('adding component', { tags: 'ZUI' });
                            return this.childComponents.add(component);
                        }
                        else
                        {
                            Logger.log('component already exists', { tags: 'warn' });
                        }       
                    }
                },
                
                childComponents : new Backbone.Collection(null, {
                    model : Types.Component
                    //TODO make this a sorted collection that forces render order
                }),

                //event handlers -- these run in the context of the view
                onClick : function(e){Logger.log('Component [' + this.model.get('id') + '] Clicked.', { filter: 'click' });},
                onKeyUp : function(e){Logger.log('key up');},
                onKeyDown : function(e){Logger.log('key down');},
                onMouseIn : function(e){Logger.log('mouse in');},
                onMouseOut : function(e){Logger.log('mouse out');},
                onMouseDown : function(e){Logger.log('mouse down');},
                onMouseUp : function(e){Logger.log('mouse up');}
            }))();

            if(settings.parentModel && (settings.parentModel instanceof Types.Page || settings.parentModel instanceof Types.Component)){
                 settings.parentModel.addComponent(component);
            }

            return component;
        },
        instantiate: function(type, settings) {
            var component;
            if(_externalComponentTypes.hasOwnProperty(type)){
                return _externalComponentTypes[type](settings);
            }
        },
        registerExternalType: function(typeName, constructor){
            if(typeof constructor === 'function'){
                _externalComponentTypes[typeName] = constructor;
            }
        }
    }
});
