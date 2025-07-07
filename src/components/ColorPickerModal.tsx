import { React, ReactNative as RN, stylesheet } from "@vendetta/metro/common";
import { Forms, General } from "@vendetta/ui/components";
import ColorSelector from "./ColorSelector";
const { FormSwitchRow, FormIcon, FormRow } = Forms;
const { View, Text, TouchableOpacity, Modal } = General;

const styles = stylesheet.createThemedStyleSheet({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#2b2d31",
    borderRadius: 8,
    padding: 20,
    minWidth: 300,
    maxWidth: 350,
    margin: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 8,
    backgroundColor: "#1e1f22",
    borderRadius: 6,
  },
  colorBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ffffff20",
  },
  colorText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#4f545c",
  },
  confirmButton: {
    backgroundColor: "#5865f2",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

interface ColorPickerModalProps {
  visible: boolean;
  title: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function ColorPickerModal({
  visible,
  title,
  initialValue = "",
  onConfirm,
  onCancel,
}: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = React.useState(initialValue);

  React.useEffect(() => {
    setSelectedColor(initialValue);
  }, [initialValue, visible]);

  const handleConfirm = () => {
    onConfirm(selectedColor);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onCancel} activeOpacity={1}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.preview}>
            <View 
              style={[
                styles.colorBox, 
                { backgroundColor: selectedColor ? `#${selectedColor}` : "#000000" }
              ]} 
            />
            <RN.TextInput
                style={[styles.colorText, { 
                    backgroundColor: "#1e1f22", 
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    minWidth: 80
                }]}
                value={selectedColor}
                onChangeText={setSelectedColor}
                placeholderTextColor="#666"
                maxLength={6}
                selectionColor="#ffffff"
            />
            </View>

          <ColorSelector value={selectedColor} onChange={setSelectedColor} />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
