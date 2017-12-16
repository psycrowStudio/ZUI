define(['backbone',
        'zuiRoot/common',
        'zuiRoot/models/ComponentModel',
        'zuiRoot/logger'], function(Backbone, Common, Component, Logger){
            
            return Backbone.Model.extend({
            //model instance properties and methods 
            defaults : {
                'echo' : false
            },
            addComponent: function(component) {
                //TODO add the logic for this
                if(component instanceof Component && this.components )
                {
                    if(!this.components.get(component))
                    {
                        this.output('adding component');
                        return this.components.add(component);
                    }
                    else
                    {
                        this.output('component already exists', 'warn');
                    }       
                }
            },
            activate: function() {
                this.set('isActive', true);
            },
            redraw: function() {
                this.view.render();
            },
            initialize : function() {
                this.view = new (Backbone.View.extend({ 
                    model: this,
                    el: 'body',
                    className: 'zui-page',
                    attributes: {
                        'id' : Common.genId(),
                        'disabled': false
                    },
                    render: function() {
                        if(!this.model || this.model.get('disabled') || !this.model.get('isActive'))
                            return;

                        $('head title').html(this.model.get('title'));

                        this.model.output('rendering page: ' + this.model.get('title'));
                        // this.el.innerHTML = '<div id="header">' + this.model.get('title') + '</div">';
                        // this.el.innerHTML +=  '<div id="content">&nbsp;</div>' + '<div id="header">&nbsp;</div>';

                        //_.each(his.model.components, alert);
                        for(var component in this.model.components.models) {
                            this.model.components.models[component].view.render();
                        }
                    }
                }))();
                //
                this.components =  new Backbone.Collection(null, {
                    model: Component
                });
            },
            output: function(message, messageType){
                if(this.get('echo')) {
                    if(!messageType || messageType === 'log') {
                        //zui.log(message, settings);
                    } else if(messageType === 'warn') {

                    }
                    else if(messageType === 'error') {

                    }
                    //zui.log(format, settings);
                }
            }
        });
});