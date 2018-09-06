require('./style.less')
import { square } from './lib/math'
const { log } = require('./utils')

log('webpack!')

import('./lib/superalert').then(({ default: superalert }) => {
  superalert({ a:1 })
})


