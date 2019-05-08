import libxmljs from "libxmljs";
import AppleNews from 'apple-news-format/lib';
import ArticleDataFormatError from "./error/article-data";
import {
    Debug,
    extractFileName,
} from "./utils";
import convertCase from './utils/convert-case';

export interface XMLLibElementToStringOpts {
    declaration: boolean;
    selfCloseEmpty: boolean;
    whitespace: boolean;
    type: "xml" | "html";
}

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

    protected debugMode:   boolean                          = false;
    protected debugger:    Debug | null                     = null;
    private   processed:   boolean                          = false;
    private   article:     AppleNews.ArticleDocument | null = null;
    private   document:    libxmljs.Document;
    private   styles:      object; // @todo replace with proper interface
    private   processTime: number;

    protected Element: ElementMappings = {
        div: [],
        span: [],
        p: [],
    };

    /** @constructor */
    public constructor(data?: AppleNews.ArticleDocument, options?: ICompilerOptions) {
        this.article = data || null;
        this.document = this.setupDocument();
        this.styles = {};

        this.processTime = 0;

        if (!!options) {
            this.debug = !!options.debug;
        }

        if (this.debug)
            this.debugger = new Debug();
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
     * Gets the produced HTML DOM as a strign
     * @returns The generated HTML as a string
     */
    public html() {
        return this.document.toString(true);
    }

    /**
     * Gets the produced DOm
     * @returns The `libxmljs` Document object containing the generated DOM
     */
    public dom() {
        return this.document;
    }

    /**
     * Generates the base of an HTML document as a libxmljs Document from
     * a string template.
     * @returns The generated document object
     * @private
     */
    private setupDocument(): libxmljs.Document {
        const documentTemplate: string = 
`<!DOCTYPE html><html><head><meta charset="utf-8" /><title></title></head><body><!-- Begin Apple News HTML Document --></body></html>`;

        const document: libxmljs.Document = libxmljs.parseHtml(documentTemplate);

        (document.root() as libxmljs.Element)
            .attr({ "lang": "en" });

        return document;
    }

    private parseStyleObject(styleObject: any): any {
        let output: string = '';

        
    }

    private setupStyles(): libxmljs.Element {
        const nonStyleFields: string[] = [
            "title",
            "version",
            "layout",
            "metadata",
            "components",
        ];
        // Coercing the object type is not ideal. Try and find a smarter way of defining this.
        const componentStyles = Object.keys((this.article as any).componentStyles as AppleNews.ComponentStyle[]),
              componentTextStyles = Object.keys((this.article as any).componentTextStyles as AppleNews.ComponentTextStyle[]);
        const styles = new libxmljs.Element(this.document, "style");

        for (const field of componentStyles) {
            if (!nonStyleFields.includes(field)) {
                (styles as any).cdata(`
                    .${field} ${this.generateCssClass((this.article as any).componentStyles[field])}
                `)
            }
        }

        return styles;
    }

    /**
     * Converts an Apple News style object into a series of CSS fields
     * @param cssObject Apple news style object
     * @returns Converted CSS string
     */
    private generateCssClass(cssObject: {[k: string]: string | number}): string {
        let output: string = '{';
        let value;

        for (const field of Object.keys(cssObject)) {
            value = typeof cssObject[field] === "string" ? cssObject[field] : `${cssObject[field]}`;
            output += `${convertCase(field).replace("name", "family")}: ${value};`;
        }

        return `${output}}`;
    }

    /**
     * 
     * @param document 
     * @param component .
     * @param element 
     */
    private insertComponent(document: libxmljs.Document, component: AppleNews.Component, element?: libxmljs.Element): libxmljs.Element {
        const parent = element || (document.root() as libxmljs.Element).get("//body");
        const newElement = new libxmljs.Element(document, "div");

        const elementStringOpts: boolean | XMLLibElementToStringOpts = { 
            declaration: false,
            selfCloseEmpty: true,
            whitespace: true,
            type: "html",
        };
        
        if ((component as AppleNews.Container).components) {
            let subComponents = (component as AppleNews.Container).components;
            let tmp = [];

            for (let subComponent of subComponents as AppleNews.Component[]) {
                tmp.push(
                    this.insertComponent(document, subComponent, newElement).toString(elementStringOpts),
                );
            }
        } else if ((component as AppleNews.Image).URL) {
            let tmp = new libxmljs.Element(document, "img");
            tmp.attr({ class: component.role as string });
            tmp.attr({ src: extractFileName((component as AppleNews.Image).URL) });
            tmp.attr({ alt: (component as any).caption || "" });
            //tmp.attr({ id: idFunc() })

            (newElement as any).cdata(tmp.toString(elementStringOpts));
        } else {
            newElement.attr({ class: component.role as string });
            (newElement as any).cdata((component as AppleNews.Body).text);
            //newElement.attr({ id: idFunc() })
        }

        (parent as any).cdata(newElement.toString(elementStringOpts));

        return newElement;
    }

    /**
     * 
     * @param article 
     */
    private processArticle(): any {
        if (this.processed) {
            this.debug
                && (this.debugger as Debug).log("Article already processed. Reset compiler to try again.");
            return void 0;
        }
        
        let article: AppleNews.ArticleDocument;
        
        if (this.article == null)
            throw new ArticleDataFormatError("Article data has not been loaded.");
        else
            article = this.article;

        let processTimer = setInterval(() => {
            this.processTime++;
        }, 100);

        const components = article.components;

        for (let component of components) {
            this.insertComponent(this.document, component);
        }
        
        clearInterval(processTimer);

        this.debug
            && (this.debugger as Debug).log(`Article processing finished in ${this.processTime}ms`);

        this.processed = true;
        return this.document;
    }

    public reset(): void {
        this.document = this.setupDocument();
        this.processed = false;
        
        return void 0;
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
