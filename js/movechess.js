/**
 * @author chong.wu.xiangfan@gmail.com
 */
function redrawchess(width, startpoint, chessradius, checkpoint, selectedchess, signal) {
	var canvas = $("#chess");
	//canvas.attr("width", $(window).get(0).innerWidth);
	//canvas.attr("height", $(window).get(0).innerHeight);
	canvas.attr("width", $('#container').width());
	canvas.attr("height", $('#container').height());
	var ctx = canvas.get(0).getContext('2d');
	var CHESSFONTSIZE = width * 0.4;
	var CHESSFONT = 'sans-serif';
	ctx.clearRect(0, 0, 1000, 1000);
	ctx.save();
	ctx.translate(startpoint[0], startpoint[1]);
	//设置棋盘的初始点
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;

	//alert(signal);

	checkpoint.forEach(function(data, j) {
		j = (signal == 1) ? 9 - j : j;

		data.forEach(function(chess, i) {
			i = (signal == 1) ? 8 - i : i;

			if(chess[0] != "") {
				ctx.beginPath();

				//画棋子外面的圈圈
				ctx.save();
				ctx.beginPath();
				//ctx.shadowBlur = 5;
				//ctx.shadowColor = 'red';
				//如果是红方，selectedchess中的值和i,j都是没有翻转过的
				if((signal == -1 & selectedchess[0] == j & selectedchess[1] == i) || (signal == 1 & selectedchess[0] == 9 - j & selectedchess[1] == 8 - i)) {
					//if (selectedchess[0] == j & selectedchess[1] == i) {
					ctx.shadowBlur = 5;
					ctx.shadowColor = 'red';
				}
				ctx.lineWidth = 2;
				ctx.arc(width * i, width * j, width * chessradius, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgb(195,136,52)';
				//设置填充棋子的颜色
				ctx.fill();
				//填充!!
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
				//填充完毕后立即重置填充方式
				//画棋子的内圈
				ctx.beginPath();
				ctx.arc(width * i, width * j, width * chessradius * 0.81, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.stroke();

				//画棋子上的字
				ctx.save();
				if(chess[1] == -1) {
					ctx.strokeStyle = "red";
				}
				ctx.lineWidth = 1;
				ctx.font = CHESSFONTSIZE.toString() + 'px ' + CHESSFONT;
				ctx.strokeText(chess[0], width * i - 0.5 * CHESSFONTSIZE, width * j + 0.35 * CHESSFONTSIZE);
				ctx.restore();

				ctx.stroke();

			}
		});
	});
	ctx.restore();

}

function move(selectedchess, i, j, checkpoint) {
	var tempcheckpoint;
	tempcheckpoint = checkpoint;
	tempcheckpoint[i][j] = checkpoint[selectedchess[0]][selectedchess[1]];
	tempcheckpoint[selectedchess[0]][selectedchess[1]] = ["", 0];

	return tempcheckpoint;
}

function showTarget(player, checkpoint, x, y) {
	//x是行的编号 从0---9一共10个行
	//y是列的编号 从0---8 一个9个列
	var target = new Array();
	var i = 0;
	//对应行的计数器
	var j = 0;
	//对应列的计数器
	//alert('fuck');
	var chess = checkpoint[x][y][0];
	// alert(chess);

	//车的逻辑
	if(chess == "车" | chess == "車") {
		//先向前走，如果碰到本方的子就不往前走了,碰到敌人的子就吃掉然后不往前走了
		for( i = x + 1; i <= 9; i++) {
			if(checkpoint[i][y][1] == player) {
				break;
			}
			if(checkpoint[i][y][1] == player * -1) {
				target.push([i, y]);
				break;
			}
			target.push([i, y]);
		}
		//再向后走，如果碰到字就不往后走了
		for( i = x - 1; i >= 0; i--) {
			if(checkpoint[i][y][1] == player) {
				break;
			}
			if(checkpoint[i][y][1] == player * -1) {
				target.push([i, y]);
				break;
			}
			target.push([i, y]);
		}
		//再向左走，如果碰到字就不往左走了
		for( j = y - 1; j >= 0; j--) {
			if(checkpoint[x][j][1] == player) {
				break;
			}
			if(checkpoint[x][j][1] == player * -1) {
				target.push([x, j]);
				break;
			}
			target.push([x, j]);
		}
		//再向右走，如果碰到字就不往右走了
		for( j = y + 1; j <= 8; j++) {
			if(checkpoint[x][j][1] == player) {
				break;
			}
			if(checkpoint[x][j][1] == player * -1) {
				target.push([x, j]);
				break;
			}
			target.push([x, j]);
		}
	}

	//马的逻辑
	if(chess == "马" | chess == "馬") {
		for( i = -2; i <= 2; i++) {
			for( j = -2; j <= 2; j++) {
				//第一层：如果不出界,且在马位上
				if(Math.abs(i) + Math.abs(j) == 3 & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
					//第二层：如果目标位置不是本方子,并且不挡马腿
					//为了找到挡马腿的点，将偏移值除以3然后取整再做偏移，这样正好是挡马腿的点！
					if(checkpoint[x + i][y + j][1] != player & checkpoint[x + Math.round(i / 3)][y + Math.round(j / 3)][0] == "") {
						target.push([x + i, y + j]);
					}
				}
			}
		}
	}

	//炮的逻辑
	if(chess == "炮" | chess == "砲") {
		var paoforwardstand = 0;
		var paobackwardstand = 0;
		var paoleftstand = 0;
		var paorightstand = 0;
		//先向前走，在没有跑架子的情况下，只要目标地点是空则都是可以移动的目标
		//如果碰到子就进行下一个循环，在有炮架子的情况，则碰到第一个子就跳出循环，
		//如果碰到的第一个子是敌人的子则push
		for( i = x + 1; i <= 9; i++) {
			if(paoforwardstand == 0) {
				if(checkpoint[i][y][0] == "") {
					target.push([i, y]);
				} else {
					paoforwardstand = 1;
				}
			} else {//如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
				if(checkpoint[i][y][1] == -1 * player) {
					target.push([i, y]);
					break;
				}

			}
		}
		//再向后走，如果碰到字就不往后走了
		for( i = x - 1; i >= 0; i--) {
			if(paobackwardstand == 0) {
				if(checkpoint[i][y][0] == "") {
					target.push([i, y]);
				} else {
					paobackwardstand = 1;
				}
			} else {//如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
				if(checkpoint[i][y][1] == -1 * player) {
					target.push([i, y]);
					break;
				}

			}
		}
		//再向左走，如果碰到字就不往左走了
		for( j = y - 1; j >= 0; j--) {
			if(paoleftstand == 0) {
				if(checkpoint[x][j][0] == "") {
					target.push([x, j]);
				} else {
					paoleftstand = 1;
				}
			} else {//如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
				if(checkpoint[x][j][1] == -1 * player) {
					target.push([x, j]);
					break;
				}
			}
		}
		//再向右走，如果碰到字就不往右走了
		for( j = y + 1; j <= 8; j++) {
			if(paorightstand == 0) {
				if(checkpoint[x][j][0] == "") {
					target.push([x, j]);
				} else {
					paorightstand = 1;
				}
			} else {//如果有炮架子，那么碰到敌人方的子，就push，然后立马break;
				if(checkpoint[x][j][1] == -1 * player) {
					target.push([x, j]);
					break;
				}
			}
		}
	}

	//兵的逻辑：player=1的兵只能往+1的方向拱player=-1的兵只能往-1的方向拱,真他妈的好！
	if(chess == "兵" | chess == "卒") {
		for( i = -1; i <= 1; i++) {
			for( j = -1; j <= 1; j++) {
				//如果不出界,并且在兵的可能位置上，只能走一步
				if(Math.abs(i) + Math.abs(j) == 1 & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
					//如果是兵拱的方向，如果过了河那么可以往左右走，并且目标地点没有自己的子
					if((i == player | (player == 1 & x + i >= 5 & i == 0) | (player == -1 & x + i <= 4 & i == 0)) & checkpoint[x + i][y + j][1] != player) {
						target.push([x + i, y + j]);
					}

				}
			}
		}

	}

	//士的逻辑
	if(chess == "士" | chess == "仕") {
		for( i = -1; i <= 1; i++) {
			for( j = -1; j <= 1; j++) {
				//如果不出界并且在士 的位置上
				if(Math.abs(i) + Math.abs(j) == 2 & ((player == -1 & x + i >= 7 & x + i <= 9) | (player == 1 & x + i >= 0 & x + i <= 2)) & (y + j >= 3 & y + j <= 5)) {
					//目标位置上没有自己的子
					if(checkpoint[x + i][y + j][1] != player) {
						target.push([x + i, y + j]);
					}
				}
			}
		}

	}
	//象的逻辑
	if(chess == "象" | chess == "相") {
		for( i = -2; i <= 2; i++) {
			for( j = -2; j <= 2; j++) {
				//如果不出界并且在像位上
				if(Math.abs(i) + Math.abs(j) == 4 & Math.abs(i) == Math.abs(j) & ((player == 1 & x + i <= 4) | (player == -1 & x + i >= 5)) & x + i >= 0 & x + i <= 9 & y + j >= 0 & y + j <= 8) {
					//目标位置上没有自己的子 而且不卡象眼
					if(checkpoint[x + i][y + j][1] != player & checkpoint[x + (i / 2)][y + (j / 2)][0] == "") {
						target.push([x + i, y + j]);
					}
				}
			}
		}
	}

	//将的逻辑
	if(chess == "将" | chess == "帥") {
		for( i = -1; i <= 1; i++) {
			for( j = -1; j <= 1; j++) {
				if(Math.abs(i) + Math.abs(j) == 1 & ((player == -1 & x + i >= 7 & x + i <= 9) | (player == 1 & x + i >= 0 & x + i <= 2)) & (y + j >= 3 & y + j <= 5)) {
					if(checkpoint[x + i][y + j][1] != player) {
						target.push([x + i, y + j]);
					}
				}
			}
		}
	}
	return target;

}