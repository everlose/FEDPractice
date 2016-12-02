## 简介

此目录是canvas练习的demo

* ball1.html canvas画小球，并让其滚动
* ball2.html canvas画多个小球滚动
* charts.html canvas画柱状图，并适配h5尺寸。

## canvas绘图基础--基本绘制接口 ##

### 1.声明一块画布 ###
    <body>
        <canvas id="canvas" width="600" style="border:1px solid #aaa; display:block">
            ...
        </canvas>
    </body>

### 2.用javascript在画布上进行绘制 ###
    初始化只需要2步操作：
    （1）取出canvas标签
        var canvas = document.getElementById("canvas");
    （2）取得绘图的上下文环境，是绘制图画所需要的接口，该方法也可以用来判断浏览器是否支持canvas
        var context = canvas.getContext("2d");
    用js给画布设置高宽：
        canvas.width = 800;
        canvas.height = 600; 

#### 阶段小结：1.canvas.width; 2.canvas.height; 3.canvas.getContext("2d"); ####

### 3.绘制直线 ###
    声明绘制开始：context.beginPath()
    起点（落笔）：context.moveTo(x, y)
    终点：context.lineTo(x, y)
    线条宽度：context.lineWidth = 5
    线条颜色：context.lineStyle = "#005588"
    连起来：context.stroke()
    声明绘制结束：context.closePath()

### 4.绘制弧线 ###
    context.arc(
        centerx, centery,  radius,          // 圆心坐标和半径
        startingAngle, endingAngle,     // 起点和终点的弧度值
        anticlockwise                           // 可选，已顺时针绘制还是逆时针，默认false顺时针
    )
    对startingAngle和endingAngle做下说明：
     
### 5.填充颜色 ###
    设置颜色：context.fillStyle = "#005588"
    用笔填充：context.fill()

#### 阶段小结：canvas绘图和真实的绘画一样，就是描边和填充2种方法。 ####