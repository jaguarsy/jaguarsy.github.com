Go的安装和配置基本是依照这个项目[build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang)完成的, 里面还有完整的Go教程,值得一看.

首先你需要准备一把梯子, 然后去Golang的官方下载最新的安装包, 具体过程直接参考上面的github项目. 安装完成后需要设置一下GOPATH环境变量, 稍微提一提Mac下的设置方法(跟linux系统下基本相同):

1.  首先看看自己的用户目录下有没有.bash_profile文件, 如果没有就&#39;touch .bash_profile&#39;创建一个. 
2.  `vim .bash_profile`打开文件, 增加一行`export GOPATH=~/go`, 这边的`~/go`是你以后的项目文件夹.
3.  保存文件退出, 执行`source .bash_profile`.
4.  `cd ~ && mkdir go && cd go && mkdir src`在~目录下创建go文件夹, 紧接着在go目录下创建src目录. 
以后的所有项目都会在src中创建.

接下来是IDE的选择. 在尝试了build-web-application-with-golan项目的推荐IDE之后, 最终我还是选择了其中没有提到的Atom. 界面还是挺不错的:

![''](images/go-install-and-ide-building-0.png)

Atom中较为流行的Go插件是[go-plus](https://github.com/joefitzgerald/go-plus), 在Atom的按`Command + ,`打开Settings界面, 
在底部的install中可以直接搜索并安装. 然后设置go-plus中的GOPATH和Go的安装目录:

![''](images/go-install-and-ide-building-1.png)

然后问题就来了, go-plus安装后并不能正常启动. 仔细一看, 原来它还需要一堆第三方插件的支持Orz...

由于网络原因, `go get`指令一直没有成功过, 只能手动去github下载, 然后去目录中执行`go install`编译.

结果安装golint插件的的过程中碰到了坑爹的无法下载其依赖插件的问题, 貌似是因为被墙的缘故, 即使开了全局代理也没能下载, 所幸Go官方在github提供了Go Tools的镜像.
项目地址为[https://github.com/golang/tools](https://github.com/golang/tools).

Easy now! 只需要将项目clone或直接下载到本地, 在GOPATH的src目录下创建`golang.org/x/tools`这样的一个三级目录, 然后将项目中的文件全部拷到tools目录中, 
然后再去goling插件的目录中执行`go install`就可以成功编译了!

最后记得要把Atom的Settings中的Format Tool改为gofmt.

