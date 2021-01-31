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

    var scroll_box = testPage.findChildComponent('scrolling_box');
    var actor_viewer = rbss_actor_view.init(scroll_box, '#scrolling_box')
    
    testPage.clearExistingBody();
    testPage.redraw();

    // testing new view
    // var view_test = zui.types.view.fab({ 
    //     template:false,
    //     insertionSelector: '#scrolling_box',
    //     classes: ['test_view']
    // });

    // view_test.listenTo(view_test, 'render', function(ev){
    //     console.log('view test', ev);
    // });

    // view_test.render();
    // end testing new view
    
});