import { PlayerLoadOptions, PlayerOptions } from "@/Player/types";
import SimpleEventEmitter from "@/utils/event-emitter";
import {isInViewport} from "@/utils/utils";

export default class Player {
  private readonly _defaultOptions = {
    autoStart: false,
    hideOverlay: false,
    loop: false,
    width: 0,
    height: 0,
    roundedCorners: true,
    shadow: true,
    checkViewPort: true
  };
  private readonly _options: PlayerOptions;

  private _eventEmitter = new SimpleEventEmitter();
  on = this._eventEmitter.on.bind(this._eventEmitter);
  off = this._eventEmitter.off.bind(this._eventEmitter);
  rootElement: HTMLIFrameElement;

  get storyUrl() {
    const parameters: any = {
      autoStart: this._options.autoStart,
      addLooping: this._options.loop,
      hideOverlay: this._options.hideOverlay,
      roundedCorners: this._options.roundedCorners
    };
    const queryString = Object.keys(parameters)
      .map(function(key) {
        const value = parameters[key];
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
      })
      .join("&");
    let url;
    if (!!this._options.viewKey) {
      url = "https://live.gobiapp.com/next/story/viewKey/";
      url += this._options.viewKey;
    } else {
      url = "https://live.gobiapp.com/next/story/id/";
      url += this._options.storyName;
    }
    return url + "?" + queryString;
  }

  constructor(options: PlayerOptions) {
    this._options = Object.assign({}, this._defaultOptions, options);
    this.rootElement = this._createIframe();
    if (this._options.container) {
      this._options.container.appendChild(this.rootElement);
    }
    window.addEventListener("message", (event: MessageEvent) => {
      if (this.rootElement.contentWindow !== event.source) return;
      const data = event.data;
      if (data.event) {
        this._eventEmitter.emit(data.event, data.value, this);
        if (this._options.checkViewPort) {
          this._viewPortChecker(data.event);
        }
      }
    });
  }

  load(options: PlayerLoadOptions) {
    Object.assign(this._options, options);
    this.rootElement.src = this.storyUrl;
  }

  play() {
    this._callPlayerMethod("play");
  }

  pause() {
    this._callPlayerMethod("pause");
  }

  reload() {
    this._callPlayerMethod("reset");
  }

  setMute(flag: boolean) {
    this._callPlayerMethod("setMute", flag);
  }

  private _callPlayerMethod(name: string, arg: any = undefined) {
    this._sendMessage({
      method: name,
      value: arg
    });
  }

  private _sendMessage(message: object) {
    const target = this.rootElement.contentWindow;
    if (target) {
      target.postMessage(message, "*");
    }
  }
  private _createIframe(): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    const size = this._calculatePlayerSize();
    iframe.src = this.storyUrl;
    iframe.width = size.width.toString();
    iframe.height = size.height.toString();
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.style.overflow = "hidden";
    iframe.style.background = "#000";
    iframe.style.border = "0";
    if (this._options.shadow) {
      iframe.classList.add("gobi-player-shadow");
    }
    if (this._options.roundedCorners) {
      iframe.style.borderRadius = "10px";
    }
    iframe.setAttribute("allow", "autoplay;");
    return iframe;
  }

  private _viewPortChecker(playerEventName: string) {
    switch (playerEventName) {
      case "play":
        this._addIsOutOfScreenChecker();
        break;
      case "pause":
        if (isInViewport(this.rootElement)) {
          this._removeIsOnScreenChecker();
          this._removeIsOutOfScreenChecker();
        }
        break;
      case "ended":
        this._removeIsOnScreenChecker();
        this._removeIsOutOfScreenChecker();
        break;
    }
  }

  private _removeIsOnScreenChecker = () => {};
  private _removeIsOutOfScreenChecker = () => {};
  private _isOutOfScreenChecker = () => {
    if (!isInViewport(this.rootElement)) {
      this.pause();
      this._removeIsOutOfScreenChecker();
      this._addIsOnScreenChecker();
    }
  };

  private _isOnScreenChecker = () => {
    if (isInViewport(this.rootElement)) {
      this.play();
      this._removeIsOnScreenChecker();
      this._addIsOutOfScreenChecker();
    }
  };

  private _addIsOutOfScreenChecker() {
    this._removeIsOutOfScreenChecker();
    this._removeIsOnScreenChecker();
    window.addEventListener("scroll", this._isOutOfScreenChecker);
    this._removeIsOutOfScreenChecker = () =>
      window.removeEventListener("scroll", this._isOutOfScreenChecker);
  }

  private _addIsOnScreenChecker() {
    window.addEventListener("scroll", this._isOnScreenChecker);
    this._removeIsOnScreenChecker = () =>
      window.removeEventListener("scroll", this._isOnScreenChecker);
  }

  private _calculatePlayerSize() {
    let width = 612;
    let height = 1088;
    let aspectRatio = 0.5625; // 9/16
    if (this._options.width && this._options.height) {
      width = this._options.width;
      height = this._options.height;
    } else if (this._options.width) {
      width = this._options.width;
      height = width / aspectRatio;
    } else if (this._options.height) {
      height = this._options.height;
      width = height * aspectRatio;
    }
    return { width: width, height: height };
  }
}
