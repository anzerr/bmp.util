
### `Intro`
![GitHub Actions status | publish](https://github.com/anzerr/bmp.util/workflows/publish/badge.svg)

Util to encode and decode bmp in nodejs

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/bmp.util.git
npm install --save @anzerr/bmp.util
```

### `Example`

``` javascript
const bmp = require('bmp.util');
let data = fs.readFileSync('image.bmp');
let decode = bmp.decode(data);
let encode = bmp.encode(decode);
fs.writeFileSync('copy.bmp', encode.data);
```
