import { createJimp } from "@jimp/core";
import { Bitmap, defaultFormats, defaultPlugins } from "jimp";
import webp from "@jimp/wasm-webp";
import avif from "@jimp/wasm-avif"

// SUPPORT ALL THE FORMATS
const Jimp = createJimp({
  formats: [...defaultFormats, webp, avif],
  plugins: defaultPlugins,
});

const B = 1
const G = 256
const R = 256 * 256

function toDigi(bmp: Bitmap): string {
	let pixels: number[] = [];

	for (let i = 0; i < bmp.data.length; i += 4) {
		pixels.push( 
			bmp.data[i] * R + 
			bmp.data[i + 1] * G + 
			bmp.data[i + 2] * B 
		)
	}
	
	return '0000' + [bmp.width, bmp.height, ...pixels].map( px => px.toString(16) ).join(",")
}

// w,h,pixels...

export default {
	async fetch(): Promise<Response> {
		const image = await Jimp.read("https://cataas.com/cat");
		image.scaleToFit({w: 256, h: 256})

		return new Response( toDigi(image.bitmap) );
	},
} satisfies ExportedHandler<Env>;
