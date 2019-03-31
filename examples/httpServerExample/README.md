# httpServerExample

```sh
npm run example:httpServerExample # start this example
```

This example shows how to use the `onBeforeSend` method to replace text inside the served html file.

The client requests `httpServerExample.html`, which contains:

```html
<h1>
  Hello world
</h1>
```

The server replaces `Hello` with Goodbye:

```typescript
// Inject some code
const newFile = file.replace('Hello', 'Goodbye')
response.end(newFile)
```

The client receives the modified `httpServerExample.html` file

```html
<h1>
  Goodbye world
</h1>
```
