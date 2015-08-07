
/**
 *  $:START
 *  
 *  mini $
 * 	@param {string} selector 选择器
 * 	@return {Array.<HTMLElement>} 返回匹配的元素列表
 */
function $ (selector) {
	var idReg = /^#([\w_\-]+)/;
	var classReg = /^\.([\w_\-]+)/;
	var tagReg = /^\w+$/i;
  // [data-log]
  // [data-log="test"]
  // [data-log=test]
  // [data-log='test']
	var attrReg =/(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

  // 不考虑'>' 、`~`等嵌套关系
  // 父子选择器之间用空格相隔
  var context = document;

  function blank () {}


  /**
   * direct <-- find <-- $:START
   * 
   * @param  {[type]} part    [description]
   * @param  {[type]} actions [description]
   * @return {[type]}         [description]
   */
  function direct (part, actions) {
  	actions = actions || {
  		id: blank,
  		className: blank,
  		tag: blank,
  		attribute: blank
  	};
  	var fn;
  	var params = [].slice.call(arguments, 2);
  	//id
  	if (result = part.match(idReg)) {
  		fn = 'id';
  		console.log('-----------');
  		console.log(result);
  		params.push(result[1]);
  	}
  	//class
  	else if (result = part.match(classReg)) {
  		console.log('-----------');
  		console.log(result);
  		fn = 'className';
  		params.push(result[1]);
  	}
  	//tag
  	else if (result = part.match(tagReg)) {
  		fn = 'tag';
  		params.push(result[0]);
  	}
  	//attribute
  	else if (result = part.match(attrReg)) {
  		fn = 'attribute';
  		var tag = result[1];
  		var key = result[2];
  		var value = result[4];
  		params.push(tag, key, value);
  	}
  	console.log('--------------');
  	console.log('FN_direct_actions:', actions);

  	return actions[fn].apply(null, params);
  }


  /**
   * find <-- $:START
   * --> direct 
   * 						--> filterParents
   * @param  {[type]} parts   [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  function find (parts, context) {
  	var part = parts.pop();


  	//定义一个对象actions根据id\class等分类来取dom节点
  	var actions = {
  		id: function (id) {
  			return [
  				document.getElementById(id)
  			];
  		},
  		className: function (className) {
  			var result = [];
  			if (context.getElementsByClassName) {
  				result = context.getElementsByClassName(className);
  			}
  			else {
  				var temp = context.getElementsByTagName('*');
  				for (var i = 0, len = temp.length; i < len; i++) {
  					var node = temp[i];
  					if (hasClass(node, className)) {
  						result.push(node);
  					}
  				}
  			}
  			return result;
  		},
  		tag: function (tag) {
  			return context.getElementsByTagName(tag);
  		},
  		attribute: function (tag, key, value) {
  			var result = [];
  			var temp = context.getElementsByTagName(tag || '*');

  			for (var i = 0, len = temp.length; i < len; i++) {
  				var node = temp[i];
  				if (value) {
  					var v = node.getAttribute(key);
  					(v === value) && result.push(node);
  				}
  				else if (node.hasAttribute(key)) {
  					result.push(node);
  				}
  			}
  			return result;
  		}
  	};


	  ////////////////////////////////////////////////////
  	var ret = direct(part, actions);

  	//to array
  	ret = [].slice.call(ret);

  	return parts[0] && ret[0] ? filterParents(parts, ret) : ret;
  	//////////////////////////////////////////
  }


  /**
   *	filterParents <-- find <-- $:START
   * 
   * @param  {[type]} parts [description]
   * @param  {[type]} ret   [description]
   * @return {[type]}       [description]
   */
  function filterParents (parts, ret) {
  	var parentPart = parts.pop();
  	var result = [];

  	for (var i = 0, len = ret.length; i < len; i++) {
  		var node = ret[i];
  		var p = node;

  		while (p = p.parentNode) {
  			var actions = {
  				id: function (el, id) {
  					return (el.id === id);
  				},
  				className: function (el, className) {
  					return hasClass(el, className);
  				},
  				tag: function (el, tag) {
  					return (el.tagName.toLowerCase() === tag);
  				},
  				attribute: function (el, tag, key, value) {
  					var valid = true;
  					if (tag) {
  						valid = actions.tag(el, tag);
  					}
  					valid = valid && el.hasAttribute(key);
  					if (value) {
  						valid = valid && (value === el.getAttribute(key));
  					}
  					return valid;
  				}
  			};
  			var matches = direct(parentPart, actions, p);

  			if (matches) {
  				break;
  			}
  		}

  		if (matches) {
  			result.push(node);
  		}
  	}

  	return parts[0] && result[0] ? filterParents(parts, result) : result;
  }




  ////////////////////////////////////////////////////
  var result = find(selector.split(/\s+/), context);

  return result;
  ////////////////////////////////////////////////////
}	

//1. 实践判断各种数据类型的方法
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
		//isArray 使用’instanceof’或者'Array.constructor'判断，在跨iframe的情况下，有不同Array定义。考虑使用Object.prototype.toString方式判断更准确。
		//Array是window的对象
    // return (arr instanceof Array) ? true : false;
    return Object.prototype.toString.call(arr) == '[object Array]';
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
	// return (fn instanceof Function) ? true : false;
	return Object.prototype.toString.call(fn) == '[object Function]';
}

//2. 了解值类型和引用类型的区别，了解各种对象的读取、遍历方式
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {

}
//测试用例1:id
// (function(){
// 	console.log($('#result'));
// })();
//测试用例2: class
(function(){
	console.log($('.result'));
})();
// 测试用例：
// var srcObj = {
//     a: 1,
//     b: {
//         b1: ["hello", "hi"],
//         b2: "JavaScript"
//     }
// };
// var abObj = srcObj;
// var tarObj = cloneObject(srcObj);

// srcObj.a = 2;
// srcObj.b.b1[0] = "Hello";

// console.log(abObj.a);
// console.log(abObj.b.b1[0]);

// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"