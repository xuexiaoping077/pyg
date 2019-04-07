$(function(){
 // mui('.mui-off-canvas-wrap').offCanvas('show');

// 发送清求，获取数据

  $('.mui-icon-search').on('tap', function () {
    mui('.mui-off-canvas-wrap').offCanvas('show');
  })
// 传入的参数
  var  data = {
    query:'',
    // url问号后面的数据  location.search获得？及以后的数据。然后getParameter对数据进行处理，得到obj，形式的数据。拆分
    cid:getParameter(location.search).cid,
    pagenum:1,
    pagesize:10
  }
// 获取数据
function renderMainData(callback,obj){
    $.ajax({
      type:'get',
      url:'goods/search',
      data:$.extend(data,obj), // 为了方便，将搜索栏的参数，添加到页面
      dataType:'json',
      success:function(result){
        console.log(result);
        callback(result)
      }
    })

}




// 下拉刷新
  mui.init({
    swipeBack: false,
    pullRefresh: {
      container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50,//可选,默认50.触发下拉刷新拖动距离,
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: function () {    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          data.pagenum=1
          renderMainData(function (result) {
            var html = template('goodlistTemp', result.data)
            $('.goodslist').html(html)
            // 下拉刷新结束
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
            mui('#refreshContainer').pullRefresh().refresh(true)
          })


        } 
    },
    // 上拉加载
      up: {
        height: 50,//可选.默认50.触发上拉加载拖动距离
        auto: true,//可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function(){
            data.pagenum++;
          renderMainData(function (result) {
            if(result.data.goods.length>0){
              var html = template('goodlistTemp', result.data)
              $('.goodslist').append(html)
              // 下拉刷新结束
              mui('#refreshContainer').pullRefresh().endPullupToRefresh();

            }else{
              // true 表示没有数据
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(true );

            }
            
          })

        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }

    }
  });

 

  //将参数字符串，转换成对象的形式
  function getParameter(url){
      var obj = {};
      url = url.substring(1); //获取地址栏问号，后面的内容
      //  &符号 拆分
    var arr = url.split('&') // ['cid=5', 'name=jack']
    //进行第二次拆分
    for (var i = 0; i < arr.length; i++) {
      var temp = arr[i].split('=')  //['cid',5] ['name','jack']
      obj[temp[0]] = temp[1] //obj[cid] = 5
    }
    return obj;
  }
  // 点击搜索按钮，实现将数据添加至页面
  $('.query_btn').on('tap',function(){
    var  obj={}
    obj.query = $('.query_txt').val();
    console.log(obj.query);
    renderMainData(function(result){
      console.log(result);
      var searchhtml = template('searchTemp',result.data);
      $('.searchList').html(searchhtml)

    },obj)

  })


  $('.mui-action-back').on('tap', function () {
    history.back()
  })

})