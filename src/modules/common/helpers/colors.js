import { darken as primitiveDarken, lighten as primitiveLighten } from 'polished';
import { sequence } from './arrays';

export const hexToRgb = hex => {
    const pattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const colors = pattern.exec(hex);
    return {
        r: parseInt(colors[1], 16),
        g: parseInt(colors[2], 16),
        b: parseInt(colors[3], 16),
    };
};

export const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const hslToHex = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const hex = [r, g, b]
        .map(c => Math.round(c * 255))
        .map(c => c.toString(16).padStart(2, '0'))
        .join('');

    return `#${hex}`;
};

export const isDark = hex => {
    const { r, g, b } = hexToRgb(hex);
    return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) < 160;
};

export const getComplementary = hex => {
    const BASE = 255;
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(BASE - r, BASE - g, BASE - b);
};

export const getShades = (from, to, steps = 2) => {
    if (steps <= 1) {
        return [from];
    }

    const fromRGB = hexToRgb(from);
    const toRGB = hexToRgb(to);

    const deltaR = (toRGB.r - fromRGB.r) / (steps - 1);
    const deltaG = (toRGB.g - fromRGB.g) / (steps - 1);
    const deltaB = (toRGB.b - fromRGB.b) / (steps - 1);

    return sequence(steps).map(i => {
        const r = Math.round(fromRGB.r + deltaR * i);
        const g = Math.round(fromRGB.g + deltaG * i);
        const b = Math.round(fromRGB.b + deltaB * i);
        return rgbToHex(r, g, b);
    });
};

export const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.min(Math.floor(Math.random() * 100), 90);
    const lightness = Math.min(Math.floor(Math.random() * 60 + 40), 85); // 60% darker

    return hslToHex(hue, saturation, lightness);
};

export const darken = (color, amount) =>
    color === 'transparent' ? null : primitiveDarken(amount, color);

export const lighten = (color, amount) =>
    color === 'transparent' ? null : primitiveLighten(amount, color);
