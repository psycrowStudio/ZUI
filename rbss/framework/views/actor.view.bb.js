//TODO move the templates to their own separate files.
window.rbss.viewManager.addView("Actor",(function() {
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



	});

})());

//http://stackoverflow.com/questions/20730201/load-template-by-url-in-backbone-js
// var template = $.get("/templates/needed_template.html")
//                         .done(function (res) {
//                             ns.myView = new MyView({template: res});
//                             ns.myView.render();
//                         })


//                         initialize: function() {
//    this.template = _.template(this.options.template);