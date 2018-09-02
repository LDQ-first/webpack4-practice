### 基础环境搭建

1. 新建文件 ./src/index.js


2. 添加script

```js
  "scripts": {
    "build": "webpack --mode production"
  }
```

3. 运行

```js
npm run build
```

4. webpack生成文件 ./dist/main.js

5. 改变文件结构，新增文件和模块


> ├─.babelrc  
> ├─package-lock.json  
> ├─package.json  
> ├─webpack.config.js  
> ├─src  
> &emsp;&emsp;├─index.html  
> &emsp;&emsp;├─index.js  
> &emsp;&emsp;├─style.less  
> &emsp;&emsp;├─utils.js  
> &emsp;&emsp;├─assets  
> &emsp;&emsp;&emsp;&emsp;├─superman.gif  
> &emsp;&emsp;&emsp;&emsp;└webpack.png  
> ├─dist  
> &emsp;&emsp;├─658af3847fca0f13cd7173c45cc38584.png  
> &emsp;&emsp;├─dea8b7810fd6ddb195f988cefaf09639.gif  
> &emsp;&emsp;├─index.html  
> &emsp;&emsp;├─main.css  
> &emsp;&emsp;└main.js  

**注意**
> babel-loader 8.x要配合 @babel/core @babel/preset-env 使用
> .babelrc 也要修改为  @babel/preset-env 
> less 除了要安装less-loader 还要安装 less 


6 使用webpack-dev-server进行开发

```js
 "scripts": {
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development"
  },
```

