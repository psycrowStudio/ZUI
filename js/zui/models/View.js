define([
    'mod/text',
    'mod/dom_helper',
    'zuiRoot/logger'
], function(
    mod_text,
    dom_helper,
    Logger
    ){
        var MODULE_NAME = "zui_view";
        var _prius;

        var _compileTemplate = function(view){
            if(view.template === null){
                return '';
            } else if(typeof view.template === 'string'){
                return view.template;
            } else if(typeof view.template === 'function'){
                return view.template(view);
            }
            else if(view.template.compile){
                return view.template.compile(view);
            }
            else {
                return _.template(' <p><%= tagName + ":" + id %></p>', view);
            }
        };

        var _generateScope = function(settings){
            return new (function(settings){
                settings = typeof settings === 'undefined' ? {} : settings; 

                return {
                    enabled: typeof settings.enabled !== "undefined" ? settings.enabled : true,
                    model: typeof settings.model !== "undefined" ? settings.model : null,
                    
                    parentView: typeof settings.parent !== "undefined" ? settings.parent : null,
                    insertionSelector: typeof settings.insertionSelector !== "undefined" ? settings.insertionSelector : '',
                    insertionPosition: typeof settings.insertionPosition !== "undefined" ? settings.insertionPosition : 'beforeend',
                    clearOnInsert: typeof settings.clearOnInsert !== "undefined" ? settings.clearOnInsert : false,

                    tagName: typeof settings.tagName !== "undefined" ? settings.tagName : 'div',
                    id: typeof settings.id !== "undefined" ? settings.id : mod_text.random.hexColor(),
                    classes:  Array.isArray(settings.classes) ? ['zui-component'].concat(settings.classes) : ['zui-component'],
                    attributes: settings.attributes ? settings.attributes : {},

                    renderOrder: typeof settings.renderOrder !== "undefined" ? settings.renderOrder : 0,
                    childViews : new Backbone.Collection(null, {
                        model : _prius,
                        comparator: 'renderOrder'
                    }),
                    
                    template : typeof settings.template !== "undefined" ? settings.template : null,
                    
                    //domSections : typeof settings.domSections !== "undefined" ? settings.domSections : null, //{ key map for sections} 'MAPPING TO THE RELEVANT SECTIONS WITHIN THIS COMPONENT'
                    //modifiers : typeof settings.modifiers !== "undefined" ? settings.modifiers : [],
                    //afterTemplateGenerate : typeof settings.afterTemplateGenerate === "function" ? settings.afterTemplateGenerate : null,
                    //TODO add & sort / remove modifiers
                    
                    initialize: function() {
                        this.el.className = this.classes.join(' ');
                        
                        if(this.parentView) {
                            view.parentModel.addView(this);
                        }
    
                        //_inform(this, "zui-component-created");
                        //this.listenTo(this.model, 'all', this.onComponentEvent)

                        Logger.log('ZUI View(' + this.id + ') Created', { tags: 'create' });
                    },

                    render : function(){
                        if(!this.enabled)
                            return;
                        
                        //TODO start back here ---
                        /// start to iron out the logger, make modules etc0
                        this.trigger('render', { "hello": true } );

                        var compliled_template = _compileTemplate(this);
                        this.el.innerHTML = compliled_template;

                        // if(this.model.afterTemplateGenerate) {
                        //     this.model.afterTemplateGenerate(this.el);
                        // }

                        this.childViews.forEach(function(child){
                            child.render();
                        });

                        if(!this.el.parentNode){
                            var parent_dom = !this.parentView ? document.body : parent.el;
                            parent_dom = this.insertionSelector ? parent_dom.querySelector(this.insertionSelector) : parent_dom;
                            
                            if(this.clearOnInsert){
                                dom_helper.clearChildren(parent_dom);
                            }

                            parent_dom.insertAdjacentElement(this.insertionPosition, this.el);
                        }

                        //if post renerer modifiers, call them here

                        return this;
                    },

                    events : function(){
                        //event mapping & routing
                        var defaultEventMapping = {
                            // 'keyup' : this.model.onKeyUp,
                            // 'keydown' : this.model.onKeyDown,
                            // 'mouseenter' : this.model.onMouseIn,
                            // 'mouseout' : this.model.onMouseOut,
                            // 'mousedown' : this.model.onMouseDown,
                            // 'mouseup' : this.model.onMouseUp,
                            //'click' : this.model.onClick
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

                    addView: function(view) {
                        if(this.childViews)
                        {
                            if(!this.childViews.get(view))
                            {
                                Logger.log('adding sub-view', { tags: 'ZUI' });
                                view.parentView = this;
                                return this.childViews.add(view);
                            }      
                        }
                    },
                    findChildView: function(v) {
                        var found = this.childViews.get(v)

                        if(!found)
                        {
                            this.childViews.each(function(view, index, list){
                                if(!found){
                                    found = view.findChildView(v);
                                }
                            });
                            return found || null;
                        }
                        return found;  
                    },
                    removeView: function(view){
                        if(this.childViews )
                        {
                            if(this.childViews.get(view))
                            {
                                Logger.log('removing sub-view', { tags: 'ZUI' });
                                view.parentView = null;
                                return this.childViews.remove(view);
                            }       
                        }
                    },
                };
            })(settings);
        };    
        
        //These are the static methods that this type will inherit
        var staticMethods = (function() {
            return {
                fab: function(objValues){   
                    var view = new (_prius.extend(_generateScope(objValues)))();
                    return view;
                }
            }
        })();

        _prius = Backbone.View.extend({}, staticMethods);
        return _prius;
});