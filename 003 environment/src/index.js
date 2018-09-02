require('./style.less')

const { log } = require('./utils')

log('webpack')

if(__DEV__) {  // eslint-disable-line
  log('In development ...')
}

log(process)

