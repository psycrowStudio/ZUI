define(['backbone',
'zuiRoot/common',
'zuiRoot/logger'], function(Backbone, Common, Logger){
    return Backbone.Model.extend({
        //TODO create a 'showStatusIcon' rule. icons will be off by default.
        defaults : {
            'echo' : false
        },
        toggleViewState: function(st, opt) {   
            var currentState = this.get('viewState');
            
            if(currentState === st)
                return;
            
            if(this.view && this.view.el) {
                for(var z = 0; z < this.view.el.classList.length; z++){
                    if(this.view.el.classList[z].indexOf('status-') > -1) {
                        this.view.el.classList.remove(this.view.el.classList[z]);
                    }
                }
    
                var nextState = '';

                switch(st) {
                    case 'active':
                        nextState = 'active';
                        this.view.el.disabled = false;                      
                    break;
                    case 'inactive':
                        nextState = 'inactive'; 
                        this.view.el.disabled = false;      
                    break;
                    case 'loading':
                        nextState = 'loading'; 
                        this.view.el.disabled = true;      
                    break;
                    case 'disabled':
                        nextState = 'disabled'; 
                        this.view.el.disabled = true;
                        //TODO consider behavior differneces between top-level, nodal, general components
                        var screenElement = this.view.el.querySelector('.zui-screen');
    
                        if(screenElement)
                        {
                            screenElement.querySelector('.zui-screen .zui-message').innerHTML = opt ? opt.message : '';
                            
                        }
                        else
                        {
                            //TODO track components and partials that are added.
                            //console.log(window.zui.templateManager.use('screen', { message: opt ? opt.message : '' }));
                            //this.view.el.innerHTML = this.view.el.innerHTML + window.zui.templateManager.use('screen', { message: opt ? opt.message : '' });
                            // var temp = 
                            //this.view.el.insertAdjacentHTML('beforeend', window.zui.templateManager.use('screen', { message: opt ? opt.message : '' }));
                            //this.view.render();
                        }
    
                        //this.view.el.querySelector('.zui-screen').remove(['zui-invis','zui-hidden', 'zui-noDisplay']);
                            
                    break;
                    case 'error':
                        nextState = 'error';     
                        this.view.el.disabled = false;  
                    break;
                    case 'transitionIn':
                        nextState = 'transitionIn';  
                        this.view.el.disabled = true;     
                    break;
                    case 'transitionOut':
                        nextState = 'transitionOut'; 
                        this.view.el.disabled = true;      
                    break;
                }
                
                this.view.el.classList.add('status-' + nextState);
                this.set({viewState: nextState});
            }
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
        },
    
        cachedError:{},
        cachedMessage:{},
    });
});