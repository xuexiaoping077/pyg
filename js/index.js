$(function(){
banner()
  product()


})
// 生成动态banner结构模板
function banner() {
  $.ajax({
    type:'get',
    url:'home/swiperdata',
    dataType:'json',
    success:function(result){
        // console.log(result);
        if(result.meta.status ==200){
          // 生成图片轮播样式
          var html = template('bannerTemp', result)
          $('.slider-banner').html(html)
          /* 渲染小圆点 */
          var Indi = template('indiTemp',result)
          $('.mui-slider-indicator').html(Indi)

          mui('.mui-slider').slider({
            interval:1000
          })
        }
        
    }


  })


}
// 商品信息列表
function product(){
  $.ajax({
    type: 'get',
    url: 'home/goodslist',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      var productHTML = template('productTemp',result)
      $('.pyg_product').html(productHTML)
     
      

    

    }
  })
}