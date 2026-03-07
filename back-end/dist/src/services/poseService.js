"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimatePoseOnFrames = estimatePoseOnFrames;
const ort = __importStar(require("onnxruntime-node"));
const canvas_1 = require("canvas");
const MODEL_PATH = "models/movenet_lightning.onnx";
const INPUT_SIZE = 192;
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
];
let sessionPromise = null;
async function getSession() {
    if (!sessionPromise) {
        sessionPromise = ort.InferenceSession.create(MODEL_PATH, {
            executionProviders: ["dml", "cpu"], // DirectML on Windows, fallback CPU
        });
    }
    return sessionPromise;
}
function resizeWithPad(w, h) {
    const scale = Math.min(INPUT_SIZE / w, INPUT_SIZE / h);
    const newW = Math.round(w * scale);
    const newH = Math.round(h * scale);
    const padX = Math.floor((INPUT_SIZE - newW) / 2);
    const padY = Math.floor((INPUT_SIZE - newH) / 2);
    return { scale, newW, newH, padX, padY };
}
async function estimatePoseOnImagePath(filePath) {
    const session = await getSession();
    const img = await (0, canvas_1.loadImage)(filePath);
    const imgW = img.width;
    const imgH = img.height;
    const { scale, newW, newH, padX, padY } = resizeWithPad(imgW, imgH);
    // Draw padded 192x192 image
    const canvas = (0, canvas_1.createCanvas)(INPUT_SIZE, INPUT_SIZE);
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
    ctx.drawImage(img, 0, 0, imgW, imgH, padX, padY, newW, newH);
    const { data } = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
    // RGBA -> int32 NHWC
    const inputArr = new Int32Array(INPUT_SIZE * INPUT_SIZE * 3);
    for (let i = 0, j = 0; i < data.length; i += 4) {
        inputArr[j++] = data[i];
        inputArr[j++] = data[i + 1];
        inputArr[j++] = data[i + 2];
    }
    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];
    const feeds = {};
    feeds[inputName] = new ort.Tensor("int32", inputArr, [1, INPUT_SIZE, INPUT_SIZE, 3]);
    const results = await session.run(feeds);
    const out = results[outputName];
    const outData = out.data;
    // Expect [1,1,17,3] => y, x, score per keypoint
    const keypoints = [];
    let scoreSum = 0;
    for (let k = 0; k < 17; k++) {
        const base = k * 3;
        const y01 = outData[base + 0];
        const x01 = outData[base + 1];
        const s = outData[base + 2];
        // convert from 192 padded space -> original image space
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
    return { score: frameScore, keypoints };
}
async function estimatePoseOnFrames(framePaths, fps) {
    const out = [];
    for (let i = 0; i < framePaths.length; i++) {
        console.log(`Pose frame ${i + 1}/${framePaths.length}`);
        const pose = await estimatePoseOnImagePath(framePaths[i]);
        out.push({
            t: i / fps,
            score: pose.score,
            keypoints: pose.keypoints,
        });
    }
    return out;
}
