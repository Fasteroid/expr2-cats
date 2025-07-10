import { createJimp } from "@jimp/core";
import { Bitmap, defaultFormats, defaultPlugins } from "jimp";
import webp from "@jimp/wasm-webp";
import avif from "@jimp/wasm-avif"

// SUPPORT ALL THE FORMATS
const Jimp = createJimp({
  formats: [...defaultFormats, webp, avif],
  plugins: defaultPlugins,
});

type DigiImage = {
	width: number;
	height: number;

	/** BGR format, 2d array */
	pixels: number[][]
}

const B = 1
const G = 256
const R = 256 * 256


function toDigi(bmp: Bitmap): DigiImage {
	let pixels: number[][] = [];

	let buffer: number[] = []

	for (let i = 0; i < bmp.data.length; i += 4) {
		if( buffer.length >= bmp.width ){ // cuz JSONToTable sucks!
			pixels.push(buffer); buffer = [] 
		}
		buffer.push( 
			bmp.data[i] * R + 
			bmp.data[i + 1] * G + 
			bmp.data[i + 2] * B 
		)
	}

	pixels.push(buffer);
	
	return {
		width: bmp.width,
		height: bmp.height,
		pixels
	}
}

export default {
	async fetch(): Promise<Response> {
		const image = await Jimp.read("https://cataas.com/cat");
		image.scaleToFit({w: 256, h: 256})

		return new Response( JSON.stringify( toDigi(image.bitmap) ) );
	},
} satisfies ExportedHandler<Env>;
