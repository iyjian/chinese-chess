const { createCanvas } = require('canvas')

class ChessBattle {
  
  constructor (chessRadius = 0.35, cellWidth = 55, startPoint = [22, 22]) {
    this.cellWidth = cellWidth
    this.startPoint = startPoint
    this.chessRadius = chessRadius
    this.width = cellWidth * 8 + startPoint[0] * 2
    this.height = cellWidth * 9 + startPoint[1] * 2
    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    this.activeChess = [-1, -1]  // [-1,-1]表示没有选中棋子
    this.checkpoint = [[["车", 1], ["马", 1], ["象", 1], ["士", 1], ["将", 1], ["士", 1], ["象", 1], ["马", 1], ["车", 1]], [["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0]], [["", 0], ["炮", 1], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["炮", 1], ["", 0]], [["卒", 1], ["", 0], ["卒", 1], ["", 0], ["卒", 1], ["", 0], ["卒", 1], ["", 0], ["卒", 1]], [["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0]], [["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0]], [["兵", -1], ["", 0], ["兵", -1], ["", 0], ["兵", -1], ["", 0], ["兵", -1], ["", 0], ["兵", -1]], [["", 0], ["砲", -1], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["砲", -1], ["", 0]], [["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 0]], [["車", -1], ["馬", -1], ["相", -1], ["仕", -1], ["帥", -1], ["仕", -1], ["相", -1], ["馬", -1], ["車", -1]]]

    this.userData = {
      // 当前已经移动的步数
      moves: 0,
      // 当前在走的棋手
      activePlayer: -1
    }
  }

  getCanvas () {
    return this.canvas
  }

  getCtx () {
    return this.ctx
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  // getChessBoard () {

  // }

  drawChessBoard () {
    this.clear()
    // 画版的初始化，把画笔挪到开始点，并保存画板状态
    // CTX STATE 画笔在初始点
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 1
    this.ctx.translate(this.startPoint[0], this.startPoint[1])
    this.ctx.save()

    // 象棋每个格子的宽度，每个格子是正方形所以一个值就够了
    const chuhehanjie_fontsize = 0.5 * this.cellWidth
    const w1 = 0.12 * this.cellWidth
    // 炮点和兵点上的标记线的长度
    const w2 = 0.05 * this.cellWidth
    // 炮点和兵点上标记线和棋盘格子时间的距离
    // Apaocrosspoint 是所有需要画炮点和兵点上的交叉标记的棋盘坐标点，后面我会把它乘上对应的棋盘格子的宽度this.cellWidth
    const Apaocrosspoint = [[1, 2], [7, 2], [1, 7], [7, 7], [0, 3], [2, 3], [4, 3], [6, 3], [8, 3], [0, 6], [2, 6], [4, 6], [6, 6], [8, 6]]
    // Apaocrosspoint.forEach(function (data) {

    // })
    for (let data of Apaocrosspoint) {
      data[0] = data[0] * this.cellWidth
      data[1] = data[1] * this.cellWidth
    }

    // 画竖线
    this.ctx.beginPath()
    for (let i = 0; i <= 8; i = i + 1) {
      if (i == 0 || i == 8) {
        this.ctx.moveTo(i * this.cellWidth, 0)
        this.ctx.lineTo(i * this.cellWidth, 9 * this.cellWidth)
      } else {
        this.ctx.moveTo(i * this.cellWidth, 0)
        this.ctx.lineTo(i * this.cellWidth, 4 * this.cellWidth)
        this.ctx.moveTo(i * this.cellWidth, 5 * this.cellWidth)
        this.ctx.lineTo(i * this.cellWidth, 9 * this.cellWidth)
      }
    }

    // 画横线
    for (let j = 0; j <= 9; j = j + 1) {
      this.ctx.moveTo(0, j * this.cellWidth)
      this.ctx.lineTo(8 * this.cellWidth, j * this.cellWidth)
    }

    // 画棋盘外面的粗框
    this.ctx.moveTo(-3, -3)
    this.ctx.lineTo(-3, 9 * this.cellWidth + 3)
    this.ctx.lineTo(3 + 8 * this.cellWidth, 9 * this.cellWidth + 3)
    this.ctx.lineTo(3 + 8 * this.cellWidth, -3)
    this.ctx.lineTo(-3, -3)

    // 画九宫格里的斜线
    this.ctx.moveTo(3 * this.cellWidth, 0 * this.cellWidth)
    this.ctx.lineTo(5 * this.cellWidth, 2 * this.cellWidth)
    this.ctx.moveTo(5 * this.cellWidth, 0 * this.cellWidth)
    this.ctx.lineTo(3 * this.cellWidth, 2 * this.cellWidth)
    this.ctx.moveTo(3 * this.cellWidth, 7 * this.cellWidth)
    this.ctx.lineTo(5 * this.cellWidth, 9 * this.cellWidth)
    this.ctx.moveTo(5 * this.cellWidth, 7 * this.cellWidth)
    this.ctx.lineTo(3 * this.cellWidth, 9 * this.cellWidth)

    for (let data of Apaocrosspoint) {
      // CTX STATE 画笔在初始点2
      this.ctx.save()
      this.ctx.translate(data[0], data[1])
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (Math.abs(i) + Math.abs(j) == 2 && !(data[0] == 0 * this.cellWidth && i == -1) && !(data[0] == 8 * this.cellWidth && i == 1)) {
            //! (data[0] == 0 * this.cellWidth && i == -1)   如果是棋盘最左边的兵点则不画坐标轴左侧的部分
            //! (data[0] == 8 * this.cellWidth && i == 1)    如果是棋盘最右边的兵点则不画坐标轴右侧的部分
            this.ctx.moveTo(i * w2, j * (w1 + w2))
            this.ctx.lineTo(i * w2, j * w2)
            this.ctx.lineTo(i * (w1 + w2), j * w2)
          }
        }
      }
      // CTX STATE 恢复到画笔在初始点2
      this.ctx.restore()      
    }
    this.ctx.stroke()

    this.ctx.save()
    // 把笔拿到河道上
    this.ctx.translate(2 * this.cellWidth, 4.5 * this.cellWidth)
    // 设置汉界的中心点
    this.ctx.rotate(-Math.PI / 2)
    this.ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
    this.ctx.fillText('汉', -0.25 * this.cellWidth, -0.2 * this.cellWidth)
    this.ctx.fillText('界', -0.25 * this.cellWidth, (0.5 + 0.2) * this.cellWidth)
    this.ctx.restore()

    this.ctx.save()
    this.ctx.translate(6 * this.cellWidth, 4.5 * this.cellWidth)
    // 设置楚河的中心点
    this.ctx.rotate(Math.PI / 2)
    this.ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
    this.ctx.fillText('楚', -0.25 * this.cellWidth, -0.2 * this.cellWidth)
    this.ctx.fillText('河', -0.25 * this.cellWidth, (0.5 + 0.2) * this.cellWidth)
    // this.ctx.restore()
    this.ctx.closePath()
    this.ctx.restore()
    this.ctx.restore()
  }

  /**
   * 请求得到对战的盘面
   * player - int - 哪个玩家在请求 -1 红方 1 黑方
  */
 getBattleSnapshot (player) {
   if (player !== -1 && player !== 1) return false
    // this.drawChessBoard()
    const CHESS_FONT_SIZE = this.cellWidth * 0.4
    const CHESS_FONT = 'sans-serif'
    // this.ctx.translate(this.startPoint[0], this.startPoint[1])
    // 设置棋盘的初始点
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 1

    for (let j in this.checkpoint) {
      const data = this.checkpoint[j]
      j = player === 1 ? 9 - j : j
      for (let i in data) {
        const chess = data[i]
        i = player === 1 ? 8 - i : i
        if (chess[0] != '') {
          // this.ctx.beginPath()

          // 画棋子外面的圈圈
          this.ctx.save()
          this.ctx.beginPath()
          // this.ctx.shadowBlur = 5;
          // this.ctx.shadowColor = 'red';
          // 如果是红方，activeChess中的值和i,j都是没有翻转过的
          if ((player == -1 & this.activeChess[0] == j & this.activeChess[1] == i) || (player == 1 & this.activeChess[0] == 9 - j & this.activeChess[1] == 8 - i)) {
            this.ctx.shadowBlur = 5
            this.ctx.shadowColor = 'red'
          }
          this.ctx.lineWidth = 2
          this.ctx.arc(this.cellWidth * i, this.cellWidth * j, this.cellWidth * this.chessRadius, 0, 2 * Math.PI, false)
          this.ctx.fillStyle = 'rgb(195,136,52)'
          // 设置填充棋子的颜色
          this.ctx.fill()
          // 填充!!
          this.ctx.closePath()
          this.ctx.stroke()
          this.ctx.restore()
          // 填充完毕后立即重置填充方式
          // 画棋子的内圈
          this.ctx.beginPath()
          this.ctx.arc(this.cellWidth * i, this.cellWidth * j, this.cellWidth * this.chessRadius * 0.81, 0, 2 * Math.PI, false)
          this.ctx.closePath()
          this.ctx.stroke()

          // 画棋子上的字
          this.ctx.save()
          if (chess[1] == -1) {
            this.ctx.strokeStyle = 'red'
          }
          this.ctx.lineWidth = 1
          this.ctx.font = CHESS_FONT_SIZE.toString() + 'px ' + CHESS_FONT
          this.ctx.strokeText(chess[0], this.cellWidth * i - 0.5 * CHESS_FONT_SIZE, this.cellWidth * j + this.chessRadius * CHESS_FONT_SIZE)
          this.ctx.restore()

          this.ctx.stroke()
        }   
        // return   
      }
    }
    this.ctx.restore()
  }

  /**
   * 坐标转化
   * 因为服务端存储的坐标系是以红方在下，黑方在上来存储
   * 但是为了外层写代码方便，要求上报的坐标系是自己的视角来上报坐标系，所以需要统一转化为服务端对应的坐标
   */
  transformCoordinate (pos, player) {
    return [player === -1 ? 9 - pos[0] : pos[0], pos[1]]
  }

  /**
   * 移动棋子
   * @param {*} i
   * @param {*} j
   */
  move (pos, player) {
    if (player !== this.userData.activePlayer) {
      console.log(`request: ${player} - move error, not your turn `)
      return false
    }

    pos = this.transformCoordinate(pos, player)

    this.checkpoint[pos[0]][pos[1]] = this.checkpoint[this.activeChess.loc[0]][this.activeChess.loc[1]]
    this.checkpoint[this.activeChess.loc[0]][this.activeChess.loc[1]] = ['', 0]
    this.userData.moves++
    this.clearSelect(player)
  }

  /**
   * 选择棋子，需要知道是哪方的人在选择棋子,因为每个人报i,j的时候都是按照自己的角度来报的,其中i是第几行，j是第几列，但是转移到数组里就是j,i
   */
  select (pos, player) {
    if (player !== this.userData.activePlayer) {
      console.log(`request: ${player} - select error, not your turn `)
      return false
    }

    pos = this.transformCoordinate(pos, player)

    if (this.checkpoint[pos[0]][pos[1]][1] !== player) {
      console.log(`request: ${player} - select error, invalid cell`, this.checkpoint[i][j])
      return false
    }

    this.activeChess = {
      cell: this.checkpoint[pos[0]][pos[1]],
      loc: pos
    }

    return this
  }

  clearSelect (player) {
    if (player !== this.userData.activePlayer) {
      console.log(`request: ${player} - select error, not your turn `)
      return false
    }
    this.activeChess = [-1, -1]
  }

}

module.exports = ChessBattle
