define([
    'mod/dom_helper',
    'zui',
    "/rbss/view_templates/rbss_header.js",
    "text!/rbss/styles/main.css"

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
        
            var header_compiled_stripped = header_compiled.replace(/\s\s+/g, '');
            //.replace(/\s\s+/g, '')
            //.replace(/^\s*(.*)\s*/, '$1')
        
            zui.types.component.fab( { 
                id:'header', 
                parentModel: pageModel,
                template: header_compiled_stripped,
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
                className:'context-bar',
                events: {
                },
                template:''
            });
        
            zui.types.component.fab( {
                id:'scrolling_box', 
                parentModel: content, 
                parentElementSelector: '#content',
                className:'scrolling_box',
                events: {
                },
                template:''
            });
        
            zui.types.component.fab( { id:'footer', parentModel: pageModel } );

            //var dialogLayer = zui.components.dialogLayer.addToPage(testPage);
        }
    };
    
    return _base_layout;
}
);