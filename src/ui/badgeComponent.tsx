import { ReactNative as RN, stylesheet, toasts, React } from "@vendetta/metro/common";
import { BadgeComponents } from "../lib/types";
import { showToast } from "@vendetta/ui/toasts";

const { View, Image, TouchableOpacity } = RN;

export const BadgeComponent = ({ name, image, size, margin, custom }: BadgeComponents) => {

    const styles = stylesheet.createThemedStyleSheet({
        container: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
        },
        img: {
            width: size,
            height: size,
            resizeMode: "contain",
            marginHorizontal: margin
        }
    });

    const renderBadge = () => {
        if (custom) {
            return (custom)
        } else {
            return (
                <TouchableOpacity onPress={() =>showToast(name)}>
                    <Image style={styles.img} source={{ uri: image }} />
                </TouchableOpacity>
            )
        }
    }
    
    return (
        <View style={styles.container}>
            {renderBadge()}
        </View>
    )
}