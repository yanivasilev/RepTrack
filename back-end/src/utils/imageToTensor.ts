import * as tf from "@tensorflow/tfjs";
import { createCanvas, loadImage } from "canvas";

export async function imageToTensor(filePath: string): Promise<tf.Tensor3D> {
    const img = await loadImage(filePath);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const { data } = ctx.getImageData(0, 0, img.width, img.height);

    // RGBA -> RGB
    const rgb = new Uint8Array((data.length / 4) * 3);
    for (let i = 0, j = 0; i < data.length; i += 4) {
        rgb[j++] = data[i];
        rgb[j++] = data[i + 1];
        rgb[j++] = data[i + 2];
    }

    return tf.tensor3d(rgb, [img.height, img.width, 3], "int32");
}
