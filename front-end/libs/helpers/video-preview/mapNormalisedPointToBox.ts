import { DrawBox } from "../../types/video-preview/DrawBox";

export function mapNormalizedPointToBox(x: number, y: number, drawBox: DrawBox): { x: number; y: number } {
    return {
        x: drawBox.offsetX + x * drawBox.width,
        y: drawBox.offsetY + y * drawBox.height,
    };
}
