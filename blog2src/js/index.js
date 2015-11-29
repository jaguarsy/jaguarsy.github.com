/**
 * Created by johnnycage on 15/11/23.
 */
(function () {
    'use strict';

    function $(selector) {
        if (selector.indexOf('#') > -1) {
            return document.querySelector(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    }

    var xmlhttp = new XMLHttpRequest(),
        $container = $('#container'),
        $content = $('#content'),
        $prev = $('#prev-pager'),
        $prevTitle = $prev.querySelector('a'),
        $next = $('#next-pager'),
        $nextTitle = $next.querySelector('a'),
        $articles = $('#articles'),
        $about = $('#about'),
        $keyword = $('#keyword'),
        $title = $('#title'),
        $time = $('#time'),
        $searchform = $('#search-form'),
        $time = $('#time'),
        hash = getHash();

    Node.prototype.show = function () {
        this.classList.remove('hide');
    };

    Node.prototype.hide = function () {
        this.classList.add('hide');
    };

    Node.prototype.radioShow = function () {
        var siblings = this.parentNode.childNodes;
        [].forEach.call(siblings, function (item) {
            item.hide();
        });
        this.show();
    };

    function getHash(url) {
        url = url || location.hash;
        if (!url) {
            return;
        }
        var obj,
            hash = url.split('#/')[1],
            group = hash.split('/');
        if (group.length > 0) {
            obj = {};
            obj.type = group[0];
            obj.url = group[1] ? group[1] : group[0];
            obj.hash = '#/' + hash;
        }

        return obj;
    }

    function urlClickHandler(event) {
        hash = getHash(event.target.href);
        if (!hash || location.hash === hash.hash) {
            return false;
        }
        history.pushState({
            title: hash.url,
            url: hash.url,
            type: hash.type
        }, hash.url, hash.hash);

        return false;
    }

    function createArticle(article) {
        var li = document.createElement('li'),
            title = document.createElement('h1'),
            titleText = document.createElement('a'),
            content = document.createElement('div'),
            time = document.createElement('div'),
            tags = document.createElement('div');

        li.className = 'article';
        title.className = 'title';
        content.className = 'content';
        time.className = 'time';
        tags.className = 'tags';
        titleText.href = '#/article/' + article.name;
        titleText.innerText = article.title;
        titleText.addEventListener('click', urlClickHandler);
        article.time = article.time.replace('-', '/');
        time.innerText = new Date(article.time).toDateString();

        article.tags.forEach(function (value) {
            var tag = document.createElement('a');
            tag.className = 'tag';
            tag.innerText = value;
            tag.href = '#/tag/' + value;
            tag.addEventListener('click', urlClickHandler);

            tags.appendChild(tag);
        });

        title.appendChild(titleText);
        li.appendChild(title);
        li.appendChild(time);
        li.appendChild(tags);
        li.appendChild(content);
        return li;
    }

    function initArticleList(tag) {
        var keyword = $keyword.value,
            hash = getHash();
        tag = tag || (hash && hash.url) || '';

        $articles.innerHTML = '';
        $articles.radioShow();
        articleConfig.articles.forEach(function (article) {
            var ele = createArticle(article);

            if ((!tag || article.tags.indexOf(tag) > -1) &&
                (!keyword || article.title.indexOf(keyword) > -1)) {
                $articles.appendChild(ele);
            }
        });
    }

    function ajax(url, callback) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send(null);
    }

    function getPrevAndNext(name) {
        var prev, next, article;

        for (var i = 0, len = articleConfig.articles.length; i < len; i++) {
            article = articleConfig.articles[i];
            var nextIndex = i + 1;

            next = nextIndex >= len ? undefined : articleConfig.articles[nextIndex];

            if (article.name === name) {
                return {prev: prev, current: article, next: next};
            }

            prev = article;
        }

        return {};
    }

    function initArticle(url) {
        ajax('./md/' + url + '.md', function (result) {
            var siblings = getPrevAndNext(url);
            if (siblings.prev) {
                $prevTitle.href = '#/article/' + siblings.prev.name;
                $prevTitle.innerText = siblings.prev.title;
                $prev.show();
            } else {
                $prev.hide();
            }

            if (siblings.next) {
                $nextTitle.href = '#/article/' + siblings.next.name;
                $nextTitle.innerText = siblings.next.title;
                $next.show();
            } else {
                $next.hide();
            }

            $title.innerText = siblings.current.title;
            $time.innerText = siblings.current.time;

            $content.innerHTML = result;
            $container.radioShow();
        });
    }

    function init(obj) {
        $about.hide();
        if (!obj) {
            initArticleList();
        } else if (obj.type === 'article') {
            initArticle(obj.url);
        } else if (obj.type === 'tag') {
            initArticleList(obj.url);
        } else if (obj.type === 'about') {
            $about.radioShow();
        } else {
            initArticleList();
        }
    }

    init(hash);

    $searchform.onsubmit = function () {
        location.hash = '#/';
        initArticleList();
        return false;
    };

    $keyword.addEventListener('keyup', function () {
        location.hash = '#/';
        initArticleList();
    });

    window.addEventListener('popstate', function (e) {
        var state = history.state;
        if (!state) {
            state = getHash();
        }
        init(state);
    }, false);
})();