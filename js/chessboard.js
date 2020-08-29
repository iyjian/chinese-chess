function draw_chessboard (canvas, width, startpoint) {
  // var canvas = $('#chessboard')
  // canvas.attr("width", $(window).get(0).innerWidth);
  // canvas.attr("height", $(window).get(0).innerHeight);

  canvas.attr('width', canvas.width())
  canvas.attr('height', canvas.height())
  $('#chessheader').css('width', $('#container').width() - 10)
  $('#chessheader').css('height', $('#container').width() / 12 - 10)
  var ctx = canvas.get(0).getContext('2d')
  // var width = width;
  // 象棋每个格子的宽度，每个格子是正方形所以一个值就够了
  var chuhehanjie_fontsize = 0.5 * width
  var w1 = 0.12 * width
  // 炮点和兵点上的标记线的长度
  var w2 = 0.05 * width
  // 炮点和兵点上标记线和棋盘格子时间的距离
  // Apaocrosspoint 是所有需要画炮点和兵点上的交叉标记的棋盘坐标点，后面我会把它乘上对应的棋盘格子的宽度width
  var Apaocrosspoint = [[1, 2], [7, 2], [1, 7], [7, 7], [0, 3], [2, 3], [4, 3], [6, 3], [8, 3], [0, 6], [2, 6], [4, 6], [6, 6], [8, 6]]
  Apaocrosspoint.forEach(function (data) {
    data[0] = data[0] * width
    data[1] = data[1] * width
  })
  ctx.clearRect(0, 0, $(window).get(0).innerWidth, $(window).get(0).innerHeight)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.translate(startpoint[0], startpoint[1])
  // 设置棋盘的初始点
  ctx.save()

  // 画竖线
  ctx.beginPath()
  for (var i = 0; i <= 8; i = i + 1) {
    if (i == 0 || i == 8) {
      ctx.moveTo(i * width, 0)
      ctx.lineTo(i * width, 9 * width)
    } else {
      ctx.moveTo(i * width, 0)
      ctx.lineTo(i * width, 4 * width)
      ctx.moveTo(i * width, 5 * width)
      ctx.lineTo(i * width, 9 * width)
    }
  }

  // 画横线
  for (var j = 0; j <= 9; j = j + 1) {
    ctx.moveTo(0, j * width)
    ctx.lineTo(8 * width, j * width)
  }

  // 画棋盘外面的粗框
  ctx.moveTo(-3, -3)
  ctx.lineTo(-3, 9 * width + 3)
  ctx.lineTo(3 + 8 * width, 9 * width + 3)
  ctx.lineTo(3 + 8 * width, -3)
  ctx.lineTo(-3, -3)

  // 画九宫格里的斜线
  ctx.moveTo(3 * width, 0 * width)
  ctx.lineTo(5 * width, 2 * width)
  ctx.moveTo(5 * width, 0 * width)
  ctx.lineTo(3 * width, 2 * width)
  ctx.moveTo(3 * width, 7 * width)
  ctx.lineTo(5 * width, 9 * width)
  ctx.moveTo(5 * width, 7 * width)
  ctx.lineTo(3 * width, 9 * width)

  Apaocrosspoint.forEach(function (data) {
    ctx.save()
    ctx.translate(data[0], data[1])
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (Math.abs(i) + Math.abs(j) == 2 && !(data[0] == 0 * width && i == -1) && !(data[0] == 8 * width && i == 1)) {
          //! (data[0] == 0 * width && i == -1)   如果是棋盘最左边的兵点则不画坐标轴左侧的部分
          //! (data[0] == 8 * width && i == 1)    如果是棋盘最右边的兵点则不画坐标轴右侧的部分
          ctx.moveTo(i * w2, j * (w1 + w2))
          ctx.lineTo(i * w2, j * w2)
          ctx.lineTo(i * (w1 + w2), j * w2)
        }
      }
    }

    ctx.restore()
  })
  ctx.stroke()

  ctx.translate(2 * width, 4.5 * width)
  // 设置汉界的中心点
  ctx.rotate(-Math.PI / 2)
  ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
  ctx.fillText('汉', -0.25 * width, -0.2 * width)
  ctx.fillText('界', -0.25 * width, (0.5 + 0.2) * width)

  ctx.restore()

  ctx.translate(6 * width, 4.5 * width)
  // 设置楚河的中心点
  ctx.rotate(Math.PI / 2)
  ctx.font = chuhehanjie_fontsize.toString() + 'px sans-serif'
  ctx.fillText('楚', -0.25 * width, -0.2 * width)
  ctx.fillText('河', -0.25 * width, (0.5 + 0.2) * width)

  ctx.restore()
  ctx.closePath()
}
