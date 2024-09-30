
const statesPlayer = {
    DEFAULT: "Default",
    IDLE: "idle",
    MOVE: "move",
    ATTACK: "attack",
    DAMAGED: "damaged",

}
const playerDirection= {
    RIGTH: "Rigth",
    LEFT: "Left",
    UP: "Up",
    DOWN: "Down",
   
}

class Player {

    
    

    constructor(initialPosition, life, img) {
        this.img = img;
        this.playerAnimations = new Animations(TAnimationPlayers);
        this.position = initialPosition;
        this.rotation = 0;
        this.targetRotation = 0;
        this.direction = playerDirection.DOWN;
        this.state = statesPlayer.IDLE;
        this.speed = 300;
        this.speedRotation = 5;
        this.speedMult = 1.5;
        this.movement = Vector2.Zero();
        this.atacando = false;
        this.danado = false;
        this.life = life;
        this.damagetime =1;
        this.damagetimeAux=0;
        this.fireRate = 1;
        this.fireRateAux = 0;

        this.cannonOffset = {
            x: 10,
            y: 0
        }
        
        this.boundingRadius = 24;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius
        ;

        this.bullets = new BulletPool(this, 10,this.img);
    }

    Update(deltaTime) {
        // movement
        this.movement.Set(0, 0);

        

       
        if (this.fireRateAux >=this.fireRate)
         {
                this.atacando = false
         }
         this.damagetimeAux += deltaTime;

         if ( this.damagetimeAux >= this.damagetime) 
             this.danado =false;
               
         

       


            if (!(this.atacando || this.danado)){
                this.state = statesPlayer.IDLE;
                if (Input.IsKeyPressed(KEY_A) /*|| Input.IsKeyPressed(KEY_LEFT)*/) {
                    this.movement.x -= 1;
                    this.state = statesPlayer.MOVE;
                    this.direction = playerDirection.RIGTH;
                }
                else if (Input.IsKeyPressed(KEY_D) /*|| Input.IsKeyPressed(KEY_RIGHT)*/) {
                    this.movement.x += 1;
                    this.state = statesPlayer.MOVE;
                    this.direction = playerDirection.LEFT;
                }
                else if (Input.IsKeyPressed(KEY_W) /*|| Input.IsKeyPressed(KEY_UP)*/) {
                    this.movement.y -= 1;
                    this.state = statesPlayer.MOVE;
                    this.direction = playerDirection.UP;
                }
                else if (Input.IsKeyPressed(KEY_S) /*|| Input.IsKeyPressed(KEY_DOWN)*/) {
                    this.movement.y += 1;
                    this.state = statesPlayer.MOVE;
                    this.direction = playerDirection.DOWN;
                }
                this.movement.Normalize();
        
                // speed multiply
                if (Input.IsKeyPressed(KEY_LSHIFT)) {
                    this.movement.MultiplyScalar(this.speedMult);
                   
                }
            }

            
        
        

        // apply the movement
        this.position.x += this.movement.x * this.speed * deltaTime;
        this.position.y += this.movement.y * this.speed * deltaTime;

        if (this.position.x < playerMoveLimits.x + this.boundingRadius)
            this.position.x = playerMoveLimits.x + this.boundingRadius;
        if (this.position.x > playerMoveLimits.x + playerMoveLimits.width - this.boundingRadius)
            this.position.x = playerMoveLimits.x + playerMoveLimits.width - this.boundingRadius;
        if (this.position.y < playerMoveLimits.y + this.boundingRadius)
            this.position.y = playerMoveLimits.y + this.boundingRadius;
        if (this.position.y > playerMoveLimits.y + playerMoveLimits.height - this.boundingRadius)
            this.position.y = playerMoveLimits.y + playerMoveLimits.height - this.boundingRadius;

        // shotting
        this.fireRateAux += deltaTime;

        if (Input.IsMousePressed() && (this.fireRateAux >= this.fireRate && !this.danado)) {
            const muzzlePosition = RotatePointAroundPoint(
                {
                    x: this.cannonOffset.x + this.position.x,
                    y: this.cannonOffset.y + this.position.y
                },
                this.position,
                this.rotation - PIH
            );
            const bulletPosition = new Vector2(muzzlePosition.x, muzzlePosition.y);
            this.state = statesPlayer.ATTACK;
            this.direction = playerDirection.UP;
            this.atacando = true;
            const bullet = this.bullets.Activate();
            bullet.position = bulletPosition;
            bullet.rotation = -PIH;
            bullet.speed = 600;
            bullet.damage = 1;
            sfx.lucario.play();
            //this.camera.Shake(0.1, 70, 2);

            this.fireRateAux = 0.0;
        }
        
        this.bullets.Update(deltaTime);

        // bullet scene limits
        this.bullets.bullets.forEach(bullet => {
            if (bullet.active) {
                // check the world bounds
                if (bullet.position.x < playerMoveLimits.x ||
                    bullet.position.x > playerMoveLimits.x + playerMoveLimits.width ||
                    bullet.position.y < playerMoveLimits.y -300 ||
                    bullet.position.y > playerMoveLimits.y + playerMoveLimits.height) {
                    this.bullets.Deactivate(bullet);
                }
            }
        });
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        //ctx.rotate(this.rotation);
        ctx.scale(0.8, 0.8);
     
        this.playerAnimations.ActualAnimation(this.state + this.direction);
  
        ctx.drawImage(this.img,this.playerAnimations.frameX * this.playerAnimations.spriteWidth,this.playerAnimations.frameY* this.playerAnimations.spriteHiegh, this.playerAnimations.spriteWidth, this.playerAnimations.spriteHiegh, -24, -24, 48, 48);
       
        ctx.restore();
       
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        //ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        this.bullets.Draw(ctx);
    }
    
    Damage() {
        this.state = statesPlayer.DAMAGED;
        --this.life;
        this.danado =true;
        this.damagetimeAux = 0.0;
      
    }

}
