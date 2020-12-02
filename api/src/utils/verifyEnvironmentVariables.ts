/**
 * Makes sure that environment variables are defined
 */
export function verifyEnvironmentVariables(variable: string | undefined, name: string): asserts variable is string {
    if (variable === undefined) {
        throw Error(`Environment variable ${name} is not defined`);
    }
}
