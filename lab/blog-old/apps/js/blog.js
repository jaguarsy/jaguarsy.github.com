(function() {
  "use strict";
  angular.module('cageblog', ['ngRoute', 'ngCookies', 'firebase', 'ng.ueditor']).run([
    '$rootScope', '$location', '$cookies', function($rootScope, $location, $cookies) {
      return $rootScope.$on('$routeChangeStart', function(event, next) {
        if (next.authorized && !$cookies.uid) {
          return $location.path('#');
        }
      });
    }
  ]).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: 'apps/views/articles.html',
        controller: 'ArticleCtrl'
      }).when('/login', {
        templateUrl: 'apps/views/login.html',
        controller: 'AccountCtrl'
      }).when('/article/:id', {
        templateUrl: 'apps/views/article.html',
        controller: 'ArticleCtrl'
      }).when('/manage/:id', {
        templateUrl: 'apps/views/manage.html',
        controller: 'ManageCtrl',
        authorized: true
      }).when('/manage', {
        templateUrl: 'apps/views/manage.html',
        controller: 'ManageCtrl',
        authorized: true
      }).when('/about', {
        templateUrl: 'apps/views/about.html'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);

}).call(this);

(function() {
  angular.module('cageblog').controller('AccountCtrl', [
    '$scope', 'account', '$location', function($scope, account, $location) {
      $scope.auth = account.authorized();
      $scope.login = function() {
        $scope.isLoading = true;
        account.signIn($scope.email, $scope.password, function() {
          $scope.email = '';
          $scope.password = '';
          $scope.isLoading = false;
          $scope.isLogin = false;
          $scope.auth = account.authorized();
        });
      };
    }
  ]).controller('ArticleCtrl', [
    '$scope', 'article', 'account', '$routeParams', function($scope, article, account, $routeParams) {
      var id, list;
      list = article.get();
      id = $routeParams.id;
      $scope.articles = list;
      $scope.auth = account.authorized();
      if (id) {
        list.$loaded().then(function() {
          $scope.article = list.$getRecord(id);
        });
      }
    }
  ]).controller('ManageCtrl', [
    '$scope', 'article', 'account', '$location', '$routeParams', function($scope, article, account, $location, $routeParams) {
      var id, list;
      list = article.get();
      id = $routeParams.id;
      $scope.article = {};
      $scope.articles = list;
      $scope.current = account.getCurrent();
      $scope._simpleConfig = {
        autoClearinitialContent: false,
        wordCount: true,
        elementPathEnabled: false
      };
      if (id) {
        list.$loaded().then(function() {
          $scope.article = list.$getRecord(id);
        });
      }
      $scope.add = function() {
        if ($scope.article.$id) {
          article.save($scope.article, function() {
            $scope.article = void 0;
          });
        } else {
          article.add({
            title: $scope.article.title,
            author: $scope.current.nickName,
            category: $scope.article.category,
            description: $scope.article.description,
            time: new Date().getTime(),
            pinned: $scope.article.pinned === true
          }, function() {
            $scope.article = void 0;
          });
        }
      };
      $scope.edit = function(target) {
        $scope.article = target;
      };
      $scope.remove = function(target) {
        article.remove(target);
      };
      $scope.signOut = function() {
        account.signOut();
        $location.path('#');
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('cageblog').directive('cageCategory', [
    function() {
      var link, rand;
      rand = function() {
        return Math.floor(Math.random() * 9);
      };
      link = function(scope, element, attrs) {
        scope.$watch(attrs.cageCategory, function(value) {
          var a, cate, i, len, ref;
          if (!value) {
            return;
          }
          ref = value.split(',');
          for (i = 0, len = ref.length; i < len; i++) {
            cate = ref[i];
            a = angular.element('<a class="post-category" href="javascript:void(0)"></a>');
            a.addClass('post-category-' + rand());
            a.text(cate);
            element.append(a);
          }
        });
      };
      return {
        link: link
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('cageblog').filter('unsafe', [
    '$sce', function($sce) {
      return function(val) {
        if (val === void 0) {
          return "";
        }
        return $sce.trustAsHtml(val);
      };
    }
  ]).filter('summary', [
    function() {
      var getSummary;
      getSummary = function(text) {
        var end_ptn, space_ptn, start_ptn;
        start_ptn = /(<[^>]+>)*/gmi;
        end_ptn = /<\/?\w+>$/;
        space_ptn = /(&nbsp;)*/;
        return text.replace(start_ptn, "").replace(end_ptn).replace(space_ptn, "");
      };
      return function(val) {
        if (val === void 0) {
          return "";
        }
        return getSummary(val);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('cageblog').factory('db', [
    function() {
      var db;
      db = new Firebase("bitcage.firebaseio.com");
      return {
        getDB: function() {
          return db;
        }
      };
    }
  ]).factory('account', [
    '$cookies', 'db', '$firebaseAuth', '$firebaseObject', function($cookies, db, $firebaseAuth, $firebaseObject) {
      var auth;
      db = db.getDB();
      auth = $firebaseAuth(db);
      return {
        authorized: function() {
          return $cookies.uid !== void 0;
        },
        getCurrent: function() {
          if (!this.authorized()) {
            return void 0;
          }
          return $firebaseObject(db.child('users/' + $cookies.uid));
        },
        signIn: function(email, password, callback) {
          auth.$authWithPassword({
            email: email,
            password: password
          }).then(function(authData) {
            $cookies.uid = authData.uid;
            if (callback) {
              callback();
            }
          })["catch"](function(error) {
            alert(error);
          });
        },
        signOut: function() {
          delete $cookies.uid;
          auth.$unauth();
        }
      };
    }
  ]).factory('article', [
    'db', '$firebaseArray', function(db, $firebaseArray) {
      var articles;
      db = db.getDB();
      articles = $firebaseArray(db.child('articles'));
      return {
        get: function() {
          return articles;
        },
        add: function(article, callback) {
          articles.$add(article).then(function(ref) {
            if (callback) {
              callback();
            }
          })["catch"](function(error) {
            alert(error);
          });
        },
        save: function(target, callback) {
          articles.$save(target).then(function(ref) {
            if (callback) {
              callback();
            }
          })["catch"](function(error) {
            alert(error);
          });
        },
        remove: function(article, callback) {
          articles.$remove(article).then(function(ref) {
            if (callback) {
              callback();
            }
          })["catch"](function(error) {
            alert(error);
          });
        }
      };
    }
  ]);

}).call(this);
