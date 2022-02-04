[![npm version](https://badge.fury.io/js/%40gobistories%2Fgobi-web-integration.svg)](https://badge.fury.io/js/%40gobistories%2Fgobi-web-integration)

# Gobi Web Integration

Welcome to Gobi Web Integration. This library will let you put your Gobi stories on your site. If you don't have any Gobi Stories yet, sign up in our [Story Manager}(https://manage.gobistories.com/) to get access to our production tools.

## What it will look like (demo)

See a demo of this library in action at
[https://www.gobistories.com/developers](https://www.gobistories.com/developers)

To easily test the most used options, go to the code snippet editor in our [Story Manager](https://manage.gobistories.com/).

## Troubleshooting & FAQ

- No bubbles show

  See the console. Can you spot any errors? Try to understand them. If there seems to be a bug in the library, please email us.

- If you have a website where the server uses the Content-Security-Policy HTTP header, it must include "blob:" in default-src or media-src. Domains used by our library is https://api.gobistories.co/, https://api.gobistories.com/, https://res.cloudinary.com/gobi-technologies-as/ 

- If your page scrolls to the top when opening a story, this is usually caused by the height styling for the HTML tag of your page. Removing or replaceing this by "min-height" usally solves the problem. 


# Technical documentation

## Browser Support

The library will work well in Chrome, Firefox, Safari, and Opera. The library lets users in IE view the story, but UX and functionality might be a bit limited compared to modern browsers. 

## Installation

```bash
npm install --save @gobistories/gobi-web-integration
```

## Gobi.discover()

Function which discover story div tags added to your page and creates a bubble layout with an already embedded player. 

```html
<head>
<script src="https://unpkg.com/@gobistories/gobi-web-integration@^6" async onload="gobi.discover()"></script>
</head>
```

## Story div tags
Story div tags require a Story ID, but it's also possible to use most of our option in this code style by appending a kebab cased option to data-gobi-. Users can create these div tags within or [Story Manager](https://manage.gobistories.com/).

```html
<div class="gobi-stories"
  data-gobi-stories="story-id another-story-id"
  data-gobi-kebab-cased-option="value"
  data-gobi-some-other-kebab-cased-option="value"
>
</div>
```


## Inline Script
Another way to add Gobi stories to your page is by using inline javascript. 

```html
<head>
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="container"></div>
  <script>
        new gobi.Bubbles({
          container: '#container',
          stories: [{
                id: 'story-key',
                title: 'Some Title'
            }, {
                id: 'another-story-key',
                title: 'Some Another Title'
            }],
        });
  </script>
</body>
```
### Options

option                            | default    | description
----------------------------------| ---------- | -----------
container                         |`#gobi-here`| **Required for inline javascript.** String. Query Selector for HTMLElement. Container where the module will be embed.
color                             |  `#15d6ea` | Any valid css color value (#000, rgb(...), rgba(...)). The color of the border around the story bubble.
bubbleSize                        |   `96px`   | Valid css size value, except % (10px, 10vw...). The size of the avatar aka bubble.
hideTitle                         |   `false`  | Boolean. Hides the bubble title if true (default false) 
animatedBubble                    |   `false`  | Boolean. Makes the bubbles as gif animation.
verticalOrientation               |   `false`  | Boolean. Makes the bubbles appear vertically.
wrap                              |   `false`  | Boolean. Add styles which allow a horizontal series of bubbles to wrap to new lines, when the screen is narrow.
isFullHeightMobile                |   `true`  | Boolean. Add styles which allow making a full-screen popup. It's work only on mobile phone
showPlayIcon                      |   `false`  | Boolean. Add Play icon inside the bubbles
playIconUrl                       |   undefined| Optional string, will show the given icon in the play bubble.
align                             |  `center`  | String. Valid values 'left', 'right', 'end', 'start', 'center' . It sets alignment for bubbles horizontally
autoSegue                         |   `false`  | Boolean. Enable or disable the transition to next story in the end
fullscreenPlayer                  |   `false`  | Boolean. Set to true to remove all margins from the player when opened in popup mode
noShade                           |   `false`  | Boolean. Set to true to not apply a page background shade when the player is opened in popup mode
titleFontSize                     |   `12px`   | Valid css size value. By default, a size is selected based on bubbleSize between 12px and 36px.
titleFontColor                    |   `black`  | Any valid css color value (#000, rgb(...), rgba(...)). The color of the bubble title text.
titleFontFamily                   |  undefined | Valid css font family name. Inherited from the document by default.
titleFontWeight                   |  undefined | Valid css font weight. Inherited from the document by default.
on.loaded                         |  `()=>{}`  | Function. Called when all Bubbles have loaded.
on.close                          |  `()=>{}`  | Function. Called when all popups are closed.
**stories**                       |    `[]`    | **Required for inline javascript.** Array. Data of stories.
stories[0...n].id                 |    ``      | **Required.** String. Identifire of story.
stories[0...n].title              |    ``      | String. Change title text of specific story.
stories[0...n].bubbleSrc          |    ``      | String. Avatar URL of specific story.
**playerOptions**                 |    `{}`    | Object. Provides an interface for customization of the player.
playerOptions.container           |   ``       | Query Selector for HTMLElement. Container where the player will be inserted.
playerOptions.autoStart           |  `false`   | Boolean. Add `autoplay` attributes to the video.
playerOptions.autoStartWithSound  |  `false`   | Boolean. Add `autoplay` attributes to the video, and dont mute the video at the same time.
playerOptions.loop                |  `false`   | Boolean. Add `loop` function to video.
playerOptions.roundedCorners      |   `true`   | Boolean. Enable or disable rounded corners to player element.
playerOptions.shadow              |   `true`   | Boolean. Enable or disable shadow on the player element.
playerOptions.width               |   `612`    | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
playerOptions.height              |   `1088`   | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
playerOptions.checkViewPort       |   `true`   | Boolean. Enable functionality which pause player if it outside of screen view area.
playerOptions.playButton          |   `true`   | Boolean. Enable or disable play button
playerOptions.logo                |   `true`   | Boolean. Enable or disable Gobi logo. It ignores if autoSegue set to true
playerOptions.savePosition        |   `true`   | Boolean. Enable or disable save last watched chapter. It needs to confirm policy by user
playerOptions.useMediaProxy       |  `false`   | Boolean. Enable the use of a reverse proxy hosted by Gobi for media content.
**playerOptions.on**              |   `[]`     | Array. Data of event listener
playerOptions.on.videoPlay        |  `()=>{}`  | Function. The callback for the play event
playerOptions.on.videoPause       |  `()=>{}`  | Function. The callback for the pause event
playerOptions.on.videoComplete    |  `()=>{}`  | Function. The callback for the complete event
playerOptions.on.clipChange       |  `()=>{}`  | Function. The callback for the change chunk event
playerOptions.on.clickPrevious    |  `()=>{}`  | Function. The callback for the change to previous chunk event
playerOptions.on.chunkProgress    |  `()=>{}`  | Function. The callback for the update chunk progress event
playerOptions.on.clickNext        |  `()=>{}`  | Function. The callback for the change to nuxt chunk event
playerOptions.on.newIteration     |  `()=>{}`  | Function. The callback for the new iteration event
playerOptions.on.error            |  `()=>{}`  | Function. The callback for the error event
playerOptions.on.loaded           |  `()=>{}`  | Function. The callback for the loaded event


## Embedded player

Creates a Player and returns an interface for managing it, and for listening to its events.

### Example

```html
<head>
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="player-container"></div>
  <script>
        new gobi.Player({
          container: '#player-container',
          storyId: 'story-key',
          on: {
            'videoPlay': function(){
              console.log('played the video!')
            },
          }
        });
  </script>
</body>
```

### Options

option             | default  | description
-------------------| -------- | -----------
container          |   ``     | Query Selector for HTMLElement. Container where the player will be inserted.
storyId            |   ``     | **Required.** String. The key of the story.
autoStart          | `false`  | Boolean. Add `autoplay` attributes to the video.
autoStartWithSound | `false`  | Boolean. Add `autoplay` attributes to the video, and don't mute the video at the same time.
loop               | `false`  | Boolean. Add `loop` function to video.
roundedCorners     |  `true`  | Boolean. Enable or disable rounded corners to player element.
shadow             |  `true`  | Boolean. Enable or disable shadow on the player element.
width              |  `612`   | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
height             |  `1088`  | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
checkViewPort      |  `true`  | Boolean. Enable functionality which pause player if it outside of screen view area.
playButton         |  `true`  | Boolean. Enable or disable play button
logo               |  `true`  | Boolean. Enable or disable Gobi logo.
savePosition       |  `true`  | Boolean. Enable or disable save last watched chapter. It needs to confirm policy by user
useMediaProxy      | `false`  | Boolean. Enable the use of a reverse proxy hosted by Gobi for media content.
**on**             |  `[]`    | Array. Data of event listener
on.videoPlay       | `()=>{}` | Function. The callback for the play event
on.videoPause      | `()=>{}` | Function. The callback for the pause event
on.videoComplete   | `()=>{}` | Function. The callback for the complete event
on.chunkProgress   | `()=>{}` | Function. The callback for the update chunk progress event
on.clickPrevious   | `()=>{}` | Function. The callback for the change to previous chunk event
on.clickNext       | `()=>{}` | Function. The callback for the change to nuxt chunk event
on.clipChange      | `()=>{}` | Function. The callback for the change chunk event
on.newIteration    | `()=>{}` | Function. The callback for the new iteration event
on.error           | `()=>{}` | Function. The callback for the error event
on.loaded          | `()=>{}` | Function. The callback for the loaded event

## Player Events

#### loaded
Occurs when meta data for the video has been loaded. The player gets the size and begins to occupy space on the page.
callback data:
```js
chunInd:0...n
```

#### play
Sent when the playback state is no longer paused, as a result of the `play` method, or the `autoStart` option
Play the video if it’s paused. Note: on iOS and some other mobile devices, you cannot programmatically trigger play. Once the viewer has tapped on the play button in the player, however, you will be able to use this function.
callback data:
```js
chunInd:0...n
```

#### pause
Sent when the playback state is changed to paused.
callback data:
```js
chunInd:0...n
```

#### ended
Triggered any time the video playback reaches the end. Note: when `loop` is turned on, the ended event will not fire.
callback data:
```js
chunInd:0...n
```

#### error
Triggered when video error is generated in the player.
callback data:
```js
error:MediaError
```

### Methods
You can call methods on the Player object, eg.:

```js
  var player = new gobi.Player({
     container: '#player-container',
     storyId: 'story-key',
  });

  player.destroy();
```

#### Destroy
You can destroy player in a valid way 
```js
  player.destroy()
```


