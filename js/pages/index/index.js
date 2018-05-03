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
        template:'<label>Trigger Timer</label> <input type="number" min="0" step="1" placeholder="DELAY IN SECONDS"></input>\
                           <button> Start </button> \
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
                                target:this
                            }, 
                            {
                                template: "timer-basic", 
                                templateVars:{
                                    duration:60
                                }
                        });
                        this.listenToOnce(trigger, "zui-trigger-fired", function(event){
                            console.log(event, "FIRED!");
                            //reset
                        })
                    }
                }
                return false;
            }
        }
    });
    testPage.redraw();
});