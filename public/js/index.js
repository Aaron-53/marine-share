const MARINE_URLS = {
    ios: "https://apps.apple.com/app/6560109315",
    android: "https://play.google.com/store/apps/details?id=com.lascade.marinetracker",
};

// Get referral code from URL
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("ref") || urlParams.get("referral") ||
    urlParams.get("code") || urlParams.get("r");

// Detect device and redirect
const userAgent = navigator.userAgent.toLowerCase();

const redirectUrl = /iphone|ipad|ipod/.test(userAgent) ? MARINE_URLS.ios : MARINE_URLS.android;

// Redirect immediately
window.location.href = `${redirectUrl}&referral=${encodeURIComponent(referralCode)}`;
