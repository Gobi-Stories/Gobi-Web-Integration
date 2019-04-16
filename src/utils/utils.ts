import Promise from "promise-polyfill";
import {ModuleStoriesOptionsObj, ResponseModuleStory} from "@/Module/gobi-module.types";
import {StoryComingOptions} from "@/Story/story.types";

export function forEach<T>(list:ArrayLike<T>, callback:(listItem?:T, index?:number, list?:ArrayLike<T>) => void) {
  const max = list.length;
  for (let i = 0; i < max; i++) {
    callback(list[i], i, list);
  }
}

export function addPrefixToClassName(list:ArrayLike<HTMLElement>, prefix:string) {
  const max = list.length;
  let elem:HTMLElement;
  for (let i = 0; i < max; i++) {
    elem = list[i];
    elem.className = prefix + elem.className;
  }
}

export function getModule(moduleId:string):Promise<Array<ResponseModuleStory>> {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    const url = 'https://live.gobiapp.com/projector/player/storyModules/' + moduleId;
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function () {
      if (this.status < 400) {
        resolve(JSON.parse(this.responseText));
      } else {
        reject(Error('Module didn\'t load successfully; error code:' + xhr.statusText));
      }
    };
    xhr.onerror = function () {
      reject(Error('There was a network error.'));
    };
  })
}

export function mergeStoriesOptions(responseStories:StoryComingOptions[],
    comingStories:ModuleStoriesOptionsObj):StoryComingOptions[] {
  const mergedOptions: StoryComingOptions[] = [];
  for (const key in responseStories) {
    const responseStory = responseStories[key];
    const comingOptions = comingStories[key];
    mergedOptions.push(comingOptions ?
        Object.assign(responseStory, comingOptions) :
        responseStory);
  }
  return mergedOptions;
}

export function decorateResponseStories(responseStories:ResponseModuleStory[]):Array<StoryComingOptions> {
  return responseStories.map((responseStory): StoryComingOptions => {
    return {
      title: responseStory.title,
      avatarSrc: responseStory.thumbnail,
      description: responseStory.description,
      name: responseStory.story_id
    };
  })
}

export function addListener(object:Window | Document | HTMLElement,
                            eventName:string,
                            listener: (event?:any) => void):() => void {
  const callback = (event: Event) => listener(event);
  object.addEventListener(eventName, callback);
  return () => object.removeEventListener(eventName, callback);
}

export const scrollDisabler = {
  scrollTop: 0,
  bodyOverflow: '' as string | null,
  disable: function() {
    this.isIOS ? this.IOSDisable() : this.classicDisable();
  },
  enable: function() {
    this.isIOS ? this.IOSEnable() : this.classicEnable();
  },
  classicDisable: function() {
    this.bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  },
  classicEnable: function() {
    document.body.style.overflow = this.bodyOverflow;
  },
  IOSEnable: function() {
    document.documentElement.classList.remove('disabled-scroll');
    document.body.classList.remove('disabled-scroll');
    window.scrollTo(0, this.scrollTop);
  },
  IOSDisable: function() {
    this.scrollTop = window.pageYOffset;
    document.documentElement.classList.add('disabled-scroll');
    document.body.classList.add('disabled-scroll');
  },
  isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
};

