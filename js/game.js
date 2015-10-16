window.onload = function() {
    var stage,
        container,
        canvas,
        robot, //机器人
        robotBitmap,
        daisy,
        size = 30,
        timeCount = timeTick = 1,
        fpsLabel,
        daisis = []; //菊花数组

    canvas = document.getElementById('demoCanvas');
    stage = new createjs.Stage(canvas);

    viewW = document.documentElement.offsetWidth;
    viewH = document.documentElement.offsetHeight;
    stage.width = canvas.width = viewW;
    stage.height = canvas.height = viewH;

    // 设置触摸可用，如果当前的设备支持的话
    createjs.Touch.enable(stage);

    // 设置鼠标划入划出的间隔
    stage.enableMouseOver(10);
    // // 一直监听鼠标移动事件
    stage.mouseMouseOutside = true;

    /**
     * 初始化人物位置
     * @param {int} size 总共落下的个数
     * @return {[type]} [description]
     */
    function init(size) {
        robot = new Image();
        daisy = new Image();

        robot.onload = handleComplete;

        robot.src = 'images/robot.png';
        daisy.src = 'images/daisy.png';
    }

    function handleComplete() {
        fpsLabel = new createjs.Text("-- fps", "bold 36px Arial", "red");
        fpsLabel.x = 10;
        fpsLabel.y = 20;

        var bitmap = robotBitmap = new createjs.Bitmap(robot);
        bitmap.name = robotBitmap.name = 'robot';
        stage.addChild(bitmap, fpsLabel);

        bitmap.regX = bitmap.image.width / 2 | 0;
        bitmap.regY = bitmap.image.height / 2 | 0;
        var scaleX = scaleY = 0.8;
        var x = Math.random() * (viewW - bitmap.image.width * scaleX) | 0,
            y = viewH - bitmap.image.height * scaleY;
        bitmap.setTransform(x, y, scaleX, scaleY);

        bitmap.on('mousedown', function(event) {
            this.parent.addChild(this);
            // 计算鼠标点击落点与图片中心点的偏移量
            this.offset = {
                x: this.x - event.stageX,
                y: this.y - event.stageY
            };
        });

        bitmap.on('pressmove', function(event) {
            var tempX = event.stageX + this.offset.x;
            if (tempX < 0) {
                this.x = 0;
            } else {
                if (tempX > (viewW - this.image.width * this.scaleX)) {
                    this.x = viewW - this.image.width * this.scaleX;
                } else {
                    this.x = tempX;
                }
            }
            this.y = viewH - this.image.height * this.scaleY;
        });

        // 类似于mouseover事件，但是不会冒泡，有点像事件代理，只会有一个事件接收对象，
        // 那就是多个shape实例的父容器container
        // bitmap.on('rollover', function(event) {
        //     this.scaleX = this.scaleY = this.scale * 1.2;
        // });

        // bitmap.on('rollout', function(event) {
        //     this.scaleX = this.scaleY = this.scale;
        // });

        // 初始化菊花1数
        drawDaisy(daisy);

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', tick);
    }

    function drawDaisy(daisy) {
        var bmap = new createjs.Bitmap(daisy);
        bmap.name = 'daisy';
        var rScale = Math.random() * 1.5 | 0 + 1;
        var sp = Math.random() * 10 | 0 + 3;
        var x = Math.random() * (viewW - bmap.image.width * rScale) | 0;
        var scaleH = bmap.image.height * rScale;
        var y = -bmap.image.height;
        bmap.setTransform(x, y, rScale, rScale);
        daisis.push(bmap);
        stage.addChild(bmap);
    }


    function tick(event) {
        var deltaS = event.delta / 1000;
        timeTick += event.delta;
        // 计数，每隔一秒绘制一个花朵
        if ((timeTick / 1000 | 0) == timeCount && daisis.length < size) {
            timeCount++;
            drawDaisy(daisy);
        }

        // 花朵降落
        for (var i = 0; i < daisis.length; i++) {
            daisis[i].y = daisis[i].y + 300 * deltaS;
            // TODO 检测碰撞
            // 当daisi[i].y == viewH - robot.image.height*this.scaleY
            // daisis[i].x > robot.x && daisis[i].x <= robot.x + robot.image.width*robot.scaleX
            if (daisis[i].y >= (viewH - robotBitmap.image.height * robotBitmap.scaleY) && daisis[i].y < viewH) {
                if (daisis[i].x > robotBitmap.x && (daisis[i].x <= (robotBitmap.x + robotBitmap.image.width * robotBitmap.scaleX))) {
                    // 从画布上清除,robot为第一个元素，这里要i+1
                    stage.removeChild(daisis[i]);
                    daisis.splice(i, 1);
                }
            }
        }

        stage.update(event);
        fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

        if (daisis[daisis.length - 1].y > viewH) {
            createjs.Ticker.removeEventListener('tick', tick);
        }
    }

    init();
}