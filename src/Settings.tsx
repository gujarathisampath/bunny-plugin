import { React, url, clipboard } from "@vendetta/metro/common";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { fetchData } from "./index";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { showInputAlert } from "@vendetta/ui/alerts";
import ColorSelector from "./components/ColorSelector";

const { ScrollView, TextInput, View } = General;
const { FormSection, FormRow, FormSwitchRow, FormRadioRow } = Forms;

export default () => {
  useProxy(storage);

  const encode = (primary: number, accent: number): string => {
    const message = `[#${primary.toString(16).padStart(6, "0")},#${accent
      .toString(16)
      .padStart(6, "0")}]`;
    const padding = "";
    const encoded = Array.from(message)
      .map((x) => x.codePointAt(0))
      .filter((x) => x! >= 0x20 && x! <= 0x7f)
      .map((x) => String.fromCodePoint(x! + 0xe0000))
      .join("");

    return (padding || "") + " " + encoded;
  };

  const copyEncodedColor = async () => {
    try {
      const primaryHex = storage.sw_primary?.padStart(6, "0") || "000000";
      const accentHex = storage.sw_accent?.padStart(6, "0") || "000000";

      if (
        !/^[0-9A-Fa-f]{6}$/.test(primaryHex) ||
        !/^[0-9A-Fa-f]{6}$/.test(accentHex)
      ) {
        throw new Error("Invalid hex color");
      }

      const encoded = encode(parseInt(primaryHex, 16), parseInt(accentHex, 16));

      clipboard.setString(encoded);
      showToast("Copied to clipboard!", getAssetIDByName("check"));
    } catch (e) {
      showToast(`Failed to copy 3y3 color`, getAssetIDByName("small"));
    }
  };

  return (
    <ScrollView>
      <FormSection title="Settings">
        <FormSwitchRow
          label="Enable profile effects"
          subLabel="If enabled, profile effects will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_effects}
          onValueChange={(value: boolean) => (storage.sw_effects = value)}
        />
        <FormSwitchRow
          label="Enable profile themes"
          subLabel="If enabled, profile themes will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_themes}
          onValueChange={(value: boolean) => (storage.sw_themes = value)}
        />
        <FormSwitchRow
          label="Enable profile avatar decoration"
          subLabel="If enabled, profile avatar decoration will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_decorations}
          onValueChange={(value: boolean) => (storage.sw_decorations = value)}
        />
        <FormSwitchRow
          label="Enable profile banners"
          subLabel="If enabled, profile effects will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_banners}
          onValueChange={(value: boolean) => (storage.sw_banners = value)}
        />
        <FormSwitchRow
          label="Enable profile avatars"
          subLabel="If enabled, profile avatars will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_avatars}
          onValueChange={(value: boolean) => (storage.sw_avatars = value)}
        />
        <FormSwitchRow
          label="Enable custom badges"
          subLabel="If enabled, custom badges will load up."
          leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
          value={storage.sw_badges}
          onValueChange={(value: boolean) => (storage.sw_badges = value)}
        />
      </FormSection>
      <FormSection title="3y3 Colors">
        <FormRow
          label="Primary Color"
          subLabel={`Current: ${storage.sw_primary || "none"}`}
          leading={
            <FormRow.Icon source={getAssetIDByName("ic_message_edit")} />
          }
          onPress={() => {
            showInputAlert({
              title: "Enter Primary Color",
              placeholder: "ff0000",
              initialValue: storage.sw_primary,
              onConfirm: (value) => {
                storage.sw_primary = value;
              },
            });
          }}
        />
        <FormRow
          label="Accent Color"
          subLabel={`Current: ${storage.sw_accent || "none"}`}
          leading={
            <FormRow.Icon source={getAssetIDByName("ic_message_edit")} />
          }
          onPress={() => {
            showInputAlert({
              title: "Enter Accent Color",
              placeholder: "00ff00",
              initialValue: storage.sw_accent,
              onConfirm: (value) => {
                storage.sw_accent = value;
              },
            });
          }}
        />
        <FormRow
          label="Copy 3y3"
          subLabel="Copy encoded color string"
          leading={<FormRow.Icon source={getAssetIDByName("copy")} />}
          onPress={copyEncodedColor}
        />
      </FormSection>
      <FormSection title="Extras">
        <FormRow
          label="Discord Server"
          subLabel="Join to Discord server for request profile avatar/banner/badge and choose decorations and effects."
          leading={<FormRow.Icon source={getAssetIDByName("Discord")} />}
          trailing={FormRow.Arrow}
          onPress={() => url.openDeeplink("https://discord.gg/ffmkewQ4R7")}
        />
        <FormRow
          label="Refetch fakeProfile"
          leading={
            <FormRow.Icon source={getAssetIDByName("ic_message_retry")} />
          }
          trailing={FormRow.Arrow}
          onPress={async () => {
            const fetch = await fetchData();
            if (!fetch)
              return showToast(
                "Failed to refetch fakeProfile",
                getAssetIDByName("small")
              );
            return showToast(
              "Refetched fakeProfile",
              getAssetIDByName("check")
            );
          }}
        />
      </FormSection>
    </ScrollView>
  );
};
