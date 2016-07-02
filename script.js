var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2ContactListener = Box2D.Dynamics.b2ContactListener;

var ishipbase, iturret, itractorbeam, istar, ibeam, isplitter, iheavy, igatling, iflamet, imissile, iufo, iufoeye, iaim, ihealthbar, iboxborder, iboxcorner;
var fxbeam, fxheavy, fxgatling, fxspark, fxfire, fxmissile, fxhealth, fxcoin;
var Boxes;
var c, ctx;
var mouse;
var counters;
var devtools = {degbug:true,imgbox:false};
var version = "0.9.5";

function init(){
	loadAssets();
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
	counters = [];
	Boxes = new BoxManager();
	Boxes.q = [];
	Boxes.rrng = {min:0,max:0};
	Boxes.game = new Game();
	Boxes.game.init();
	Boxes.q.push(Boxes.game);


	var tempbox = {rl:1,box:new DBox(250,250,100,100),update:function(){},render:function(){
		this.box.renderprep();
		dynamicdraw(ishipbase,this.box.w/2,this.box.h/2,Math.PI/4,1,1);
		//ctx.drawImage(ishipbase,0,0);
		this.box.renderborders();
	}};
	tempbox.box.edit = true;
	Boxes.tempbox = tempbox;
	//Boxes.q.push(tempbox);


	document.addEventListener('keydown',function(e){
		if (e.keyCode==32)	e.preventDefault();
		for (var i = 0; i < Boxes.q.length; i++)
			if (Boxes.q[i].keylisten)
				Boxes.q[i].keydown(e.keyCode);
	});
	document.addEventListener('keyup',function(e){
		for (var i = 0; i < Boxes.q.length; i++)
			if (Boxes.q[i].keylisten)
				Boxes.q[i].keyup(e.keyCode);
	});

	document.getElementById("version").innerHTML = "Version:<br>"+version+"<br>";
	document.getElementById("controls").innerHTML = 
		"Controls:<br>"+
		"W, A, S, D to move<br>"+
		"Mouse to aim<br>"+
		"Spacebar to shoot<br>"+
	//	"Switching Weapons:<br>"+
	//	"1 - Beam<br>"+
	//	"2 - Splitter<br>"+
	//	"3 - Heavy<br>"+
	//	"4 - Gatling<br>"+
	//	"5 - Flamethrower<br>"+
	//	"Enter thesupersecretcode<br>to activate Omega weapons!<br>"+
		"+ - to zoom in and out";

	//window.onresize = function(){resizewin();}
	//window.onmousedown = checkbuttons;
	//window.onmouseup = function(){player.lclick = false;}

	document.getElementById("info").innerHTML+="<div id=\"zoom\">1x</div>";
	mouse = {	x: 0, y: 0,
		getscreen : function(){return {x:this.x,y:this.y};}
	};
	var mousemove = function(evt){
		var rect = c.getBoundingClientRect();
		mouse.x = evt.clientX - rect.left;
		mouse.y = evt.clientY - rect.top;
	}
	document.getElementById("canvas").addEventListener('mousemove',mousemove);
	document.getElementById("canvas").addEventListener('drag',mousemove);
	requestAnimationFrame(gameloop);
}
function gameloop(){
	Boxes.update();
	Boxes.render();
	requestAnimationFrame(gameloop);
}
function BoxManager(){
	this.q = [];
	this.rrng = {min:0,max:0};
	this.update = function(){
		for (var i = 0; i < counters.length; i++)
			counters[i].update();
		for (var i = 0; i < this.q.length; i++){
			this.q[i].update();
			if (this.q[i].rl < this.rrng.min)
				this.rrng.min = this.q[i].rl;
			if (this.q[i].rl > this.rrng.max)
				this.rrng.max = this.q[i].rl;}}
	this.render = function(){
		for (var j = this.rrng.min; j <= this.rrng.max; j++)
			for (var i = 0; i < this.q.length; i++)
				if (this.q[i].rl == j)
					this.q[i].render();}
}
function loadAssets(){
	ishipbase	= new Image();
	iturret		= new Image();
	itractorbeam	= new Image();
	istar		= new Image();
	ibeam		= new Image();
	isplitter	= new Image();
	iheavy		= new Image();
	igatling	= new Image();
	iflamet		= new Image();
	imissile	= new Image();
	iufo		= new Image();
	iufoeye		= new Image();
	iaim		= new Image();
	ihealthbar	= new Image();
	iboxborder	= new Image();
	iboxcorner	= new Image();

	ishipbase.src	= "assets/ShipBase.png";
	iturret.src	= "assets/Turret.png";
	itractorbeam.src= "assets/TractorBeam.png";
	istar.src	= "assets/Star.png";
	ibeam.src	= "assets/Beam.png";
	isplitter.src	= "assets/Splitter.png";
	iheavy.src	= "assets/Heavy.png";
	igatling.src	= "assets/Gatling.png";
	iflamet.src	= "assets/FlameT.png";
	imissile.src	= "assets/Missile.png";
	iufo.src	= "assets/UFO.png";
	iufoeye.src	= "assets/UFOEye.png";
	iaim.src	= "assets/Target.png";
	ihealthbar.src	= "assets/HealthBar.png";
	iboxborder.src	= "assets/BoxBorder.png";
	iboxcorner.src	= "assets/BoxCorner.png";

	fxbeam		= new Howl({urls: ['assets/BeamFx.wav']});
	fxheavy		= new Howl({urls: ['assets/HeavyFx.wav']});
	fxgatling	= new Howl({urls: ['assets/GatlingFx.wav']});
	fxspark		= new Howl({urls: ['assets/SparkFx.wav']});
	fxfire		= new Howl({urls: ['assets/FireFx.wav']});
	fxfire.volume(.1);
	fxmissile	= new Howl({urls: ['assets/MissileFx.wav']});
	fxhealth	= new Howl({urls: ['assets/HealthFx.wav']});
	fxcoin		= new Howl({urls: ['assets/CoinFx.wav']});
}
function DBox(x, y, width, height){
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.edit = false;
	this.borders = true;
	this.transparent = false;
	this.iedge = iboxborder;
	this.icorner = iboxcorner;
	this.set = function(sets){
		for(var k in sets)
			this[k] = sets[k];
	}
	this.renderprep = function(){
		ctx.save()
		ctx.translate(this.x,this.y);
		if (!this.transparent)
			ctx.clearRect(0,0,this.w,this.h);
		ctx.save();
		ctx.beginPath();
		ctx.rect(0,0,this.w,this.h);
		ctx.clip();
	}
	this.renderborders = function(){
		ctx.restore();
		if (!this.borders)
			return;
		var x1, x2, y1, y2, sx, sy, sw, ah, av, de, dc;

		x1 = 0;
		x2 = this.w;
		y1 = 0;
		y2 = this.h;
		de = this.iedge.height/2;
		dc = this.icorner.height/2;
		sx = this.w/this.iedge.width;
		sy = this.h/this.iedge.width;
		sw = 8/this.iedge.height;
		ah = 0;
		av = Math.PI/2;

		dynamicdraw(this.iedge,x1,y1,ah,sx,sw,0,de,true);
		dynamicdraw(this.iedge,x1,y2,ah,sx,sw,0,de,true);
		dynamicdraw(this.iedge,x1,y1,av,sy,sw,0,de,true);
		dynamicdraw(this.iedge,x2,y1,av,sy,sw,0,de,true);

		var before = devtools.imgbox;
		if (this.edit)
			devtools.imgbox = true;
		dynamicdraw(this.icorner,x1,y1,0,1,1);
		dynamicdraw(this.icorner,x1,y2,0,1,1);
		dynamicdraw(this.icorner,x2,y1,0,1,1);
		dynamicdraw(this.icorner,x2,y2,0,1,1);
		devtools.imgbox = before;
		ctx.restore();
	}
}
function dynamicdraw(img, x, y, a, scalx, scaly, cx, cy, offcent){
	if (!offcent){
		cx = img.width/2;
		cy = img.height/2;}
	cx*=scalx;
	cy*=scaly;

	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(a);
	ctx.translate(-cx,-cy);
	ctx.drawImage(img,0,0,img.width*scalx,img.height*scaly);
	if (devtools.imgbox){ctx.fillStyle = "white";ctx.globalAlpha = .3;
		ctx.fillRect(0,0,img.width*scalx,img.height*scaly);}
	ctx.restore();
}
function Game(){
	this.keylisten = true;
	var box;
	var gos, stars;
	var world;
	var player;
	var wmouse;
	var cam;
	var scale = 32, viewscale = 1, viewslot = 4;
	var rrng = {min:0,max:0};
	this.rl = 0;
	this.init = function(){
		box = new DBox(0,0,c.width-250,c.height-250);
		gos = [];
		dostars();
		world = new b2World(new b2Vec2(0,0),false);
		activatedebug();
		cam = new Camera();
		player = new Player();
		for (var i = 0; i < 100; i++)
			stars.push(new Star());
	}
	this.update = function(){
		wmouse = s2w(mouse);
		world.Step(1/60,6,2);
		for (var i = 0; i < stars.length; i++)
			stars[i].update();
		for (var i = 0; i < gos.length; i++){
			if(gos[i].rl<rrng.min)
				rrng.min = gos[i].rl;
			if(gos[i].rl>rrng.max)
				rrng.max = gos[i].rl;
			gos[i].update();}
	}
	this.render = function(){
		box.renderprep();

		cam.step();
		ctx.scale(viewscale,viewscale);
		world.DrawDebugData();
		for (var i = 0; i < stars.length; i++)
			stars[i].render();
		for (var j = rrng.min; j <= rrng.max; j++)
			for (var i = 0; i < gos.length; i++)
				if (gos[i].rl==j)
					gos[i].render();
		box.renderborders();
	}
	this.keydown = function(id){
		var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		var letter = "";
		if (id >= 65 && id <= 90)
			letter = alphabet[id-65];
		switch(letter){
			case "":	/*not letter*/		break;
			case "w":	player.m.w = true;	break;
			case "a":	player.m.a = true;	break;
			case "s":	player.m.s = true;	break;
			case "d":	player.m.d = true;	break;
		}
		switch(id){
			case 32:	player.tryshoot=true;	break;
			case 187:	zoom(1);		break;
			case 189:	zoom(-1);		break;
		}
	}
	this.keyup = function(id){
		var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		var letter = "";
		if (id >= 65 && id <= 90)
			letter = alphabet[id-65];
		switch(letter){
			case "":	/*not letter*/		break;
			case "w":	player.m.w = false;	break;
			case "a":	player.m.a = false;	break;
			case "s":	player.m.s = false;	break;
			case "d":	player.m.d = false;	break;
		}
		switch(id){
			case 32:	player.tryshoot=false;	break;
		}
	}
	function dostars(){
		stars = [];
		for (var i = 0; i < box.w*box.h/scale/scale/viewscale/3; i++)
			stars.push(new Star());
	}
	function zoom(dir){
		dir = Math.sign(dir);
		var sets = [.25,.35,.5,.75,1,1.25,1.75,2.25,3,3.5,4.5];
		if (viewslot+dir >= 0 && viewslot+dir <= 10){
			viewslot+=dir;
			viewscale = sets[viewslot];
			document.getElementById("zoom").innerHTML = "Zoom: "+viewscale+"x";
			dostars();
		}
	}
	function worlddraw(img, x, y, a, sx, sy, cx, cy, oc){
		dynamicdraw(img,x*scale,y*scale,a,sx,sy,cx,cy,oc);
	}
	function s2w(m){
		return new b2Vec2((m.x-cam.pos.x)/viewscale/scale,(m.y-cam.pos.y)/viewscale/scale);
	}
	function Camera(){
		this.pos = {
			x : 0,
			y : 0
		};
		this.step = function() {
			var v = player.body.GetPosition();
			this.pos.x = -v.x * scale * viewscale + box.w/2;
			this.pos.y = -v.y * scale * viewscale + box.h/2;
			ctx.translate(this.pos.x, this.pos.y);
		};
	}
	function activatedebug(){
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(ctx);
		debugDraw.SetDrawScale(scale);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	}
	function squarebody(size,x,y){
		var fixDef = new b2FixtureDef;
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;	
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(size, size);
		fixDef.isSensor = true;
		bodyDef.position.Set(x, y);
		var body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);
		body.SetFixedRotation(true);
		return body;
	}
	function circlebody(size,x,y){
		var fixDef = new b2FixtureDef;
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		fixDef.shape = new b2CircleShape(size);
		fixDef.isSensor = true;
		bodyDef.position.Set(x, y);
		var body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);
		body.SetFixedRotation(true);
		return body;	
	}
	function Player(){
		this.categ = "play";
		this.maxhealth = 100;
		this.health = this.maxhealth;
		this.body = squarebody(1,0,0,true);
		this.rl = 0;
		var speed = 20;
		var accel = 2;
		this.tryshoot = false;
		this.m = {w : false, a : false, s : false, d : false};
		this.p = new b2Vec2(0,0);
		this.aim = new b2Vec2(0,1);
		this.angle = Math.atan2(this.aim.x,this.aim.y);

		var weapon = new wBeam();

		//this.arsenal = [new pBeam(),new pSplitter(),new pHeavy(),new pGatling(),new pFlameT()];//,new pMissile()];
		//this.curwep = this.arsenal[0];
		//localStorage.setItem("playerweapon",""+1);
		this.body.SetUserData(this);
		
		gos.push(this);
		//this.shoot = function(){
		//	this.curwep.spawn(this.getinfo());
		//	this.curwep.rate.consume();
		//}
		//this.switchwep = function(wep){
		//	this.curwep.rate.pause();
		//	wep--;
		//	if (wep < 0 || wep > this.arsenal.length - 1)
		//		return;
		//	localStorage.setItem("playerweapon",""+(wep+1));
		//	this.curwep = this.arsenal[wep];
		//	this.curwep.rate.unpause();
		//}
		this.getinfo = function(){
			return {p : this.p, a : this.aim, s : "p"};
		}
		//this.collide = function(other){
		//	switch(other.categ){
		//		case "proj":
		//			if (other.source !== "p")
		//				this.health-=other.damage;
		//			break;
		//		case "enem":
		//			//this.body damage?
		//			break;
		//	}
		//}
		this.update = function(){
			if (this.tryshoot)
				weapon.tryshoot(this.getinfo());
			//this.tryshoot = this.lclick||this.space;
			//if (this.tryshoot&&this.curwep.rate.ready)
			//	this.shoot();

			this.p = this.body.GetPosition();

			if ( this.m.w && !this.m.s)	this.body.ApplyImpulse(new b2Vec2(	 0,	  -accel	),	this.body.GetLocalCenter());
			if (!this.m.w &&  this.m.s)	this.body.ApplyImpulse(new b2Vec2(	 0,	   accel	),	this.body.GetLocalCenter());
			if ( this.m.a && !this.m.d)	this.body.ApplyImpulse(new b2Vec2( -accel, 		0	),	this.body.GetLocalCenter());
			if (!this.m.a &&  this.m.d)	this.body.ApplyImpulse(new b2Vec2(  accel,	 	0	),	this.body.GetLocalCenter());

			if (this.body.GetLinearVelocity().Length() > speed){
				var v = this.body.GetLinearVelocity();
				v.Normalize();
				v.Multiply(speed);
				this.body.SetLinearVelocity(v);
			}
			this.aim = new b2Vec2(wmouse.x-this.p.x,wmouse.y-this.p.y);
			this.angle = Math.atan2(this.aim.y,this.aim.x);		
		}
		this.render = function(){
			worlddraw(ishipbase,this.p.x,this.p.y,0,1,1);
			worlddraw(iturret,this.p.x,this.p.y,this.angle+Math.PI/2,1,1);
			//worlddraw(iufo,this.p.x,this.p.y,0,1,1);
			//worlddraw(iufoeye,this.p.x,this.p.y,this.angle,1,1);
			if (this.m.w)	worlddraw(itractorbeam,this.p.x,this.p.y,Math.PI/-2,1,1);
			if (this.m.a)	worlddraw(itractorbeam,this.p.x,this.p.y,Math.PI,1,1);
			if (this.m.s)	worlddraw(itractorbeam,this.p.x,this.p.y,Math.PI/2,1,1);
			if (this.m.d)	worlddraw(itractorbeam,this.p.x,this.p.y,0,1,1);

			if (this.health>0)
				worlddraw(ihealthbar,this.p.x,this.p.y+1.4,0,this.health/this.maxhealth,1);
			//worlddraw(itractorbeam,this.p.x,this.p.y,Math.atan2(this.body.GetLinearVelocity().y,this.body.GetLinearVelocity().x)-Math.PI/2,1,1);
		}
		//this.body = {GetPosition:function(){return new b2Vec2(0,0);}}
	}
function Counter(len){
	this.len = len;
	this.count = 0;
	this.incr = 1;
	this.loop = false;
	this.running = false;
	this.ready = false;
	this.inprog = false;
	this.progress = 0;
	this.paused = false;
	counters.push(this);
	this.update = function(){
		if (this.paused) return;
		if (this.count < this.len && this.running){
			this.ready = false;
			this.count+=this.incr;
			this.inprog = true;
		}
		else {this.inprog = false;this.ready = true;}
		this.progress = this.count/this.len;
	}
	this.pause = function(){
		this.paused = true;
	}
	this.unpause = function(){
		this.paused = false;
	}
	this.start = function(){
		this.running = true;
	}
	this.reset = function(){
		this.count = 0;
	}
	this.makeready = function(){
		this.count = this.len;
		this.start();
	}
	this.consume = function(){
		this.ready = false;
		this.reset();
		if (!this.loop)
			this.running = false;
	}
	this.dispose = function(){
		counters.splice(counters.indexOf(this),1);
	}
}
function wBeam(){
	var rate = new Counter(20);
	rate.loop = true;
	rate.makeready();
	this.tryshoot = function(i){
		if (rate.ready){
			new pBeam().spawn(i);
			fxbeam.play();
			rate.consume();
		}
	}
}
function pBeam(){
	this.categ = "proj";
	var img = ibeam;
	var body;
	var source;
	this.damage = 8;
	var range = 70;
	var dt = 0;
	var speed = 35;
	var pierce = 2;
	this.rl = -1;
	this.spawn = function(i){
		source = i.s;
		body = circlebody(img.width/4/scale,i.p.x,i.p.y);
		i.a.Normalize();
		i.a.Multiply(speed);
		body.SetLinearVelocity(i.a);
		body.SetUserData(this);
		gos.push(this);
	}
	this.update = function(){
		if (pierce < 0)
			lastpierce.call(this);
		dt+=body.GetLinearVelocity().Length()/60;
		if (dt > range)
			outofrange.call(this);
	}
	this.render = function(){
		var b = body.GetPosition(),
			v = body.GetLinearVelocity();
		worlddraw(img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,.5,.5,img.width/2,img.width/2,true);
	}
	this.collide = function(other){
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					this.pierce--;
				break;
			case "enem":
				if (this.source !== "e")
					this.pierce--;
				break;
		}
	}
	function lastpierce(){this.dispose();}
	function outofrange(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (typeof body != 'undefined')
			world.DestroyBody(body);
	}
}




/*
function pBeam(){
	this.categ = "proj";
	this.img = ibeam;
	this.rate = new Counter(20);
	this.rate.loop = true;
	this.rate.makeready();
	this.damage = 8;
	this.range = 70;
	this.dt = 0;
	this.speed = 35;
	this.pierce = 2;
	this.rl = -1;
	/*
	if (omega){
		this.rate = new Counter(10);
		this.rate.loop = true;
		this.rate.makeready();
		this.damage = 10;
		this.range = 150;
		this.dt = 0;
		this.speed = 50;
		this.pierce = 5;
	}*
	this.spawn = function(info){
		/*
		if (omega){
			var p = [new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),
				new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam(),new pBeam()];
			for (var i = 0; i < p.length; i++){
				var info2 = {p:info.p,a:info.a,s:info.s};
				p[i].source = info2.s;
				var t = Math.atan2(info2.a.y,info2.a.x);
				t+=(i-p.length/2)*Math.PI/4/p.length;
				info2.a = new b2Vec2(Math.cos(t),Math.sin(t));
				p[i].body = circlebody(p[i].img.width/scale/4,info2.p.x+info2.a.x,info2.p.y+info2.a.y,true);
				info2.a.Multiply(p[i].speed);
				p[i].body.SetLinearVelocity(info2.a);
				p[i].body.SetUserData(p[i]);
				gos.push(p[i]);
				t = 0;t0=0;
			}
			if (!mute) fxbeam.play();
		}*
		//else{
			var p = new pBeam();
			p.source = info.s;
			info.a.Normalize();
			p.body = circlebody(p.img.width/scale/4,info.p.x+info.a.x,info.p.y+info.a.y,true);
			info.a.Multiply(p.speed);
			p.body.SetLinearVelocity(info.a);
			p.body.SetUserData(p);
			if (!mute) fxbeam.play();
			gos.push(p);
		//}
	}
	this.update = function(){
		if (this.pierce < 0)
			this.lastpierce();
		this.dt+=this.body.GetLinearVelocity().Length()/60;
		if (this.dt > this.range)
			this.outofrange();
		
	}
	this.render = function(){
		var b = this.body.GetPosition(),
			v = this.body.GetLinearVelocity();
		dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,.5,.5,this.img.width/2,this.img.width/2,true);
	}
	this.collide = function(other){
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					this.pierce--;
				break;
			case "enem":
				if (this.source !== "e")
					this.pierce--;
				break;
		}
	}
	this.lastpierce = function(){this.dispose();}
	this.outofrange = function(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (this.body)
		world.DestroyBody(this.body);
		this.rate.dispose();
	}
}
function pSplitter(){
	this.categ = "proj";
	this.img = isplitter;
	this.rate = new Counter(35);
	this.rate.loop = true;
	this.rate.makeready();
	this.damage = 2;
	this.range = 65;
	this.dt = 0;
	this.speed = 35;
	this.maxbranches = 3;
	this.branches = this.maxbranches+1;
	this.children = 6;
	this.nburst = 0;
	this.pierce = 0;
	this.rl = -1;
	if (omega){
		this.rate = new Counter(15);
		this.rate.loop = true;
		this.rate.makeready();
		this.damage = 4;
		this.range = 100;
		this.dt = 0;
		this.speed = 50;
		this.maxbranches = 5;
		this.branches = this.maxbranches+1;
		this.children = 25;
		this.pierce = 3;
	}
	this.spawn = function(info){
		var p = new pSplitter();
		p.source = info.s;
		p.branches = this.branches-1;
		if (p.branches == this.maxbranches && !mute)	fxbeam.play();
		info.a.Normalize();
		p.body = circlebody(p.img.width/scale/4,info.p.x+info.a.x*3,info.p.y+info.a.y*3,true);
		info.a.Multiply(p.speed);
		p.body.SetLinearVelocity(info.a);
		p.body.SetUserData(p);
		gos.push(p);
	}
	this.update = function(){
		if (this.nburst > 0)
			this.burst(this.nburst);
		if (this.pierce < 0)
			this.lastpierce();
		this.dt+=this.body.GetLinearVelocity().Length()/60;
		if (this.dt > this.range)
			this.outofrange();
		
	}
	this.render = function(){
		var b = this.body.GetPosition(),
			v = this.body.GetLinearVelocity();
		var scl = .5;
		if (this.branches==this.maxbranches) scl = 1;
		dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,scl,scl,this.img.width/2,this.img.width/2,true);
	}
	this.burst = function(count){
		if (this.branches > 0){
			if (!mute) fxspark.play();
			for (var i = 0; i < count; i++){
				var t = ((Math.random()-.5)+i)*2*Math.PI/count;
				this.spawn({p : this.body.GetPosition(), a : new b2Vec2(Math.cos(t),Math.sin(t)), s : this.source});
			}
			if (!omega)
			this.range*=.6;
			for (var i = 0; i < count; i++){
				var t = ((Math.random()-.5)+i)*2*Math.PI/count;
				this.spawn({p : this.body.GetPosition(), a : new b2Vec2(Math.cos(t),Math.sin(t)), s : this.source});
			}
		}
		this.nburst = 0;
	}
	this.collide = function(other){
		var hit = false;
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					hit = true;
				break;
			case "enem":
				if (this.source !== "e")
					hit = true;
				break;
		}
		if (hit){
			this.pierce--;
			if (this.pierce < 0)
				this.nburst = this.children;
			else 	this.nburst = this.children/3;
		}
	}
	this.lastpierce = function(){this.dispose();}
	this.outofrange = function(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (this.body)
		world.DestroyBody(this.body);
		this.rate.dispose();
	}
}
function pHeavy(){
	this.categ = "proj";
	this.img = iheavy;
	this.rate = new Counter(85);
	this.rate.loop = true;
	this.rate.makeready();
	this.damage = 15;
	this.range = 45;
	this.dt = 0;
	this.speed = 20;
	this.pierce = 3;
	this.rl = -1;
	if (omega){
		this.rate = new Counter(45);
		this.rate.loop = true;
		this.rate.makeready();
		this.range = 150/.7;
		this.dt = 0;
		this.speed = 45;
		this.pierce = 15;
	}
	this.spawn = function(info){
		var p = new pHeavy();
		p.source = info.s;
		info.a.Normalize();
		info.a.Multiply(4);
		if (omega){
			p.body = circlebody(p.img.width/scale*8,info.p.x+info.a.x,info.p.y+info.a.y,true);
			info.a.Multiply(p.speed/4);
			p.body.SetLinearVelocity(info.a);
			p.body.SetUserData(p);
		}
		else {
			p.body = circlebody(p.img.width/scale/1.25,info.p.x+info.a.x,info.p.y+info.a.y,true);
			info.a.Multiply(p.speed/4);
			p.body.SetLinearVelocity(info.a);
			p.body.SetUserData(p);
		}
		if (!mute) fxheavy.play();
		gos.push(p);
	}
	this.update = function(){
		if (this.pierce < 0)
			this.lastpierce();
		this.dt+=this.body.GetLinearVelocity().Length()/60;
		if (this.dt > this.range)
			this.outofrange();
	}
	this.render = function(){
		var b = this.body.GetPosition(),
			v = this.body.GetLinearVelocity();
		if (omega)
			dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,7,7,this.img.width/2,this.img.width/2,true);
		else dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,1.5,1.5,this.img.width/2,this.img.width/2,true);
	}
	this.collide = function(other){
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					this.pierce--;
				break;
			case "enem":
				if (this.source !== "e")
					this.pierce--;
				break;
		}
	}
	this.lastpierce = function(){this.dispose();}
	this.outofrange = function(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (this.body)
		world.DestroyBody(this.body);
		this.rate.dispose();
	}
}
function pGatling(){
	this.categ = "proj";
	this.img = igatling;
	this.rate = new Counter(2);
	this.rate.loop = true;
	this.rate.makeready();
	this.damage = 2;
	this.range = 60;
	this.dt = 0;
	this.speed = 35;
	this.pierce = 0;
	this.rl = -1;
	if (omega){
		this.rate = new Counter(1);
		this.rate.loop = true;
		this.rate.makeready();
		this.range = 100;
		this.damage = 5;
		this.dt = 0;
		this.speed = 55;
		this.pierce = 5;
	}
	this.spawn = function(info){
		if (!mute) fxgatling.play();
		var p = [new pGatling(),new pGatling()];
		if (omega) p = [new pGatling(),new pGatling(),new pGatling(),new pGatling(),new pGatling(),new pGatling(),
			new pGatling(),new pGatling(),new pGatling(),new pGatling()];
		for (var i = 0; i < p.length; i++){
			var info2 = info;
			p[i].source = info.s;
			var t = Math.atan2(info.a.y,info.a.x);
			t+=(Math.random()-.5)*Math.PI/180*20;
			info2.a = new b2Vec2(Math.cos(t),Math.sin(t));
			info2.a.Multiply(Math.random()/2+.75);
			if (omega)
			info2.a.Multiply(Math.random()/2+.75);
			p[i].body = circlebody(p[i].img.width/scale/4,info2.p.x+info2.a.x,info2.p.y+info2.a.y,true);
			info2.a.Normalize();
			info2.a.Multiply(p[i].speed);
			p[i].body.SetLinearVelocity(info2.a);
			p[i].body.SetUserData(p[i]);
			gos.push(p[i]);
		}
	}
	this.update = function(){
		if (this.pierce < 0)
			this.lastpierce();
		this.dt+=this.body.GetLinearVelocity().Length()/60;
		if (this.dt > this.range)
			this.outofrange();
	}
	this.render = function(){
		var b = this.body.GetPosition(),
			v = this.body.GetLinearVelocity();
		dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,1,1,this.img.width/2,this.img.width/2,true);
	}
	this.collide = function(other){
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					this.pierce--;
				break;
			case "enem":
				if (this.source !== "e")
					this.pierce--;
				break;
		}
	}
	this.lastpierce = function(){this.dispose();}
	this.outofrange = function(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (this.body)
		world.DestroyBody(this.body);
		this.rate.dispose();
	}
}
function pFlameT(){
	this.categ = "proj";
	this.img = iflamet;
	this.rate = new Counter(1);
	this.rate.loop = true;
	this.rate.makeready();
	this.damage = 1;
	this.range = 20;
	this.dt = 0;
	this.speed = 40;
	this.pierce = 1;
	this.rl = -1;
	if (omega){
		this.rate.dispose();
		this.rate = new Counter(40);
		this.rate.loop = true;
		this.rate.makeready();
		this.range = 45;
		this.damage = 5;
		this.dt = 0;
		this.speed = 65;
		this.pierce = 7;
	}
	this.spawn = function(info){
		if (!mute) fxfire.play();
		if (omega){
			for (var j = 0; j < 2; j++)
			for (var i = 0; i < Math.PI*2; i+=Math.PI/90){
				var p = new pFlameT();
				var info2 = info;
				p.source = info2.s;
				var t = i+(Math.random()-.5)*Math.PI/90;
				info2.a = new b2Vec2(Math.cos(t),Math.sin(t));
				info2.a.Multiply(Math.random()/2+2.75+j*1.5);
				p.body = circlebody(p.img.width/scale*4,info2.p.x+info2.a.x,info2.p.y+info2.a.y,true);
				info2.a.Normalize();
				info2.a.Multiply(p.speed);
				p.body.SetLinearVelocity(info2.a);
				p.body.SetUserData(p);
				gos.push(p);
			}
			return;
		}
		var p = [new pFlameT(),new pFlameT(),new pFlameT(),new pFlameT()];
		for (var i = 0; i < p.length; i++){
			var info2 = info;
			p[i].source = info.s;
			var t = Math.atan2(info.a.y,info.a.x);
			t+=(Math.random()-.5)*Math.PI/180*10;
			info2.a = new b2Vec2(Math.cos(t),Math.sin(t));
			info2.a.Multiply(Math.random()/2+.75);
			p[i].body = circlebody(p[i].img.width/scale/4,info2.p.x+info2.a.x,info2.p.y+info2.a.y,true);
			info2.a.Normalize();
			info2.a.Multiply(p[i].speed);
			p[i].body.SetLinearVelocity(info2.a);
			p[i].body.SetUserData(p[i]);
			gos.push(p[i]);
		}
	}
	this.update = function(){
		if (this.pierce < 0)
			this.lastpierce();
		this.dt+=this.body.GetLinearVelocity().Length()/60;
		if (this.dt > this.range)
			this.outofrange();
	}
	this.render = function(){
		var b = this.body.GetPosition(),
			v = this.body.GetLinearVelocity();
		dynamicdraw(this.img,b.x,b.y,Math.atan2(v.y,v.x)+Math.PI/2,1,1,this.img.width/2,this.img.width/2,true);
	}
	this.collide = function(other){
		switch(other.categ){
			case "play":
				if (this.source !== "p")
					this.pierce--;
				break;
			case "enem":
				if (this.source !== "e")
					this.pierce--;
				break;
		}
	}
	this.lastpierce = function(){this.dispose();}
	this.outofrange = function(){this.dispose();}
	this.dispose = function(){
		gos.splice(gos.indexOf(this),1);
		if (this.body)
		world.DestroyBody(this.body);
		this.rate.dispose();
	}
}*/
	function Star(){
		this.rl = -2;
		this.p = randomonscreen();
		this.scale = Math.random()*1.5+.2;
		this.update = function(){
			var n = player.body.GetLinearVelocity().Copy();
			//var n = new b2Vec2(1,1);
			n.Multiply((1.5*(this.scale)-1)/60);
			this.p.Subtract(n);
			this.keeponscreen();
		}
		this.render = function(){
			ctx.drawImage(istar,this.p.x*scale,this.p.y*scale,this.scale*.75*istar.width,this.scale*.75*istar.height);
		}
		function randomonscreen(){
			return new b2Vec2(((Math.random()-.5)*box.w)/scale/viewscale, ((Math.random()-.5)*box.h)/scale/viewscale);
		}
		this.keeponscreen = function(){
			var b = player.body.GetPosition(),
			w = box.w/scale/viewscale,
			h = box.h/scale/viewscale,
			d = istar.height/2*this.scale*.75/scale,
			x = this.p.x+d,
			y = this.p.y+d;

			if (x < b.x-w/2)	this.p.x+=w;
			else if (x > b.x+w/2)	this.p.x-=w;
			if (y < b.y-h/2)	this.p.y+=h;
			else if (y > b.y+h/2)	this.p.y-=h;
		}
	}
}
