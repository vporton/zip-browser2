(function(obj) {
  "use strict";

  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
  const zip = require("./zip.js").zip
//   const HttpRangeReader = require("zip-js/WebContent/zip-ext.js").HttpRangeReader
  const Reader = zip.Reader

  function HttpRangeReader(url, bust) {
    var that = this;

    function init(callback, onerror) {
    console.log(url) // FIXME
      var request = new XMLHttpRequest();
      request.addEventListener("load", function() {
        that.size = Number(request.getResponseHeader("Content-Length"));

        // Some HTTP servers do not emit the Accept-Ranges header :(
        if (true || request.getResponseHeader("Accept-Ranges") == "bytes")
          callback();
        else
          onerror(ERR_HTTP_RANGE);
      }, false);
      request.addEventListener("error", onerror, false);
      request.open("HEAD", url + (bust ? ("?b=" + Date.now()) : ""));
      request.send();
    }

    function readArrayBuffer(index, length, callback, onerror) {
      var request = new XMLHttpRequest();
      request.open("GET", url);
      request.responseType = "arraybuffer";
      request.setRequestHeader("Range", "bytes=" + index + "-" + (index + length - 1));
      request.setRequestHeader("If-None-Match", "webkit-no-cache");
      request.addEventListener("load", function() {
        callback(request.response);
      }, false);
      request.addEventListener("error", onerror, false);
      request.send();
    }

    function readUint8Array(index, length, callback, onerror) {
      readArrayBuffer(index, length, function(arraybuffer) {
        callback(new Uint8Array(arraybuffer));
      }, onerror);
    }

    that.size = 0;
    that.init = init;
    that.readUint8Array = readUint8Array;
  }
  HttpRangeReader.prototype = new Reader();
  HttpRangeReader.prototype.constructor = HttpRangeReader;

  const prefix = "https://siasky.net/";

  function SkynetReader(hash, path) {
    return new HttpRangeReader(prefix+hash, false)
  }
  SkynetReader.prototype = new HttpRangeReader();
  SkynetReader.prototype.constructor = SkynetReader;

  obj.my = { SkynetReader: SkynetReader }

})(this)
