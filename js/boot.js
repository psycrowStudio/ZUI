requirejs.config({
    // appDir: window["s5config"]["domain_root"],
    // baseUrl: window["s5config"]["static_root"],
    appDir: window.location.origin,
    baseUrl: window.location.origin + "/js", //"./js/",
    shim: {
        // for non-AMD libraries
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: { exports: "_" },
        jquery: { exports: '$' },
        luxon: { exports: 'luxon' },
        Phaser: { exports: 'Phaser' },
    },
    paths: {
        "router": "./routes",

        // requireJS plugins
        "text": './3rdParty/require_text',
        underscore: './3rdParty/underscore.amd',  
        backbone: './3rdParty/backbone.amd',
        
        'velocity-animate': './3rdParty/velocity.min',
        //d3: 'js/3rdParty/d3.v3.min.js',

        zui: './zui/zui_init',
        zuiRoot: 'zui',
        
        rbss: '../rbss/framework/init',
        rbssRoot: '../rbss',
        // FRAMEWORKS
        //zui: 'zui/'
        // rbss: 'js/framework/init.js'

        // 3P shim modules
        jquery: 'https://code.jquery.com/jquery-3.4.1.min',
        luxon: 'https://cdn.jsdelivr.net/npm/luxon@1.25.0/build/global/luxon.min',
        
        Phaser: './3rdParty/phaser.min',

        // mapping to hosted 3p libraries
        '3p': './3rdParty',

        //mapping to our client modules
        'mod': './modules',

        //mapping to our client view logic
        //'s5-view-logic': window["s5config"]["static_root"] + 'js/view_helpers',

        //mapping to our client view templates
        //'s5-view-template': window["s5config"]["static_root"] + 'view_templates'
    },
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    }
});

//var bootScript = document.querySelector('#data-main');
//var initalPage = bootScript ? bootScript.getAttribute('data-initalPage') : "";

require([
    'zui', 
    // initalPage, 
    'backbone',
    'mod/backbone_extensions',
    'jquery',
    'underscore',
    'luxon',
    'router',
    "mod/dom_helper",
    'text!/js/zui/styles/zui.css'
], function(
    zui, 
    // index, 
    backbone,
    backbone_extensions,
    jquery,
    underscore,
    luxon,
    router,
    mod_dom,
    css
) {
    var MODULE_NAME = "zui";
    mod_dom.css.addRaw(MODULE_NAME, css);

    console.log('ZUI initialized');
    zui.logger.log('Zui Loaded!', { tags:'zui-all', eventName: 'zui-load' });
      
        
    //     // some code here 
    // });


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