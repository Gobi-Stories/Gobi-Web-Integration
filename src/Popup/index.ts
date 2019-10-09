import { scrollDisabler, returnHighestZIndex } from "@/utils/utils";
import SimpleEventEmitter from "@/utils/event-emitter.ts";
import { PopupOptions } from "@/Popup/types";
import Player from "@/Player";

// Popup is the overlay that contains the iframe with the Gobi Player.
// The overlay is a half-transparent black fullpage background.
// Popup puts a close X button on the player, adds an Escape button listener, and also quits if
// the background overlay is clicked.
// Popup does not contain the player itself, it only shows it using an iframe.

// Classes for this component start with gobi-popup__.
// The other components are not part of this popup, and thus should be renamed from
// gobi-popup-* to gobi-storyset-*, or something else.

export default class Popup {
  private _isOpen = false;
  private _isFullHeight = false;
  private _defaultOptions = {
    classes: "",
    openers: ""
  };
  private _eventEmitter = new SimpleEventEmitter();
  private _listenerRemoveFunctions: Array<() => void> = [];

  rootElement: HTMLDivElement;
  content: HTMLDivElement;
  iframeContainer: HTMLDivElement;
  player: Player;

  get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(options: PopupOptions) {
    this._isFullHeight = options.isFullHeight || false;
    const _options: PopupOptions = Object.assign(
      {},
      this._defaultOptions,
      options
    );
    this.rootElement = document.createElement("div");
    this.rootElement.className = _options.classes || "";
    this.content = document.createElement("div");
    this.content.className = "gobi-popup__content";
    this.iframeContainer = document.createElement("div");
    this.iframeContainer.className = "gobi-popup__iframe-container";
    this._createTemplate();
    this.player = _options.player;
    this.appendPlayer(this.player);
    this.rootElement.addEventListener("click", this._onDirectClickClose.bind(this));
    this.content.addEventListener("click", this._onDirectClickClose.bind(this));
  }

  appendPlayer(player: Player) {
    this.player = player;
    this.iframeContainer.insertBefore(
      this.player.rootElement,
      this.iframeContainer.lastElementChild
    );
  }

  open() {
    scrollDisabler.disable();
    this.rootElement.style.zIndex = (returnHighestZIndex() + 1).toString();
    this.rootElement.classList.add("gobi-popup--active");
    window.addEventListener("keyup", this._onEscapeClose.bind(this));
    this._listenerRemoveFunctions.push(() =>
      window.removeEventListener("keyup", this._onEscapeClose.bind(this))
    );
    this._isOpen = true;
    this._eventEmitter.emit("open", this, this);
  }
  close() {
    this.rootElement.style.zIndex = "";
    this.rootElement.classList.remove("gobi-popup--active");
    this.rootElement.style.padding = "";
    scrollDisabler.enable();
    this._removeListeners();
    this.player.pause();
    this._isOpen = false;
    this._eventEmitter.emit("close", this, this);
  }

  on(eventName: string, callback: (event?: any) => void) {
    this._eventEmitter.on(eventName, callback);
  }

  off(eventName: string, callback?: (event?: any) => void) {
    this._eventEmitter.off(eventName, callback);
  }
  private _removeListeners() {
    for (let i = this._listenerRemoveFunctions.length; i--; ) {
      this._listenerRemoveFunctions[i]();
    }
  }
  private _createTemplate() {
    const closeButton = document.createElement("button");
    closeButton.className = "gobi-popup__close-btn";
    closeButton.addEventListener("click", this.close.bind(this));
    this._calculatePlayerSize();
    this.iframeContainer.appendChild(closeButton);
    this.content.appendChild(this.iframeContainer);
    this.rootElement.classList.add("gobi-popup");
    this.rootElement.appendChild(this.content);
    window.addEventListener("resize", this._calculatePlayerSize.bind(this));
  }

  private _onDirectClickClose(event: MouseEvent) {
    // currentTarget is element that the event listener was attached to.
    // target is the child-most element clicked
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
  private _onEscapeClose(event: KeyboardEvent) {
    let isEscape = false;
    if (typeof event.key !== "undefined") {
      isEscape = "Escape" === event.key || "Esc" === event.key;
    } else {
      isEscape = event.keyCode === 27;
    }
    if (isEscape) {
      this.close();
    }
  }

  private _calculatePlayerSize() {
    const videoAspectRatio = 0.5625; // 9:16
    const heightMargin = this._isFullHeight ? 0 : 100;
    const containerHeight = window.innerHeight - heightMargin;
    const containerWidth = window.innerWidth;
    const containerAspectRatio = containerWidth / containerHeight;
    let width;
    let height;
    if (videoAspectRatio < containerAspectRatio) {
      width = containerHeight * videoAspectRatio;
      height = containerHeight;
    } else {
      width = containerWidth;
      height = containerWidth / videoAspectRatio;
    }
    this.iframeContainer.style.width = width + "px";
    this.iframeContainer.style.height = height + "px";
  }
}
