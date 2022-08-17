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
const e2etestlib_1 = require("./e2etestlib");
describe("Keystore", () => {
    const username1 = "axiaJsUser1";
    const username2 = "axiaJsUser2";
    const username3 = "axiaJsUser3";
    const password = "axiaJsP1ssw4rd";
    let exportedUser = { value: "" };
    const axia = (0, e2etestlib_1.getAxia)();
    const keystore = axia.NodeKeys();
    // test_name             response_promise                              resp_fn  matcher           expected_value/obtained_value
    const tests_spec = [
        [
            "createUserWeakPass",
            () => keystore.createUser(username1, "weak"),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => "password is too weak"
        ],
        [
            "createUser",
            () => keystore.createUser(username1, password),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "createRepeatedUser",
            () => keystore.createUser(username1, password),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => "user already exists: " + username1
        ],
        [
            "listUsers",
            () => keystore.listUsers(),
            (x) => x,
            e2etestlib_1.Matcher.toContain,
            () => [username1]
        ],
        [
            "exportUser",
            () => keystore.exportUser(username1, password),
            (x) => x,
            e2etestlib_1.Matcher.toMatch,
            () => /\w{78}/
        ],
        [
            "getExportedUser",
            () => keystore.exportUser(username1, password),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => exportedUser
        ],
        [
            "importUser",
            () => keystore.importUser(username2, exportedUser.value, password),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "exportImportUser",
            () => (() => __awaiter(void 0, void 0, void 0, function* () {
                let exported = yield keystore.exportUser(username1, password);
                return yield keystore.importUser(username3, exported, password);
            }))(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "listUsers2",
            () => keystore.listUsers(),
            (x) => x,
            e2etestlib_1.Matcher.toContain,
            () => [username1, username2, username3]
        ],
        [
            "deleteUser1",
            () => keystore.deleteUser(username1, password),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "deleteUser2",
            () => keystore.deleteUser(username2, password),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "deleteUser3",
            () => keystore.deleteUser(username3, password),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ]
    ];
    (0, e2etestlib_1.createTests)(tests_spec);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5c3RvcmVfbm9tb2NrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9lMmVfdGVzdHMva2V5c3RvcmVfbm9tb2NrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEQ7QUFJNUQsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFTLEVBQUU7SUFDOUIsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFBO0lBQ3ZDLE1BQU0sU0FBUyxHQUFXLGFBQWEsQ0FBQTtJQUN2QyxNQUFNLFNBQVMsR0FBVyxhQUFhLENBQUE7SUFDdkMsTUFBTSxRQUFRLEdBQVcsZ0JBQWdCLENBQUE7SUFFekMsSUFBSSxZQUFZLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFFaEMsTUFBTSxJQUFJLEdBQVMsSUFBQSxvQkFBTyxHQUFFLENBQUE7SUFDNUIsTUFBTSxRQUFRLEdBQWdCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUU3QywrSEFBK0g7SUFDL0gsTUFBTSxVQUFVLEdBQVE7UUFDdEI7WUFDRSxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO1lBQzVDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsc0JBQXNCO1NBQzdCO1FBQ0Q7WUFDRSxZQUFZO1lBQ1osR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO1lBQzlDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSTtTQUNYO1FBQ0Q7WUFDRSxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFB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LENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBeGlhLCBjcmVhdGVUZXN0cywgTWF0Y2hlciB9IGZyb20gXCIuL2UyZXRlc3RsaWJcIlxuaW1wb3J0IHsgS2V5c3RvcmVBUEkgfSBmcm9tIFwic3JjL2FwaXMva2V5c3RvcmUvYXBpXCJcbmltcG9ydCBBeGlhIGZyb20gXCJzcmNcIlxuXG5kZXNjcmliZShcIktleXN0b3JlXCIsICgpOiB2b2lkID0+IHtcbiAgY29uc3QgdXNlcm5hbWUxOiBzdHJpbmcgPSBcImF4aWFKc1VzZXIxXCJcbiAgY29uc3QgdXNlcm5hbWUyOiBzdHJpbmcgPSBcImF4aWFKc1VzZXIyXCJcbiAgY29uc3QgdXNlcm5hbWUzOiBzdHJpbmcgPSBcImF4aWFKc1VzZXIzXCJcbiAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiYXhpYUpzUDFzc3c0cmRcIlxuXG4gIGxldCBleHBvcnRlZFVzZXIgPSB7IHZhbHVlOiBcIlwiIH1cblxuICBjb25zdCBheGlhOiBBeGlhID0gZ2V0QXhpYSgpXG4gIGNvbnN0IGtleXN0b3JlOiBLZXlzdG9yZUFQSSA9IGF4aWEuTm9kZUtleXMoKVxuXG4gIC8vIHRlc3RfbmFtZSAgICAgICAgICAgICByZXNwb25zZV9wcm9taXNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcF9mbiAgbWF0Y2hlciAgICAgICAgICAgZXhwZWN0ZWRfdmFsdWUvb2J0YWluZWRfdmFsdWVcbiAgY29uc3QgdGVzdHNfc3BlYzogYW55ID0gW1xuICAgIFtcbiAgICAgIFwiY3JlYXRlVXNlcldlYWtQYXNzXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5jcmVhdGVVc2VyKHVzZXJuYW1lMSwgXCJ3ZWFrXCIpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvVGhyb3csXG4gICAgICAoKSA9PiBcInBhc3N3b3JkIGlzIHRvbyB3ZWFrXCJcbiAgICBdLFxuICAgIFtcbiAgICAgIFwiY3JlYXRlVXNlclwiLFxuICAgICAgKCkgPT4ga2V5c3RvcmUuY3JlYXRlVXNlcih1c2VybmFtZTEsIHBhc3N3b3JkKSxcbiAgICAgICh4KSA9PiB4LFxuICAgICAgTWF0Y2hlci50b0JlLFxuICAgICAgKCkgPT4gdHJ1ZVxuICAgIF0sXG4gICAgW1xuICAgICAgXCJjcmVhdGVSZXBlYXRlZFVzZXJcIixcbiAgICAgICgpID0+IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUxLCBwYXNzd29yZCksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9UaHJvdyxcbiAgICAgICgpID0+IFwidXNlciBhbHJlYWR5IGV4aXN0czogXCIgKyB1c2VybmFtZTFcbiAgICBdLFxuICAgIFtcbiAgICAgIFwibGlzdFVzZXJzXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5saXN0VXNlcnMoKSxcbiAgICAgICh4KSA9PiB4LFxuICAgICAgTWF0Y2hlci50b0NvbnRhaW4sXG4gICAgICAoKSA9PiBbdXNlcm5hbWUxXVxuICAgIF0sXG4gICAgW1xuICAgICAgXCJleHBvcnRVc2VyXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5leHBvcnRVc2VyKHVzZXJuYW1lMSwgcGFzc3dvcmQpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvTWF0Y2gsXG4gICAgICAoKSA9PiAvXFx3ezc4fS9cbiAgICBdLFxuICAgIFtcbiAgICAgIFwiZ2V0RXhwb3J0ZWRVc2VyXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5leHBvcnRVc2VyKHVzZXJuYW1lMSwgcGFzc3dvcmQpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLkdldCxcbiAgICAgICgpID0+IGV4cG9ydGVkVXNlclxuICAgIF0sXG4gICAgW1xuICAgICAgXCJpbXBvcnRVc2VyXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5pbXBvcnRVc2VyKHVzZXJuYW1lMiwgZXhwb3J0ZWRVc2VyLnZhbHVlLCBwYXNzd29yZCksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9CZSxcbiAgICAgICgpID0+IHRydWVcbiAgICBdLFxuICAgIFtcbiAgICAgIFwiZXhwb3J0SW1wb3J0VXNlclwiLFxuICAgICAgKCkgPT5cbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICBsZXQgZXhwb3J0ZWQgPSBhd2FpdCBrZXlzdG9yZS5leHBvcnRVc2VyKHVzZXJuYW1lMSwgcGFzc3dvcmQpXG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGtleXN0b3JlLmltcG9ydFVzZXIodXNlcm5hbWUzLCBleHBvcnRlZCwgcGFzc3dvcmQpXG4gICAgICAgIH0pKCksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9CZSxcbiAgICAgICgpID0+IHRydWVcbiAgICBdLFxuICAgIFtcbiAgICAgIFwibGlzdFVzZXJzMlwiLFxuICAgICAgKCkgPT4ga2V5c3RvcmUubGlzdFVzZXJzKCksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9Db250YWluLFxuICAgICAgKCkgPT4gW3VzZXJuYW1lMSwgdXNlcm5hbWUyLCB1c2VybmFtZTNdXG4gICAgXSxcbiAgICBbXG4gICAgICBcImRlbGV0ZVVzZXIxXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5kZWxldGVVc2VyKHVzZXJuYW1lMSwgcGFzc3dvcmQpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvQmUsXG4gICAgICAoKSA9PiB0cnVlXG4gICAgXSxcbiAgICBbXG4gICAgICBcImRlbGV0ZVVzZXIyXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5kZWxldGVVc2VyKHVzZXJuYW1lMiwgcGFzc3dvcmQpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvQmUsXG4gICAgICAoKSA9PiB0cnVlXG4gICAgXSxcbiAgICBbXG4gICAgICBcImRlbGV0ZVVzZXIzXCIsXG4gICAgICAoKSA9PiBrZXlzdG9yZS5kZWxldGVVc2VyKHVzZXJuYW1lMywgcGFzc3dvcmQpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvQmUsXG4gICAgICAoKSA9PiB0cnVlXG4gICAgXVxuICBdXG5cbiAgY3JlYXRlVGVzdHModGVzdHNfc3BlYylcbn0pIl19