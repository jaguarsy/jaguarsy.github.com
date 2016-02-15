<p>上周写了段脚本, 我想着是不是开发成一个chrome插件让它能够定时地而且持久性地在指定页面中运行, 于是乎抽空研究了chrome extension地官方文档, 
写了个小小的插件, 也算勉强入了门了.</p>
<p>由于是初次开发chrome插件, 不出意外地遇到了很多的坑. 这也是我写这篇文章的主要目的, 记录一下我所遇到的一些问题作为备忘.</p>
<p>首先是开发chrome插件过程中(我认为)最关键的一个步骤, 也就是配置manifest.json文件. manifest.json是chrome插件在chrome中启动时第一时间需要读取的配置文件, 
里面的配置项数不胜数, 这边我就先列出我的配置内容:</p>
<pre><code>{
  &quot;name&quot;: &quot;XXX&quot;,                            //项目名
  &quot;description&quot;: &quot;xxx&quot;,                     //项目描述
  &quot;version&quot;: &quot;0.1&quot;,                         //项目版本
  &quot;permissions&quot;: [                          //脚本权限
    &quot;tabs&quot;,                                     //读取以及操作所有tab的权限
    &quot;storage&quot;,                                  //读取以及操作storage的权限
  ],
  &quot;content_scripts&quot;: [                      //由chrome在启动插件时自动隐式注入到指定页面的文件的配置项
    {
      &quot;matches&quot;: [      
        &quot;http://xxxxxxxx.com/*&quot;                 //注入的域名规则
      ],
      &quot;js&quot;: [                                   //需要注入的js文件列表
        &quot;js/content.js&quot;             
      ],
      &quot;css&quot;: [                                  //需要注入的css文件列表
        &quot;css/content.css&quot;
      ]
    }
  ],
  &quot;background&quot;: {                           //插件默认启动的后台脚本配置项
    &quot;scripts&quot;: [                                //js文件列表
      &quot;js/background.js&quot;
    ],
    &quot;persistent&quot;: false                         //不明
  },
  &quot;web_accessible_resources&quot;: [             //content_scripts以及background能够操作的资源文件列表
    &quot;js/script.js&quot;,
    &quot;js/stop.js&quot;
  ],
  &quot;browser_action&quot;: {                       //在地址栏右侧的插件小图标的配置项
    &quot;default_title&quot;: &quot;Click to start&quot;,          //默认标题, 鼠标悬停时显示
    &quot;default_icon&quot;: &quot;images/icon.png&quot;           //默认图标
  },
  &quot;icons&quot;: {                                //chrome插件本身的产品图标
    &quot;128&quot;: &quot;images/icon.png&quot;                    //128*128像素的图标配置项
  },
  &quot;manifest_version&quot;: 2                     //当前用到的manifest文件版本, 最新是2.0
}
</code></pre>