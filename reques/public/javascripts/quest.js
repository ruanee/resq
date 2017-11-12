function submit() {
    weui.form.validate('#form', function (error) {
        if (!error) {
            var loading = weui.loading('提交中...');
            setTimeout(function () {
                loading.hide();
                weui.toast('提交成功', 1000);
            }, 500);
        }
        // return true; // 当return true时，不会显示错误
    }, {
        regexp: {
            IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
            VCODE: /^.{4}$/
        }
    });
}
function saveQuestion() {
	var data = {}, choices = {}, answer = {};
	data.type ='期末考题';
	data.title = document.getElementById('title').value;
	data.code = document.getElementById('code').value;
	var inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].placeholder) {
			choices[inputs[i].id] = inputs[i].value;
		}
	}
	data.choices = choices;
	answer['ans'] = document.getElementById('答案').value;
	answer['explain'] = document.getElementById('explain').value;
	data.answer = answer;
	
	postData("questions", data);
	
	return data;
}

function postData(url, data, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    	  if(callback) {
    		  callback.call(this, xhttp);
    	  }
      }
    };
    data = JSON.stringify(data);
//    data = "{\"id\":\"123\",\"Order Number\":\"TEST00002\"}";
    xhttp.open("POST", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
}
function editQuestion(args) {
	  var buf = [];

      buf.push('<div class="weui-cells__title">题目</div>');
      buf.push('<div class="weui-cells weui-cells_form">');
      buf.push('    <div class="weui-cell">');
      buf.push('        <div class="weui-cell__bd">');
      buf.push('            <textarea id="title" class="weui-textarea" placeholder="请输入题目描述" rows="3"></textarea>');
      buf.push('            <div class="weui-textarea-counter"><span>0</span>/200</div>');
      buf.push('        </div>');
      buf.push('	</div>');
      buf.push('</div>');

//      buf.push('<div class="weui-cells__title">代码</div>');
      buf.push('<div class="weui-cells weui-cells_form">');
      buf.push('    <div class="weui-cell">');
      buf.push('        <div class="weui-cell__bd">');
      buf.push('            <textarea id="code" class="weui-textarea" placeholder="请输入代码" rows="3"></textarea>');
      buf.push('            <div class="weui-textarea-counter"><span></span>非必填</div>');
      buf.push('        </div>');
      buf.push('	</div>');
      buf.push('</div>');
      
//      buf.push('<div class="weui-cells__title">请选项</div>');
      buf.push('<div id="choHeader" class="weui-cells">');
      
      buf.push(createChoice({code:'A'}));
      buf.push(createChoice({code:'B'}));
      buf.push(createChoice({code:'C'}));
      buf.push(createChoice({code:'D'}));
      
      buf.push('</div>');
      
      buf.push(createChoice({code:'答案', placeholder:'请输入答案'}));
      
      buf.push('<div class="weui-cells weui-cells_form">');
      buf.push('    <div class="weui-cell">');
      buf.push('        <div class="weui-cell__bd">');
      buf.push('            <textarea id="explain" class="weui-textarea" placeholder="请输入解释" rows="3"></textarea>');
      buf.push('        </div>');
      buf.push('	</div>');
      buf.push('</div>');
      
      buf.push('<div class="weui-btn-area">');
      buf.push('    <a class="weui-btn weui-btn_primary" href="javascript:saveQuestion()" id="showTooltips">确定</a>');
      buf.push('    <a class="weui-btn weui-btn_warn" href="javascript:closePopup()" id="showTooltips">删除</a>');
      buf.push('</div>');
      
      var div = document.createElement("div");
      div.innerHTML = buf.join("");
      
      return div;
}
function closePopup() {
	var bgObj = document.getElementById("bgDiv");
	var msgObj = document.getElementById("msgDiv");
    document.body.removeChild(msgObj);
    document.body.removeChild(bgObj); 
}
function addChoice(args) {
	
	var args={};
	
    var div = document.createElement("div");
    div.innerHTML = createChoice(args);

    document.getElementById('choHeader').appendChild(div)
    
    return div;
}

function createChoice(args) {
	  var buf = [];
	  var placeholder = "请输入选项";
	  if(args.placeholder) {
		  placeholder = args.placeholder;
	  }
      buf.push('<div class="weui-cells weui-cells_form">');
      buf.push('    <div class="weui-cell">');
      buf.push('        <div class="weui-cell__hd"><label class="weui-label">'+args.code+'</label></div>');
      buf.push('        <div class="weui-cell__bd">');
      buf.push('            <input  id='+args.code+' class="weui-input" placeholder="'+placeholder+'" notMatchTips="不能为空">');
      buf.push('        </div>');
      buf.push('    </div>');
      buf.push('</div>');
      
      return buf.join("");
}

function popup(str){ 
	   var msgw,msgh,bordercolor; 
	   msgw=400;//Width
	   msgh=920;//Height 
	   titleheight=25 //title Height
	   bordercolor="#336699";//boder color
	   titlecolor="#99CCFF";//title color
	   var sWidth,sHeight; 
	   sWidth=document.body.offsetWidth; 
	   sHeight=screen.height; 
	   var bgObj=document.createElement("div"); 
	   bgObj.setAttribute('id','bgDiv'); 
	   bgObj.style.position="absolute"; 
	   bgObj.style.top="0"; 
	   bgObj.style.background="#777"; 
	   bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75"; 
	   bgObj.style.opacity="0.6"; 
	   bgObj.style.left="0"; 
	   bgObj.style.width=sWidth + "px"; 
	   bgObj.style.height=sHeight + "px"; 
	   bgObj.style.zIndex = "10000"; 
	   document.body.appendChild(bgObj); 
	   var msgObj=document.createElement("div") 
	   msgObj.setAttribute("id","msgDiv"); 
	   msgObj.setAttribute("align","center"); 
	   msgObj.style.background="white"; 
	   msgObj.style.border="1px solid " + bordercolor; 
	   msgObj.style.position = "absolute"; 
	   msgObj.style.left = "55%"; 
	   msgObj.style.top = "10%"; 
	   msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif"; 
	   msgObj.style.marginLeft = "-225px" ; 
	   msgObj.style.marginTop = -75+document.documentElement.scrollTop+"px"; 
	   msgObj.style.width = msgw + "px"; 
	   msgObj.style.height =msgh + "px"; 
	   msgObj.style.textAlign = "center"; 
	   msgObj.style.lineHeight ="25px"; 
	   msgObj.style.zIndex = "10001"; 
	   var title=document.createElement("h4"); 
	   title.setAttribute("id","msgTitle"); 
	   title.setAttribute("align","right"); 
	   title.style.margin="0"; 
	   title.style.padding="3px"; 
	   title.style.background=bordercolor; 
	   title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);"; 
	   title.style.opacity="0.75"; 
	   title.style.border="1px solid " + bordercolor; 
	   title.style.height="18px"; 
	   title.style.font="12px Verdana, Geneva, Arial, Helvetica, sans-serif"; 
	   title.style.color="white"; 
	   title.style.cursor="pointer"; 
	   title.innerHTML="Close"; 
	   title.onclick=function(){ 
	          document.body.removeChild(bgObj); 
	          document.getElementById("msgDiv").removeChild(title); 
	          document.body.removeChild(msgObj); 
	        } 
	   document.body.appendChild(msgObj); 
//	   document.getElementById("msgDiv").appendChild(title); 
	   var txt=editQuestion();
//		   document.createElement("p"); 
//	   txt.style.margin="1em 0" 
//	   txt.setAttribute("id","msgTxt"); 
//	   txt.innerHTML=str; 
	   document.getElementById("msgDiv").appendChild(txt); 
	} 
