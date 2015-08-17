---
layout: content
title: Chapter 1 – Support File Extensions
---


## Section 1.4.2 – Supported File Extensions

In StepMania 5, the supported file extensions are listed in [/src/ActorUtil.cpp](https://github.com/stepmania/stepmania/blob/master/src/ActorUtil.cpp):


+ **Images:** bmp, gif, jpeg, jpg, png
+ **Audio:** mp3, oga, ogg, wav
+ **Video:** avi, f4v, flv, mkv, mp4, mpeg, mpg, mov, ogv, webm, wmv
+ **3D Models:** txt


<hr>

### Extra Notes on Filetypes:

**Images:** *.png* files with even dimensions are still strongly preferred.

**Audio:** *.ogg* files are strong preferred; variable-bitrate mp3 files are still very buggy.

**Video:** It is no longer necessary to shrink to 320x240 using the mpeg1 codec!  Yay!

You are generally safe to use HD video without performance issues if the computer
is from the last six or seven years. The *.mp4* and *.avi* containers in
conjunction with the .h264 codec works great. [Handbrake](https://handbrake.fr/)
is a useful, free application you can use to resize your videos and convert them to
one of the aforementioned formats with the .h264 codec.

**3D Models:** Models still rely on MilkShape 3D ASCII text and documentation
is scarce at best.  Sorry.