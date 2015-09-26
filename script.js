window.onload = function(){

	function bind(domNode, event, handler) {
		var handlerWrapper = function(event) {
			event = event || window.event;
			if (!event.target && event.srcElement) {
				event.target = event.srcElement;
			}
			return handler.call(domNode, event);
		};
		if (domNode.addEventListener) {
			domNode.addEventListener(event, handlerWrapper, false);
		} else if (domNode.attachEvent) {
			domNode.attachEvent('on' + event, handlerWrapper);
		}
		return handlerWrapper;
	}

	function addClass(node, className) {
		var classArr = [];
		var nodeClassName = node.className || '';
		if (node && Object.prototype.toString.call(className)==="[object String]"){
			classArr[0]=className; 
		} else if (node && Object.prototype.toString.call(className)==="[object Array]") {
			classArr = className.slice();
		} else {
			throw "Invalid arguments";
		};
		//adding classes
		for (var i = 0 ; i < classArr.length; i++) {
			if (nodeClassName.length===0) {
				nodeClassName = classArr[i];
			} else if (classArr[i] && nodeClassName.split(' ').indexOf(className) === -1 ){ 
				nodeClassName += ' ' + classArr[i]; 
			};
		};
		node.setAttribute('class',nodeClassName);
	}
	function removeClass(domNode, classToRemove) {
	    var currentClassValue = domNode.className;
	    if (currentClassValue.indexOf(" " + classToRemove) != -1) {
	        domNode.className = domNode.className.replace(" " + classToRemove, "");
	        return;
	    }  
	    if (currentClassValue.indexOf(classToRemove + " ") != -1) {
	        domNode.className = domNode.className.replace(classToRemove + " ", "");
	        return;
	    }
	    if (currentClassValue.indexOf(classToRemove) != -1) {
	        domNode.className = domNode.className.replace(classToRemove, "");
	        return;
	    }
	}
	var toggler = document.getElementById('toggler');
	var hide = false;
	bind (toggler, 'click', function(){
		var sidebar =  document.getElementById('side-bar');
		if (!hide){
			removeClass(sidebar,'show');
			addClass(sidebar,'hide');
			hide = true;
		} else {
			removeClass(sidebar,'hide');
			addClass(sidebar,'show');
			hide=false;
		}
	})
};