// recursive copy Solid folders

// Just copy raw files, or parse and optinally transform RDF?
// Check whether destination directories exist first?
// Sync things in both directions?
// Use hashes from server to check identical trees?
// See all the options on rsync, unison, etc etc!!


if(typeof window === "undefined") {
    var $rdf = require('rdflib')
    var solid= {auth:require('solid-auth-cli')}
    module.exports = deepCopy;
}
const kb = $rdf.graph()
const fetcher =  $rdf.fetcher(kb,{fetch:solid.auth.fetch});

const ldp = $rdf.Namespace('http://www.w3.org/ns/ldp#')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')

function deepCopy(src, dest, options, indent){
  indent = indent || '';
  options = options || {}
  console.log(indent+'from ' + src + '\n'+indent+'to ' + dest)
  src.uri = (src.uri.match(/\/$/)) ? src.uri : src.uri + "/";
  dest.uri = (dest.uri.match(/\/$/)) ? dest.uri : dest.uri + "/";
 return new Promise(function(resolve, reject){
    if(typeof src ==="string" || typeof dest ==="string") reject("To and From must be NamedNodes, not strings")
    function mapURI(src, dest, x){
      if (!x.uri.startsWith(src.uri)){
        throw new Error("source '"+x+"' is not in tree "+src)
      }
      return kb.sym(dest.uri + x.uri.slice(src.uri.length))
    }
    fetcher.load(src).then(function(response) {
      if (!response.ok) throw new Error(
          'Error reading container ' + src + ' : ' + response.status
      )
      let contents = kb.each(src, ldp('contains'))
      promises = []
      for (let i=0; i < contents.length; i++){
        let here = contents[i]
        let there = mapURI(src, dest, here)
        if (kb.holds(here, RDF('type'), ldp('Container'))){
          promises.push(_deepCopy(here, there, options, indent + '  '))
        } else { // copy a leaf
          console.log('copying ' + there.value)
          /*
            complains if no type, but then ignores what it is set to???
          */
          let type="text/turtle";
          promises.push(fetcher.webCopy(here, there, {contentType:type}))
        }
      }
      Promise.all(promises).then(resolve(true)).catch(function (e) {
        console.log("Overall promise rejected: " + e)
        reject(e)
      })
    })
    .catch( function(error) {
      reject('Load error: ' + error)
    })
  })
}
// END
