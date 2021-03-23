define([
    'zui',
    "zuiRoot/components/toolbar",
    "zuiRoot/components/form_fields",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout",
    "rbssRoot/tools/actorEditor/view_templates/demographics_editor"

],
function (
    zui,
    zui_toolbar,
    zui_form_fields,
    tab_layout_template,
    demographics_template
) {
    var MODULE_NAME = "demographics_viewer";
    
    return {
        init: function(pm, pms, datamodel){
            
            // MAIN VIEW COMPONENT -------------------------
            var stat_viewer_settings = {
                parent:pm,
                insertionSelector: pms,
                autoInsert:false,
                classes: ['demographics_viewer'],
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
                                fieldset.disabled = false;
                            }
                            else {
                                glyph.classList.remove('fa-check-circle');
                                glyph.classList.add('fa-' + this.glyph_code);
                                ev.currentTarget.title = this.hover_text;
                                fieldset.disabled = true;
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
            


            var demographics_viewer_settings = {
                parent:viewer,
                insertionSelector: '.content_col',
                //template: demographics_template.compile(basic_actor_info)
                template: function(){
                    
                    var form = document.createElement('div');
                    var form_rows = [];

                    var randomize_button = {
                        label:"",
                        glyph_code:"random",
                        hover_text: "Randomize",
                        disabled: false,
                        visible: true,
                        classes: [],
                        // onClick:function(view, ev){
                        //     var glyph = ev.currentTarget.querySelector('.glyph');
                        //     if(glyph.classList.contains('fa-' + this.glyph_code)){
                        //         glyph.classList.remove('fa-' + this.glyph_code);
                        //         glyph.classList.add('fa-check-circle');
                        //         ev.currentTarget.title = "Save Changes";
                        //     }
                        //     else {
                        //         glyph.classList.remove('fa-check-circle');
                        //         glyph.classList.add('fa-' + this.glyph_code);
                        //         ev.currentTarget.title = this.hover_text;
                        //     }
                            
                            
                        //     // toggle the state of the form fields
                        //     // save data back to model

                        // }
                    };


                    var form_content = [
                        {
                            label:"Age",
                            field_name:"age",
                            type:"number",
                            hover_text:"This character's age",
                            value:21,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Birthdate",
                            field_name:"dob",
                            type:"date",
                            hover_text:"This character's day of birth",
                            value:"1984-01-01",
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Height",
                            field_name:"height",
                            type:"number",
                            hover_text:"This character's overall size (IN)",
                            value:50,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Weight",
                            field_name:"weight",
                            type:"number",
                            hover_text:"This character's overall weight (LBS)",
                            value:150,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Gender",
                            field_name:"gender",
                            type:"select",
                            options:[
                                {
                                    label:"Male",
                                    value:"male"
                                },
                                {
                                    label:"Female",
                                    value:"female"
                                }
                            ],
                            hover_text:"This character's gender",
                            value:"female",
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Moral Alignment",
                            prompt: "somthing about alignments...",
                            field_name:"moral_alignment",
                            type:"range",
                            hover_text:"This character's overall size",
                            value:0,
                            attributes:{
                                min:-1,
                                max:1,
                                step: 0.05
                            },
                            misc: {
                                calculateOutput: function(sourceEl){
                                    var v = parseFloat(sourceEl.value);
                                    if(v === 0){
                                        return sourceEl.value + " Neutral";
                                    }
                                    else if(v < 0){
                                        return sourceEl.value + " Evil";
                                    }
                                    else {
                                        return sourceEl.value + " Good";
                                    }
                                }
                            },
                            // buttons:[
                            //     randomize_button
                            // ]
                        },
                        {
                            label:"Ethical Alignment",
                            field_name:"ethical_alignment",
                            type:"range",
                            hover_text:"This character's overall size",
                            value:0,
                            attributes:{
                                min:-1,
                                max:1,
                                step: 0.05
                            },
                            misc: {
                                calculateOutput: function(sourceEl){
                                    var v = parseFloat(sourceEl.value);
                                    if(v === 0){
                                        return sourceEl.value + " Neutral";
                                    }
                                    else if(v < 0){
                                        return sourceEl.value + " Chaotic";
                                    }
                                    else {
                                        return sourceEl.value + " Lawful";
                                    }
                                }
                            },
                            // buttons:[
                            //     randomize_button
                            // ]
                        }
                    ]

                    form_content.forEach(function(el, i){
                        form_rows.push(zui_form_fields.create_field_row_basic(el));
                    });

                    var fieldset_settings = {
                        label:"FIELDSET TEST",
                        //classes: ["no-border"],
                        prompt:"Here is some data related to the following fields...",
                        hover_text:"testing the fieldset",
                        fields: form_rows,
                        disabled:true
                    };
                    fieldset = zui_form_fields.create_fieldset(fieldset_settings);
                    form.appendChild(fieldset);

                    return form;
                }
            };

            var edit_form = zui.types.view.fab(demographics_viewer_settings);

            return viewer;
        }
    };
}
);