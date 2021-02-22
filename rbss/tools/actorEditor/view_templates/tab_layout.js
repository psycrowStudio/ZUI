define([
    "mod/templating",
    "mod/dom_helper",
    "text!/rbss/tools/actorEditor/view_templates/ejs/tab_layout.ejs",
    "text!/rbss/tools/actorEditor/view_templates/css/tab_layout.css"
],
function (
    mod_templating,
    mod_dom,
    ejs,
    css
) {
    var MODULE_NAME = "tab_layout";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return mod_templating.buildTemplateHarness({
        key: MODULE_NAME, 
        ejs: ejs,
        // parent model (page / component)
        context: {}
    });
}
);