angular.module 'cageblog'

.factory 'db', [
    ->
        db = new Firebase "bitcage.firebaseio.com"
        getDB: -> db
]

.factory 'account', [
        '$cookies'
        'db'
        '$firebaseAuth'
        '$firebaseObject'
        ($cookies, db, $firebaseAuth, $firebaseObject) ->

            db = db.getDB()
            auth = $firebaseAuth db
            
            authorized: -> 
                $cookies.uid isnt undefined

            getCurrent: ->
                return undefined if !this.authorized()
                $firebaseObject db.child 'users/' + $cookies.uid

            signIn: (email, password, callback) ->
                auth
                .$authWithPassword
                    email: email,
                    password: password
                    
                .then (authData) ->
                    $cookies.uid = authData.uid
                    callback() if callback
                    return
                    
                .catch (error) ->
                    alert error
                    return
                return

            signOut: ->
                $cookies.uid = undefined
                auth.$unauth()
                return
    ]

.factory 'article', [
    'db'
    '$firebaseArray'
    (db, $firebaseArray) ->

        db = db.getDB()
        articles = $firebaseArray db.child 'articles'
   
        get: -> articles;

        add: (article, callback) ->

            articles
            .$add article
            .then (ref) -> 
                callback() if callback
                return
            .catch (error) -> 
                alert error
                return
            return

        save: (target, callback) ->
            
            articles
            .$save target
            .then (ref) -> 
                callback() if callback
                return
            .catch (error) -> 
                alert error
                return
            return

        remove: (article, callback) ->
            
            articles
            .$remove article
            .then (ref) -> 
                callback() if callback
                return
            .catch (error) -> 
                alert error
                return
            return
]