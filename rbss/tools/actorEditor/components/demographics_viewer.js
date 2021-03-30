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
        init: function(pm, pms, actor){
            
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
                classes: ["vertical"],
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
                              

                                // TODO Start back here -- iron out the general model save flow
                                // implement randoms
                                // implement class based values (racial height / weight / age)
                                
                                // add a save() to field settings
                                // validate? // error message
                                // change watcher
                                // 

                                console.log('Saving Actor Values...');
                                fields = Array.from(edit_form.el.querySelectorAll('.zui-input:not(:disabled)'));

                                console.log('VALUES:', fields.reduce(function(acc, cv, i){
                                    // TODO check if changed... if()
                                    acc[cv.name] = cv.value;
                                    return  acc;
                                }, {}));

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
            var demographic = actor.get('demographic');
            var demo = actor.attributes.demographic;

            console.log('demo', demographic);

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
                        onClick:function(view, ev){
                            console.log('RANDOMIZE', this);

                        }
                    };


                    var form_content = [
                        {
                            label:"Race",
                            field_name:"race",
                            type:"text",
                            disabled: true,
                            hover_text:"This character's race",
                            value: "RACE HERE",
                            buttons:[
                                {
                                    label:"",
                                    glyph_code:"list-alt",
                                    hover_text: "Change Race",
                                    disabled: false,
                                    visible: true,
                                    classes: [],
                                    onClick:function(view, ev){
                                        var click_scope = this;
                                        var default_races = demographic.race.get_model().default_races()
                                        var settings = {
                                            typeSettings: {
                                                query: "Pick a number?",
                                                buttons: default_races.toJSON(),
                                                generateItemSettings: function(el, i){
                                                    var r = el.type + " "+ el.subtype + " " + el.class;
                                                    return {
                                                        label: r,
                                                        hover_text: el.description,
                                                        value: el.id
                                                    };
                                                }
                                            },
                 
                                        };

                                        console.log('clicked');
                                        var dialog_layer = zui.components.dialogLayer.current();
                                        var confirmation = dialog_layer.triggerDialog('mc', settings).then(function(resolve){
                                           
                                            var selected = default_races.get(resolve.id);
                                            console.log('resolved',selected);
                                            demographic.race = selected;

                                            var domEl = form.querySelector('[name='+ click_scope.field_name +']');
                                            domEl.value = resolve.type + " "+ resolve.subtype + " " + resolve.class;
                                            

                                        }).catch(function(error){
                                            console.log('rejected', error);
                                        }); 
                                        
                                        
                                        // toggle the state of the form fields
                                        // save data back to model
            
                                    }
                                },
                                randomize_button
                            ]
                        },
                        {
                            label:"Age",
                            field_name:"age",
                            type:"number",
                            hover_text:"This character's age",
                            value:demographic.age,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Birthdate",
                            field_name:"date_of_birth",
                            type:"date",
                            hover_text:"This character's day of birth",
                            value:demographic.date_of_birth.toFormat('yyyy-MM-dd'),
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Height",
                            field_name:"height",
                            type:"number",
                            hover_text:"This character's overall size (IN)",
                            value:demographic.height,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Weight",
                            field_name:"weight",
                            type:"number",
                            hover_text:"This character's overall weight (LBS)",
                            value:demographic.weight,
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
                            value:demographic.gender,
                            buttons:[
                                randomize_button
                            ]
                        },
                        {
                            label:"Moral Alignment",
                            field_name:"moral_alignment",
                            type:"range",
                            hover_text:"This character's overall size",
                            value:demographic.moral_alignment,
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
                            value:demographic.ethical_alignment,
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
                        // Save to el.domEl?
                        // loop over this array again upon saving values?
                        // if extended onSave, () else default save to obj?
                        el.dom_row = zui_form_fields.create_field_row_basic(el);
                        form_rows.push(el.dom_row);
                    });

                    var fieldset_settings = {
                        //label:"FIELDSET TEST",
                        classes: ["no-border"],
                        //prompt:"Here is some data related to the following fields...",
                        //hover_text:"testing the fieldset",
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