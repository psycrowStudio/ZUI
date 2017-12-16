define(['zui'], function(zui){
    console.log( zui );
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
});