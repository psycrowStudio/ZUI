define([
        'zui',
        "zuiRoot/components/tab_view",
        "rbssRoot/tools/actorEditor/view_templates/actor_editor",
    ],
    function (
        zui,
        zui_tab_view,
        actor_editor_template,
    ) {
        var MODULE_NAME = "actor_viewer";
        
        return {
            init: function(pm, pms){
                var actor_viewer = zui.types.component.fab( {
                    id: ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6), 
                    parentModel: pm, 
                    parentElementSelector: pms,
                    classes:['actor_viewer'],
                    events: {},
                    template: actor_editor_template.compile(),
                });
                
                // TODO consider if these need to be a model or not...
                var tabSettings = {
                    pm:actor_viewer,
                    pms: '.tab_row_one',
                    tabs: {
                        "base_stats": {
                            label: "Base Stats",
                            hover: "!!!",
                            order: 0,
                            content: "<p>Base Stats</p>"
                        },
                        "demo": {
                            label: "Demographics",
                            hover: "@@@",
                            order: 2,
                            content: "<p>Demographics</p>"
                        },
                        "personality": {
                            label: "Personality",
                            hover: "###",
                            order: 4,
                            content: "<p>Personality</p>"
                        }
                    },
                    activeTab: "demo"
                };

                var tr1 = zui_tab_view.init(tabSettings);
    
                var tabSettings2 = {
                    pm:actor_viewer,
                    pms: '.tab_row_two',
                    tabs: {
                        "skills": {
                            label: "Skills",
                            hover: "!!!",
                            order: 0,
                            content: "<p>Skills</p>"
                        },
                        "log_book": {
                            label: "Log Book",
                            hover: "@@@",
                            order: 2,
                            content: "<p>Log Book</p>"
                        },
                        "resources": {
                            label: "Resources",
                            hover: "###",
                            order: 4,
                            content: "<p>Resources</p>"
                        },
                        "art_assets": {
                            label: "Art Assets",
                            hover: "***",
                            order: 5,
                            content: "<p>Art Assets</p>",
                            disabled: true
                        }
                    }
                };

                var tr2 = zui_tab_view.init(tabSettings2)
                
                return actor_viewer;
            },
            //load
            //refresh
            //exportToJSON

        };
    }
);