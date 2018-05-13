define(['zui'], function(zui){
   
    var testPage = zui.factory.page.addPage(zui.factory.page.instantiatePage({ 'title' : 'Test Page' }));
        zui.factory.component.fabricate( { id:'header', parentModel: testPage } );
        zui.factory.component.fabricate( { id:'content', parentModel: testPage } );
        zui.factory.component.fabricate( { id:'footer', parentModel: testPage } );

//         //zui.componentFactory.instantiate( 'horizontalMenu', { id:'mainMenu', parentModel: testPage.components.get('header'),  parentElementSelector: '#header'} );
//         //TODO static components (ones that dont take events, or change)
        zui.factory.component.fabricate({ 
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

        zui.factory.component.fabricate({ 
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

        zui.factory.component.fabricate({ 
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

        zui.factory.component.fabricate({ 
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

        zui.factory.component.fabricate({ 
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

    zui.factory.page.setActivePage(testPage);

    zui.factory.component.fabricate({ 
        id:'TriggerSandbox', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'status-active',
        template:'<label>Trigger Timer</label> <input type="number" min="1000" step="500" placeholder="DELAY IN SECONDS"></input>\
                           <button> Start </button> \
                           <input type="checkbox" title="keep alive" class="keepAlive">\
                           <input type="checkbox" title="reset after fire" class="resetAfterFire">\
        ',
        events: {
            click: function(e) {
                if(e.target.nodeName.toLowerCase() === "button") {
                    var button = e.target;
                    var input = this.model.view.el.querySelector('input:valid');

                    if(input && input.value > 0){
                        button.disabled = true;
                        //TODO create trigger from factory and attach to this object.   
                        //console.log("Setting " + input.value + "(s) Trigger")
                        this.listenToOnce(this, 'zui-trigger-primed', function(input){ 
                            console.log(arguments, input);
                        }); 
                        var trigger = zui.types.Trigger.fab(
                            { 
                                target: this.model,
                                keepAlive: this.keepAlive ? this.keepAlive : false,
                                resetAfterFire: this.resetAfterFire ? this.resetAfterFire : false
                            }, 
                            {
                                template: "timer-basic", 
                                templateVars:{
                                    duration:input.value
                                }
                        });
                        this.model.listenToOnce(trigger, "zui-trigger-fired", function(event){
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

            }
        }
    });
    testPage.redraw();
});