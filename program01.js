(function(){
  var mammal,cat,my_cat;
  mammal = {
    name: 'A mammal',
    get_name: function() {
      return this.name;
    },
    says: function() {
      return this.saying || '';
    }
  };

  cat = coot.create(mammal);
  cat.name = 'Cat';
  cat.saying = 'Meow';

  my_cat = coot.create(cat);
  my_cat.name = 'Mr. Biggles';
  my_cat.saying = 'uh uh meow';

  coot.log('mammal name: ' + mammal.get_name() + ' says: ' + mammal.says());
  coot.log('cat name: ' + cat.get_name() + ' says: ' + cat.says());
  coot.log('my_cat name: ' + my_cat.get_name() + ' says: ' + my_cat.says());
})();
