define(['backbone'], function (backbone) {
    console.log('route start');

    var _router = Backbone.Router.extend({
        routes: {
            '': 'home',
            '/': 'home',
            'tools/actorEditor': 'ActorEditor_Home'
        },

        home: function (){
            // ../rbss/tools/actorEditor/pages/index
            //../rbss/pages/index
            console.log('home initialized');
            require(['rbssRoot/pages/index'], function(index){
                console.log('index initialized');
            });

        },

        ActorEditor_Home: function () {
            console.log('ActorEditor_Home initialized');
            require(['rbssRoot/tools/actorEditor/pages/index'], function(index){
                console.log('actorEditor initialized');
            });
        },
    })

    var zui_router = new _router();
    Backbone.history.start({
        hashChange: false,
        silent: false
    });

    return zui_router;
});