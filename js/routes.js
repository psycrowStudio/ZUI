define(['backbone'], function (backbone) {
    console.log('route start');

    var _router = Backbone.Router.extend({
        routes: {
            '': 'home',
            '/': 'home',
            'phaser': 'phaser',
            'tools/actorEditor': 'ActorEditor_Home'
        },

        home: function (){
            require(['rbssRoot/pages/index'], function(index){});
        },
        phaser: function (){
            require(['zuiRoot/pages/phaser/index'], function(index){});
        },

        ActorEditor_Home: function () {
            require(['rbssRoot/tools/actorEditor/pages/index'], function(index){});
        },
    })

    var zui_router = new _router();
    if(!Backbone.history.start({
        hashChange: false,
        silent: false
    }))
    {
        // 404
    }

    return zui_router;
});