export interface PlayerOptions {
    storyName: string,
    autoStart: boolean,
    hideOverlay: boolean,
    roundedCorners: boolean,
    shadow: boolean,
    loop: boolean,
    width: number,
    height: number,
    container?: HTMLElement,
    checkViewPort:boolean
}
export interface PlayerComingOptions {
    storyName: string,
    autoStart?: boolean,
    hideOverlay?: boolean,
    loop?: boolean,
    roundedCorners?: boolean,
    shadow?: boolean,
    width?: number,
    height?: number,
    container?: HTMLElement,
    checkViewPort?:boolean
}
export interface PlayerLoadOptions {
    storyName: string,
    autoStart?: boolean,
    hideOverlay?: boolean,
    loop?: boolean,
}
