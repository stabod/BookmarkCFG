const UI_PATH = "./i18n/UI/";
const HELP_PATH = "./i18n/Help/";

const uiLangs = import.meta.glob("./i18n/UI/*.json");
const helpLangs = import.meta.glob("./i18n/Help/*.json");

export class Locale {
    #currentLocale = $state("");
    #ui = $state(null);
    #help = $state(null);

    constructor(defaultLocale = "en_US") {
        this.loadLang(defaultLocale);
        this.#currentLocale = defaultLocale;
    }

    async loadLang(locale) {
        const loadUI = await uiLangs[UI_PATH + locale + ".json"]();
        this.#ui = loadUI.default;
    }

    get currentLocale() {
        return this.#currentLocale;
    }

    get ui() {
        return this.#ui;
    }

    get help() {
        return this.#help;
    }
}
