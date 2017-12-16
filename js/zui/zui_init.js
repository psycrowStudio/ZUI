define(['zuiRoot/common', 
    'zuiRoot/types', 
    'zuiRoot/logger',
    'zuiRoot/fact'
], 
    function(common, types, logger, factories){ 
        logger.subscribe('zui-all', 'zui-load', function(options) {
            logger.log('All ZUI modules loaded!', { tags: 'ZUI', logLevel:1 });
        });

        return {
            common: common,
            logger: logger,
            types: types,
            factory: factories
        }
    });