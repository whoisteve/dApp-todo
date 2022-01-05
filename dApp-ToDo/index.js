var http = require('http');
 
var server = http.createServer();
var Gun = require('gun');
var gun = Gun({web: server});
 
server.listen(8080, function () {
  console.log('Server listening on http://localhost:8080/gun')
})
