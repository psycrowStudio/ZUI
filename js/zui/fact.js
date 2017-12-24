define(['./factories/page_factory',
        './factories/component_factory',
        './factories/trigger_factory'],
    function(pageFactory, componentFactory, triggerFactory){//, eventFactory, templateFactory, triggerFactory){
        return {
            page: pageFactory,
            component: componentFactory,
            ///event: eventFactory,
           // template: templateFactory,
            trigger: triggerFactory
        }
    });