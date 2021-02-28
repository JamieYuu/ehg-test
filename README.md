# EHG Code Test
Author: Jamie Yu | jiazhengyu428@gmail.com\
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Approach

The program using HTML canvas to draw the image, follows these steps:
1. Pick a random color and draw a pixel in the middle of the canvas, the pixel is a 3x3 rectangle with the given color.
2. Find all neighbor points of the last drawn pixel, add them to the queue.
3. While the queue is not empty, random pick one from the queue, find the 'similar color' of it's neighbor.
4. The similarity of color is calculating by variance.
5. Repeat the steps until all pixels have color.

The idea of the program is coming from a machine learning algorithm called K-NN

## Demo
Here is a screen shot of the webpage
![screenshot](https://user-images.githubusercontent.com/28642469/109407652-a568c080-79d6-11eb-9833-5dfaf465340a.png)

As the program will randomly pick color and pixels, so the images are different whenever re-grenerate the image
![demo](https://user-images.githubusercontent.com/28642469/109407672-d8ab4f80-79d6-11eb-95bc-d93928483c2b.gif)
