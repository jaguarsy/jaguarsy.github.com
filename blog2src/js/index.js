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

    var xmlhttp = new XMLHttpRequest();
    var container = $('#container');
    var articles = $('#articles');
    var about = $('#about');
    var hash = getHash();

    Node.prototype.show = function(){
        var siblings = this.parentNode.childNodes;
        [].forEach.call(siblings, function(item){
            item.className = 'hide';
        });
        this.className = '';
    };

    function getHash(url) {
        url = url || location.hash;
        var obj;
        if (!url) {
            return;
        }
        var hash = url.split('#/')[1];
        var group = hash.split('/');
        if (group.length > 0) {
            obj = {};
            obj.type = group[0].toLowerCase();
            obj.url = group[1] ? group[1].toLowerCase() : group[0];
            obj.hash = '#/' + hash;
        }

        return obj;
    }

    function urlClickHandler(event) {
        hash = getHash(event.target.href);
        if (!hash) {
            return;
        }
        history.pushState({
            title: hash.url,
            url: hash.url,
            type: hash.type
        }, hash.url, hash.hash);
    }

    function createArticle(article) {
        var li = document.createElement('li');
        var title = document.createElement('h1');
        var titleText = document.createElement('a');
        var content = document.createElement('div');
        var time = document.createElement('div');
        var tags = document.createElement('div');

        li.className = 'article';
        title.className = 'title';
        content.className = 'content';
        time.className = 'time';
        tags.className = 'tags';
        titleText.href = '#/article/' + article.name;
        titleText.innerText = article.title;
        titleText.addEventListener('click', urlClickHandler);
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
        li.appendChild(content);
        li.appendChild(time);
        li.appendChild(tags);
        return li;
    }

    function initArticleList(tag) {
        articles.innerHTML = '';
        articles.show();
        articleConfig.articles.forEach(function (article) {
            var ele = createArticle(article);

            if (tag && article.tags.indexOf(tag) < 0) {
                return;
            }

            articles.appendChild(ele);
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

    function initArticle(url) {
        ajax('./md/' + url + '.md', function (result) {
            //container.innerHTML = markdown.toHTML(result);
            container.innerHTML = result;
            container.show();

            //[].forEach.call($('pre,code'), function (item) {
            //    hljs.highlightBlock(item);
            //});
        });
    }

    function init(obj) {
        about.className = 'hide';
        if (!obj) {
            initArticleList();
        } else if (obj.type === 'article') {
            initArticle(obj.url);
        } else if (obj.type === 'tag') {
            initArticleList(obj.url);
        } else if (obj.type === 'about') {
            about.show();
        } else {
            initArticleList();
        }
    }

    init(hash);

    window.addEventListener('popstate', function (e) {
        var state = history.state;
        if(!state){
            state = getHash();
        }
        init(state);
    }, false);
})();