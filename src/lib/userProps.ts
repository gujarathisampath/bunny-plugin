import { findByName, findByProps, findByStoreName } from "@vendetta/metro";

export const getUserBannerURL = findByProps("default", "getUserBannerURL")
export const UserStore = findByStoreName('UserStore');
export const ImageResolver = findByProps('getAvatarDecorationURL', 'default');
export const AvatarDecorationUtils = findByProps('isAnimatedAvatarDecoration');
export const profileBadges = findByName("useBadges", false);
export const UserProfileStore = findByStoreName("UserProfileStore");
export const getUserAvatar = findByProps("getUserAvatarURL", "getUserAvatarSource");
export const getProfileEffectStore = findByProps("getProfileEffectById");