# Gobi Web Integration

Welcome to Gobi Web Integration. This library will let you put your Gobi stories on your site.

Below follow

- What it will look like (screenshots)
- Requirements & prerequisites
- Functionality breakdown
- Implementation steps
- Advanced configuration (eg. vertically oriented layout)
- Troubleshooting
- Browser Support
- Development (how to build and publish)

## What it will look like (demo)

See a demo of this library in action at
[https://gobiapp.com/external/example-stories](https://gobiapp.com/external/example-stories)

or a demo with module ID (not yet fully supported):
[https://gobiapp.com/external/example-module](https://gobiapp.com/external/example-module)


## What it will look like (screenshots)

### Bubbles (initially)

<img src="https://eu1media.gobitech.no/bubbles-initial.png" width="550px">

### Bubbles (while hovering)

<img src="https://eu1media.gobitech.no/bubbles-hover.png" width="550px">

### Player opened after clicking bubble

<img src="https://eu1media.gobitech.no/click-player-small.png" width="400px">




## Requirements & prerequisites

For this library to work for you, you need to have 
- an account with Gobi
- stories already made (or make them as you go)
- be a paying customer
- access to editing the source of your own webpage (and ample technical insight)

### Making an account

An account with Gobi can be made easily and for free by anyone. Install the Gobi app on your phone. [iOS](https://itunes.apple.com/us/app/gobi-send-snaps-in-groups/id1025344825?utm_source=gobiapp.com&utm_medium=website), [Android](https://play.google.com/store/apps/details?id=no.gobiapp.gobi&utm_source=gobiapp.com&utm_medium=website)
  Follow the instructions in the app to make an account.

### Making stories

Once inside the app and logged in with your user, you can
- create a story and give it a name,
- record a series of videos and photos, and add these to your story. Your story will then contain all of your content, and will play them in succession to anyone who views the story.

### Be a paying customer

For the time being you will also need to be a paying customer in order to have permission to publish your stories on the Web – contact us at [Gobitech](http://gobistories.co) for a tailored offer.


### Access to your webpage's source

You will need access to edit the source HTML and the ability to add script and link tags, in your own webpage or the webpage where you want the Gobi stories to show up.

## Functionality breakdown

An outline of what this library does:
- exports to the global (window) scope on the browser, functions which find a placeholder element and trigger creation of story bubbles
- the bubbles contain thumbnails for each story, which are automatically generated
- the appearance of the ring around bubbles and other visual elements can be configured in your Javascript
- the title of each story (soon-to-be equal to the story name) will appear under each respective bubble
- the story bubbles, when clicked, will cause a player to load, and play the selected story
- the story video player will appear either side-by-side with the bubbles, or fullscreen, depending on your configuration choices and on the device screen size
- the player contains buttons for
  - navigating back and forth in the story (skipping),
  - pausing playback,
  - closing the player,
  - muting the sound

## Implementation steps


Steps:
- Add placeholder element
– link to script and CSS
- write your inline script

Details:
- Add a placeholder element to your HTML. Put it where you want the Gobi story bubbles to appear.
  eg.
  
  ```<div id="container"></div>```
  
  This placeholder is any simple div, and can have a class name instead of an ID. The important thing is that you are able to refer to it in your script code (below).
  
- Include the library Javascript and the library CSS in your HTML page. This can be done in two ways:
  - by downloading ( for instance using ```npm``` (advanced)) and serving the files yourself.  To install using npm, do
  
    ```npm install --save @gobistories/gobi-web-integration```.

  - by reference the up‐to‐date version on npm CDN, as in the example below.

  If you don't know what this means, just follow the example below. 
- Implement your custom code in a <script> tag, which should at least call the `gobi.Bubbles` function, to get the placeholder replaced and the stories running.

  ```html
    <script>
        new gobi.Bubbles({
          container: document.getElementById('container'),
          stories: [{...}, {...}],
        });
    </script>
  ```

  Specify each story from story viewKeys. Example:
  
  ```
  new gobi.Bubbles({
    stories: [
      {viewKey: '37Njb1', title: 'Summer', avatarSrc: 'https://...'}, { ... }
  ```

  avatarSrc and title are optional – the avatar (thumbnail or picture in the bubble) will be fetched
  automatically from the story video, but set avatarSrc if you wish to override it with your own.

Full example:

```html
<html>
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css"
        rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="gobi-container"></div>
  <script>
    new gobi.Bubbles({
      container: document.getElementById('gobi-container'),
      stories: [
        {viewKey: "fhG6eY"},
        {viewKey: "8tazBc"},
        {viewKey: "9uIOKd"}
      ]
    });
  </script>
</body>
</html>
```

## Referencing a specific version of the library

If you want to reference a specific version, replace
```html
<script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
```
with
```html
<script src="https://unpkg.com/@gobistories/gobi-web-integration@1.2.2"></script>
```
where 1.2.2 is the version you require.


## Using with a bundler

If you’re using a bundler like [webpack](https://webpack.js.org), the exported object will be the Player and Module
constructor (unlike the browser where it is attached to `window.gobi`):

```js
import { Bubbles } from 'gobi-web-integration';

new Bubbles({
    container: document.getElementById('container'),
    moduleId: 'module-id'
});
```

```js
import { Player } from 'gobi-web-integration';

const player = new Player({
    container: document.getElementById('container'),
    storyName: 'story-id',
    width: 640
});

player.on('play', function() {
    console.log('played the video!');
});
```

----


## Troubleshooting

- No bubbles show

  See the console. Can you spot any errors? Try to understand them. If there seems to be a bug in the library, please email us.




## Browser Support

The library will work in IE 11+, Chrome, Firefox, Safari, and Opera.


## Development (how to build and publish)

Run:

  `npm run-script build`

This populates the dist/ folder which will be used when publishing. Note, that this folder doesn't
get committed.

Commit your work. When your working directory is clean, continue.

To automatically bump version numbers in package.json according to semver rules, and also
automatically create a commit, run (usually, just choose patch):

  `npm version [major | minor | patch]`

Push your work.

Finally, publish your new version

```
npm login  (only if needed)
npm publish
```

----

# Technical documentation

## Bubbles Constructor

Function which creates a bubble layout with already embedded player.

### Create
```html
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="container"></div>
  <script>
        new gobi.Bubbles({
          container: document.getElementById('container'),
          stories: [{
                viewKey: 'story-view-key',
                title: 'Some Title',
                description: 'Some Description'
            }, {
                viewKey: 'another-story-view-key',
                title: 'Some Another Title',
                description: 'Some Another Description'
            }],
        });
  </script>
</body>
```
### Options

option                            | default  | description
----------------------------------| -------- | -----------
container                         |          | **Required.** HTMLElement. Container where the module will be embed.
title                             |    ``    | String. Module title.
color                             |`#15d6ea` | Any valid css color value (#000, rgb(...), rgba(...)). The color of border of story circle.
avatarSize                        |    ``    | Any valid css size value (10px, 10%, 10vw...). The size of avatar circle.
verticalOrientation               |  `false` | Boolean. Displays a list of stories vertically.
wrap                              |  `false` | Boolean. Add styles which allow stories wrap to a new line on small screen sizes.
**playerOptions**                 |   `{}`   | Object. Provides interface for customization of player view.
playerOptions.roundedCorners      |  `true`  | Boolean. Remove or add rounded corners to player element.
playerOptions.shadow              |  `true`  | Boolean. Remove or add shadow to player element.
**stories**                       |          | **Required.** Array. Data of stories.
stories[0...n].id                 |          | **Required.** String. Identifire of story.
stories[0...n].title              |    ``    | String. Change title text of specific story.
stories[0...n].description        |    ``    | String. Change description text of specific story.
stories[0...n].avatarSrc          |    ``    | String. Avatar URL of specific story.
stories[0...n].titleColor         |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story title text.
stories[0...n].descriptionColor   |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story description text.

## Player Constructor

Function which create and return interface for managing and listening to events of Player.

### Create
```html
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="player-container"></div>
  <script>
        var player = new gobi.Player({
          container: document.getElementById('player-container'),
          viewKey: 'story-view-key'
        });
        player.on('play', function() {
            console.log('played the video!');
        });
  </script>
</body>
```

### Options
option             | default | description
-------------------| ------- | -----------
viewKey            |         | **Required.** String. The view key of the story.
container          |         | HTMLElement. Container where the player will be embed.
autoStart          | `false` | Boolean. Add `autoplay` and `mute` attributes to video.
loop               | `false` | Boolean. Add `loop` attributes to video.
hideOverlay        | `false` | Boolean. Hide play button and gobi logo.
roundedCorners     |  `true` | Boolean. Remove or add rounded corners to player element.
shadow             |  `true` | Boolean. Remove or add rounded corners to player element.
width              |  `612`  | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
height             |  `1088`  | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
checkViewPort      | `true`  | Boolean. Enable functionality which pause player if it outside of screen view area.

### Methods
You can call methods on the player by calling the function on the Player object:
```js
player.play();
```
#### play():void
Play the video if it’s paused. **Note:** In new browsers, there is an autoplay policy that does not allow play video with sound without user interaction.
```js
player.play();
```
#### pause():void
Pause the video if it’s playing.
```js
 player.pause();
```
#### reload():void
Reload player video.
```js
 player.reload();
```
#### setMute(flag:boolean):void
Enable or disable mute.
```js
 player.setMute(true); 
 //or
 player.setMute(false);
```
#### isInViewport():boolean
Return `true` if player is inside of screen view area.
```js
 if (player.isInViewport()) {
     alert('player is visible')
 }
 else {
     alert('player is outside of screen')
 }
```
#### on(event:string, callback:(data:any) => void):void
Add an event listener for the specified event. Will call the callback with a single parameter, `data`, that contains the data for that event.
```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};
player.on('play', onPlay);
```
#### off(event?:string, callback?:() => void): void
Remove an event listener for the specified event. Will remove all listeners for that event if a `callback` isn’t passed or only that specific callback if it is passed or all listeners from all events if any of params aren't passed.
```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};
player.on('play', onPlay);
// If later on you decide that you don’t need to listen for play anymore.
player.off('play', onPlay);
// `off` can be called with just the event name to remove all listeners.
player.off('play');
// remove all listeners from all events.
player.off();
```
### Events
You can listen for events in the player by attaching a callback using .on():
```js
player.on('eventName', function(data) {
    // data is an object containing properties specific to that event
});
```

The events are equivalent to the HTML5 video events (except for `cuechange`,
which is slightly different).

To remove a listener, call `.off()` with the callback function:

```js
var callback = function() {};

player.off('eventName', callback);
```
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
undefined
```
#### error
Triggered when video error is generated in the player.
callback data:
```js
error:MediaError
```
#### backToChunk
Triggered when user tap on back button.
callback data:
```js
chunInd:0...n
```
#### skipChunk
Triggered when user skipped some video of current story by tap on player.
callback data:
```js
chunInd:0...n
```
#### chunkChange
Triggered each time when one of story videos was changed to another. Does not metter, by user tapping on back or skip buttons or automaticaly .
callback data:
```js
chunInd:0...n
```
#### newIteration
Triggered when `loop` flag is set and story start to play one more time
```js
undefined
```

## Examples

### Responsive player 
Provides a class to resize the player according it parent element.
```html
<body>
  <style>
    .responsive-player {
        position: relative;
        display: block;
        width: 100%;
    }
    .responsive-player:before {
        content: '';
        display: block;
        width: 100%;
        /* 177.7777% = 16/9 * 100%;  The ratio of height to width of the video. Video aspect ratio always 9:16*/
        padding-top: 177.7777%;
    }
    .responsive-player iframe {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
     }
  </style>
  <div style="max-width: 350px"> 
    <div id="player-container" class="responsive-player"></div>
  <div>
  
  <script>
        var player = new gobi.Player({
          container: document.getElementById('player-container'),
          storyName: 'story-id'
        });
        player.on('play', function() {
            console.log('played the video!');
        });
  </script>
</body>
```

Also by adding a rule to the main class, you can guarantee that the height of the player will always be no more than the height of the screen.
```css
    .responsive-player {
        position: relative;
        display: block;
        width: 100%;
        /* 56.25vh = 100vh / (16 / 19) */
        max-width: 56.25vh;
    }
```
