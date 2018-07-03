define(['./factories/page_factory',
        './factories/component_factory'],
    function(pageFactory, componentFactory){
        return {
            page: pageFactory,
            component: componentFactory,
        }
    });