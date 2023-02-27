// ./src/components/__tests__/Button.test.tsx

import React from 'react';

import {render, fireEvent} from '@testing-library/react-native';

import Button from '../Button';

describe('<Button />', () => {
  it('should render correctly with right text', () => {
    const {getByTestId} = render(
      <Button label="Button label" onPress={() => console.log('pressed')} />,
    );

    const button = getByTestId('button');

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
