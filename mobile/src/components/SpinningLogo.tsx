import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const logoDark = require("../../assets/ace_dsa_dark.png");
const logoLight = require("../../assets/ace_dsa_light.png");

export interface SpinningLogoHandle {
  spin: () => void;
}

interface Props {
  size?: number;
}

const SpinningLogo = forwardRef<SpinningLogoHandle, Props>(
  ({ size = 240 }, ref) => {
    const { isDark } = useTheme();

    const spinValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(0)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;
    const floatValue = useRef(new Animated.Value(0)).current;
    const shadowValue = useRef(new Animated.Value(0)).current;

    const spinOnce = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }).start();
    };

    useImperativeHandle(ref, () => ({ spin: spinOnce }));

    useEffect(() => {
      spinValue.setValue(0);
      scaleValue.setValue(0);
      fadeValue.setValue(0);

      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(1.15)),
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start(() => {
        startFloat();
      });
    }, []);

    const startFloat = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(floatValue, {
              toValue: -6,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(shadowValue, {
              toValue: 1,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(floatValue, {
              toValue: 6,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(shadowValue, {
              toValue: 0,
              duration: 1800,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    const spinInterp = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const shadowOpacity = shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.08, 0.2],
    });

    const shadowScale = shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.92],
    });

    return (
      <Animated.View
        style={[
          styles.outerWrap,
          { width: size, height: size + 20, opacity: fadeValue },
        ]}
      >
        <Animated.View
          style={[
            styles.logoWrap,
            {
              width: size,
              height: size,
              transform: [
                { translateY: floatValue },
                { rotate: spinInterp },
                { scale: scaleValue },
              ],
            },
          ]}
        >
          <Image
            source={isDark ? logoDark : logoLight}
            style={{ width: size, height: size }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.shadow,
            {
              opacity: shadowOpacity,
              transform: [{ scaleX: shadowScale }],
            },
          ]}
        />
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  outerWrap: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    width: 80,
    height: 10,
    borderRadius: 40,
    backgroundColor: "#000",
    marginTop: 2,
  },
});

export default SpinningLogo;
