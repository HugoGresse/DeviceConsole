interface UserAgentDataLike {
  platform?: string
  brands?: { brand: string; version: string }[]
}

const IGNORED_BRANDS = /not[.\/ ]a[.\/ ]?brand/i

export function describeDevice(
  userAgent: string,
  userAgentData?: UserAgentDataLike,
): { name: string; os: string } {
  const os = userAgentData?.platform || detectOs(userAgent)
  const browser = pickBrand(userAgentData?.brands) ?? detectBrowser(userAgent)
  return { name: [browser, os].filter(Boolean).join(' '), os }
}

function pickBrand(brands?: { brand: string }[]): string | undefined {
  return brands?.map((entry) => entry.brand).find((brand) => !IGNORED_BRANDS.test(brand))
}

function detectBrowser(userAgent: string): string {
  if (/Edg\//.test(userAgent)) return 'Edge'
  if (/OPR\/|Opera/.test(userAgent)) return 'Opera'
  if (/Firefox\//.test(userAgent)) return 'Firefox'
  if (/Chrome\//.test(userAgent)) return 'Chrome'
  if (/Safari\//.test(userAgent)) return 'Safari'
  return 'Browser'
}

function detectOs(userAgent: string): string {
  if (/Android/.test(userAgent)) return 'Android'
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS'
  if (/Mac OS X|Macintosh/.test(userAgent)) return 'macOS'
  if (/Windows/.test(userAgent)) return 'Windows'
  if (/Linux/.test(userAgent)) return 'Linux'
  return 'Unknown'
}

export function currentDeviceDescription(): { name: string; os: string } {
  const data = (navigator as Navigator & { userAgentData?: UserAgentDataLike }).userAgentData
  return describeDevice(navigator.userAgent, data)
}
