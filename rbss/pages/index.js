define([
    'mod/dom_helper',
    'zui',
    'rbss',
    "/rbss/view_templates/rbss_header.js",
    "text!/rbss/styles/main.css"

], function(
    mod_dom,
    zui,
    rbss,
    vt_rbss_header,
    css
){

    // TODO -- start back -- add test component
    // begin creating components for the core structure of the page(s)
    // 

    var compiled = vt_rbss_header.compile({
        titleText : "Role-Based Scenario Simulator",
        titleHover : "R.B.S.S.",
        titleUrl : "/",
        links: [
            {
                linkText : "ActorCreator",
                linkHover : "Create and Edit your characters",
                linkUrl : "/",
            },
            {
                linkText : "WorldBuilder",
                linkHover : "Create and Edit your Environment",
                linkUrl : "/",
            },
            {
                linkText : "ActionSequencer",
                linkHover : "Create and Edit your Triggers & RuleSets",
                linkUrl : "/",
            },
        ]
    });

    var c_stripped = compiled.replace(/\s\s+/g, '')

    console.log('view_template', vt_rbss_header, c_stripped);  //.replace(/(?:\\[rnt]|[\r\n]+)+/g, "")
    //.replace(/\s\s+/g, '')
    //.replace(/^\s*(.*)\s*/, '$1')
    
    // var playout = vt_loading_spinner.compile({
    //     titleText : "Role-Based Scenario Simulator",
    //     titleHover : "Role-Based Scenario Simulator",
    //     titleLink : "/",

    // });


    // var pageLayout = zui.types.component.fab( { 
    //     id:'pageLayout', 
    //     template:'<span title="R.B.S.S.">Role-Based Scenario Simulator<span>  <span class="apps"> <a href="">Actor Creator</a> | <a href="">WorldBuilder</a> | <a href="">Action Sequencer</a></span>',
    // });




    var MODULE_NAME = "RBSS_Index";
        
    mod_dom.css.addRaw(MODULE_NAME, css);

    // var pm = this;
    // var _activePage = null;
    // var _previousPage = null;
    // var _pages = new Backbone.Collection(null, { model: Types.Page });

    var testPage = zui.types.page.fab({ 'title' : 'R.B.S.S. Home', 'isActive': true });
    zui.types.component.fab( { 
        id:'header', 
        parentModel: testPage ,
        template:c_stripped,
    });
    zui.types.component.fab({ 
        id:'content', 
        parentModel: testPage,
        template:''
    });

    zui.types.component.fab( {
        id:'context_bar', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'context-bar',
        events: {
        },
        template:''
    });

    zui.types.component.fab( {
        id:'scrolling_box', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#content',
        className:'scrolling_box',
        events: {
        },
        template:''
    });

    
    zui.types.component.fab( {
        id:'rbss_tools', 
        parentModel: testPage.components.get('content'), 
        parentElementSelector: '#scrolling_box',
        className:'rbss_tools',
        events: {
            "click #AC" : function(){
                console.log('loading actor creator');
                require(["rbssRoot/tools/actorEditor/pages/index"], function(index){

                });
            }
        },
        template:'\
        <div id="AC" class="tooltile" title="Actor Creator"><div class="fa fa-id-card"><div>AC</div></div></div>\
        <div id="WB" class="tooltile" title="World Builder"><div class="fa fa-globe"><div>WB</div></div></div>\
        <div id="AS" class="tooltile" title="Action Sequencer"><div class="fa fa-cubes"><div>AS</div></div></div>\
        '
    });

    zui.types.component.fab( { id:'footer', parentModel: testPage } );

    var dialogLayer = zui.components.dialogLayer.addToPage(testPage);

    testPage.redraw();
});