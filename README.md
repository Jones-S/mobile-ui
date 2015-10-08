# mobile-ui
ZHdK Mobile UI Interaction Design 5th Semester


## Project setup

- Copy gitignore, gulpfile, editorconfig
- init bower json `$ bower init`
- init package json `$ npm init`

`$ npm install gulp gulp-concat gulp-notify gulp-minify-css gulp-sourcemaps gulp-compass gulp-uglify gulp-sass gulp-plumber gulp-if --save-dev`

`$ bower install jquery browser-sync normalize.scss --save-dev`


## Install Problems

`$ sudo chown -R user:staff /usr/local`
-> user = `$ whoami


## Code

### Naming

prefix `pa` in Angular directives stands for «Physio App» and is used instead of the ng prefix.


### Questions

- Übergänge URL zur nächsten via Swipe
- Transition via swipe? Syntax?
- Speichern von Häkchen?
    angular-gestures
- Anzeigen von exercise[x] und x = id: (#route)
- Einschieben von Nummern bei Swipe (Drehrad) (Elemente unsichtbar darunter?)
- jQuery delegate always necessary
- jQuery wie krieg ich height ohne delegate
- generell angular document.ready? mit directives etc.
```
function MyCtrl($scope) {
    angular.element(document).ready(function () {
        console.log('Hello World');
    });
}```


### Links

https://www.pubnub.com/blog/build-a-mobile-ios-chat-app-with-angularjs-and-phonegap/

http://www.ng-newsletter.com/posts/beginner2expert-scopes.html


