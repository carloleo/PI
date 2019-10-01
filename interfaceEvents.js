 /*
 * definiscono l'id dei prototipi
*/
 const pensil = 1;
 const circle = 2;
 const rectangle = 3;
 const move = 4;
 const line = 5;
 const delta = 10;

 var curr_tool = null; //tool 
 var curr_color = "rgb(0,0,0)"; //colore 
 var curr_size = 0.3; //dimensione del tratto

 /*
 * rappresentano lo stato del drag & drop
*/
 var down = false;
 var moves = false;
 var sketchs = [];
 var curr_stetch = null; 

 /*
 * utilizzate nell'animazione
*/ 
 var h = 0; 
 var m = 0;
 var s = 0;
 var head = false;
 var tail = false;
/*
 * @brief: resetta lo stato del canvas
*/
function cleanAll(){
	let canvas = document.getElementById("myCanvass");
	let ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height); //clean canvas
	sketchs = [];

}
/*
 * @brief: disegna un oggetto che rappresenta una linea
*/
function drawLine(ctx,x1,y1,x2,y2,color_line,size_line){
	  ctx.strokeStyle = color_line;
      ctx.lineWidth = size_line;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.closePath();
      ctx.stroke();
}
/*
 * @brief: disegna un oggetto che rappresenta un cerchio
*/
function drawCircle(ctx,center,radius,color_circle,size_circle,dx){
	if(typeof center === 'undefined' || typeof radius === 'undefined'|| center === null || radius === null) return;
	ctx.lineWidth = size_circle;
    ctx.strokeStyle = color_circle;
   	ctx.beginPath();
    ctx.ellipse(center.x_c,center.y_c,radius,radius,0,0,2*Math.PI);
    ctx.closePath();
    ctx.stroke();	

}
/*
 * @brief: disegna un oggetto che rappresenta un rettangolo
*/
function drawRectangle(ctx,p1,p2,color_rect,size_rect){
   	if(typeof p1 === 'undefined' || typeof p2 === 'undefined'|| p1 === null || p2 === null) return;
   	ctx.lineWidth = size_rect;
    ctx.strokeStyle = color_rect;
    let dx = p2.x_c - p1.x_c;
    let dy = p2.y_c - p1.y_c;
    let l = Math.max(dx,dy);
	ctx.strokeRect(p1.x_c,p1.y_c,l,l);

}
/*
 * @brief: disegna un oggetto che rappresenta un disegno a mano libera
*/
function drawPensil(ctx,elm){
	let points = elm.getPoints();
	let color = elm.getColor();
	let size = elm.getSize();
	let frist = true;
	ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.beginPath();
	points.forEach(p =>{
		if(frist){
			ctx.moveTo(p.x_c,p.y_c);
			frist = false;
		}
		else{
			ctx.lineTo(p.x_c,p.y_c)
		}
	})
	ctx.stroke();
}
	
/*
 * @brief: disegna gli oggetti
*/
function draw(ctx,elements){
	let canvas = document.getElementById("myCanvass");
	ctx.clearRect(0,0,canvas.width,canvas.height); //pulisco il canvas
	var i = 0;
	elements.forEach(el =>{
		ctx.save();
		let i_d = el.getId();
		switch (i_d){
			case line:
				let begin = el.getBegin();
				let end = el.getEnd();
				drawLine(ctx,begin.x_c,begin.y_c,end.x_c,end.y_c,el.getColor(),el.getSize());
				break;
			case circle:
				let center = el.getCenter();
				let radius = el.getRadius();
				drawCircle(ctx,center,radius,el.getColor(),el.getSize(),el.getDx());
				break;
			case rectangle:
				drawRectangle(ctx,el.getP1(),el.getP2(),el.getColor(),el.getSize());
				break;
			case pensil:
				drawPensil(ctx,el);
				break;	
			default:
				break;	
		}
		ctx.restore();
	})

}
/*
 * @brief: evidenzia il colore di background selezionato
*/
function eviBktd(i){
	let els = document.getElementsByClassName("bktd");
	let canvas = document.getElementById("myCanvass");
	for(let j = 0; j < 4 ; j++){
		if(j == i){
			els[j].style.backgroundColor = "rgb(144,238,144)";
			switch(i){
				case 0:
					canvas.style.backgroundColor = "rgb(255,255,255)";
					break;
				case 1:
					canvas.style.backgroundColor = "rgb(255,0,0)";
					break;
				case 2:
					canvas.style.backgroundColor = "rgb(0,0,0)";
					break;
				case 3:
					canvas.style.backgroundColor = "rgb(139,69,19)";
					break;
				default: break;	
			}

		} 
		else els[j].style.backgroundColor = "rgb(255,255,255)";
     }
	
	
}
/*
 * @brief: mostra il colore costruito
*/
function showColor() {
	var elms = document.getElementsByClassName("range");
	var box = document.getElementById("previewColor");
	var color = "rgb("+elms[0].value+", "+elms[1].value+", "+elms[2].value+")"; //costruisco colore rgb
	box.style.backgroundColor = color; //coloro div
	curr_color = color;

}
/*
 * @brief: inizializza lo stato della console
*/
function initializer(){
	var elms = document.getElementsByClassName("range");
	for(let i = 0; i < 3; i++) elms[i].value = 0;
	let n = document.getElementById("n");
	n.value = curr_size;
	showColor(); 
	showSize();
	eviBktd(0);
}

/*
 * @brief: mostra il colore selezionato tra quelli selezionabili direttamente
*/
function evideceTd(color){
	let elms = document.getElementsByClassName("range");
	let value = null;
	let rgbcolors ={
			red:"rgb(255,0,0)",
			yellow:"rgb(255,255,0)",
			grey:"rgb(128,128,128)",
			pink:"rgb(255,192,203)",
			green:"rgb(0,128,0)",
			orange:"rgb(255,165,0)"
		}
	//string2rgb
	switch(color){
		case "red":
			elms[0].value = 255;
			elms[1].value = 0;
			elms[2].value = 0;
			value = rgbcolors.red;
		    break;
		case "yellow":
			elms[0].value = 255;
			elms[1].value = 255;
			elms[2].value = 0;
			value = rgbcolors.yellow;
		    break;
		case "green":
			elms[0].value = 0;
			elms[1].value = 128;
			elms[2].value = 0;
			value = rgbcolors.green;
		    break;
		case "orange":
			elms[0].value = 255;
			elms[1].value = 165;
			elms[2].value = 0;
			value = rgbcolors.orange;
		    break;
		case "grey":
			elms[0].value = 128;
			elms[1].value = 128;
			elms[2].value = 128;
			value = rgbcolors.grey;
		    break;
		case "pink":
			elms[0].value = 255;
			elms[1].value = 192;
			elms[2].value = 203;
			value = rgbcolors.pink;
		    break;            
		default:	
			 break;    
	}
	let box = document.getElementById("previewColor");
	box.style.backgroundColor = value;
	curr_color = value;
}

/*
 * @brief: mostra il tool selezionato
*/
function imgClick(img){ 
	var pw = document.getElementById("previewObj");;
	switch(img){
		case pensil:
			pw.style.backgroundImage="url(imgs/pensil.png)";
			curr_tool = pensil;
			break;
		case circle:
			pw.style.backgroundImage="url(imgs/circle.png)";
			curr_tool = circle;
			break;
		case rectangle:
			pw.style.backgroundImage="url(imgs/square.png)";
			curr_tool = rectangle;
			break;
		case move:
			pw.style.backgroundImage="url(imgs/move.png";
			curr_tool = move;
			break;
		case line:
			pw.style.backgroundImage="url(imgs/line.png)";
			curr_tool = line;
			break;
		default:
			break;			
	}
	pw.style.backgroundSize="cover"; //adatto l'immagine alla dimensione del contenitore

}
/*
 * @brief: mostra la dimensione del tratto corrente
*/
function showSize(){ //massima dimensione 20 pixel
	var div = document.getElementById("n");
	var x = document.getElementById("number");
	var pixel = document.getElementById("pixel");
	x.innerHTML = div.value + " mm";
	pixel.innerHTML = (div.value / 0.26).toFixed(2) +" px";
	curr_size = (div.value / 0.26).toFixed(2); //traduco la dimensione in pixel
}


var curr_p = null;

/*
 * @brief: prototipo che rappresenta la linea
*/
function Line(begin,end){
	this.i_d = line;
	this.begin = begin;
	this.end = end;
	this.c = curr_color;
	this.s = curr_size;
	var tmp_b = begin;
	var tmp_e = end;
	//se il punto è in un intoro di raggio 5 del punto iniziale o del punto finale la seleziono
	this.isIn = function(point){
		let x = point.x_c;
		let y = point.y_c;
		if((x >= Math.abs(tmp_b.x_c - delta)) && (y >= Math.abs(tmp_b.y_c - delta)) && (x <= (tmp_b.x_c + delta)) && (y <= (tmp_b.y_c + delta))){
			head = true;
			return head;
		} 
		if((x >= Math.abs(tmp_e.x_c - delta)) && (y >= Math.abs(tmp_e.y_c - delta)) && (x <= (tmp_e.x_c + delta)) && (y <= (tmp_e.y_c + delta))){
			tail = true;
			return tail;
		} 

		return false;
	}
	//trasla una linea in base al punto in cui è stata selezionata
	this.move = function(point){
		let dx = 0;
		let dy = 0;
		if(head){//punto iniziale
			 dx = point.x_c - tmp_b.x_c;
			 dy = point.y_c - tmp_b.y_c;
		}
		else if(tail){//punto finale
			dx = point.x_c - tmp_e.x_c;
			dy = point.y_c - tmp_e.y_c;
		}
		dy /= 3;
		dx /=3;
		tmp_b.x_c += dx;
		tmp_b.y_c += dy;
		tmp_e.x_c += dx;
		tmp_e.y_c += dy;
		this.setBegin(tmp_b);
		this.setEnd(tmp_e);
		
	}
	this.setBegin = function(p){
		this.begin = p;
	}
	this.getBegin= function(){
		return this.begin;
	}
	this.getEnd=function(){
		return this.end;
	}

	this.setEnd= function(end){
		this.end = end;
		tmp_e = end;
	}

	this.getId = function(){
		return this.i_d;
	}

	this.getColor = function(){
		return this.c;
	}

	this.getSize = function(){
		return this.s;
	}
}
/*
 * @brief: prototipo che rappresenta il cerchio
*/

function Circle(center,r){
	this.i_d = circle;
	this.center = center;
	this.radius = r
	this.c = curr_color;
	this.s = curr_size;
	this.dx = 0;
	var var_center = center;

	this.setCenter=function(p){
		this.center = p;
		var_center = p;
	}
	this.getCenter = function(){
		return this.center;
	}
	this.getRadius = function(){
		return this.radius;
	}
	this.setRadius = function(r){
		this.radius = r;
	}

	this.getColor = function(){
		return this.c;
	}

	this.getSize = function(){
		return this.s;
	}
	this.getId = function(){
		return this.i_d;
	}

	this.setDx = function(d){
		this.dx = d;
	}

	this.getDx = function(){
		return this.dx
	}

	this.isIn = function(point){
		let x1 = point.x_c;
		let y1 = point.y_c;
		let x0 = var_center.x_c;
		let y0 = var_center.y_c;
		//se la distanza tra il punto e il centro della circonferenza è minimore del raggio
		return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < this.radius;

	}
	//trasla il centro del cerchio 
	this.move = function(point){
		let x1 = point.x_c;   
		let y1 = point.y_c;
		let c = var_center;
		let dx = x1 - c.x_c;
		let dy = y1  - c.y_c;
		var_center.x_c += dx;
		var_center.y_c += dy;
		this.setCenter(var_center);
	}

}
/*
 * @brief: prototipo che rappresenta il rettangolo
*/
function Rectangle(p1){
	this.p1 = p1;
	this.p2 = null;
	this.i_d = rectangle;
	this.c = curr_color;
	this.s = curr_size;
	var var_p1 = p1;
	var var_p2 = null;

	this.isIn = function(point){
		let dx = this.p2.x_c - this.p1.x_c;
    	let dy = this.p2.y_c - this.p1.y_c; 
    	let l = Math.max(dx,dy);
    	if(point.x_c >= this.p1.x_c && point.x_c <= (this.p1.x_c+l) && point.y_c >= this.p1.y_c && point.y_c <= this.p1.y_c+l) return true;
    	return false;
	}
	//trasla il rettangolo
	this.move=function(p){
		let dx = p.x_c - var_p1.x_c; 
		let dy = p.y_c - var_p1.y_c;
		var_p1.x_c += dx;
		var_p1.y_c += dy;
		var_p2.x_c += dx;
		var_p2.y_c += dy;
		this.setP2(var_p2);
		this.setP1(var_p1);
	}
	this.setP1 = function(p){
		this.p1 = p;
	}

	this.getP1 = function(){
		return this.p1;
	}
	this.getP2 = function(){
		return this.p2;
	}
	this.setP2 = function(p){
		this.p2 = p
		var_p2 = p;
	}
	this.getColor = function(){
		return this.c;
	}
	this.getSize = function(){
		return this.s;
	}
	this.getId = function(){
		return this.i_d;
	}
}

/*
 * @brief: prototipo che rappresenta il disegno a mano libera
*/

function Pensil(pStart){
	this.points = [];
	this.points.push(pStart);
	this.i_d = pensil;
	this.c = curr_color;
	this.s = curr_size;
	var tmp = this.points;
	//se il punto è in un intoro di raggio deleta del punto iniziale o finale seleziono l'oggetto
	this.isIn=function(point){
		let i = tmp.length-1;
		let x = point.x_c;
		let y = point.y_c;
		if((x >= Math.abs(tmp[0].x_c - delta)) && (y >= Math.abs(tmp[0].y_c-delta)) && (x <= tmp[0].x_c + delta) && ( y <= tmp[0].y_c + delta)) head = true;
		else if((x >= Math.abs(tmp[i].x_c - delta)) && (y >= Math.abs(tmp[i].y_c-delta)) && (x <= tmp[i].x_c + delta) && ( y <= tmp[i].y_c + delta)) tail = true;
		return tail || head;
	}
	//trasla il disegno a mano libera
	this.move =function(point){
		let dx = 0;
		let dy = 0;
		if(head){
			 dx = point.x_c - tmp[0].x_c;
			 dy = point.y_c - tmp[0].y_c;
		}
		else if(tail){
			 dx = point.x_c - tmp[tmp.length-1].x_c;
			 dy = point.y_c - tmp[tmp.length-1].y_c;
		}
		tmp.forEach(elm =>{
			elm.x_c += dx;
			elm.y_c += dy;
		})

	}
	this.getPoints=function(){
		return this.points;
	}
	this.setPoint=function(p){ 
		this.points.push(p);
		tmp = this.points;
	}
	this.getId=function(){
		return this.i_d;
	}
	this.getColor = function(){
		return this.c;
	}
	this.getSize = function(){
		return this.s;
	}
}
/*
 *	@brief: esegue la pick correlation
*/
function pick(sketchs,point){
	var obj = null;
	for(let i = sketchs.length-1; i >= 0 ; i--){
		if(sketchs[i].isIn(point)){
			obj = sketchs[i];
			sketchs.splice(i,1);
			console.log(obj);
			break;
		}
	
	}
	return obj;
}


var last_point = null;
window.onload =function(e){
			initializer();
			let canvas = document.getElementById("myCanvass");
			let div = document.getElementById("console"); //prendo la console dei comandi
			let cc = document.getElementById("console");
			cc.style.width = window.innerWidth + "px";
			let ctx = canvas.getContext("2d");
			let canvas_space = canvas.getBoundingClientRect(); //prendo cordinate inizio del canvas
			var inizio = null;
			let left = canvas_space.left;
			let top = canvas_space.top;

			
			var max = 0;
			var max2 = 0;
			
			//gestisce le dimensioni del canvas all'ridimensionamento della pagina
			function resize(){
				max = Math.max(max,window.innerWidth)
				div.style.width ="1420px";
				canvas.width= max;
				max2 = Math.max(max2,window.innerHeight)
				canvas.height= Math.floor(max2*0.8);
				draw(ctx,sketchs);

			}
			window.onresize = function(e){
				resize();
			}
			resize();
			let time = document.getElementById("time");

			//mostra il tempo trascorso dall'avvio della pagina web
			function animation(){
				s = (s + 1) % 60;
				if((s % 60) == 0) m = (m + 1) % 60;
				if((m != 0) && ((m % 60) == 0)) h += 1;
				time.innerHTML = "You are drawing for "+h+"   h"+" "+m+" m"+" "+s+" s";
			}

			let t = window.setInterval(animation,990);


			//traduce le cordinate rispetto al canvas
			function view2world(x,y){
				let x_c = Math.abs(x-left);
				let y_c = Math.abs(y-top);
				return {x_c,y_c};
			}


			var yes = false;
			var obj_over = null;
			var drag = false;
			var frist_point = null;
			var gamma = {dx:0 , dy:0};
			canvas.onmousedown = function(e){
				if(curr_tool === null || down || e == null || moves) return;
				var inizio = view2world(e.clientX,e.clientY);
				if(inizio === null || typeof inizio === 'undefined') return;
				//in base al tool selezionato aggiungo il corrispettivo oggetto negli sketchs
				switch(curr_tool){
					case line:
						 sketchs.push(new Line(inizio,inizio));
						 break;
					case circle:
						 sketchs.push(new Circle(inizio,0)); 
						 break;	
					case rectangle:
						 sketchs.push(new Rectangle(inizio));
						 last_point = inizio;
						 break;
					case pensil:
						 sketchs.push(new Pensil(inizio));
						 break;
					case move:
						if(drag) break;
						 obj_over = pick(sketchs,inizio);
						 if(obj_over != null){
						 	drag = true;
						 	frist_point =  inizio;
						 	sketchs.push(obj_over);
						 	curr_tool = obj_over.getId();
						 	//calcolo gamma per rendere il drang & drop fluido 
						 	if(obj_over.getId() == rectangle){
						 		let p = obj_over.getP1();
						 		gamma.dx = inizio.x_c - p.x_c;
						 		gamma.dy = inizio.y_c - p.y_c;
							}
							else if(obj_over.getId() == circle){
								let p = obj_over.getCenter();
						 		gamma.dx = inizio.x_c - p.x_c;
						 		gamma.dy = inizio.y_c - p.y_c;

							}
						 }
					    break;
					default:
						break;

				}
				down = true;
			}
			canvas.onmousemove = function(e){
				if(curr_tool == null || !down ) return;
				curr_p = view2world(e.clientX,e.clientY);
				if(typeof curr_p === 'undefined' || curr_p === null)return;
				moves = true;
				let obj = sketchs[sketchs.length - 1]; //prendo l'oggetto che si sta disegnando o spostando
				if(obj == null) return;
				switch(curr_tool){ //in base al tool selezionato lo disegno
					case line:
							if(drag){ // sono nello stato di drag
								obj.move(curr_p);
								draw(ctx,sketchs);
								break;
							}
							obj.setEnd(curr_p);
							draw(ctx,sketchs);
							break;
					case circle:
						   if(drag){
						   		curr_p.x_c -= gamma.dx;
								curr_p.y_c -= gamma.dy;
								obj.move(curr_p)
						   		draw(ctx,sketchs);
						   		break;
						   	}
							let r_x = Math.abs(curr_p.x_c - obj.getCenter().x_c);//calcolo il nuovo raggio
						 	let r_y = Math.abs(curr_p.y_c - obj.getCenter().y_c);
						 	obj.setRadius(Math.max(r_x,r_y));
						 	obj.setDx(Math.abs(r_x-r_y));
						 	draw(ctx,sketchs);
							   break;
					case rectangle:
							if(drag){
							curr_p.x_c -= gamma.dx;
								curr_p.y_c -= gamma.dy;
								obj.move(curr_p);
								draw(ctx,sketchs);
								break;
							}
							obj.setP2(curr_p);
							draw(ctx,sketchs);
						    break; 
					case pensil:
							if(drag){
								obj.move(curr_p);
								draw(ctx,sketchs);
								break;
							}
							obj.setPoint(curr_p);
							draw(ctx,sketchs);
							break;		    
					default:
						break;	
				} 	
			}
			canvas.onmouseup = function(e){
				if(curr_tool == null || !down || !moves) return;
				down = false;
				moves = false;
				draw(ctx,sketchs);//disegno gli oggetti
				if(drag){ //ripristo lo stato
					drag = false;
					curr_tool = move;
					head = false;
					tail = false;
					obj_over = null; 
				}
				
			}
			//rimuove ultimo oggetto disegnato/spostato
			document.onkeydown = function(e){ 
				if(e == null || sketchs.length == 0) return;
				if((e.wich == 90 || e .keyCode == 90) && e.ctrlKey){
					sketchs.splice(sketchs.length-1,1);
					draw(ctx,sketchs);
				}
			}	
}


		