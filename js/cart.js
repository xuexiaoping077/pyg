$(function(){
  // 初始化scroll控件
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
  render()
 // 获取接口数据 ,动态生成模板
 function render(){
  $.ajax({
    type:'get',
    url:"my/cart/all",
    dataType:"json",
    success:function(result){
      console.log(result); // 需要用到的数据是json格式的字符串。需要转换成对象使用
      var obj =JSON.parse(result.data.cart_info)
      console.log(obj);
      var html = template('cartTemp',{list:obj})
      $('.orderList').html(html)
      // 重新对number-box进行初始化，否则数量加减不能使用
      mui('.pyg_userNum').numbox()
      totalNum()
    }
    
  })
 }
// 当点击完成按钮的时候，实现页面的切换
  $('.mui-pull-right').on('tap',function(){
    $('body').toggleClass('eleToggle')
    if ($(this).text()=='完成'){
      $(this).text('编辑')
    }else{
      $(this).text('完成') 
        //将用户编辑的结果，更新至数据库。即购物车的同步
      syncCart($('.order'))
    }
  
    
  })
  // 同步购物车 就是将用户更新的数据，提交给购物车。
  // allList就是需要同步的数据
  function syncCart(allList){
    // 获取用户更新的数据
    var list_obj ={ };
    for (var i = 0; i < allList.length;i++){
      var data = $(allList[i]).data('order')
      console.log(data);
      // 用户修改的数量
      data.amount = $(allList[i]).find('#test').val()
      // 后台需要的数据格式是键值对的形式
      list_obj[data.goods_id] =data
      // 相当于 var list_obj = {data.goods_id:data,data.goods_id1:data1}
    }

    console.log(list_obj);

      $.ajax({
        type: 'post',
        url: "my/cart/sync",
        data: { 'infos': JSON.stringify(list_obj)}, // 文档要求，需要字符串
        dataType: "json",
        success: function (result) {
          console.log(result);
          mui.toast(result.meta.msg)
        }

      })

  }

  // 计算总价
  var total
  function totalNum(){
    // 获取商品的单价与数量
    // 我把数量价格，存放再某个地方。但是，只写这些，同步购物车的时候，还需要提交其他数据。所以，保存value值。
     total=0;
    var orders = $('.order')
    orders.each(function(index,value){
      console.log(value);  // 获得个div
  //用自定义属性，获取需要的信息
      var price= $(value).data('order').goods_price
      //console.log(price);
      // 获取数据框input 的数量值。因为数量是可变的
      var proNum = $(value).find('#test').val()
      //console.log(proNum);
      total = total+price * proNum
      //console.log(total);
    })
    // 赋值到总价钱=的位置
    $('.total').text('￥'+ total)
  }
  // 单击修改数量，重新获取总价,委托的形式，绑定事件
  $('.orderList').on('tap','.pyg_userNum .mui-btn ',function(){
    
    totalNum()
  })
  // 实现删除，同步购物车.将没被选中的数据，交给服务器，及逆行渲染即可。
  $('.pyg_orderDel').on('tap',function(){
    // 获取 复选框没有checked属性的列，将他的父盒子，同步到也页面。并且将数据
    var list = $('.orderList').find("[type='checkbox']").not(':checked').parents('.order')
    console.log(list);
    // 提示
    mui.confirm('确定删除商品？', '温馨提示', ['删除', '取消'], function (e) {
      // index代表当前按钮的索引，索引从0开始
      if (e.index == 0) {
        
    syncCart(list)
        mui.toast('删除成功')
    // 重新渲染页面
    render()
     } })
  })
// 生成订单
  $('.create_order').on('tap',function(){
    var obj = {
      "order_price": total,
      "consignee_addr": $('#cityResult3').text(),
      "goods": []
    }

    // 获取goods 里面的数据
    // 遍历每一笔订单中的数据，并且存储
    $('.order').each(function(index,value){
      var  singer ={}
      var temp = $(value).data('order')
           singer.goods_id =  temp.goods_id
          singer.goods_price = temp.goods_price
           singer.goods_number =temp.amount
          obj.goods.push(singer)

    })

    $.ajax({
      type:'post',
      url:'my/orders/create',
      data: obj,
      dataType:'json',
      success:function(result){
        console.log(result);
        location.href ='./orders.html'
      }
    })


  })






  // 三级联动，将省市区自动选择
  $('#showCityPicker3').on('tap',function(){
    var picker = new mui.PopPicker({
      layer: 3
    });
    // 给picker对象添加数据。setData添加的是数组.需要引入data.js的文件
    console.log(data);
    picker.setData(data); 
    // 显示picker
    picker.show(function(item){
      //再需要显示的地方，text属性
      $('#cityResult3').text(item[0].text + "-" + item[1].text+ "-" + item[2].text)
    }) 

  })

})