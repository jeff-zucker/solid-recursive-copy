#!/usr/bin/env node
const auth = require('solid-auth-cli')
const deepCopy = require('../src/recurse.js')

if( process.argv.length < 4 ) {
    console.log("you must enter directories to copy from and to");
    process.exit(-1)
}
const here  = process.argv[2]
const there = process.argv[3]

console.log(`logging in`)
auth.login().then( session => {
    console.log(`logged in as <${session.webId}>`)
        deepCopy( here, there ).then( res => {
    },e => console.log("Error copying : "+e))
},e => console.log("Error logging in : "+e))

/* END */
