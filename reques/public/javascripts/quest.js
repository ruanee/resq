window.onload=function() {
	if(!Strings.isEmpty($("#userinfo")[0].innerHTML)) 
		$("#newinfo")[0].style.display='none'; 
	else 
		$("#userinfo")[0].style.display='none';
	$(document).on("click","tr td", function(e){
		rowClick(e);
	});
	$('#searchdiv').find('input.form-control').bind("enterKey",function(e){
		if(e.target.parentNode.parentNode.parentNode.lastElementChild.lastElementChild.firstElementChild.click) {
			e.target.parentNode.parentNode.parentNode.lastElementChild.lastElementChild.firstElementChild.click();
		}
	});
	$('#searchdiv').find('input.form-control').keyup(function(e){
	    if(e.keyCode == 13) {
	        $(this).trigger("enterKey");
	    }
	});
}
var picpath ="files/pic/";
function rowClick(e) {
	if(e.target.parentNode && e.target.parentNode.firstElementChild && e.target.parentNode.firstElementChild.firstElementChild 
			&& e.target.parentNode.firstElementChild.firstElementChild.click) {
		e.target.parentNode.firstElementChild.firstElementChild.click();
	}
}
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
    }, {
        regexp: {
            IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
            VCODE: /^.{4}$/
        }
    });
}
function chapter() {
	var trs = $('tr');
	for (var i = 0; i < trs.length; i++) {
		var tr = trs[i];
		var button = $(tr).children("td:first").children("button")[0];
		if(tr.innerHTML) {
			tr.onclick=function(a,b){
				button.click();
			};
		}
	}
}

function saveQuestion() {
	var data = {}, choices = {}, answer = {};
	data.type = trimSpecial(document.getElementById('type').value);
	data.chapter = trimSpecial(document.getElementById('chapter').value);
	data['class'] = trimSpecial(document.getElementById('class').value);
	data.title = trimSpecial(document.getElementById('title').value);
	data['titlepic'] = trimSpecial(document.getElementById('titlepic').value);
	data.code = '10000';
//		document.getElementById('code').value;
	var inputs = $('#choHeader').find('input');
//		document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		var id = inputs[i].id;
		if(inputs[i].placeholder && id !='id' && inputs[i].id !='' && inputs[i].value !='') {
			choices[inputs[i].id] = trimSpecial(inputs[i].value);
		}
	}
	data.choices = choices;
	answer['ans'] = trimSpecial(document.getElementById('answer').value);
	answer['explain'] = trimSpecial(document.getElementById('explain').value);
	answer['anspic'] = trimSpecial(document.getElementById('anspic').value);
	data.answer = answer;
	data.id = document.getElementById('id').value;
	data.active='T';
	
	ajax("POST", "questions", data, function(obj) {
//		alert(JSON.parse(obj.response).message);
		closePopup();
		window.location.reload();
	});
	
	return data;
}
function populateData(id) {
	if(!id || id =='') return;
	row={}
	  var rows = JSON.parse(document.getElementById('items').value);
	  for (var i = 0; i < rows.length; i++) {
		if(rows[i]['id'] == id) {
			row = rows[i];
			document.getElementById('id').value = trimSpecial(row.id);
			document.getElementById('title').value=trimSpecial(row.title);
			document.getElementById('type').value=trimSpecial(row.type);
			document.getElementById('chapter').value=trimSpecial(row.chapter);
			document.getElementById('class').value=trimSpecial(row.class);
			document.getElementById('answer').value=trimSpecial(row.answer.ans);
			document.getElementById('explain').value=trimSpecial(row.answer.explain);
			document.getElementById('titlepic').value=trimSpecial(row.titlepic);
			document.getElementById('anspic').value=trimSpecial(row.answer.anspic);
			var choices = row.choices;
			
			var inputs = $('#choHeader').find('input');
//				document.getElementsByTagName("INPUT");
			for (var i = 0; i < inputs.length; i++) {
				var id = inputs[i].id;
				if(inputs[i].placeholder && inputs[i].type =='text') {
					inputs[i].value=trimSpecial(choices[inputs[i].id]);
				}
			}
			break;
		}
	  }
}
function trimSpecial(str) {
	if(str) {
		str = str.replaceAll("'", "\"");
	} else {
		str ="";
	}
	return str;
}
function deleteQuestion(obj) {
	if(confirm("Are you sure you want to delete it?")) {
    	var data = {};
    	data.id = obj.name;
    	
    	ajax("DELETE", "questions", data);
    	
    	window.location.reload()
	} else {
	    // Cancel button pressed...
	}
}
function deleteQuestions(obj) {
	if(confirm("Are you sure you want to delete all questions?")) {
		var data = buildSearch();
		
		ajax("DELETE", "questions/all", data, function(obj) {
    		var msg = obj.message;
    		if(!Strings.isEmpty(msg)) {
    			alert(msg);
    		}
    		window.location.reload()
    	});
	} else {
		// Cancel button pressed...
	}
}
function deletePaper(obj) {
	if(confirm("Are you sure you want to delete it?")) {
    	var data = {};
    	data.id = obj.name;
    	
    	ajax("DELETE", "paper", data, function(obj) {
    		var msg = obj.message;
    		if(!Strings.isEmpty(msg)) {
    			alert(msg);
    		}
    		window.location.reload()
    	});
	} else {
	    // Cancel button pressed...
	}
}
function deleteSession(obj) {
	if(confirm("Are you sure you want to tick the user?")) {
		var data = {};
		data.id = obj.name;
		
		ajax("GET", "/users/sessions/destroy", data, function() {
			window.location.reload()
		});
		
	} else {
	}
}
function search(obj) {
	var data = buildSearch();
//	postData("GET", "questions", data);
	var url = "";
	if(obj.id == "questionBtn") {
		url = "/questions?";
	} else if(obj.id == "paperBtn") {
		url = "/paper?";
	} else if(obj.id == "sessionsBtn") {
		url = "/users/sessions?";
	}
	if(!url) {
		return;
	}
	var url = url + Object.keys(data).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&');
	window.location.href=url;
}
function buildSearch() {
	var data = {};
	var inputs = $('#searchdiv').find('input');
	for (var i = 0; i < inputs.length; i++) {
		var id = inputs[i].id;
		if(inputs[i].value !='') {
			data[inputs[i].id] = trimSpecial(inputs[i].value);
		}
	}
	return data;
}
function ajax(action,url, data, callback) {
	if(action == "POST" || action == "DELETE") {
		data = { _dto: JSON.stringify(data) };
	} else {
		
	}
	$.ajax({
	  url: url,
	  type: action,
	  data: data,
	  dataType: "json",
	  success: function(res) {
		  callback.call(this, res);
	  },
	  error: function(e) {
		console.log(e.message);
	  }
	});
}
function paper(obj) {
	window.location.href='/paper/id?id='+obj.id;
}
function exam(obj) {
	window.location.href='/exam?id='+obj.id;
}
function reexam(obj) {
	var data = {};
    data.id = obj.id;
    data.token=obj.name;
    data.page = obj.getAttribute('page');
    data.direction='prev';
	window.location.href=buildUrl('/exam',data);
}
function buildUrl(url, data) {
	url = url +"?" + Object.keys(data).map(function(k) {
	    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&');
	return url;
}
function user(obj) {
	window.location.href='/users/show?id='+obj.id;
}
function showPic(obj) {
	var url = "";
	if(obj.id == 'viewTitle') {
		url = document.getElementById('titlepic').value;
	} else {
		url = document.getElementById('anspic').value;
	}
	if(url) {
		window.open(picpath + url);
	} else {
		alert("没有图片");
	}
}
function upload(obj) {
	var data = {}, choices = {}, answer = {};
	
	var formData = new FormData();
	var file = null;
	if(obj.id == "titleBtn") {
		file = $('#titleFile')[0].files[0]
	} else if(obj.id == "ansBtn") {
		file = $('#ansFile')[0].files[0];
	}
	if(!file) return;
	formData.append('png', file);
	formData.append('idx', document.getElementById('id').value);
	$.ajax({
	    url: '/upload2',
	    type: 'POST',
	    cache: false,
	    data: formData,
	    processData: false,
	    contentType: false
	}).done(function(res) {
		if(obj.id == "titleBtn") {
			document.getElementById('titlepic').value=trimSpecial(res.file);
		} else if(obj.id == "ansBtn") {
			document.getElementById('anspic').value=trimSpecial(res.file);
		}
	}).fail(function(res) {});

	return data;
}
function editQuestion() {
	  var buf = [];
	  // buf.push('<form id="popup" enctype="multipart/form-data">');
	  buf.push('<input id="id" type=hidden>');
	  buf.push('<input id="titlepic" type=hidden>');
	  buf.push('<input id="anspic" type=hidden>');

	  buf.push('<div class="row">');
		  buf.push('<div class="col-lg-4">');
			  buf.push('<div class="form-group">');
		      buf.push('    <input  id="type" class="form-control" placeholder="科目" required>');
		      buf.push('</div>');
		  buf.push('</div>');

		  buf.push('<div class="col-lg-4">');
			  buf.push('<div class="form-group">');
			  buf.push('    <input  id="chapter" class="form-control" placeholder="章节" required>');
		      buf.push('</div>');
		  buf.push('</div>');
	  
		  buf.push('<div class="col-lg-4">');
			  buf.push('<div class="form-group">');
			  buf.push('    <input  id="class" class="form-control" placeholder="类型" required>');
		      buf.push('</div>');
		  buf.push('</div>');
      buf.push('</div>');
      
      buf.push('<div class="form-group">');
//      buf.push('	<label for="title">题目</label>');
      buf.push('	<textarea id="title" class="form-control" placeholder="请输入题目描述" rows="6"></textarea>');
      buf.push('</div>');

      buf.push('<div class="form-group">');
 	  buf.push('	<input  id="titleFile" type="file" name="titleFile" required>');
 	  buf.push('	<input  id="titleBtn" type="button" value="上传题目图片" onclick="upload(this)">');
 	  buf.push('		<button id="viewTitle" type="button" class="btn btn-info" onclick="showPic(this)">View</button>');
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
      buf.push(createChoice({code:'E'}));
      
      buf.push('</div>');
      
//      buf.push(createChoice({code:'答案', placeholder:'请输入答案'}));
      
      buf.push('<div class="form-group">');
      buf.push('    <span class="input-group-addon" id="basic-addon1">答案</span>');
      buf.push('	<textarea id="answer" class="form-control" placeholder="请输入答案" rows="2"></textarea>');
      buf.push('</div>');
    
      buf.push('<div class="form-group">');
 	  buf.push('	<input  id="ansFile" type="file" name="ansFile" required>');
 	  buf.push('	<input  id="ansBtn" type="button" value="上传答案图片" onclick="upload(this)">');
 	  buf.push('	<button id="viewAns" type="button" class="btn btn-info" onclick="showPic(this)">View</button>');
 	  buf.push('</div>');
 	  
      buf.push('<div class="form-group">');
//      buf.push('	<label for="explain">解释</label>');
      buf.push('	<textarea id="explain" class="form-control" placeholder="请输入解释" rows="3" style="display:none;"></textarea>');
      buf.push('</div>');
      
      buf.push('<div class="form-group">');
      buf.push('    <button type="button" class="btn btn-danger" onclick="deleteQuestion()">删除</button>');
      buf.push('    <button type="button" class="btn btn-secondary" onclick="closePopup()">取消</button>');
      buf.push('    <button type="button" class="btn btn-primary" onclick="saveQuestion()">确定</button>');
      buf.push('</div>');

	  // buf.push('</form>');
      
      var div = document.createElement("div");
      div.setAttribute("id", "quesDiv");
      div.innerHTML = buf.join("");
      
      return div;
}

function closePopup() {
	var bgObj = document.getElementById("bgDiv");
	var msgObj = document.getElementById("msgDiv");
	bgObj && $(bgObj).remove();
	msgObj && $(msgObj).remove();
}
function addChoice(args) {
	
	var args={};
	
    var div = document.createElement("div");
    div.innerHTML = createChoice(args);

    document.getElementById('choHeader').appendChild(div)
    
    return div;
}
function refresh() { $("#code")[0].src="/captcha?"+Math.random(10);};
function saveUser() {
	var inputs = $('#main').find('input');
	for (var i = 0; i < inputs.length; i++) {
		if(Strings.isEmpty(inputs[i].value)) {
			inputs[i].setCustomValidity('请输入这个字段.');
			return false;
		} else {
			inputs[i].setCustomValidity('');
		}
	}
	var p1 = document.getElementById('inputPassword'), p2=document.getElementById('inputPassword2');
    if (p1.value != p2.value) { 
    	p2.setCustomValidity('密码不匹配.');
    	return false;
    } else {
    	p2.setCustomValidity('');
    }
    var form = $('#signForm')[0];
    form.method="post";
    form.action="/users/new";
    form.submit();
}
function pass() {
	var inputs = $('#pass').find('input');
	for (var i = 0; i < inputs.length; i++) {
		if(Strings.isEmpty(inputs[i].value)) {
			inputs[i].setCustomValidity('请输入这个字段.');
			return false;
		} else {
			inputs[i].setCustomValidity('');
		}
	}
	var p1 = document.getElementById('password'), p2=document.getElementById('password2');
	if (p2 && p1.value != p2.value) { 
		p2.setCustomValidity('密码不匹配.');
		return false;
	} else {
		p2 && p2.setCustomValidity('');
	}
	var data={};
	data.username=document.getElementById('username').value;
	data.password=p1.value;
	data.password2=p2 && p2.value;
	data.cpassword=document.getElementById('cpassword') && document.getElementById('cpassword').value;
	
	ajax("POST", "/users/pass", data, function(obj) {
		var msg = obj.message;
		if(!Strings.isEmpty(msg)) {
			alert(msg);
		} else {
			$("#exampleModal").modal('hide');
		}
	});
}
function updateUser() {
	var inputs = $('#main').find('input');
	$('#roles')[0].value = "zz";
	var roles = "";
	for (var i = 0; i < inputs.length; i++) {
		if(Strings.isEmpty(inputs[i].value)) {
			inputs[i].setCustomValidity('请输入这个字段.');
			return false;
		} else {
			inputs[i].setCustomValidity('');
		}
		if(inputs[i].type =='checkbox' && inputs[i].checked) {
			roles = roles + ";" + inputs[i].value;
		}
	}
	$('#roles')[0].value = roles;
    var form = $('#user')[0];
    form.method="post";
    form.action="/users/update";
    form.submit();
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
	if(document.createElement("div")) {
		closePopup();
	}
	   var msgw,msgh,bordercolor;
	   msgw=460;//Width
	   msgh=700;//Height 
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
	   bgObj.style.left="0"; 
	   bgObj.style.background="#777"; 
	   bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75"; 
	   bgObj.style.opacity="0.6"; 
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
	   msgObj.style.left = "2%"; 
	   msgObj.style.top = "2%"; 
	   msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif"; 
	   msgObj.style.width = msgw + "px"; 
	   msgObj.style.height =msgh + "px"; 
	   msgObj.style.textAlign = "center"; 
	   msgObj.style.lineHeight ="25px"; 
	   msgObj.style.zIndex = "10001"; 
	   document.body.appendChild(msgObj); 
	   var txt=editQuestion();
	   document.getElementById("msgDiv").appendChild(txt);
	   
	   populateData(obj.id)
	   
	   	var bgObj = $('#bgDiv')[0],msgObj = $('#msgDiv')[0];
	    bgObj.style.top=($(document).scrollTop() + 5) + 'px';
	    msgObj.style.top=($(document).scrollTop() + 10) + 'px';
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
var Strings = {};
Strings.isEmpty = function (iStr) {
    if (typeof (iStr) == "undefined"
    		|| iStr == null 
    		|| iStr.toString().length == 0
    		|| iStr.toString().trim() == "")return true;
	return false;
};