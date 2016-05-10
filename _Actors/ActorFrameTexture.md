---
layout: default
title: ActorFrameTexture
section: 7
difficulty: advanced
description: render the multiple visual Actors within an ActorFrame to a single Sprite
---

# Section 1.7 &mdash; ActorFrameTexture

*ActorFrameTexture* actors can be used to take what would otherwise be an ActorFrame of children Sprites, BitmapTexts, etc., and render them directly to a unique texture that can be loaded into a single Sprite actor.  At that point, the original ActorFrameTexture can be cut out of the render pipeline with a `visible(false)` command, and StepMania will have that many fewer actors to process every draw cycle.

This is a more abstract and advanced topic, but it can help cut down on the overhead of having StepMania keep track of many, many actors where a single sprite might suffice.

For now, please refer to [Matt Gardner's writeup](https://github.com/stepmania/stepmania/blob/master/Docs/Themerdocs/Examples/Example_Actors/ActorFrameTexture.lua).