
var player = {
	type: 'player',
	position:{x: 200, y: 200},
	width: 1.5,
	height: 1.1,


	isGoingLeft: false,

	//movement Attributes
	maxHorizontalVel: 2,
	maxVerticalVel: 4,
	jumpForce: 6,

	moveLeft: false,
	moveRight: false,
	moveUp: false,

	canJump: false,


	score: 0,

	animation:{
		img: null,
		timePerFrame: 1/24,
		currentFrametime: 0,
		frameWidth: 317,
		frameHeight: 214,
		actualX: 0,
		actualY: 0,

		Update: function(deltaTime){
			this.currentFrametime += deltaTime;
			if(this.currentFrametime >= this.timePerFrame){
				this.actualX+=this.frameWidth;
				if(this.actualX > 634){
					this.actualX = 0;
				}
				this.currentFrametime = 0.0;
			}
		},

		Draw: function(ctx){
			ctx.drawImage(this.img, this.actualX, this.actualY, 
				this.frameWidth, this.frameHeight, 
				-this.frameWidth/2, -this.frameHeight/2,
				this.frameWidth, this.frameHeight);
		}
	},

	physicsInfo: {
		density: 1,
		fixedRotation: true,
		linearDamping: 1,
		user_data: player,
		type: b2Body.b2_dynamicBody,
		restitution: 0.0
	},

	body: null,

	Start: function(){
		this.animation.img = playerImg;

		this.body = CreateBox(world, 
			this.position.x / scale, this.position.y / scale,
			this.width, this.height, this.physicsInfo);

	},

	Update: function(deltaTime){
		this.animation.Update(deltaTime);

		if(this.moveRight){
			this.ApplyVelocity(new b2Vec2(1, 0));
			this.moveRight = false;
			this.isGoingLeft = false;
		}

		if(this.moveLeft){
			this.ApplyVelocity(new b2Vec2(-1, 0));
			this.moveLeft = false;
			this.isGoingLeft = true;
		}

		if(this.moveUp){
			this.ApplyVelocity(new b2Vec2(0, this.jumpForce));
			this.moveUp = false;
		}
	},

	Draw: function(ctx){
			var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);
			ctx.save();
			ctx.translate(posX, posY);
			if(this.isGoingLeft){
				ctx.scale(-1, 1);
			}
			this.animation.Draw(ctx);
			ctx.restore();
	},

	ApplyVelocity: function(vel){
		var bodyVel = this.body.GetLinearVelocity();
		bodyVel.Add(vel);

		//Horizontal Movement
		if(Math.abs(bodyVel.x)>this.maxHorizontalVel){
			bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);
		}

		//Vertical Movement
		if(Math.abs(bodyVel.y)>this.maxVerticalVel){
			bodyVel.y = this.maxVerticalVel * bodyVel.y / Math.abs(bodyVel.y);
		}


		this.body.SetLinearVelocity(bodyVel);
	},

	Jump: function(){
		if(Math.abs(this.body.GetLinearVelocity().y) > 0){
			return false;
		}
		this.moveUp = true;
	}


}