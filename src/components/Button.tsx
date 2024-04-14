import React from 'react';
import {Pressable, ViewStyle, StyleSheet, PressableProps} from 'react-native';

type ButtonVariant = 'outlined' | 'primary';

interface ButtonProps extends PressableProps {
  variant: ButtonVariant;
  onPress: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onPress,
  style,
  children,
  ...props
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    variant === 'outlined' ? styles.outlined : styles.primary,
    style!,
  ];

  const pressedOpacity = variant === 'outlined' ? 0.75 : 0.95;

  return (
    <Pressable
      style={({pressed}) =>
        pressed ? [buttonStyles, {opacity: pressedOpacity}] : buttonStyles
      }
      onPress={onPress}
      {...props}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 62,
    borderRadius: 12,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#2D4795',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: 'white',
  },
});

export default Button;
