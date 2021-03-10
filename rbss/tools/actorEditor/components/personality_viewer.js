define([
    'zui',
    "zuiRoot/components/toolbar",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout",
    "rbssRoot/tools/actorEditor/view_templates/basic_info"
],
function (
    zui,
    zui_toolbar,
    tab_layout_template,
    basic_info_template
) {
    var MODULE_NAME = "personality_viewer";
    
    return {
        init: function(pm, pms, datamodel){
            
            // MAIN VIEW COMPONENT -------------------------
            var stat_viewer_settings = {
                parent:pm,
                insertionSelector: pms,
                autoInsert:false,
                classes: ['basic_info_viewer'],
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
                        glyph_code:"edit",
                        hover_text: "Edit Basic Info",
                        disabled: false,
                        visible: true,
                        classes: [],
                        onClick:function(view, ev){
                            var glyph = ev.currentTarget.querySelector('.glyph');
                            if(glyph.classList.contains('fa-' + this.glyph_code)){
                                glyph.classList.remove('fa-' + this.glyph_code);
                                glyph.classList.add('fa-check-circle');
                                ev.currentTarget.title = "Save Changes";
                            }
                            else {
                                glyph.classList.remove('fa-check-circle');
                                glyph.classList.add('fa-' + this.glyph_code);
                                ev.currentTarget.title = this.hover_text;
                            }
                            
                           
                            // toggle the state of the form fields
                            // save data back to model

                        }
                    },
                ]
            };

            var toolbar =  zui_toolbar.init(tool_bar_settings);

            // STAT LIST -------------------------     
            
            var basic_actor_info = {

            };
            
            var stat_viewer_settings = {
                parent:viewer,
                insertionSelector: '.content_col',
                template: basic_info_template.compile(basic_actor_info)
            };

            var edit_form = zui.types.view.fab(stat_viewer_settings);

            return viewer;
        }
    };
}
);