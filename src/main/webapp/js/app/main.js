window.Product = Backbone.Model.extend({
    urlRoot: "rest/products/",
    defaults: {
        "id": 1,
        "date": "",
        "name": "",
        "price": ""
    }
});

window.ProductCollection = Backbone.Collection.extend({
    model: Product,
    url: "rest/products/"
});

window.ProductListView = Backbone.View.extend({

    el: $('#productList'),

    initialize: function () {
        this.model.bind("add", function (product) {
            $('#productList').append(new ProductListItemView({model: product}).render().el);
        });
    },

    render: function (eventName) {
        _.each(this.model.models, function (product) {
            $(this.el).append(new ProductListItemView({model: product}).render().el);
        }, this);
        return this;
    }
});

window.ProductListItemView = Backbone.View.extend({

    tagName: "li",

    template: _.template($('#product-list-item').html()),

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close: function () {
        $(this.el).unbind();
        $(this.el).remove();
    }
});


window.ProductView = Backbone.View.extend({

    el: $('#mainArea'),

    template: _.template($('#product-details').html()),

    initialize: function () {
        this.model.bind("change", this.render, this);
    },

    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change input": "change",
        "click .save": "saveProduct",
        "click .delete": "deleteProduct"
    },

    change: function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    },

    saveProduct: function () {
        this.model.set({
            date: $('#date').val(),
            name: $('#name').val(),
            price: $('#price').val()

        });
        if (this.model.isNew()) {
            var self = this;
            app.productList.create(this.model, {
                success: function () {
                    app.navigate('products/' + self.model.id, false);
                }
            });
        } else {
            this.model.save();
        }

        return false;
    },

    deleteProduct: function () {
        this.model.destroy({
            success: function () {
                alert('deleted');
                window.history.back();
            }
        });
        return false;
    },

    close: function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});

window.HeaderView = Backbone.View.extend({

    el: $('.header'),

    template: _.template($('#header').html()),

    initialize: function () {
        this.render();
    },

    render: function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click .new": "newProduct"
    },

    newProduct: function (event) {
        app.navigate("products/new", true);
        return false;
    }
});

var AppRouter = Backbone.Router.extend({

    routes: {
        "": "list",
        "products/new": "newProduct",
        "products/:id": "productDetails"
    },

    list: function () {
        this.productList = new ProductCollection();
        var self = this;
        this.productList.fetch({
            success: function () {
                self.productListView = new ProductListView({model: self.productList});
                self.productListView.render();
                if (self.requestedId) self.productDetails(self.requestedId);
            }
        });
    },

    productDetails: function (id) {
        if (this.productList) {
            this.product = this.productList.get(id);
            if (this.productView) {
                this.productView.close();
            }
            this.productView = new ProductView({model: this.product});
            this.productView.render();
        } else {
            this.requestedId = id;
            this.list();
        }
    },

    newProduct: function () {
        if (app.productView) {
            app.productView.close();
        }
        app.productView = new ProductView({model: new Product()});
        app.productView.render();
    }
});
var app = new AppRouter();
Backbone.history.start();
var header = new HeaderView();
/*var productView = new ProductView({model: new Product()});
 productView.render();*/
