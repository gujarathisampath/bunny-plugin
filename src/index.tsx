import { logger, version } from "@vendetta";
import { safeFetch } from "@vendetta/utils";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./Settings";
import {
  AvatarDecorationUtils,
  ImageResolver,
  UserProfileStore,
  UserStore,
  getProfileEffectStore,
  getUserAvatar,
  getUserBannerURL,
  profileBadges,
} from "./lib/userProps";
import { after, instead } from "@vendetta/patcher";
import {
  AvatarDecoration,
  BadgeProps,
  ProfileEffectConfig,
  UserProfile,
  UserProfileData,
} from "./lib/types";
import {
  API_URL,
  BASE_URL,
  SKU_ID,
  SKU_ID_DISCORD,
} from "./lib/constants";
import {
  ReactNative as RN,
  ReactNative,
} from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { BadgeComponent } from "./ui/badgeComponent";
import { getAssetIDByName } from "@vendetta/ui/assets";
const { View } = RN;

let data = {} as Record<string, UserProfileData>;
let CustomEffects = {} as Record<string, ProfileEffectConfig>;
let patches = [];
let userBadges = [] as Record<string, BadgeProps[]>;
let decorationsData = {} as Record<string, AvatarDecoration>;

export const fetchData = async () => {
  try {
    data = await (await safeFetch(API_URL, { cache: "no-store" })).json();
    CustomEffects = await (
      await safeFetch(BASE_URL + "/profile-effects", { cache: "no-store" })
    ).json();
    userBadges = await (
      await safeFetch(BASE_URL + "/badges", { cache: "no-store" })
    ).json();
    const decors = await (
      await safeFetch(BASE_URL + "/decorations", { cache: "no-store" })
    ).json();
    decorationsData = Object.fromEntries(
      decors.map((decor: AvatarDecoration) => [
        decor.asset,
        {
          asset: decor.asset,
          skuId: decor.skuId,
          animated: decor.animated,
        },
      ])
    );
    return data;
  } catch (e) {
    logger.error("Failed to fetch fakeProfile data", e);
  }
};
function encode(primary: number, accent: number): string {
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
}

function decode(bio: string): Array<number> | null {
  if (bio == null) return null;
  const colorString = bio.match(
    /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u
  );
  if (colorString != null) {
    const parsed = [...colorString[0]]
      .map((x) => String.fromCodePoint(x.codePointAt(0)! - 0xe0000))
      .join("");
    const colors = parsed
      .substring(1, parsed.length - 1)
      .split(",")
      .map((x) => parseInt(x.replace("#", "0x"), 16));

    return colors;
  } else {
    return null;
  }
}

export const onLoad = async () => {
  await fetchData();

  patches.push(
    after(
      "getUserProfile",
      UserProfileStore,
      (_args, profile: UserProfile | undefined) => {
        if (!profile) return profile;
        const colors = decode(profile.bio);
        if (data[profile.userId]?.profileEffectId && storage.sw_effects) {
          profile.profileEffectId = profile.profileEffectID =
            data[profile.userId]?.profileEffectId;
          profile.premiumType = 2;
        }
        if (colors && storage.sw_themes) {
          profile.themeColors = colors;
          profile.premiumType = 2;
        }
        return profile;
      }
    )
  );
  patches.push(
    after("getUserAvatarURL", getUserAvatar, ([{ id }, animate]) => {
      if (data[id] && data[id].avatar && storage.sw_avatars) {
        const avatarURL = data[id].avatar.toString();
        if (animate) {
          return avatarURL;
        } else {
          const parsedUrl = new URL(avatarURL);
          const imageName = parsedUrl.pathname
            .split("/")
            .pop()
            .replace("a_", "");
          return `${BASE_URL}/image/${imageName}`;
        }
      }
    })
  );
  patches.push(
    after("getUserAvatarSource", getUserAvatar, ([{ id }, animate], ret) => {
      if (data[id] && data[id].avatar && storage.sw_avatars) {
        const avatarURL = data[id].avatar.toString();
        if (animate) {
          return { uri: avatarURL };
        } else {
          const parsedUrl = new URL(avatarURL);
          const imageName = parsedUrl.pathname
            .split("/")
            .pop()
            .replace("a_", "");
          return { uri: `${BASE_URL}/image/${imageName}` };
        }
      }
    })
  );
  patches.push(
    after("getUserBannerURL", getUserBannerURL, ([user]) => {
      const customBanner = Object.entries(data).find(
        (userId) => userId[0] === user?.id
      );
      if (user?.banner === undefined && customBanner && storage.sw_banners) {
        return data[user?.id]?.banner;
      }
    })
  );
  patches.push(
    after("getProfileEffectById", getProfileEffectStore, (skuId, effects) => {
      return CustomEffects[skuId];
    })
  );
  patches.push(
    after("getUser", UserStore, (_, user) => {
      if (
        user &&
        data[user?.id] &&
        data[user?.id].decoration &&
        storage.sw_decorations
      ) {
        const decoration = data[user?.id];
        if (decoration?.decoration) {
          const decor = decorationsData[decoration.decoration];
          user.avatarDecoration = {
            asset: decor.asset,
            skuId: decor?.skuId,
          };
        }
        user.avatarDecorationData = user.avatarDecoration;
      }
    })
  );

  patches.push(
    instead("getAvatarDecorationURL", ImageResolver, (args, orig) => {
      const [{ avatarDecoration, canAnimate }] = args;
      
      if (avatarDecoration?.skuId === SKU_ID) {
        const parts = avatarDecoration.asset.split("_");
        if (!canAnimate && parts[0] === "a") parts.shift();
        return (
          BASE_URL + "/avatar-decoration-presets" + `/${parts.join("_")}.png`
        );
      } else if (avatarDecoration?.skuId === SKU_ID_DISCORD) {
        const parts = avatarDecoration.asset.split("_");
        if (!canAnimate && parts[0] === "a") parts.shift();
        return (
          "https://cdn.discordapp.com/avatar-decoration-presets/" +
          `/${parts.join("_")}.png`
        );
      } else {
        return orig(...args);
      }
    })
  );

  patches.push(
    after(
      "isAnimatedAvatarDecoration",
      AvatarDecorationUtils,
      ([avatarDecoration], _) => {
        if (
          ReactNative.Platform.OS === "ios" &&
          avatarDecoration?.asset?.startsWith("file://")
        )
          return true;
      }
    )
  );

  const propHolder = {} as Record<string, any>;

  patches.push(
    after("default", profileBadges, ([user], ret) => {
      if (!storage.sw_badges) return ret;
      const userId = user?.userId;
      const usersBadges = userBadges[userId];
      if (!usersBadges?.length) return ret;

      return [
        ...usersBadges.map((badge, i) => ({
          id: `fakeprofile-${userId}-${i}`,
          icon: badge.badge,
          description: badge.tooltip,
        })),
        ...(Array.isArray(ret) ? ret : []),
      ];
    })
  );

  setInterval(async () => {
    await fetchData();
  }, 3600000);
};

export const onUnload = () => patches.forEach((unpatch) => unpatch());
export const settings = Settings;
