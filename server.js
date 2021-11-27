var http=require('http');
var CryptoJS = require("crypto-js");
var QRCode = require("qrcode")
const { parse } = require('querystring');

var server=http.createServer(async (req,res) => {
	
		const buffers = [];

		for await (const chunk of req) {
			buffers.push(chunk);
		}
		const data = Buffer.concat(buffers).toString();
	
        if(req.url=='/'){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><body></body></html>');
            res.end();
        }else if(req.url=='/aesqrcode'){
			if (req.method === 'POST') {
				var strPref 
				var originalText 
				var AESKEY 
				var ciphertext 			
				var strURLEncoded 
					
				strPref = (JSON.parse(data).preftext || '' )
				originalText = (JSON.parse(data).encdata || 'Info to be encoded')
				AESKEY = CryptoJS.enc.Utf8.parse(JSON.parse(data).key ||'Encryption Key')
				
				ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(originalText),AESKEY,{
								  mode: CryptoJS.mode.ECB,
								  padding: CryptoJS.pad.ZeroPadding
								}).toString();			
				var strURLEncoded = encodeURIComponent(ciphertext)
				
				QRCode.toDataURL(strPref+strURLEncoded,{ errorCorrectionLevel: 'M' },
									function (err, url) {
										
										// res.writeHead(200,{'Content-Type':'text/html ;charset=utf-8'});
										// res.write(url);
										
										// res.writeHead(200,{'Content-Type':'text/html ;charset=utf-8'});												
										// res.write('Original TEXT:'+
													// originalText+
													// '<br / ><br / >Encoded Text:'+
													// ciphertext+					
													// '<br / ><br / >QRCode<br/><img alt="QRCode" src="'+
													// url+
													// '">');
										// res.end();
										
										res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
										var json = JSON.stringify({ 
											encData: originalText, 
											ciphertext: ciphertext, 
											QRCode: url
										});
										res.end(json);										

									})							
			}else {
			  res.end('');
			}							
		}else
			res.writeHead(404, {"Content-Type": "text/plain"});
            res.end('Invalid Request!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log('Node.js web server at port '+PORT+' is running..')
