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
                var actor_viewer = zui.types.view.fab( {
                    parent: pm, 
                    insertionSelector: pms,
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
                            content: function(tab){
                                var skills_view = zui.types.view.fab({
                                    classes:['skills_viewer'],
                                    events: {
                                        "click #btn_1": function(ev){
                                            var settings = {
                                                type:'confirm',
                                                typeSettings: {
                                                    query: "Would you care for some lemonade?",
                                                    buttonLabels: ['Accept', 'Cancel']
                                                }
                                            };

                                            var dialog_layer = zui.components.dialogLayer.current();
                                            var confirmation = dialog_layer.triggerDialog(settings).then(function(resolve){
                                                console.log('resolved', resolve);
                                            }).catch(function(error){
                                                console.log('rejected', error);
                                            });
                                        },
                                        "click #btn_2": function(ev){
                                            var settings = {
                                                type:'mc',
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
                                            var confirmation = dialog_layer.triggerDialog(settings).then(function(resolve){
                                                console.log('resolved', resolve);
                                            }).catch(function(error){
                                                console.log('rejected', error);
                                            });                            
                                        },
                                        "click #btn_3": function(ev){
                                            var settings = {
                                                type:'inputField',
                                                typeSettings: {
                                                    query: 'What is your name?',
                                                    subtype: 'text',
                                                    buttonLabels: ['Make introduction', 'Nevermind']
                                                },
                                            };
                            
                                            var dialog_layer = zui.components.dialogLayer.current();
                                            var confirmation = dialog_layer.triggerDialog(settings).then(function(resolve){
                                                console.log('resolved', resolve);
                                            }).catch(function(error){
                                                console.log('rejected', error);
                                            });
                                        },
                                        "click #btn_4": function(ev){
                                            console.log("Button 4 clicked...");

                                        },
                                        "click #btn_5": function(ev){
                                            console.log("Button 5 clicked...");

                                        }
                                    },
                                    template: '\
                                    <button id="btn_1">Confirm</button>\
                                    <button id="btn_2">MC</button>\
                                    <button id="btn_3">Input</button>\
                                    <button id="btn_4">Button 4</button>\
                                    <button id="btn_5">Button 5</button>\
                                    ',
                                    autoInsert: false
                                });

                                skills_view.render();
                                return skills_view.el;
                            }
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

                var tr2 = zui_tab_view.init(tabSettings2);

                return actor_viewer;
            },
            //load
            //refresh
            //exportToJSON

        };
    }
);