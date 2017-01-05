//MODEL
var Movie = Backbone.Model.extend({

  defaults: {
    like: true,
    index: 0
  },

  toggleLike: function() {
    // your code here
    if (this.get('like') === true) {
      this.set('like', false);
    } else {
      this.set('like', true);
    }

  },

});

//COLLECTION
var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    //console.log(this)
    this.on('change:like', this.sort);
  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here
    // console.log(this);
    this.comparator = field;
    this.sort();
  },

  sortCount: 0,

  sort: function() {
    // this.set('sorted', true);
    var comparator = this.comparator;
    //console.log(comparator);
    this.models.sort(function(a, b) {
      // console.log(a.get('title'));
      if (a.get(comparator) < b.get(comparator)) {
        return -1;
      }
      if (a.get(comparator) > b.get(comparator)) {
        return 1;
      }
    });
    this.models.forEach(function(model) {
      var current = model.get('index');
      model.set('index', current + 1);
      console.log(model.get('index'));
    }, this);

    //console.log(this);
    //console.log('sorted');
    this.sortCount++;

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
    this.collection.on('change:index', function() {
      this.render();
    }, this);
    // this.collection.on('change:sorted', this.render);
    //console.log(this.collection.get('sortCount'));
  },

  render: function() {
    console.log('render');
    //debugger;
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
