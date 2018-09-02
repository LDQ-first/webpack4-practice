### 更多配置

1. 复制 001 basic 为 002 details 

```sh 
cp -r "001 basic" "002 details"
```

2. 调整文件结构

```sh
mkdir "./src/utils" | mv "./src/utils.js" "./src/utils/log.js"
```



3. 修改webapck resolve配置

```js
 resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'), // 这里使用 path.resolve 和 __dirname 来获取绝对路径
      log$: path.resolve(__dirname, 'src/utils/log.js') // 只匹配 log
    },
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src'),  // 指定当前目录下的 node_modules 优先查找
    ],
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".css", ".less"],
  }
```


4. 修改引用代码

```js

const { log } = require('log')

```

5. 添加 loader 

```js
 npm install eslint-loader eslint -D
 ```

6. 修改webapck rules 配置

```js
module: {
    rules: [
      {
        enforce: 'pre',   // 指定为前置类型
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.jsx?$/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'src') // src 目录下的才需要经过 babel-loader 处理
        ],
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader'
          ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'less-loader'
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
```



7. 使用 plugin 

```js
 // 全局常量
    new webpack.DefinePlugin({
      TWO: '1+1',
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2'), 
      }
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets/favicon.ico', to: 'favicon.ico' }, // 顾名思义，from 配置来源，to 配置目标路径  
    ])
```

8. index.html 添加 favicon.ico 

```html
<link rel="shortcut icon" href="favicon.ico">
```





### 匹配条件

> 匹配条件通常都使用请求资源文件的绝对路径来进行匹配，在官方文档中称为 resource，除此之外还有比较少用到的 issuer，则是声明依赖请求的源文件的绝对路径。举个例子：在 /path/to/app.js 中声明引入 import './src/style.scss'，resource 是 /path/to/src/style.scss，issuer 是 /path/to/app.js，规则条件会对这两个值来尝试匹配。 

```js
rules: [ 
      {
        resource: { // resource 的匹配条件
          test: /\.jsx?/, 
          include: [ 
            path.resolve(__dirname, 'src'),
          ],
        },
        // 如果要使用 issuer 匹配，便是 issuer: { test: ... }
        use: 'babel-loader',
      },
      // ...
    ],
```

### 规则条件

> webpack 的规则提供了多种配置形式：  
> 
> { test: ... } 匹配特定条件  
> { include: ... } 匹配特定路径  
> { exclude: ... } 排除特定路径  
> { and: [...] }必须匹配数组中所有条件  
> { or: [...] } 匹配数组中任意一个条件  
> { not: [...] } 排除匹配数组中所有条件

> 上述的所谓条件的值可以是：  
>   
> 字符串：必须以提供的字符串开始，所以是字符串的话，这里我们需要提  供绝对路径  
> 正则表达式：调用正则的 test 方法来判断匹配  
> 函数：(path) => boolean，返回 true 表示匹配  
> 数组：至少包含一个条件的数组  
> 对象：匹配所有属性值的条件


```js
ules: [
  {
    test: /\.jsx?/, // 正则
    include: [
      path.resolve(__dirname, 'src'), // 字符串，注意是绝对路径
    ], // 数组
    // ...
  },
  {
    test: {
      js: /\.js/,
      jsx: /\.jsx/,
    }, // 对象，不建议使用
    not: [
      (value) => { /* ... */ return true; }, // 函数，通常需要高度自定义时才会使用
    ],
  },
],

```


### module type

> webpack 4.x 版本强化了 module type，即模块类型的概念，不同的模块类型类似于配置了不同的 loader，webpack 会有针对性地进行处理，现阶段实现了以下 5 种模块类型。
  
> javascript/auto：即 webpack 3 默认的类型，支持现有的各种 JS 代码模块类型 —— CommonJS、AMD、ESM  
> javascript/esm：ECMAScript modules，其他模块系统，例如 CommonJS 或者 AMD 等不支持，是 .mjs 文件的默认类型  
> javascript/dynamic：CommonJS 和 AMD，排除 ESM  
> javascript/json：JSON 格式数据，require 或者 import 都可以引入，是 .json 文件的默认类型  
> webassembly/experimental：WebAssembly modules，当前还处于试验阶段，是 .wasm 文件的默认类型


> 如果不希望使用默认的类型的话，在确定好匹配规则条件时，我们可以使用 type 字段来指定模块类型，例如把所有的 JS 代码文件都设置为强制使用 ESM 类型：

```js
{
  test: /\.js/,
  include: [
    path.resolve(__dirname, 'src'),
  ],
  type: 'javascript/esm', // 这里指定模块类型
},
```

> 上述做法是可以帮助你规范整个项目的模块系统，但是如果遗留太多不同类型的模块代码时，建议还是直接使用默认的 javascript/auto。
> 后续会再添加 HTML 和 CSS 等类型。


### loader 配置

> 配置 loader，我们可以使用 use 字段：

```js
rules: [
  {
    test: /\.less/,
    use: [
      'style-loader', // 直接使用字符串表示 loader
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        },
      }, // 用对象表示 loader，可以传递 loader 配置等
      {
        loader: 'less-loader',
        options: {
          noIeCompat: true
        }, // 传递 loader 配置
      },
    ],
  },
],
```

> 如果只需要一个 loader，也可以这样：
use: { loader: 'babel-loader', options: { ... } }


### loader 应用顺序

> 执行顺序是从最后配置的 loader 开始，一步步往前

> webpack 在 rules 中提供了一个 enforce 的字段来配置当前 rule 的 loader 类型，没配置的话是普通类型，我们可以配置 pre 或 post，分别对应前置类型或后置类型的 loader。

```js
rules: [
  {
    enforce: 'pre', // 指定为前置类型
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
  },
]
```


> 还有一种行内 loader，即我们在应用代码中引用依赖时直接声明使用的 loader，如 const json = require('json-loader!./file.json') 这种。不建议在应用开发中使用这种 loader

> 所有的 loader 按照前置 -> 行内 -> 普通 -> 后置的顺序执行



### 使用 noParse

> 可以用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。


> 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制。


```js
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式

    // 或者使用 function
    noParse(content) {
      return /jquery|lodash/.test(content)
    },
  }
}
```


### 插件

**webpack.DefinePlugin**

> 定义全局变量
> 最多的方式是定义环境变量
> 建议使用 process.env.NODE_ENV: ... 的方式来定义 process.env.NODE_ENV

```js

plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
      TWO: '1+1', // const TWO = 1 + 1,
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2') // const CONSTANTS = { APP_VERSION: '1.1.2' }
      }
    }),
  ]
```


**copy-webpack-plugin**

> 复制文件

```js
plugins: [
    new CopyWebpackPlugin([
      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ]),
  ]
```


**extract-text-webpack-plugin**


> 把依赖的 CSS 分离出来成为单独的文件


```js
module: {
    rules: [
      {
        test: /\.css$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: 'css-loader',
        }), 
      },
    ],
  },
  plugins: [
    // 引入插件，配置文件名，这里同样可以使用 [hash]
    new ExtractTextPlugin('[name].css'),
  ]
```


> 在这里要强调的是，在 webpack 中，loader 和 plugin 的区分是很清楚的，针对文件模块转换要做的使用 loader，而其他干涉构建内容的可以使用 plugin


**webpack.ProvidePlugin**

> 用于引用某些模块作为应用运行时的变量，从而不必每次都用 require 或者 import


```js
new webpack.ProvidePlugin({
  identifier: 'module',
  // ...
})

// 或者
new webpack.ProvidePlugin({
  identifier: ['module', 'property'], // 即引用 module 下的 property，类似 import { property } from 'module'
  // ...
})

```


**webpack.IgnorePlugin**

> 用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去

> 例如我们使用 moment.js，直接引用后，里边有大量的 i18n 的代码，导致最后打包出来的文件比较大，而实际场景并不需要这些 i18n 的代码，这时我们可以使用 IgnorePlugin 来忽略掉这些代码文件，配置如下

```js
module.exports = {
  // ...
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
```

> IgnorePlugin 配置的参数有两个，第一个是匹配引入模块路径的正则表达式，第二个是匹配模块的对应上下文，即所在目录名。


