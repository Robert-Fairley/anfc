/**
 * Takes a string as input and if there are any camel case occurances, reduces the caps
 * to lower case and precedes them with another character as delimiter instead of the case
 * variance.
 * @param input The string to be converted
 * @param delim The converted strign
 */
export default function convertCase(input: string, delim?: string): string {
    const delimiter: string = delim || '-';
    const output: string = input.replace(
        /([A-Z])/g,
        (result: string) => `${delimiter}${result.toLowerCase()}`
    );

    return output;
};
