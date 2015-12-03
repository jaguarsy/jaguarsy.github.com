Go的安装和配置基本是依照这个项目[build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang")完成的, 里面还有完整的Go教程,值得一看.

首先你需要准备一把梯子, 然后去Golang的官方下载最新的安装包, 具体过程直接参考上面的github项目. 安装完成后需要设置一下GOPATH环境变量, 稍微提一提Mac下的设置方法(跟linux系统下基本相同):

1.  首先看看自己的用户目录下有没有.bash_profile文件, 如果没有就&#39;touch .bash_profile&#39;创建一个. 
2.  `vim .bash_profile`打开文件, 增加一行`export GOPATH=~/go`, 这边的`~/go`是你以后的项目文件夹.
3.  保存文件退出, 执行`source .bash_profile`.
4.  `cd ~ && mkdir go && cd go && mkdir src`在~目录下创建go文件夹, 紧接着在go目录下创建src目录. 
以后的所有项目都会在src中创建.

接下来是IDE的选择. 在尝试了build-web-application-with-golan项目的推荐IDE之后, 最终我还是选择了其中没有提到的Atom. 界面还是挺不错的:

![''](images/go-install-and-ide-building-0.png)