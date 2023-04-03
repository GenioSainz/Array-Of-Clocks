// gui params

// diameter
var d    = 50;
var dMin = 10;
var dMax = 100;
var dStep = 1;

// secSmooth
var secSmooth     = 0;
var secSmoothMin  = 0;
var secSmoothMax  = 1;
var secSmoothStep = 1;

// stopFrames
var stopFrames     = 5;
var stopFramesMin  = 1;
var stopFramesMax  = 12;
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
let guiPadding        = 25;
let gui1,gui2,gui3,gui4,gui5;
let gui1x,gui2x,gui3x,gui4x,gui5x;

// centre of each clock
let xc,yc;

// ym: (height available  - gui height) /2
// xm: windowWidth/2
let xm,ym;

// (x0_i,y0) upper left coordinate of each digit bounding box
let y0,x0_1,x0_2,x0_3,x0_4,x0_5,x0_6,x0_7,x0_8;

// hands angles initial,end and delta
let hand1_i,hand1_e,delta1;
let hand2_i,hand2_e,delta2;

// handsPositions index for indexing beta initial/end position
let handsPosition_i;
let handsPosition_e;

// loop counters
let remCycle;
let nFrame

let data,data1,data2,data3,data4,data5,data6;
let hrsI,hrsE,minI,minE,secI,secE;
let dateI,dateE;
let expectDateF = [0,0]

// array of clock dimensions [nRows,nCols]
let nRows = 6;
let nCols = 4;

// arrays that defining the clock digits as clock hand positions
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

// array that stores the allowed positions of the clock hands
// eg: 
// position 5 --> beta[5][0]: hand1 = 180º
// position 5 --> beta[5][1]: hand2 = 270º
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

    gui1 = createGui('Clock Diameter (pixels)').setPosition(gui1x ,guiPadding );;
    gui1.addGlobals('d');

    gui2 = createGui('Seconds Hand Motion').setPosition(gui2x,guiPadding );;
    gui2.addGlobals('secSmooth');
            
    gui3 = createGui('Hands Speed (frames/s)').setPosition(gui3x, guiPadding );
    gui3.addGlobals('stopFrames');

    gui4 = createGui('Clock Color').setPosition(gui4x, guiPadding );
    gui4.addGlobals('clockColorFill');

    gui5 = createGui('Hands Color').setPosition(gui5x, guiPadding );
    gui5.addGlobals('handsColor');
    
    screenMode();
    resizeArray('screen');
    listenDiameterSlider();
    

    // active ruler for measures
    // let utils = new p5.Utils();
    //     utils.enableRuler();

};

var sumCicle = 0;
function draw() {

           // initial plots and lines vertical:windowWidth/2  horizontal:windowHeight/2
           background(0,0,0);
           stroke(255,255,255);strokeWeight(0.5)
           line(0,ym,windowWidth,ym)
           line(windowWidth/2,0,windowWidth/2,windowHeight)
           
           // plot clock circles 
           strokeWeight(d / ratioStrokeCircle);stroke(clockColor);fill(clockColorFill);

           plotClockArray(x0_1,y0);
           plotClockArray(x0_2,y0);

           plotClockArray(x0_4,y0);
           plotClockArray(x0_5,y0);

           plotClockArray(x0_7,y0);
           plotClockArray(x0_8,y0);
        
           // text of seconds number 
           // right to the gui
           // textSize(20);textAlign(LEFT, CENTER);
           // fill(255,255,255);
           // text( `${new Date().getSeconds()}`,gui5x + guiLength + guiPadding, guiPadding+guiHeight/2);
          

           // the remCycle is used as a loop counter. The frameCount variable stores the number of frames since 
           // the setup() function was executed. The secuence is 1,2,...frameRate-1,0.
           
           remCycle = frameCount%fRate;
           // sumCicle stores de time fron remCycle 1...0
           sumCicle += deltaTime
            
           // calcAngles and plot initial hands angles frames
           if(remCycle == 1){

              updateDate()

              //  for display in console times
              //  console.log('----------')
              //  console.log('Inicial: ',hrsI,minI,secI,`${dateI.getMilliseconds()}`,round(sumCicle))
              //  console.log('Final  : ',hrsE,minE,secE,[dateE.getMilliseconds()]);
              
              // control if initial seconds  in i+1 iteration is equal to end seconds in i iteration
              if(!arrayEqual(expectDateF,secI)){
                  noLoop()
                  var cc = 0;
                  while(true){
                      cc++
                      if(new Date().getSeconds()==expectDateF || cc>1e4){
                        console.log('_bad_ ',new Date());
                        loop();
                        updateDate()
                        break
                      }
                  }
              };

              expectDateF = secE;
              sumCicle    = 0;
              
              // example: 03:14:15
              // hrsI=[0,3],hrsE=[0,4]
              // minI=[1,4],minE=[1,5]
              // secI=[1,5],secE=[1,6]
              
              // calc angles
              data1 = calcAngles(x0_1,y0,hrsI[0],hrsE[0],stopFrames);
              data2 = calcAngles(x0_2,y0,hrsI[1],hrsE[1],stopFrames);

              data3 = calcAngles(x0_4,y0,minI[0],minE[0],stopFrames);
              data4 = calcAngles(x0_5,y0,minI[1],minE[1],stopFrames);

              data5 = calcAngles(x0_7,y0,secI[0],secE[0],stopFrames);
              data6 = calcAngles(x0_8,y0,secI[1],secE[1],stopFrames);

              data  = [...data1,...data2,...data3,...data4,...data5,...data6];
              
              // plot hands 
              for(let i=0;i<=6*nRows*nCols-1;i++){

                  hand1_i = data[i].hand1_i;
                  hand2_i = data[i].hand2_i
                
                  strokeWeight(d / ratioStrokeLine); stroke(handsColor);
                  plotLine(data[i].xc,data[i].yc,hand1_i,handsLength);
                  plotLine(data[i].xc,data[i].yc,hand2_i,handsLength);
                  strokeWeight(d / ratioStrokePoint); stroke(clockColorFill)
                  point(data[i].xc,data[i].yc)

              };
           
           }

           // plot transitions frames
           else if(remCycle > 1   && remCycle <= fRate-stopFrames){
            
            // plot hands 
            for(let i=0;i<=6*nRows*nCols-1;i++){

                hand1_i = data[i].hand1_i;
                hand2_i = data[i].hand2_i
                delta1  = data[i].hand1_delta;
                delta2  = data[i].hand2_delta;
                nFrame  = remCycle-1;

                strokeWeight(d / ratioStrokeLine); stroke(handsColor);
                plotLine(data[i].xc,data[i].yc, hand1_i+delta1*nFrame,handsLength);
                plotLine(data[i].xc,data[i].yc, hand2_i+delta2*nFrame,handsLength);

                strokeWeight(d / ratioStrokePoint); stroke(clockColorFill)
                point(data[i].xc,data[i].yc)
            };

           }
           
           // plot end hands angles frames
           else{
            
            // plot hands 
            for(let i=0;i<=6*nRows*nCols-1;i++){

                hand1_e = data[i].hand1_e;
                hand2_e = data[i].hand2_e;
                
                strokeWeight(d / ratioStrokeLine); stroke(handsColor);
                plotLine(data[i].xc,data[i].yc,hand1_e,handsLength);
                plotLine(data[i].xc,data[i].yc,hand2_e,handsLength);

                strokeWeight(d / ratioStrokePoint); stroke(clockColorFill)
                point(data[i].xc,data[i].yc)
            };
          

           };
           
           // plot clocks columns
           plotClockVector(x0_3, y0) 
           plotClockVector(x0_6, y0) 
               
};



