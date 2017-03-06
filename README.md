# uploadImg
js  ajaxupload.js. 图片上传，使用ios与andorid 单独ajax上传
![img](https://github.com/AntonySufer/uploadImg/blob/master/githubImg/1.png)

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
