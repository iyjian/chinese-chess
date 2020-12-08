const { createCanvas } = require('canvas')
const _ = require('lodash')
const logger = require('./log4j').getLogger('api')

class ChessBattle {
  
  constructor (chessRadius = 0.35, cellWidth = 55, startPoint = [22, 22]) {
    this.cellWidth = cellWidth
    this.startPoint = startPoint
    this.chessRadius = chessRadius
    this.width = cellWidth * 8 + startPoint[0] * 2
    this.height = cellWidth * 9 + startPoint[1] * 2
    // 被选中的棋子
    this.movingChess = [-1, -1]
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

  // getChessBoard () {

  // }

  drawChessBoard (ctx) {
    ctx.clearRect(0, 0, this.width, this.height)
    // 画版的初始化，把画笔挪到开始点，并保存画板状态
    // CTX STATE 画笔在初始点
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.translate(this.startPoint[0], this.startPoint[1])
    ctx.save()

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
    ctx.beginPath()
    for (let i = 0; i <= 8; i = i + 1) {
      if (i == 0 || i == 8) {
        ctx.moveTo(i * this.cellWidth, 0)
        ctx.lineTo(i * this.cellWidth, 9 * this.cellWidth)
      } else {
        ctx.moveTo(i * this.cellWidth, 0)
        ctx.lineTo(i * this.cellWidth, 4 * this.cellWidth)
        ctx.moveTo(i * this.cellWidth, 5 * this.cellWidth)
        ctx.lineTo(i * this.cellWidth, 9 * this.cellWidth)
      }
    }

    // 画横线
    for (let j = 0; j <= 9; j = j + 1) {
      ctx.moveTo(0, j * this.cellWidth)
      ctx.lineTo(8 * this.cellWidth, j * this.cellWidth)
    }

    // 画棋盘外面的粗框
    ctx.moveTo(-3, -3)
    ctx.lineTo(-3, 9 * this.cellWidth + 3)
    ctx.lineTo(3 + 8 * this.cellWidth, 9 * this.cellWidth + 3)
    ctx.lineTo(3 + 8 * this.cellWidth, -3)
    ctx.lineTo(-3, -3)

    // 画九宫格里的斜线
    ctx.moveTo(3 * this.cellWidth, 0 * this.cellWidth)
    ctx.lineTo(5 * this.cellWidth, 2 * this.cellWidth)
    ctx.moveTo(5 * this.cellWidth, 0 * this.cellWidth)
    ctx.lineTo(3 * this.cellWidth, 2 * this.cellWidth)
    ctx.moveTo(3 * this.cellWidth, 7 * this.cellWidth)
    ctx.lineTo(5 * this.cellWidth, 9 * this.cellWidth)
    ctx.moveTo(5 * this.cellWidth, 7 * this.cellWidth)
    ctx.lineTo(3 * this.cellWidth, 9 * this.cellWidth)

    for (let data of Apaocrosspoint) {
      // CTX STATE 画笔在初始点2
      ctx.save()
      ctx.translate(data[0], data[1])
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (Math.abs(i) + Math.abs(j) == 2 && !(data[0] == 0 * this.cellWidth && i == -1) && !(data[0] == 8 * this.cellWidth && i == 1)) {
            //! (data[0] == 0 * this.cellWidth && i == -1)   如果是棋盘最左边的兵点则不画坐标轴左侧的部分
            //! (data[0] == 8 * this.cellWidth && i == 1)    如果是棋盘最右边的兵点则不画坐标轴右侧的部分
            ctx.moveTo(i * w2, j * (w1 + w2))
            ctx.lineTo(i * w2, j * w2)
            ctx.lineTo(i * (w1 + w2), j * w2)
          }
        }
      }
      // CTX STATE 恢复到画笔在初始点2
      ctx.restore()      
    }
    ctx.stroke()

    ctx.save()
    // 把笔拿到河道上
    ctx.translate(2 * this.cellWidth, 4.5 * this.cellWidth)
    // 设置汉界的中心点
    ctx.rotate(-Math.PI / 2)
    ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
    ctx.fillText('汉', -0.25 * this.cellWidth, -0.2 * this.cellWidth)
    ctx.fillText('界', -0.25 * this.cellWidth, (0.5 + 0.2) * this.cellWidth)
    ctx.restore()

    ctx.save()
    ctx.translate(6 * this.cellWidth, 4.5 * this.cellWidth)
    // 设置楚河的中心点
    ctx.rotate(Math.PI / 2)
    ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
    ctx.fillText('楚', -0.25 * this.cellWidth, -0.2 * this.cellWidth)
    ctx.fillText('河', -0.25 * this.cellWidth, (0.5 + 0.2) * this.cellWidth)
    // ctx.restore()
    ctx.closePath()
    ctx.restore()
    ctx.restore()
  }

  /**
   * 获取对战盘面
   * player - int - 哪个玩家在请求 -1 红方 1 黑方
  */
  getSnapshot (player) {
    const canvas = createCanvas(this.width, this.height)
    const ctx = canvas.getContext('2d')

    if (player !== -1 && player !== 1) {
      logger.error(`ChessBattle - getBattleSnapshot - invalidPlayer - play: ${player}`)
      return false
    }
    
    this.drawChessBoard(ctx)

    const CHESS_FONT_SIZE = this.cellWidth * 0.4
    const CHESS_FONT = 'sans-serif'
    // ctx.translate(this.startPoint[0], this.startPoint[1])
    // 设置棋盘的初始点
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1

    for (let j in this.checkpoint) {
      const data = this.checkpoint[j]
      j = player === 1 ? 9 - j : j
      for (let i in data) {
        const chess = data[i]
        i = player === 1 ? 8 - i : i
        if (chess[0] != '') {
          // ctx.beginPath()

          // 画棋子外面的圈圈
          ctx.save()
          ctx.beginPath()
          // ctx.shadowBlur = 5;
          // ctx.shadowColor = 'red';
          // 如果是红方，movingChess中的值和i,j都是没有翻转过的
          if ((player == -1 & this.movingChess[0] == j & this.movingChess[1] == i) || (player == 1 & this.movingChess[0] == 9 - j & this.movingChess[1] == 8 - i)) {
            ctx.shadowBlur = 5
            ctx.shadowColor = 'red'
          }
          ctx.lineWidth = 2
          ctx.arc(this.cellWidth * i, this.cellWidth * j, this.cellWidth * this.chessRadius, 0, 2 * Math.PI, false)
          ctx.fillStyle = 'rgb(195,136,52)'
          // 设置填充棋子的颜色
          ctx.fill()
          // 填充!!
          ctx.closePath()
          ctx.stroke()
          ctx.restore()
          // 填充完毕后立即重置填充方式
          // 画棋子的内圈
          ctx.beginPath()
          ctx.arc(this.cellWidth * i, this.cellWidth * j, this.cellWidth * this.chessRadius * 0.81, 0, 2 * Math.PI, false)
          ctx.closePath()
          ctx.stroke()

          // 画棋子上的字
          ctx.save()
          if (chess[1] == -1) {
            ctx.strokeStyle = 'red'
          }
          ctx.lineWidth = 1
          ctx.font = CHESS_FONT_SIZE.toString() + 'px ' + CHESS_FONT
          ctx.strokeText(chess[0], this.cellWidth * i - 0.5 * CHESS_FONT_SIZE, this.cellWidth * j + this.chessRadius * CHESS_FONT_SIZE)
          ctx.restore()

          ctx.stroke()
        }   
        // return   
      }
    }
    ctx.restore()
    return canvas
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
   * @param {Array} pos - [i, j]
   * @param {ineger} player - 
   */
  move (pos, player) {
    if (player !== this.userData.activePlayer) {
      console.log(`request: ${player} - move error, not your turn `)
      return false
    }
    logger.trace(`starting move - movingChess: ${this.movingChess.cell}`)

    this.checkpoint[pos[0]][pos[1]] = this.checkpoint[this.movingChess.loc[0]][this.movingChess.loc[1]]
    this.checkpoint[this.movingChess.loc[0]][this.movingChess.loc[1]] = ['', 0]
    this.userData.moves++
    this.clearSelect(player)
  }

  /**
   * 选择棋子，需要知道是哪方的人在选择棋子,因为每个人报i,j的时候都是按照自己的角度来报的,其中i是第几行，j是第几列，但是转移到数组里就是j,i
   */
  select (pos, player) {
    const [i, j] = pos
    if (player !== this.userData.activePlayer) {
      logger.error(`request: ${player} - select error, not your turn `)
      return false
    }

    // pos = this.transformCoordinate(pos, player)

    if (this.checkpoint[i][j][1] !== player) {
      logger.error(`request: ${player} - select error, invalid cell`, this.checkpoint[i][j])
      return false
    }

    this.movingChess = {
      cell: this.checkpoint[i][j],
      loc: pos
    }
    logger.trace(`set movingChess - cell: ${this.checkpoint[i][j]}`)

    return this
  }

  // 选择并移动子
  selectAndMove (from, to, player) {
    from = this.transformCoordinate(from, player)
    to = this.transformCoordinate(to, player)

    this.select(from, player)

    const valid_moves = this.getValidMoves(from)
    if (_.indexOf(valid_moves.map(o => o.join(',')), to.join(',')) !== -1) {
      logger.trace(`valid move - from: ${from.join(',')} to: ${to.join(',')} player: ${player}`)
      this.move(to, player)
    } else {
      logger.error(`invalid move - from: ${from.join(',')} to: ${to.join(',')} player: ${player}`)
      this.clearSelect(player)
    }
  }

  clearSelect (player) {
    if (player !== this.userData.activePlayer) {
      console.log(`request: ${player} - select error, not your turn `)
      return false
    }
    this.movingChess = [-1, -1]
  }

  /**
   * 获取一个子的可走方位, 传进来的坐标应该都是被转化为标准坐标后的, 原因是现在调用这个方法是在
   * select之后
  */
  getValidMoves ([x, y]) {
    // x是行的编号 从0---9一共10个行
    // y是列的编号 从0---8 一个9个列
    const target = new Array()
    const player = this.checkpoint[x][y][1]
    let i = 0
    // 对应行的计数器
    let j = 0
    // 对应列的计数器
    // alert('fuck');
    var chess = this.checkpoint[x][y][0]
    // alert(chess);
  
    // 车的逻辑
    if (chess == '车' | chess == '車') {
      // 先向前走，如果碰到本方的子就不往前走了,碰到敌人的子就吃掉然后不往前走了
      for (i = x + 1; i <= 9; i++) {
        if (this.checkpoint[i][y][1] == player) {
          break
        }
        if (this.checkpoint[i][y][1] == player * -1) {
          target.push([i, y])
          break
        }
        target.push([i, y])
      }
      // 再向后走，如果碰到字就不往后走了
      for (i = x - 1; i >= 0; i--) {
        if (this.checkpoint[i][y][1] == player) {
          break
        }
        if (this.checkpoint[i][y][1] == player * -1) {
          target.push([i, y])
          break
        }
        target.push([i, y])
      }
      // 再向左走，如果碰到字就不往左走了
      for (j = y - 1; j >= 0; j--) {
        if (this.checkpoint[x][j][1] == player) {
          break
        }
        if (this.checkpoint[x][j][1] == player * -1) {
          target.push([x, j])
          break
        }
        target.push([x, j])
      }
      // 再向右走，如果碰到字就不往右走了
      for (j = y + 1; j <= 8; j++) {
        if (this.checkpoint[x][j][1] == player) {
          break
        }
        if (this.checkpoint[x][j][1] == player * -1) {
          target.push([x, j])
          break
        }
        target.push([x, j])
      }
    }
  
    // 马的逻辑
    if (chess == '马' | chess == '馬') {
      for (i = -2; i <= 2; i++) {
        for (j = -2; j <= 2; j++) {
          // 第一层：如果不出界,且在马位上
          if (Math.abs(i) + Math.abs(j) == 3 & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
            // 第二层：如果目标位置不是本方子,并且不挡马腿
            // 为了找到挡马腿的点，将偏移值除以3然后取整再做偏移，这样正好是挡马腿的点！
            if (this.checkpoint[x + i][y + j][1] != player & this.checkpoint[x + Math.round(i / 3)][y + Math.round(j / 3)][0] == '') {
              target.push([x + i, y + j])
            }
          }
        }
      }
    }
  
    // 炮的逻辑
    if (chess == '炮' | chess == '砲') {
      var paoforwardstand = 0
      var paobackwardstand = 0
      var paoleftstand = 0
      var paorightstand = 0
      // 先向前走，在没有跑架子的情况下，只要目标地点是空则都是可以移动的目标
      // 如果碰到子就进行下一个循环，在有炮架子的情况，则碰到第一个子就跳出循环，
      // 如果碰到的第一个子是敌人的子则push
      for (i = x + 1; i <= 9; i++) {
        if (paoforwardstand == 0) {
          if (this.checkpoint[i][y][0] == '') {
            target.push([i, y])
          } else {
            paoforwardstand = 1
          }
        } else { // 如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
          if (this.checkpoint[i][y][1] == -1 * player) {
            target.push([i, y])
            break
          }
        }
      }
      // 再向后走，如果碰到字就不往后走了
      for (i = x - 1; i >= 0; i--) {
        if (paobackwardstand == 0) {
          if (this.checkpoint[i][y][0] == '') {
            target.push([i, y])
          } else {
            paobackwardstand = 1
          }
        } else { // 如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
          if (this.checkpoint[i][y][1] == -1 * player) {
            target.push([i, y])
            break
          }
        }
      }
      // 再向左走，如果碰到字就不往左走了
      for (j = y - 1; j >= 0; j--) {
        if (paoleftstand == 0) {
          if (this.checkpoint[x][j][0] == '') {
            target.push([x, j])
          } else {
            paoleftstand = 1
          }
        } else { // 如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
          if (this.checkpoint[x][j][1] == -1 * player) {
            target.push([x, j])
            break
          }
        }
      }
      // 再向右走，如果碰到字就不往右走了
      for (j = y + 1; j <= 8; j++) {
        if (paorightstand == 0) {
          if (this.checkpoint[x][j][0] == '') {
            target.push([x, j])
          } else {
            paorightstand = 1
          }
        } else { // 如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
          if (this.checkpoint[x][j][1] == -1 * player) {
            target.push([x, j])
            break
          }
        }
      }
    }
  
    // 兵的逻辑：player=1的兵只能往+1的方向拱player=-1的兵只能往-1的方向拱,真他妈的好！
    if (chess == '兵' | chess == '卒') {
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          // 如果不出界,并且在兵的可能位置上，只能走一步
          if (Math.abs(i) + Math.abs(j) == 1 & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
            // 如果是兵拱的方向，如果过了河那么可以往左右走，并且目标地点没有自己的子
            if ((i == player | (player == 1 & x + i >= 5 & i == 0) | (player == -1 & x + i <= 4 & i == 0)) & this.checkpoint[x + i][y + j][1] != player) {
              target.push([x + i, y + j])
            }
          }
        }
      }
    }
  
    // 士的逻辑
    if (chess == '士' | chess == '仕') {
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          // 如果不出界并且在士 的位置上
          if (Math.abs(i) + Math.abs(j) == 2 & ((player == -1 & x + i >= 7 & x + i <= 9) | (player == 1 & x + i >= 0 & x + i <= 2)) & (y + j >= 3 & y + j <= 5)) {
            // 目标位置上没有自己的子
            if (this.checkpoint[x + i][y + j][1] != player) {
              target.push([x + i, y + j])
            }
          }
        }
      }
    }
    // 象的逻辑
    if (chess == '象' | chess == '相') {
      for (i = -2; i <= 2; i++) {
        for (j = -2; j <= 2; j++) {
          // 如果不出界并且在像位上
          if (Math.abs(i) + Math.abs(j) == 4 & Math.abs(i) == Math.abs(j) & ((player == 1 & x + i <= 4) | (player == -1 & x + i >= 5)) & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
            // 目标位置上没有自己的子 而且不卡象眼
            if (this.checkpoint[x + i][y + j][1] != player & this.checkpoint[x + (i / 2)][y + (j / 2)][0] == '') {
              target.push([x + i, y + j])
            }
          }
        }
      }
    }
  
    // 将的逻辑
    if (chess == '将' | chess == '帥') {
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          if (Math.abs(i) + Math.abs(j) == 1 & ((player == -1 & x + i >= 7 & x + i <= 9) | (player == 1 & x + i >= 0 & x + i <= 2)) & (y + j >= 3 & y + j <= 5)) {
            if (this.checkpoint[x + i][y + j][1] != player) {
              target.push([x + i, y + j])
            }
          }
        }
      }
    }
    return target
  }  

}

module.exports = ChessBattle
