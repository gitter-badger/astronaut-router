# Astronaut Router

Astronaut Router is a kind of a Route Mapper, that construct routes for you by configuration files. To use that you need have astronaut Router in your **"node_modules"** folder. [Docs in Wiki...](https://github.com/astronautjs/astronaut-router/wiki)

```sh
npm install --save astronaut-router
```

## Astronaut File

To Astronaut Router works, you need create a **"astronaut.js"** at the root of your environment *(together with package.json)*. This file will **exports** a JSON with Astronaut Configurations, something like :

```javascript
  module.exports = {
    configs : 'your/configs/folder/path',
    controllers : 'your/controllers/folder/path'
  }
```
