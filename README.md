# vidscroll

this is a proof-of-concept that i did a while back to imitate TikTok's interface in HTML. open-sourcing it with no idea if it still works.

### docs (that may not work anymore)

how to make work:
1. clone repo
2. `yarn install`
3. get yerself a folder full of tiktoks that you downloaded from the iphone tiktok app. it should look kinda like this:

<img width="882" alt="Screen Shot 2019-09-14 at 6 11 21 PM" src="https://user-images.githubusercontent.com/257909/64915419-1c46c680-d71b-11e9-8033-4cffafa660ca.png">

4. create a symlink from `server/vids` to your folder full of tiktoks:
```
ln -s /Users/yourname/Desktop/path/to/vids ./server/vids
```
5. `yarn run start`

then it's running at http://localhost:4000

it only works in Safari and iPhones as we're not including HLS.js quite yet (but that's okay this is just an iphone app for now)

even better, install it as a Progressive Web App by hitting "Share" and scrolling over to "Add to Home Screen"
