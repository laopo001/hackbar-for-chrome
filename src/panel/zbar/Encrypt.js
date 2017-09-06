/**
 * JavaScript encryption library version 0.1 (c) www.farfarfar.com. All rights reserved.
 *
 * Algorithms:
 * Message Digest Algorithm 5 - (http://userpages.umbc.edu/~mabzug1/cs/md5/md5.html)
 * Secure Hash Algorithm 1
 * Secure Hash Algorithm 256
 * Base64 encode - encode binary data to binary-safe text
 * Base64 decode
 *
 * This copyright notice must stay intact.
 *
 * Please provide a link back to www.farfarfar.com if possible.
 *
 * 
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author www.farfarfar.com
 * @version 0.1
 */


var BASE64_MAPPING = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
	'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
	'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
	'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
	'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
	'w', 'x', 'y', 'z', '0', '1', '2', '3',
	'4', '5', '6', '7', '8', '9', '+', '/'
];

/**
 *ascii convert to binary
 */
var _toBinary = function (ascii) {
	var binary = new Array();
	while (ascii > 0) {
		var b = ascii % 2;
		ascii = Math.floor(ascii / 2);
		binary.push(b);
	}
	/*
	var len = binary.length;
	if(6-len > 0){
		for(var i = 6-len ; i > 0 ; --i){
			binary.push(0);
		}
	}*/
	binary.reverse();
	return binary;
};

/**
 *binary convert to decimal
 */
var _toDecimal = function (binary) {
	var dec = 0;
	var p = 0;
	for (var i = binary.length - 1; i >= 0; --i) {
		var b = binary[i];
		if (b == 1) {
			dec += Math.pow(2, p);
		}
		++p;
	}
	return dec;
};

/**
 *unicode convert to utf-8
 */
var _toUTF8Binary = function (c, binaryArray) {
	var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
	var fatLen = binaryArray.length;
	var diff = mustLen - fatLen;
	while (--diff >= 0) {
		binaryArray.unshift(0);
	}
	var binary = [];
	var _c = c;
	while (--_c >= 0) {
		binary.push(1);
	}
	binary.push(0);
	var i = 0, len = 8 - (c + 1);
	for (; i < len; ++i) {
		binary.push(binaryArray[i]);
	}

	for (var j = 0; j < c - 1; ++j) {
		binary.push(1);
		binary.push(0);
		var sum = 6;
		while (--sum >= 0) {
			binary.push(binaryArray[i++]);
		}
	}
	return binary;
};

var __BASE64 = {
	/**
	 *BASE64 Encode
	 */
	encoder: function (str) {
		var base64_Index = [];
		var binaryArray = [];
		for (var i = 0, len = str.length; i < len; ++i) {
			var unicode = str.charCodeAt(i);
			var _tmpBinary = _toBinary(unicode);
			if (unicode < 0x80) {
				var _tmpdiff = 8 - _tmpBinary.length;
				while (--_tmpdiff >= 0) {
					_tmpBinary.unshift(0);
				}
				binaryArray = binaryArray.concat(_tmpBinary);
			} else if (unicode >= 0x80 && unicode <= 0x7FF) {
				binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
			} else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
				binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
			} else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
				binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
			} else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
				binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
			} else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
				binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
			}
		}

		var extra_Zero_Count = 0;
		for (var i = 0, len = binaryArray.length; i < len; i += 6) {
			var diff = (i + 6) - len;
			if (diff == 2) {
				extra_Zero_Count = 2;
			} else if (diff == 4) {
				extra_Zero_Count = 4;
			}
			//if(extra_Zero_Count > 0){
			//	len += extra_Zero_Count+1;
			//}
			var _tmpExtra_Zero_Count = extra_Zero_Count;
			while (--_tmpExtra_Zero_Count >= 0) {
				binaryArray.push(0);
			}
			base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
		}

		var base64 = '';
		for (var i = 0, len = base64_Index.length; i < len; ++i) {
			base64 += BASE64_MAPPING[base64_Index[i]];
		}

		for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
			base64 += '=';
		}
		return base64;
	},
	/**
	 *BASE64  Decode for UTF-8 
	 */
	decoder: function (_base64Str) {
		var _len = _base64Str.length;
		var extra_Zero_Count = 0;
		/**
		 *计算在进行BASE64编码的时候，补了几个0
		 */
		if (_base64Str.charAt(_len - 1) == '=') {
			//alert(_base64Str.charAt(_len-1));
			//alert(_base64Str.charAt(_len-2));
			if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
				extra_Zero_Count = 4;
				_base64Str = _base64Str.substring(0, _len - 2);
			} else {//一个等号说明补了2个0
				extra_Zero_Count = 2;
				_base64Str = _base64Str.substring(0, _len - 1);
			}
		}

		var binaryArray = [];
		for (var i = 0, len = _base64Str.length; i < len; ++i) {
			var c = _base64Str.charAt(i);
			for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
				if (c == BASE64_MAPPING[j]) {
					var _tmp = _toBinary(j);
					/*不足6位的补0*/
					var _tmpLen = _tmp.length;
					if (6 - _tmpLen > 0) {
						for (var k = 6 - _tmpLen; k > 0; --k) {
							_tmp.unshift(0);
						}
					}
					binaryArray = binaryArray.concat(_tmp);
					break;
				}
			}
		}

		if (extra_Zero_Count > 0) {
			binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
		}

		var unicode = [];
		var unicodeBinary = [];
		for (var i = 0, len = binaryArray.length; i < len;) {
			if (binaryArray[i] == 0) {
				unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
				i += 8;
			} else {
				var sum = 0;
				while (i < len) {
					if (binaryArray[i] == 1) {
						++sum;
					} else {
						break;
					}
					++i;
				}
				unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
				i += 8 - sum;
				while (sum > 1) {
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
					i += 8;
					--sum;
				}
				unicode = unicode.concat(_toDecimal(unicodeBinary));
				unicodeBinary = [];
			}
		}
		var result = "";
		for (var i = 0, len = unicode.length; i < len; ++i) {
			result += String.fromCharCode(unicode[i]);
		}
		return result;
	}
};

//	window.BASE64 = __BASE64;


//////////////////////////////////////////////////////////////////
export default {

	charBit: 8,

	md5: function (str) {
		return this.littleEndianArrayToHex(this.md5_binary(str));
	},
	md5_16: function (str) {
		return this.littleEndianArrayToHex(this.md5_binary(str)).substr(8, 16);
	},
	HEX_BROKEN: "Invalid hex encoded text",
	BASE64_BROKEN: "Possibly invalid Base64 encoded text",

	errors: new Array(),
	errorLen: 0,

	rot13: function (str) {
		return str.replace(/[a-zA-Z]/g, function (c) {
			return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
		});
	},

	Error: function (error) { },

	/**
	 * Calculate the MD5 hash.
	 *
	 * @param string the string to hash
	 * @return string the hashed string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	md5_binary: function (str) {
		var safeAdd = this.safeAdd; // Ugly scope six for local functions
		var rotateLeft = this.rotateLeft; // Ugly scope six local functions

		var x = Array();
		var s11 = 7, s12 = 12, s13 = 17, s14 = 22;
		var s21 = 5, s22 = 9, s23 = 14, s24 = 20;
		var s31 = 4, s32 = 11, s33 = 16, s34 = 23;
		var s41 = 6, s42 = 10, s43 = 15, s44 = 21;

		var a = 0x67452301;
		var b = 0xefcdab89;
		var c = 0x98badcfe;
		var d = 0x10325476;

		var x = this.strToLittleEndianArray(str);

		var strBit = str.length * this.charBit;

		x[strBit >> 5] |= 0x80 << (strBit & 0x1f);
		x[(((strBit + 64) >>> 9) << 4) + 14] = strBit;

		var len = x.length;

		for (var k = 0; k < len; k += 16) {
			var aa = a, bb = b, cc = c, dd = d;
			a = ff(a, b, c, d, x[k + 0], s11, 0xd76aa478);
			d = ff(d, a, b, c, x[k + 1], s12, 0xe8c7b756);
			c = ff(c, d, a, b, x[k + 2], s13, 0x242070db);
			b = ff(b, c, d, a, x[k + 3], s14, 0xc1bdceee);
			a = ff(a, b, c, d, x[k + 4], s11, 0xf57c0faf);
			d = ff(d, a, b, c, x[k + 5], s12, 0x4787c62a);
			c = ff(c, d, a, b, x[k + 6], s13, 0xa8304613);
			b = ff(b, c, d, a, x[k + 7], s14, 0xfd469501);
			a = ff(a, b, c, d, x[k + 8], s11, 0x698098d8);
			d = ff(d, a, b, c, x[k + 9], s12, 0x8b44f7af);
			c = ff(c, d, a, b, x[k + 10], s13, 0xffff5bb1);
			b = ff(b, c, d, a, x[k + 11], s14, 0x895cd7be);
			a = ff(a, b, c, d, x[k + 12], s11, 0x6b901122);
			d = ff(d, a, b, c, x[k + 13], s12, 0xfd987193);
			c = ff(c, d, a, b, x[k + 14], s13, 0xa679438e);
			b = ff(b, c, d, a, x[k + 15], s14, 0x49b40821);
			a = gg(a, b, c, d, x[k + 1], s21, 0xf61e2562);
			d = gg(d, a, b, c, x[k + 6], s22, 0xc040b340);
			c = gg(c, d, a, b, x[k + 11], s23, 0x265e5a51);
			b = gg(b, c, d, a, x[k + 0], s24, 0xe9b6c7aa);
			a = gg(a, b, c, d, x[k + 5], s21, 0xd62f105d);
			d = gg(d, a, b, c, x[k + 10], s22, 0x2441453);
			c = gg(c, d, a, b, x[k + 15], s23, 0xd8a1e681);
			b = gg(b, c, d, a, x[k + 4], s24, 0xe7d3fbc8);
			a = gg(a, b, c, d, x[k + 9], s21, 0x21e1cde6);
			d = gg(d, a, b, c, x[k + 14], s22, 0xc33707d6);
			c = gg(c, d, a, b, x[k + 3], s23, 0xf4d50d87);
			b = gg(b, c, d, a, x[k + 8], s24, 0x455a14ed);
			a = gg(a, b, c, d, x[k + 13], s21, 0xa9e3e905);
			d = gg(d, a, b, c, x[k + 2], s22, 0xfcefa3f8);
			c = gg(c, d, a, b, x[k + 7], s23, 0x676f02d9);
			b = gg(b, c, d, a, x[k + 12], s24, 0x8d2a4c8a);
			a = hh(a, b, c, d, x[k + 5], s31, 0xfffa3942);
			d = hh(d, a, b, c, x[k + 8], s32, 0x8771f681);
			c = hh(c, d, a, b, x[k + 11], s33, 0x6d9d6122);
			b = hh(b, c, d, a, x[k + 14], s34, 0xfde5380c);
			a = hh(a, b, c, d, x[k + 1], s31, 0xa4beea44);
			d = hh(d, a, b, c, x[k + 4], s32, 0x4bdecfa9);
			c = hh(c, d, a, b, x[k + 7], s33, 0xf6bb4b60);
			b = hh(b, c, d, a, x[k + 10], s34, 0xbebfbc70);
			a = hh(a, b, c, d, x[k + 13], s31, 0x289b7ec6);
			d = hh(d, a, b, c, x[k + 0], s32, 0xeaa127fa);
			c = hh(c, d, a, b, x[k + 3], s33, 0xd4ef3085);
			b = hh(b, c, d, a, x[k + 6], s34, 0x4881d05);
			a = hh(a, b, c, d, x[k + 9], s31, 0xd9d4d039);
			d = hh(d, a, b, c, x[k + 12], s32, 0xe6db99e5);
			c = hh(c, d, a, b, x[k + 15], s33, 0x1fa27cf8);
			b = hh(b, c, d, a, x[k + 2], s34, 0xc4ac5665);
			a = ii(a, b, c, d, x[k + 0], s41, 0xf4292244);
			d = ii(d, a, b, c, x[k + 7], s42, 0x432aff97);
			c = ii(c, d, a, b, x[k + 14], s43, 0xab9423a7);
			b = ii(b, c, d, a, x[k + 5], s44, 0xfc93a039);
			a = ii(a, b, c, d, x[k + 12], s41, 0x655b59c3);
			d = ii(d, a, b, c, x[k + 3], s42, 0x8f0ccc92);
			c = ii(c, d, a, b, x[k + 10], s43, 0xffeff47d);
			b = ii(b, c, d, a, x[k + 1], s44, 0x85845dd1);
			a = ii(a, b, c, d, x[k + 8], s41, 0x6fa87e4f);
			d = ii(d, a, b, c, x[k + 15], s42, 0xfe2ce6e0);
			c = ii(c, d, a, b, x[k + 6], s43, 0xa3014314);
			b = ii(b, c, d, a, x[k + 13], s44, 0x4e0811a1);
			a = ii(a, b, c, d, x[k + 4], s41, 0xf7537e82);
			d = ii(d, a, b, c, x[k + 11], s42, 0xbd3af235);
			c = ii(c, d, a, b, x[k + 2], s43, 0x2ad7d2bb);
			b = ii(b, c, d, a, x[k + 9], s44, 0xeb86d391);

			a = this.safeAdd(a, aa);
			b = this.safeAdd(b, bb);
			c = this.safeAdd(c, cc);
			d = this.safeAdd(d, dd);
		}
		return Array(a, b, c, d);

		function f(x, y, z) {
			return (x & y) | ((~x) & z);
		}

		function g(x, y, z) {
			return (x & z) | (y & (~z));
		}

		function h(x, y, z) {
			return (x ^ y ^ z);
		}

		function i(x, y, z) {
			return (y ^ (x | (~z)));
		}

		function ff(a, b, c, d, x, s, ac) {
			return safeAdd(rotateLeft(safeAdd(a, safeAdd(safeAdd(f(b, c, d), x), ac)), s), b);
		}

		function gg(a, b, c, d, x, s, ac) {
			return safeAdd(rotateLeft(safeAdd(a, safeAdd(safeAdd(g(b, c, d), x), ac)), s), b);
		}

		function hh(a, b, c, d, x, s, ac) {
			return safeAdd(rotateLeft(safeAdd(a, safeAdd(safeAdd(h(b, c, d), x), ac)), s), b);
		}

		function ii(a, b, c, d, x, s, ac) {
			return safeAdd(rotateLeft(safeAdd(a, safeAdd(safeAdd(i(b, c, d), x), ac)), s), b);
		}
		return false;
	},

	sha1: function (str) {
		return this.bigEndianArrayToHex(this.sha1_binary(str));
	},

	/**
	 * Calculate the SHA-1 hash.
	 *
	 * @param string the string to hash
	 * @return string the hashed string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	sha1_binary: function (str) {
		var w = Array(80);

		var a = 0x67452301;
		var b = 0xefcdab89;
		var c = 0x98badcfe;
		var d = 0x10325476;
		var e = 0xc3d2e1f0;

		var x = this.strToBigEndianArray(str);

		var strBit = str.length * this.charBit;

		x[strBit >> 5] |= 0x80 << (24 - (strBit & 0x1f));
		x[((strBit + 64 >> 9) << 4) + 15] = strBit;

		var len = x.length;

		for (var i = 0; i < len; i += 16) {
			var aa = a, bb = b, cc = c, dd = d, ee = e;

			var j = 0;

			for (; j < 16; j++) {
				w[j] = x[i + j];

				var t = this.safeAdd(this.safeAdd(this.rotateLeft(a, 5), (b & c) | ((~b) & d)),
					this.safeAdd(this.safeAdd(e, w[j]), 0x5A827999));
				e = d;
				d = c;
				c = this.rotateLeft(b, 30);
				b = a;
				a = t;
			}
			for (; j < 20; j++) {
				w[j] = this.rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

				var t = this.safeAdd(this.safeAdd(this.rotateLeft(a, 5), (b & c) | ((~b) & d)),
					this.safeAdd(this.safeAdd(e, w[j]), 0x5A827999));
				e = d;
				d = c;
				c = this.rotateLeft(b, 30);
				b = a;
				a = t;
			}
			for (; j < 40; j++) {
				w[j] = this.rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

				var t = this.safeAdd(this.safeAdd(this.rotateLeft(a, 5), b ^ c ^ d),
					this.safeAdd(this.safeAdd(e, w[j]), 0x6ED9EBA1));
				e = d;
				d = c;
				c = this.rotateLeft(b, 30);
				b = a;
				a = t;
			}
			for (; j < 60; j++) {
				w[j] = this.rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

				var t = this.safeAdd(this.safeAdd(this.rotateLeft(a, 5), (b & c) | (d & (b | c))),
					this.safeAdd(this.safeAdd(e, w[j]), 0x8F1BBCDC));
				e = d;
				d = c;
				c = this.rotateLeft(b, 30);
				b = a;
				a = t;
			}
			for (; j < 80; j++) {
				w[j] = this.rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

				var t = this.safeAdd(this.safeAdd(this.rotateLeft(a, 5), b ^ c ^ d),
					this.safeAdd(this.safeAdd(e, w[j]), 0xCA62C1D6));
				e = d;
				d = c;
				c = this.rotateLeft(b, 30);
				b = a;
				a = t;
			}

			a = this.safeAdd(a, aa);
			b = this.safeAdd(b, bb);
			c = this.safeAdd(c, cc);
			d = this.safeAdd(d, dd);
			e = this.safeAdd(e, ee);
		}
		return Array(a, b, c, d, e);
	},

	sha2: function (str) {
		return this.bigEndianArrayToHex(this.sha2_binary(str));
	},

	/**
	 * Calculate the SHA-256 hash.
	 *
	 * @param string the string to hash
	 * @return string the hashed string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	sha2_binary: function (str) {
		var k = new Array(
			0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
			0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
			0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
			0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
			0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
			0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
			0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
			0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
		);

		var w = Array(64);

		var a = 0x6A09E667;
		var b = 0xBB67AE85;
		var c = 0x3C6EF372;
		var d = 0xA54FF53A;
		var e = 0x510E527F;
		var f = 0x9B05688C;
		var g = 0x1F83D9AB;
		var h = 0x5BE0CD19;

		var x = this.strToBigEndianArray(str);

		var strBit = str.length * this.charBit;

		x[strBit >> 5] |= 0x80 << (24 - (strBit & 0x1f));
		x[((strBit + 64 >> 9) << 4) + 15] = strBit;

		var len = x.length;

		for (var i = 0; i < len; i += 16) {
			var aa = a, bb = b, cc = c, dd = d;
			var ee = e, ff = f, gg = g, hh = h;

			var j = 0;

			for (; j < 16; j++) {
				w[j] = x[i + j];

				var s0 = this.rotateRight(a, 2) ^ this.rotateRight(a, 13) ^ this.rotateRight(a, 22);
				var t0 = this.safeAdd(s0, (a & b) | (b & c) | (c & a));
				var s1 = this.rotateRight(e, 6) ^ this.rotateRight(e, 11) ^ this.rotateRight(e, 25);
				var t1 = this.safeAdd(this.safeAdd(this.safeAdd(this.safeAdd(h, s1), (e & f) | ((~e) & g)), k[j]), w[j]);

				h = g;
				g = f;
				f = e;
				e = this.safeAdd(d, t1);
				d = c;
				c = b;
				b = a;
				a = this.safeAdd(t0, t1);
			}
			for (; j < 64; j++) {
				w[j] = this.safeAdd(this.safeAdd(this.safeAdd(w[j - 16],
					this.rotateRight(w[j - 15], 7) ^ this.rotateRight(w[j - 15], 18) ^ (w[j - 15] >>> 3)),
					w[j - 7]),
					this.rotateRight(w[j - 2], 17) ^ this.rotateRight(w[j - 2], 19) ^ (w[j - 2] >>> 10));

				var s0 = this.rotateRight(a, 2) ^ this.rotateRight(a, 13) ^ this.rotateRight(a, 22);
				var t0 = this.safeAdd(s0, (a & b) | (b & c) | (c & a));
				var s1 = this.rotateRight(e, 6) ^ this.rotateRight(e, 11) ^ this.rotateRight(e, 25);
				var t1 = this.safeAdd(this.safeAdd(this.safeAdd(this.safeAdd(h, s1), (e & f) | ((~e) & g)), k[j]), w[j]);

				h = g;
				g = f;
				f = e;
				e = this.safeAdd(d, t1);
				d = c;
				c = b;
				b = a;
				a = this.safeAdd(t0, t1);
			}

			a = this.safeAdd(a, aa);
			b = this.safeAdd(b, bb);
			c = this.safeAdd(c, cc);
			d = this.safeAdd(d, dd);
			e = this.safeAdd(e, ee);
			f = this.safeAdd(f, ff);
			g = this.safeAdd(g, gg);
			h = this.safeAdd(h, hh);
		}
		return Array(a, b, c, d, e, f, g, h);
	},

	/**
	 * Encodes a string into the Base64 encoded notation.
	 *
	 * @param string the string to encode
	 * @return string the encoded string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	//   base64Encode: function (str)
	//   {
	// 	  var charBase64 = new Array(
	// 		  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P',
	// 		  'Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f',
	// 		  'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v',
	// 		  'w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'
	// 	  );

	// 	  var out = "";
	// 	  var chr1, chr2, chr3;
	// 	  var enc1, enc2, enc3, enc4;
	// 	  var i = 0;

	// 	  var len = str.length;

	// 	  do
	// 	  {
	// 		  chr1 = str.charCodeAt(i++);
	// 		  chr2 = str.charCodeAt(i++);
	// 		  chr3 = str.charCodeAt(i++);

	// 		  //enc1 = (chr1 & 0xFC) >> 2;
	// 		  enc1 = chr1 >> 2;
	// 		  enc2 = ((chr1 & 0x03) << 4) | (chr2 >> 4);
	// 		  enc3 = ((chr2 & 0x0F) << 2) | (chr3 >> 6);
	// 		  enc4 = chr3 & 0x3F;

	// 		  out += charBase64[enc1] + charBase64[enc2];

	// 		  if (isNaN(chr2))
	//     		{
	// 			  out += '==';
	// 		  }
	//     		else if (isNaN(chr3))
	//     		{
	// 			  out += charBase64[enc3] + '=';
	// 		  }
	// 		  else
	// 		  {
	// 			  out += charBase64[enc3] + charBase64[enc4];
	// 		  }
	// 	  }
	// 	  while (i < len);

	// 	  return out;
	//   },
	base64Encode: function (str) {
		return __BASE64.encoder(str)
	},
	/**
	 * Decodes a string from the Base64 encoded notation.
	 *
	 * @param string the string to decode
	 * @return string the decoded string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	//   base64Decode: function (str)
	//   {
	// 	  var indexBase64 = new Array(
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,62, -1,-1,-1,63,
	// 		  52,53,54,55, 56,57,58,59, 60,61,-1,-1, -1,-1,-1,-1,
	// 		  -1, 0, 1, 2,  3, 4, 5, 6,  7, 8, 9,10, 11,12,13,14,
	// 		  15,16,17,18, 19,20,21,22, 23,24,25,-1, -1,-1,-1,-1,
	// 		  -1,26,27,28, 29,30,31,32, 33,34,35,36, 37,38,39,40,
	// 		  41,42,43,44, 45,46,47,48, 49,50,51,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	// 		  -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1
	// 	  );

	// 	  var out = "";
	// 	  var chr1, chr2, chr3;
	// 	  var enc1, enc2, enc3, enc4;
	// 	  var i = 0;

	// 	  // trim invalid characters in the beginning and in the end of the string

	// 	  str = str.replace(/^[^a-zA-Z0-9\+\/\=]+|[^a-zA-Z0-9\+\/\=]+$/g,"")

	// 	  var len = str.length;

	// 	  do
	// 	  {
	// 		  enc1 = indexBase64[str.charCodeAt(i++)];
	// 		  enc2 = indexBase64[str.charCodeAt(i++)];
	// 		  enc3 = indexBase64[str.charCodeAt(i++)];
	// 		  enc4 = indexBase64[str.charCodeAt(i++)];

	// 		  chr1 = (enc1 << 2) | (enc2 >> 4);
	// 		  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	// 		  chr3 = ((enc3 & 3) << 6) | enc4;

	// 		  out += String.fromCharCode(chr1);

	// 		  if (enc3 != -1)
	// 		  {
	// 			  out += String.fromCharCode(chr2);
	// 		  }
	// 		  if (enc4 != -1)
	// 		  {
	// 			  out += String.fromCharCode(chr3);
	// 		  }
	// 	  }
	// 	  while (i < len);

	// 	  if (i != len)
	// 	  {
	// 		  new this.Error(this.BASE64_BROKEN);
	// 		  return "";
	// 	  }

	// 	  return out;
	//   },
	base64Decode: function (str) {
		return __BASE64.decoder(str)
	},

	/**
	 * Add binary-safe padding to a string.
	 *
	 * @param string the string to add padding
	 * @param int number for the string be divisible by
	 * @param int the string length
	 * @return the padded string
	 * @author www.farfarfar.com
	 * @version 0.2
	 */

	addPadding: function (str, divisible, len) {
		var paddingLen = divisible - (len % divisible);

		for (var i = 0; i < paddingLen; i++) {
			str += String.fromCharCode(paddingLen);
		}

		return str;
	},

	/**
	 * Remove binary-safe padding from a string
	 *
	 * @param string the string to remove padding
	 * @param int the string length
	 * @return the unpadded string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	removePadding: function (str, len) {
		return str.substr(0, len - (str.charCodeAt(str.length - 1)));
	},

	/**
	 * Converts a string to an array of longs
	 *
	 * @param string the string to convert
	 * @return long[]
	 * @version 0.1
	 */

	strToLong: function (str) {
		var ar = new Array();

		var len = Math.ceil(str.length / 4);

		for (var i = 0; i < len; i++) {
			ar[i] = str.charCodeAt(i << 2) + (str.charCodeAt((i << 2) + 1) << 8) +
				(str.charCodeAt((i << 2) + 2) << 16) + (str.charCodeAt((i << 2) + 3) << 24);
		}
		return ar;
	},

	/**
	 * Converts an array of longs to a string
	 *
	 * @param long[] the array to convert
	 * @return string
	 * @version 0.1
	 */

	longToStr: function (ar) {
		var len = ar.length;
		for (var i = 0; i < len; i++) {
			ar[i] = String.fromCharCode(ar[i] & 0xff, ar[i] >>> 8 & 0xff,
				ar[i] >>> 16 & 0xff, ar[i] >>> 24 & 0xff);
		}
		return ar.join('');
	},

	/**
	 * Converts a string into a little endian binary array
	 *
	 * @param string the string to convert
	 * @return int[]
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	strToLittleEndianArray: function (str) {
		var x = Array();
		var mask = (1 << this.charBit) - 1;

		var len = str.length;

		for (var i = 0, j = 0; j < len; i += this.charBit) {
			x[i >> 5] |= (str.charCodeAt(j++) & mask) << (i & 0x1f);
		}

		return x;
	},

	/**
	 * Converts a string into a big endian binary array
	 *
	 * @param string the string to convert
	 * @return int[]
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	strToBigEndianArray: function (str) {
		var x = Array();
		var mask = (1 << this.charBit) - 1;

		var len = str.length;

		for (var i = 0, j = 0; j < len; i += this.charBit) {
			x[i >> 5] |= (str.charCodeAt(j++) & mask) << (32 - this.charBit - (i & 0x1f));
		}

		return x;
	},

	/**
	 * Converts a little endian binary array into a hex-formatted string
	 *
	 * @param int[] the array to convert
	 * @return string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	littleEndianArrayToHex: function (ar) {
		var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

		var str = "";

		var len = ar.length;

		for (var i = 0, tmp = len << 2; i < tmp; i++) {
			str += charHex[((ar[i >> 2] >> (((i & 3) << 3) + 4)) & 0xF)] +
				charHex[((ar[i >> 2] >> ((i & 3) << 3)) & 0xF)];
		}

		return str;
	},

	/**
	 * Converts a big endian binary array into a hex-formatted string
	 *
	 * @param int[] the array to convert
	 * @return string
	 * @author www.farfarfar.com
	 * @version 0.1
	 */

	bigEndianArrayToHex: function (ar) {
		var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

		var str = "";

		var len = ar.length;

		for (var i = 0, tmp = len << 2; i < tmp; i++) {
			str += charHex[((ar[i >> 2] >> (((3 - (i & 3)) << 3) + 4)) & 0xF)] +
				charHex[((ar[i >> 2] >> ((3 - (i & 3)) << 3)) & 0xF)];
		}

		return str;
	},

	/**
	 * Bitwise rotate a 32-bit integer to the left
	 *
	 * @param int the integer to rotate
	 * @param int the distance to rotate left
	 * @return int
	 */

	rotateLeft: function (val, n) {
		return (val << n) | (val >>> (32 - n));
	},

	/**
	 * Bitwise rotate a 32-bit integer to the right
	 *
	 * @param int the integer to rotate
	 * @param int the distance to rotate right
	 * @return int
	 */

	rotateRight: function (val, n) {
		return (val >>> n) | (val << (32 - n));
	},

	safeAdd: function (a, b) {
		var t = (a & 0xffff) + (b & 0xffff);
		return ((a >> 16) + (b >> 16) + (t >> 16) << 16) | (t & 0xffff);
	},

	/**
	 * Unencodes a hex-encoded string to a binary string
	 * @param str the string to unencode
	 * @return string the unencoded string
	 * @author www.farfarfar.com
	 */

	hexToStr: function (str) {
		var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
		var stringHex = "0123456789abcdef";

		var out = "";
		var len = str.length;
		str = new String(str);
		str = str.toLowerCase();
		if ((len % 2) == 1) {
			str += "0";
		}
		for (var i = 0; i < len; i += 2) {
			var s1 = str.substr(i, 1);
			var s2 = str.substr(i + 1, 1);
			var index1 = stringHex.indexOf(s1);
			var index2 = stringHex.indexOf(s2);

			if (index1 == -1 || index2 == -1) {
				new this.Error(this.HEX_BROKEN);
				return "";
			}

			var val = (index1 << 4) | index2;

			out += "" + String.fromCharCode(parseInt(val));
		}
		return out;
	},

	/**
	 * Encodes a string string to a hex-encoded string
	 * @param str the string to unencode
	 * @return string the unencoded string
	 * @author www.farfarfar.com
	 */

	strToHex: function (str) {
		var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

		var out = "";
		var len = str.length;
		str = new String(str);
		for (var i = 0; i < len; i++) {
			var s = str.charCodeAt(i);
			var h = "" + charHex[s >> 4] + "" + charHex[0xf & s];

			out += "" + h;
		}
		return out;
	},
	escape: function (txt) {
		var newString = window.escape(txt)
		newString = newString.replace(/\*/g, '%2a');
		newString = newString.replace(/\//g, '%2f');
		newString = newString.replace(/\+/g, '%2b');
		return newString;
	},
	unescape: window.unescape,
	hexEncoding: function (txt, separator) {

		var charStringArray = new Array;
		var decimal;
		for (var c = 0; c < txt.length; c++) {
			decimal = txt.charCodeAt(c);
			charStringArray.push('0x' + decimal.toString(16));
		}

		return charStringArray.join(separator);

	},
	hexEncoding1: function (txt) {
		return this.hexEncoding(txt, '')
	},
	hexEncoding2: function (txt) {
		return this.hexEncoding(txt, ' ')
	},
	hexEncoding3: function (txt) {
		return this.hexEncoding(txt, ':')
	},
	NumberToHex: function (txt) {
		var number = parseInt(txt)
		if (isNaN(number)) {
			alert('必须是数字')
			return;
		}
		return number.toString(16);
	},
	HexToNumber: function (txt) {
		return parseInt(txt, 16)
	},
	hexDecoding: function (txt) {

		var txt = txt.toLowerCase();
		//    txt = txt.replace( /[^0-9abcdefg]/g, '' );
		txt = txt.replace(/0x/g, '');
		txt = txt.replace(/[^0-9abcdefg]/g, '');
		//alert(txt)
		var charStringArray = new Array();
		var buffer = '';
		var result = '';
		for (var c = 0; c < txt.length; c++) {
			buffer += txt.charAt(c).toString();
			if (buffer.length >= 2) {
				result += String.fromCharCode(parseInt(buffer, 16));
				buffer = '';
			}
		}
		return result;
	},
	StringtoUnicode:function(txt){
		var res="";
		for (var c = 0; c < txt.length; c++) {
			res+='\\u'+('0000' + txt.charCodeAt(c).toString(16)).slice(-4)  
		}
		return res;
	},
	UnicodetoString:function(txt){
		var txt= txt.split('\\u').slice(1)
		var res="";
		return txt.map(function(x){
			return String.fromCharCode(parseInt(x,16))
		}).join("");
	}



}


