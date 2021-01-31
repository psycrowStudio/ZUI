define([
    "mod/templating",
    "mod/dom_helper",
    "text!/rbss/tools/actorEditor/view_templates/ejs/actor_editor.ejs",
    "text!/rbss/tools/actorEditor/view_templates/css/actor_editor.css"
],
function (
    mod_templating,
    mod_dom,
    ejs,
    css
) {
    var MODULE_NAME = "actor_editor";
    mod_dom.css.addRaw(MODULE_NAME, css);

    return mod_templating.buildTemplateHarness({
        key: MODULE_NAME, 
        ejs: ejs,
        // parent model (page / component)
        context: {}
    });
}
);