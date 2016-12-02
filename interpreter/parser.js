/* 分析器
操作数优先分析的过程如下：
把每个带有左约束力（binding power）的操作token与操作函数结合。
如果操作符操作其左侧的token（例如+），就把它和左侧的指称函数结合（下面简写为led）。如果操作符没有操作左侧的token（比如一元运算符-），就把它和一个空的指称函数结合（下面简写为nud）。标识符和数字也有与其结合的nud函数。
测试：calculate('1 + 4 / 2')
[
	left: {type: 'number', value: 1},
	right: {
		left: {type: 'number', value: 4},
		right: {type: 'number', value: 2},
		type: '/'
	},
	tyoe: '+'
]

*/
var parse = function (tokens) {
	// 我们需要某种符号（symbol）表来结合符号和约束力，nud或led，我们需要一个函数来结合相应符号下的token。
	var symbols = {},
	symbol = function (id, nud, lbp, led) {
		var sym = symbols[id] || {};
		/* 生成符号表
		* id: , - + / * ......
		* lbp 优先级
		* nud 没有操作左侧的token就把它和一个空的指称函数结合的动作
		* led 操作其左侧的token和左侧的指称函数结合的动作
		*/
		symbols[id] = {
			lbp: sym.lbp || lbp,
			nud: sym.nud || nud,
			led: sym.lef || led
		};
	};

	var interpretToken = function (token) {
		var sym = Object.create(symbols[token.type]);
		sym.type = token.type;
		sym.value = token.value;
		return sym;
	};

	//我们需要一种方式来看到当前token以及继续下一个token。token()函数返回如token并且继承符号表的对象。
	var i = 0, token = function () { return interpretToken(tokens[i]); };
	var advance = function () { i++; return token(); };

	//生成表达式分析树。
	var expression = function (rbp) {
		var left, t = token();
		advance();
		if (!t.nud) throw 'Unexpected token: ' + t.type;
		left = t.nud(t);
		while (rbp < token().lbp) {
			t = token();
			advance();
			if (!t.led) throw 'Unexpected token: ' + t.type;
			left = t.led(left);
		}
		return left;
	};

	//创建用于定义操作符的infix和prefix函数
	var infix = function (id, lbp, rbp, led) {
		rbp = rbp || lbp;
		symbol(id, null, lbp, led || function (left) {
			return {
				type: id,
				left: left,
				right: expression(rbp)
			};
		});
	},
	prefix = function (id, rbp) {
		symbol(id, function () {
			return {
				type: id,
				right: expression(rbp)
			};
		});
	};

	//有一些只是为分隔和划界而存在的操作符，他们用不着prefix和infix函数，因此，把它们添加到符号表就已足够了。
	symbol(',');
	symbol(')');
	symbol('(end)');

	//数字的nud仅仅返回本身：
	symbol('number', function (number) {
		return number;
	});
	symbol('identifier', function (name) {
		if (token().type === '(') {
			var args = [];
			if (tokens[i + 1].type === ')') {
				advance();
			} else {
				do {
					advance();
					args.push(expression(2));
				} while (token().type === ',');
				if (token().type !== ')') throw 'Expected closing parenthesis )';
			}
			advance();
			return {
				type: 'call',
				args: args,
				name: name.value
			};
		}
		return name;
	});

	//圆括号的nud仅仅返回它里面什么
	symbol('(', function () {
		value = expression(2);
		if (token().type !== ')') throw 'Expected closing parenthesis )';
		advance();
		return value;
	});

	//现在我们以声明的形式定义所有的算术操作符。注意，幂操作符 (^)具有比左约束力小的右约束力。这是因为 幂是右结合的 。
	prefix('-', 7);
	infix('^', 6, 5);
	infix('*', 4);
	infix('/', 4);
	infix('%', 4);
	infix('+', 3);
	infix('-', 3);

	infix('=', 1, 2, function (left) {
		if (left.type === 'call') {
			for (var i = 0; i < left.args.length; i++) {
				if (left.args[i].type !== 'identifier') throw 'Invalid argument name';
			}
			return {
				type: 'function',
				name: left.name,
				args: left.args,
				value: expression(2)
			};
		} else if (left.type === 'identifier') {
			return {
				type: 'assign',
				name: left.value,
				value: expression(2)
			};
		}
		else throw 'Invalid lvalue';
	});

	//分析器接收词法分析器产生的token，返回分析树.
	var parseTree = [];
	while (token().type !== '(end)') {
		parseTree.push(expression(0));
	}
	return parseTree;
};