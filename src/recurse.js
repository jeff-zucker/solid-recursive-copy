// recursive copy Solid folders

// Just copy raw files, or parse and optinally transform RDF?
// Check whether destination directories exist first?
// Sync things in both directions?
// Use hashes from server to check identical trees?
// See all the options on rsync, unison, etc etc!!


/* for browserless auth, otherwise ignored
*/
if(typeof window === "undefined") {
    var $rdf = require('../node_modules/solid-auth-cli/tests/rdflib-modified')
    var solid= {auth:require('solid-auth-cli')}
    module.exports = deepCopy;
}

const kb = $rdf.graph()

/* required for either browserless or browser
*/
const fetcher =  $rdf.fetcher(kb,{fetch:solid.auth.fetch});

const ldp = $rdf.Namespace('http://www.w3.org/ns/ldp#')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')

function _deepCopy(src, dest, options, indent){
  indent = indent || '';
  options = options || {}
  console.log(indent+'from ' + src + '\n'+indent+'to ' + dest)
  return new Promise(function(resolve, reject){
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
      var contents = kb.each(src, ldp('contains'))
      promises = []
      for (var i=0; i < contents.length; i++){
        var here = contents[i]
        var there = mapURI(src, dest, here)
        if (kb.holds(here, RDF('type'), ldp('Container'))){
          promises.push(_deepCopy(here, there, options, indent + '  '))
        } else { // copy a leaf
          console.log('copying ' + there.value)
          // requires but then ignores the type??
          var type="text/turtle";
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

/* jz: include this here or let user do it? 
   if here, user does not need to require rdflib,
*/
function deepCopy(src,dest,options,indent){
  return new Promise(function(resolve, reject){
      if(typeof src==="string"){
          if( !src.match(/\/$/))  src += "/";
          if( !dest.match(/\/$/)) dest += "/";
          src  = kb.sym(src)
          dest = kb.sym(dest)
       }
      _deepCopy(src,dest,options,indent).then( response => {
          resolve(response)
      },function(e){ reject(e) })
  });    
}

// END
