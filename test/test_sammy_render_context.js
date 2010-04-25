(function($) {
    with(QUnit) {
            
      context('Sammy', 'RenderContext', {
          before: function() {
            var test_app = new Sammy.Application(function() {
              this.raise_errors = false;
              this.element_selector = '#main';
              this.use(Sammy.Template);
            });
            var test_context = new test_app.context_prototype(test_app, 'get', '#/test/:test', {test: 'hooray'});
            this.runRouteAndAssert = function(callback, test_callback, expects) {
              callback.apply(test_context, [test_context]);
              soon(test_callback, 1, expects);
            };
            $('#test_area').html('');
          }
        })        
        .should('pass rendered data to callback', function() {
          var rdata = null;
          var callback = function(context) {
            context.name = 'test';
            context.class_name = 'class';
            this.render('fixtures/partial.template').then(function(data) {
              Sammy.log('render then', data);
              rdata = data;
            });
          };
          this.runRouteAndAssert(callback, function() {
            equal(rdata, '<div class="class">test</div>', "render contents");
          });
        })
        .should('swap the rendered contents', function() {
          var callback = function(context) {
            this.render('fixtures/partial.template', {class_name: 'class', name:'test'}).swap();
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#main').html(), '<div class="class">test</div>', "render contents");
          });
        })
        .should('add a callback with data', function() {
          var callback = function(context) {
            this.render('fixtures/partial.template', {class_name: 'class', name:'test'}, function(data) {
              $('#test_area').html(data);
            });
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<div class="class">test</div>', "render contents");
          });
        })
        .should('replace with rendered contents', function() {
          var callback = function(context) {
            this.render('fixtures/partial.template', {class_name: 'class', name: 'test2'}).replace('#test_area');
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<div class="class">test2</div>', "render contents");
          });
        })
        .should('append rendered contents', function() {
          var callback = function(context) {
            $('#test_area').html('<div class="original">test</div>')
            this.render('fixtures/partial.template', {class_name: 'class', name: 'test'}).appendTo('#test_area');
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<div class="original">test</div><div class="class">test</div>', "render contents");
          });
        })
        .should('append then pass data to then', function() {
          var callback = function(context) {
            this.load('fixtures/partial.html')
              .appendTo('#test_area')
              .then(function(data) {
                Sammy.log('this', this, 'data', data);
                $(data).addClass('blah').appendTo('#test_area');
              });
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<div class="test_partial">PARTIAL</div><div class="test_partial blah">PARTIAL</div>', "render contents");
          });
        })
        .should('call multiple then callbacks in order', function() {
          var callback = function(context) {
            this.name = 'test';
            this.class_name = 'class';
            this.render('fixtures/partial.template')
              .then(function(data) {
                $(data).addClass('blah').appendTo('#test_area');
              })
              .then(function(data) {
                $(data).addClass('blah2').appendTo('#test_area');
              });
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<div class="class blah">test</div><div class="class blah2">test</div>', "render contents");
          });
        })
        .should('load a file then render', function() {
          var callback = function(context) {
            this.load('fixtures/list.html')
              .replace('#test_area')
              .render('fixtures/partial.template', {name: 'my name', class_name: 'class'})
              .then(function(data) {
                $(data).addClass('blah').appendTo('#test_area ul');
              })
              .then(function(data) {
                $(data).addClass('blah2').appendTo('#test_area ul');
              });
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<ul><div class="class blah">my name</div><div class="class blah2">my name</div></ul>', "render contents");
          });
        })
        .should('load a file then render with the loaded contents', function() {
          var callback = function(context) {
            this.load('fixtures/list.html')
              .render('fixtures/partial.template', {name: 'my name', class_name: 'class'}, function(data) {
                $(this.contents).append(data).appendTo('#test_area');
                return data;
              })
              .then(function(data) {
                $(data).addClass('blah').appendTo('#test_area ul');
              })
              .then(function(data) {
                $(data).addClass('blah2').appendTo('#test_area ul');
              });
          };
          this.runRouteAndAssert(callback, function() {
            equal($('#test_area').html(), '<ul><div class="class">my name</div><div class="class blah">my name</div><div class="class blah2">my name</div></ul>', "render contents");
          });
        })
        .pending('chain multiple renders', function() {
          var callback = function(context) {
            this.render('fixtures/partial.template', {'name': 'name', 'class_name': 'class-name'})
                .render('fixtures/partial.template').appendTo('.class-name');
          };
        })
        .pending('swap data with partial', function() {
          var callback = function(context) {
            this.partial('fixtures/partial.template', {'name': 'name', 'class_name': 'class-name'});
          };
        });
        
      
      
    };
})(jQuery);