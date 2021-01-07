define([
    'zui',
    'rbss'
], function(
    zui,
    rbss
){
    debugger;
    // var pm = this;
    // var _activePage = null;
    // var _previousPage = null;
    // var _pages = new Backbone.Collection(null, { model: Types.Page });

    var testPage = zui.types.page.fab({ 'title' : 'R.B.S.S. Home', 'isActive': true });
    zui.types.component.fab( { id:'header', parentModel: testPage } );
    zui.types.component.fab( { id:'content', parentModel: testPage } );
    zui.types.component.fab( { id:'footer', parentModel: testPage } );

    var dialogLayer = zui.components.dialogLayer.addToPage(testPage);
    
    testPage.redraw();
});