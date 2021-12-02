var http=require('http');
var CryptoJS = require("crypto-js");
var QRCode = require("qrcode")
const { parse } = require('querystring');

var server=http.createServer(async (req,res) => {
	
		const buffers = [];
		try {
			for await (const chunk of req) {
				buffers.push(chunk);
			}
			const data = Buffer.concat(buffers).toString();
		
			if(req.url=='/'){
				res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
				res.end('');
			}else if ((req.url=='/5ce06469-ac56-4e08-a8e1-16c5bec120de') || (req.url=='/aesqrcode') ){

				if  ((req.method === 'POST') && (req.headers.authorization=='Bearer 34d860a0-a5b1-449b-bc50-a6a8ef910495')) {

					var strPref 
					var originalText 
					var AESKEY 
					var ciphertext 			
					var strURLEncoded 
					var retType
									
					strPref = (JSON.parse(data).preftext || '' )
					retType = (JSON.parse(data).retType || 'text' )
					originalText = (JSON.parse(data).encdata || 'Info to be encoded')
					AESKEY = CryptoJS.enc.Utf8.parse(JSON.parse(data).key ||'Encryption Key')
					
					ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(originalText),AESKEY,{
									  mode: CryptoJS.mode.ECB,
									  padding: CryptoJS.pad.ZeroPadding
									}).toString();			
					var strURLEncoded = encodeURIComponent(ciphertext)
					
					QRCode.toDataURL(strPref+strURLEncoded,{width: (JSON.parse(data).width || 400 ), errorCorrectionLevel: 'M' },
										function (err, url) {
											
											res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
											var json;
											if (retType == 'qrcode_image'){
											
												json = JSON.stringify({ 
													encData: originalText,
													ciphertext: ciphertext,
													QRCode: url
												});
											}else {
												json = JSON.stringify({ 
													encData: originalText, 
													ciphertext: ciphertext
												});											
											}
											res.end(json);										

										})							
				}else {
				  res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});			  
				  res.end('');
				}							
			}else {
				res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
				res.end('');
			};
		} catch (e) {
				res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
				res.end('');			
		}
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log('Node.js web server at port '+PORT+' is running..')
