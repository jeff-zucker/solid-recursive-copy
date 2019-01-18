#!/usr/bin/env node
const auth = require('solid-auth-cli')
const deepCopy = require('../src/recurse.js')

const source  = "https://jeffz.solid.community/public/solidsite2"
const target  = "https://jeffz.solid.community/public/solidsite"

console.log(`logging in`)
auth.login().then( session => {
    console.log(`logged in as <${session.webId}>`)
        deepCopy( source, target ).then( res => {
    },e => console.log("Error copying : "+e))
},e => console.log("Error logging in : "+e))

/* END */
