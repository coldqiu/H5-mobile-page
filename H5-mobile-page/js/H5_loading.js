var H5_loading = function(images, firstPage) {

    var id = this.id;

    if (this._images === undefined) { // 第一次进入页面
        this._images = (images || []).length;
        this._loaded = 0;
        // 把当前组件 报录在 window 中
        window[id] = this; // 把当前对象存储在全局对象 window
        // 中，用来进行某个图片加载完成之后的回调

        for (s in images) {
            var item = images[s];
            //js 中创建 图片对象
            var img = new Image;
            // 在图片载入 完成后执行的函数 onload

            img.onload = function() {
                window[id].loader();
            }
            // 为图片指定 地址
            img.src = item;
        }
        $('#rate').text('0%');
        return this;
    }else {
        //  一长图片加载完成后 _load 加一
        this._loaded ++;
        // >> 取整数部分
        console.log('this._loaded,this._images:',this._loaded,this._images);
        $('#rate').text(((this._loaded/this._images *100) >> 0) + '%');
        console.log('aaaaaaa',$('#rate').text());
        if(this._loaded < this._images) {
            // 在所有图片加载前 一直执行
            return this;
        }
    }
    window[id] = null;

    this.el.fullpage({
        // 在fullpage中 this 是 当前页
        onLeave:function(index, nextIndex, direction) {
            $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad:function(anchorLink, index) {
            $(this).find('.h5_component').trigger('onLoad');
        }
    });
    // 在fullpage 之外 this.page[0] 是当前页
    this.page[0].find('.h5_component').trigger('onLoad');
    this.el.show();
    if(firstPage){
        $.fn.fullpage.moveTo(firstPage);
        //console.log('fn',$.fn); firstPage 是页码
    }

};