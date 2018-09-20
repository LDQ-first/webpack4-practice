
### 更多优化

1. 使用 Source Map

```js
module.exports = (env, argv) => {

  return {
    devtool: argv.mode === 'development' ? 'cheap-module-eval-source-map' 
                                       : 'hidden-source-map',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        
      ]
    },
    ...

}
```



2. 使用 DllPlugin


**webpack.dll.config.js**

```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: ['lodash-es', '@babel/polyfill']
  },
  output: {
    path: path.resolve(__dirname, 'src/build'),
    filename: '[name].js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: './src/build/vendor.manifest.json',
      name: '[name]_library'
    })
  ]
}
```





```js

plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        minify: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      }),
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: require('./src/build/vendor.manifest.json')
      }),
      new CleanWebpackPlugin('./dist'),
      new CopyWebpackPlugin([
        { from: './src/build', to: './src/build' }
      ])
    ]

```


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div class="main">
        <div class="superman"></div>
        <div class="webpack"></div>
    </div>
    <script src="./src/build/vendor.js"></script>
</body>
</html>
```


3. 使用 AutoDllPlugin



```js
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html',
    minify: {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    }
  }),
  new AutoDllPlugin({
    inject: true,
    debug: true,
    filename: '[name]_[hash].js',
    path: './dll',
    entry: {
      vendor: [
        'lodash-es',
        '@babel/polyfill'
      ]
    }
  }),
],

```


4. 使用 HappyPack


```js
const HappyPack = require('happypack')
const os = require('os')
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })


const createHappyPlugin = (id, loaders) => {
  return new HappyPack({
    id,
    loaders,
    threadPool: happyThreadPool
  })
}

module: {
    rules: [
      {
        test: /\.jsx?/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'src') // src 目录下的才需要经过 babel-loader 处理
        ],
        use: 'happypack/loader?id=babel'
      },
  ]
}


plugins: [
  /* new HappyPack({
    // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
    id: 'babel',
    // 如何处理 .js 文件，用法和 Loader 配置中一样
    loaders: ['babel-loader?cacheDirectory'],
    // 使用共享进程池中的子进程去处理任务
    threadPool: happyThreadPool
  }), */
  createHappyPlugin('babel', ['babel-loader?cacheDirectory=true'])
],
```


5. 使用 webpack-parallel-uglify-plugin



```js
const ParalleUglifyPlugin = require('webpack-parallel-uglify-plugin')


 plugins: [
      new ParalleUglifyPlugin({
        uglifyJS: {
          output: {
            comments: false
          },
          compress: {
            warnings: false,
            // drop_console: true
          }
        }
      }),
    ],
```









###  web-webpack-plugin

[web-webpack-plugin](https://github.com/gwuhaolin/web-webpack-plugin)

> 为单页应用生成 HTML
> 管理多个单页应用



### husky

[husky](https://github.com/typicode/husky)

husky supports all Git hooks defined [here](https://git-scm.com/docs/githooks).

Server-side hooks (pre-receive, update and post-receive) aren't supported.




### 加载 Source Map


> 由于在开发过程中经常会使用新语言去开发项目，最后会把源码转换成能在浏览器中直接运行的 JavaScript 代码。 
> 这样做虽能提升开发效率，在调试代码的过程中你会发现生成的代码可读性非常差，这给代码调试带来了不便。

> Webpack 支持为转换生成的代码输出对应的 Source Map 文件，以方便在浏览器中能通过源码调试。 
> 控制 Source Map 输出的 Webpack 配置项是 devtool，它有很多选项，下面来一一详细介绍。


|devtool	                    |含义|
|---|---|
|空	                          |不生成 Source Map|
|eval	                        |每个 module 会封装到 eval 里包裹起来执行，并且会在每个 eval 语句的末尾追加注释 //# sourceURL=webpack:///./main.js|
|source-map	                  |会额外生成一个单独 Source Map 文件，并且会在 JavaScript 文件末尾追加 //# |sourceMappingURL=bundle.js.map|
|hidden-source-map	          |和 source-map 类似，但不会在 JavaScript 文件末尾追加 //# sourceMappingURL=bundle.js.map|
|inline-source-map	          |和 source-map 类似，但不会额外生成一个单独 Source Map 文件，而是把 Source Map 转换成 base64 编|码内嵌到 JavaScript 中|
|eval-source-map	            |和 eval 类似，但会把每个模块的 Source Map 转换成 base64 编码内嵌到 eval 语句的末尾，例如 //# sourceMappingURL=data:application/json|;charset=utf-8;base64,eyJ2ZXJzaW...|
|cheap-source-map	            |和 source-map 类似，但生成的 Source Map 文件中没有列信息，因此生成速度更快|
|cheap-module-source-map	    |和 cheap-source-map 类似，但会包含 Loader 生成的 Source Map|



> 其实以上表格只是列举了 devtool 可能取值的一部分， 
> 它的取值其实可以由 source-map、eval、inline、hidden、cheap、module 这六个关键字随意组合而成。 


> 这六个关键字每个都代表一种特性，它们的含义分别是：

> eval：用 eval 语句包裹需要安装的模块；
> source-map：生成独立的 Source Map 文件；
> hidden：不在 JavaScript 文件中指出 Source Map 文件所在，这样浏览器就不会自动加载 Source Map；
> inline：把生成的 Source Map 转换成 base64 格式内嵌在 JavaScript 文件中；
> cheap：生成的 Source Map 中不会包含列信息，这样计算量更小，输出的 Source Map 文件更小；同时 Loader 输出的 Source Map 不会被采用；
> module：来自 Loader 的 Source Map 被简单处理成每行一个模块；
> 该如何选择
> Devtool 配置项提供的这么多选项看似简单，但很多人搞不清楚它们之间的差别和应用场景。


> 如果你不关心细节和性能，只是想在不出任何差错的情况下调试源码，可以直接设置成 source-map，但这样会造成两个问题：

> source-map 模式下会输出质量最高最详细的 Source Map，这会造成构建速度缓慢，特别是在开发过程需要频繁修改的时候会增加等待时间；
> source-map 模式下会把 Source Map 暴露出去，如果构建发布到线上的代码的 Source Map 暴露出去就等于源码被泄露；

> 为了解决以上两个问题，可以这样做：

> 在开发环境下把 devtool 设置成 cheap-module-eval-source-map，因为生成这种 Source Map 的速度最快，能加速构建。
> 由于在开发环境下不会做代码压缩，Source Map 中即使没有列信息也不会影响断点调试；
> 在生产环境下把 devtool 设置成 hidden-source-map，意思是生成最详细的 Source Map，
> 但不会把 Source Map 暴露出去。由于在生产环境下会做代码压缩，一个 JavaScript 文件只有一行，所以需要列信息。
> 在生产环境下通常不会把 Source Map 上传到 HTTP 服务器让用户获取，而是上传到 JavaScript 错误收集系统，
> 在错误收集系统上根据 Source Map 和收集到的 JavaScript 运行错误堆栈计算出错误所在源码的位置。

> 不要在生产环境下使用 inline 模式的 Source Map， 因为这会使 JavaScript 文件变得很大，而且会泄露源码。


### 加载现有的 Source Map

> 有些从 Npm 安装的第三方模块是采用 ES6 或者 TypeScript 编写的，
> 它们在发布时会同时带上编译出来的 JavaScript 文件和对应的 Source Map 文件，
> 以方便你在使用它们出问题的时候调试它们；

> 默认情况下 Webpack 是不会去加载这些附加的 Source Map 文件的，
> Webpack 只会在转换过程中生成 Source Map。 
> 为了让 Webpack 加载这些附加的 Source Map 文件，需要安装 source-map-loader 。 使用方法如下：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 只加载你关心的目录下的 Source Map，以提升构建速度
        include: [path.resolve(root, 'node_modules/some-components/')],
        use: ['source-map-loader'],
        // 要把 source-map-loader 的执行顺序放到最前面，如果在 source-map-loader 之前有 Loader 转换了该 JavaScript 文件，会导致 Source Map 映射错误
        enforce: 'pre'
      }
    ]
  }
};
```
> 由于 source-map-loader 在加载 Source Map 时计算量很大，
> 因此要避免让该 Loader 处理过多的文件，不然会导致构建速度缓慢。 
> 通常会采用 include 去命中只关心的文件。

> 再安装新引入的依赖：

```js
npm i -D source-map-loader
```

> 重启 Webpack 后，你就能在浏览器中调试 node_modules/some-components/ 目录下的源码了。





### 使用 DllPlugin


[DllPlugin](https://webpack.js.org/plugins/dll-plugin/) 




### 使用 AutoDllPlugin

[AutoDllPlugin](https://github.com/asfktz/autodll-webpack-plugin)


### 使用 HappyPack

[HappyPack](https://github.com/amireh/happypack)


### 使用 webpack-parallel-uglify-plugin


[webpack-parallel-uglify-plugin](https://github.com/gdborton/webpack-parallel-uglify-plugin)



### 自动刷新浏览器

> 监听到文件更新后的下一步是去刷新浏览器，webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器。 在使用 webpack-dev-server 模块去启动 webpack 模块时，webpack 模块的监听模式默认会被开启。 webpack 模块会在文件发生变化时告诉 webpack-dev-server 模块。


### 自动刷新的原理

> 控制浏览器刷新有三种方法：

> 借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
> 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
> 把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。
> DevServer 支持第2、3种方法，第2种是 DevServer 默认采用的刷新方法。


### 优化自动刷新的性能

> 在2-6 DevServer中曾介绍过 devServer.inline 配置项，它就是用来控制是否往 Chunk 中注入代理客户端的，默认会注入。 事实上，在开启 inline 时，DevServer 会为每个输出的 Chunk 中注入代理客户端的代码，当你的项目需要输出的 Chunk 有很多个时，这会导致你的构建缓慢。 其实要完成自动刷新，一个页面只需要一个代理客户端就行了，DevServer 之所以粗暴的为每个 Chunk 都注入，是因为它不知道某个网页依赖哪几个 Chunk，索性就全部都注入一个代理客户端。 网页只要依赖了其中任何一个 Chunk，代理客户端就被注入到网页中去。

> 这里优化的思路是关闭还不够优雅的 inline 模式，只注入一个代理客户端。 为了关闭 inline 模式，在启动 DevServer 时，可通过执行命令 webpack-dev-server --inline false


> 入口网址变成了 http://localhost:8080/webpack-dev-server/
> bundle.js 中不再包含代理客户端的代码了


> 要开发的网页被放进了一个 iframe 中，编辑源码后，iframe 会被自动刷新。



### 开启模块热替换


> DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数 --hot，完整命令是 webpack-dev-server --hot。

> 除了通过在启动时带上 --hot 参数，还可以通过接入 Plugin 实现，相关代码如下：


```js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry:{
    // 为每个入口都注入代理客户端
    main:['webpack-dev-server/client?http://localhost:8080/', 'webpack/hot/dev-server','./src/main.js'],
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
}
```



> Webpack 为了让使用者在使用了模块热替换功能时能灵活地控制老模块被替换时的逻辑，可以在源码中定义一些代码去做相应的处理。

> 把的 main.js 文件改为如下：


```js
import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './AppComponent';
import './main.css';

render(<AppComponent/>, window.document.getElementById('app'));

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
  // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./AppComponent'], () => {
    // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
    render(<AppComponent/>, window.document.getElementById('app'));
  });
}
```

> 其中的 module.hot 是当开启模块热替换后注入到全局的 API，用于控制模块热替换的逻辑。

> 现在修改 AppComponent.js 文件，把 Hello,Webpack 改成 Hello,World，你会发现模块热替换生效了。 但是当你编辑 main.js 时，你会发现整个网页被刷新了。为什么修改这两个文件会有不一样的表现呢？

> 当子模块发生更新时，更新事件会一层层往上传递，也就是从 AppComponent.js 文件传递到 main.js 文件， 直到有某层的文件接受了当前变化的模块，也就是 main.js 文件中定义的 module.hot.accept(['./AppComponent'], callback)， 这时就会调用 callback 函数去执行自定义逻辑。如果事件一直往上抛到最外层都没有文件接受它，就会直接刷新网页。

> 那为什么没有地方接受过 .css 文件，但是修改所有的 .css 文件都会触发模块热替换呢？ 原因在于 style-loader 会注入用于接受 CSS 的代码。



### 优化模块热替换


> 其中的 Updated modules: 68 是指 ID 为68的模块被替换了，这对开发者来说很不友好，因为开发者不知道 ID 和模块之间的对应关系，最好是把替换了的模块的名称输出出来。 Webpack 内置的 NamedModulesPlugin 插件可以解决该问题，修改 Webpack 配置文件接入该插件：


```js
module.exports = {
  plugins: [
    // 显示出被替换模块的名称
    new webpack.NamedModulesPlugin()
  ],
}
```

> 重启构建后你会发现浏览器中的日志更加友好了




### 用 Webpack 实现 CDN 的接入


[web-webpack-plugin](https://github.com/gwuhaolin/web-webpack-plugin)


> 总结上面所说的，构建需要实现以下几点：

> 静态资源的导入 URL 需要变成指向 CDN 服务的绝对路径的 URL 而不是相对于 HTML 文件的 URL。
> 静态资源的文件名称需要带上有文件内容算出来的 Hash 值，以防止被缓存。
> 不同类型的资源放到不同域名的 CDN 服务上去，以防止资源的并行加载被阻塞。

> 先来看下要实现以上要求的最终 Webpack 配置：

```js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {WebPlugin} = require('web-webpack-plugin');

module.exports = {
  // 省略 entry 配置...
  output: {
    // 给输出的 JavaScript 文件名称加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/',
  },
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 压缩 CSS 代码
          use: ['css-loader?minimize'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        }),
      },
      {
        // 增加对 PNG 文件的支持
        test: /\.png/,
        // 给输出的 PNG 文件名称加上 Hash 值
        use: ['file-loader?name=[name]_[hash:8].[ext]'],
      },
      // 省略其它 Loader 配置...
    ]
  },
  plugins: [
    // 使用 WebPlugin 自动生成 HTML
    new WebPlugin({
      // HTML 模版文件所在的文件路径
      template: './template.html',
      // 输出的 HTML 的文件名称
      filename: 'index.html',
      // 指定存放 CSS 文件的 CDN 目录 URL
      stylePublicPath: '//css.cdn.com/id/',
    }),
    new ExtractTextPlugin({
      // 给输出的 CSS 文件名称加上 Hash 值
      filename: `[name]_[contenthash:8].css`,
    }),
    // 省略代码压缩插件配置...
  ],
}
```

> 以上代码中最核心的部分是通过 publicPath 参数设置存放静态资源的 CDN 目录 URL， 为了让不同类型的资源输出到不同的 CDN，需要分别在：

> output.publicPath 中设置 JavaScript 的地址。
> css-loader.publicPath 中设置被 CSS 导入的资源的的地址。
> WebPlugin.stylePublicPath 中设置 CSS 文件的地址。

> 设置好 publicPath 后，WebPlugin 在生成 HTML 文件和 css-loader 转换 CSS 代码时，会考虑到配置中的 publicPath，用对应的线上地址替换原来的相对地址。



[webpack-cdn-plugin](https://github.com/van-nguyen/webpack-cdn-plugin)


