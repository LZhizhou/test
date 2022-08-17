"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTests = exports.Matcher = exports.getAxia = void 0;
const src_1 = require("src");
const getAxia = () => {
    if (typeof process.env.AXIAGO_IP === "undefined") {
        throw "Undefined environment variable: AXIAGO_IP";
    }
    if (typeof process.env.AXIAGO_PORT === "undefined") {
        throw "Undefined environment variable: AXIAGO_PORT";
    }
    const axia = new src_1.Axia(process.env.AXIAGO_IP, parseInt(process.env.AXIAGO_PORT));
    return axia;
};
exports.getAxia = getAxia;
var Matcher;
(function (Matcher) {
    Matcher[Matcher["toBe"] = 0] = "toBe";
    Matcher[Matcher["toEqual"] = 1] = "toEqual";
    Matcher[Matcher["toContain"] = 2] = "toContain";
    Matcher[Matcher["toMatch"] = 3] = "toMatch";
    Matcher[Matcher["toThrow"] = 4] = "toThrow";
    Matcher[Matcher["Get"] = 5] = "Get";
})(Matcher = exports.Matcher || (exports.Matcher = {}));
const createTests = (tests_spec) => {
    for (const [testName, promise, preprocess, matcher, expected] of tests_spec) {
        test(testName, () => __awaiter(void 0, void 0, void 0, function* () {
            if (matcher == Matcher.toBe) {
                expect(preprocess(yield promise())).toBe(expected());
            }
            if (matcher == Matcher.toEqual) {
                expect(preprocess(yield promise())).toEqual(expected());
            }
            if (matcher == Matcher.toContain) {
                expect(preprocess(yield promise())).toEqual(expect.arrayContaining(expected()));
            }
            if (matcher == Matcher.toMatch) {
                expect(preprocess(yield promise())).toMatch(expected());
            }
            if (matcher == Matcher.toThrow) {
                yield expect(preprocess(promise())).rejects.toThrow(expected());
            }
            if (matcher == Matcher.Get) {
                expected().value = preprocess(yield promise());
                expect(true).toBe(true);
            }
        }));
    }
};
exports.createTests = createTests;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJldGVzdGxpYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2UyZV90ZXN0cy9lMmV0ZXN0bGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZCQUEwQjtBQUVuQixNQUFNLE9BQU8sR0FBRyxHQUFTLEVBQUU7SUFDaEMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNoRCxNQUFNLDJDQUEyQyxDQUFBO0tBQ2xEO0lBQ0QsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxLQUFLLFdBQVcsRUFBRTtRQUNsRCxNQUFNLDZDQUE2QyxDQUFBO0tBQ3BEO0lBQ0QsTUFBTSxJQUFJLEdBQVMsSUFBSSxVQUFJLENBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUNyQixRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FDbEMsQ0FBQTtJQUNELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBWlksUUFBQSxPQUFPLFdBWW5CO0FBRUQsSUFBWSxPQU9YO0FBUEQsV0FBWSxPQUFPO0lBQ2pCLHFDQUFJLENBQUE7SUFDSiwyQ0FBTyxDQUFBO0lBQ1AsK0NBQVMsQ0FBQTtJQUNULDJDQUFPLENBQUE7SUFDUCwyQ0FBTyxDQUFBO0lBQ1AsbUNBQUcsQ0FBQTtBQUNMLENBQUMsRUFQVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFPbEI7QUFFTSxNQUFNLFdBQVcsR0FBRyxDQUFDLFVBQWlCLEVBQVEsRUFBRTtJQUNyRCxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksVUFBVSxFQUFFO1FBQzNFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBd0IsRUFBRTtZQUN2QyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2FBQ3JEO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUN4RDtZQUNELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ2hGO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUN4RDtZQUNELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzlCLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2FBQ2hFO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsUUFBUSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDeEI7UUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0tBQ0g7QUFDSCxDQUFDLENBQUE7QUF4QlksUUFBQSxXQUFXLGVBd0J2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBeGlhID0gKCk6IEF4aWEgPT4ge1xyXG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYuQVhJQUdPX0lQID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICB0aHJvdyBcIlVuZGVmaW5lZCBlbnZpcm9ubWVudCB2YXJpYWJsZTogQVhJQUdPX0lQXCJcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBwcm9jZXNzLmVudi5BWElBR09fUE9SVCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgdGhyb3cgXCJVbmRlZmluZWQgZW52aXJvbm1lbnQgdmFyaWFibGU6IEFYSUFHT19QT1JUXCJcclxuICB9XHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxyXG4gICAgcHJvY2Vzcy5lbnYuQVhJQUdPX0lQLFxyXG4gICAgcGFyc2VJbnQocHJvY2Vzcy5lbnYuQVhJQUdPX1BPUlQpXHJcbiAgKVxyXG4gIHJldHVybiBheGlhXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE1hdGNoZXIge1xyXG4gIHRvQmUsXHJcbiAgdG9FcXVhbCxcclxuICB0b0NvbnRhaW4sXHJcbiAgdG9NYXRjaCxcclxuICB0b1Rocm93LFxyXG4gIEdldFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlVGVzdHMgPSAodGVzdHNfc3BlYzogYW55W10pOiB2b2lkID0+IHtcclxuICBmb3IgKGNvbnN0IFt0ZXN0TmFtZSwgcHJvbWlzZSwgcHJlcHJvY2VzcywgbWF0Y2hlciwgZXhwZWN0ZWRdIG9mIHRlc3RzX3NwZWMpIHtcclxuICAgIHRlc3QodGVzdE5hbWUsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgaWYgKG1hdGNoZXIgPT0gTWF0Y2hlci50b0JlKSB7XHJcbiAgICAgICAgZXhwZWN0KHByZXByb2Nlc3MoYXdhaXQgcHJvbWlzZSgpKSkudG9CZShleHBlY3RlZCgpKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChtYXRjaGVyID09IE1hdGNoZXIudG9FcXVhbCkge1xyXG4gICAgICAgIGV4cGVjdChwcmVwcm9jZXNzKGF3YWl0IHByb21pc2UoKSkpLnRvRXF1YWwoZXhwZWN0ZWQoKSlcclxuICAgICAgfVxyXG4gICAgICBpZiAobWF0Y2hlciA9PSBNYXRjaGVyLnRvQ29udGFpbikge1xyXG4gICAgICAgIGV4cGVjdChwcmVwcm9jZXNzKGF3YWl0IHByb21pc2UoKSkpLnRvRXF1YWwoZXhwZWN0LmFycmF5Q29udGFpbmluZyhleHBlY3RlZCgpKSlcclxuICAgICAgfVxyXG4gICAgICBpZiAobWF0Y2hlciA9PSBNYXRjaGVyLnRvTWF0Y2gpIHtcclxuICAgICAgICBleHBlY3QocHJlcHJvY2Vzcyhhd2FpdCBwcm9taXNlKCkpKS50b01hdGNoKGV4cGVjdGVkKCkpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1hdGNoZXIgPT0gTWF0Y2hlci50b1Rocm93KSB7XHJcbiAgICAgICAgYXdhaXQgZXhwZWN0KHByZXByb2Nlc3MocHJvbWlzZSgpKSkucmVqZWN0cy50b1Rocm93KGV4cGVjdGVkKCkpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1hdGNoZXIgPT0gTWF0Y2hlci5HZXQpIHtcclxuICAgICAgICBleHBlY3RlZCgpLnZhbHVlID0gcHJlcHJvY2Vzcyhhd2FpdCBwcm9taXNlKCkpXHJcbiAgICAgICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==