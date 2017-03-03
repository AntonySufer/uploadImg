<?php $this->import('common/header'); ?>

<!--主体-->
<!--评价-->
<div class="container_center order_container_center order_details_section">
    <p class="shop_center_list">
        <span class="pic_img f-c"><img src="<?php echo $image; ?>" /></span>
        <span class="text_tit f-c"><a href="#"><?php echo $product_name; ?></a></span>
        <span class="btn-jiage f-c queren_w">
            <?php if ($special) { ?>
                <span class="jiage"><span>¥</span><b><?=format_price($special)?></b></span> 
                <span class="shangchu_jiage"><span class="grey_span">¥<?=format_price($price)?></span></span>
            <?php } else { ?>
                <span class="jiage"><span>¥</span><b><?=format_price($price)?></b></span>
            <?php } ?>
            <span class="order_xnum"></span>
        </span>
    </p>
</div>
<form name="product_review" action="" method="post" target="ajaxframeid">
    <input type="hidden" name="rating" value="5" />
    <input type="hidden" name="order_item_id" value="<?php echo $order_item_id; ?>" />
    <input type="hidden" name="callback" value="parent._submit_success" />
    <div class="pingjia" >
        <p class="rated_mid_tit" style="width: 170px;">
            <span class="mid_tit_left">总体评价：</span>
        <div class="mid_tit_center" style="padding-top: 40px;">
            <ul id="J_star">
                <li><a class="center_xing" style=""></a></li>
                <li><a class="center_xing" style=""></a></li>
                <li><a class="center_xing" style=""></a></li>
                <li><a class="center_xing" style=""></a></li>
                <li><a class="center_xing" style=""></a></li>
            </ul>
        </div>
        </p>
        <div class="ping_input">
            <div class="order_text">
                <textarea id="J_content" name="content" class="order_input" placeholder="您的评价对于其他顾客很有帮助，写满15字，才是好同志~~"></textarea>
                <span><i id="J_content_input_length">0</i>/<i id="J_content_limit">500</i></span>
            </div>
            <p class="mt30 f-c">
                <!--隐藏-->
                <input type="hidden" id="imgList" name="images" value=""/>
              <span id="uploadCon">
                <span class="publish_rating_span bgm" id="upload_dom_0" style="position: relative;">
                    <input class="fileup" name="upload_images" id="upload_0" accept="image/png,image/jpg,image/jpeg" capture="camera"   data-index="0" type="file" placeholder="">
                    <img id="img_flure0"  class="img_flure imgSee" style="position:relative;width:91px;opacity:0;height:91px;border:0px;">
                    <span style="cursor: pointer;position: relative;top:-97px;left: 77px;opacity:0;" class="close_butt" data-index="0"></span>
                    <span id="press0"  class="press_flure"  style="position: absolute;left:0px;top:86px;display: inline-block;width: 4px;opacity:0;height:5px;background-color: rgba(83, 247, 1, 0.407843);"></span>
                  </span>
                </span>
              </span>
            </p>
       <!--     <p class="pingjia_p"><span class="balck_span">昵称：</span><span class="grey_span"><?php /*echo $customer_name; */?></span></p>
       -->
        </div>
    </div>
</form>
<!--主体-->
<div class="footer_main poi3 pingjia-btn " style="padding: 0;">
    <ul class="details_footer">
        <li class="J_review_submit details_footer_tit details_red" data-is_submit="true">
            <a>发表评价</a>
        </li>
    </ul>
</div>



<script type="text/javascript" src="<?=$this->config->get('static_host');?>??/dist/js/lib/seajs/sea.js,/dist/js/lib/seajs/seajs-combo.js,/dist/js/lib/seajs/seajs-style.js?v=<?php echo time(); ?>"></script>
<script type="text/javascript" src="<?=$this->config->get('static_host');?>??/dist/js/mi/hash.js,/dist/js/config_<?=  strtolower(ENVIRONMENT)?>.js?v=<?php echo time(); ?>"></script>

<script type="text/javascript">
    seajs.use("mi_write_review", function (mi_write_review) {
        mi_write_review._init_main();
    });
</script>

<!--图片上传 和 seajs模块jquery1.7冲突-->
<script type="text/javascript" src="<?=$this->config->get('static_host');?>commonFile/fileUpload/jquery1.9.1.js?v=<?php echo time();?>"></script>
<script type="text/javascript" src="<?=$this->config->get('static_host');?>commonFile/fileUpload/ajaxfileupload.js?v=<?php echo time();?>"></script>
<script src="<?=$this->config->get('static_host');?>??/dist/js/lib/layer_mobile/layer.js"></script>
<link href="<?=$this->config->get('static_host');?>??/dist/js/lib/layer_mobile/need/layer.css" type="text/css" rel="styleSheet" id="layermcss"/>

<script>

    $("#uploadCon").on("change",'input.fileup',function(){

        var  index =parseInt($(this).attr('data-index'));
        //预览start
        var file = document.getElementById('upload_'+index).files[0];
         if(file.size>3145728){
             layer.open({
                 content: '上传的图片不能大于3M哦'
                 ,skin: 'msg'
                 ,time: 2 //2秒后自动关闭
             });
             return false;
         }
        $('#img_flure'+index).css('top',"-90px") ;
        $('#img_flure'+index).css('opacity',"1") ;
        $('#img_flure'+index).attr('src',getObjectURL(file)) ;
        //设置不可发布评价
        $(".J_review_submit").attr('data-is_submit','false') ;
        //显示进度条
         $('#press'+index).css('opacity',1);
         var setInter = setInterval(function () {
            var old_width =parseInt($('#press'+index).width());
            if(old_width>=88){
                $('#press'+index).width("88px");
                clearInterval(setInter);//取消
            }else{
                $('#press'+index).width(old_width+4+"px");
            }
          },"1000");

        //上传文件
        $.ajaxFileUpload({
            url:"<?php echo $upload_url;?>",//处理图片脚本
            secureuri :false,
            fileElementId :'upload_'+index,//file控件id
            dataType : 'json',
            success : function (data, status){
                if(status=='success'){
                    //关闭进度条
                    $(".J_review_submit").attr('data-is_submit','true') ;
                    clearInterval(setInter);
                    $('#press'+index).remove();//精度条
                    $('#img_flure'+index).attr('data-abs',data.data.abs);
                    $('#img_flure'+index).attr('name',"updateNew");
                    //新增上传
                    var new_index=index+1;
                    if(new_index==4){
                        new_index=4;
                    }else{
                        var html ='<span class="publish_rating_span bgm" id="upload_dom_'+new_index+'" style="position: relative;" >'
                                +'  <input class="fileup" id="upload_'+new_index+'" name="upload_images" id="upload_0" capture="camera"   accept ="image/!*" data-index="'+new_index+'" type="file" placeholder=""/>'
                                +'  <img id="img_flure'+new_index+'" class="img_flure imgSee"  style="position:relative;width: 91px;opacity:0;height:91px;border:0px;">'
                                +'  <span style="cursor: pointer;position: relative;top: -97px;;left: 77px;opacity:0;" class="close_butt" data-index="'+new_index+'" ></span>'
                                +'  <span id="press'+new_index+'" class="press_flure" style="position: absolute;left:0px;top:86px;display: inline-block;width: 11px;opacity:0;height:5px;background-color: rgba(83, 247, 1, 0.407843);"></span>'
                            +'</span>';
                        $('#upload_'+index).parents('span.bgm').after(html);
                    }
                    $('#upload_'+index).remove();
                    $('#img_flure'+index).css('top',"0px") ;
                    $('#img_flure'+index).siblings('span.close_butt').css('opacity',"1") ;


                }

            },
            error: function(data, status, e){
                $('.J_review_submit').attr('disabled',false);
                layer.open({
                    content: '上传失败，请重试'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                console.log('data:'+JSON.stringify(data)+"//status:"+status+"e://"+e);
            }
        });


    });

    $("#uploadCon").on('click','span.close_butt',function(event) {
        var index = $(this).attr('data-index');
        $('#upload_dom_'+index).remove();
        var index_last =$("#uploadCon").find('img[name=updateNew]').length;
        if(index_last==3){
            var html ='<span class="publish_rating_span bgm" id="upload_dom_'+index_last+'" style="position: relative;" >'
                +'  <input class="fileup" id="upload_'+index_last+'" name="upload_images" id="upload_0" capture="camera"   accept ="image/!*" data-index="'+index_last+'" type="file" placeholder=""/>'
                +'  <img id="img_flure'+index_last+'" class="img_flure imgSee"  style="position:relative;top: 0px;width: 91px;opacity:0;height:91px;border:0px;">'
                +'  <span style="cursor: pointer;position: relative;top:-97px;left: 77px;opacity:0;" class="close_butt" data-index="'+index_last+'" ></span>'
                +'  <span id="press'+index_last+'" class="press_flure" style="position: absolute;left:0px;top:86px;display: inline-block;width: 11px;opacity:0;height:5px;background-color: rgba(83, 247, 1, 0.407843);"></span>'
                +'</span>';
            $('#uploadCon').append(html);
        }

        $("#uploadCon span.bgm").each(function (index) {
            $(this).attr('id','upload_dom_'+index);
            $(this).children('span.press_flure').attr('id','press'+index);
            $(this).children('img.img_flure').attr('id','img_flure'+index);
            $(this).children('input.fileup').attr('id','upload_'+index);
            $(this).children('input.fileup').attr('data-index',index);
            $(this).find('span.close_butt').attr('data-index',index);

        });

    });

    //获取图片地址
    function getObjectURL(file) {

        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        console.log(url);
        return url;
    }

</script>

<?php $this->import('common/footer'); ?>
</body>
</html>
