/**
 * Value allowed in debug mode error stack, either native (or descendent)
 * error class or an error message as a string.
 */
export type ErrorStackValue = Error | string;

/**
 * Array/Stack of {@link ErrorStackValue} items.
 */
export type ErrorStack = ErrorStackValue[];

/**
 * Value allowed in debug mode process trace stack.
 */
export type ProcessTraceValue = string;

/**
 * Array/Stack of {@link ProcessTraceValue} items.
 */
export type ProcessTraceStack = ProcessTraceValue[];

/**
 * Utility methods and properties for use in the compiler debug mode.
 */
export default class Debug {
    /** @protected */
    protected Errors:       ErrorStack        = [];
    protected ProcessTrace: ProcessTraceStack = [];

    /**@public */
    public numberOfErrors: number = this.Errors.length;

    /**
     * Logs a message and optionally writes a message tp
     * @param msg - Debug message or value
     * @param ret - Flag to set whether or not the passed message is returned
     * @returns Either the provided message for utilization or void
     * @public
     * @static
     */
    public static log<T>(msg?: T, ret?: boolean): T | void {
        const returnValue: T | void = ret ? msg : void 0;

        if (typeof window === "undefined") {
            process.stdout.write(`${msg}\n`);
            return returnValue;
        }

        console.log(msg);
        return returnValue;
    }

    /**
     * Adds an error to the debug error stack and optionally returns the entire
     * stack.
     * @param error - The error to save
     * @param ret - Flag to set whether or not to return the error stack
     * @returns Either the complete error stack or void
     * @public
     */
    public addErrorToStack(error: ErrorStackValue, ret?: boolean): ErrorStack | void {
        const returnValue = ret ? this.Errors : void 0;

        this.Errors.push(error);
        this.numberOfErrors++;

        return returnValue;
    }

    /**
     * Provides a dump of the error stack and optionally clears the stack.
     * @param clearStack - Flag to be set true if the stack is to be emptied upon call
     * @returns The current error stack
     * @public
     */
    public dumpErrorStack(clearStack?: boolean): ErrorStack {
        if (!!clearStack)
            this.clearErrorStack();
        
        return this.Errors;
    }

    /**
     * Clears the error stack completely.
     * @public
     */
    public clearErrorStack(): void {
        this.Errors = [];
        this.numberOfErrors = 0;
    }
}
