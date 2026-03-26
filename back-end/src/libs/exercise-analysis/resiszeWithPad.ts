// MOVENET LIGHTING MODEL EXPECTS A SQUARE 192X192 INPUT
export const INPUT_SIZE = 192;

export function resizeWithPad(w: number, h: number) {
    // FITS FRAME TO 192x192, THEN CENTER PADS TO PRESERVE THE ASPECT RATIO
    const scale = Math.min(INPUT_SIZE / w, INPUT_SIZE / h);
    const newW = Math.round(w * scale);
    const newH = Math.round(h * scale);
    const padX = Math.floor((INPUT_SIZE - newW) / 2);
    const padY = Math.floor((INPUT_SIZE - newH) / 2);
    return { scale, newW, newH, padX, padY };
}