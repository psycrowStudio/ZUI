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

    var scroll_box = testPage.findChildComponent('scrolling_box');

    // get content componet -- #scrolling_box
    zui.types.component.fab( {
        id:'rbss_tools', 
        parentModel: scroll_box, 
        parentElementSelector: '#scrolling_box',
        className:'rbss_tools',
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

    testPage.redraw();
});