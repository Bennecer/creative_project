var rayonMax = 0;
var points = 20;
var tab_rayon = [];
var c = 0.1;
var circleSize = 40;
var numberCircle = 35;
var tab_splash = [];
var positionX = 0;
var positionY = 0;

function setup() { 
    createCanvas(windowWidth, windowHeight );
    // background(255,255,120);
    rayonMax = windowHeight - 450;
    positionX = -rayonMax+25;
    positionY = 120;
    
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
    translate (width/2, height/2);
    
    var angle = TWO_PI/points;
    
    fill (63, 226, 101);
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
    
    if (millis() > 1000){
        for(var j=0; j < tab_splash.length ; j++){
            if (millis() > 1000 + j*85){
                tab_splash[j].draw();
            }
        }
    }
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