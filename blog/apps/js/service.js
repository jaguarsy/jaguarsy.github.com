"use strict"

angular.module('cageblog')

.factory('db', [
    function() {
        var db = new Firebase("bitcage.firebaseio.com")

        return {
            getDB: function() {
                return db;
            }
        }
    }
])

.factory('account', [
        '$cookies',
        'db',
        '$firebaseAuth',
        '$firebaseObject',
        function($cookies, db, $firebaseAuth, $firebaseObject) {

            var db = db.getDB(),
                auth = $firebaseAuth(db);

            return {
                authorized: function() {
                    return $cookies.uid != null && $cookies.uid != '';
                },

                getCurrent: function() {
                    if (!this.authorized()) return undefined;
                    return $firebaseObject(db.child('users/' + $cookies.uid));
                },

                signIn: function(email, password, callback) {
                    auth.$authWithPassword({
                        email: email,
                        password: password
                    }).then(function(authData) {
                        console.log("Logged in as:", authData.uid);
                        $cookies.uid = authData.uid;
                        if (callback) callback();
                    }).catch(function(error) {
                        alert(error);
                    });

                },

                signOut: function() {
                    $cookies.uid = '';
                    auth.$unauth();
                }
            }
        }
    ])
    .factory('article', [
        'db',
        '$firebaseArray',
        function(db, $firebaseArray) {

            var db = db.getDB(),
                articles = $firebaseArray(db.child('articles'));

            return {
                get: function() {
                    return articles;
                },

                add: function(article, callback) {
                    articles.$add(article).then(function(ref) {
                        if (callback) callback();
                    }).catch(function(error) {
                        alert(error);
                    })
                },

                save: function(target, callback) {
                    articles.$save(target).then(function(ref) {
                        if (callback) callback();
                    }).catch(function(error) {
                        alert(error);
                    });
                },

                remove: function(article, callback) {
                    articles.$remove(article).then(function(ref) {
                        if (callback) callback();
                    }).catch(function(error) {
                        alert(error);
                    })
                }
            }

        }
    ])