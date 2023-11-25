import { GetItem, RemoveItem, SetItem } from './LocalStorageUtils';
import type { Theme, ColorTheme, PageWidth } from '@models/Theme';

export const toggleSiteMode = () => {
    const [mode] = getCurrentTheme();

    if (mode === 'light') {
        SetItem('theme_mode', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        SetItem('theme_mode', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
    }
};

export const changeMode = (mode: Theme) => {
    if (mode === 'system') {
        RemoveItem('theme_mode');
        document.documentElement.removeAttribute('data-theme');
        return;
    }

    SetItem('theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
}

export const changeColor = (color: ColorTheme) => {
    SetItem('theme_color', color);
    document.documentElement.setAttribute('data-color-theme', color);

    const themeElement = document.querySelector('meta[name="theme-color"]');
    if (themeElement) {
        themeElement.setAttribute('content', getColorHexCode(color));
    }
}

export const changeWidth = (width: PageWidth) => {
    SetItem('theme_width', width);
    document.documentElement.setAttribute('data-width', width);
}

export const getCurrentTheme = (): [Theme, ColorTheme, PageWidth] => {
    const mode = GetItem('theme_mode', 'system') as Theme;
    const color = GetItem('theme_color', 'green') as ColorTheme;
    const width = GetItem('theme_width', 'normal') as PageWidth;

    return [mode, color, width];
}

export const getPreferredColorMode = (): Theme => {
    if (typeof window !== 'undefined') {
        const prefferredMode = window.matchMedia('(prefers-color-scheme: dark)');

        if (prefferredMode.matches) {
            return 'dark';
        }
    }

    return 'light';
};

export const getColorHexCode = (color: ColorTheme) => {
    switch (color) {
        case 'blue':
            return '#2a45cb';
        case 'purple':
            return '#d01bcd';
        case 'orange':
            return '#d27519';
        case 'red':
            return '#ff5757';
        case 'green':
        default:
            return '#187c3d';
    }
}
