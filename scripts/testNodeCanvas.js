const { createCanvas, loadImage } = require('canvas')
const ChessBattle = require('../libs/ChessBattle')
const { FileBox } = require('file-box')


chessBattle = new ChessBattle()

const canvas = chessBattle.getCanvas()

chessBattle.drawChessBoard()

// moving chess, if not a valid move, throw exception
chessBattle.select([0, 0], -1).move([2, 0], -1)

chessBattle.getBattleSnapshot(-1)

FileBox.fromDataURL(canvas.toDataURL(), 'dummy.png').toFile('dummy.png', true)
