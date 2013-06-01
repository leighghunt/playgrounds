/**
 * Accessible Ratings Widget
 * Simple ratings widget that uses only CSS to highlight ratings stars.
 * It is also keyboard accessible as it uses radio buttons, so conceivably
 * could be placed in a form.
 *
 * CSS courtesy of Lea Verou. Awesome stuff.
 *
 * Options:
 *
 * el       : Absolutely required. This is the element where the widget will be
 *            rendered.
 *
 * name     : Defaults to "rating" if not supplied. But if several ratings widgets will be used
 *            on a form, this should be unique for posting purposes.
 *
 * scale    : Defaults to 5, but should be an int >= 3
 *
 * titles   : array (optional). Will be applied to each input, and also will
 *            display in a message container below the stars. The number of titles
 *            will override the scale. For instance, if you provide a scale of 5, but
 *            only provide 3 titles, only three stars will show up. The converse is
 *            true for more titles than scale.
 *
 * 
 * Public   : setValue - Sets the rating and checks the proper star
 * Methods
 *          : getValue - Gets the current rating value
 *
 * Events   : ratingChanged + {rating : <clicked radio value>}
 *            Subscribe to widget and listen for ratingChanged to respond to event.
 *
 * Notes    : Conceivably, I could have created a backing model for this view, however,
 *            my thinking was that this would act as a sub-view to another model-backed
 *            view. And as we could have several of these on the page, the backing models
 *            would consume memory unncessarily.
 *
 */
var Rating = Backbone.View.extend({
    initialize : function(options) {
        //a rendering el is required
        if (options === undefined || !options.el) {
            throw 'No "el" provided, so widget has nowhere to render';
        }
        
        //the component id ensures that radio buttons remain
        //unique. Otherwise, you can't have multiple rating widgets on a page
        this._componentId = (options && options.id) ? options.id : this.cid;
        if (options && options.name === undefined) {
            throw "No name provided for the component."
        } else {
            this._radioName = options.name;
        }
        
        //sets up this._titles and the number of rating stars
        //to be displayed
        if (options.scale) {
            this._scale = options.scale
        } else {
            throw "scale or titles array not provided in initialization options"
        }
        this.render();
    },
    events : {
        'click input[type="radio"]' : 'handleClick',
        'mouseover label' : 'handleMouseover',
        'mouseout label' : 'handleMouseout'
    },
    /**
     * This is a wierd render in that unlike others where we'll do successive pushes to the html array,
     * we'll be doing unshift for the radio button html, then pushing that join onto the main html.
     * Has to work that way because the radio buttons have to be in reverse order when rendered.
     */
    render : function() {
        //main html
        var html = [];
        var radioHtml = [];
        html.push('<div class="rating">');

        for (var idx=1,len=this._scale;idx<=len;++idx) {
            radioHtml.unshift('<input type="radio" id="star',this._componentId,idx,
                              '" name="',this._radioName,'" value="',idx,'" />');
        }
        html.push(radioHtml.join(''));
        html.push('</div>');
        this.$el.html(html.join(''));
    },
    setValue : function(rating) {
        var radio = $('input[name="' + this._radioName + '"]').filter('[value="'+rating+'"]');
        if (rating > 0 && rating <= this._scale) { 
            //need to see if radio is checked. If not, check it. This will
            //be the case if rating was set externally.
            if (!radio.is(':checked'))
                radio.attr('checked', true);
            this._value = rating;
            this.trigger('ratingChanged',{rating : rating});
        } else {
            console.error('Rating out of range. Rating must be >= 1 and <= ' + this._scale);
        }
    },
    getValue : function() {
        return this._value;
    },                
    /**
    * Gets the current target (radio), gets its value
    * then triggers an event to which listeners can respond.
    */
    handleClick : function(e) {
        this.setValue($('input[name="' + this._radioName + '"]:checked').val());
    },
    /**
    * Mouseovers are weird in that you can't capture the mouseover
    * on the radio because it's completely off the screen. You have to
    * capture it on the label, then get the previous sibling
    */
    handleMouseover : function(e) {

    },
    /**
    * Just clear the message box on mouseout
    */
    handleMouseout : function() {
        
    }
});
