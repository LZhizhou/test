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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5c3RvcmVfbm9tb2NrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9lMmVfdGVzdHMva2V5c3RvcmVfbm9tb2NrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEQ7QUFJNUQsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFTLEVBQUU7SUFDOUIsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFBO0lBQ3ZDLE1BQU0sU0FBUyxHQUFXLGFBQWEsQ0FBQTtJQUN2QyxNQUFNLFNBQVMsR0FBVyxhQUFhLENBQUE7SUFDdkMsTUFBTSxRQUFRLEdBQVcsZ0JBQWdCLENBQUE7SUFFekMsSUFBSSxZQUFZLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFFaEMsTUFBTSxJQUFJLEdBQVMsSUFBQSxvQkFBTyxHQUFFLENBQUE7SUFDNUIsTUFBTSxRQUFRLEdBQWdCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUU3QywrSEFBK0g7SUFDL0gsTUFBTSxVQUFVLEdBQVE7UUFDdEI7WUFDRSxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO1lBQzVDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsc0JBQXNCO1NBQzdCO1FBQ0Q7WUFDRSxZQUFZO1lBQ1osR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO1lBQzlDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsSUFBSTtTQUNYO1FBQ0Q7WUFDRSxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFB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LENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBeGlhLCBjcmVhdGVUZXN0cywgTWF0Y2hlciB9IGZyb20gXCIuL2UyZXRlc3RsaWJcIlxyXG5pbXBvcnQgeyBLZXlzdG9yZUFQSSB9IGZyb20gXCJzcmMvYXBpcy9rZXlzdG9yZS9hcGlcIlxyXG5pbXBvcnQgQXhpYSBmcm9tIFwic3JjXCJcclxuXHJcbmRlc2NyaWJlKFwiS2V5c3RvcmVcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IHVzZXJuYW1lMTogc3RyaW5nID0gXCJheGlhSnNVc2VyMVwiXHJcbiAgY29uc3QgdXNlcm5hbWUyOiBzdHJpbmcgPSBcImF4aWFKc1VzZXIyXCJcclxuICBjb25zdCB1c2VybmFtZTM6IHN0cmluZyA9IFwiYXhpYUpzVXNlcjNcIlxyXG4gIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcImF4aWFKc1Axc3N3NHJkXCJcclxuXHJcbiAgbGV0IGV4cG9ydGVkVXNlciA9IHsgdmFsdWU6IFwiXCIgfVxyXG5cclxuICBjb25zdCBheGlhOiBBeGlhID0gZ2V0QXhpYSgpXHJcbiAgY29uc3Qga2V5c3RvcmU6IEtleXN0b3JlQVBJID0gYXhpYS5Ob2RlS2V5cygpXHJcblxyXG4gIC8vIHRlc3RfbmFtZSAgICAgICAgICAgICByZXNwb25zZV9wcm9taXNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcF9mbiAgbWF0Y2hlciAgICAgICAgICAgZXhwZWN0ZWRfdmFsdWUvb2J0YWluZWRfdmFsdWVcclxuICBjb25zdCB0ZXN0c19zcGVjOiBhbnkgPSBbXHJcbiAgICBbXHJcbiAgICAgIFwiY3JlYXRlVXNlcldlYWtQYXNzXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUxLCBcIndlYWtcIiksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvVGhyb3csXHJcbiAgICAgICgpID0+IFwicGFzc3dvcmQgaXMgdG9vIHdlYWtcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJjcmVhdGVVc2VyXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUxLCBwYXNzd29yZCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IHRydWVcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiY3JlYXRlUmVwZWF0ZWRVc2VyXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUxLCBwYXNzd29yZCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvVGhyb3csXHJcbiAgICAgICgpID0+IFwidXNlciBhbHJlYWR5IGV4aXN0czogXCIgKyB1c2VybmFtZTFcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwibGlzdFVzZXJzXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmxpc3RVc2VycygpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0NvbnRhaW4sXHJcbiAgICAgICgpID0+IFt1c2VybmFtZTFdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImV4cG9ydFVzZXJcIixcclxuICAgICAgKCkgPT4ga2V5c3RvcmUuZXhwb3J0VXNlcih1c2VybmFtZTEsIHBhc3N3b3JkKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9NYXRjaCxcclxuICAgICAgKCkgPT4gL1xcd3s3OH0vXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldEV4cG9ydGVkVXNlclwiLFxyXG4gICAgICAoKSA9PiBrZXlzdG9yZS5leHBvcnRVc2VyKHVzZXJuYW1lMSwgcGFzc3dvcmQpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci5HZXQsXHJcbiAgICAgICgpID0+IGV4cG9ydGVkVXNlclxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJpbXBvcnRVc2VyXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmltcG9ydFVzZXIodXNlcm5hbWUyLCBleHBvcnRlZFVzZXIudmFsdWUsIHBhc3N3b3JkKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9CZSxcclxuICAgICAgKCkgPT4gdHJ1ZVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJleHBvcnRJbXBvcnRVc2VyXCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgIGxldCBleHBvcnRlZCA9IGF3YWl0IGtleXN0b3JlLmV4cG9ydFVzZXIodXNlcm5hbWUxLCBwYXNzd29yZClcclxuICAgICAgICAgIHJldHVybiBhd2FpdCBrZXlzdG9yZS5pbXBvcnRVc2VyKHVzZXJuYW1lMywgZXhwb3J0ZWQsIHBhc3N3b3JkKVxyXG4gICAgICAgIH0pKCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IHRydWVcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwibGlzdFVzZXJzMlwiLFxyXG4gICAgICAoKSA9PiBrZXlzdG9yZS5saXN0VXNlcnMoKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9Db250YWluLFxyXG4gICAgICAoKSA9PiBbdXNlcm5hbWUxLCB1c2VybmFtZTIsIHVzZXJuYW1lM11cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZGVsZXRlVXNlcjFcIixcclxuICAgICAgKCkgPT4ga2V5c3RvcmUuZGVsZXRlVXNlcih1c2VybmFtZTEsIHBhc3N3b3JkKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9CZSxcclxuICAgICAgKCkgPT4gdHJ1ZVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJkZWxldGVVc2VyMlwiLFxyXG4gICAgICAoKSA9PiBrZXlzdG9yZS5kZWxldGVVc2VyKHVzZXJuYW1lMiwgcGFzc3dvcmQpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiB0cnVlXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImRlbGV0ZVVzZXIzXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmRlbGV0ZVVzZXIodXNlcm5hbWUzLCBwYXNzd29yZCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IHRydWVcclxuICAgIF1cclxuICBdXHJcblxyXG4gIGNyZWF0ZVRlc3RzKHRlc3RzX3NwZWMpXHJcbn0pIl19