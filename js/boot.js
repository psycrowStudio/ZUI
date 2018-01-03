requirejs.config({
    baseUrl: "./js/",
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min',
        underscore: '3rdParty/underscore.amd',  
        backbone: '3rdParty/backbone.amd',
        //d3: 'js/3rdParty/d3.v3.min.js',
        zui: 'zui/zui_init',
        zuiRoot: 'zui/'
        // FRAMEWORKS
        //zui: 'zui/'
        // rbss: 'js/framework/init.js'
    }
});

require(['zui','pages/index/index'], function(zui) {
    zui.logger.log('Zui Loaded!', { tags:'zui-all', eventName: 'zui-load' })

    console.log(zui.factory['trigger'].fabricate());

    var t1 = new zui.types.Trigger.fabricate();  
    var t2 = new zui.types.Trigger.fabricate();  

    t1.setProp(156);
    t2.setProp(333);

    console.log(t1.getProp(), t2.getProp());

    //require(['page/home']);
    // require(['zui/zui_init'], function(zui) {
    //     //     //require(['page/home']);
       //zui.logger.eventChannels['zui-all'].trigger('zui-load', {});
    // });
});