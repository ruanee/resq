function submit() {
	popup();
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
	data.title = trimSpecial(document.getElementById('title').value);
	data.code = '';
//		document.getElementById('code').value;
	var inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		var id = inputs[i].id;
		if(inputs[i].placeholder && id !='答案' && id !='id') {
			choices[inputs[i].id] = trimSpecial(inputs[i].value);
		}
	}
	data.choices = choices;
	answer['ans'] = trimSpecial(document.getElementById('答案').value);
	answer['explain'] = trimSpecial(document.getElementById('explain').value);
	data.answer = answer;
	data.id = document.getElementById('id').value;
	data.active='T';
	
	postData("POST", "questions", data, function(obj) {
		alert(JSON.parse(obj.response).message);
		closePopup();
		window.location.reload();
	});
	
	return data;
}
function populateData(id) {
	if(!id || id =='') return;
	var row={}
	  var rows = JSON.parse(document.getElementById('items').value);
	  for (var i = 0; i < rows.length; i++) {
		if(rows[i]['id'] == id) {
			row = rows[i];
			document.getElementById('id').value = row.id;
			document.getElementById('title').value=row.title;
			document.getElementById('答案').value=row.answer.ans;
			document.getElementById('explain').value=row.answer.explain;
			var choices = row.choices;
			var inputs = document.getElementsByTagName("INPUT");
			for (var i = 0; i < inputs.length; i++) {
				var id = inputs[i].id;
				if(inputs[i].placeholder && id !='答案' && id !='id') {
					inputs[i].value=choices[inputs[i].id];
				}
			}
			break;
		}
	  }
}
function trimSpecial(str) {
	if(str) {
		str = str.replaceAll("'", "\"");
	}
	return str;
}
function deleteQuestion() {
	var data = {};
	data.id = document.getElementById('id').value;
	
	postData("delete", "questions", data);
	
	closePopup();
	
	window.location.reload()
	
	return data;
}

function postData(action,url, data, callback) {
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
    xhttp.open(action, url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(data);
}
function paper(obj) {
	window.location.href='/paper/id';
}
function editQuestion() {
	  var buf = [];
	  buf.push('<input id="id" type=hidden>');
      buf.push('<div class="form-group">');
      buf.push('	<label for="title">题目</label>');
      buf.push('	<textarea id="title" class="form-control" placeholder="请输入题目描述" rows="8"></textarea>');
      buf.push('</div>');

//      buf.push('<div class="form-group">');
//      buf.push('	<label for="code">请输入代码</label>');
//      buf.push('	<textarea id="code" class="form-control" placeholder="请输入题目描述(非必填)" rows="3"></textarea>');
//      buf.push('</div>');
      
      
      buf.push('<div id="choHeader">');
      
      buf.push(createChoice({code:'A'}));
      buf.push(createChoice({code:'B'}));
      buf.push(createChoice({code:'C'}));
      buf.push(createChoice({code:'D'}));
      
      buf.push('</div>');
      
      buf.push(createChoice({code:'答案', placeholder:'请输入答案'}));
      
      buf.push('<div class="form-group">');
      buf.push('	<label for="explain">解释</label>');
      buf.push('	<textarea id="explain" class="form-control" placeholder="请输入解释" rows="3"></textarea>');
      buf.push('</div>');
      
      buf.push('<div class="form-group">');
      buf.push('    <button type="button" class="btn btn-danger" onclick="deleteQuestion()">删除</button>');
      buf.push('    <button type="button" class="btn btn-secondary" onclick="closePopup()">取消</button>');
      buf.push('    <button type="button" class="btn btn-primary" onclick="saveQuestion()">确定</button>');
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
      buf.push('<div class="input-group">');
      buf.push('    <span class="input-group-addon" id="basic-addon1">'+args.code+'</span>');
      buf.push('    <input  id='+args.code+' class="form-control" placeholder="'+placeholder+'" notMatchTips="不能为空">');
      buf.push('</div>');
      
      return buf.join("");
}

function popup(obj){ 
	   var msgw,msgh,bordercolor;
	   msgw=400;//Width
	   msgh=640;//Height 
//	   titleheight=25 //title Height
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
	   msgObj.style.top = "20%"; 
	   msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif"; 
	   msgObj.style.marginLeft = "-225px" ; 
	   msgObj.style.marginTop = -75+document.documentElement.scrollTop+"px"; 
	   msgObj.style.width = msgw + "px"; 
	   msgObj.style.height =msgh + "px"; 
	   msgObj.style.textAlign = "center"; 
	   msgObj.style.lineHeight ="25px"; 
	   msgObj.style.zIndex = "10001"; 
//	   var title=document.createElement("h4"); 
//	   title.setAttribute("id","msgTitle"); 
//	   title.setAttribute("align","right"); 
//	   title.style.margin="0"; 
//	   title.style.padding="3px"; 
//	   title.style.background=bordercolor; 
//	   title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);"; 
//	   title.style.opacity="0.75"; 
//	   title.style.border="1px solid " + bordercolor; 
//	   title.style.height="18px"; 
//	   title.style.font="12px Verdana, Geneva, Arial, Helvetica, sans-serif"; 
//	   title.style.color="white"; 
//	   title.style.cursor="pointer"; 
//	   title.innerHTML="Close"; 
//	   title.onclick=function(){ 
//	          document.body.removeChild(bgObj); 
//	          document.getElementById("msgDiv").removeChild(title); 
//	          document.body.removeChild(msgObj); 
//	        } 
	   document.body.appendChild(msgObj); 
//	   document.getElementById("msgDiv").appendChild(title); 
	   var txt=editQuestion();
//		   document.createElement("p"); 
//	   txt.style.margin="1em 0" 
//	   txt.setAttribute("id","msgTxt"); 
//	   txt.innerHTML=str; 
	   document.getElementById("msgDiv").appendChild(txt);
	   
	   populateData(obj.id)
	} 
function myEncodeURI(iStr) {
	var oStr = "";
	oStr = encodeURI(iStr);
	
	oStr = oStr.replace(/!/g, "%21");
	oStr = oStr.replace(/#/g, "%23");
	oStr = oStr.replace(/&/g, "%26");
	oStr = oStr.replace(/'/g, "%27");
	oStr = oStr.replace(/[(]/g, "%28");
	oStr = oStr.replace(/[)]/g, "%29");
	oStr = oStr.replace(/[+]/g, "%2B");
	oStr = oStr.replace(/[$]/g, "%24");
	oStr = oStr.replace(new RegExp("[/]","g"), "%2F");
	oStr = oStr.replace(/[:]/g, "%3A");
	oStr = oStr.replace(/[;]/g, "%3B");
	oStr = oStr.replace(/[=]/g, "%3D");
	oStr = oStr.replace(/[?]/g, "%3F");
	oStr = oStr.replace(/[@]/g, "%40");
	oStr = oStr.replace(/[~]/g, "%7E");
	oStr = oStr.replace(/[<]/g, "%3C");
	oStr = oStr.replace(/[>]/g, "%3E");
	
	oStr = oStr.replace(/,/g, "%2C");
	oStr = oStr.replace(/%20/g, "+");
	return oStr;
}
function myDecodeURI(iStr) {
	var oStr = "";
	//make no mistake, this is far from complete yet, we jsut try to make the
	//space and comma handled properly at the moment. Henry 05-09-30
	oStr = iStr.replace(/[+]/g,"%20");
	
	oStr = oStr.replace(/%23/g,"#");
	oStr = oStr.replace(/%24/g,"$");
	oStr = oStr.replace(/%26/g,"&");
	oStr = oStr.replace(/%2B/g,"+");
	oStr = oStr.replace(/%2F/g,"/");
	oStr = oStr.replace(/%3A/g,":");
	oStr = oStr.replace(/%3B/g,";");
	oStr = oStr.replace(/%3D/g,"=");
	oStr = oStr.replace(/%3F/g,"?");
	oStr = oStr.replace(/%40/g,"@");
	oStr = oStr.replace(/%7E/g,"~");
	
	oStr = oStr.replace(/%2C/g,",");
	oStr = oStr.replace(/&quot;/g,'"');
	oStr = oStr.replace(/\n/g,'\\n');
	oStr = oStr.replace(/,/g,'\,');
	oStr = decodeURI(oStr);
	return oStr;
}
String.prototype.replaceAll = function(s1,s2) {   
	return this.replace(new RegExp(s1,"gm"),s2);   
}; 