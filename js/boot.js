requirejs.config({
    baseUrl: "./js/",
    
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min',
        underscore: '3rdParty/underscore.amd',  
        backbone: '3rdParty/backbone.amd',
        //d3: 'js/3rdParty/d3.v3.min.js',
        zui: 'zui/zui_init',
        zuiRoot: 'zui/',
        
        rbss: '../rbss/framework/init',
        rbssRoot: '../rbss/'
        // FRAMEWORKS
        //zui: 'zui/'
        // rbss: 'js/framework/init.js'
    }
});

var bootScript = document.querySelector('#data-main');
var initalPage = bootScript ? bootScript.getAttribute('data-initalPage') : "";

require(['zui', initalPage, 'backbone'], function(zui, index, Backbone) {
    zui.logger.log('Zui Loaded!', { tags:'zui-all', eventName: 'zui-load' });

   // console.log(zui.factory['trigger'].fabricate());

    // var t1 =  zui.types.Trigger.fab({"id":"1111"});
    // t1.listenTo(t1, 'all', function(input){ console.log(arguments, input);});  
    // var t2 =  zui.types.Trigger.fab(); 

    // console.log(t2.get('superScore'));
    // t1.prime();

    //require(['page/home']);
    // require(['zui/zui_init'], function(zui) {
    //     //     //require(['page/home']);
       //zui.logger.eventChannels['zui-all'].trigger('zui-load', {});
    // });
});