const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
const { FileBox } = require('file-box')

const { createCanvas, loadImage } = require('canvas')

const width = 55
const canvas = createCanvas(width * 8 + 20.5, width * 9 + 20.5)

const ctx = canvas.getContext('2d')
const ChessBoard = require('./../libs/ChessBoard')

ctx.fillStyle = "white"
ctx.fillRect(0, 0, width * 8 + 20.5, width * 9 + 20.5)

ChessBoard.draw_chessboard(ctx)

// Draw cat with lime helmet
// console.log(canvas.toDataURL())

Wechaty.instance() // Global Instance
.on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${qrcode}`))
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
