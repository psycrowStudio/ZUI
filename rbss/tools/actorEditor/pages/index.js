define([
    'mod/dom_helper',
    'zui',
    'rbss',
    'rbssRoot/layouts/base_grid',
    // 'rbssRoot/framework/factories/actor',
    "rbssRoot/tools/actorEditor/components/actor_viewer",
    // 'rbssRoot/tools/actorEditor/modules/page',
    // 'rbssRoot/data/data',
], function(
    mod_dom,
    zui,
    rbss,
    layout_base,
    // rbss_actor_factory,
    rbss_actor_view,
    // page_logic,
    // page_data
){
    var MODULE_NAME = "actor_editor_index";

    var testPage = zui.types.page.fab({ 
        'title' : 'RBSS Actor Creator Index', 
        'isActive': true,
        'bodyClasses': ['page_grid']
    });
    layout_base.generate(testPage);

    var scroll_box = testPage.findChildView('scrolling_box');
    var actor_viewer = rbss_actor_view.init(scroll_box, '#scrolling_box');


    testPage.clearExistingBody();
    testPage.redraw();    
});