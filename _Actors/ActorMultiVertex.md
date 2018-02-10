---
layout: default
title: ActorMultiVertex
section: 6
difficulty: advanced
description: programmatically draw and manipulate polygons
---

# Section 1.6 &mdash; ActorMultiVertex

What `Def.Quad{}` does for quadrilaterals, *ActorMultiVertex* does for arbitrary polygons.  For documentation, please refer to [Kyzentun's writeup](https://github.com/stepmania/stepmania/blob/master/Docs/Themerdocs/ScreenAMVTest%20overlay.lua).

An *ActorMultiVertex* actor has seven possible [DrawModes](http://dguzek.github.io/Lua-For-SM5/API/Lua.xml#DrawMode).  Each DrawMode has a distinct visual style and each will require you to format your table of vertex data a little differently.

For example, calling `self:SetDrawState{Mode="DrawMode_Quads"}` on an ActorMultiVertex will cause it to render every four vertices as a quadrilateral.  Simply Love uses an *ActorMultiVertex* in `DrawMode_Quads` to [render its ScatterPlot](https://github.com/dguzek/Simply-Love-SM5/blob/01c5764200ac790fa7d7e4a539afb402ba33cc16/BGAnimations/ScreenEvaluation%20common/PerPlayer/ScatterPlot.lua#L55-L79) on ScreenEvaluation.  Each judgment from Gameplay [is rendered](https://i.imgur.com/JK5Li2w.jpg) as a quadrilateral within a single `Def.ActorMultiVertex` actor.  This is more efficient than drawing additional `Def.Quad` actors for each judgment.

Another *ActorMultiVertex* DrawMode is `DrawMode_LineStrip`, in which your table of vertex data will be rendered as a single, continuous line.  An example of `DrawMode_LineStrip` in action can be seen in [this scripted simfile](https://www.youtube.com/watch?v=hKd4xkULxFk) from the U.P.S. 2 pack.
