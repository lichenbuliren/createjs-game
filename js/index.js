window.onload = function() {

    /**
     * 思路：
     * 每一行只有一个黑块，黒块位置随机0-3
     * 黒块绑定touch，click事件，
     * 点击之后积分累加，同事绘制新的一行
     *
     * 白块点击，游戏结束，终止tick事件
     *
     * 白块和黒块包含在一个container容器中
     *
     * container.y 大于屏幕高度时，clear掉
     *
     *
     * 方块宽度为容器宽度/4
     * 高度为容器高度/4,
     *
     *
     * 最后：
     *
     * 动态计算屏幕宽高，
     * 设置画布大小，舞台大小
     *
     * 绘制初始界面
     *
     * 定时事件，container移动，删除超出的container,新增container
     */

    var stage, container, canvas, timeFn, text = 0;

    canvas = document.getElementById('demoCanvas');
    stage = new createjs.Stage(canvas);
    container = new createjs.Container();
    stage.addChild(container);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', stage);
    stage.enableMouseOver();
    createjs.Touch.enable(stage);

    viewW = document.documentElement.offsetWidth;
    viewH = document.documentElement.offsetHeight;
    canvas.width = viewW;
    canvas.height = viewH;
    stage.width = viewW;
    stage.height = viewH;
    blockW = viewW / 4;
    blockH = viewH / 4;


    /**
     * 绘制方块
     * 继承createjs.Shape();
     * @param  {[type]} w 容器宽度
     * @param  {[type]} h 容器高度
     * @return {[type]}   [description]
     */
    function drawBlock(w, h) {
        createjs.Shape.call(this);
        this.bType = 1;
        this.setType = function(type) {
            this.bType = type;
            if (type == 1) {
                this.drawWhite();
            } else if (type == 2) {
                this.drawBlack();
            }
        }

        this.getType = function() {
            return this.bType;
        }

        this.drawWhite = function() {
            this.graphics.beginStroke('#000').beginFill('#fff').drawRect(1, 1, w / 4, h / 4).endFill();
        }

        this.drawBlack = function() {
            this.graphics.beginStroke('#000').beginFill('#000').drawRect(1, 1, w / 4, h / 4).endFill();
        }
    }

    drawBlock.prototype = new createjs.Shape();

    /**
     * 初始化布局
     * @param  {[type]} w    [description]
     * @param  {[type]} h    [description]
     * @param  {[type]} size 初始化多少行
     * @return {[type]}      [description]
     */
    function init(w, h, size) {
        var rowContainerArr = [];
        //当前可以点击的行
        var current = 0;

        for (var n = size; n >= 0; n--) {
            rowContainerArr[n] = new createjs.Container();
            rowContainerArr[n].y = (3 - n) * h / 4;
            var black = Math.random() * 4 | 0;

            for (var i = 0; i < 4; i++) {
                var block = new drawBlock(w, h);
                block.x = i * w / 4;
                if (black == i) {
                    block.setType(2);
                } else {
                    block.setType(1);
                }

                rowContainerArr[n].addChild(block);
            }

            if (n == current) {
                handleRowClick(current, rowContainerArr, h);
            }
            container.addChild(rowContainerArr[n]);
        }
    }


    /**
     * 过渡事件，给可以点击的行元素中的方块添加事件
     * @param  {[type]} current [description]
     * @param  {[type]} views   [description]
     * @param  {[type]} h       [description]
     * @return {[type]}         [description]
     */
    function handleRowClick(current, rowContainerArr, h) {
        for (var i = 0; i < 4; i++) {
            handlerClick(i, current, rowContainerArr, h);
        }
    }


    /**
     * 方块点击事件
     * @param  {[type]} i       [description]
     * @param  {[type]} current [description]
     * @param  {[type]} view    [description]
     * @param  {[type]} h       [description]
     * @return {[type]}         [description]
     */
    function handlerClick(i, current, rowContainerArr, h) {
        var obj = rowContainerArr[current].getChildAt(i);
        obj.addEventListener('click', function(event) {
            if (obj.getType() == 1) {
                alert('游戏结束，你的成绩是：' + text.toFixed(1) + '秒点击了' + (current - 1) + '次黒块');
                clearInterval(timeFn);
            } else if (obj.getType() == 2) {
                // 初始化计时器
                if (current == 1) {
                    text = 0;
                    timeFn = setInterval(function() {
                        text += 0.1;
                        document.getElementById("time").innerHTML = text.toFixed(1);
                    }, 100);
                }
                container.y += h / 4;
                current++;
                handleRowClick(current, rowContainerArr, h);
            }
        });
    }

    init(viewW, viewH, 100);
}