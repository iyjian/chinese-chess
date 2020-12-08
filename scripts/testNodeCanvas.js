const ChessBattle = require('../libs/ChessBattle')
const path = require('path')
const { FileBox } = require('file-box')


const battle = new ChessBattle()

// moving chess, if not a valid move, throw exception
battle.selectAndMove([0, 0], [2, 0], -1)

FileBox.fromDataURL(battle.getSnapshot(-1).toDataURL(), 'black.png').toFile(path.join(__dirname, './../tmp/black.png'), true)

FileBox.fromDataURL(battle.getSnapshot(1).toDataURL(), 'red.png').toFile(path.join(__dirname, './../tmp/black.png'), true)
