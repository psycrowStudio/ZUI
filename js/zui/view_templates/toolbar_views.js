define([
    "mod/templating",
    "mod/dom_helper",
    "text!/js/zui/view_templates/ejs/toolbar_button_basic.ejs",
    "text!/js/zui/view_templates/css/toolbar_views.css"
],
function (
    mod_templating,
    mod_dom,
    toolbar_button_basic,
    css
) {
    var MODULE_NAME = "toolbar_views";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return {
        templates:{
            basic_button: mod_templating.buildTemplateHarness({
                key: "basic_button", 
                ejs: toolbar_button_basic,
                context: {}
            }),
        }
    };
}
);