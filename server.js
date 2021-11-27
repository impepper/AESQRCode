var http=require('http');
var CryptoJS = require("crypto-js");
var QRCode = require("qrcode")
const { parse } = require('querystring');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


var server=http.createServer(async (req,res) => {
	
		const buffers = [];

		for await (const chunk of req) {
			buffers.push(chunk);
		}

		const data = Buffer.concat(buffers).toString();

		console.log(JSON.parse(data).todo); // 'Buy the milk'	
	
	
	
	
	
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
			if (req.method === 'POST') {
				var strPref 
				var originalText 
				var AESKEY 
				var ciphertext 			
				var strURLEncoded 
				
				// collectRequestData(req, result => {
					
					strPref = (JSON.parse(data).preftext || '' )
					originalText = CryptoJS.enc.Utf8.parse(JSON.parse(data).encdata || 'LIN,Pepper,886987654321,')
					AESKEY = CryptoJS.enc.Utf8.parse(JSON.parse(data).key ||'abcdefghijklmnop')
					
					ciphertext = CryptoJS.AES.encrypt(originalText,AESKEY,{
									  mode: CryptoJS.mode.ECB,
									  padding: CryptoJS.pad.ZeroPadding
									}).toString();			
					var strURLEncoded = encodeURIComponent(ciphertext)
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
				
					
				// });
				
			}else {
			  res.end('<!doctype html><html><body></body></html>');
			}	
						
		}else
            res.end('Invalid Request!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log('Node.js web server at port '+PORT+' is running..')
