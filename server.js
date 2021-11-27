var http=require('http');
var CryptoJS = require("crypto-js");
var QRCode = require("qrcode")

var server=http.createServer(function(req,res){
        if(req.url=='/'){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><body>This is Home Page.</body></html>');
            res.end();
        }else if(req.url=='/student'){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><body>This is student Page.</body></html>');
            res.end();
        }else if(req.url=='/admin'){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write('<html><body>This is admin Page.</body></html>');
            res.end();
        }else if(req.url=='/aesqrcode'){
			var strPref = 'https://www.chanel.com/?posprofie='
			var originalText = CryptoJS.enc.Utf8.parse('LIN,Pepper,886987654321,')
			var AESKEY = CryptoJS.enc.Utf8.parse('tRtgSEahnU2XLUfi')
			var ciphertext = CryptoJS.AES.encrypt(originalText,AESKEY,{
							  mode: CryptoJS.mode.ECB,
							  padding: CryptoJS.pad.ZeroPadding
							}).toString();			
			var strURLEncoded = encodeURIComponent(ciphertext)
			var encQRCode
			QRCode.toDataURL(strPref+strURLEncoded,{ errorCorrectionLevel: 'M' },
								function (err, url) {
									// res.writeHead(200,{'Content-Type':'text/plain'});
									// res.write(url);
									res.writeHead(200,{'Content-Type':'text/html'});
									res.write('<html><body>Original TEXT:'+
												originalText+
												'<br / >Encoded Text:'+
												ciphertext+
												'<br / >URLEncoded Text:'+
												strURLEncoded+						
												'<br / >QRCode<br/><img alt="Logo" src="'+
												url+
												'"></body></html>');
									res.end();
								})
						
		}else
            res.end('Invalid Request!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log('Node.js web server at port '+PORT+' is running..')
