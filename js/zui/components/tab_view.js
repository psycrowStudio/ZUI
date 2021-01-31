define([
    'zui',
    "zuiRoot/view_templates/tab_container",
    'mod/dom_helper'
], function (
    zui,
    zui_tab_container,
    mod_dom
) {

    var _sortTabs= function(current){
        var sort_arr = [];

        for(key in current){
            var agg = current[key];
            agg.key = key;
            sort_arr.push(agg);
        }

        return sort_arr.sort(function(ia, ib){ return ia.order - ib.order; })
        .reduce(function(acc, el){
            var key = el.key;
            delete el.key;
            acc[key] = el;
            return acc;
        }, {});
    };

    return {
        init: function (settings) {
            settings.tabs = _sortTabs(settings.tabs);
            
            var tabs_content_row = null;

            
            var _tab_view = zui.types.component.fab( {
                id: ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6), 
                parentModel: settings.pm, 
                parentElementSelector: settings.pms,
                classes:['tab_view'],
                events: {
                    "click .zui-tab":function(ev){
                        console.log("tab_clicked");
                        if(settings.tabs.hasOwnProperty(ev.target.id)){
                            if(ev.target.classList.contains('active')){
                                return;
                            }

                            // fire event - before_tab_change?
                            // save tab content state? session? internal var?

                            var all_tabs = Array.from(_tab_view.view.el.querySelectorAll('.zui-tab'));
                            all_tabs.forEach(function(el){
                                el.classList.remove('active');
                            });

                            ev.target.classList.add('active');
                            // save tab state? session? internal var?

                            // fire event - after tab change?

                            // TODO flesh this out for sub components, helper methods etc...
                            if(!tabs_content_row){
                                tabs_content_row = _tab_view.view.el.querySelector('.tabs_content_row');
                            }
                            mod_dom.clearChildren(tabs_content_row);
                            tabs_content_row.innerHTML = settings.tabs[ev.target.id].content;


                            // TODO set default active tab
                            // investigate component creation with and without children
                            // render methods, process callbacks etc
                        }
                    }
                },
                template: zui_tab_container.compile(settings),
            });

            //listenToOnce
            _tab_view.view.listenToOnce(_tab_view.view, "render", function(ev){
                // on inital render, set the default tabs
                var content_row = _tab_view.view.el.querySelector('.tabs_content_row');
                var active_tab = settings.activeTab ? _tab_view.view.el.querySelector('#' + settings.activeTab) : _tab_view.view.el.querySelector('.tabs_row > .zui-tab:first-child');

                if(active_tab && content_row){
                    active_tab.classList.add('active');
                    content_row.innerHTML = settings.tabs[active_tab.id].content;
                }
            });

            return _tab_view;
        }
    };
});
