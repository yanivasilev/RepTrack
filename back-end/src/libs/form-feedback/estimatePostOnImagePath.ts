import { getSession } from "./getSession";
import { createCanvas, loadImage } from "canvas";
import { INPUT_SIZE, resizeWithPad } from "./resiszeWithPad";
import * as ort from "onnxruntime-node";
import { Keypoints } from "./types/Keypoints";

const KEYPOINT_NAMES = [
    "nose",
    "left_eye",
    "right_eye",
    "left_ear",
    "right_ear",
    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
] as const;

// RUNS POSE DETECTION ON IAMGE AND RETURNS KEYPOINTS
export async function estimatePoseOnImagePath(filePath: string): Promise<{ score: number; keypoints: Keypoints[]; frameWidth: number; frameHeight: number }> {
    const session = await getSession();

    const img = await loadImage(filePath);
    const imgW = img.width;
    const imgH = img.height;

    const { scale, newW, newH, padX, padY } = resizeWithPad(imgW, imgH);

    // DRAW RESIZED IMAGE TO PADDED MODEL INPUT CANVAS
    const canvas = createCanvas(INPUT_SIZE, INPUT_SIZE);
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
    ctx.drawImage(img, 0, 0, imgW, imgH, padX, padY, newW, newH);

    const { data } = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);

    // CONVERT RGBA PIXELS TO RGB INT32 TENSOR INPUT
    const inputArr = new Int32Array(INPUT_SIZE * INPUT_SIZE * 3);
    for (let i = 0, j = 0; i < data.length; i += 4) {
        inputArr[j++] = data[i];
        inputArr[j++] = data[i + 1];
        inputArr[j++] = data[i + 2];
    }

    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    const feeds: Record<string, ort.Tensor> = {};
    feeds[inputName] = new ort.Tensor("int32", inputArr, [1, INPUT_SIZE, INPUT_SIZE, 3]);

    const results = await session.run(feeds);
    const out = results[outputName];
    const outData = out.data as Float32Array;

    // MODEL OUTPUT FORMAT: [Y, X, SCORE]
    const keypoints: Keypoints[] = [];
    let scoreSum = 0;

    for (let k = 0; k < 17; k++) {
        const base = k * 3;
        const y01 = outData[base + 0];
        const x01 = outData[base + 1];
        const s = outData[base + 2];

        // MAP COORDS OF PADDED IMAGE TO ORIGINAL IMAGE
        const x192 = x01 * INPUT_SIZE;
        const y192 = y01 * INPUT_SIZE;

        const xInResized = x192 - padX;
        const yInResized = y192 - padY;

        const x = xInResized / scale;
        const y = yInResized / scale;

        keypoints.push({
            name: KEYPOINT_NAMES[k],
            x,
            y,
            score: s,
        });

        scoreSum += s;
    }

    const frameScore = scoreSum / 17;
    return { score: frameScore, keypoints, frameWidth: imgW, frameHeight: imgH };
}
