import { DrawBox } from "../../types/video-preview/DrawBox";
import { VideoContainerSize } from "../../types/video-preview/VideoContainerSize";

export function getDrawBox(frameWidth: number, frameHeight: number, videoContainer: VideoContainerSize): DrawBox | null {
    const mediaW = frameWidth || 1;
    const mediaH = frameHeight || 1;
    const boxW = videoContainer.width;
    const boxH = videoContainer.height;

    if (!boxW || !boxH || !mediaW || !mediaH) return null;

    const mediaAspect = mediaW / mediaH;
    const boxAspect = boxW / boxH;

    if (mediaAspect > boxAspect) {
        const width = boxW;
        const height = boxW / mediaAspect;
        return { width, height, offsetX: 0, offsetY: (boxH - height) / 2 };
    }

    const height = boxH;
    const width = boxH * mediaAspect;
    return { width, height, offsetX: (boxW - width) / 2, offsetY: 0 };
}