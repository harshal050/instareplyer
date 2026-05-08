"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_LIMITS = void 0;
exports.cn = cn;
exports.formatCurrency = formatCurrency;
exports.formatNumber = formatNumber;
exports.formatRelativeTime = formatRelativeTime;
exports.truncate = truncate;
exports.generateId = generateId;
exports.sleep = sleep;
exports.debounce = debounce;
exports.isValidEmail = isValidEmail;
exports.capitalize = capitalize;
exports.safeJsonParse = safeJsonParse;
exports.getInitials = getInitials;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
// Tailwind merge utility
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}
// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}
// Format date relative to now
function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return then.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}
// Truncate text
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return str.slice(0, length) + '...';
}
// Generate random ID
function generateId(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// Sleep utility
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Debounce function
function debounce(func, wait) {
    let timeoutId = null;
    return (...args) => {
        if (timeoutId)
            clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}
// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Safe JSON parse
function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch {
        return fallback;
    }
}
// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
// Constants
exports.SUBSCRIPTION_LIMITS = {
    free: { campaigns: 1, instagramAccounts: 1, dmsPerMonth: 100, teamMembers: 1 },
    starter: { campaigns: 5, instagramAccounts: 2, dmsPerMonth: 1000, teamMembers: 2 },
    pro: { campaigns: 20, instagramAccounts: 5, dmsPerMonth: 10000, teamMembers: 5 },
    enterprise: { campaigns: -1, instagramAccounts: -1, dmsPerMonth: -1, teamMembers: -1 },
};
//# sourceMappingURL=index.js.map