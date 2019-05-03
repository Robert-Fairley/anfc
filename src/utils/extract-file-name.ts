/**
 * Extracts a valid filename from a string (targeting URL strings as input) and returns the
 * filename or returns the string if no invariance is found from the filename pattern.
 * Will only match filenames at the end of a string.
 * @param input - The formatted string to process
 * @returns An extracted filename or the original string if no match
 */
export default function extractFileName(input: string): string {

    const pattern: RegExp = /[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/;
    let local: string = input;

    const match = local.match(pattern);

    if (match) {
        local = match[0];
        local = local.replace(/\//g, '');
    }

    return local;
}
