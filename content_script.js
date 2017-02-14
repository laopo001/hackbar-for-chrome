// chrome.runtime.sendMessage({type:"ContentSent", state:"open"},function(response) {
// 	 //$(".close_btn").click();
// 	  if(response.state=="open"){
// 		  setTimeout(function () {
// 			  $(".threadlist_rep_num").each(function(){
// 				  var cs=	$(this);
// 				  if(cs.text()=="商业推广"){
// 					  cs.parent().parent().parent().remove();
// 					  console.log(cs.text()+"删除成功")
// 				  }
// 			  })
// 			  $(".p_author_name").each(function(){
// 				  if($.trim(this.innerHTML)=="贴吧游戏"||$.trim(this.innerHTML)=="贴吧触点推广"){
// 					  $(this).parent().parent().parent().parent().remove();
// 					  console.log($.trim(this.innerHTML)+"删除成功");
// 				  }
// 			  })
// 		  },500)

// 	  }
//   console.log(response.state);
// });


