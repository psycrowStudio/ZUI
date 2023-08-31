define([
    'zui',
    '3p/keypress',
    'mod/phaser'
], function(
    zui,
    keypress,
    phaser
){
    var MODULE_NAME = "Phaser Sandbox";
    console.log('loading Phaser Sandbox');
    var phaser_sandbox = zui.types.page.fab({ 
        'title' : 'Phaser Sandbox', 
        'isActive': true,
        'bodyClasses': ['page_grid']
    });
    //layout_base.generate(phaser_sandbox);

    //var scroll_box = phaser_sandbox.findChildView('scrolling_box');

    // get content componet -- #scrolling_box
    var tool_box = zui.types.view.fab( {
        id:'rbss_tools', 
        parent: phaser_sandbox, 
        insertionSelector: '#scrolling_box',
        classes:['rbss_tools', 'g-row'],
        events: {
            "click #AE" : function(){
                console.log('loading actor creator');
                //window.location.assign("/tools/actorEditor");
            }
        },
        template:'\
        <div id="AE" class="tooltile" title="Actor Editor"><div class="fa fa-id-card"><div>AE</div></div></div>\
        '
    });

    phaser_sandbox.view.listenToOnce(phaser_sandbox.view, "post-render", function(ev){
        tool_box.render();
    });

    phaser_sandbox.redraw();
});