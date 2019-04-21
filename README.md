# solid-recursive-copy

## Recursively copy resources across Solid-compatible information spaces

Copies a container and all of its contained resources from one Solid-compatible information space to another.  The entire directory tree will be copied including all files and sub-directories.  

**Important** Web-access files (.acl) will NOT be copied, so you will need to recreate them if you need them.

Solid-compatible information spaces currently include:

   * https:// online or localhost Solid pods
   * file://  local file-system treated as a mini pod by solid-auth-cli
   * app://   in-browser localStorage treated as a mini pod by solid-rest-browser

If you are copying between two pods using https://, you must login with a webId that has access to both pods.

## Usage

    ```javascript
    // define here and there as absolute URLs
    solid.auth.login().then( session => {
        deepCopy( here, there ).then( res => {
            if(res.ok) console.log(res);
            else console.log(res.status,res.statusText);
        },e => console.log("Error copying : "+e))
    },e => console.log("Error logging in : "+e))
    ```

The library is designed for in-browser use, in a web app, or on the command line with node.js.

Some potential uses :

    * clone projects
    * create project templates
    * create sync and backup scripts
        * pod to browser localStorage
        * local file system to pod
        ... etc.

        


