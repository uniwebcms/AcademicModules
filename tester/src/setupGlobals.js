import configData from '../data/basic.json';

class Profile {
    constructor(profileData) {
        this.basicInfo = profileData.basicInfo;
        this.contentType = profileData.contentType;
        this.contentId = profileData.contentId;
    }

    getImageInfo(assetType = 'banner') {
        const banner = this.basicInfo.banner;

        return {
            url: banner?.url,
            alt: `Profile ${assetType} for ${this.contentType} ${this.contentId}`,
        };
    }

    getProfileType() {
        return this.profileType;
    }

    getBasicInfo() {
        return this.basicInfo;
    }

    at() {
        return {};
    }

    static getFilterableFields() {
        return [];
    }
}

class Input {
    constructor(inputData) {
        // this.query = query;
        // this.rawData = null;

        this.profiles = inputData.profiles.map((profile) => new Profile(profile));
    }

    makeHref(profile) {
        return '';
    }
}

class Block {
    constructor(blockData, id) {
        this.id = id;
        this.component = blockData.component;
        this.Component = null;

        this.main = {
            header: {
                title: blockData.title || '',
                pretitle: blockData.pretitle || '',
                subtitle: blockData.subtitle || '',
            },
            banner: blockData.banner || null,
            body: {
                links: blockData.links || [],
                paragraphs: blockData.paragraphs || [],
                imgs: blockData.images || [],
                icons: blockData.icons || [],
                videos: blockData.videos || [],
                lists: blockData.lists || [],
                buttons: blockData.buttons || [],
                properties: blockData.properties || {},
            },
        };

        this.themeName = blockData.themeName || 'light';
        this.standardOptions = blockData.standardOptions || {};

        this.childBlocks = blockData.childBlocks
            ? blockData.childBlocks.map((block, i) => new Block(block, `${id}_${i}`))
            : [];

        this.input = blockData.input ? new Input(blockData.input) : null;

        this.startState = null;
        this.state = null;
        this.resetStateHook = null;
        this.initState();
    }

    getComponent() {
        return uniweb.getRemoteComponent(this.component);
    }

    getBlockContent() {
        return {
            ...this.main.header,
            ...this.main.body,
            images: this.main.body.imgs,
            banner: this.main.banner,
        };
    }

    getBlockProperties() {
        return this.main.body.properties;
    }

    getChildBlockRenderer() {
        return uniweb.childBlockRenderer;
    }

    getNextBlockInfo() {
        const website = uniweb.activeWebsite;
        const page = website.activePage;

        const currIndex = page.blocks.findIndex((b) => b.id === this.id);
        const nextIndex = currIndex + 1;

        return {
            theme: page.blocks[nextIndex].themeName,
            category: page.blocks[nextIndex].component,
            state: {},
        };
    }

    getBlockLinks() {
        return this.links;
    }

    getBlockLinks(options = {}) {
        const website = uniweb.activeWebsite;

        if (options.nested) {
            const lists = this.main.body?.lists || [];
            const links = lists[0];

            return Block.parseNestedLinks(links, website);
        } else {
            let links = this.main.body?.links || [];

            links = links.map((link) => {
                return { route: website.makeHref(link.href), label: link.label };
            });

            return links;
        }
    }

    initState() {
        this.startState = this.Component?.blockState ? { ...this.Component.blockState } : null;
        this.state = this.startState;

        if (this.resetStateHook) this.resetStateHook();
    }

    useBlockState(useState, initState) {
        // The block state is set to the given init state only if it's null
        if (initState !== undefined && this.startState === null) {
            this.startState = initState;
            this.state = initState;
        } else {
            // Remember the true initial state
            initState = this.startState;
        }

        const [state, setState] = useState(initState);

        // Save the hook so it can be called by initState()
        this.resetStateHook = () => setState(initState);

        return [state, (newState) => setState((this.state = newState))];
    }

    static parseNestedLinks = (list, website) => {
        const parsed = [];

        if (list?.length) {
            list.forEach((listItem) => {
                const { links, lists, paragraphs } = listItem;

                const link = links[0];
                const nestedList = lists[0];
                const text = paragraphs[0];

                let label = '',
                    href = '',
                    subLinks = [],
                    hasData = true;

                // if itself is a link
                if (link) {
                    label = link.label;
                    href = link.href;

                    // if has child links
                    if (nestedList) {
                        subLinks = Block.parseNestedLinks(nestedList, website);
                    }
                } else {
                    label = text;
                    hasData = false;

                    // if has child links
                    if (nestedList) {
                        subLinks = Block.parseNestedLinks(nestedList, website);
                    }
                }

                parsed.push({
                    label,
                    route: website.makeHref(href),
                    child_items: subLinks,
                    hasData,
                });
            });
        }
        return parsed;
    };
}

class Page {
    constructor(pageData, id) {
        this.id = id;
        this.route = pageData.route;
        this.title = pageData.title;
        this.description = pageData.description;
        this.blocks = pageData.blocks.map((block, index) => new Block(block, index));
    }

    getPageProfile() {}
}

class Website {
    constructor(websiteData) {
        this.pages = websiteData.pages.map((page, index) => new Page(page, index));
        this.activePage = this.pages[0];
        this.pageRoutes = this.pages.map((page) => page.route);
        this.themeData = websiteData.themeData;
        this.routingComponents = {};
        this.activeLang = 'en';
        this.langs = [
            {
                label: 'English',
                value: 'en',
            },
            {
                label: 'français',
                value: 'fr',
            },
        ];
    }

    getRoutingComponents() {
        return uniweb.routingComponents;
    }

    makeHref(href) {
        return href;
    }

    getLanguages() {
        return this.langs;
    }

    getLanguage() {
        return this.activeLang;
    }

    localize(val, defaultVal = '', givenLang = '', fallbackDefaultLangVal = false) {
        const lang = givenLang || this.activeLang;

        const defaultLang = this.langs[0].value || 'en';

        if (typeof val === 'object' && !Array.isArray(val)) {
            return fallbackDefaultLangVal
                ? val?.[lang] || val?.[defaultLang] || defaultVal
                : val?.[lang] || defaultVal;
        }

        if (typeof val === 'string') {
            if (!val.startsWith('{') && !val.startsWith('"')) return val;

            try {
                let obj = JSON.parse(val);

                if (typeof obj === 'object') {
                    return fallbackDefaultLangVal
                        ? obj?.[lang] || obj?.[defaultLang] || defaultVal
                        : obj?.[lang] || defaultVal;
                } else return obj;
            } catch (e) {
                return val;
            }
        }

        return defaultVal;
    }

    getSearchData() {
        return this.pages.map((page) => {
            return {
                id: page.id,
                title: page.title,
                href: page.route,
                route: page.route,
                description: page.description,
                content: page.blocks
                    .map((b) => b.title)
                    .filter(Boolean)
                    .join('\n'),
            };
        });
    }
}

class Uniweb {
    constructor(configData) {
        this.activeWebsite = new Website(configData.website);
        this.childBlockRenderer = null;
        this.routingComponents = {};
        this.remoteComponents = null;
        this.language = 'en';
        this.Profile = Profile;
    }

    setRemoteComponents(module) {
        this.remoteComponents = module.default;
    }

    getRemoteComponent(name) {
        return this.remoteComponents[name];
    }
}

(function () {
    window.uniweb = new Uniweb(configData);

    import('./bootstrap.js').then((module) => {
        module.default();
    });
})();

//////////////////////////////////config data//////////////////////////////////
