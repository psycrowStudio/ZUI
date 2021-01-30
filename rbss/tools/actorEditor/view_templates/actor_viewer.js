define([
        "mod/templating",
        "mod/dom_helper",
        "zuiRoot/components/tab_view",
        "text!/rbss/tools/actorEditor/view_templates/ejs/actor_viewer.ejs",
        "text!/rbss/tools/actorEditor/view_templates/css/actor_viewer.css"
    ],
    function (
        mod_templating,
        mod_dom,
        zui_tab_view,
        ejs,
        css
    ) {
        var MODULE_NAME = "actor_viewer";
        
        mod_dom.css.addRaw(MODULE_NAME, css);
        

        var _compile = function(key, context){
            var tabSettings = {
                tabs: [
                    {
                        label: "Base Stats",
                        tabId: "base_stats",
                        hover: "!!!",
                        tabOrder: 0,
                        content: "<p>Base Stats</p>"
                    },
                    {
                        label: "Demographics",
                        tabId: "demo",
                        hover: "@@@",
                        tabOrder: 2,
                        content: "<p>Demographics</p>"
                    },
                    {
                        label: "Personality",
                        tabId: "personality",
                        hover: "###",
                        tabOrder: 4,
                        content: "<p>Personality</p>"
                    }
                ],
                activeTab: "demo"
            };
            var tabbing = zui_tab_view.init(tabSettings);
            //debugger;
            context.topTab = tabbing; // tabbing.el; -- need to move this code around to separate view / template

            return mod_templating.compileToRawHtml(key, context);
        };

        return mod_templating.buildTemplateHarness({
            key: MODULE_NAME, 
            ejs: ejs,
            compile: _compile,
            // parent model (page / component)
            context: {}
        });
    }
);