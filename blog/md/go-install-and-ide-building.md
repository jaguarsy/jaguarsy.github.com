<!DOCTYPE  html>
<html>
  <head>
    <meta charset="utf-8">
    
    <title>doc</title>
    <style>
      /*github.com style (c) Vasily Polovnyov <vast@whiteants.net>*/
      pre code {
        display: block; padding: 0.5em;
        color: #333;
        background: #f8f8ff
      }
      pre .comment,
      pre .template_comment,
      pre .diff .header,
      pre .javadoc {
        color: #998;
        font-style: italic
      }
      pre .keyword,
      pre .css .rule .keyword,
      pre .winutils,
      pre .javascript .title,
      pre .nginx .title,
      pre .subst,
      pre .request,
      pre .status {
        color: #333;
        font-weight: bold
      }
      pre .number,
      pre .hexcolor,
      pre .ruby .constant {
        color: #099;
      }
      pre .string,
      pre .tag .value,
      pre .phpdoc,
      pre .tex .formula {
        color: #d14
      }
      pre .title,
      pre .id {
        color: #900;
        font-weight: bold
      }
      pre .javascript .title,
      pre .lisp .title,
      pre .clojure .title,
      pre .subst {
        font-weight: normal
      }
      pre .class .title,
      pre .haskell .type,
      pre .vhdl .literal,
      pre .tex .command {
        color: #458;
        font-weight: bold
      }
      pre .tag,
      pre .tag .title,
      pre .rules .property,
      pre .django .tag .keyword {
        color: #000080;
        font-weight: normal
      }
      pre .attribute,
      pre .variable,
      pre .lisp .body {
        color: #008080
      }
      pre .regexp {
        color: #009926
      }
      pre .class {
        color: #458;
        font-weight: bold
      }
      pre .symbol,
      pre .ruby .symbol .string,
      pre .lisp .keyword,
      pre .tex .special,
      pre .prompt {
        color: #990073
      }
      pre .built_in,
      pre .lisp .title,
      pre .clojure .built_in {
        color: #0086b3
      }
      pre .preprocessor,
      pre .pi,
      pre .doctype,
      pre .shebang,
      pre .cdata {
        color: #999;
        font-weight: bold
      }
      pre .deletion {
        background: #fdd
      }
      pre .addition {
        background: #dfd
      }
      pre .diff .change {
        background: #0086b3
      }
      pre .chunk {
        color: #aaa
      }
    </style>
  </head>
  <body>  
    <p>Go的安装和配置基本是依照这个项目<a href="https://github.com/astaxie/build-web-application-with-golang&quot;">build-web-application-with-golang</a>完成的, 里面还有完整的Go教程,值得一看.</p>
<p>首先你需要准备一把梯子, 然后去Golang的官方下载最新的安装包, 具体过程直接参考上面的github项目. 安装完成后需要设置一下GOPATH环境变量, 稍微提一提Mac下的设置方法(跟linux系统下基本相同):</p>
<ol>
<li>首先看看自己的用户目录下有没有.bash_profile文件, 如果没有就&#39;touch .bash_profile&#39;创建一个. </li>
<li><code>vim .bash_profile</code>打开文件, 增加一行<code>export GOPATH=~/go</code>, 这边的<code>~/go</code>是你以后的项目文件夹.</li>
<li>保存文件退出, 执行<code>source .bash_profile</code>.</li>
<li><code>cd ~ &amp;&amp; mkdir go &amp;&amp; cd go &amp;&amp; mkdir src</code>在~目录下创建go文件夹, 紧接着在go目录下创建src目录. 
以后的所有项目都会在src中创建.</li>
</ol>
<p>接下来是IDE的选择. 在尝试了build-web-application-with-golan项目的推荐IDE之后, 最终我还是选择了其中没有提到的Atom. 界面还是挺不错的:</p>
<p><img src="images/go-install-and-ide-building-0.png" alt="&#39;&#39;"></p>

  </body>
</html>
