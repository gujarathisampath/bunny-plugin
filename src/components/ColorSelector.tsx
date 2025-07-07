import { React, ReactNative as RN, stylesheet } from "@vendetta/metro/common";
const { View, TouchableOpacity, Text } = RN;

const COLORS = [
  { hex: "FF0000", name: "Red" },
  { hex: "00FF00", name: "Green" },
  { hex: "0000FF", name: "Blue" },
  { hex: "FFFF00", name: "Yellow" },
  { hex: "FF00FF", name: "Magenta" },
  { hex: "00FFFF", name: "Cyan" },
  { hex: "FFFFFF", name: "White" },
  { hex: "000000", name: "Black" },
];

const styles = stylesheet.createThemedStyleSheet({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 8,
    borderWidth: 2,
  },
  selected: {
    borderColor: "#fff",
  },
  unselected: {
    borderColor: "transparent",
  },
});

interface ColorSelectorProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color.hex}
          onPress={() => onChange(color.hex)}
          style={[
            styles.colorBox,
            { backgroundColor: `#${color.hex}` },
            value === color.hex ? styles.selected : styles.unselected,
          ]}
          accessibilityLabel={color.name}
        />
      ))}
    </View>
  );
}