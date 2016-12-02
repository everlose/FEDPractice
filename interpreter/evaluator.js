/* 求值器 */
var evaluate = function (parseTree) {

	//定义了操作数和所有预定义变量和函数的行为
	var operators = {
		'+': function (a, b) { return a + b; },
		'-': function (a, b) {
			if (typeof b === 'undefined') return -a;
			return a - b;
		},
		'*': function (a, b) { return a * b; },
		'/': function (a, b) { return a / b; },
		'%': function (a, b) { return a % b; },
		'^': function (a, b) { return Math.pow(a, b); }
	};

	var variables = {
		pi: Math.PI,
		e: Math.E
	};

	var functions = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.cos,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		abs: Math.abs,
		round: Math.round,
		ceil: Math.ceil,
		floor: Math.floor,
		log: Math.log,
		exp: Math.exp,
		sqrt: Math.sqrt,
		max: Math.max,
		min: Math.min,
		random: Math.random
	};
	var args = {
	};

	var parseNode = function (node) {
		if (node.type === 'number') {
			//如果是数字类型，返回自身即可。
			return node.value;
		} else if (operators[node.type]) {
			//如果是操作符的话，递归调用自身求职。
			if (node.left) {
				return operators[node.type](parseNode(node.left), parseNode(node.right));
			}
			return operators[node.type](parseNode(node.right));
		} else if (node.type === 'identifier') {
			//如果是变量本身，判断是否是数组的参数。
			var value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
			if (typeof value === 'undefined') throw node.value + ' is undefined';
			return value;
		} else if (node.type === 'assign') {
			//如果变量赋值操作，则把值推到variables里。
			variables[node.name] = parseNode(node.value);
		} else if (node.type === 'call') {
			//是call则调用函数
			for (var i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
			return functions[node.name].apply(null, node.args);
		} else if (node.type === 'function') {
			//是函数则推到函数的数组里
			functions[node.name] = function () {
				for (var i = 0; i < node.args.length; i++) {
					args[node.args[i].value] = arguments[i];
				}
				var ret = parseNode(node.value);
				args = {};
				return ret;
			};
		}
	};

	var output = '';
	for (var i = 0; i < parseTree.length; i++) {
		var value = parseNode(parseTree[i]);
		if (typeof value !== 'undefined') output += value + '\n';
	}
	return output;
};