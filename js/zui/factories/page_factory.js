define(['backbone',
        'zuiRoot/common',
        'zuiRoot/types',
        'zuiRoot/logger'], function(Backbone, Common, Types, Logger){
    var pm = this;
    var _activePage = null;
    var _previousPage = null;
    var _pages = new Backbone.Collection(null, { model: Types.Page });
    
    // TODO -- sub to the router events when router is enabled
    // var _defaultPageEvents = {
    //     "activePageChanged": pagesEventListener
    // };

    return {
        addPage : function( page ) { 
            if(page instanceof Types.Page)
            {
                console.log('PAGE ADD:', _pages.add(page)); 
                
                var match = _pages.get(page); 
                return match;
            }
        },
        draw : function(){ 
            if(_activePage) {
               _activePage.redraw(); 
            }
        },
        setActivePage : function(page){
            var match = _pages.get(page);

            if(!match && page instanceof Types.Page)
            {
                _pages.add(page);
                _previousPage = _activePage;
                if(_previousPage)
                {
                    _previousPage.set('isActive', false);
                }

                 _activePage = _pages.get(page);
                if(_activePage)
                {
                    _activePage.set('isActive', true);
                }
            }
            else if(match)
            {
                  _previousPage = _activePage;
                if(_previousPage)
                {
                    _previousPage.set('isActive', false);
                }
                
                 _activePage = match;
                if(_activePage)
                {
                    _activePage.set('isActive', true);
                }
            }
            
            this.draw();
        },

        instantiatePage : function( settings ) {
            var nuevo = new Types.Page({
                title : (settings && settings.title) ? settings.title : 'New Page',
                isActive : (settings && settings.isActive) ? settings.isActive : false,
                events : settings.events
            });
            return nuevo;
        },
    };
});
