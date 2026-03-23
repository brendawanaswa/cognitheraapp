import Svg, { Path, Line, Circle, Text, Rect, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from "react-native-svg";
import { View } from "react-native";

type Props = {
  size?: "small" | "medium" | "large";
  showTagline?: boolean;
};

export default function TheraCareLogo({ size = "medium", showTagline = false }: Props) {
  const scales = {
    small:  { width: 160, height: 48,  scale: 0.4 },
    medium: { width: 280, height: 84,  scale: 0.7 },
    large:  { width: 400, height: 120, scale: 1.0 },
  };

  const { width, height, scale } = scales[size];

  return (
    <View style={{ width, height }}>
      <Svg viewBox="0 0 400 120" width={width} height={height}>
        <Defs>
          <LinearGradient id="symbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#0D9488" stopOpacity="1" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%"   stopColor="#0D9488" stopOpacity="1" />
            <Stop offset="50%"  stopColor="#0D9488" stopOpacity="1" />
            <Stop offset="50%"  stopColor="#7C3AED" stopOpacity="1" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Outer arc */}
        <Path
          d="M 30 60 A 35 35 0 1 1 95 60"
          stroke="url(#symbolGrad)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* Inner arc */}
        <Path
          d="M 40 60 A 22 22 0 1 1 85 60"
          stroke="#7C3AED"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Vertical line */}
        <Line x1="62" y1="18" x2="62" y2="78" stroke="url(#symbolGrad)" strokeWidth="7" strokeLinecap="round" />
        {/* Horizontal crossbar */}
        <Line x1="40" y1="36" x2="84" y2="36" stroke="url(#symbolGrad)" strokeWidth="7" strokeLinecap="round" />
        {/* Bottom dot */}
        <Circle cx="62" cy="90" r="5" fill="url(#symbolGrad)" />
        {/* Accent dots */}
        <Circle cx="30" cy="60" r="4" fill="#0D9488" opacity="0.8" />
        <Circle cx="95" cy="60" r="4" fill="#7C3AED" opacity="0.8" />

        {/* "thera" in teal */}
        <Text
          x="115"
          y="75"
          fontFamily="Georgia, serif"
          fontSize="46"
          fontWeight="700"
          fill="#0D9488"
          letterSpacing="-1"
        >
          thera
        </Text>

        {/* "care" in purple */}
        <Text
          x="248"
          y="75"
          fontFamily="Georgia, serif"
          fontSize="46"
          fontWeight="700"
          fill="#7C3AED"
          letterSpacing="-1"
        >
          care
        </Text>

        {/* Tagline */}
        {showTagline && (
          <Text
            x="116"
            y="98"
            fontFamily="Georgia, serif"
            fontSize="13"
            fill="#6B7280"
            letterSpacing="3"
            fontStyle="italic"
          >
            your mind matters
          </Text>
        )}

        {/* Gradient underline */}
        <Rect x="115" y="82" width="265" height="2.5" rx="2" fill="url(#textGrad)" opacity="0.3" />
      </Svg>
    </View>
  );
}