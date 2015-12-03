angular.module 'cageblog' 

.controller 'AccountCtrl', [
    '$scope'
    'account'
    '$location'
    ($scope, account, $location) ->

        $scope.auth = account.authorized();

        $scope.login = ->
            $scope.isLoading = true
            account.signIn $scope.email, $scope.password, ->
                $scope.email = ''
                $scope.password = ''
                $scope.isLoading = false
                $scope.isLogin = false
                $scope.auth = account.authorized();
                return
            return
        return

]

.controller 'ArticleCtrl', [
    '$scope'
    'article'
    'account'
    '$routeParams'
    ($scope, article, account, $routeParams) ->

        list = article.get()
        id = $routeParams.id

        $scope.articles = list
        $scope.auth = account.authorized()

        if id
            list.$loaded().then ->
                $scope.article = list.$getRecord id
                return

        return
]

.controller 'ManageCtrl', [
    '$scope'
    'article'
    'account'
    '$location'
    '$routeParams'
    ($scope, article, account, $location, $routeParams) ->

        list = article.get()
        id = $routeParams.id

        $scope.article = {}
        $scope.articles = list
        $scope.current = account.getCurrent()

        $scope._simpleConfig =
            autoClearinitialContent: false
            wordCount: true
            elementPathEnabled: false

        if id
            list.$loaded().then ->
                $scope.article = list.$getRecord id
                return

        $scope.add = () ->
            if $scope.article.$id
                article.save $scope.article, ->
                    $scope.article = undefined
                    return
                return
            else
                article.add
                    title: $scope.article.title
                    author: $scope.current.nickName
                    category: $scope.article.category
                    description: $scope.article.description
                    time: new Date().getTime()
                    pinned: $scope.article.pinned == true
                , -> 
                    $scope.article = undefined
                    return
                return

        $scope.edit = (target) ->
            $scope.article = target
            return

        $scope.remove = (target) ->
            article.remove target
            return

        $scope.signOut = ->
            account.signOut()
            $location.path '#'
            return
        return
]