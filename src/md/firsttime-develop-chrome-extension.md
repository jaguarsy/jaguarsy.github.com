上周写了段脚本, 我想着是不是开发成一个chrome插件让它能够定时地而且持久性地在指定页面中运行, 于是乎抽空研究了chrome extension地官方文档, 
写了个小小的插件, 也算勉强入了门了.

由于是初次开发chrome插件, 不出意外地遇到了很多的坑. 这也是我写这篇文章的主要目的, 记录一下我所遇到的一些问题作为备忘.

首先是开发chrome插件过程中(我认为)最关键的一个步骤, 也就是配置manifest.json文件. manifest.json是chrome插件在chrome中启动时第一时间需要读取的配置文件, 
里面的配置项数不胜数, 这边我就先列出我的配置内容:

    {
      "name": "XXX",                            //项目名
      "description": "xxx",                     //项目描述
      "version": "0.1",                         //项目版本
      "permissions": [                          //脚本权限
        "tabs",                                     //读取以及操作所有tab的权限
        "storage",                                  //读取以及操作storage的权限
      ],
      "content_scripts": [                      //由chrome在启动插件时自动隐式注入到指定页面的文件的配置项
        {
          "matches": [      
            "http://xxxxxxxx.com/*"                 //注入的域名规则
          ],
          "js": [                                   //需要注入的js文件列表
            "js/content.js"             
          ],
          "css": [                                  //需要注入的css文件列表
            "css/content.css"
          ]
        }
      ],
      "background": {                           //插件默认启动的后台脚本配置项
        "scripts": [                                //js文件列表
          "js/background.js"
        ],
        "persistent": false                         //不明
      },
      "web_accessible_resources": [             //content_scripts以及background能够操作的资源文件列表
        "js/script.js",
        "js/stop.js"
      ],
      "browser_action": {                       //在地址栏右侧的插件小图标的配置项
        "default_title": "Click to start",          //默认标题, 鼠标悬停时显示
        "default_icon": "images/icon.png"           //默认图标
      },
      "icons": {                                //chrome插件本身的产品图标
        "128": "images/icon.png"                    //128*128像素的图标配置项
      },
      "manifest_version": 2                     //当前用到的manifest文件版本, 最新是2.0
    }