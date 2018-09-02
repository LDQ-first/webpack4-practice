module.exports = {
  // 所有在 规则页面 被标记为 “✅” 的规则将会默认开启
  "extends": "eslint:recommended",
  "parserOptions": {
    /* 使用 { "parserOptions": { "ecmaVersion": 6 } } 
    启用 ES6 语法支持；要额外支持新的 ES6 全局变量，
    使用 { "env":{ "es6": true } }
    (这个设置会同时自动启用 ES6 语法支持)。 */
    "ecmaVersion": 6
  },
   /* 脚本在执行期间访问的额外的全局变量
   想在一个源文件里使用全局变量，推荐你在 ESLint 中定义这些全局变量
   使用 globals 指出你要使用的全局变量。
   将变量设置为 true 将允许变量被重写，
   或 false 将不允许被重写。 */
  "globals": {
    "_": true
  },
  // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
  /* 要在配置文件里指定环境，
  使用 env 关键字指定你想启用的环境，并设置它们为 true */
  "env":{
    "browser": true, // 浏览器环境中的全局变量
    "node": true // Node.js 全局变量和 Node.js 作用域
  },
  // 启用的规则及其各自的错误级别
  "rules": {
    "no-console": "warn"
  }
}