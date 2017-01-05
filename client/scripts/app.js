//MODEL
var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // your code here
    if (this.get('like') === true) {
      this.set('like', false);
    } else {
      this.set('like', true);
    }

  }

});

//COLLECTION
var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    this.on('change:like', this.sort);
  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here
    // console.log(this);
    this.comparator = field;
    this.sort();
  },

  sort: function() {
    // this.set('sorted', true);
    var comparator = this.comparator;
    this.models.sort(function(a, b) {
      // console.log(a.get('title'));
      a.get(comparator) > b.get(comparator);
    });
    console.log(this);
    console.log('sorted');

    /*var datum = [
    {
      title: 'Primer',
      year: 2004,
      rating: 9
    },
    {
      title: 'Back to the Future',
      year: 1985,
      rating: 10
    }
  ];*/
  }

});

//VIEW for COLLECTION
var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

//VIEW for each movie
var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    this.model.on('change', function() {
      this.render();
    }, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // your code here
    // this.collection.on('change:comparator', this.render);
    // this.collection.on('all', this.render);
    this.collection.on('change:attributes', this.render);
    // this.collection.on('change:sorted', this.render);

  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
