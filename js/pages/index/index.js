define(['zui'], function(zui){
    // var pm = this;
    // var _activePage = null;
    // var _previousPage = null;
    // var _pages = new Backbone.Collection(null, { model: Types.Page });
    var testPage = zui.types.page.fab({ 'title' : 'ZUI Trigger Test Page', 'isActive': true });
    zui.types.component.fab( { id:'header', parentModel: testPage } );
    zui.types.component.fab( { id:'content', parentModel: testPage } );
    zui.types.component.fab( { id:'footer', parentModel: testPage } );

//         //zui.componentFactory.instantiate( 'horizontalMenu', { id:'mainMenu', parentModel: testPage.components.get('header'),  parentElementSelector: '#header'} );
//         //TODO static components (ones that dont take events, or change)
    zui.types.component.fab({ 
        id:'box_01', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-error',
        events: {
            click: function(e) {
                console.log(this);
                this.model.toggleViewState();
                return false;
            }
        }
    });

    zui.types.component.fab({ 
        id:'box_02', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-active',
        events: {
            click: function(e) {
                console.log(this);
                this.model.toggleViewState();
                return false;
            }
        }
    });

    zui.types.component.fab({ 
        id:'box_03', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-inactive',
        events: {
            click: function(e) {
                console.log(this);
                this.model.toggleViewState();
                return false;
            }
        }
    });

    zui.types.component.fab({ 
        id:'box_04', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-disabled',
        events: {
            click: function(e) {
                console.log(this);
                this.model.toggleViewState();
                return false;
            }
        }
    });

    zui.types.component.fab({ 
        id:'box_05', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-loading',
        events: {
            click: function(e) {
                console.log(this);
                this.model.toggleViewState();
                return false;
            }
        }
    });

    //zui.factory.page.setActivePage(testPage);

    zui.types.component.fab({ 
        id:'TriggerSandbox', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-active',
        template:'<label>Trigger Timer</label> <input type="number" min="1000" step="500" placeholder="DELAY IN SECONDS"></input>\
                           <button> Start </button> \
                           <input type="checkbox" title="keep alive" class="keepAlive">\
                           <input type="checkbox" title="reset after fire" class="resetAfterFire">\
                           <input type="checkbox" title="sticky" class="sticky">',
        events: {
            click: function(e) {
                if(e.target.nodeName.toLowerCase() === "button") {
                    var button = e.target;
                    var input = this.model.view.el.querySelector('input:valid');

                    if(input && input.value > 0){
                        button.disabled = true;
                        //console.log("Setting " + input.value + "(s) Trigger")
                        this.listenToOnce(this, 'zui-trigger-primed', function(input){ 
                            console.log(arguments, input);
                        }); 


                        var _eval = function(handle){

                            return new Promise(function(resolve, reject) {
                                var _pScope = this;
                                //handle.resolve = resolve;
                                //console.log(resolve);
                                //handle.reject = reject;
                                var delay = Math.floor(Math.random()*(5000-3000+1)+3000);
                                console.log(delay);
                                try{
                                    setTimeout(function(){
                                        console.log('end');
                                        resolve('TIME UP');
                                        //reject('Player Died');
                                        //throw "HTTP Error";
                                    }, delay);
                                } catch (err) {
                                    throw err;
                                }

                            });
                        };


                        var trigger = zui.types.trigger.fab(
                            { 
                                target: this.model,
                                keepAlive: this.keepAlive ? this.keepAlive : false,
                                resetAfterFire: this.resetAfterFire ? this.resetAfterFire : false,
                                firedLimit: 3
                            }, 
                            // {
                            //     template: "timer-basic", 
                            //     templateVars:{
                            //         duration:input.value,
                            //         sticky: this.sticky ? this.sticky : false,
                            //     }
                            {
                                template: "function-runner", 
                                templateVars:{
                                    evalPredicate: _eval
                                }
                        });
                        trigger.prime();
                        this.model.listenToOnce(trigger, "zui-trigger-consumed", function(event){
                            button.disabled = false;
                        });
                        this.model.listenToOnce(trigger, "zui-trigger-evaluation-error", function(event){
                            button.disabled = false;
                        });

                    }
                    return false;
                }
                else if(e.target.nodeName.toLowerCase() === 'input' && e.target.classList.contains('keepAlive'))
                {
                    this.keepAlive = e.target.checked;
                }
                else if(e.target.nodeName.toLowerCase() === 'input' && e.target.classList.contains('resetAfterFire')){
                    this.resetAfterFire = e.target.checked;
                }
                else if(e.target.nodeName.toLowerCase() === 'input' && e.target.classList.contains('sticky')){
                    this.sticky = e.target.checked;
                }

            }
        }
    });
    testPage.redraw();
});