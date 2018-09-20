require('./style.less')
import { map } from 'lodash-es'
import { square } from './lib/math'
const { log } = require('./utils')

log('webpack!')
log(map([1, 2, 3], square))

import('./lib/superalert').then(({ default: superalert }) => {
  superalert({ a:1 })
})
/* comment */
console.log('console.log')

