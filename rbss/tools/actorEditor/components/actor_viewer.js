define([
        'mod/animation',
        'zui',
        "zuiRoot/components/tab_view",
        "zuiRoot/components/collection_viewer",
        "zuiRoot/components/toolbar",
        "rbssRoot/tools/actorEditor/view_templates/actor_editor",
        "rbssRoot/tools/actorEditor/components/stat_viewer",
        "rbssRoot/framework/models/actor"
    ],
    function (
        mod_animation,
        zui,
        zui_tab_view,
        zui_collection_viewer,
        zui_toolbar,
        actor_editor_template,
        rbss_stat_viewer,
        rbss_actor
    ) {
        var MODULE_NAME = "actor_viewer";
        
        console.log('actor', new rbss_actor());

        return {
            init: function(pm, pms){
                console.log('animation', mod_animation);
                
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
                        "basic_info": {
                            label: "Basic Info",
                            hover: "!!!",
                            order: 0,
                            glyph_code: "info-circle",
                            content: function(tab){
                                var settings = {
                                    dataset: ["One", "Two", "Three"],
                                    autoInsert: false,
                                    generateItemSettings: function(el, i){
                                        return {
                                            label: el.length,
                                            hover_text: el
                                        };
                                    },
                                    onClick:function(view, ev){
                                        console.log("collection-list-item clicked", view.model[ev.currentTarget.id.split('_')[1]]);
                                    }
                                };

                                var list =  zui_collection_viewer.createListViewer(settings);
                                console.log(list);
                                list.render();

                                setTimeout(function(){
                                    list.addItem("Eleven");
                                }, 3000)

                                return list.el;
                            }
                        },
                        "Stats": {
                            label: "Stats",
                            hover: "!!!",
                            order: 0,
                            glyph_code: "sliders",
                            content: function(tab){
                                var stat_viewer = rbss_stat_viewer.init(tr1, '.tabs_content_row', ["STR", "INT", "CHA"] );

                                stat_viewer.render();

                                return stat_viewer.el;
                            }
                        },
                        "demo": {
                            label: "Demographics",
                            hover: "@@@",
                            order: 2,
                            glyph_code: "address-card",
                            content: "<p>Demographics</p>"
                        },
                        "personality": {
                            label: "Personality",
                            hover: "###",
                            order: 4,
                            glyph_code: "user",
                            content: function(tab){
                                var settings = {
                                    dataset: ["AAAA", "BBBBBBB", "CCC"],
                                    autoInsert: false,
                                    generateItemSettings: function(el, i){
                                        return {
                                            label: el.length,
                                            hover_text: el
                                        };
                                    },
                                    onClick:function(view, ev){
                                        console.log("collection-grid-item clicked", view.model[ev.currentTarget.id.split('_')[1]]);
                                    }
                                };

                                var grid =  zui_collection_viewer.createGridViewer(settings);
                                console.log(grid);
                                grid.render();

                                setTimeout(function(){
                                    grid.addItem("DDDDDDDDDDD");
                                }, 3000)

                                return grid.el;
                            }
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
                            glyph_code: "flash",
                            content: function(tab){
                                var skills_view = zui.types.view.fab({
                                    classes:['skills_viewer'],
                                    events: {
                                        "click #btn_1": function(ev){
                                            var settings = {
                                                typeSettings: {
                                                    query: "Would you care for some lemonade?",
                                                    buttonLabels: ['Yes, Please', 'No, thank you']
                                                }
                                            };

                                            var dialog_layer = zui.components.dialogLayer.current();
                                            var confirmation = dialog_layer.triggerDialog('confirm', settings).then(function(resolve){
                                                console.log('resolved', resolve);
                                            }).catch(function(error){
                                                console.log('rejected', error);
                                            });
                                        },
                                        "click #btn_2": function(ev){
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
                                        },
                                        "click #btn_3": function(ev){
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
                                        },
                                        "click #btn_4": function(ev){
                                            var dialog_layer = zui.components.dialogLayer.current();
                                            dialog_layer.triggerLoading();

                                            setTimeout(function(){
                                                dialog_layer.clearLoading();
                                            }, 5000);

                                        },
                                        "click #btn_5": function(ev){
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
                                    template: '\
                                    <button id="btn_1">Confirm</button>\
                                    <button id="btn_2">MC</button>\
                                    <button id="btn_3">Input</button>\
                                    <button id="btn_4">Loading</button>\
                                    <button id="btn_5">Custom Dialog</button>\
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
                            glyph_code: "book",
                            content: "<p>Log Book</p>"
                        },
                        "resources": {
                            label: "Resources",
                            hover: "###",
                            order: 4,
                            glyph_code: "cubes",
                            content: function(tab){
                                var settings = {
                                    buttons: [
                                        {
                                            label:"",
                                            glyph_code:"home",
                                            hover_text: "Home",
                                            disabled: false,
                                            visible: true,
                                            onClick:function(view, ev){
                                                console.log("Home", this);
                                                var glyph = ev.currentTarget.querySelector('.glyph');
                                                if(glyph.classList.contains('fa-' + this.glyph_code)){
                                                    glyph.classList.remove('fa-' + this.glyph_code);
                                                    glyph.classList.add('fa-cog');
                                                }
                                                else {
                                                    glyph.classList.remove('fa-cog');
                                                    glyph.classList.add('fa-' + this.glyph_code);
                                                }
                                            }
                                        },
                                        {
                                            label:"",
                                            glyph_code:"globe",
                                            hover_text: "World Map",
                                            disabled: false,
                                            visible: true,
                                            onClick:function(view, ev){
                                                console.log("World Map", this);
                                            }
                                        },
                                        {
                                            label:"",
                                            glyph_code:"cog",
                                            hover_text: "Settings",
                                            disabled: false,
                                            visible: true,
                                            onClick:function(view, ev){
                                                console.log("Settings", this);
                                            }
                                        },
                                    ],
                                    autoInsert: false
                                };

                                var toolbar =  zui_toolbar.init(settings);
                                toolbar.render();

                                return toolbar.el;
                            }
                        },
                        "preferences": {
                            label: "Preferences",
                            hover: "***",
                            order: 5,
                            glyph_code: "star",
                            content: "<p>Preferences</p>",
                            disabled: true
                        },
                        "art_assets": {
                            label: "Art Assets",
                            hover: "***",
                            order: 6,
                            glyph_code: "folder-open",
                            content: "<p>Art Assets</p>",
                            disabled: true
                        }
                    }
                };

                var tr2 = zui_tab_view.init(tabSettings2);


                actor_viewer.on('post-render', function(data){
                   
                    var photo = actor_viewer.el.querySelector('.photo_box');
                   
                    // //mod_animation.velocity(photo, "fadeIn", { duration: 1500 });
                    // //setTimeout(function(){
                    //     console.log('!! render !!');
                    //     var photo = actor_viewer.el.querySelector('.photo_box');
                    //     // photo.style.opacity = .25;
                    //     // photo.style.opacity = .15;
                    //     mod_animation.velocity(photo, {
                    //         opacity: [ 1, "easeInSine", 0],
                    //         //display: "none"
                    //     }, {
                    //         duration: 1500,
                    //         //loop: true 
                    //     }).then(function(res){
                    //         console.log('!! DONE !!', res);
                    //         // res.velocity(photo, "reverse").then(function(res){
                    //         //     console.log('!! DONE !!', res);
                    //         // });
                    //     });

                    //     // setTimeout(function(){
                    //     //     mod_animation.velocity(photo, "stop");
                    //     // }, 5000);

                    // //}, 1000);




                    var inBoundQ = [
                        // {
                        //    element: photo,
                        //    animation: 'fadeIn'
                        // },
                        {
                            element: photo,
                            animation: 'fadeOut',
                            stayHidden: true
                        }
                    ];

                    //_domReference['closeBtn'].addEventListener('click', function (ev) {
                    //    console.log('close table overlay');
                    //    var outBoundQ = [
                    //        {
                    //            element: _domReference['overlay'],
                    //            animation: 'fadeOut',
                    //            stayHidden: true
                    //        }
                    //    ];

                    //    window['ks'].animation.queueAnimationSequence(outBoundQ).then(function () {
                    //        _domReference['overlay'].parentNode.removeChild(_domReference['overlay']);
                    //    });
                    //});


                    mod_animation.queueAnimationSequence(inBoundQ).then(function(res){
                        console.log('!! DONE !!', res);
                    });







                });

                return actor_viewer;
            },
            //load
            //refresh
            //exportToJSON

        };
    }
);