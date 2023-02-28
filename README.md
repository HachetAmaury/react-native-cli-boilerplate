# react-native-cli-boilerplate

A boilerplate for react-native-cli projects.

# Get it running

## 1. Clone the repo

```bash
 git clone https://github.com/HachetAmaury/react-native-cli-boilerplate.git <your-project-name>
```

```bash
cd <your-project-name>
```

## 2. Install dependencies

```bash
yarn install
```

## 3. Install ios dependencies

```bash
cd ios
bundle install
pod install
```

# To develop a new component

## 1. Create a new folder in src/components

## 2. Create a new file with the name of your component

## 3. Create a new file with the name of your component + .stories.tsx

## 4. Run the storybook server

```bash
yarn storybook
```

## 5. Run the app on ios or android

Make sure that storybook is added inside the app

```js
// index.js

let RegisteredApp = App;
RegisteredApp = __DEV__ ? require('./storybook').default : App;
```

Then run the app

```bash
yarn ios
```

```bash
yarn android
```

Browse to http://localhost:7007 to see your component in the app

## 5. Create a new file with the name of your component + .test.tsx

## 6. Run the tests

```bash
yarn test:watch
```

Start developping your component in TDD testing the component with jest and storybook without having to run the app.

# Detailed installation process

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

## 4. React Native Testing Library

### Install

```bash
yarn add -D @testing-library/react-native @testing-library/jest-native @testing-library/jest-dom
```

Edit tsconfig.json

```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "types": [
      (...)
      "@types/jest" // add this line
      "@testing-library/jest-dom" // add this line
      ]
  }
}

```

Create file setupTests.js at the root of the project

```js
import '@testing-library/jest-native/extend-expect';
```

Create jest.config.js

```js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/setupTests.js',
  ],
};
```

Edit package.json

```json
{
  "scripts": {
    (...)
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Edit tsconfig.json

```json
{
  (...)
  "compilerOptions": {
    "types": [
      (...)
      "@types/jest" // add this line
      "@testing-library/jest-dom" // add this line
      ]
  }
}

```

### Create a test

Create a file Button.tests.tsx in ./src/components/\_\_tests\_\_/ directory

```js
// ./src/components/__tests__/Button.test.tsx

import React from 'react';

import {render, fireEvent} from '@testing-library/react-native';

import Button from '../Button';

describe('<Button />', () => {
  it('should render correctly with right text', () => {
    const {getByText} = render(
      <Button label="Button label" onPress={() => console.log('pressed')} />,
    );

    const button = getByText('Button label');

    expect(button).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <Button label="Button label" onPress={onPress} />,
    );

    fireEvent.press(getByTestId('button'));

    expect(onPress).toHaveBeenCalled();
  });

  it('should render correctly with fill', () => {
    const {getByTestId} = render(
      <Button
        label="Button label"
        onPress={() => console.log('pressed')}
        fill
      />,
    );

    const button = getByTestId('button');

    expect(button.props.style.flex).toEqual(1);
  });

  it('should display the correct text color', () => {
    const {getByText} = render(
      <Button
        label="Button label"
        onPress={() => console.log('pressed')}
        textColor="red"
      />,
    );

    const text = getByText('Button label');

    expect(text.props.style.color).toEqual('red');
  });

  it('should display the correct background color', () => {
    const {getByTestId} = render(
      <Button
        label="Button label"
        onPress={() => console.log('pressed')}
        backgroundColor="#95C4CB"
        style={{}}
      />,
    );

    const button = getByTestId('button');

    expect(button.children[0].props.style.backgroundColor).toEqual('#95C4CB');
  });

  it('should add the correct style', () => {
    const {getByTestId} = render(
      <Button
        label="Button label"
        onPress={() => console.log('pressed')}
        backgroundColor="#95C4CB"
        style={{
          borderWidth: 1,
          borderColor: 'red',
        }}
      />,
    );

    const button = getByTestId('button');

    expect(button.children[0].props.style.borderWidth).toEqual(1);
    expect(button.children[0].props.style.borderColor).toEqual('red');
  });
});
```
