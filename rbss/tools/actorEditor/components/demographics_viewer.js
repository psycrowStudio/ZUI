define([
    'zui',
    "zuiRoot/components/toolbar",
    "zuiRoot/components/form_fields",
    "rbssRoot/tools/actorEditor/view_templates/tab_layout",
    "rbssRoot/tools/actorEditor/view_templates/demographics_editor",
    'mod/text'
],
function (
    zui,
    zui_toolbar,
    zui_form_fields,
    tab_layout_template,
    demographics_template,
    mod_text
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
                                fields = Array.from(edit_form.el.querySelectorAll('.zui-input:not(:disabled):not(.input-override)'));
                                fields = fields.reduce(function(acc, cv, i){
                                    // TODO check if changed... if()
                                    acc[cv.name] = cv.value;
                                    return  acc;
                                }, {});

                                for(var key in fields){
                                    if(demographic.hasOwnProperty(key)){
                                        demographic[key] = fields[key];
                                    }
                                }

                                console.log('VALUES:', demographic);

                                actor.set('demographic', demographic);
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

                    var randomize_button = function( randomize){
                        return {
                            label:"",
                            glyph_code:"random",
                            hover_text: "Randomize",
                            disabled: false,
                            visible: true,
                            classes: [],
                            onClick:function(view, ev){
                                if(typeof randomize === 'function'){
                                    randomize.call(this, view, ev);
                                }
                                else {
                                    console.log('RANDOMIZE', this);
                                }
                            }
                        };
                    };


                    var form_content = [
                        {
                            label:"Race",
                            field_name:"race",
                            type:"text",
                            disabled: true,
                            hover_text:"This character's race",
                            value:  demographic.race.get('type') + " "+ demographic.race.get('subtype') + " " + demographic.race.get('class'),
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
                                        var default_races = demographic.race.get_model().default_collection()
                                        var settings = {
                                            typeSettings: {
                                                query: "Select a race",
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
                                randomize_button(function(){
                                    var selected = demographic.race.get_model().random();
                                    demographic.race = selected;

                                    var domEl = form.querySelector('[name='+ this.field_name +']');
                                    domEl.value = selected.get('type') + " "+ selected.get('subtype') + " " + selected.get('class');
                                })
                            ]
                        },
                        {
                            label:"Personality",
                            field_name:"personality",
                            type:"text",
                            disabled: true,
                            hover_text:"This character's personality",
                            value:  demographic.personality.get('name'),
                            buttons:[
                                {
                                    label:"",
                                    glyph_code:"list-alt",
                                    hover_text: "Change Personality",
                                    disabled: false,
                                    visible: true,
                                    classes: [],
                                    onClick:function(view, ev){
                                        var click_scope = this;
                                        var default_personality = demographic.personality.get_model().default_collection()
                                        var settings = {
                                            typeSettings: {
                                                query: "Select a personality",
                                                buttons: default_personality.toJSON(),
                                                generateItemSettings: function(el, i){
                                                    var r = el.name;
                                                    return {
                                                        label: r,
                                                        hover_text: el.description,
                                                        value: el.id
                                                    };
                                                }
                                            },
                                        };

                                        var dialog_layer = zui.components.dialogLayer.current();
                                        var confirmation = dialog_layer.triggerDialog('mc', settings).then(function(resolve){
                                            var selected = default_personality.get(resolve.id);
                                            demographic.race = selected;

                                            var domEl = form.querySelector('[name='+ click_scope.field_name +']');
                                            domEl.value = resolve.name;
                                        }).catch(function(error){}); 
                                    }
                                },
                                randomize_button(function(){
                                    var selected = demographic.personality.get_model().random();
                                    demographic.personality = selected;

                                    var domEl = form.querySelector('[name='+ this.field_name +']');
                                    domEl.value = selected.get('name');
                                })
                            ]
                        },
                        {
                            label:"Archetype",
                            field_name:"archetype",
                            type:"text",
                            disabled: true,
                            hover_text:"This character's archetype",
                            value:  demographic.archetype.get('name'),
                            buttons:[
                                {
                                    label:"",
                                    glyph_code:"list-alt",
                                    hover_text: "Change Archetype",
                                    disabled: false,
                                    visible: true,
                                    classes: [],
                                    onClick:function(view, ev){
                                        var click_scope = this;
                                        var _default_archetype = demographic.archetype.get_model().default_collection()
                                        var settings = {
                                            typeSettings: {
                                                query: "Select an archetype",
                                                buttons: _default_archetype.toJSON(),
                                                generateItemSettings: function(el, i){
                                                    var r = el.name;
                                                    return {
                                                        label: r,
                                                        hover_text: el.description,
                                                        value: el.id
                                                    };
                                                }
                                            },
                                        };

                                        var dialog_layer = zui.components.dialogLayer.current();
                                        var confirmation = dialog_layer.triggerDialog('mc', settings).then(function(resolve){
                                            var selected = _default_archetype.get(resolve.id);
                                            demographic.archetype = selected;

                                            var domEl = form.querySelector('[name='+ click_scope.field_name +']');
                                            domEl.value = resolve.name;
                                        }).catch(function(error){}); 
                                    }
                                },
                                randomize_button(function(){
                                    var selected = demographic.archetype.get_model().random();
                                    demographic.archetype = selected;

                                    var domEl = form.querySelector('[name='+ this.field_name +']');
                                    domEl.value = selected.get('name');
                                })
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
                            onChange: function(ev){
                                demographic[this.field_name] = ev.target.value;
                            },
                            buttons:[
                                randomize_button(function(view, ev){
                                    var option = this.options[mod_text.random.int(0, this.options.length-1)];
                                    demographic.gender = option.value;

                                    var domEl = form.querySelector('[name='+ this.field_name +']');
                                    domEl.value = option.value;
                                })
                            ]
                        },
                        {
                            label:"Age",
                            field_name:"age",
                            type:"number",
                            hover_text:"This character's age",
                            value:demographic.age,
                            buttons:[
                                randomize_button(function(view, ev){
                                    var rng_age = demographic.race.get_model().random_age({ subtype:demographic.race.get('subtype') });
                                    
                                    if(rng_age){
                                        demographic.age = rng_age;
                                        var domEl = form.querySelector('[name='+ this.field_name +']');
                                        domEl.value = demographic.age;
                                    }
                                })
                            ]
                        },
                        {
                            label:"Height",
                            field_name:"height",
                            type:"number",
                            hover_text:"This character's overall size (IN)",
                            value:demographic.height,
                            buttons:[
                                randomize_button(function(view, ev){
                                    var bodySize = demographic.race.get_model().random_body_size({ subtype:demographic.race.get('subtype') }, demographic.gender);
                                    if(bodySize){
                                        demographic.height = bodySize.height;

                                        var domEl = form.querySelector('[name='+ this.field_name +']');
                                        domEl.value = bodySize.height;
                                    }
                                })
                            ]
                        },
                        {
                            label:"Weight",
                            field_name:"weight",
                            type:"number",
                            hover_text:"This character's overall weight (LBS)",
                            value:demographic.weight,
                            buttons:[
                                randomize_button(function(view, ev){
                                    var bodySize = demographic.race.get_model().random_body_size({ subtype:demographic.race.get('subtype') }, demographic.gender);
                                    if(bodySize){
                                        demographic.weight = bodySize.weight;

                                        var domEl = form.querySelector('[name='+ this.field_name +']');
                                        domEl.value = bodySize.weight;
                                    }
                                })
                            ]
                        },
                        {
                            label:"Birthdate",
                            field_name:"date_of_birth",
                            type:"date",
                            hover_text:"This character's day of birth",
                            classes:["input-override"],
                            value:demographic.date_of_birth.toFormat('yyyy-MM-dd'),
                            onChange: function(ev){
                                console.log('!!!!!');
                                demographic.date_of_birth = luxon.DateTime.fromISO(ev.target.value);
                            }
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