var rayonMax = 0;
var points = 20;
var tab_rayon = [];
var c = 0.1;
var circleSize = 40;
var numberCircle = 35;
var tab_splash = [];
var positionX = 0;
var positionY = 0;

var largeur = 0;
var hauteur = 0;
var balles = [];


var max_balles = 4000;
var n_balles_plus = 1; // nouvelles balles à chaque rafraichissement
var n_balles_per = 1;  // nombre de frames avant rafraichissement


function setup() {
    createCanvas(windowWidth, windowHeight );
    rectMode(CENTER);
    largeur = windowWidth;
    hauteur = windowHeight;

    // background(255,255,120);
    rayonMax = windowHeight - 450;
    positionX = -rayonMax+25;
    positionY = 120;

    // on commence par une particule fixe au milieu du canvas
    var premiere_balle = new Particle();
    premiere_balle.pos = createVector(largeur/2,
                                      hauteur/2);
    premiere_balle.vit = createVector(0, 0);
    balles.push(premiere_balle);

    for(var k=0; k<numberCircle; k++){
        if (positionX < rayonMax){
            tab_splash.push(new Splash(positionX,positionY));
            positionX += 30;
            positionY -= 8;
        }

    }

    for (var i = 0 ; i < points; i++){
        var rayon = windowHeight - 450;
        if( i % 2 ==0){
            rayon = random(rayon - 40, rayon );
        }
        var curves = {
            rayon : rayon,
            v : random(1.09, 1.1),
            c : 0.1
        }

        tab_rayon.push(curves);


    }




}

function draw() {
    push();
    translate (width/2, height/2);

    var angle = TWO_PI/points;

    fill (35, 163, 147);
    noStroke();
    beginShape();



    for (var i = 0 ; i < points; i++){

        if ( tab_rayon[i].c < 1){
            tab_rayon[i].c *= tab_rayon[i].v;
        }

        var x = tab_rayon[i].rayon*tab_rayon[i].c * cos(angle*i);


        var y = tab_rayon[i].rayon*tab_rayon[i].c * sin(angle*i);

        curveVertex(x,y);

    }

    endShape(CLOSE);
    pop();



    for (var i = 0; i < balles.length; i++){
        if (balles[i].vit.mag() != 0){// si la vitesse n'est pas nulle
            balles[i].update();
            for (var j = 0; j < balles.length; j++){
                if ((i!=j) && (balles[j].vit.mag() == 0)) {
                    // la distance de collision est égale à la moitié
                    // de la somme des rayons des balles
                    var distance_collision = (balles[i].r + balles[j].r) / 2;
                    if (balles[i].pos.dist(balles[j].pos) < distance_collision){
                        balles[i].vit = createVector(0, 0);
                    }
                }
            }
        }else{
            // si la vitesse est nulle alors on fait grossir le trait
            balles[i].grow();
        }
        balles[i].draw();
    }

    if ((balles.length < max_balles)){
        if (frameCount % n_balles_per == 0){
            for (var i = 0; i < n_balles_plus; i++){
                balles.push(new Particle());
            }
        }
    }

    push();
    translate (width/2, height/2);

    if (millis() > 1000){
        for(var j=0; j < tab_splash.length ; j++){
            if (millis() > 1000 + j*85){
                tab_splash[j].draw();
            }
        }
    }
    pop();
}

function Particle(x, y) {
    // rayon d'action de la particule (choix aléatoire dans une liste)
    this.r = random([6, 6, 8, 8, 8, 8, 13, 13, 13]) ;

    // largeur du trait
    this.w = random([2, 4]);

    // angle aléatoire dans une liste
    this.angle = random([0, 0, 30, 45, 90, 135]);

    // longueur du trait, au départ égal au rayon d'action
    this.l = this.r;

    // largeur et longueur maximales du trait (pour quand ça commence à grossir)
    this.max_l = random(this.r, this.r*5);
    this.max_w = random(this.r, this.r*2);

    // si on lui donne des coordonnees alors il ne bouge pas
    if (x){
        this.pos = createVector(x, y);
        this.vit = createVector(0, 0);
    }else{
        // sinon il apparait quelque part sur le bord du canvas
       if (random([true, false])){
           // bord horizontal
           this.pos = createVector(random(0, largeur),
                                   1);
       }else{
           // bord vertical
           this.pos = createVector(1,
                                   random(0, hauteur));
       }


        // vitesse aléatoire
        // avec une astuce pour qu'elle ne soit pas nulle : le premier random donne la vitesse
        // et le deuxième le sens
        var norme = random(3, 6);

        this.vit = p5.Vector.random2D().setMag(norme);

    }

    this.draw = function(){
        if (this.vit.x == 0){
            // couleur des trucs fixes
            fill(255,247,140);
            noStroke();
        }else{
            // couleur des trucs qui bougent
            fill(232, 183, 12,0);
            noStroke();
        }

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);

        rect(0, 0, this.l, this.w);

        // dessine bordure
        // fill(255);
        // var ww = (this.r-this.w)/2;
        // rect(0, this.w/2 + ww/2, this.r, ww);
        // rect(0, -(this.w/2 + ww/2), this.r, ww);

        pop();
    };

    this.update = function(){
        this.pos.add(this.vit)

        // periodicité du canvas : si une balle sort par la droite elle revient à gauche
        if (this.pos.x > largeur){
            this.pos.x = 0;
        }else if(this.pos.x < 0){
            this.pos.x = largeur;
        }
        if (this.pos.y > hauteur){
            this.pos.y = 0;
        }else if(this.pos.y < 0){
            this.pos.y = hauteur;
        }

    };

    this.grow = function(){
        // si la longueur maximale n'est pas atteinte, on ajoute un peu à la longueur
        if (this.l < this.max_l){
            this.l += 0.05;
        }

        // pareil pour la largeur
        if (this.w < this.max_w){
            this.w += 0.01;
        }
    };

}

function mousePressed(){
    // ajout d'une balle fixe sous la souris
    balles.push(new Particle(mouseX, mouseY));
}

class Splash{
    constructor(positionX, positionY){
        this.tab_offsetX = [];
        this.tab_offsetY = [];
        this.plusOrMinus;
        this.newSize;
        this.rRed;
        this.rGreen;
        this.positionX = positionX;
        this.positionY = positionY;

        this.rRed = Math.floor((Math.random() * 216) + 1);
        this.rGreen = Math.floor((Math.random() * 228) + 171);

        for(var i=0; i<numberCircle; i++){
            this.plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            this.tab_offsetX[i] = (random(circleSize)) * this.plusOrMinus;
            this.plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            this.tab_offsetY[i] = (random(circleSize)) * this.plusOrMinus;
            this.newSize = random(circleSize/4, circleSize/2);
        }
    }

    draw(){
        fill(this.rRed, this.rGreen, 255);  // Use color variable 'c' as fill color
        noStroke();  // Don't draw a stroke around shapes

        ellipse(this.positionX, this.positionY, circleSize, circleSize);
        for(var i = 0; i < 15; i++){
            if (millis() > 1000+ i*155){
            ellipse(this.positionX+this.tab_offsetX[i], this.positionY+this.tab_offsetY[i], this.newSize, this.newSize);
            }
        }

    }

}
