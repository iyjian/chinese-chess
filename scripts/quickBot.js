const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
const { FileBox } = require('file-box')
const { PuppetPadlocal } = require('wechaty-puppet-padlocal')
const { createCanvas, loadImage } = require('canvas')
const conf = require('./../conf')

const width = 55
const canvas = createCanvas(width * 8 + 20.5, width * 9 + 20.5)

const ctx = canvas.getContext('2d')
const ChessBoard = require('../libs/ChessBattle')

ctx.fillStyle = "white"
ctx.fillRect(0, 0, width * 8 + 20.5, width * 9 + 20.5)

// ChessBoard.draw_chessboard(ctx)

const bot = new Wechaty({
  name: "PadLocalBot",
  puppet: new PuppetPadlocal({ token: conf.padLocal.token })
})

// WECHATY_PUPPET_PADLOCAL_TOKEN=91f6e65dbe02496a9a0b22833e54c99d

bot.on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${qrcode}`))
.on('login',            user => console.log(`User ${user} logged in`))
.on('message',       message => {
  console.log(message.from().name())
  if (message.from().name() === '人在江湖漂' && message.text() === '开始') {
    img = FileBox.fromDataURL(canvas.toDataURL(), 'dummy.png')
    img.toFile('dummy.png', true)
    message.say(img)
  }
})
.start()

// docker run -ti --rm --volume="$(pwd)":/bot wechaty/wechaty quickBot.js
