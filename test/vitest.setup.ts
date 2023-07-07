import '@testing-library/react'
import {cleanup} from "@testing-library/react";
import { afterEach, beforeAll } from 'vitest';

afterEach(() => {
    if(typeof window !== "undefined") {
        cleanup();
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    }
});

beforeAll(() => {
    if (import.meta.env.DEV) { // vite env check
        function suppressNestingWarnings() {
            // sooth typescript
            type SilenceableConsole = typeof console & { warningsSilenced?: boolean };

            if (!import.meta.env.DEV) { // in case someone copies this around
                return;
            }

            if ((console as SilenceableConsole).warningsSilenced) {
                return;
            }

            const origConsoleError = console.error;
            console.error = (...args: unknown[]) => {
                const isNestingWarning = (arg: unknown) => typeof arg === "string" && arg.includes("validateDOMNesting");
                const concernsOurChildElements = (arg: unknown) => typeof arg === "string" && (arg === "<body>" || arg == "<html>");
                const concernsOurParentElements = (arg: unknown) => typeof arg === "string" && arg === "#fragment";
                const [formatString, child, parent] = args;
                if (isNestingWarning(formatString) && concernsOurChildElements(child) && concernsOurParentElements(parent)) {
                    return;
                }
                origConsoleError(...args);
            };

            (console as SilenceableConsole).warningsSilenced = true;
        }
        suppressNestingWarnings();
    }
})


