
### `Intro`
Util to encode and decode bmp in nodejs

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/bmp.util.git
```

### `Example`

``` javascript
const bmp = require('bmp.util');
let data = fs.readFileSync('image.bmp');
let decode = bmp.decode(data);
let encode = bmp.encode(decode);
fs.writeFileSync('copy.bmp', encode.data);
```
