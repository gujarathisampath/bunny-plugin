import { logger, version } from "@vendetta";
import { safeFetch } from "@vendetta/utils";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./Settings";
import { AvatarDecorationUtils, ImageResolver, UserProfileStore, UserStore, getUserAvatar, getUserBannerURL, profileBadges } from "./lib/userProps";
import { after, instead } from "@vendetta/patcher";
import { BadgeProps, CustomBadges, FakeProfileData, UserProfile, UserProfileData } from "./lib/types";
import { API_URL, BASE_URL, SKU_ID, SKU_ID_DISCORD, VERSION } from "./lib/constants";
import { ReactNative as RN, React, ReactNative, toasts } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { BadgeComponent } from "./ui/badgeComponent";
const { View } = RN;

let data = {} as Record<string, UserProfileData>;
let fakeProfileData:FakeProfileData = {}; // {version,reloadInterval,name}
let patches = [];

export const fetchData = async () => {
    try {
        fakeProfileData = await (await safeFetch(BASE_URL+"/fakeProfile", { cache: "no-store" })).json();
        data = await (await safeFetch(API_URL, { cache: "no-store" })).json();
        return data;
        
    } catch (e) {
        logger.error("Failed to fetch fakeProfile data", e);
    }
}
function encode(primary: number, accent: number): string {
    const message = `[#${primary.toString(16).padStart(6, "0")},#${accent.toString(16).padStart(6, "0")}]`;
    const padding = "";
    const encoded = Array.from(message)
        .map(x => x.codePointAt(0))
        .filter(x => x! >= 0x20 && x! <= 0x7f)
        .map(x => String.fromCodePoint(x! + 0xe0000))
        .join("");

    return (padding || "") + " " + encoded;
}

function decode(bio: string): Array<number> | null {
    if (bio == null) return null;
    const colorString = bio.match(
        /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u,
    );
    if (colorString != null) {
        const parsed = [...colorString[0]]
            .map(x => String.fromCodePoint(x.codePointAt(0)! - 0xe0000))
            .join("");
        const colors = parsed
            .substring(1, parsed.length - 1)
            .split(",")
            .map(x => parseInt(x.replace("#", "0x"), 16));

        return colors;
    } else {
        return null;
    }
}

export const onLoad = async () => {
    await fetchData()
    
    if (!data) return showToast("Failed to load fakeProfile data.")
    if (fakeProfileData?.version != VERSION) return showToast("A new version of the fakeProfile plugin is available. Please update as soon as possible.")
    
        patches.push(
            after("getUserProfile", UserProfileStore, (_args, profile: UserProfile | undefined) => {
                if(!profile) return profile;
                const colors = decode(profile.bio);
                if(data[profile.userId]?.profile_effect && storage.sw_effects){
                    profile.profileEffectId = profile.profileEffectID = data[profile.userId]?.profile_effect;
                    profile.premiumType = 2;
                }
                if(colors && storage.sw_themes){
                    profile.themeColors = colors;
                    profile.premiumType = 2;
                }
                return profile;
            })
        );
        patches.push(
        after("getUserAvatarURL", getUserAvatar, ([{ id }, animate]) =>{
            if (data[id] && data[id]?.avatar && storage.sw_avatars){
                if(animate){
                    return data[id]?.avatar?.toString();
                } else {
                    const parsedUrl = new URL(data[id]?.avatar?.toString());
                    const image_name = parsedUrl.pathname.split("/").pop()?.replace("a_", "");
                    return BASE_URL+"/image/"+image_name;
                }
            };
        }));
        patches.push(
        after("getUserAvatarSource", getUserAvatar, ([{ id }, animate], ret) => {
            if (data[id] && data[id]?.avatar && storage.sw_avatars){
                if(animate){
                    return data[id]?.avatar?.toString();
                } else {
                    const parsedUrl = new URL(data[id]?.avatar?.toString());
                    const image_name = parsedUrl.pathname.split("/").pop()?.replace("a_", "");
                    return BASE_URL+"/image/"+image_name;
                }
            };
        }));
        patches.push(after("getUserBannerURL", getUserBannerURL, ([user]) => {
            const customBanner = Object.entries(data).find(userId => userId[0] === user?.id)
            if (user?.banner === undefined && customBanner && storage.sw_banners) {
                return data[user?.id]?.banner;
        }}));
        patches.push(
			after('getUser', UserStore, (_, user) => {
				if (user && data[user?.id] && data[user?.id].decoration && storage.sw_decorations) {
					const decoration = data[user?.id];
		
					if (decoration?.decoration) {
						user.avatarDecoration = {
							asset: decoration.decoration.asset,
							skuId: decoration?.decoration.skuId
						};
					}
					user.avatarDecorationData = user.avatarDecoration;
				}
			})
		);

		patches.push(
			instead('getAvatarDecorationURL', ImageResolver, (args, orig) => {
				const [{avatarDecoration, canAnimate}] = args;
				if (avatarDecoration?.skuId === SKU_ID) {
					const parts = avatarDecoration.asset.split("_");
					if (!canAnimate && parts[0] === "a") parts.shift();
					return BASE_URL + "/avatar-decoration-presets" + `/${parts.join("_")}.png`;
				} else if (avatarDecoration?.skuId === SKU_ID_DISCORD) {
					const parts = avatarDecoration.asset.split("_");
					if (!canAnimate && parts[0] === "a") parts.shift();
					return "https://cdn.discordapp.com/avatar-decoration-presets/" + `/${parts.join("_")}.png`;
				} else {
					return orig(...args);
				}
			})
		);

		patches.push(
			after('isAnimatedAvatarDecoration', AvatarDecorationUtils, ([avatarDecoration], _) => {
				if (ReactNative.Platform.OS === 'ios' && avatarDecoration?.asset?.startsWith('file://')) return true;
			})
		);
        patches.push(
            after("default", profileBadges, (args, res) => {
                let mem = res;
                const user = args[0]?.user;
                const usersBadges = data[user?.id]?.badges
                if (!user) return;
                if(!storage.sw_badges) return;
                if(!usersBadges) return;
                const style = mem?.props?.style
                if (!mem) {
                    mem = <View
                      style={[style, {
                        flexDirection: "row",
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        paddingVertical: 2
                      }]}
                      accessibilityRole={"list"}
                      accessibilityLabel={"User Badges"}
                    />;
            
                    mem.props.children = [];
                }
                const pushBadge = ({ name, image, custom = false }: BadgeProps) => {
                    const RenderableBadge = () => <BadgeComponent
                      custom={custom}
                      name={name}
                      image={image}
                      size={Array.isArray(style) ? style?.find(r => r.paddingVertical && r.paddingHorizontal) ? 16 : 22 : 16}
                      margin={Array.isArray(style) ? 4 : 6}
                    />;
                    const positionleft = true;
                    if (mem?.props?.badges) positionleft ? mem.props.badges = [<RenderableBadge />, ...mem.props.badges] : mem.props.badges = [...mem.props.badges, <RenderableBadge />];
                    else positionleft ? mem.props.children = [<RenderableBadge />, ...mem.props.children] : mem.props.children = [...mem.props.children, <RenderableBadge />];
                                
                }   
                usersBadges.map((badge: CustomBadges) => {
                    pushBadge({
                    name: badge.description,
                    image: badge.icon,
                    });
                });
            })
    
        )
        setInterval(async () => {
            await fetchData();
        }, fakeProfileData?.reloadInterval);

}

export const onUnload = () => patches.forEach((unpatch) => unpatch());
export const settings = Settings;