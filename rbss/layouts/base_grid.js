define([
    'mod/dom_helper',
    'zui',
    "/rbss/view_templates/rbss_header.js",
    "text!/rbss/styles/main_grid.css"

], function(
    mod_dom,
    zui,
    vt_rbss_header,
    css
){
    var MODULE_NAME = "rbss_layout_default";
    mod_dom.css.addRaw(MODULE_NAME, css);
    
    var _base_layout = {
        generate: function(pageModel){
            var header_compiled = vt_rbss_header.compile({
                titleText : "Role-Based Scenario Simulator",
                titleHover : "R.B.S.S.",
                titleUrl : "/",
                links: [
                    {
                        text : "ActorCreator",
                        hover : "Create and Edit your characters",
                        url : "/tools/actorEditor",
                    },
                    {
                        text : "WorldBuilder",
                        hover : "Create and Edit your Environment",
                        url : "/",
                    },
                    {
                        text : "ActionSequencer",
                        hover : "Create and Edit your Triggers & RuleSets",
                        url : "/",
                    },
                ]
            });
        
            zui.types.component.fab( { 
                id:'header', 
                parentModel: pageModel,
                template: header_compiled,
            });
        
            var content = zui.types.component.fab({ 
                id:'content', 
                parentModel: pageModel,
                template:''
            });
        
            zui.types.component.fab( {
                id:'context_bar', 
                parentModel: content, 
                parentElementSelector: '#content',
                classes:['context-bar'],
                events: {
                },
                template:''
            });
        
            zui.types.component.fab( {
                id:'scrolling_box', 
                parentModel: content, 
                parentElementSelector: '#content',
                classes:['scrolling_box'],
                events: {
                },
                template:''
            });
        
            zui.types.component.fab( { id:'footer', 
                parentModel: pageModel,                 
                template:' &copy;2020 PsyCrow Studio &#x03A8;&#x16E6;' 
            });

            //var dialogLayer = zui.components.dialogLayer.addToPage(testPage);
        }
    };
    
    return _base_layout;
}
);