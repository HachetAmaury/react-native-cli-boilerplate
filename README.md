# react-native-cli-boilerplate

A boilerplate for react-native-cli projects.

## Getting Started

## 1. React Native & Typescript

Project initialized with react-native-cli

```bash
npx react-native@latest init ReactNativeCliBoilerplate
```

## 2. Styled Components

```bash
yarn add styled-components && yarn add -D @types/styled-components-react-native
```

Edit tsconfig.json to add this

```json
{
  (...)
  "compilerOptions": {
    "types": ["@types/styled-components-react-native"]
   }
}
```

## 3. Storybook

### Install Storybook

```bash
npx -p @storybook/cli sb init --type react_native
```

When asked press y to install storybook server

### To prevent this error :

```bash
RangeError: Maximum call stack size exceeded (native stack depth)
```

Change [this](https://stackoverflow.com/questions/71425926/storybook-react-native-ios-rangeerror-maximum-call-stack-size-exceeded-nat) in metro.config.js file :

```bash
// metro.config.js

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false, // <--- set this to false
      },
    }),
  },
};
```

### To prevent this async storage warning :

```bash
Starting Storybook v5.3.0, we require to manually pass an asyncStorage prop. Pass null to disable or use one from @react-native-community or react-native itself.\n\nMore info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage
```

Following [this](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage), install react-native-async-storage/async-storage :

```bash
yarn add  @react-native-async-storage/async-storage
```

And add this to storybook/index.js :

```js
// storybook/index.js

const StorybookUIRoot = getStorybookUI({
  (...)
  asyncStorage: require('@react-native-async-storage/async-storage').default,
});
```

### To fix futur error when launching the app on ios after using async-storage

```bash
cd ios && pod install
```

### To fix bug where the website was loading forever even when Android app was running with storybook

```js
// storybook/index.js
const StorybookUIRoot = getStorybookUI({
 (...)
 host: Platform.OS === 'android' ? '10.0.2.2' : '0.0.0.0'
});
```

### Import Storybook in your app

With React Native, storybook can be imported as a component or run in place of the app.

Edit index.js to import storybook and replace the app :

```js
// index.js

let RegisteredApp = App;
RegisteredApp = __DEV__ ? require('./storybook').default : App;
// ^ comment this line if you don't want to use Storybook

AppRegistry.registerComponent(appName, () => RegisteredApp);
```

### Import stories from any directory

Install react-native-storybook-loader

```bash
yarn add -D react-native-storybook-loader
```

Edit package.json

```json
{
  "scripts": {
    (...)
    "prestorybook": "rnstl"
  },
  (...)
  "config": {
    "react-native-storybook-loader": {
      "searchDir": ["./src/components"], // change with your directory
     "pattern": "**/*.stories.tsx", // change with your pattern
      "outputFile": "./storybook/storyLoader.js"
    }
  },
}
```

Edit storybook/index.js

```js

import { loadStories } from './storyLoader';

(...)

configure(() => {
    loadStories();
}, module);

```

Now running this command, storyLoader.js file will be created to import all stories from the 'searchDir' directory.

```bash
yarn prestorybook
```

[Source_01](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/)
[Source_02](https://www.netguru.com/blog/storybook-in-react-native)
[Source_03](https://dev.to/risafj/setting-up-storybook-for-react-native-typescript-server-loader-ios-android-3b0i)

Create src/components/Button.tsx and add this

```js
// src/components/Button.tsx

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Button = ({
  label,
  onPress,
  style,
  textColor = '#ffffff',
  backgroundColor = '#95C4CB',
  fill = false,
  ...rest
}) => (
  <TouchableOpacity
    {...rest}
    onPress={onPress}
    activeOpacity={0.75}
    style={fill ? {flex: 1} : {}}>
    <View style={[s.wrapper, {backgroundColor}, style]}>
      <Text style={[s.label, {color: textColor}]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default Button;

const s = StyleSheet.create({
  wrapper: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

And a Button.stories.tsx file in ./src/components/stories/ directory

```js
// ./src/components/stories/Button.stories.tsx

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import {action} from '@storybook/addon-actions';
import {object, text, color, boolean} from '@storybook/addon-knobs';
import Button from '../Button';

storiesOf('Button', module)
  .addDecorator(story => <View style={s.decorator}>{story()}</View>)
  // 👇 you can add multiple variants of component, here's variant with name 'default'
  .add('default', () => (
    <Button
      onPress={action('onPress')} // 👈 action
      // 👇 knobs
      label={text('label', 'Button label')}
      style={object('style')}
      textColor={color('textColor', '#ffffff')}
      backgroundColor={color('backgroundColor', '#95C4CB')}
      fill={boolean('fill', false)}
    />
  ));

const s = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
```

After running

```bash
yarn storybook
```

storybook/storyLoader.js file will be created or updated

```js
function loadStories() {
  require('../src/components/Button/Button.stories');
}

const stories = ['../src/components/Button/Button.stories'];

module.exports = {
  loadStories,
  stories,
};
```

To run storybook and start developping you can now run those commands in different terminals :

```bash
yarn storybook
yarn start
yarn <platform>
```

Note that if you add a new story you have to run yarn prestorybook to update storyLoader.js file.

```bash
yarn prestorybook
```

When storybook is lauched on ios and/or android you can see the storybook UI on your browser at http://localhost:7007.
This UI is very useful to see all the stories and to test them.
Each change you make in the UI will be reflected in both app, selecting a story, changing some props...
