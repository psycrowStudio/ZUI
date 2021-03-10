define([
    'zui',
    "zuiRoot/components/toolbar",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout",
    "rbssRoot/tools/actorEditor/view_templates/resources_editor"
],
function (
    zui,
    zui_toolbar,
    tab_layout_template,
    resources_editor_template
) {
    var MODULE_NAME = "resources_viewer";
    
    return {
        init: function(pm, pms, datamodel){
            
            // MAIN VIEW COMPONENT -------------------------
            var stat_viewer_settings = {
                parent:pm,
                insertionSelector: pms,
                autoInsert:false,
                classes: ['resources_viewer'],
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
                        glyph_code:"info-circle",
                        hover_text: "Knowledge",
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
                    {
                        label:"",
                        glyph_code:"money",
                        hover_text: "Currencies",
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
                    {
                        label:"",
                        glyph_code:"home",
                        hover_text: "Property",
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
                    {
                        label:"",
                        glyph_code:"th",
                        hover_text: "Inventroy",
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
                    {
                        label:"",
                        glyph_code:"shield",
                        hover_text: "Equipment & Tools",
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
                    }
                ]
            };

            var toolbar =  zui_toolbar.init(tool_bar_settings);

            // STAT LIST -------------------------     
            
            var basic_actor_info = {

            };
            
            var stat_viewer_settings = {
                parent:viewer,
                insertionSelector: '.content_col',
                template: resources_editor_template.compile(basic_actor_info)
            };

            var edit_form = zui.types.view.fab(stat_viewer_settings);

            return viewer;
        }
    };
}
);