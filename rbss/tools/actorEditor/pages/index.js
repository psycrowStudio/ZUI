define([
    'mod/dom_helper',
    'zui',
    'rbss',
    'rbssRoot/layouts/base_grid',
    // 'rbssRoot/framework/factories/actor',
    "rbssRoot/tools/actorEditor/view_templates/actor_viewer",
    // 'rbssRoot/tools/actorEditor/modules/page',
    // 'rbssRoot/data/data',
], function(
    mod_dom,
    zui,
    rbss,
    layout_base,
    // rbss_actor_factory,
    rbss_actor_view_tempalte,
    // page_logic,
    // page_data
){
    var MODULE_NAME = "3";

    var testPage = zui.types.page.fab({ 
        'title' : 'RBSS Actor Creator Index', 
        'isActive': true,
        'bodyClasses': ['page_grid']
    });
    layout_base.generate(testPage);

    var scroll_box = testPage.findChildComponent('scrolling_box');

   // get content componet -- #scroll_box
    zui.types.component.fab( {
        id:'actor_viewer', 
        parentModel: scroll_box, 
        parentElementSelector: '#scrolling_box',
        className:'actor_viewer',
        events: {},
        template:rbss_actor_view_tempalte.compile()
    });
    
    testPage.clearExistingBody();
    testPage.redraw();
});