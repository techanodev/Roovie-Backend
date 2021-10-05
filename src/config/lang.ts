import i18n = require('i18n')

/**
 * configure shared state
 */
let path = ''
i18n.configure({
    locales: ['en', 'fa'],
    defaultLocale: 'fa',
    directory: __dirname + '/../locales',
})
