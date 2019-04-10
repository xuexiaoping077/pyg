$(function(){
/* 初始化区域滑动 ，使得内容部分可以进行滑动*/
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  

  render()

  var info={
    goods_id:'',
    cat_id:'',
    goods_name:'',
    goods_price:'',
    goods_number:'',
    goods_weight:'',
    goods_small_logo:'',
      }
function render(){
$.ajax({
  type:'get',
  url: 'goods/detail',
  // 获取商品id
  data: $.getParameter(location.search),
  dataType:'json',
  success:function(result){
    // 为info赋值
    info.cat_id = result.data.cat_id
    info.goods_id = result.data.goods_id
    info.goods_name = result.data.goods_name
    info.goods_number = result.data.goods_number
    info.goods_price = result.data.goods_price
    info.goods_small_logo = result.data.goods_small_logo
    info.goods_weight = result.data.goods_weight


    console.log(result);
    var html = template('goodsDetailTemp',result.data)
    $('.mui-scroll').html(html)
    //获得slider插件对象,轮播图转起来
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
    });
  }
 
})

}
  $('.btn-addCart').on('tap',function(){
    
      //1.判断是否有token，如果没有重定向登陆页面。
      //shiyong session存储
var mytoken = sessionStorage.getItem('pyg_token')
    // 页面 跳转到登陆页面，从哪来，回哪去  redirectUrl浏览器，自己拼接上去的参数。由于没有token的时候，上面也要用到这个值，所以提取到函数外面
    sessionStorage.setItem('redirectUrl', location.href)
    if(!mytoken){
      location.href='./login.html'
     //  sessionStorage.setItem('redirectUrl', location.href)
    
    }else{
      // 如果有token，那么发送ajax请求
      $.ajax({
        type:'post',
        url:'my/cart/add', // 购物车添加商品
        data: {info:JSON.stringify(info)},  //需要一个对象
        dataType:'json',
        success:function(result){
          console.log(result);
          // 判断token是否过期，如果过期，重定向
          if(result.meta.status === 401){
            
            location.href('./login.html')
            // location.href = './login.html?redirectUrl ='+ location.href
          }else{
            // 提示
            mui.confirm('添加成功，是否查看购物车？', '温馨提示', ['跳转', '取消'], function (e) {
              // index代表当前按钮的索引，索引从0开始
              if (e.index == 0) {
                // 跳转到购物车页面
                location.href = 'cart.html'
              } else {

              }
            })
          }

        }
      })
    }
   

})



})