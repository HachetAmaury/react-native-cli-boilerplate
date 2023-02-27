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
