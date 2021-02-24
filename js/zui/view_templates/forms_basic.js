define([
    "mod/templating",
    "mod/dom_helper",
    // "text!/js/zui/view_templates/ejs/dialog_info.ejs",
    // "text!/js/zui/view_templates/ejs/dialog_input.ejs",
    // "text!/js/zui/view_templates/ejs/dialog_mc.ejs",
    // "text!/js/zui/view_templates/ejs/dialog_base.ejs",
    // "text!/js/zui/view_templates/ejs/dialog_loading.ejs",
    "text!/js/zui/view_templates/css/forms_basic.css"
],
function (
    mod_templating,
    mod_dom,
    // info_ejs,
    // input_ejs,
    // mc_ejs,
    // base_ejs,
    // loading_ejs,
    css
) {
    var MODULE_NAME = "forms_basic";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return {
        templates:{
            // base: mod_templating.buildTemplateHarness({
            //     key: "base_dialog", 
            //     ejs: base_ejs,
            //     // parent model (page / component)
            //     context: {}
            // }),
        }

    };
}
);