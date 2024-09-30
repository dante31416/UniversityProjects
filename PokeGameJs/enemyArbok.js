

class EnemyArbok extends Enemy {
    constructor(img, initialPosition, life) {
        super(img, initialPosition, life);
        this.tipo = typesEnemy.ARBOK;
        
        
        this.Xdirection = RandomBetweenInt(-1, 1);
        if (this.Xdirection ==0)
            this.Xdirection = 1;
       
        
    }

    Update(deltaTime) {
        
        this.position.y +=  this.speed * deltaTime;
        
        if (this.position.x < this.SpawnPoint.x - 50 || this.position.x > this.SpawnPoint.x + 50)
            this.Xdirection *= -1;
        this.position.x +=  this.Xdirection*this.speed * deltaTime;
        
    }
   

}
