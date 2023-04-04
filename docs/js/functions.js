function updateDate(){
    
    // generate the current date --> dateI(initial) and sum one second --> dateE(end)
    dateI  = new Date();
    dateE  = new Date(dateI.getTime() + 1000 );
    
    // hours
    hrsI  = breakDate(dateI.getHours());
    hrsE  = breakDate(dateE.getHours());
    
    // mins
    minI  = breakDate(dateI.getMinutes());
    minE  = breakDate(dateE.getMinutes());
    
    // seconds
    secI  = breakDate(dateI.getSeconds());
    secE  = breakDate(dateE.getSeconds());

};

function breakDate(time){

  // input sec or min or hrs
  // return date in array format eg:
  // 12 => [1,2]
  //  7 => [0,7]

  if (time < 10) {
    return [0, time]

  } else {
    return [time.toString()[0] * 1, time.toString()[1] * 1]
  }
};

function arrayEqual(a,b){

  // return true/false if arrays a,b are equal/different
  return JSON.stringify(a) === JSON.stringify(b);
};
  
function screenMode(){
      
      // if window Height >= window Width phones typically
      // the application will create an alert telling 
      // the user to set the device to landscape mode

      var bool1 = screen.availHeight >= screen.availWidth;
      var bool2 = windowHeight>=windowWidth;

      if(bool1 || bool2){
        
        noLoop();
        clear();
        var img     = document.createElement('img');
            img.src = "imgs/mobileLandscape.png";
            img.setAttribute('width', '200px');
      
      setTimeout(()=>{
                      
                      noLoop();
                      clear()
                      swal({title:'Please, put your device in landscape mode to start!',
                            content: img,

                      }).then((value) => {
                        noLoop();
                        clear()
                      });

                    },100);
    }else{
          loop()
    }

}

function calcAngles(x0,y0,ni,ne){

  // inputs
      // (x0,y0) upper left coordinate of each digit
      // ni,ne initial and end numbers eg ni=9 nf=0

  // output: data 
  // object of size nRows*nCols (number of clocks per digit)
      // each array(indx) with fields:
      // hand1_i: initial angle of hand 1
      // hand1_e: end angle of hand 1
      // hand2_i: initial angle of hand 2
      // hand2_e: end angle of hand 2
      // hand 1 or 2 _delta: angle for going:
      // from _i to _f  ==>  _f = _i*delta*n_frames
      // xc: x center of the clock
      // yc: y center of the clock
      //  handsPosition_i index for indexing beta initial position
      //  handsPosition_e index for indexing beta end     position

  //object of arrays
  var data   = [];

  // initial/end arrays 
  let mat_i  = N[ni];
  let mat_e  = N[ne];

  // each clock from 0 to nRows*ncols
  let indx   = 0 

  for (let i = 0; i <= nRows-1; i++) {
    for (let j = 0; j <= nCols-1; j++) {
        
        // handsPosition
        handsPosition_i = mat_i[indx]
        handsPosition_e = mat_e[indx]

        // initial angles
        // angle_initial for hand 1 and clock(indx) = beta[ handsPosition_i ][0]
        // angle_initial for hand 2 and clock(indx) = beta[ handsPosition_i ][1]
        let hand1_i = beta[ handsPosition_i ][0];
        let hand2_i = beta[ handsPosition_i ][1];
        
        // end angles 
        // angle_end for hand 1 and clock(indx) = beta[  handsPosition_e ][0]
        // angle_end for hand 2 and clock(indx) = beta[  handsPosition_e ][1]
        let hand1_e = beta[ handsPosition_e ][0];
        let hand2_e = beta[ handsPosition_e ][1];
        
        // delta angles =  (angle between angle_initial and angle_end) / nFrames
        let hand1_delta =  angleT12(hand1_i,hand1_e) / ( fRate - stopFrames );
        let hand2_delta =  angleT12(hand2_i,hand2_e) / ( fRate - stopFrames );
        
        // center of the clock index
        let xc = x0 + d/2 + j*d;
        let yc = y0 + d/2 + i*d;
        
        // go to the next clock
        indx += 1;
        
        // update data
        data.push({hand1_i,hand1_e,hand1_delta,hand2_i,hand2_e,hand2_delta,xc,yc,handsPosition_i,handsPosition_e});

    };
  };

  return data

};

function plotClockArray(x0, y0) {

      // This function draws a digit of dimension nRows*nCols with circles
      // with radius r and center (xc,yc). (xc,yc) is based on (x0_i,y0).

      for (let i = 0; i <= nRows-1; i++) {
          for (let j = 0; j <= nCols-1; j++) {
  
              let r  = d/2;
              let xc = x0 + r + j*d;
              let yc = y0 + r + i*d;
              circle(xc, yc, d);
          };
      }

};

function plotClockVector2Clocks(x0, y0) {
  
  // plot columns clocks/hands between digits
  // two clocks

  let theta1 = 90 - 6*( new Date().getSeconds() )
  let theta2 = (theta1 + 180);
  let kr     = ratioDiameter;
  let r      = d/2;

  for (let rows = 2; rows<= 3; rows++) {
      
      let xc = x0 + r;
      let yc = y0 + 2*r + d*rows;

      let x1 = xc + kr * r * cos(theta1);
      let y1 = yc - kr * r * sin(theta1);

      let x2 = xc + kr * r * cos(theta2);
      let y2 = yc - kr * r * sin(theta2);

      strokeWeight(d / ratioStrokeCircle); stroke(clockColor);fill(clockColorFill);
      circle(xc, yc, d);

      strokeWeight(d / ratioStrokeLine); stroke(handsColor);
      line(xc, yc, x1, y1);
      line(xc, yc, x2, y2);

      strokeWeight(d / ratioStrokePoint);stroke(clockColorFill)
      point(xc, yc);
  };
};

function plotClockVector(x0, y0) {
  
    // plot seconds clock indicator

    let date   = new Date();
    let theta1 = 90 - 6*date.getSeconds() - secSmooth*(6*date.getMilliseconds()/1000);

    let kr     = ratioDiameter;
    let r      = d/2;
    let rows   = 2;
        
    let xc = x0 + r;
    let yc = y0 + d + d*rows;

    let x1 = xc + kr * r * cos(theta1);
    let y1 = yc - kr * r * sin(theta1);

    strokeWeight(d / ratioStrokeCircle); stroke(clockColor);
    fill(clockColorFill);
    circle(xc, yc, d);

    strokeWeight(d / ratioStrokeLine); stroke(handsColor);
    line(xc, yc, x1, y1);

    strokeWeight(d / ratioStrokePoint);stroke(clockColorFill)
    point(xc, yc);

};

function plotLine(xc,yc,theta,lineLength){
          
  // plot line with length len 
  // from (xc,yc) to (x,y)

  let x = xc + lineLength * cos(theta);
  let y = yc - lineLength * sin(theta);
  line(xc, yc, x, y);

};

function angleV12(v1,v2){
          
  // minimum angle (+-) between v1 and v2 for going
  // to vector  v1 to v2

  let theta1 = atan2(v1(2),v1(1));
  let theta2 = atan2(v2(2),v2(1));
  let angle  = theta2-theta1;

  if(Math.abs(angle) > 180){
      angle = angle - 360*Math.sign(angle);
  };

  return angle

};

function angleT12(t1,t2){
          
  // minimum angle (+-) between t1 and t2 for going
  // to angle t1 to t2

  let theta1 = atan2(sin(t1),cos(t1));
  let theta2 = atan2(sin(t2),cos(t2));
  let angle  = theta2-theta1;
  
  if(Math.abs(angle) > 180){
      angle = angle - 360*Math.sign(angle);
  };

  return angle
};

function resizeArray(mode){

  // init array size and fire when when window is resized

  // if mode == screen cumpute diameter based on screen width, else 
  // diamter is based on slider value

  if(mode=='screen'){

          d = floor(windowWidth / (6 * 4 + 3));
  };

  // upper left coordinate x of each digit bounding box
  xm = windowWidth/2;

  // y0 based on screen height
  var H1 = guiPadding   + guiHeight + d/2
  var H2 = windowHeight - d/2;

  // ym: (height available  - gui height) /2
  ym = ( H2-H1 )/2;
  ym = ym + H1;

  // update upper left coordinate y of each digit 
  y0 = ym-3*d;

  // adjust the diameter of the clocks to the height of the screen
  var diff = y0 - ( guiHeight + guiPadding + d/2);
  while(diff<=0) {
      
          d    = d - 1;
          y0   = ym-3*d;
          diff = y0 - ( guiHeight + guiPadding + d/2 );
  };
  
  // update digits bounding box
  x0_1 = xm - (3*nCols+1)*d; // secs0
  x0_2 = xm - (2*nCols+1)*d; // secs1
  x0_3 = xm - (  nCols+1)*d;
  x0_4 = xm -    nCols   *d; // mins0
  x0_5 = xm                ; // mins1
  x0_6 = xm +    nCols   *d;
  x0_7 = xm + (  nCols+1)*d; // hours0
  x0_8 = xm + (2*nCols+1)*d; // hours1

  // update hands length
  handsLength = 0.5*d*0.7;

  // update diameter slider value end text
  document.querySelector("#qs_1").value = d;

  // document.querySelector("#qs_1").max = d;
  document.querySelector("div.qs_label").innerHTML = `<b>d:</b> ${d}`;
  
}

function listenDiameterSlider(){

  // update diameter based on slider value
  // update slider text
  var slider = document.querySelector("#qs_1");
      
        slider.addEventListener('input',()=>{

              resizeArray('slider')
          })
};

function windowResized() {

  // fired when window is resized

  // resize canvas
  resizeCanvas(windowWidth, windowHeight);
  
  // detect screen mode
  screenMode();
  
  // gui reposition when screen size changes
  // central gui
  gui3x = windowWidth/2 - guiLength/2;

  // left guis
  gui2x = gui3x - guiLength - guiPadding;
  gui1x = gui2x - guiLength - guiPadding;
  
  // right guis
  gui4x = gui3x + guiLength + guiPadding;
  gui5x = gui4x + guiLength + guiPadding;

  gui1.setPosition(gui1x ,guiPadding );
  gui2.setPosition(gui2x, guiPadding );   
  gui3.setPosition(gui3x, guiPadding );
  gui4.setPosition(gui4x, guiPadding );
  gui5.setPosition(gui5x, guiPadding );

  
  // resize array
  resizeArray('screen');

};

function remCycleFun(){ 

  // function to test remCycle, this function is not executed in the main program
  // only output in  console.log()

  var fr_         = 10;
  var stopFrames_ = 4;

  var angle_i_    = 30;
  var angle_e_    = 60;

  var angle_i2e_  = angleT12(angle_i_ ,angle_e_);
  var delta_      = angle_i2e_ / ( fr_ - stopFrames_);
  
  let remCycle_,angleFrame_,txt_,nFrame_

  console.log({angle_i_, angle_e_, angle_i2e_, delta_})

  var objectData = [];

  for(let frameCount_=1;frameCount_<=2*fr_;frameCount_++){

      remCycle_ = frameCount_%fr_;

      if(remCycle_ == 1){

          txt_        = 'Initial angle';
          angleFrame_ = angle_i_;
          objectData.push({frameCount_,remCycle_, angleFrame_, txt_});

      }else if (remCycle_>1 && remCycle_ <= fr_-stopFrames_){

          txt_        = 'Transition angle'; 
          nFrame_     = remCycle_-1;
          angleFrame_ = angle_i_ + delta_*nFrame_;
          objectData.push({frameCount_,remCycle_, angleFrame_, txt_});

      }else{

          txt_        = 'End/stop angle';
          angleFrame_ = angle_e_;
          objectData.push({frameCount_,remCycle_, angleFrame_, txt_});
          if(remCycle_==0){ objectData.push({endCicle:'endCicle'}) };
      };
  };

  console.table(objectData)

  return objectData

};
