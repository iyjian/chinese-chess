const log4js = require('log4js')

log4js.configure({
	// 每个appender就是一个log输出
	appenders: {
		console: {
			type: 'console'
		},
		api: {
			type: 'file',
			filename: __dirname + '/../logs/api.log',
			backups: 1000,
			compress: false
		}
	},
	// 定义上面的log输出的集合，然后取一个名字，用在getLogger中
	categories: {
		default: {
			appenders: [
				'console'
			],
			level: 'all'
		},
		api: {
			appenders: [
				'api', 'console'
			],
			level: 'TRACE'
		}
	}
})

module.exports = log4js
