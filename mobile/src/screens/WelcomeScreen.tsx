import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SpinningLogo from "../components/SpinningLogo";

export default function WelcomeScreen() {
  const { completeWelcome } = useAuth();
  const { colors, isDark } = useTheme();

  // Text comes "closer and closer" (scale + slight rise).
  const textScale = useRef(new Animated.Value(0.82)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(10)).current;

  // Dots: enter from off-screen, then orbit around the logo + welcome text.
  const enterLead = useRef(new Animated.Value(0)).current; // 0..1 for line travel
  const orbit = useRef(new Animated.Value(0)).current; // 0..1 around circle

  // Slide out to landing.
  const exitX = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  const dotSoft = useMemo(() => {
    if (isDark) return "rgba(45,212,191,0.28)";
    return "rgba(0,0,0,0.10)";
  }, [isDark]);

  useEffect(() => {
    // Start blank, then text zooms in.
    const intro = Animated.parallel([
      Animated.timing(textOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(textY, { toValue: 0, duration: 420, useNativeDriver: true }),
      Animated.spring(textScale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]);

    // Dots move in on a straight line, then orbit like a normal loader.
    enterLead.setValue(0);
    orbit.setValue(0);

    const enter = Animated.timing(enterLead, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    // Spin a bit like a real loader before transitioning away.
    const spin = Animated.timing(orbit, {
      toValue: 1,
      duration: 2100,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const exit = Animated.parallel([
      Animated.timing(exitX, {
        toValue: 1,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(exitOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]);

    const seq = Animated.sequence([
      Animated.delay(60),
      intro,
      Animated.delay(90),
      enter,
      spin,
      Animated.delay(80),
      exit,
    ]);

    seq.start(({ finished }) => {
      if (finished) completeWelcome();
    });

    return () => {
      seq.stop();
    };
  }, [
    completeWelcome,
    enterLead,
    exitOpacity,
    exitX,
    orbit,
    textOpacity,
    textScale,
    textY,
  ]);

  const screenTranslateX = exitX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 520],
  });

  const ORBIT_R = 120;
  const OFF_X = 560;
  const DOTS_PER_SIDE = 3;
  const PHASE_STEP = Math.PI / 10;
  const LINE_SPACING = 26;

  type DotSpec = {
    key: string;
    baseXSign: 1 | -1;
    phase: number;
    opacity: number;
    scale: number;
  };

  const dots = useMemo<DotSpec[]>(() => {
    const specs: DotSpec[] = [];
    for (let i = 0; i < DOTS_PER_SIDE; i++) {
      const trail = i * PHASE_STEP;
      const fade = 1 - i * 0.22;
      const scale = 1 - i * 0.08;
      // Both sides orbit counter-clockwise; we just start them on different sides.
      // Left dots start on the left (π), right dots start on the right (0).
      specs.push({
        key: `L${i}`,
        baseXSign: -1,
        phase: Math.PI + trail,
        opacity: Math.max(0.45, fade),
        scale: Math.max(0.78, scale),
      });
      specs.push({
        key: `R${i}`,
        baseXSign: 1,
        phase: 0 - trail,
        opacity: Math.max(0.45, fade),
        scale: Math.max(0.78, scale),
      });
    }
    return specs;
  }, []);

  const dotPaths = useMemo(() => {
    const segs = 36;

    const buildOrbit = (spec: DotSpec) => {
      const inp: number[] = [];
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        // Counter-clockwise orbit in screen coordinates.
        const ang = (Math.PI * 2 * t) + spec.phase;
        inp.push(t);
        xs.push(Math.cos(ang) * ORBIT_R);
        ys.push(-Math.sin(ang) * ORBIT_R);
      }
      return { inp, xs, ys };
    };

    return dots.map((d) => ({ spec: d, orbitPath: buildOrbit(d) }));
  }, [dots]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.stage,
          {
            opacity: exitOpacity,
            transform: [{ translateX: screenTranslateX }],
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textY }, { scale: textScale }],
            alignItems: "center",
          }}
        >
          <View style={styles.orbitWrap}>
            <View style={styles.centerWrap}>
              <SpinningLogo size={96} />
              <Text style={[styles.welcome, { color: colors.textSecondary }]}>
                Welcome to
              </Text>
              <Text style={[styles.brand, { color: colors.text }]}>Ace DSA</Text>
            </View>

            {dotPaths.map(({ spec, orbitPath }) => {
              const idx = parseInt(spec.key.slice(1), 10) || 0;
              const delay = idx * 0.08;
              const p = enterLead.interpolate({
                inputRange: [0, delay, 1],
                outputRange: [0, 0, 1],
                extrapolate: "clamp",
              });

              // Straight line travel to center (y=0), staggered.
              const startX = spec.baseXSign * (OFF_X + idx * LINE_SPACING);
              const lineX = p.interpolate({
                inputRange: [0, 1],
                outputRange: [startX, 0],
              });

              // Orbit around logo/text once lead dot arrives.
              const orbitX = orbit.interpolate({
                inputRange: orbitPath.inp,
                outputRange: orbitPath.xs,
              });
              const orbitY = orbit.interpolate({
                inputRange: orbitPath.inp,
                outputRange: orbitPath.ys,
              });

              const entered = enterLead.interpolate({
                inputRange: [0.92, 1],
                outputRange: [0, 1],
                extrapolate: "clamp",
              });

              const x = Animated.add(
                Animated.multiply(Animated.subtract(1, entered), lineX),
                Animated.multiply(entered, orbitX)
              );
              const y = Animated.multiply(entered, orbitY);

              return (
                <Animated.View
                  key={spec.key}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: colors.accent,
                      shadowColor: dotSoft,
                      opacity: spec.opacity,
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { scale: spec.scale },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const DOT = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  orbitWrap: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  centerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 6,
  },
  brand: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  dot: {
    position: "absolute",
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
});

