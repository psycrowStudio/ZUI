define(['./factories/page_factory',
        './factories/component_factory'],
   // './factories/event_factory',
   // './factories/template_factory',
   // './factories/trigger_factory'                             ], 
    function(pageFactory, componentFactory){//, eventFactory, templateFactory, triggerFactory){
        return {
            page: pageFactory,
            component: componentFactory
            ///event: eventFactory,
           // template: templateFactory,
           // trigger: triggerFactory
        }
    });