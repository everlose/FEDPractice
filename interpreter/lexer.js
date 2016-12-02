/* 词法分析
* input 作为输入符
测试：lex('1+3') 输出 
[{type:"number",value:1},
{type:"+",value:undefined},
{type:"number",value:3},
{type:"(end)",value:undefined}]
*/
var lex = function (input) {
	//输入类型识别函数
	var isOperator = function (c) { return /[+\-*\/\^%=(),]/.test(c); },
		isDigit = function (c) { return /[0-9]/.test(c); },
		isWhiteSpace = function (c) { return /\s/.test(c); },
		isIdentifier = function (c) { return typeof c === 'string' && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c); };

	//被词法分析器分割成的各个独立部分，称作token。
	//简单的循环来扫描输入文本。用变量c表示当前的字符，建立名叫advance的函数来遍历、一次处理一个字符、并返回下一个字符
	//addToken函数把一个token附加到token列表。
	var tokens = [], c, i = 0, j = input.length;
	var advance = function () { return c = input[++i]; };
	var addToken = function (type, value) {
		tokens.push({
			type: type,
			value: value
		});
	};
	while (i < j) {
		c = input[i];
		if (isWhiteSpace(c)) {
			//如果c是空白符，我们只需忽略并读取后面的输入
			advance();
		} else if (isOperator(c)) {
			//如果c是操作符，就把操作数token添加到列表，并继续后面操作。
			addToken(c);
			advance();
		} else if (isDigit(c)) {
			//如果是数字，获取完整的一串数字后，还考虑有小数点的情况，再添加进token列表。
			var num = c;
			while (isDigit(advance())) {
				num += c;
			} 
			if (c === '.') {
				do num += c; while (isDigit(advance()));
			}
			num = parseFloat(num);
			if (!isFinite(num)) throw 'Number is too large or too small for a 64-bit double.';
			addToken('number', num);
		} else if (isIdentifier(c)) {
			//如果是标志符的话，获取完整的一串再添加到token列表
			var idn = c;
			while (isIdentifier(advance())) {
				idn += c;
			}
			addToken('identifier', idn);
		} else {
			//不是空白符，操作符，数字，定义变量的，抛出异常
			throw 'Unrecognized token.';
		}
	}
	//做完扫描输入之后，我们将增加一个区分结束的token，即'(end)'
	addToken('(end)');
	return tokens;
};