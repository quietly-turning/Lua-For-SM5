---
layout: default
title: Supported File Extensions
section: 4.2
subsection: 2
description: a list of what file extensions StepMania 5 supports
---


## Section 1.4.2 &mdash; Supported File Extensions

In StepMania 5, the supported file extensions are listed in [/src/ActorUtil.cpp](https://github.com/stepmania/stepmania/blob/master/src/ActorUtil.cpp):


+ **Images:** bmp, gif, jpeg, jpg, png
+ **Audio:** mp3, oga, ogg, wav
+ **Video:** avi, f4v, flv, mkv, mp4, mpeg, mpg, mov, ogv, webm, wmv
+ **3D Models:** txt


<hr>

### Extra Notes on Filetypes:

##### Images:
*.png* files with even dimensions are strongly preferred.

##### Audio:
 *.ogg* files are strong preferred; variable-bitrate mp3 files are very buggy.

##### Video:
SM5 supports a broad array of codecs and containers via [ffmpeg](https://www.ffmpeg.org/).

You are generally safe to use HD video without performance issues if the computer is from the last six or seven years. The *.avi* container in conjunction with the .h264 codec works great.

[Handbrake](https://handbrake.fr/) is a useful, free application you can use to resize your videos and convert them to one of the aforementioned formats with the .h264 codec.

##### 3D Models:
3D Models still rely on MilkShape 3D ASCII text as they have since StepMania 3.9.  Documentation is scarce at best.  Sorry.