# partial-application-tree

This module is designed to simplify making your library's codebase functional via partial application.

By using partial applicatio on your functions you are able to keep them pure when they would have otherwise been impure.

```js

const doAjaxRequest = (url) => {
  // some ajax
};

const myFunc = (doAjaxRequest) => {
  return doAjaxRequest('url').then((response) => {
    return 'something';
  });
};

```

As you can see in this code example `myFunc` is a pure function (when given a pure function). This allows it to be easily tested if you pass in a pure stub.

## Usage

```js

// Codebase
export const leaf = () => 'leaf';

export const node = (leaf) => leaf();

// Your wiring up code (usually in index.js or module.js)
import pat from 'partial-application-tree';
import { leaf, node } from './code';

const tree = [
  ['node', ['leaf']]
];

const codebase = pat(tree, {
  leaf,
  node,
});

```

There is added support for nested nodes. The paths are automatically resolved.

```js
const tree = [
  ['nested.node', ['deep.leaf']]
];
```