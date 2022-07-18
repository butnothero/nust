/**
 * Detect user device. Client only
 */
export const useDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  const iPadOS13Up =
    window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;

  const devicePixelRatio = window.devicePixelRatio || 1;

  const find = (need: string): boolean => userAgent.indexOf(need) !== -1;

  const windows = find('windows');
  const iPod = find('ipod');
  const iPad = find('ipad') || iPadOS13Up;
  const dingding = find('dingtalk');
  const wechat = find('micromessenger');
  const wechatMiniApp = find('miniprogram');
  const iPhone = !windows && find('iphone');
  const iPhoneX =
    iPhone && devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;

  const iPhoneXR =
    iPhone && devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;

  const iPhoneXSMax =
    iPhone && devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
  const ios = iPhone || iPod || iPad;
  const android = !windows && find('android');
  const androidPhone = android && find('mobile');
  const ieMobile = find('iemobile');
  const blackBerry = find('blackberry');
  const webOS = find('webos');
  const operaMini = find('opera mini');

  const isMobile = androidPhone || iPhone || iPod || ieMobile || blackBerry || webOS || operaMini;
  const isPC = !isMobile;

  const getScreenWidth = () => window.innerWidth;

  return {
    getScreenWidth,
    find,
    devicePixelRatio,
    isMobile,
    isPC,
    windows,
    iPod,
    iPad,
    dingding,
    wechat,
    wechatMiniApp,
    iPhoneX,
    iPhoneXR,
    iPhoneXSMax,
    ios,
    android,
    androidPhone,
    ieMobile,
    blackBerry,
    webOS,
    operaMini,
  };
};
