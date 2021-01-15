define([
        "mod/templating",
        "mod/dom_helper",
        "text!/rbss/view_templates/ejs/rbss_header.ejs",
        "text!/rbss/view_templates/css/rbss_header.css"
    ],
    function (
        mod_templating,
        mod_dom,
        ejs,
        css
    ) {
        var MODULE_NAME = "rbss_header";
        
        mod_dom.css.addRaw(MODULE_NAME, css);
        
        return mod_templating.buildTemplateHarness({
            key: MODULE_NAME, 
            ejs: ejs,
            context: {
                status: "Loading..."
            }
        });
    }
);