import libxmljs from "libxmljs";
import AppleNews from 'apple-news-format/lib';
import ArticleDataFormatError from "./error/article-data";
import Debug from "./utils/debug";

export type ComponentRoleList = string[];

export interface ElementMappings {
    div: ComponentRoleList;
    [k: string]: ComponentRoleList;
}

export interface ICompilerOptions {
    debug?: boolean;
}

export interface IAppleNewsFormatCompiler {}

export default class AppleNewsFormatCompiler implements IAppleNewsFormatCompiler {

    protected debugMode:   boolean = false;
    private   article:     AppleNews.ArticleDocument | null = null;
    private   html:        libxmljs.Document;
    private   processTime: number;

    protected Element: ElementMappings = {
        div: [
            "aside",
            "chapter",
            "collection_display",
            "container",
            "divider",
            "header",
            "horizontal_stack_display",
            "section",
        ],
        span: [],
        p: [],
    };

    /** @constructor */
    public constructor(data?: AppleNews.ArticleDocument, options?: ICompilerOptions) {
        this.article = data || null;
        this.html = this.setupDocument();

        this.processTime = 0;

        if (!!options) {
            this.debug = !!options.debug;
        }
    }

    /**
     * Get a string description of the current compiler mode.
     * @returns {string} - The compiler mode
     * @public
     */
    public mode(): string {
        switch(this.debugMode) {
            case true:
                return "debug";
            default:
                return "production";
        }
    }

    /**
     * Get an indicator of whether or not the compiler is operating
     * in debug mode.
     * @returns {boolean} - Debug mode indicator
     * @public
     */
    public get debug(): boolean {
        return this.debugMode;
    }

    /**
     * Set the debug mode flag if you want to dynamically convert
     * the instance to a debug instance that may have unique side effects
     * and produce more logging information than a production instance.
     * @param {boolean} value - The debug mode value
     * @returns {void}
     * @public
     */
    public set debug(value: boolean) {
        this.debugMode = value;
    }

    /**
     * 
     * @param role 
     */
    private deriveElementType(role: string): string {
        let output: string = "span";

        for (let key of Object.keys(this.Element)) {
            if (this.Element[key].includes(role)) {
                output = key;
            }
        }

        return output;
    }

    /**
     * Generates the base of an HTML document as a libxmljs Document from
     * a string template.
     * @returns {libxmljs.Document} -  The generated document object
     * @private
     */
    private setupDocument(): libxmljs.Document {
        const documentTemplate: string = 
            `<!DOCTYPE html>
            <html>
                    <head>
                        <meta charset="utf-8" />
                        <title></title>
                    </head>

                    <body>
                        <!-- Begin Apple News HTML Document -->

                        <!--<script></script>-->
                    </body>
            </html>`;

        const document: libxmljs.Document = libxmljs.parseHtml(documentTemplate);

        (document.root() as libxmljs.Element)
            .attr({ "lang": "en" });

        return document;
    }

    /**
     * 
     * @param article 
     */
    private processArticle(article?: AppleNews.ArticleDocument): any {
        if (!this.article || !article)
            throw new ArticleDataFormatError("Article data has not been loaded.");

        let processTimer = setInterval(() => {
            this.processTime++;
        }, 100);
     

        
        clearInterval(processTimer);

        this.debug && console.log(`Article processing finished in ${this.processTime}ms`);
    }

    /**
     * For debugging. Can be removed in the future
     * Retaining the working example temporarily
     */
    public testDoc(): string {
        
        const doc = this.setupDocument();

        const body = (doc.root() as any).get("//body");
        const title = new libxmljs.Element(doc, "h1"),
              bodyText = new libxmljs.Element(doc, "p");
        title.text("Hello, world!");
        bodyText.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec accumsan consectetur risus, et fermentum risus dapibus ac. Fusce quis ipsum tempor orci imperdiet accumsan. Suspendisse dictum porttitor congue. Sed commodo velit magna, et cursus diam maximus in. Fusce eleifend pharetra tortor, non pretium turpis luctus sed. Nunc purus nulla, ullamcorper sit amet urna sodales, auctor luctus ex. Aenean elementum posuere elementum. ");
        body.addChild(title);
        body.addChild(bodyText);

        return doc.toString({
            whitespace: true,
            type: "html",
        } as any);
    }
}
