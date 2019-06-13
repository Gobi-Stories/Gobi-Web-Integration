import Promise from "promise-polyfill";
import { default as uuid } from "uuid";
import { default as v5 } from "uuid/v5";
import { int_to_base58 } from '@/base58';
import { default as QRCode } from "qrcode";

export function qrDataToDataUrl(qrData: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, qrData, (error) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      const dataUrl: string = canvas.toDataURL();
      resolve(dataUrl);
    });
  });
}

export function makeBranchQueryData(storyName: string, secretKey: string): any {
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

export function makeViewKey(secretKey:string):string {
  const execd:any = secretKey.match('^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$');
  if (!execd) {
    throw new Error('secretKey malformed');
  }
  const uuidNodePart:any = execd[5];
  const uuidNodePartInt:any = parseInt(uuidNodePart, 0x10);
  const nodeInBase58:any = int_to_base58(uuidNodePartInt);
  const node8Characters:any = nodeInBase58.slice(-8);
  return node8Characters;
}

export function makeRandomStorySecretKey():string {
  const gobiUuid = v5("gobistories.co", v5.DNS);
  const storySecretKey = uuid.v4(gobiUuid);
  return storySecretKey;
}

export function getBranchLink(data) {
  const url = "https://api2.branch.io/v1/url";
  const fetching = fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(function(response) {
    return response.json();
  });
  return fetching;
}

export function addPrefixToClassName(
  list: ArrayLike<HTMLElement>,
  prefix: string
) {
  const max = list.length;
  let elem: HTMLElement;
  for (let i = 0; i < max; i++) {
    elem = list[i];
    elem.className = prefix + elem.className;
  }
}

export function returnHighestZIndex() {
  const elems = document.body.querySelectorAll("*");
  let maxZIndex = 1;
  let currentZIndex = 0;
  for (let i = elems.length; i--; ) {
    currentZIndex = Number(window.getComputedStyle(elems[i]).zIndex);
    if (maxZIndex < currentZIndex) {
      maxZIndex = currentZIndex;
    }
  }
  return maxZIndex;
}

export const scrollDisabler = {
  scrollTop: 0,
  bodyOverflow: "" as string | null,
  htmlOverflow: "" as string | null,
  disable: function() {
    this.isIOS ? this.IOSDisable() : this.classicDisable();
  },
  enable: function() {
    this.isIOS ? this.IOSEnable() : this.classicEnable();
  },
  classicDisable: function() {
    this.bodyOverflow = document.body.style.overflow;
    this.htmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  },
  classicEnable: function() {
    document.documentElement.style.overflow = this.htmlOverflow;
    document.body.style.overflow = this.bodyOverflow;
  },
  IOSEnable: function() {
    document.documentElement.classList.remove("disabled-scroll");
    document.body.classList.remove("disabled-scroll");
    window.scrollTo(0, this.scrollTop);
  },
  IOSDisable: function() {
    this.scrollTop = window.pageYOffset;
    document.documentElement.classList.add("disabled-scroll");
    document.body.classList.add("disabled-scroll");
  },
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)
};

export function fetchAvatarAndTitleGivenViewKey(viewKey: string): Promise<any> {
  const url = "https://live.gobiapp.com/api/v4/story/by_view_key/" + viewKey;
  return inner(url, viewKey);
}
export function fetchAvatarAndTitleGivenStoryId(storyId: string): Promise<any> {
  const url = "https://live.gobiapp.com/projector/player/stories/" + storyId;
  return inner(url, storyId);
}

function inner(url, key_or_id): Promise<any> {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = function() {
      if (this.status < 400) {
        const response: any = JSON.parse(this.responseText);
        if (response && response.videos && response.videos[0]) {
          const src: string = response.videos[0].poster;
          const title: string = response.title || response.videos[0].title;
          resolve({ src, title });
        } else {
          reject(
            Error("No video[0] for story " + url + " -- " + xhr.statusText)
          );
        }
      } else {
        reject(
          Error("Error loading info for story " + url + " -- " + xhr.statusText)
        );
      }
    };
    xhr.onerror = () => {
      reject(Error("Error xhr-ing info for url " + url));
    };
  });
}
