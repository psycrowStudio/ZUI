define([
    'zuiRoot/components/dialog_layer',
    "mod/templating",
    "text!/js/zui/view_templates/ejs/button_basic.ejs",
], function(
    dialogLayer,
    mod_templating,
    button_basic,
    ){
    return {
        dialogLayer : dialogLayer,
        button_basic: (function(){
            basic_button_template = mod_templating.buildTemplateHarness({
                key: "button_basic", 
                ejs: button_basic,
                context: {}
            });
            
            return {
                init_html: function(settings){
                    return basic_button_template.compile(settings);
                },
                init_dom: function(settings){
                    var button = document.createRange().createContextualFragment(basic_button_template.compile(settings));

                    if(typeof settings.onClick === "function"){
                        button.addEventListener('click', function(ev){
                            settings.onClick(ev);
                        });
                    }

                    return button;
                }
            };
        })()
    };
});