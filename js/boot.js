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

require(['zui','pages/index/index', 'backbone'], function(zui, index, Backbone) {
    zui.logger.log('Zui Loaded!', { tags:'zui-all', eventName: 'zui-load' })

   // console.log(zui.factory['trigger'].fabricate());

    var t1 =  zui.types.Trigger.fab({"id":"1111"});
    t1.listenTo(t1, 'all', function(input){ console.log(arguments, input);});  
    var t2 =  zui.types.Trigger.fab();  
    
    var t3 = new zui.types.Trigger();  
    var t4 = new zui.types.Trigger({"id":"0000"});  

     t1.setProp(156);
     t2.setProp(333);
     t3.setProp(999);
     t4.setProp(888);

    console.log(t1.get('id'), t2.get('id'));
    console.log(t3.getProp(156), t4.getProp(156));
    console.log(t1 instanceof zui.types.Trigger);
    console.log(t3 , t4);

    t1.trigger('tEvent', { level : 0 });

    //require(['page/home']);
    // require(['zui/zui_init'], function(zui) {
    //     //     //require(['page/home']);
       //zui.logger.eventChannels['zui-all'].trigger('zui-load', {});
    // });
});