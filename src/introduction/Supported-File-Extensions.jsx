import React, { Component } from "react";

class SupportedFileExtensions extends Component {
	render() {
		return (
			<div>
				<h1>Supported File Extensions</h1>

				<p>In StepMania 5, the supported file extensions are listed in <a href="https://github.com/stepmania/stepmania/blob/5_1-new/src/ActorUtil.cpp#L521-L572">/src/ActorUtil.cpp</a>:</p>

				<ul>
					<li><strong>Images:</strong> bmp, gif, jpeg, jpg, png</li>
					<li><strong>Audio:</strong> mp3, oga, ogg, wav</li>
					<li><strong>Video:</strong> avi, f4v, flv, mkv, mp4, mpeg, mpg, mov, ogv, webm, wmv</li>
					<li><strong>3D Models:</strong> txt</li>
				</ul>

				<hr />

				<h3>Extra Notes on Filetypes:</h3>

				<h4>Images:</h4>

				<p><em>.png</em> files with even dimensions are strongly preferred.</p>

				<h4>Audio:</h4>

				<p><em>.ogg</em> files are strongly preferred; variable-bitrate mp3 files <a href="https://github.com/stepmania/stepmania/issues/369">are buggy</a>.</p>

				<h4>Video:</h4>

				<p>SM5 supports a broad array of codecs and containers via <a href="https://www.ffmpeg.org/">ffmpeg</a>.</p>

				<p>You are generally safe to use HD video without performance issues if the computer is from the last six or seven years. The <em>.avi</em> container in conjunction with the h264 codec works great.  As of this writing, the <strong>h265 codec is not supported</strong> by SM5&apos;s version of ffmpeg.</p>

				<p><a href="https://handbrake.fr/">Handbrake</a> is a useful, free application you can use to resize your videos and convert them to one of the aforementioned formats with the h264 codec.</p>

				<h4>3D Models:</h4>

				<p>3D Models still rely on MilkShape 3D ASCII text as they have since StepMania 3.9.  Documentation is scarce at best.  Sorry.</p>
			</div>
		);
	}
}

export default SupportedFileExtensions;