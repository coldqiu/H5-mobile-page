/* 雷达图组件对象 */

var H5ComponentRadar = function (name,cfg) {
    var component = new H5ComponentBase(name, cfg);

    var w = cfg.width;
    var h = cfg.height;
    // 加入一个画布层  雷达背景图
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var r = w/2;
    var step = cfg.data.length;

    // 计算圆周上的坐标（多边形的顶点坐标）
    // 已知： 圆心坐标(a,b) 半径 r  角度 deg;

    // 绘制网格背景
    var isBlue = false;
    for (var s=10;s>0;s--) {
        ctx.beginPath();
        for (var i=0;i<step;i++) {
            var rad = (2*Math.PI/360)*(360/step)*i;
            var x = r + Math.sin(rad)*r*(s/10);
            var y = r + Math.cos(rad)*r*(s/10);
            ctx.lineTo(x,y);
        }
        ctx.closePath();
        //ctx.lineWidth = 2;
        //ctx.lineStyle = 'white';
        ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
        ctx.fill()
    }
    // 绘制 伞骨
    for (var i=0;i<step;i++) {
        var rad = (2*Math.PI/360)*(360/step)*i;
        var x = r + Math.sin(rad)*r;
        var y = r + Math.cos(rad)*r;
        ctx.moveTo(r,r);
        ctx.lineTo(x,y);
        // 添加项目名 文字
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        text.css('tansition','all .5s '+i*0.1 + 's');// 让文字按顺序出现
        // 给 项目名定位
        if (x > w/2){
            text.css('left',x/2+5);
        }else{
            text.css('right',(w-x)/2+5);
        }

        if (y > h/2) {
            text.css('top',y/2+5);
        } else {
            text.css('bottom',(h-y)/2+5);
        }

        if (cfg.data[i][2]) {
            text.css('color',cfg.data[i][2]);
        }
        component.append(text);
        text.css('opacity',0);
    }
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();

    // 加入一个画布层  数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    ctx.strokeStyle = '#f00';

    var draw = function(per) {
        if(per >= 1 ) {
            component.find('.text').css('opacity',1);
        }
        if(per <= 1 ) {
            component.find('.text').css('opacity',0);
        }

        ctx.clearRect(0,0,w,h);// 清空画布(0,0)左上点，(w,h)右下点
        // 输出数据的折线
        for (var i=0;i<step;i++) {
            var rad = (2*Math.PI/360)*(360/step)*i;
            var rate = cfg.data[i][1]*per;
            var x = r + Math.sin(rad)*r*rate;
            var y = r + Math.cos(rad)*r*rate;
            ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.stroke();

        // 输出数据 画圆点
        ctx.fillStyle = '#ff7676';
        for (var i=0;i<step;i++) {
            var rad = (2*Math.PI/360)*(360/step)*i;
            var rate = cfg.data[i][1]*per;
            var x = r + Math.sin(rad)*r*rate;
            var y = r + Math.cos(rad)*r*rate;

            ctx.beginPath();
            ctx.arc(x,y,5,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
            //ctx.stroke();
        }
    };

    component.on('onLoad', function() {
        // 数据生长, 一个闭包
        var s = 0;
        for(i=0;i<100;i++) {
            setTimeout(function() {
                s+=0.01;
                draw(s);
            },i*10+700);
        }
    });
    component.on('onLeave', function() {
        // 数据退场
        var s = 1;
        for(i=0;i<100;i++) {
            setTimeout(function() {
                s-=0.01;
                draw(s);
            },i*10);
        }
    });
    return component;

}
