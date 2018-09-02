### 开发和生产环境

1. 复制001 basic为003 environment
   
```sh   
cp -r "001 basic" "003 environment"
```

2. 修改webpack配置文件结构

> configs  
> ├─webpack.base.js  
> ├─webpack.development.js  
> └webpack.production.js

**webpack.configs.js**

```js 
module.exports = ( env, argv ) => {
  return argv.mode === 'production' ?
    require('./configs/webpack.production') :
    require('./configs/webpack.development')
}
```


