define([
    'mod/dom_helper',
    'mod/text',
    'zui',
    "zuiRoot/components/fa_glyph_picker",
    'rbss',
    'rbssRoot/layouts/base_grid',
    // 'rbssRoot/framework/factories/actor',
    "rbssRoot/tools/actorEditor/components/actor_viewer",
    // 'rbssRoot/tools/actorEditor/modules/page',
    // 'rbssRoot/data/data',
    "zuiRoot/components/toolbar",
    "rbssRoot/framework/models/actor"
], function(
    mod_dom,
    mod_text,
    zui,
    zui_glyph_picker,
    rbss,
    layout_base,
    // rbss_actor_factory,
    rbss_actor_view,
    zui_toolbar,
    rbss_actor
    // page_logic,
    // page_data
){
    var MODULE_NAME = "actor_editor_index";
    
    function _generateBaseActor(params){
        var actor_settings = params || null;

        return actor_settings ? new rbss_actor(actor_settings) : new rbss_actor();
    }

    var actor_json = '{"personality":{"state":"EAT"},"id":"A944F5","name":"New Actor","background":"","glyph_code":"","accent_color":"","demographic":{"age":0,"date_of_birth":"2021-03-10T18:47:39.226-06:00","height":0,"weight":0,"race":{"id":"8C3C65","name":"New Actor Race"},"sex":"","archetype":{"id":"8F3D81","name":"New Actor Archetype"},"ethical_alignment":0,"moral_alignment":0},"stats":[],"abilities":[],"talents":[],"traits":[],"modifiers":[],"logbook":{"itinerary":[],"quests":[],"contacts":[],"history":[]},"resources":{"inventory":[],"currencies":[],"property":[],"knowledge":[],"equipment":[]}}';
    var actor_parsed = JSON.parse(actor_json);
    
    var a1 =  new rbss_actor();
    //var a2 =  new rbss_actor(actor_parsed, {parse: true});
    var glyphs = zui_glyph_picker.getGlyphCodes();
    a1.set('glyph_code', glyphs[mod_text.random.int(0, glyphs.length-1)])
    console.log('actor', a1);

    var testPage = zui.types.page.fab({ 
        'title' : 'RBSS Actor Creator Index', 
        'isActive': true,
        'bodyClasses': ['page_grid']
    });
    layout_base.generate(testPage);

    var scroll_box = testPage.findChildView('scrolling_box');
    var actor_viewer = rbss_actor_view.init(scroll_box, '#scrolling_box', a1);


    var context_bar = testPage.findChildView('context_bar');
    var context_bar_test_tools_settings = {
        parent: context_bar,
        insertionSelector: '.lSide',
        buttons: [
            {
                label:"",
                glyph_code:"check-circle",
                hover_text: "Confirmation Dialog Test",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var settings = {
                        typeSettings: {
                            query: "Would you care for some lemonade?",
                            buttonLabels: ['Yes, Please', 'No, thank you']
                        }
                    };

                    var dialog_layer = zui.components.dialogLayer.current();
                    var confirmation = dialog_layer.triggerDialog('confirm', settings).then(function(resolve){
                        console.log('resolved', resolve);
                    }).catch(function(error){});
                        
                }
            },
            {
                label:"",
                glyph_code:"list-ol",
                hover_text: "Multiple Choice Dialog Test",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var settings = {
                        typeSettings: {
                            query: "Pick a number?",
                            buttons: [{
                                label: 'One',
                                value: '1'
                            },
                            {
                                label: 'Two',
                                value: '2'
                            },
                            {
                                label: 'Three',
                                value: '3'
                            },
                            {
                                label: 'Four',
                                value: '4'
                            },{
                                label: 'Five',
                                value: '5'
                            }]
                        }
                    };
    
                    var dialog_layer = zui.components.dialogLayer.current();
                    var confirmation = dialog_layer.triggerDialog('mc', settings).then(function(resolve){
                        console.log('resolved', resolve);
                    }).catch(function(error){
                        console.log('rejected', error);
                    });  
                }
            },
            {
                label:"",
                glyph_code:"text-width",
                hover_text: "Text Input Dialog Test",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var settings = {
                        typeSettings: {
                            query: 'What is your name?',
                            input: 'text',
                            placeholder:"Text placeholder",
                            hoverText: "Some thing to hover"
                        },
                    };
    
                    var dialog_layer = zui.components.dialogLayer.current();
                    var confirmation = dialog_layer.triggerDialog('input', settings).then(function(resolve){
                        console.log('resolved', resolve);
                    }).catch(function(error){
                        console.log('rejected', error);
                    });
                }
            },
            {
                label:"",
                glyph_code:"cog",
                hover_text: "Loading Dialog Test",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var dialog_layer = zui.components.dialogLayer.current();
                    dialog_layer.triggerLoading();

                    setTimeout(function(){
                        dialog_layer.clearLoading();
                    }, 5000);
                }
            },
            {
                label:"",
                glyph_code:"window-restore",
                hover_text: "Custom Dialog Test",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var dialog_layer = zui.components.dialogLayer.current();
                                            
                    var custom_settings = {
                        title: "Some title text",
                        glyph_code: "cog",
                        showOverlay: false,
                        title_bar_buttons: [
                            {
                                label:"",
                                glyph_code:"times",
                                hover_text: "Cancel",
                                classes: ["dismissPanel"],
                                hotkey_code: 27 
                            }
                        ],
                        typeSettings: {
                            content: "<p> custom </p>"
                        },
                    };
                    dialog_layer.triggerDialog("custom", custom_settings);
                }
            },
        ]
    };

    var test_toolbar =  zui_toolbar.init(context_bar_test_tools_settings);

    var context_bar_test_actor_tool_settings = {
        parent: context_bar,
        insertionSelector: '.rSide',
        classes:  ["actor_toolbar"],
        buttons: [
            {
                label:"",
                glyph_code:"plus-square",
                hover_text: "Create New Actor",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    actor_viewer.remove();
                    actor_viewer = rbss_actor_view.init(scroll_box, '#scrolling_box', new rbss_actor());
                    actor_viewer.render();
                }
            },
            {
                label:"",
                glyph_code:"database",
                hover_text: "Loading Actor From DB",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var race = a1.attributes.demographic.race;
                    var model = race.get_model();
                    
                    console.log("RACE", model.random_default_race());
                    console.log("NAME: ", model.random_racial_name({ subtype:"Goblinoid" }, "Male"));
                }
            },
            {
                label:"",
                glyph_code:"save",
                hover_text: "Save Actor",
                disabled: false,
                visible: true,
                onClick:function(view, ev){
                    var dialog_layer = zui.components.dialogLayer.current();
                                            
                    var custom_settings = {
                        title: "Saving Actor Data",
                        glyph_code: "save",
                        title_bar_buttons: [
                            {
                                label:"",
                                glyph_code:"times",
                                hover_text: "Cancel",
                                classes: ["dismissPanel"],
                                hotkey_code: 27 
                            }
                        ],
                        typeSettings: {
                            content: '<div class="actor_json">'+ JSON.stringify(a1.toJSON()) +'</div>'
                        },
                    };
                    dialog_layer.triggerDialog("custom", custom_settings);
                }
            },
        ]
    };

    var actor_toolbar = zui_toolbar.init(context_bar_test_actor_tool_settings);

    testPage.clearExistingBody();
    testPage.redraw();    
});