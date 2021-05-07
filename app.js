const fs    = require('fs')
const http  = require('http')
const PORT  = process.env.PORT || 8080

function compare(y){
	
	x = []
	
	files = fs.readdirSync(y)

	files.map(file => {
		
		if( fs.lstatSync(y+"\\"+file).isFile() )
		x.push( { "name" : file, "size" : fs.statSync(y+"\\"+file).size, "path": y  } )
	  
	})
	
	return x
	
}

function follow2() {
	
	let content2 = "<style> table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; } td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; } </style><link rel='icon' href='' /><table>"

	arr = []
	
		for ( k of process.argv.slice(2) ){
		
			arr1 = 	compare(k)
			arr.push( ...arr1 )
		
		}

		arr.sort( (a, b) => b.size - a.size )
	
		count = 0
		
		currentSize = 0
		
		style = ""

		for ( i = 1 ; i < arr.length ; i++ ){
		
			if ( arr[i-1].size == arr[i].size ){
				
				if ( currentSize != arr[i].size )
				count++
				
				if ( count % 2 == 0 )
				style = "style='background-color: #dddddd;'"
				else
				style = ""
			
				currentSize = arr[i].size

				r1 = arr[i-1].name.split(" ")
				r2 = arr[i].name.split(" ")
				
				const resultA = r1.filter( word => !r2.includes(word) )
				const resultB = r2.filter( word => !r1.includes(word) )
		
				regex1 = /span/
			
				if ( resultA != [] ){
					
					let placeholder = arr[i-1].name
					
					resultA.map( (x,index) => {
						
						placeholder = placeholder.replace( x, `/${index}` )
					
					})
					
					resultA.map( (x,index) => {
						
						placeholder = placeholder.replace( `/${index}`, "<span style='color:blue;font&#45weight: bold;'>"+x+"</span>" )
						
					})
					
					content2 += "<tr><td id='row1' >" + arr[i-1].path.replace(/\\/g, '/') + "/" + placeholder + `</td><td ${style}>` + `size:${arr[i-1].size}` + "</td>"
			
				}
				
				if ( resultB != [] ){
					
					let placeholder = arr[i].name
					
					resultB.map( (x,index) => {
						 
						placeholder = placeholder.replace( x, `/${index}` )
				
					})
					
					resultB.map( (x,index) => {
						 
						placeholder = placeholder.replace( `/${index}`, "<span style='color:red;font&#45weight: bold;'>"+x+"</span>" )
				
					})
					
					content2 += `<td ${style}>` + `size:${arr[i].size}` + "</td>" + "<td id='row2' >" + arr[i].path.replace(/\\/g, '/') + "/" + placeholder + "</td></tr>"

				}
		
			}
		}
		
		content2 += "</table>"

		return content2
	
}

var server = http.createServer(function (req, res) {
	
	res.writeHead(200,{"content-type":"text/html;charset=utf8"})

	if( req.url == "/" ){

		res.write(follow2())
		res.end()
	}

}).listen(PORT)

console.log(`Le contenu du fichier est afficher sur le localhost:${PORT}`)
