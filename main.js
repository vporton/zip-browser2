const zip = require("zip-js/WebContent/zip.js").zip
const SkynetReader = require("./myreader.js").my.SkynetReader

const express = require('express')
const app = express()
const port = 3000

app.get(/.*/, (req, res) => {
  const reqpath = req.path.substring(1)
  let [ hash, path ] = reqpath.split(/\//, 2)

  const reader = new SkynetReader(hash, path)
  const callback = function(reader) {

    // get all entries from the zip
    reader.getEntries(function(entries) {
      for (var i in entries) {
        console.log('entries[i]', entries[i]) // FIXME
        
        if (!entries[i].filename === path) continue;

        entries[i].getData(new zip.TextWriter(), function(text) {
          // text contains the entry data as a String
          console.log(text);

//           reader.close(function() {
//             // onclose callback
//           });

        }, function(current, total) {
          // onprogress callback
        });
      }
    });
  }
  reader.init(callback, function(error) {
    // onerror callback
  })
  zip.createReader(reader, callback, function(error) {
    // onerror callback
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
