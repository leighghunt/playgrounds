// AdminLogin
// ----------
// View. Login form that integrates with `bones-admin` toolbar as an auth view.
view = views.Main.extend({
    admin: null,

    context: null,

    events: {
        'click input[type=submit]': 'auth',
        'click #logout': 'logout'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', 'auth','logout');

       

       
    },

    render: function() {
        $(this.el).html(templates['Secret']());
        //this.context.prepend(this.el);
        return this;
    },

		logout: function() {
			this.model.logout(this.model.get('id'));
			return false;
		},
    auth: function() {
        this.model.login({
            id: this.$('input[name=username]').val(),
            password: this.$('input[name=password]').val()
        });
        return false;
    }
});