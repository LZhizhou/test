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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJldGVzdGxpYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2UyZV90ZXN0cy9lMmV0ZXN0bGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZCQUEwQjtBQUVuQixNQUFNLE9BQU8sR0FBRyxHQUFTLEVBQUU7SUFDaEMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNoRCxNQUFNLDJDQUEyQyxDQUFBO0tBQ2xEO0lBQ0QsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxLQUFLLFdBQVcsRUFBRTtRQUNsRCxNQUFNLDZDQUE2QyxDQUFBO0tBQ3BEO0lBQ0QsTUFBTSxJQUFJLEdBQVMsSUFBSSxVQUFJLENBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUNyQixRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FDbEMsQ0FBQTtJQUNELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBWlksUUFBQSxPQUFPLFdBWW5CO0FBRUQsSUFBWSxPQU9YO0FBUEQsV0FBWSxPQUFPO0lBQ2pCLHFDQUFJLENBQUE7SUFDSiwyQ0FBTyxDQUFBO0lBQ1AsK0NBQVMsQ0FBQTtJQUNULDJDQUFPLENBQUE7SUFDUCwyQ0FBTyxDQUFBO0lBQ1AsbUNBQUcsQ0FBQTtBQUNMLENBQUMsRUFQVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFPbEI7QUFFTSxNQUFNLFdBQVcsR0FBRyxDQUFDLFVBQWlCLEVBQVEsRUFBRTtJQUNyRCxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksVUFBVSxFQUFFO1FBQzNFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBd0IsRUFBRTtZQUN2QyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2FBQ3JEO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUN4RDtZQUNELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ2hGO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUN4RDtZQUNELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQzlCLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2FBQ2hFO1lBQ0QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsUUFBUSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDeEI7UUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0tBQ0g7QUFDSCxDQUFDLENBQUE7QUF4QlksUUFBQSxXQUFXLGVBd0J2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcblxuZXhwb3J0IGNvbnN0IGdldEF4aWEgPSAoKTogQXhpYSA9PiB7XG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYuQVhJQUdPX0lQID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdGhyb3cgXCJVbmRlZmluZWQgZW52aXJvbm1lbnQgdmFyaWFibGU6IEFYSUFHT19JUFwiXG4gIH1cbiAgaWYgKHR5cGVvZiBwcm9jZXNzLmVudi5BWElBR09fUE9SVCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHRocm93IFwiVW5kZWZpbmVkIGVudmlyb25tZW50IHZhcmlhYmxlOiBBWElBR09fUE9SVFwiXG4gIH1cbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxuICAgIHByb2Nlc3MuZW52LkFYSUFHT19JUCxcbiAgICBwYXJzZUludChwcm9jZXNzLmVudi5BWElBR09fUE9SVClcbiAgKVxuICByZXR1cm4gYXhpYVxufVxuXG5leHBvcnQgZW51bSBNYXRjaGVyIHtcbiAgdG9CZSxcbiAgdG9FcXVhbCxcbiAgdG9Db250YWluLFxuICB0b01hdGNoLFxuICB0b1Rocm93LFxuICBHZXRcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRlc3RzID0gKHRlc3RzX3NwZWM6IGFueVtdKTogdm9pZCA9PiB7XG4gIGZvciAoY29uc3QgW3Rlc3ROYW1lLCBwcm9taXNlLCBwcmVwcm9jZXNzLCBtYXRjaGVyLCBleHBlY3RlZF0gb2YgdGVzdHNfc3BlYykge1xuICAgIHRlc3QodGVzdE5hbWUsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGlmIChtYXRjaGVyID09IE1hdGNoZXIudG9CZSkge1xuICAgICAgICBleHBlY3QocHJlcHJvY2Vzcyhhd2FpdCBwcm9taXNlKCkpKS50b0JlKGV4cGVjdGVkKCkpXG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hlciA9PSBNYXRjaGVyLnRvRXF1YWwpIHtcbiAgICAgICAgZXhwZWN0KHByZXByb2Nlc3MoYXdhaXQgcHJvbWlzZSgpKSkudG9FcXVhbChleHBlY3RlZCgpKVxuICAgICAgfVxuICAgICAgaWYgKG1hdGNoZXIgPT0gTWF0Y2hlci50b0NvbnRhaW4pIHtcbiAgICAgICAgZXhwZWN0KHByZXByb2Nlc3MoYXdhaXQgcHJvbWlzZSgpKSkudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKGV4cGVjdGVkKCkpKVxuICAgICAgfVxuICAgICAgaWYgKG1hdGNoZXIgPT0gTWF0Y2hlci50b01hdGNoKSB7XG4gICAgICAgIGV4cGVjdChwcmVwcm9jZXNzKGF3YWl0IHByb21pc2UoKSkpLnRvTWF0Y2goZXhwZWN0ZWQoKSlcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaGVyID09IE1hdGNoZXIudG9UaHJvdykge1xuICAgICAgICBhd2FpdCBleHBlY3QocHJlcHJvY2Vzcyhwcm9taXNlKCkpKS5yZWplY3RzLnRvVGhyb3coZXhwZWN0ZWQoKSlcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaGVyID09IE1hdGNoZXIuR2V0KSB7XG4gICAgICAgIGV4cGVjdGVkKCkudmFsdWUgPSBwcmVwcm9jZXNzKGF3YWl0IHByb21pc2UoKSlcbiAgICAgICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbiJdfQ==