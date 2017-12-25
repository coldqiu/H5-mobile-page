/* 饼图组件对象 */

var H5ComponentPie = function (name, cfg) {

    var component = new H5ComponentBase(name, cfg);

    var w = cfg.width;
    var h = cfg.height;
    // 加入一个画布层  背景图
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 1);
    component.append(cns);

    var r = w / 2;
    // 加入一个底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // 加入一个画布层  数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 2);
    component.append(cns);

    var colors = ['red','blue','orange','green', 'gray'];
    var sAngel = 1.5*Math.PI;
    var eAngel = 0;
    var aAngel = 2*Math.PI;

    var step = cfg.data.length;
    for (var i=0;i<step;i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2] = colors.pop())
        eAngel = sAngel + aAngel * item[1];
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.strokeStyle=color;
        ctx.lineWidth=.1;

        ctx.moveTo(r,r);
        ctx.arc(r,r,r,sAngel,eAngel);
        ctx.fill();
        ctx.stroke();
        sAngel = eAngel;

        // 加入 所有项目名 文本
        var text = $('<div class="text">');
        text.text(item[0]);
        var per = $('<span class="per">');
        per.text(item[1]);
        text.append(per);

        var x = r + Math.sin(.5*Math.PI-sAngel)*r;
        var y = r + Math.cos(.5*Math.PI-sAngel)*r;
        if (x>w/2) {
            text.css('left',x/2);
        }else{
            text.css('right',(w-x)/2);
        }
        if(y>h/2) {
            text.css('top',y/2);
        }else {
            text.css('bottom',(h-y)/2);
        }
        component.append(text);
        if(item[2]) {
            text.css('color',item[2]);
        }
        text.css('opacity',0);
    }
    // 加入 蒙板层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 3);
    component.append(cns);

    // 层
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    var draw = function (per) {
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();
        ctx.moveTo(r,r);
        if(per <=0) {
            ctx.arc(r, r, r, 0, sAngel*Math.PI);
            component.find('.text').css('opacity',0);
        }else{
            ctx.arc(r, r, r, sAngel,sAngel+ 2*Math.PI*per,true);
        }
        ctx.fill();
        ctx.stroke();
        if(per>=1) {
            component.find('.text').css('transition','all 0s');
            // 由于 62 行的原因 '.text' --> '.text *', 后面的 willReset只能拿到 .per
            //H5ComponentPie.reSort(component.find('.text'));
            console.log('.text', component.find('.text'));
            component.find('.text').css('transition','all 1s');
            component.find('.text').css('opacity',1);
            ctx.clearRect(0,0,w,h);
            //  被排序的 文本出现异常，没有别重叠的 文本也被 排序了，
            //  递归调用失败， 上下翻页 文本的位置会被 做 重排的加法
        }
    };

    draw(0);
    component.on('onLoad', function () {
        // 数据生长, 一个闭包
        var s = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01;
                draw(s);
            }, i * 10 + 700);
        }
    });
    component.on('onLeave', function () {
        // 数据退场
        var s = 1;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01;
                draw(s);
            }, i * 10);
        }
    });
    return component;

};

H5ComponentPie.reSort = function(list) {
    // 1. 检测相交
    var compare = function(domA, domB) {

        // 元素的位置， 不用left ， 有时候 left 为 auto
        var offsetA = $(domA).offset();
        var offsetB = $(domB).offset();
        // domA 的投影
        var shadowA_x = [offsetA.left,$(domA).width() + offsetA.left];
        //console.log('shadowA_x',shadowA_x);

        var shadowA_y = [offsetA.top, $(domA).height()+ offsetA.top];

        // domB 的投影
        var shadowB_x = [offsetB.left,$(domB).width() + offsetB.left];
        var shadowB_y = [offsetB.top, $(domB).height()+ offsetB.top];

        // 检测 x
        var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0]<shadowB_x[1])
            || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] <shadowB_x[1]);
        // 检测 y
        var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0]<shadowB_y[1])
            || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] <shadowB_y[1]);
        // console.log('intersect_x',intersect_x);
        // console.log('intersect_y',intersect_y);
        //console.log('return',intersect_x && intersect_y);
        return intersect_x && intersect_y;
    }
    // 2. 错开重排
    var reset = function(domA,domB) {
        //不是所有元素都有 top，所以要判断
        if ($(domA).css('top') !== 'auto') {
            // 因为 $(domA).css('top') 取得的是 字符串 ，需要用 函数 parmInt() 解析成整型数据后 做加法
            $(domA).css('top', parseInt($(domA).css('top')) +$(domB).height());
        }else {
            $(domA).css('bottom', parseInt($(domA).css('bottom')) +$(domB).height());
        }

    };
    // 定义将重排的元素
    var willReset = [list[0]];

    $.each(list,function(i, domTarget) {
        //console.log('i','domTarget',i,domTarget);
        //console.log('$.each()aaaacccc');
        // console.log('willReset is who',willReset);
        //console.log('number of willReset.length',willReset[willReset.length-1]);
        // if (compare(willReset[willReset.length-1], domTarget)){
        //     console.log('$.each()aaaa');
        //     willReset.push(domTarget);  // 不会把自己加入到对比的列表中
        //     console.log('$.each()bbb');
        // }

        //!!! 出错 所以改了一下  if (compare(willReset[willReset.length-1], domTarget)){
        //但是 好像把自己 也放入了对比列表中
        if (list[i+1]) {
            compare(domTarget,list[i+1]);
            //console.log($(domTarget).text(),$(list[i+1]).text(),'香蕉',compare(domTarget,list[i+1]));
            willReset.push(domTarget);  // 不能把自己加入到对比的列表中

        }
    });

    if (willReset.length > 1) {
        $.each(willReset,function(i,domA) {
            if (willReset[i+1]) {
                reset(domA,willReset[i+1]);
            }
        });
        //debugger;
        //H5ComponentPie.reSort(willReset);
         // 这个递归调用 陷入死循环
    }

    //console.log('willReset',willReset);
    // //debugger;
    // $.each(list,function(i,domTarget) {
    //     if (list[i+1]) {
    //         //compare(domTarget,list[i+1])
    //         console.log($(domTarget).text(),$(list[i+1]).text(),'香蕉',compare(domTarget,list[i+1]));
    //     }
    // })
}






