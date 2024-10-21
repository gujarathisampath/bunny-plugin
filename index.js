(function(b,N,_,w,r,U,f,g,d,i,k){"use strict";const{ScrollView:C}=U.General,{FormSection:m,FormRow:c,FormSwitchRow:v}=U.Forms;function V(){return k.useProxy(i.storage),r.React.createElement(C,null,r.React.createElement(m,{title:"Settings"},r.React.createElement(v,{label:"Enable profile effects",subLabel:"If enabled, profile effects will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_effects,onValueChange:function(t){return i.storage.sw_effects=t}}),r.React.createElement(v,{label:"Enable profile themes",subLabel:"If enabled, profile themes will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_themes,onValueChange:function(t){return i.storage.sw_themes=t}}),r.React.createElement(v,{label:"Enable profile avatar decoration",subLabel:"If enabled, profile avatar decoration will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_decorations,onValueChange:function(t){return i.storage.sw_decorations=t}}),r.React.createElement(v,{label:"Enable profile banners",subLabel:"If enabled, profile effects will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_banners,onValueChange:function(t){return i.storage.sw_banners=t}}),r.React.createElement(v,{label:"Enable profile avatars",subLabel:"If enabled, profile avatars will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_avatars,onValueChange:function(t){return i.storage.sw_avatars=t}}),r.React.createElement(v,{label:"Enable custom badges",subLabel:"If enabled, custom badges will load up.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("settings")}),value:i.storage.sw_badges,onValueChange:function(t){return i.storage.sw_badges=t}})),r.React.createElement(m,{title:"Extras"},r.React.createElement(c,{label:"Discord Server",subLabel:"Join to Discord server for request profile avatar/banner/badge and choose decorations and effects.",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("Discord")}),trailing:c.Arrow,onPress:function(){return r.url.openDeeplink("https://discord.gg/ffmkewQ4R7")}}),r.React.createElement(c,{label:"Refetch fakeProfile",leading:r.React.createElement(c.Icon,{source:f.getAssetIDByName("ic_message_retry")}),trailing:c.Arrow,onPress:async function(){return await R()?w.showToast("Refetched fakeProfile",f.getAssetIDByName("check")):w.showToast("Failed to refetch fakeProfile",f.getAssetIDByName("small"))}})))}const j=g.findByProps("default","getUserBannerURL"),F=g.findByStoreName("UserStore"),T=g.findByProps("getAvatarDecorationURL","default"),$=g.findByProps("isAnimatedAvatarDecoration"),x=g.findByName("ProfileBadges",!1),z=g.findByStoreName("UserProfileStore"),B=g.findByProps("getUserAvatarURL","getUserAvatarSource"),O=g.findByProps("getProfileEffectById"),p="https://fakeprofile.is-always.online",W=p+"/v3/users/fakeProfile",q="100101099222222",G="100101099222224",H="v2.5",{View:K,Image:J,TouchableOpacity:M}=r.ReactNative,Q=function(t){let{name:e,image:a,size:n,margin:s,custom:l}=t;const h=r.stylesheet.createThemedStyleSheet({container:{flexDirection:"row",alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"},img:{width:n,height:n,resizeMode:"contain",marginHorizontal:s}}),I=function(){return l||r.React.createElement(M,{onPress:function(){return w.showToast(e)}},r.React.createElement(J,{style:h.img,source:{uri:a}}))};return r.React.createElement(K,{style:h.container},I())},{View:X}=r.ReactNative;let o={},P={},A={},u=[];const R=async function(){try{return A=await(await _.safeFetch(p+"/fakeProfile",{cache:"no-store"})).json(),o=await(await _.safeFetch(W,{cache:"no-store"})).json(),P=await(await _.safeFetch(p+"/profile-effects",{cache:"no-store"})).json(),o}catch(t){N.logger.error("Failed to fetch fakeProfile data",t)}};function Y(t){if(t==null)return null;const e=t.match(/\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u);if(e!=null){const a=[...e[0]].map(function(n){return String.fromCodePoint(n.codePointAt(0)-917504)}).join("");return a.substring(1,a.length-1).split(",").map(function(n){return parseInt(n.replace("#","0x"),16)})}else return null}const Z=async function(){if(await R(),A?.version!=H)return w.showToast("A new version of the fakeProfile plugin is available. Please update as soon as possible.");u.push(d.after("getUserProfile",z,function(t,e){var a;if(!e)return e;const n=Y(e.bio);if(!((a=o[e.userId])===null||a===void 0)&&a.profile_effect&&i.storage.sw_effects){var s;e.profileEffectId=e.profileEffectID=(s=o[e.userId])===null||s===void 0?void 0:s.profile_effect,e.premiumType=2}return n&&i.storage.sw_themes&&(e.themeColors=n,e.premiumType=2),e})),u.push(d.after("getUserAvatarURL",B,function(t){let[{id:e},a]=t;if(o[e]&&o[e].avatar&&i.storage.sw_avatars){const n=o[e].avatar.toString();if(a)return n;{const s=new URL(n).pathname.split("/").pop().replace("a_","");return`${p}/image/${s}`}}})),u.push(d.after("getUserAvatarSource",B,function(t,e){let[{id:a},n]=t;if(o[a]&&o[a].avatar&&i.storage.sw_avatars){const s=o[a].avatar.toString();if(n)return{uri:s};{const l=new URL(s).pathname.split("/").pop().replace("a_","");return{uri:`${p}/image/${l}`}}}})),u.push(d.after("getUserBannerURL",j,function(t){let[e]=t;const a=Object.entries(o).find(function(s){return s[0]===e?.id});if(e?.banner===void 0&&a&&i.storage.sw_banners){var n;return(n=o[e?.id])===null||n===void 0?void 0:n.banner}})),u.push(d.after("getProfileEffectById",O,function(t,e){return P[t]})),u.push(d.after("getUser",F,function(t,e){if(e&&o[e?.id]&&o[e?.id].decoration&&i.storage.sw_decorations){const a=o[e?.id];a?.decoration&&(e.avatarDecoration={asset:a.decoration.asset,skuId:a?.decoration.skuId}),e.avatarDecorationData=e.avatarDecoration}})),u.push(d.instead("getAvatarDecorationURL",T,function(t,e){const[{avatarDecoration:a,canAnimate:n}]=t;if(a?.skuId===G){const s=a.asset.split("_");return!n&&s[0]==="a"&&s.shift(),p+`/avatar-decoration-presets/${s.join("_")}.png`}else if(a?.skuId===q){const s=a.asset.split("_");return!n&&s[0]==="a"&&s.shift(),`https://cdn.discordapp.com/avatar-decoration-presets//${s.join("_")}.png`}else return e(...t)})),u.push(d.after("isAnimatedAvatarDecoration",$,function(t,e){let[a]=t;var n;if(r.ReactNative.Platform.OS==="ios"&&!(a==null||(n=a.asset)===null||n===void 0)&&n.startsWith("file://"))return!0})),u.push(d.after("default",x,function(t,e){var a,n,s;let l=e;const h=(a=t[0])===null||a===void 0?void 0:a.user,I=(n=o[h?.id])===null||n===void 0?void 0:n.badges;if(!h||!i.storage.sw_badges||!I)return;const y=l==null||(s=l.props)===null||s===void 0?void 0:s.style;l||(l=r.React.createElement(X,{style:[y,{flexDirection:"row",flexWrap:"wrap",alignItems:"flex-end",justifyContent:"flex-end",paddingVertical:2}],accessibilityRole:"list",accessibilityLabel:"User Badges"}),l.props.children=[]);const ae=function(E){let{name:re,image:ne,custom:se=!1}=E;var D;const S=function(){return r.React.createElement(Q,{custom:se,name:re,image:ne,size:Array.isArray(y)?y?.find(function(L){return L.paddingVertical&&L.paddingHorizontal})?16:22:16,margin:Array.isArray(y)?4:6})};!(l==null||(D=l.props)===null||D===void 0)&&D.badges?l.props.badges=[r.React.createElement(S,null),...l.props.badges]:l.props.children=[r.React.createElement(S,null),...l.props.children]};I.map(function(E){ae({name:E.description,image:E.icon})})})),setInterval(async function(){await R()},A?.reloadInterval)},ee=function(){return u.forEach(function(t){return t()})},te=V;return b.fetchData=R,b.onLoad=Z,b.onUnload=ee,b.settings=te,b})({},vendetta,vendetta.utils,vendetta.ui.toasts,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.storage);
