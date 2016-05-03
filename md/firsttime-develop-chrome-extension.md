<p>上周写了段脚本, 我想着是不是开发成一个chrome插件让它能够定时地而且持久性地在指定页面中运行, 于是乎抽空研究了chrome extension地官方文档, 
写了个小小的插件, 也算勉强入了门了.</p>
<p>由于是初次开发chrome插件, 不出意外地遇到了很多的坑. 这也是我写这篇文章的主要目的, 记录一下我所遇到的一些问题作为备忘.</p>
<p>首先是开发chrome插件过程中(我认为)最关键的一个步骤, 也就是配置manifest.json文件. manifest.json是chrome插件在chrome中启动时第一时间需要读取的配置文件, 
里面的配置项数不胜数, 这边我就先列出我的配置内容:</p>
<pre><code>{
  &amp;quot;name&amp;quot;: &amp;quot;XXX&amp;quot;,                            <span class="hljs-comment">//项目名</span>
  &amp;quot;description&amp;quot;: &amp;quot;xxx&amp;quot;,                     <span class="hljs-comment">//项目描述</span>
  &amp;quot;version&amp;quot;: &amp;quot;<span class="hljs-number">0.1</span>&amp;quot;,                         <span class="hljs-comment">//项目版本</span>
  &amp;quot;permissions&amp;quot;: [                          <span class="hljs-comment">//脚本权限</span>
    &amp;quot;tabs&amp;quot;,                                     <span class="hljs-comment">//读取以及操作所有tab的权限</span>
    &amp;quot;storage&amp;quot;,                                  <span class="hljs-comment">//读取以及操作storage的权限</span>
  ],
  &amp;quot;content_scripts&amp;quot;: [                      <span class="hljs-comment">//由chrome在启动插件时自动隐式注入到指定页面的文件的配置项</span>
    {
      &amp;quot;matches&amp;quot;: [      
        &amp;quot;http:<span class="hljs-comment">//<span class="hljs-label">xxxxxxxx.com/*&amp;quot;                 //注入的域名规则</span></span>
      ],
      &amp;quot;js&amp;quot;: [                                   <span class="hljs-comment">//需要注入的js文件列表</span>
        &amp;quot;js/content.js&amp;quot;             
      ],
      &amp;quot;css&amp;quot;: [                                  <span class="hljs-comment">//需要注入的css文件列表</span>
        &amp;quot;css/content.css&amp;quot;
      ]
    }
  ],
  &amp;quot;<span class="hljs-built_in">background</span>&amp;quot;: {                           <span class="hljs-comment">//插件默认启动的后台脚本配置项</span>
    &amp;quot;scripts&amp;quot;: [                                <span class="hljs-comment">//js文件列表</span>
      &amp;quot;js/<span class="hljs-built_in">background</span>.js&amp;quot;
    ],
    &amp;quot;persistent&amp;quot;: <span class="hljs-keyword">false</span>                         <span class="hljs-comment">//不明</span>
  },
  &amp;quot;web_accessible_resources&amp;quot;: [             <span class="hljs-comment">//content_scripts以及background能够操作的资源文件列表</span>
    &amp;quot;js/script.js&amp;quot;,
    &amp;quot;js/stop.js&amp;quot;
  ],
  &amp;quot;browser_action&amp;quot;: {                       <span class="hljs-comment">//在地址栏右侧的插件小图标的配置项</span>
    &amp;quot;default_title&amp;quot;: &amp;quot;Click to start&amp;quot;,          <span class="hljs-comment">//默认标题, 鼠标悬停时显示</span>
    &amp;quot;default_icon&amp;quot;: &amp;quot;images/icon.png&amp;quot;           <span class="hljs-comment">//默认图标</span>
  },
  &amp;quot;icons&amp;quot;: {                                <span class="hljs-comment">//chrome插件本身的产品图标</span>
    &amp;quot;<span class="hljs-number">128</span>&amp;quot;: &amp;quot;images/icon.png&amp;quot;                    <span class="hljs-comment">//128*128像素的图标配置项</span>
  },
  &amp;quot;manifest_version&amp;quot;: <span class="hljs-number">2</span>                     <span class="hljs-comment">//当前用到的manifest文件版本, 最新是2.0</span>
}
</code></pre>