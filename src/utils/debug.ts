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
 * @todo write method (static or instance) to generate process id outside of log/error method
 */
export default class Debug {
    /** @protected */
    protected Errors:       ErrorStack        = [];
    protected ProcessTrace: ProcessTraceStack = [];

    /**@public */
    public numberOfErrors: number = this.Errors.length;

    /**
     * Logs a message and optionally returns the message
     * @param msg - Debug message or value
     * @param ret - Flag to set whether or not the passed message is returned
     * @returns Either the provided message for utilization or void
     * @public
     */
    public log<T>(msg?: T, processId?: string, ret?: boolean): T | void {
        const returnValue: T | void = ret ? msg : void 0;
        const isoTimestamp: string = new Date().toISOString();

        if (typeof window === "undefined") {
            process.stdout.write(`${isoTimestamp} - ${processId + ' - '||''}${msg}\n`);
            return returnValue;
        }

        console.debug(msg);
        return returnValue;
    }

    /**
     * Logs an error and optionally returns the error
     * @param msg - Error object, message or value
     * @param ret - Flag to set whether or not the passed value is returned
     * @returns Either the provied error for utilization or void
     * @public
     */
    public error<T>(msg?: T, processId?: string, ret?: boolean): T | void {
        const returnValue: T | void = ret ? msg : void 0;
        const isoTimestamp: string = new Date().toISOString();

        if (typeof window === "undefined") {
            process.stderr.write(`${isoTimestamp} - ${processId + ' - '||''}${msg}\n`);
            return returnValue;
        }

        console.error(msg);
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
     * @returns The current error stack
     * @public
     */
    public dumpErrorStack(): ErrorStack {
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
