define('mproduct_product_detail',['mcommon'],function(require,exports,module){
    var mcommon=require("mcommon");
    module.exports={
        _init_main:function(){
            if($("#J_index_search_div").length>0){
                // parent.document.getElementById("J_index_search_div").style.display='none';//隐藏搜索框
                $("#J_index_search_div").css("display","none");
            }
            // parent.document.getElementsByClassName("J_kasjdasd").style.overflow='hidden';
            // $(parent.window).scroll(function(){
            //       $('#J_kf_sc_cart').css({
            //         top:$(parent.window).scrollTop()+window.screen.height
            //       });
            //     });
            detail_rate._click();
            menu_fiexed._init();
            _rules._init();
            choose_op._init();
            listen_num._init();
            add_cart._init();
            now_buy._init();//立即购买
            tc_add_buy._init();//弹窗的加入购物车 立即购买
            shoucang._init();

            /**********商城1.3.0 需求添加 2016 12：26***********/
            supplier_info._click();
            /**********商城1.3.0 需求添加 2016 12：26***********/
        }
    }
    var menu_fiexed = {
        global_offset_top:null,
        _init:function(){
            setTimeout(function(){
                menu_fiexed.global_offset_top = $("#J_xuanfu_div_detail").offset().top;//初始化的时候由于轮播图的图片还没加载完全，高度不够，导致计算不对
            },20);
            $(window).scroll(function(){
                var dom_to_top = $("#J_xuanfu_div_detail").offset().top;
                var clear_dom = $("#J_xuanfu_none_detail");
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //滚轮的高度
                var _width = $(window).width();
                if( scrollTop > dom_to_top ){ //滚轮距离大于 元素到顶部的距离
                    clear_dom.css("display","");//添加占位DIV  防止闪动
                    $("#J_xuanfu_div_detail").css({
                        'z-index':'99',
                        "position":"fixed",
                        "top":"0px",//margin-top
                        "width":_width
                    });
                }else if(dom_to_top<=menu_fiexed.global_offset_top){
                    clear_dom.css("display","none");//清楚占位DIV
                    $("#J_xuanfu_div_detail").css({
                        'z-index':'',
                        "position":"",
                        "top":"",
                        "width":""
                    });
                }
            });
        }
    }
    var detail_rate = {//商品详情和评价切换
        _url:'',
        page_size:10,//每页请求数据的数量
        request_num:0,//请求了多少次
        total_page:0,//根据请求返回的数据得到总数据
        page:1,
        _click:function(){
            $(".J_product_detail_rate").click(function(){
                var _this = $(this);
                _this.addClass('list_boder');
                _this.parent().siblings().find("a").removeClass("list_boder");
                $('body').scrollTop(menu_fiexed.global_offset_top);
                var _product = $("#J_details_product");
                var _rate = $("#J_details_rated");
                if(_this.attr("info")=='rate'){//评价
                    _rate.css("display","");
                    _product.css("display","none");
                    if($("#J_details_rated").html()!=''){//加载过一次
                        detail_rate._url = "/index.php?route=product/get_reviews&product_id="+$("#J_product_id").val()+"&page_size="+detail_rate.page_size+"&page="+detail_rate.page;
                        mcommon.waterfall_flow._init(detail_rate._url,[],detail_rate.make_waterfall_div,'J_details_rated');
                        return false;
                    }
                    mcommon.waterfall_flow.global_flag = false;
                    $.get('/index.php?route=product/get_reviews&product_id='+$("#J_product_id").val()+'&page=1',[],detail_rate.make_waterfall_div,'json');
                }else{
                    _rate.css("display","none");
                    _product.css("display","");
                }
            });


            //内容上下标点击切换
            $('#J_details_rated').on('click','span.up_or_down',function () {

                var content =$(this).attr('data-content');
                if($(this).hasClass('hidebox')){
                    //down
                    $(this).removeClass('hidebox').addClass('showbox');
                    $(this).siblings('span').html(content);
                }else{
                    $(this).removeClass('showbox').addClass('hidebox');
                    $(this).siblings('span').html(content.substring(0,147)+"...");
                }
            })

        },
        make_waterfall_div:function(data,to_url){
            mcommon.waterfall_flow.global_flag = true;
            detail_rate.total_page = Math.ceil(parseInt(data.data.total)/detail_rate.page_size)==0?1:Math.ceil(parseInt(data.data.total)/detail_rate.page_size);//得到总页数
            detail_rate.request_num++;//请求次数+1
            mcommon.waterfall_flow.global_req_num = detail_rate.request_num;//将请求了多少次的num赋给公共函数的global_req_num变量用于判断
            mcommon.waterfall_flow.global_total_page = detail_rate.total_page//将得到的总页数的total_page赋给公共函数的global_total_page用于判断
            var _nodata_html = '';
            $('#rate_counts').html(data.data.total);

            if(data.data.total==0){//<p class="details_rated_tit">嗷~已经看到最后啦~~</p>
                _nodata_html='<p class="details_rated_tit">暂时还没有评价哦~</p>';
            }else if(detail_rate.total_page==1){
                _nodata_html='<p class="details_rated_tit">没有更多评价了哦~</p>';
            }
            if(detail_rate.total_page-1==detail_rate.request_num){
                _nodata_html='<p class="details_rated_tit">嗷~已经看到最后啦~~</p>';
            }
            var _index  = to_url.lastIndexOf("=");
            var font_str = to_url.substring(0,_index+1);
            var page_number = parseInt(to_url.substring(_index+1));
            page_number++;
            mcommon.waterfall_flow.global_url = font_str+page_number;
            var _html = '';

            var _list = data.data.reviews;

            //注释条
            /*if(data.data.total!=0){// /
             _html+='<p class="details_rated_tit">共<span>'+data.data.total+'</span>条评论</p>';
             }*/

            for(var i= 0;i<_list.length;i++){
                var much_star = parseInt(_list[i].rating);
                var _position = -(5-much_star)*37+'px';
                var  img_html="";//评价图片html
                var img_list =_list[i].img_list;//评价图片数组
                var one_all_length =img_list.length;
                if(img_list && one_all_length>0){
                    for(var j= 0;j<one_all_length;j++) {
                        /*img_html += ' <li class="poi1">'
                         + '<a href="' + img_list[j].img_l + '"><img  width="120" height="120" id="img2" src="' + img_list[j].img_s + '"></a>'
                         + '</li>';*/

                        img_html += '<li style="width: 120px;height: 120px;float: left;margin-left:5px;"> '
                            +'<div class="am-gallery-item">'
                            +'<a href="' + img_list[j].img_l + '">'
                            +'<img src="' + img_list[j].img_l + '" style="width: 120px;height: 120px;" />'
                            +'</a>'
                            +'</div>'
                            +' </li>';
                    }
                }

                //显示内容的是否省略测试nbs
                var is_display ="block";
                var has_display ="none";
                var short_content="";
                if(_list[i].content && _list[i].content.length>=150){
                    is_display ="none";
                    has_display ="block";
                    short_content = _list[i].content.substring(0,147)+"...";
                }

                _html+=
                    '<div class="details_rated_center">'+
                    '<div class="details_rated_mid">'+
                    '<p class="rated_mid_tit">'+
                    '<span class="mid_tit_left" style="font-size: 24px;">'+_list[i].author+'</span>'+
                    '<span class="mid_tit_center">'+
                    '<a class="center_star1" style="margin-top:-12px;background-position:'+_position+'"></a>'+
                    '</span>'+
                    '<span class="mid_tit_right" style="margin-top: -2px;">'+_list[i].in_date+'</span>'+
                    '</p>'+
                    '<p style="display: '+is_display+';"><span style="font-size: 24px">'+_list[i].content+'</span></p>'+
                    '<p  style="display: '+has_display+'"><span  style="font-size:24px">'+short_content+'</span><span data-content="'+_list[i].content+'" class="up_or_down fr hidebox"></span></p>'+
                    '<ul data-am-widget="gallery" class=" am-gallery  am-gallery-overlay" data-am-gallery="{pureview:true }" >'+img_html+'</ul>'+
                    '<p style="display:none;position: fixed;color: white;z-index: 9999999;top: 71%;left: 50%;"><span id="count">1</span>/<span>'+one_all_length+'</span></p>'+
                    '</div>'+
                    '</div>';
            }

            if(_nodata_html!='' && $(".details_rated_tit").length==0){//如果没有数据了
                _html+=_nodata_html;
            }
            $("#J_details_rated").append(_html);
            //大图插件
            $('.am-gallery').pureview();

        },

    }
    var _rules = {
        _init:function(){
            _rules._show();
        },
        _show:function(){
            var butt =  $("#J_choose_rules");
            butt.unbind("click");
            butt.click(function(){
                mcommon.common_mask();
                $(".J_rules_sure_a").css("display","none");
                $(".J_rules_add_buy").css("display","");
                //$("#J_rules_div").css("display","");
                // _rules._open();
                setTimeout(function(){//解决微信浏览器 打开后 没有绑定_rules.open回调的问题  sky
                    mcommon.open_transition._make('','bottom_to_top',_rules._open,'J_rules_div');
                },100);
            });
        },
        _open:function(){
            //$("#J_closest_id").parent().css("overflow","hidden");
            var _open_this = $("#J_mask,.J_close_tanchuang");
            _open_this.unbind("click");
            _open_this.click(function(){
                var _this = $(this);
                if(_this.attr("info")=='back'){//点击的是确定按钮，去判断登录
                    mcommon._verify_login();
                    return false;
                }
                //$("#J_rules_div").css("display","none");
                mcommon.open_transition._close('J_rules_div');
                $("#J_mask").remove();
                //if(_this.attr("info")=='sure'){//选择了商品，并且输入了某个选项的数量，已选择显示
                //注释 关闭页面也记录data
                //检查是否选中的商品
                if(!$.isEmptyObject(listen_num.check_if_choose())){//返回数据不为空
                    $("#J_already_choose").css("display","");
                }else{
                    $("#J_already_choose").css("display","none");
                }
                // }
            });
        }
    }
    var tc_add_buy = {//弹窗的 加入购物车，立即购买
        _init:function(){
            tc_add_buy._click();
            tc_add_buy._sure_click();
        },
        _click:function(){
            var add_buy = $(".J_rules_add_buy");
            add_buy.unbind("click");
            add_buy.click(function(){
                var _this = $(this);
                var _info = _this.attr("info");
                if($.isEmptyObject(listen_num.check_if_choose())){
                    mcommon.tips_alert("请输入需要购买的数量");
                    return false;
                }
                mcommon.open_transition._close('J_rules_div');
                $("#J_mask").remove();
                if(_info=='now_add'){//加入购物车
                    $("#J_add_to_cart").trigger("click");
                }else{//立即购买
                    $("#J_now_to_buy").trigger("click");
                }
            });
        },
        _sure_click:function(){
            var _sure = $(".J_rules_sure_a");
            _sure.unbind("click");
            _sure.click(function(){
                var _this = $(this);
                var _what = _this.attr("what");
                if($.isEmptyObject(listen_num.check_if_choose())){
                    mcommon.tips_alert("请输入需要购买的数量");
                    return false;
                }
                if(_what=='add'){//加入购物车
                    $("#J_add_to_cart").trigger("click");
                }else{//立即购买
                    $("#J_now_to_buy").trigger("click");
                }
            });
        }
    }
    var shoucang = {
        if_can_send:true,
        global_this:null,
        _init:function(){
            shoucang._click();
        },
        _click:function(){
            var sc_btn = $("#J_shoucang_this_id");
            sc_btn.unbind("click");
            sc_btn.click(function(){
                var _this =$(this);
                shoucang.global_this = _this;
                var _this_product_id = _this.attr("product_id");
                var _data = {};
                _data.product_id = _this_product_id;
                if(shoucang.if_can_send){
                    shoucang.if_can_send = false;
                    if(_this.find("p").eq(0).hasClass("sel_xing")){//如果当前是已收藏，就取消收藏
                        mcommon._ajax_post('/index.php?route=i/delWishlist',_data,shoucang._success);
                    }else{
                        mcommon._ajax_post("/index.php?route=cart/addWishlist",_data,shoucang._success);
                    }
                }
            });
        },
        _success:function(data){
            shoucang.if_can_send = true;
            if(data.status!=200){
                mcommon.tips_alert(data.info);
                return false;
            }
            var _this_p = shoucang.global_this.find("p").eq(0);
            if(_this_p.hasClass("sel_xing")){
                _this_p.removeClass("sel_xing");
                mcommon.tips_alert('取消收藏成功');//公用一个接口，我的收藏，返回 删除成功 不恰
            }else{
                _this_p.addClass("sel_xing");
                mcommon.tips_alert(data.info);
            }

        }
    }
    var add_cart = { //add_cart_success
        if_can_send:true,
        _init:function(){
            add_cart._click();
        },
        _click:function(){
            var again_btn = $("#J_add_to_cart");
            again_btn.unbind("click");
            again_btn.click(function(){
                $(".J_rules_sure_a").attr("what","add");
                if($("#J_already_choose").css("display")=='none'&&$("#J_rules_div").css("display")=='none'){//没有选择   弹窗隐藏的情况下
                    $("#J_choose_rules").trigger("click");
                    $(".J_rules_sure_a").css("display","");//点击事件之后（弹窗）隐藏确定按钮 下面显示加入购物车，立即购买
                    $(".J_rules_add_buy").css("display","none");
                    return false;
                }
                if(!mcommon._verify_login()){
                    return false;
                }
                $("#J_add_cart_form").attr("action","/index.php?route=cart/add");//切换 action地址
                $("#J_hidden_callback").val('parent.add_success');
                mcommon._ajax_frame_callback(mcommon.get_obj('ajaxframeid'),'add_success',add_cart.buy_success);
                if(add_cart.if_can_send){
                    add_cart.if_can_send = false;
                    mcommon.get_obj('J_add_cart_form').submit();
                    return false;
                }
            });
        },
        buy_success:function(data){
            mcommon._remove_ajax_frame_callback(mcommon.get_obj('ajaxframeid'),'add_success');
            add_cart.if_can_send = true;
            if(data.status!=200){
                mcommon.tips_alert(data.info);
                return false;
            }
            if($("#J_rules_div").css("display")!='none'){
                mcommon.open_transition._close('J_rules_div');
            }
            $("#J_mask").remove();
            mcommon.tips_alert(data.info);
        }

    }
    var now_buy ={//立即购买
        if_can_send:true,
        _init:function(){
            now_buy._click();
        },
        _click:function(){
            var button_ = $("#J_now_to_buy");
            button_.unbind("click");
            button_.click(function(){
                var _this = $(this);
                $(".J_rules_sure_a").attr("what","buy");
                if($("#J_already_choose").css("display")=='none'&&$("#J_rules_div").css("display")=='none'){//没有选择
                    $("#J_choose_rules").trigger("click");
                    $(".J_rules_sure_a").css("display","");//点击事件之后（弹窗）隐藏确定按钮 下面显示加入购物车，立即购买
                    $(".J_rules_add_buy").css("display","none");
                    return false;
                }
                if(!mcommon._verify_login()){
                    return false;
                }
                $("#J_add_cart_form").attr("action","/index.php?route=checkout/buynow");//切换 action地址
                $("#J_hidden_callback").val('parent.buy_success');
                mcommon._ajax_frame_callback(mcommon.get_obj('ajaxframeid'),'buy_success',now_buy.now_buy_success);
                if(now_buy.if_can_send){
                    now_buy.if_can_send = false;
                    mcommon.get_obj('J_add_cart_form').submit();
                    return false;
                }
            });
        },
        now_buy_success:function(data){
            mcommon._remove_ajax_frame_callback(mcommon.get_obj('ajaxframeid'),'buy_success');
            now_buy.if_can_send = true;
            if(data.status!=200){
                mcommon.tips_alert(data.info);
                return false;
            }
            if($("#J_rules_div").css("display")!='none'){
                mcommon.open_transition._close('J_rules_div');
            }
            $("#J_mask").remove();
            mcommon.tips_alert(data.info);
            window.location.href=data.url;
        }
    }
    var choose_op = {//点击选项，获取价格
        _init:function(){
            choose_op._click();
        },
        _click:function(){
            var _btn = $(".J_choose_options");
            _btn.unbind("click");
            _btn.click(function(){
                var _this = $(this);
                var _img = _this.attr("data_image");
                $("#J_detail_main_img").find("img").attr("src",_img);
                _this.removeClass("details-tck_wu").addClass("details-tck");
                _this.parent().parent().siblings().find(".J_choose_options").removeClass("details-tck").addClass("details-tck_wu");
            });
        }
    }
    var listen_num = {
        global_this_obj:null,
        global_total_number:0,
        global_data_l:null,
        _init:function(){
            listen_num._click();
            listen_num.num_key_up();
        },
        _click:function(){
            var num_change = $(".J_number_change");
            num_change.unbind("click");
            num_change.click(function(){
                var _this =$(this);
                listen_num.global_this_obj = _this;
                var _input = _this.parent().find(".J_number_keyup");
                var info = _this.attr("info");
                var kuchun = _this.parent().attr("kuchun");
                var now_num = parseInt(_input.val());
                if(info=='add'){//增加
                    if(parseInt(_input.val())>=parseInt(kuchun)){//大于库存
                        mcommon.tips_alert("超过库存了喔!");
                        return false;
                    }
                    now_num++;
                    _input.val(now_num);
                }else{//减少
                    if(parseInt(_input.val())<=0){
                        return false;
                    }
                    now_num--;
                    _input.val(now_num);
                }
                listen_num.get_data();//请求价格
            });
        },
        num_key_up:function(){
            var num_change = $(".J_number_keyup");
            num_change.unbind("blur");
            num_change.blur(function(){

                var _this =$(this);
                var kucun = parseInt(_this.parent().attr("kuchun"));
                var _this_val = parseInt(_this.val());
                if(_this.val()==''||isNaN(_this.val())){
                    mcommon.tips_alert("输入正确的数量");
                    _this.val(0);
                    return false;
                }
                if(_this_val>kucun){//大于库存
                    mcommon.tips_alert("此商品库存不够了哦");
                    _this.val(kucun);
                }
                listen_num.get_data();//请求价格J_number_keyup
            });
        },
        get_data:function(){
            listen_num.check_if_choose();//得到参数
            var _data = listen_num.global_data_l;
            mcommon._ajax_post('/index.php?route=product/total_price',_data,listen_num.get_data_success);
        },
        get_data_success:function(data){
            var _total_price = data.data.total_price;
            $("#J_total_price_rule").html(mcommon.thousand_bit_separator(_total_price));
            $("#J_total_num_rule").html(listen_num.global_total_number);
        },
        check_if_choose:function(){//检查是否选中了商品，选中了哪些商品 ，_data
            var _input = $(".J_number_keyup");
            var in_len = _input.length;
            var _data ={};
            var total_num = 0;
            var options = {};
            var _op_data = {};
            if(in_len>1){//有选项，
                var sku_1 = [],sku_2 = [],quantity=[];
                for(var i=0,len = in_len;i<len;i++){
                    var _this_i_val = parseInt(_input.eq(i).val());
                    total_num += _this_i_val;
                    var sku_1_val = _input.eq(i).parent().find(".J_product_sku1").val();
                    var sku_2_val = _input.eq(i).parent().find(".J_product_sku2").val();
                    sku_1.push(sku_1_val);
                    sku_2.push(sku_2_val);
                    quantity.push(_this_i_val);
                    _op_data['sku_1'] = sku_1;
                    _op_data['sku_2'] = sku_2;
                    _op_data['quantity'] = quantity;
                }
                _data.item_sku = _op_data;

            }else{//没有选项  product_id quantity
                total_num = typeof($(".J_number_keyup").val())=='undefined'?0:$(".J_number_keyup").val();//BUG修复 没登录  input输入框没有类名
            }
            listen_num.global_total_number = total_num;
            _data.item_id = $("#J_product_id").val();
            _data.quantity = total_num;
            listen_num.global_data_l = _data;
            return _data.quantity==0?{}:_data;
        }

    }
    /*************商城1.3.0 添加需求（2016 12：26）  antony* start*****************/
    var supplier_info ={
        //绑定事件
        _click: function () {
            //运费说明
            $('#freight_note').on('click',function () {
                $('#detail_shawn').show();
                $('#detail_window').show();
            })

            $('.deatil_hide').on('click',function () {
                $('#detail_shawn').hide();
                $('#detail_window').hide();
            })

        }

    }


    /*************商城1.3.0 添加需求  antony* end*****************/

});
