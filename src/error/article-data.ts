/**
 * Error class related to article data formatting issues.
 * These can include misformed objects, invalid interface implementations,
 * or missing data entirely. Anything that relates to the incoming data object.
 */
export default class ArticleDataError extends Error {
    protected defaultErrorMessage: string = "Article Data format was invalid.";
    private errorMessage: string = "";

    /** @constructor */
    public constructor(customMessage?: string) {
        super();

        this.message = customMessage || this.defaultErrorMessage;
    }

    public get message(): string {
        return this.errorMessage;
    }

    public set message(value: string) {
        this.errorMessage = value;
    }
}
