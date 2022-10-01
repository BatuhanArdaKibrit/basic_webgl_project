var gl;

var theta;
var thetaLoc;

var delay = 100;

var isDirClockwise = true;
var start_stop = true;

var program;

var vPositionB;
var vPositionT;

var bufferIdB;
var bufferIdT;

var colorarray = [.75,.41,.56,1];
var colorloc;

var scale = 1;
var scaleloc;

var slidex;
var slidexval=0;
var slidexloc;

var slidey;
var slideyval=0;
var slideyloc;


window.onload = function init() {

	const canvas = document.querySelector("#glcanvas");
	// Initialize the GL context
	gl = WebGLUtils.setupWebGL(canvas);
	// Only continue if WebGL is available and working
	if (!gl) {
	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	return;
	}
	
	
	program = initShaders(gl,"vertex-shader","fragment-shader");
	
	var redshowcase = document.getElementById("redshowcase");
	var greenshowcase = document.getElementById("greenshowcase");
	var blueshowcase = document.getElementById("blueshowcase");
	var slidex = document.getElementById("slidex");
	var slidey = document.getElementById("slidey");

	var scalein = document.getElementById("scalein");
	var scalede = document.getElementById("scalede");

	var nrmls = document.getElementById("nrmlsize");

	var icon = document.querySelector(".collapse-icon");
	var modal_bg = document.getElementById("modal-bg");
	var xicon = document.getElementById("xicon");

	redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
	greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
	blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
	var dt = document.getElementById("delaytext");
	dt.innerText = `delay : ${0}`;

	var myButton = document.getElementById("DirectionButton");
	myButton.addEventListener("click",function(){
		isDirClockwise = !isDirClockwise;
	});

	var stopbtn = document.getElementById("stopbutton");
	stopbtn.addEventListener("click",function(){
		start_stop = !start_stop;
		if(start_stop){
			dt.innerHTML = `delay : ${0} `;
		}
		else{
			dt.innerHTML = `delay : ${delay.toFixed(2)}`;
		}
	});

	var m = document.getElementById("optionmenu");
	m.addEventListener("click",function(){
		switch(m.selectedIndex){
			case 0:
				isDirClockwise = !isDirClockwise;
				break;
			case 1:
				if(delay>2){
					delay /=1.5;
					dt.innerHTML = `delay : ${delay.toFixed(2)}`;
				}
				break;
			case 2:
				if(delay<200){
					delay *=1.5;
					dt.innerHTML = `delay : ${delay.toFixed(2)}`;
				}
				break;
		}
	});
	
	var redbtnup = document.querySelector("#redbtnup")
	redbtnup.addEventListener("click",function(){
		if(colorarray[0]+0.05 < 1 ){
			colorarray[0] += 0.05
			redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
		}
		else{
			colorarray[0] = 1;
			redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
		}
		
	});
	var greenbtnup = document.querySelector("#greenbtnup")
	greenbtnup.addEventListener("click",function(){
		if(colorarray[1]+0.05 < 1 ){
			colorarray[1] += 0.05 
			greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
		}
		else{
			colorarray[1] = 1;
			greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
		}
		
	});
	var bluebtnup = document.querySelector("#bluebtnup")
	bluebtnup.addEventListener("click",function(){
		if(colorarray[2]+0.05 < 1 ){
			colorarray[2] += 0.05 
			blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
		}
		else{
			colorarray[2] = 1;
			blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
		}
		
	});
	var redbtndwn = document.querySelector("#redbtndwn")
	redbtndwn.addEventListener("click",function(){
		if(colorarray[0]-0.05 > 0 ){
			colorarray[0] -= 0.05
			redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
		}
		else{
			colorarray[0] = 0;
			redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
		}
		
	});
	var greenbtndwn = document.querySelector("#greenbtndwn")
	greenbtndwn.addEventListener("click",function(){
		if(colorarray[1]-0.05 > 0 ){
			colorarray[1] -= 0.05
			greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
		}
		else{
			colorarray[1] = 0;
			greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
		}
		
	});
	var bluebtndwn = document.querySelector("#bluebtndwn")
	bluebtndwn.addEventListener("click",function(){
		if(colorarray[2]-0.05 > 0 ){
			colorarray[2] -= 0.05
			blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
		}
		else{
			colorarray[2] = 0;
			blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
		}
		
	});

	scalein.addEventListener("click",function(){
		if(scale+0.05 < 2)
			scale += 0.05;
	});
	scalede.addEventListener("click",function(){
		if(scale-0.05 > 0.1)
			scale -= 0.05;
	});

	nrmls.addEventListener("click",()=>{
		scale = 1;
	})

	slidex.addEventListener("change",function(){
		slidexval = slidex.value;
	});


	slidey.addEventListener("change",function(){
		slideyval = slidey.value;
	});
	
	window.addEventListener("keydown",function(e){
		if(e.key == "r"){
			for(let x = 0;x<3;x++){
				colorarray[x] = Math.random();
				redshowcase.innerText = `Red : ${colorarray[0].toFixed(2)}`;
				greenshowcase.innerText = `Green : ${colorarray[1].toFixed(2)}`;
				blueshowcase.innerText = `Blue : ${colorarray[2].toFixed(2)}`;
			}
		}
	});

	window.addEventListener("keypress",function(e){
		switch(e.key){
			case "d":
				slidexval = Number(slidexval);
				if(slidexval+0.05<=1.01){
					slidexval += 0.05;
					slidex.value = slidexval;
					
				}
				break;
			case "a":
				slidexval = Number(slidexval);
				if(slidexval-0.05>=-1.01){
					slidexval -= 0.05;
					slidex.value = slidexval;
				}
				break;
			case "w":
				slideyval = Number(slideyval);
				if(slideyval+0.05<=1.01){
					slideyval += 0.05;
					slidey.value = slideyval;
				}
				break;
			case "s":
				slideyval = Number(slideyval);
				if(slideyval-0.05>=-1.01){
					slideyval -= 0.05;
					slidey.value = slideyval;
				}
				break;
			case "p":
				start_stop = !start_stop;
				if(start_stop){
					dt.innerHTML = `delay : ${0} `;
				}
				else{
					dt.innerHTML = `delay : ${delay.toFixed(2)}`;
				}
				break;
			case "q":
				slidexval = 0
				slideyval = 0
				theta = 0;
				slidex.value = slidexval;
				slidey.value = slideyval;
				break;
			case "f":
				if(delay>2){
					delay /=1.5;
					dt.innerHTML = `delay : ${delay.toFixed(2)}`;
				}
				break;
			case "g":
				if(delay<200){
					delay *=1.5;
					dt.innerHTML = `delay : ${delay.toFixed(2)}`;
				}
				break;
			case "b":
				if(scale+0.05 < 2){
					scale += 0.05;
				}
				break;
			case "n":
				scale = 1;
			case "m":
				if(scale-0.05 > 0.1){
					scale -= 0.05;
				}
				break;
			case "z":
				isDirClockwise = !isDirClockwise;
		}
	});

	icon.addEventListener("click",function(){
		modal_bg.style.display = "block"
	});

	window.onclick = function(e){
		if(e.target == modal_bg){
			modal_bg.style.display = "none";
		}
	}

	xicon.addEventListener("click",()=>{
		modal_bg.style.display = "none";
	});


	var verticesB = [
		vec2(-.3,.45), vec2(-.8,.45), vec2(-.8,.35),
		vec2(-.8,.35), vec2(-.3,.35), vec2(-.3,.45),
		vec2(-.25,-.45),vec2(-.8,-.45), vec2(-.8,-.35),
		vec2(-.8,-.35),vec2(-.25,-.35),vec2(-.25,-.45),
		vec2(-.7,.35),vec2(-.6,-.35),vec2(-.7,-.35),
		vec2(-.6,.35),vec2(-.6,-.35),vec2(-.7,.35),
		vec2(-.6,.05),vec2(-.3,.05),vec2(-.3,-.05),
		vec2(-.6,.05),vec2(-.6,-.05),vec2(-.3,-.05),
		vec2(-.3,.05),vec2(-.3,-.05),vec2(-.24,.1),
		vec2(-.3,-.05),vec2(-.24,.1),vec2(-.14,.1),
		vec2(-.3,.45),vec2(-.3,.35),vec2(-.24,.30),
		vec2(-.3,.45),vec2(-.24,.30),vec2(-.14,.30),
		vec2(-.24,.30),vec2(-.14,.30),vec2(-.14,.1),
		vec2(-.24,.30),vec2(-.14,.1),vec2(-.24,.1),
		vec2(-.3,-.05),vec2(-.14,.1),vec2(-.2,-.1),
		vec2(-.1,-.1),vec2(-.3,.05),vec2(-.2,-.1),
		vec2(-.25,-.35),vec2(-.2,-.3),vec2(-.1,-.3),
		vec2(-.25,-.35),vec2(-.25,-.45),vec2(-.1,-.3),
		vec2(-.1,-.3),vec2(-.2,-.3),vec2(-.1,-.1),
		vec2(-.1,-.1),vec2(-.2,-.1),vec2(-.2,-.3),
		vec2(-.65,.45),vec2(-.58,.45),vec2(-.58,.55),
		vec2(-.65,.45),vec2(-.65,.55),vec2(-.58,.55),
		vec2(-.45,.45),vec2(-.38,.45),vec2(-.38,.55),
		vec2(-.45,.45),vec2(-.45,.55),vec2(-.38,.55),
		vec2(-.65,-.45),vec2(-.58,-.45),vec2(-.58,-.55),
		vec2(-.65,-.45),vec2(-.65,-.55),vec2(-.58,-.55),
		vec2(-.45,-.45),vec2(-.38,-.45),vec2(-.38,-.55),
		vec2(-.45,-.45),vec2(-.45,-.55),vec2(-.38,-.55)
		
	];
	var verticesT = [
		vec2(.2,.45),vec2(.8,.45),vec2(.8,.35),
		vec2(.8,.35),vec2(.2,.35),vec2(.2,.45),
		vec2(.2,.45),vec2(.1,.25),vec2(.4,.45),
		vec2(.8,.45),vec2(.9,.25),vec2(.6,.45),
		vec2(.42,.45),vec2(.58,.45),vec2(.5,-.45)
	];

	bufferIdB = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW );
	

	// Associate out shader variables with our data buffer
	vPositionB = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPositionB, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPositionB );

	bufferIdT = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdT );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesT), gl.STATIC_DRAW );
	

	// Associate out shader variables with our data buffer
	vPositionT = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPositionT, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPositionT );

	thetaLoc = gl.getUniformLocation(program, "theta");
	theta = 0;

	colorloc = gl.getUniformLocation( program, "colorarray");

	scaleloc = gl.getUniformLocation(program,"scale");

	slidexloc = gl.getUniformLocation(program,"slidexval");

	slideyloc = gl.getUniformLocation(program,"slideyval");
	
	// Set clear color to black, fully opaque
	// rgb
	gl.clearColor(0.3, 0.8, 0.7, 1.0);
	requestAnimFrame(render);
}	

function render(){
	// Clear the color buffer with specified clear color
		setTimeout(function() {
			gl.clear(gl.COLOR_BUFFER_BIT);
			if(start_stop){
				theta += 0
			}
			else{
				theta += (isDirClockwise ? -0.1 : 0.1);
			}
			gl.useProgram( program );
			gl.uniform1f(thetaLoc, theta);
			gl.uniform4fv( colorloc, colorarray);
			gl.uniform1f(scaleloc,scale);
			gl.uniform1f(slidexloc,slidexval);
			gl.uniform1f(slideyloc,slideyval);
			
			
			
			gl.enableVertexAttribArray( vPositionB );
        	gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
        	gl.vertexAttribPointer( vPositionB, 2, gl.FLOAT, false, 0, 0 );
			gl.drawArrays(gl.TRIANGLES, 0, 84);

			gl.enableVertexAttribArray( vPositionT );
        	gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdT );
        	gl.vertexAttribPointer( vPositionT, 2, gl.FLOAT, false, 0, 0 );
			gl.drawArrays(gl.TRIANGLES, 0, 15);

			render();
		}, delay);
}
	


	
