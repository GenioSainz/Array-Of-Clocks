# Array Of Clocks

Playing with JavaScript and [p5.js](https://p5js.org/)... This clock is composed of 6 digits each with 6x4 clocks, making a total of 144. The clock is connected to the local time via the JavaScript API [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) and uses the [p5gui](https://github.com/bitcraftlab/p5.gui) library, which generates a fast graphical user interface (sliders, colour picker, etc.) for each of your variables.


![ArrayClock](/imgs/video0.gif)

The application is optimised to work on screens with Width > Height. If Height > Width (phones typically in vertical mode) the application will create an alert telling the user to put the device to landscape mode.


<img src="imgs/img2.PNG"  width="80%">


```js

let n3 = [4, 2, 2, 5,
          3, 2, 5, 1,
          0, 4, 6, 1,  
          0, 3, 5, 1,
          4, 2, 6, 1,
          3, 2, 2, 6];

let beta = [[45 , 225], 
            [90 , 270],
            [0  , 180],
            [0  , 90 ], 
            [0  , 270],
            [180, 270],
            [90 , 181]];

    // initial/end numbers
    let mat_i  = N[ni];
    let mat_e  = N[ne];

    // each clock from 0 to  nRows*ncols-2
    let indx   = 0 

    for (let i = 0; i <= nRows-1; i++) {
      for (let j = 0; j <= nCols-1; j++) {

          // initial angles
          // angle_initial for hand 1 and clock(indx) = beta[ mat_i[indx] ][0]
          // angle_initial for hand 2 and clock(indx) = beta[ mat_i[indx] ][1]
          let hand1_i = beta[ mat_i[indx] ][0];
          let hand2_i = beta[ mat_i[indx] ][1];
          
          // end angles 
          // angle_end for hand 1 and clock(indx) = beta[ mat_e[indx] ][0]
          // angle_end for hand 2 and clock(indx) = beta[ mat_e[indx] ][1]
          let hand1_e = beta[ mat_e[indx] ][0];
          let hand2_e = beta[ mat_e[indx] ][1];
          
          // delta angles =  (angle between angle_initial and angle_end) / nFrames
          let hand1_delta =  angleT12(hand1_i,hand1_e) / ( nFrames );
          let hand2_delta =  angleT12(hand2_i,hand2_e) / ( nFrames );
          
          indx += 1;
          
      };
    };



```