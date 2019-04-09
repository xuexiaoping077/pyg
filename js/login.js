$(function(){
  // 点击确认按钮
  $('.mui-btn-primary').on('tap',function(){
     
    // 判断登陆是否则正确
    // 获取用户登陆信息
    var obj={
      username:'',
      password:''
    }
    obj.username = $('.username').val()
    obj.password = $('.password').val()
    // 2.对用户数据进行验证
    if (!/^1[3-9]\d{9}$/.test(obj.username)) {
      // 提示框
      mui.toast('手机号码输入不正确')
      return false;
    }
    if (obj.password.length < 6) {
      mui.toast('密码长度小于6位')
      return false;
    }
  // 3.发送ajax请求
  $.ajax({
    type:"post",
    url:'/login', 
    data:obj,
    dataType:"json",
    success:function(result){
      // console.log(result); //有了token的值
      // 登陆成功
      if (result.meta.status == 200){
          // 1.将token存储到本地
          sessionStorage.setItem('pyg_token',result.data.token)
        // 页面跳转
        console.log(location.search); 
        // qu ？号后面的值
       var re =  sessionStorage.getItem('redirectUrl')
       if(re){
         // 当登陆成功了，re可以获取到。返回原来页面的地址
         location.href = re;

       }else{
         location.href = '/index.html'
       }  
        }else
        {
          mui.toast(result.meta.msg)  // 提示登陆信息
        }
    }


  })



  })
  
})