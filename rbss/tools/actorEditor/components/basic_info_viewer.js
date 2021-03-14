define([
    'mod/text',
    'zui',
    "zuiRoot/components/toolbar",
    "zuiRoot/components/fa_glyph_picker",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout",
    "rbssRoot/tools/actorEditor/view_templates/basic_info"
],
function (
    mod_text,
    zui,
    zui_toolbar,
    zui_glyph_picker,
    tab_layout_template,
    basic_info_template,

) {
    var MODULE_NAME = "basic_info_viewer";
    
    return {
        init: function(pm, pms, actor){
            
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
                template: basic_info_template.compile(actor),
                events:{
                    "click #random_glyph":function (ev) {
                        var glyphs = zui_glyph_picker.getGlyphCodes();
                        var g = glyphs[mod_text.random.int(0, glyphs.length-1)];
                        actor.set('glyph_code', g);

                        var glyph_input = edit_form.el.querySelector("#actor_accent_glyph");
                        if(glyph_input){
                            glyph_input.value = g;
                        }


                        // zui_glyph_picker.createGlyphPicker().then(function(glyph){
                        //     console.log(glyph);
                        //     actor.set('glyph_code', glyph);
                        // });
                    },
                    "click #random_accent_color": function(ev){
                        console.log('color:', ev.target.value);
                        var c = "#"+mod_text.random.hexColor();
                        actor.set('accent_color', c);
                        
                        var color_input = edit_form.el.querySelector("#actor_accent_color");
                        if(color_input){
                            color_input.value = c;
                        }
                    },
                    "change #actor_accent_color": function(ev){
                        console.log('color:', ev.target.value);
                        actor.set('accent_color', ev.target.value);
                    },

                }
            };

            var edit_form = zui.types.view.fab(stat_viewer_settings);

            return viewer;
        }
    };
}
);