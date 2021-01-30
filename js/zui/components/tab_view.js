define([
    "zuiRoot/view_templates/tab_container",
], function (
    zui_tab_container
) {
    var _createTabbingComponent = function (settings) {
        var newComponentWrapper = document.createElement('div');
        newComponentWrapper.classList.add('tabContent');

        var newComponent = document.createElement('div');
        newComponent.classList.add('row');
        newComponent.classList.add('justify-content-center');

        var tabComponent = document.createElement('div');
        tabComponent.classList.add('col-12');

        var theCard = document.createElement('div');
        theCard.classList.add('card');

        var theCardHeader = document.createElement('div');
        theCardHeader.classList.add('card-header');

        var nav = document.createElement('ul');
        nav.classList.add('nav');
        nav.classList.add('nav-tabs');
        nav.classList.add('card-header-tabs');
        nav.id = 'TemplateNav';

        var theCardBody = document.createElement('div');
        theCardBody.classList.add('card-body');

        var tabContent = document.createElement('div');
        tabContent.classList.add('tab-content');

        // rng enables multiple tab groups on a page
        var rng = ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
        var orderedTabList = settings.tabs.sort(function (tabA, tabB) {
            return tabA.tabOrder - tabB.tabOrder;
        });

        for (var key in orderedTabList) {
            // create tab nav
            var tab = settings.tabs[key].tabId;
            var navItem = document.createElement('li');
            navItem.classList.add('nav-item');

            var item = document.createElement('a');
            item.classList.add('nav-link');
            item.id = tab + '-tab-' + rng;
            item.dataset.toggle = 'tab';
            item.href = '#' + tab + '-' + rng;
            item.role = 'tab';
            item.innerText = settings.tabs[key].label || tab;

            if (settings.activeTab === tab) {
                item.classList.add('active');
            }
            navItem.appendChild(item);
            nav.appendChild(navItem);

            // create tab pane
            var tabPane = document.createElement('div');
            tabPane.classList.add('tab-pane');
            tabPane.id = tab + '-' + rng;

            if (settings.activeTab === tab) {
                tabPane.classList.add('active');
            }

            tabContent.appendChild(tabPane);
        }

        console.log('*******');
        var formList = settings.formGroup.querySelectorAll('[data-key]');
        for (var i = 0; i < formList.length; i++) {
            var t = formList[i];
            var key = t.getAttribute('data-key');

            // populate tabs
            var tabSettings = !settings.keyToTabMap.hasOwnProperty(key) ? null : settings.tabs.find(function (ts) { return ts.tabId === settings.keyToTabMap[key]; });
            var defaultTabSettings = settings.tabs.find(function (ts) { return ts.tabId === settings.defaultTab; });
            if (tabSettings) {
                // named tab
                var correspondingTab = tabContent.querySelector('#' + tabSettings.tabId + '-' + rng);
                if (correspondingTab) {
                    console.log(t.ContentName);
                    correspondingTab.appendChild(t);
                    t.setAttribute('tab', tabSettings.tabId);
                }
            } else if (settings.defaultTab) {
                // default aka basic info tab
                var defaultTab = tabContent.querySelector('#' + defaultTabSettings.tabId + '-' + rng);
                if (defaultTabSettings && defaultTab) {
                    defaultTab.appendChild(t);
                    t.setAttribute('tab', defaultTabSettings.tabId);
                }
            }
        }

        theCardHeader.appendChild(nav);
        theCard.appendChild(theCardHeader);
        theCardBody.appendChild(tabContent);
        theCard.appendChild(theCardBody);
        tabComponent.appendChild(theCard);
        newComponent.appendChild(tabComponent);
        newComponentWrapper.appendChild(newComponent);

        newComponentWrapper.id = "tabs_" + rng;
        return newComponentWrapper;
    };

    return {
        init: function (settings) {
            var tab_template = zui_tab_container.compile(settings);
            return tab_template;

            // Start back here... need to ensure who ever is calling this can deal with the view object and not a simple string.
            // return new (Backbone.View.extend({
            //     id: typeof settings.id !== "undefined" ? settings.id :  ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6),
            //     tagName: 'div',
            //     template : zui_tab_container,
            //     render : typeof settings.renderer === "function" ? settings.renderer : function(){
            //         this.el.innerHTML = this.template.compile(settings);

            //         return this;
            //     },
            //     initialize: function() {
            //         //this.listenTo(this.model, 'all', this.onComponentEvent)
            //     },
            //     events : function(){
            //         //event mapping & routing
            //         var defaultEventMapping = {
            //            // 'click' : this.model.onClick
            //         };

            //         // for(var event in settings.events) {
            //         //     if(settings.events.hasOwnProperty(event))
            //         //     {
            //         //         //override default && || add to object
            //         //         defaultEventMapping[event] = settings.events[event];
            //         //     }
            //         // }

            //         return defaultEventMapping;
            //     },
            // }))();
        }
    };
});
