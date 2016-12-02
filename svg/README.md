## svg图形绘制

svg图形标签有以下几个

* rect 矩形
* circle 圆形
* ellipse 椭圆
* line 画线条
* polygon 画多边形
* polyline 画包含直线的形状。
* path 定义路径。
* filter 滤镜。
* linearGradient 线性渐变
* radialGradient 放射渐变

style 属性用来定义 CSS 属性
* CSS 的 fill 属性定义矩形的填充颜色（rgb 值、颜色名或者十六进制值）
* CSS 的 stroke-width 属性定义矩形边框的宽度
* CSS 的 stroke 属性定义矩形边框的颜色
* CSS 的 fill-opacity 属性定义填充颜色透明度（合法的范围是：0 - 1）
* CSS 的 stroke-opacity 属性定义边框颜色的透明度（合法的范围是：0 - 1）

demo见svg.html

## svg smil animation动画
SMIL允许你做下面这些事情：
* 动画元素的数值属性（X, Y, …）
* 动画属性变换（平移或旋转）
* 动画颜色属性
* 沿着运动路径运动
前三条css3可以解决，只有最后一条css3无法办到，所以我们重点关注如何沿着路径运动。

而svg的animation元素有
* set 可以在特定时间之后修改某个属性值（也可以是CSS属性值）。
* animate 基础动画元素。实现单属性的动画过渡效果
* animateColor 颜色动画。不过，animate可以实现其功能与效果，因此，此属性已经被废弃。
* animateTransform 变换动画，缩放，旋转，平移等。
* animateMotion 路径动画，这是svg能超越css3的地方。

demo见animate.html
1 沿着山坡跑的马
* 沿着山坡跑的马，并且自动旋转（加了rotate）
* 控制马跑的速度
* 沿着山坡跑的马自动旋转,点击还能暂停，开始，使用svg.pauseAnimations();的api
* 沿着山坡跑的马自动旋转，并且点击圆点后才开始运动（改了begin）
* 沿着山坡跑的马自动旋转且只跑一次，并且点击圆点后才开始运动一次（加了restart属性）


## 参考
> (w3school的svg实例)(http://www.w3school.com.cn/svg/svg_examples.asp)
> (svg动画演示)[http://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/]
> (w3cplus，svg滤镜特效)[http://www.w3cplus.com/svg/why-the-svg-filter-is-awesome.html]
