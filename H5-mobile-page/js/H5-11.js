/* H5-11 */

var H5 = function () {
    this.id = ('h5_'+Math.random()).replace('.','_');
    this.el = $('<div class="h5" id="'+this.id+'">').hide();
    this.page = [];
    $('body').append( this.el );
    //$('body').append('<div class="adf">');
    /*
    * 新增一个页面
    * @param{string} name 组件名， 会加入到ClassName
    * @param {string} text 页面内的默认文本
    * @return {H5} H5对象， 可以重复使用的H5对象支持的方法
    * */
    this.addPage = function(name, text) {
        var page = $('<div class="h5_page section">');
        if (name != undefined) {
            page.addClass('h5_page_'+name);
        }
        if (text != undefined) {
            page.text(text);
        }

        //this.el 是 this.el = $('<div class="h5" id="'+this.id+'">').hide();
        // this 是 H5对象
        this.el.append(page);
        this.page.push(page);
        // 每次 加入 page 是都在后面 执行这个函数
        if(typeof this.whenAddPage === 'function') {
            this.whenAddPage();
        }
        return this;
    };
    // 新增一个组件
    this.addComponent = function(name, cfg) {
        var cfg = cfg || {};
        cfg = $.extend({
            type: 'base'
        },cfg);

        var component;
        //关于链式调用下 的获取page  var page = this.page.slice(-1)[0];
        // page 是当前页
        var page = this.page.slice(-1)[0];

        switch(cfg.type) {
            case 'base':
                component = new H5ComponentBase( name, cfg);
            break;
            case 'pie':
                component = new H5ComponentPie( name, cfg);
            break;
            case 'bar':
                component = new H5ComponentBar( name, cfg);
            break;
            case 'bar_v':
                component = new H5ComponentBar_v( name, cfg);
                break;
            case 'point':
                component = new H5ComponentPoint( name, cfg);
            break;
            case 'polyline':
                component = new H5ComponentPolyline( name, cfg);
            break;
            case 'radar':
                component = new H5ComponentRadar( name, cfg);
            break;
            case 'ring':
                component = new H5ComponentRing( name, cfg);
            break;

            default:

        }
        page.append(component);

        return this;
    };

    this.loader = function(firstPage) {
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

    return this;
};