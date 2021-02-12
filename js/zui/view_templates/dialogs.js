define([
    "mod/templating",
    "mod/dom_helper",
    "text!/js/zui/view_templates/ejs/dialog_confirm.ejs",
    "text!/js/zui/view_templates/ejs/dialog_input.ejs",
    "text!/js/zui/view_templates/ejs/dialog_mc.ejs",
    "text!/js/zui/view_templates/ejs/dialog_base.ejs",
    "text!/js/zui/view_templates/ejs/dialog_loading.ejs",
    "text!/js/zui/view_templates/css/dialogs.css"
],
function (
    mod_templating,
    mod_dom,
    confirm_ejs,
    input_ejs,
    mc_ejs,
    base_ejs,
    loading_ejs,
    css
) {
    var MODULE_NAME = "dialogs";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return {
        templates:{
            base: mod_templating.buildTemplateHarness({
                key: "base_dialog", 
                ejs: base_ejs,
                // parent model (page / component)
                context: {}
            }),
            loading: mod_templating.buildTemplateHarness({
                key: "loading_dialog", 
                ejs: loading_ejs,
                // parent model (page / component)
                context: {}
            }),
            confirm: mod_templating.buildTemplateHarness({
                key: "confirm_dialog", 
                ejs: confirm_ejs,
                // parent model (page / component)
                context: {}
            }),
            input: mod_templating.buildTemplateHarness({
                key: "input_dialog", 
                ejs: input_ejs,
                // parent model (page / component)
                context: {}
            }),
            mc: mod_templating.buildTemplateHarness({
                key: "mc_dialog", 
                ejs: mc_ejs,
                // parent model (page / component)
                context: {}
            }),
            // text
            // form
            // custom / blank
            // loading 
            // list / gallery view
        }

    };
}
);