import SimpleEventEmitter from "@/utils/event-emitter";
import { makeRandomStorySecretKey, getBranchLink, makeViewKey } from "@/utils/utils";
import { StoryOptions } from "@/Story/types";
import {
  fetchAvatarAndTitleGivenViewKey,
  fetchAvatarAndTitleGivenStoryId
} from "@/utils/utils";
import { default as QRCode } from "qrcode";
import SocketIO from "socket.io-client";

export default abstract class AbstractStory {
  rootElement: HTMLElement;
  id: string;
  viewKey: string;
  secretKey?: string;

  protected _elems: {
    title: HTMLAnchorElement;
    description: HTMLElement;
    avatar: HTMLElement;
    avatarContainer: HTMLElement;
  };

  protected _listenerRemoveFunctions: Array<() => void> = [];

  protected _eventEmitter = new SimpleEventEmitter();
  on = this._eventEmitter.on.bind(this._eventEmitter);
  off = this._eventEmitter.off.bind(this._eventEmitter);
  protected _title: string;
  protected _description: string;
  protected _avatarSrc: string = "";
  protected _color: string;
  private socket: any;

  get avatarSrc(): string {
    return this._avatarSrc;
  }
  set avatarSrc(src: string) {
    this._avatarSrc = src;
    this._elems.avatar.style.backgroundImage = `url(${src})`;
  }

  abstract get title(): string;
  abstract set title(title: string);
  abstract get description(): string;
  abstract set description(description: string);
  abstract get color(): string;
  abstract set color(color: string);

  protected abstract _createTemplate(): HTMLElement;

  protected checkForVideoInStory() {
    const promise = fetchAvatarAndTitleGivenViewKey(this.viewKey);
    promise.then((data) => {
      this.avatarSrc = data.src;
      this.title = data.title;
    }).catch((err) => {
    });
  }

  private mediaDetected(media) {
    this.socket.disconnect();
    this.checkForVideoInStory();
  }

  private socketConnected() {
    this.socket.on('media', this.mediaDetected.bind(this));
    this.socket.emit('subscribe_to_story_media', {viewKey: this.viewKey});
  }

  protected setupSocketToListenForNewMediaInStory() {
    this.socket = SocketIO('https://live.gobiapp.com');
    this.socket.on('connect', this.socketConnected.bind(this));
  }

  protected makeBranchQueryData(storyName: string, secretKey: string) {
    return {
        branch_key: "key_live_haoXB4nBJ0AHZj0o1OFOGjafzFa8nQOG",
        channel: 'sms',
        feature: 'sharing',
        data: {
          "~creation_source": 3,
          "$ios_url": "https://itunes.apple.com/us/app/gobi-send-snaps-in-groups!/id1025344825?mt=8",
          $desktop_url: "http://www.gobiapp.com",
          $identity_id: "624199976595486526",
          //$desktop_url: 'https://gobistories.co/storyen/leggtilinnhold',
          // should be the image of the story, or an image of a gobi camera,
          // since this 'object' is to add video
          $og_image_url: 'https://gobiapp.com/img/gobi_blue.png',
          "$og_description": 'Create videos in this story :)',
          $canonical_identifier: 'group/' + storyName,
          $og_title: 'Gobi',
          $one_time_use: false,
          $publicly_indexable: false,
          action: 'groupAdd', // recordVideo
          username: '', // Necessary to have this key. See AppDelegate.swift
          // TODO add another action to native/mobile clients
          group: storyName,
          // overloading meaning (originally it refers to id in inviteLink table in database)
          id: 'auto-' + secretKey,
          source: 'Gobi-Web-Integration'
        }
    };
  }

  protected constructor(options: StoryOptions) {
    this.rootElement = this._createTemplate();
    this._elems = {
      title: <HTMLAnchorElement>this._getElem("title"),
      description: this._getElem("description"),
      avatar: this._getElem("avatar"),
      avatarContainer: this._getElem("avatarContainer")
    };
    this.id = options.id || '';
    this.viewKey = options.viewKey || '';
    this._title = options.title || "";
    this.avatarSrc = options.avatarSrc || "";
    if (this.id || this.viewKey) {
      if (!options.avatarSrc || !this._title) {
        let promise;
        if (this.viewKey) {
          promise = fetchAvatarAndTitleGivenViewKey(this.viewKey);
          this.setupSocketToListenForNewMediaInStory();
        } else {
          promise = fetchAvatarAndTitleGivenStoryId(this.id);
        }
        promise.then(data => {
          this.avatarSrc = this.avatarSrc || data.src;
          this.title = this.title || data.title;
        });
      }
    } else {
      this.secretKey = makeRandomStorySecretKey();
      this.viewKey = makeViewKey(this.secretKey);
      const storyName = this.viewKey.slice(0, 20);
      const data = makeBranchQueryData(storyName, this.secretKey);
      const canvas = document.createElement('canvas');
      getBranchLink(data).then((result) => {
        const qrData = result.url;
        this.title = qrData;
        QRCode.toCanvas(canvas, qrData, (error) => {
          if (error) console.error(error);
          const dataUrl = canvas.toDataURL();
          this.avatarSrc = dataUrl;
          // User now scans this QR with their phone, and adds a video
          this.setupSocketToListenForNewMediaInStory();
        });
      });
    }
    this._description = options.description || "";
    this._color = options.color || "";
    this._addSelectEmitter();
    if (typeof options.onSelect === "function") {
      this._eventEmitter.on("select", options.onSelect);
    }
    if (options.container) {
      options.container.appendChild(this.rootElement);
    }
  }

  destroy() {
    if (this.rootElement.parentElement) {
      this.rootElement.parentElement.removeChild(this.rootElement);
    }
    this._eventEmitter.off();
    for (let i = this._listenerRemoveFunctions.length; i--; ) {
      this._listenerRemoveFunctions[i]();
    }
  }

  private _addSelectEmitter() {
    const selectAreas = this.rootElement.querySelectorAll(
      "[data-select-area]"
    ) as NodeListOf<HTMLElement>;
    const selectClickCallback = () => {
      this._eventEmitter.emit("select", this);
    };
    for (let i = selectAreas.length; i--; ) {
      selectAreas[i].addEventListener("click", selectClickCallback);
      this._listenerRemoveFunctions.push(() =>
        selectAreas[i].removeEventListener("click", selectClickCallback)
      );
    }
  }

  protected _getElem(name: string): HTMLElement {
    const attr = `data-${name}`;
    const elem = this.rootElement.querySelector(`[${attr}]`) as HTMLElement;
    if (elem) {
      elem.removeAttribute(attr);
      return elem;
    } else {
      throw new Error("Story does not contain element with name:" + name);
    }
  }
}
