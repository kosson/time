/**
* @file timelime-api.js
* @author Constantinescu Nicolaie <kosson@gmail.com>
* @version 1.0.0
*/
(function setMedium () {

    let simile_ajax_ver = "2.2.1", // ===========>>>  current Simile-Ajax version
        isCompiled = ("Timeline_isCompiled" in window) && window.Timeline_isCompiled,
        useLocalResources = false;

    /**
     * Pasarea de parametri la apelararea scriptului
     * pentru a decide cum sunt încărcate resursele
     */
    if (document.location.search.length > 0) {
        let params = document.location.search.substr(1).split("&");
        for (let i = 0; i < params.length; i++) {
          if (params[i] == "timeline-use-local-resources") {
            useLocalResources = true;
          }
        }
    }

    /**
     * Loader pentru resurse locale
     * @type {Object} Timeline - un obiect mare de lucru
     * @type {Boolean} bundle
     * @type {Array} javascriptFiles
     * @type {Array} cssFiles
     */
    let loadMe = function loadMe () {
        if ("Timeline" in window) { return; }

        // window.Timeline = new Object(); // TODO: remove me!
        window.Timeline = {};
        window.Timeline.DateTime = window.SimileAjax.DateTime; // for backward compatibility

        let bundle = false,
            javascriptFiles = [
                "timeline.js",
                "band.js",
                "themes.js",
                "ethers.js",
                "ether-painters.js",
                "event-utils.js",
                "labellers.js",
                "sources.js",
                "original-painter.js",
                "detailed-painter.js",
                "overview-painter.js",
                "compact-painter.js",
                "decorators.js"
            ],
            cssFiles = [
                "timeline.css",
                "ethers.css",
                "events.css"
            ],
            localizedJavascriptFiles = [
                "timeline.js",
                "labellers.js"
            ],
            localizedCssFiles = [],
            supportedLocales = [
                // ISO-639 language codes, ISO-3166 country codes (2 characters)
                "cs",       // Czech
                "de",       // German
                "en",       // English
                "es",       // Spanish
                "fr",       // French
                "it",       // Italian
                "nl",       // Dutch (The Netherlands)
                "pl",       // Polish
                "ro",       // Romanian
                "ru",       // Russian
                "se",       // Swedish
                "tr",       // Turkish
                "vi",       // Vietnamese
                "zh"        // Chinese
            ];

        try {
            let desiredLocales = [ "en" ],
                defaultServerLocale = "en",
                forceLocale = null,
                // Caută în URL-encoded pentru a detecta limbile dorite pentru aplicație
                // la parameters este acceptat query stringul de după ?
                parseURLParameters = function parseURLParams (parameters) {
                    let params = parameters.split("&");
                    for (let p = 0; p < params.length; p++) {
                        let pair = params[p].split("=");
                        if (pair[0] == "locales") {
                            desiredLocales = desiredLocales.concat(pair[1].split(","));
                        } else if (pair[0] == "defaultLocale") {
                            defaultServerLocale = pair[1];
                        } else if (pair[0] == "forceLocale") {
                            forceLocale = pair[1];
                            desiredLocales = desiredLocales.concat(pair[1].split(","));
                        } else if (pair[0] == "bundle") {
                            bundle = pair[1] != "false";
                        }
                    }
                };
            
            // Căutarea rădăcinii din care este încărcat timeline-api.js (calea absolută)
            // este prelucrat și query string-ul prin aplearea lui parseURLParameters
            (function setURLPrefix () {
                // Dacă obiectul deja este încărcat
                if (typeof Timeline_urlPrefix == "string") {
                    Timeline.urlPrefix = Timeline_urlPrefix;
                    if (typeof Timeline_parameters == "string") {
                        parseURLParameters(Timeline_parameters);
                    }
                } else {
                    /** Injectarea scriptului timeline-api.js în head */
                    // constituie colecția elementelor din head
                    let heads = document.documentElement.getElementsByTagName("head");
                    for (let h = 0; h < heads.length; h++) {
                        // constituie colecția elementelor script din head
                        let scripts = heads[h].getElementsByTagName("script");
                        for (let s = 0; s < scripts.length; s++) {
                            // obține URL-ul sursei
                            let url = scripts[s].src,
                                i = url.indexOf("timeline-api.js");
                            if (i >= 0) {
                                // dacă există, setează Timeline.urlPrefix la calea găsită
                                Timeline.urlPrefix = url.substr(0, i);
                                var q = url.indexOf("?");
                                if (q > 0) {
                                    // dacă există query string, prelucrează-l
                                    parseURLParameters(url.substr(q + 1));
                                }
                                return;
                            }
                        }
                    }
                    // dacă au apărut erori în prelucrarea elementelor din head, ridică eroare
                    throw new Error("Failed to derive URL prefix for Timeline API code files");
                }
            })();

            // se presupune că obiectul SimileAjax este disponibil
            let includeJavascriptFiles = function includeJavascriptFiles (urlPrefix, filenames) {
                SimileAjax.includeJavascriptFiles(document, urlPrefix, filenames);
            };
            let includeCssFiles = function includeCssFiles (urlPrefix, filenames) {
                SimileAjax.includeCssFiles(document, urlPrefix, filenames);
            };

            /*
             *  Include non-localized files
             */
            if (!isCompiled) {
                if (bundle) {
                    includeJavascriptFiles(Timeline.urlPrefix, [ "timeline-bundle.js" ]);
                    includeCssFiles(Timeline.urlPrefix, [ "timeline-bundle.css" ]);
                } else {
                    includeJavascriptFiles(Timeline.urlPrefix + "scripts/", javascriptFiles);
                    includeCssFiles(Timeline.urlPrefix + "styles/", cssFiles);
                }
            }

            /*
             *  Include localized files
             */
            let loadLocale = [];
            loadLocale[defaultServerLocale] = true;

            let tryExactLocale = function tryExactLocale (locale) {
                for (let l = 0; l < supportedLocales.length; l++) {
                    if (locale == supportedLocales[l]) {
                        loadLocale[locale] = true;
                        return true;
                    }
                }
                return false;
            };
            let tryLocale = function tryLocale (locale) {
                if (tryExactLocale(locale)) {
                    return locale;
                }

                let dash = locale.indexOf("-");
                if (dash > 0 && tryExactLocale(locale.substr(0, dash))) {
                    return locale.substr(0, dash);
                }

                return null;
            };

            for (let l = 0; l < desiredLocales.length; l++) {
                tryLocale(desiredLocales[l]);
            }

            let defaultClientLocale = defaultServerLocale;
            let defaultClientLocales = ("language" in navigator ? navigator.language : navigator.browserLanguage).split(";");
            for (let l = 0; l < defaultClientLocales.length; l++) {
                let locale = tryLocale(defaultClientLocales[l]);
                if (locale != null) {
                    defaultClientLocale = locale;
                    break;
                }
            }

            if (!isCompiled) {
                for (let l = 0; l < supportedLocales.length; l++) {
                    let locale = supportedLocales[l];
                    if (loadLocale[locale]) {
                        includeJavascriptFiles(Timeline.urlPrefix + "scripts/l10n/" + locale + "/", localizedJavascriptFiles);
                        includeCssFiles(Timeline.urlPrefix + "styles/l10n/" + locale + "/", localizedCssFiles);
                    }
                }
            }

            if (forceLocale == null) {
              Timeline.serverLocale = defaultServerLocale;
              Timeline.clientLocale = defaultClientLocale;
            } else {
              Timeline.serverLocale = forceLocale;
              Timeline.clientLocale = forceLocale;
            }
        } catch (e) {
            alert(e);
        }
    };
    // end loadMe()

    /**
     *  Load SimileAjax if it's not already loaded
     */
    if (typeof SimileAjax == "undefined" && !isCompiled) {
        window.SimileAjax_onLoad = loadMe;

        let url = useLocalResources ?
            "http://127.0.0.1:9999/ajax/api/simile-ajax-api.js?bundle=false" :
            "http://api.simile-widgets.org/ajax/" + simile_ajax_ver + "/simile-ajax-api.js";
        if (typeof Timeline_ajax_url == "string") {
           url = Timeline_ajax_url;
        }
        let createScriptElement = function createScriptElem () {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.language = "JavaScript";
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        if (document.body == null) {
            try {
                document.write("<script src='" + url + "' type='text/javascript'></script>");
            } catch (e) {
                createScriptElement();
            }
        } else {
            createScriptElement();
        }
    } else {
        loadMe();
    }
})();