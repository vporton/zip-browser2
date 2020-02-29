(function(obj) {
  "use strict";

  const axios = require('axios').default;
  const Reader = require("zip-js/WebContent/zip.js").zip.Reader

  const prefix = "https://siasky.net/skynet/skyfile/";

  function SkynetReader(hash, path) {
    var that = this;

    function init(callback, onerror) {
    }

    function readArrayBuffer(index, length, callback, onerror) {
      const url = prefix + hash

      return new Promise((resolve, reject) => {
        axios.get(url, { responseType: 'stream' })
          .then((response) => callback(response))
      })
    }

    function readUint8Array(index, length, callback, onerror) {
      readArrayBuffer(index, length, function(arraybuffer) {
        callback(new Uint8Array(arraybuffer));
      }, onerror);
    }

    that.init = init;
    that.size = 0; // needed?
    that.readUint8Array = readUint8Array;
  }
  SkynetReader.prototype = new Reader();
  SkynetReader.prototype.constructor = SkynetReader;

  obj.my = { SkynetReader: SkynetReader }

})(this)
