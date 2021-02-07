define([
    'zui',
    'rbss',
    'rbssRoot/layouts/base_grid'
], function(
    zui,
    rbss,
    layout_base
){
    var MODULE_NAME = "RBSS_PAGE_Index";

    var testPage = zui.types.page.fab({ 
        'title' : 'R.B.S.S. Home', 
        'isActive': true,
        'bodyClasses': ['page_grid']
    });
    layout_base.generate(testPage);

    var scroll_box = testPage.findChildView('scrolling_box');

    // get content componet -- #scrolling_box
    var tool_box = zui.types.view.fab( {
        id:'rbss_tools', 
        parent: scroll_box, 
        insertionSelector: '#scrolling_box',
        classes:['rbss_tools', 'g-row'],
        events: {
            "click #AE" : function(){
                console.log('loading actor creator');
                window.location.assign("/tools/actorEditor");
            }
        },
        template:'\
        <div id="AE" class="tooltile" title="Actor Editor"><div class="fa fa-id-card"><div>AE</div></div></div>\
        <div id="WB" class="tooltile" title="World Builder"><div class="fa fa-globe"><div>WB</div></div></div>\
        <div id="AS" class="tooltile" title="Action Sequencer"><div class="fa fa-cubes"><div>AS</div></div></div>\
        '
    });

    testPage.view.listenToOnce(testPage.view, "render", function(ev){
        tool_box.render();
    });

    testPage.redraw();
});