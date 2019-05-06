import { expect } from "chai";
import Debug from "../../src/utils/debug";

describe("Debug Class", () => {

    const debug: Debug = new Debug();

    describe("#log", () => {
        
        it("Should run and return only if flagged", (done: MochaDone) => {

            console.log(">> Log Test Messages:");

            expect(debug.log<string>("OK")).to.equal(undefined);
            expect(debug.log<string>("OK", null, true)).to.equal("OK");
            expect(debug.log<number>(42)).to.equal(undefined);
            expect(debug.log("OK", "idForOK", true)).to.equal("OK");

            console.log(">> End of Log Test Messages");

            done();
        });
    });

    describe("#error", () => {

        it("Should run and return only if flagged", (done: MochaDone) => {

            console.log(">> Error Test Messages:");

            expect(debug.error<string>("ERROR")).to.equal(undefined);
            expect(debug.error<string>("ERROR", null, true)).to.equal("ERROR");
            expect(debug.error<number>(42)).to.equal(undefined);
            expect(debug.error("ERROR", "idForError", true)).to.equal("ERROR");

            console.log(">> End of Error Test Messages");

            done();
        });
    });

    describe("#clearErrorStack", () => {
        
        it("Should remove all values from the error stack", (done: MochaDone) => {
            debug.addErrorToStack("1");
            debug.addErrorToStack("2");
            debug.addErrorToStack("3");

            expect(debug.numberOfErrors).to.be.greaterThan(0);

            debug.clearErrorStack();

            expect(debug.numberOfErrors).to.equal(0);

            done();
        });
    });

    describe("#dumpErrorStack", () => {

        /**
         * The error stack is persisted across tests for this method and is cleared at the
         * end of testing this method. If you modify the tests, be sure these conditions
         * are maintained or adapted to suit. If they're adapted, then remove this notice.
         */

        it("Should provide the complete error stack", (done: MochaDone) => {

            debug.addErrorToStack("one");
            debug.addErrorToStack("two");

            const dump = debug.dumpErrorStack();

            expect(dump.includes("one")).to.be.true;
            expect(dump.includes("two")).to.be.true;

            debug.clearErrorStack();
            
            done();
        });
    });

    describe("#addErrorToStack", () => {

        it("Should increase the number of errors", (done: MochaDone) => {
            
            expect(debug.numberOfErrors).to.equal(0);

            debug.addErrorToStack("Test Error");

            expect(debug.numberOfErrors).to.equal(1);

            const returnedError = debug.addErrorToStack("Test 2", true);

            expect(returnedError).to.equal(debug.dumpErrorStack());

            debug.clearErrorStack();

            done();
        });

        it("Should record the provided error in the stack", (done: MochaDone) => {
            
            debug.addErrorToStack("Test Error");

            const stack = debug.dumpErrorStack();

            expect(stack[0]).to.equal("Test Error");

            debug.clearErrorStack();

            done();
        });
    });

});
