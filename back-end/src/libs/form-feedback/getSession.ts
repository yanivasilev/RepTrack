import * as ort from "onnxruntime-node";

const MODEL_PATH = "models/movenet_lightning.onnx";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

// LOADS AND CACHES ONNX INFERENCE SESION
export async function getSession() {
    if (!sessionPromise) {
        sessionPromise = ort.InferenceSession.create(MODEL_PATH, {
            executionProviders: ["dml", "cpu"],
        });
    }
    return sessionPromise;
}