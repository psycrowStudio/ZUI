define([
    'mod/animation',
    'zui',
    "zuiRoot/components/collection_viewer",
    "zuiRoot/components/toolbar",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout"
],
function (
    mod_animation,
    zui,
    zui_collection_viewer,
    zui_toolbar,
    tab_layout_template
) {
    var MODULE_NAME = "stat_viewer";
    
    return {
        init: function(pm, pms, datamodel){
            
            // MAIN VIEW COMPONENT -------------------------
            var stat_viewer_settings = {
                parent:pm,
                insertionSelector: pms,
                autoInsert:false,
                classes: ['stat_viewer'],
                template: tab_layout_template.compile()
            };

            var viewer = zui.types.view.fab(stat_viewer_settings);
               

            // TODO thoughts on needed model events
            //-- add item
            //-- remove item
            // consider how the list works with arrays / dicts



            // TOOL BAR -------------------------
            var tool_bar_settings = {
                parent:viewer,
                insertionSelector: '.toolbar-col',
                buttons: [
                    {
                        label:"",
                        glyph_code:"plus",
                        hover_text: "Add new Stat",
                        disabled: false,
                        visible: true,
                        classes: ["red-btn"],
                        onClick:function(view, ev){
                            console.log("Add New Stat", this);

                            // add new flow should consider:
                            // the flow for adding an existing vs a totally new stat
                            // need to has out the stat model

                        }
                    },
                ]
            };

            var toolbar =  zui_toolbar.init(tool_bar_settings);

            // STAT LIST -------------------------
            var stat_list_settings = {
                parent:viewer,
                insertionSelector: '.content_col',
                dataset: datamodel,
                // generateItemSettings: function(el, i){
                //     return {
                //         label: el.length,
                //         hover_text: el
                //     };
                // },
                onClick:function(view, ev){
                    console.log("collection-list-item clicked", view.model[ev.currentTarget.id.split('_')[1]]);
                }
            };

            var list =  zui_collection_viewer.createListViewer(stat_list_settings);


            return viewer;
        }
    };
}
);