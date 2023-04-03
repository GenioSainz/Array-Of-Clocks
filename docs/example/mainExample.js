// gui params


// diameter
var d    = 50;
var dMin = 10;
var dMax = 200;
var dStep = 1;

// secSmooth
var secSmooth     = 0;
var secSmoothMin  = 0;
var secSmoothMax  = 1;
var secSmoothStep = 1;

// stopFrames
var stopFrames     = 5;
var stopFramesMin  = 1;
var stopFramesMax  = 10;
var stopFramesStep = 1;

// colors 
var handsColor     = [0, 255, 0];
var clockColor     = [255,255,255];
var clockColorFill = [125/2,125/2,125/2];
var pointColor     = clockColorFill;

// global variables
let fRate             = 20;
let ratioStrokeCircle = 40;
let ratioStrokeLine   = 7;
let ratioStrokePoint  = 12;
let ratioDiameter     = 0.75;
let handsLength;
let guiLength         = 150;
let guiHeight         = 81;
let guiPadding        = 20;
let gui1,gui2,gui3,gui4,gui5;
let gui1x,gui2x,gui3x,gui4x,gui5x;

// centre of each clock
let xc,yc;

// ym: (height available  - gui height) /2
// xm: windowWidth/2

let xm,ym;

// (x0_i,y0) upper left coordinate of each digit
let y0,x0_1,x0_2,x0_3,x0_4,x0_5,x0_6,x0_7,x0_8;


let hand1_i,hand1_f,delta1;
let hand2_i,hand2_f,delta2;
let remainder;

let data,data1,data2,data3,data4,data5,data6;
let hrsI,hrsE,minI,minE,secI,secE;
let dateI,dateE;
let expectDateF = [0,0]

// array of clock dimensions [nRows,nCols]
let nRows = 6;
let nCols = 4;

// arrays that defining the clock digits 
let n0 = [4, 2, 2, 5,
          1, 4, 5, 1,
          1, 1, 1, 1,
          1, 1, 1, 1,
          1, 3, 6, 1,
          3, 2, 2, 6];

let n1 = [4, 2, 5, 0,
          3, 5, 1, 0,
          0, 1, 1, 0,
          0, 1, 1, 0,
          4, 6, 3, 5,
          3, 2, 2, 6];

let n2 = [4, 2, 2, 5,
          3, 2, 5, 1,
          4, 2, 6, 1,
          1, 4, 2, 6,
          1, 3, 2, 5,
          3, 2, 2, 6];

let n3 = [4, 2, 2, 5,
          3, 2, 5, 1,
          0, 4, 6, 1,  
          0, 3, 5, 1,
          4, 2, 6, 1,
          3, 2, 2, 6];

let n4 = [4, 5, 4, 5,
          1, 1, 1, 1,
          1, 3, 6, 1,
          3, 2, 5, 1,
          0, 0, 1, 1,
          0, 0, 3, 6];

let n5 = [4, 2, 2, 5,
          1, 4, 2, 6,
          1, 3, 2, 5,
          3, 2, 5, 1,
          4, 2, 6, 1,
          3, 2, 2, 6];

let n6 = [4, 2, 2, 5,
          1, 4, 2, 6,
          1, 3, 2, 5,
          1, 4, 5, 1,
          1, 3, 6, 1,
          3, 2, 2, 6];

let n7 = [4, 2, 2, 5,
          3, 2, 5, 1,
          0, 0, 1, 1,
          0, 0, 1, 1,
          0, 0, 1, 1,
          0, 0, 3, 6];

let n8 = [4, 2, 2, 5,
          1, 4, 5, 1,
          1, 3, 6, 1,
          1, 4, 5, 1,
          1, 3, 6, 1,
          3, 2, 2, 6];

let n9 = [4, 2, 2, 5,
          1, 4, 5, 1,
          1, 3, 6, 1,
          3, 2, 5, 1,
          0, 0, 1, 1,
          0, 0, 3, 6];

// array that define the angles clockwise
let beta = [[45 , 225],
            [90 , 270],
            [0  , 180],
            [0  , 90 ],
            [0  , 270],
            [180, 270],
            [90 , 180]];


// array of digits      
let N  = [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9]

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    noFill();
    frameRate(fRate);

    // create GUI setPosition(x,y)
    // central gui
    gui3x = windowWidth/2 - guiLength/2;

    // left guis
    gui2x = gui3x - guiLength - guiPadding;
    gui1x = gui2x - guiLength - guiPadding;
    
    // right guis
    gui4x = gui3x + guiLength + guiPadding;
    gui5x = gui4x + guiLength + guiPadding;

    gui1 = createGui('Diameter in pixels').setPosition(gui1x ,guiPadding );
    gui1.addGlobals('d');

    gui2 = createGui('Seconds Hand').setPosition(gui2x,guiPadding );
    gui2.addGlobals('secSmooth');
            
    gui3 = createGui('Speed in Frames/s').setPosition(gui3x, guiPadding );
    gui3.addGlobals('stopFrames');

    gui4 = createGui('Fill Color').setPosition(gui4x, guiPadding );
    gui4.addGlobals('clockColorFill');

    gui5 = createGui('Hands Color').setPosition(gui5x, guiPadding );
    gui5.addGlobals('handsColor');

    resizeArray('screen');

    listenDiameterSlider();
    screenMode()

    // active ruler for measures
    // let utils = new p5.Utils();
    //     utils.enableRuler();
    var kpx  =20
    x0_1 = x0_1-kpx;
    x0_4 = x0_4-kpx/2;
    x0_5 = x0_5+kpx/2;
    x0_8 = x0_8+kpx;
    
};

var sum = 0;

function draw() {

           
           background(0,0,0);
          
           // medium lines
           stroke(255,255,255);strokeWeight(1)
           line(0,ym,windowWidth,ym)
           line(windowWidth/2,0,windowWidth/2,windowHeight)
           
           // digits bunding box
           push()
           stroke(255,255,255);strokeWeight(3);fill(0,0,0)
           drawingContext.setLineDash([10,10]);

           rect(x0_1,y0,4*d,6*d);
           rect(x0_2,y0,4*d,6*d);

           rect(x0_4,y0,4*d,6*d);
           rect(x0_5,y0,4*d,6*d);

           rect(x0_7,y0,4*d,6*d);
           rect(x0_8,y0,4*d,6*d);
           pop()

           // points 
           push()
           stroke(255,255,255);strokeWeight(12);
           point(x0_1,y0);point(x0_2,y0);point(x0_4,y0);point(x0_5,y0);point(x0_7,y0);point(x0_8,y0)
           pop()

           push()
           textSize(20);textAlign(LEFT, CENTER);
           translate(0,-25);
           text('( x0_1, y0 )',x0_1,y0);text('( x0_2, y0 )',x0_2,y0);
           text('( x0_4, y0 )',x0_4,y0);text('( x0_5, y0 )',x0_5,y0);
           text('( x0_7, y0 )',x0_7,y0);text('( x0_8, y0 )',x0_8,y0);
           fill(255,255,255);

           pop()

           strokeWeight(d / ratioStrokeCircle);stroke(clockColor);fill(clockColorFill);
    
           plotClockArray(x0_1,y0);
           plotClockArray(x0_2,y0);
          
           plotClockArray(x0_4,y0);
           plotClockArray(x0_5,y0);

           plotClockArray(x0_7,y0);
           plotClockArray(x0_8,y0);

           textSize(32);textAlign(LEFT, CENTER);
           fill(255,255,255);
           text( `${new Date().getSeconds()}`,windowWidth/2 + 2*guiLength + 2*guiPadding, guiPadding+guiHeight/2);
          
           remainder = frameCount%fRate;
           sum += deltaTime
           
           if(remainder == 1){
            
             updateDate()
          
             minI=[5,7]
              var data3 = calcAngles(x0_4,y0,minI[0],minE[0]);
              var data4 = calcAngles(x0_5,y0,minI[1],minE[1]);
                  data  = [...data3,...data4];
           
           }

           for(let i=0;i<=2*nRows*nCols-1;i++){
           
              hand1_i = data[i].hand1_i;
              hand2_i = data[i].hand2_i
            
              strokeWeight(d / ratioStrokeLine); 
              
              stroke(255,0,0); 
              plotLine(data[i].xc,data[i].yc,hand1_i,handsLength);

              stroke(handsColor);
              plotLine(data[i].xc,data[i].yc,hand2_i,handsLength);


              strokeWeight(d / ratioStrokePoint); stroke(clockColorFill)
              point(data[i].xc,data[i].yc)
              
              push()
              strokeWeight(5)
              textSize(20);textAlign(CENTER, CENTER);
              
              var pos = data[i].handsPosition_i;
              if(pos==1 || pos==3 || pos==4){
                 var kx = -d/3
                 var ky = 0;
              }else if(pos==5 || pos==6){
                 var kx = d/3
                 var ky = 0;
              }else if(pos==2){

                 var kx = 0;
                 var ky = -d/3;

              }else{
                 var kx  = -d/4;
                 var ky  = -d/4;
              };

              text(`${data[i].handsPosition_i}`,data[i].xc+kx,data[i].yc+ky)
              
              var kd = 0.7;
              var x = data[i].xc + kd*handsLength*cos(hand1_i);                
              var y = data[i].yc - kd*handsLength*sin(hand1_i); 
              text( `${hand1_i}`,x,y);
              
              var x = data[i].xc + kd*handsLength*cos(hand2_i);                
              var y = data[i].yc - kd*handsLength*sin(hand2_i); 
              text( `${hand2_i}`,x,y);
              fill(255,255,255);
              pop()


            };



               
};
