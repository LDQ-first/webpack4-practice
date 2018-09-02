require('./styles/normalize')
require('./styles/index')

const format = require('utils/format')
const { log } = require('log')

log(format('webpack'))

/* eslint-disable-next-line */
log(TWO)

/* eslint-disable-next-line */
log(CONSTANTS.APP_VERSION)

log(_.map([1, 2, 3], (item) => item * 2))
