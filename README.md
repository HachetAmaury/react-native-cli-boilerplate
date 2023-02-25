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
