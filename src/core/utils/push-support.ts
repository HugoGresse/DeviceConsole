export type PushSupport = 'supported' | 'ios-needs-install' | 'unsupported'

export const PUSH_SUPPORT_MESSAGES: Record<Exclude<PushSupport, 'supported'>, string> = {
  'ios-needs-install':
    'On iOS, notifications only work once the app is installed: tap Share, then "Add to Home Screen", and register from there.',
  unsupported: 'This browser cannot receive push notifications',
}

interface PushEnvironment {
  userAgent: string
  standalone: boolean
  maxTouchPoints: number
}

// iOS gained web push in 16.4, but only for a site installed to the Home Screen, so a plain
// Safari tab reports no support however current the OS is.
function isIos({ userAgent, maxTouchPoints }: PushEnvironment): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1
}

export function describePushSupport(env: PushEnvironment, messagingSupported: boolean): PushSupport {
  if (messagingSupported) return 'supported'
  return isIos(env) && !env.standalone ? 'ios-needs-install' : 'unsupported'
}

export function currentPushEnvironment(): PushEnvironment {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return {
    userAgent: navigator.userAgent,
    standalone: iosStandalone || window.matchMedia('(display-mode: standalone)').matches,
    maxTouchPoints: navigator.maxTouchPoints,
  }
}
