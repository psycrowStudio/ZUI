
//window.




window.rbss.ui.addView("uiSandbox",(function() {
	return  Backbone.View.extend({
		tagName: 'div',  
        model:  this,
		initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
		// template: _.template(...)
		 render: function() {
			this.$el.html(this.template(this.model.attributes));
    		return this;
		},
		//events: {},

		//custom view properties and methods
		//...
	});

    //components that can be tested in the sandbox

})());