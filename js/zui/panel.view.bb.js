window.rbss.ui.addView("Panel",(function() {
	return  Backbone.View.extend({
		//tagName: 'li',  // div span etc...
		//initialize: function() {},
		// template: _.template(...)
		// render: function() {
			//this.$el.html(this.template(this.model.attributes));
    		//return this;
		//},
		//events: {},

		//custom view properties and methods
		//...
        rect: {
            x:0,
            y:0,
            h:0,
            w:0
        },
        units: {
            x:'px',
            y:'px'
        },
        bounds: {
            x:'fixed',
            y:'fixed'
        },
        isResizable: false,
        isModal: false,
        isMovable: false
	});

})());