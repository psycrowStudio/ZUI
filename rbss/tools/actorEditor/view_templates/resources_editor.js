define([
    "mod/templating",
    "mod/dom_helper",
    "text!/rbss/tools/actorEditor/view_templates/ejs/resources_editor.ejs",
    "text!/rbss/tools/actorEditor/view_templates/css/resources_editor.css"
],
function (
    mod_templating,
    mod_dom,
    ejs,
    css
) {
    var MODULE_NAME = "resources_editor_template";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return mod_templating.buildTemplateHarness({
        key: MODULE_NAME, 
        ejs: ejs,
        // parent model (page / component)
        context: {}
    });
}
);