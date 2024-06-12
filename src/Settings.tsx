import { React, url } from "@vendetta/metro/common";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { fetchData } from "./index";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";

const { ScrollView } = General;
const { FormSection, FormRow, FormSwitchRow } = Forms;

export default () => {
    useProxy(storage);

    return (

    <ScrollView>
    <FormSection title = "Settings">
        <FormSwitchRow
                label="Enable profile effects"
                subLabel="If enabled, profile effects will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_effects}
                onValueChange={(value: boolean) => storage.sw_effects = value}
        />
        <FormSwitchRow
                label="Enable profile themes"
                subLabel="If enabled, profile themes will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_themes}
                onValueChange={(value: boolean) => storage.sw_themes = value}
        />
        <FormSwitchRow
                label="Enable profile avatar decoration"
                subLabel="If enabled, profile avatar decoration will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_decorations}
                onValueChange={(value: boolean) => storage.sw_decorations = value}
        />
        <FormSwitchRow
                label="Enable profile banners"
                subLabel="If enabled, profile effects will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_banners}
                onValueChange={(value: boolean) => storage.sw_banners = value}
        />
        <FormSwitchRow
                label="Enable profile avatars"
                subLabel="If enabled, profile avatars will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_avatars}
                onValueChange={(value: boolean) => storage.sw_avatars = value}
        />
        <FormSwitchRow
                label="Enable custom badges"
                subLabel="If enabled, custom badges will load up."
                leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                value={storage.sw_badges}
                onValueChange={(value: boolean) => storage.sw_badges = value}
        />
    </FormSection>
    <FormSection title = "Extras">
        <FormRow
            label = "Discord Server"
            subLabel = "Join to Discord server for request profile avatar/banner/badge and choose decorations and effects."
            leading={<FormRow.Icon source={getAssetIDByName("Discord")} />}
            trailing={FormRow.Arrow}
            onPress={() => url.openDeeplink("https://discord.gg/ffmkewQ4R7")}
        />
        <FormRow
            label = "Refetch fakeProfile"
            leading={<FormRow.Icon source={getAssetIDByName("ic_message_retry")} />}
            trailing={FormRow.Arrow}
            onPress={async () => {
                const fetch = await fetchData();
                if (!fetch) return showToast("Failed to refetch fakeProfile", getAssetIDByName("small"))
                return showToast("Refetched fakeProfile", getAssetIDByName("check"))
            }}
        />
    </FormSection>
</ScrollView>)}
