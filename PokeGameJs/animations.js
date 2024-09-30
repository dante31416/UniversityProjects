/*Js de animaciones este codigo controla las animaciones de los personajes 
  Los enemigos y el jugador tienen diferentes animaciones cada uno 
  Las imagenes de los enemigos estan en un .JPG el cual si haces una division cada 32 pixeles obtienes cada frame de sus animaciones.
  El jugador le ocurre lo mismo pero con 29 pixeles esto facilita el dibujarlos y poder combiar frame a frame.
  TAnimationEnemies es objeto que tiene el numero que se tiene que multiplicar los pixeles para selecionar cada frame
  ejemplo :  magnetonMove: {
        numberAnimation: 4,
        numberFrames: 4
    }
    para obtener el frame se multiplica 32*4 y como tiene 4 frames se multiplicara por 0,1,2,3 32 para cambiar cada medio segundo
    la eleccion de que el presonaje tenga 29*29 pixeles y los enemigos 32*32 es por que el frame que ocupaba más de cada uno media eso.
*/
var TAnimationEnemies ={
    nidokingMove: {
        numberAnimation: 0,
        numberFrames: 4
    },
    nidokingDeath: {
        numberAnimation: 1,
        numberFrames: 1
    },
    arbokMove: {
        numberAnimation: 2,
        numberFrames: 4
    },
    arbokDeath: {
        numberAnimation: 3,
        numberFrames: 1
    },
    magnemiteMove: {
        numberAnimation: 6,
        numberFrames: 4
    },
    magnemiteDeath: {
        numberAnimation: 7,
        numberFrames: 1
    },
    magnetonMove: {
        numberAnimation: 4,
        numberFrames: 4
    },
    magnetonDeath: {
        numberAnimation: 5,
        numberFrames: 1
    },

}

var TAnimationPlayers ={
    idleDown: {
        numberAnimation: 0,
        numberFrames: 2
    },
    idleUp: {
        numberAnimation: 1,
        numberFrames: 2
    },
    idleRigth: {
        numberAnimation: 2,
        numberFrames: 2
    },
    idleLeft: {
        numberAnimation: 3,
        numberFrames: 2
    },
    moveDown: {
        numberAnimation: 4,
        numberFrames: 2
    },
    moveUp: {
        numberAnimation: 5,
        numberFrames: 2
    },
    moveRigth: {
        numberAnimation: 6,
        numberFrames: 2
    },
    moveLeft: {
        numberAnimation: 7,
        numberFrames: 2
    },
    attackDown: {
        numberAnimation: 8,
        numberFrames: 2
    },
    attackUp: {
        numberAnimation: 9,
        numberFrames: 2
    },
    attackRigth: {
        numberAnimation: 10,
        numberFrames: 2
    },
    attackLeft: {
        numberAnimation: 11,
        numberFrames: 2
    },
    damagedUp: {
        numberAnimation: 13,
        numberFrames: 1
    },
    damagedDown: {
        numberAnimation: 12,
        numberFrames: 1
    },
    damagedRigth: {
        numberAnimation: 14,
        numberFrames: 1
    },
    damagedLeft: {
        numberAnimation: 15,
        numberFrames: 1
    },
    bulletsAnimation:
    {
        numberAnimation: 16,
        numberFrames: 4
    },
}

class Animations {
    constructor(Tanimation) {
        //se innicializa que tipo de animacion se define la Lastanimacion como TAnimationPlayers.idleDown
        // para siempre que un enemigo se spawne cuente como cambio de animacion y se resete la animacion
        this.Tanimation = Tanimation;
        this.Lastanimacion = TAnimationPlayers.idleDown;
        this.frameX = 0;
        this.frameY = 0;
        this.seconds=0;
        this.spriteWidth = 40;
        this.spriteHiegh = 40; 
        if (Tanimation == TAnimationPlayers)
            {
                this.spriteWidth = 29;
                this.spriteHiegh = 29;
            }
        if (Tanimation == TAnimationEnemies)
            {
                this.spriteWidth = 32;
                this.spriteHiegh = 32;
            }
        
        this.numeroDeCambios=0;
      
    }
   
    ActualAnimation(stateAnimation)
    {   // se comprueba si a cambiado la animacion en caso de no ser asi segir mostrar el siguiente frame si resetear el numero de frames y de numero de cambios 
        let nuevaAnimacion = this.Tanimation[stateAnimation];
        if (this.Lastanimacion != nuevaAnimacion )
            {
                this.numeroDeCambios=0;
                this.frameX = 0;
                this.Lastanimacion = nuevaAnimacion;
                this.AuxChangeFrame(stateAnimation);
            }
        /* changeFrame se cambia en el code para que el cambio de frames vaya acompasado todos por que probe que cada uno fuese con su contador 
        de tiempo y ademas de consumir mas memoria por que cada uno tenia su timer, se veia peor a mi gusto.
        */
        if (changeFrame)
        {
            this.AuxChangeFrame(stateAnimation);  
        }
    }
   // funcion auxiliar para ahorar lineas de codigo setea las posiciones de los frames y aumenta en 1 el numero de cambios de frames
    AuxChangeFrame(stateAnimation)
    {
    this.frameY = this.Tanimation[stateAnimation].numberAnimation;
    this.numeroDeCambios++;
    this.frameX = (this.numeroDeCambios) % this.Tanimation[stateAnimation].numberFrames;//intSeconds % this.Tanimation[stateAnimation].numberFrames;

    }   

}