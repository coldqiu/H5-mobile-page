/**折线图*/

var H5ComponentPolyline = function (name,cfg) {
    var component = new H5ComponentBase(name, cfg);

    var w = cfg.width;
    var h = cfg.height;
    // 背景
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "lightblue";

    window.ctx = ctx;
    // 水平线
    for (var i=0;i<step+1;i++) {
        var y = (h/step)*i;
        ctx.moveTo(0,y);
        ctx.lineTo(w,y);
    }

    // 垂线
    var step = cfg.data.length+1;
    var text_w = w/step >> 0;

    for (var i=0;i<step+1;i++) {
        var x = (w/step)*i;
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);

        if (cfg.data[i]) {
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.css('width', text_w/2).css('left',x/2 + text_w/4);

            component.append(text);
        }
    }
    ctx.stroke();//结束画线

    // 折线图 画布

    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);


    /*
    * 绘制折线以及对应的数据和阴影
    * @param {floot} per 0到1之间的数据 会根据per值的变化在y轴上 是per的背书
    * @return {DOM} component元素
    * */
    var draw = function(per) {
        ctx.clearRect(0,0,w,h);// 清空画布(0,0)左上点，(w,h)右下点

        // 画折线图
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";

        var x = 0;
        var y = 0;
        // ctx.moveTo(200,150);
        // ctx.arc(200 ,150, 100, 0, 2*Math.PI);
        var step = cfg.data.length+1;
        x_raw = w/(cfg.data.length+1);
        //  画点
        for (i in cfg.data) {
            var item = cfg.data[i];
            x = x_raw * i + x_raw;
            y = (1-item[1]*per) * h;
            ctx.moveTo(x,y);
            ctx.arc(x,y,2,0,2*Math.PI);
        }
        // 连线
        ctx.moveTo(x_raw,h * (1 - cfg.data[0][1]*per));//移动画笔到第一个位置
        //ctx.arc(x,y,10,0,2*Math.PI);

        for (i in cfg.data) {
            var item = cfg.data[i];
            x = x_raw * i + x_raw;
            y = (1 - item[1]*per) * h;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 136, 120, 0.2)';
        // 绘制阴影
        ctx.lineTo(x,h);
        ctx.lineTo(x_raw,h);
        ctx.fillStyle = 'rgba(255, 136, 120, 0.2)';// 将线的颜色的设置成背景色
        ctx.fill();

        // 写数据
        for (i in cfg.data) {
            var item = cfg.data[i];
            x = x_raw * i + x_raw;
            y = (1-item[1]*per) * h;
            ctx.fillStyle = item[2] ? item[2] : '#595959';
            ctx.fillText( (item[1]*100>>0)+'%', x-10, y-10);
        }

        ctx.stroke();//结束画线
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

