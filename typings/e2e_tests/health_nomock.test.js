"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e2etestlib_1 = require("./e2etestlib");
describe("Info", () => {
    const axia = (0, e2etestlib_1.getAxia)();
    const health = axia.Health();
    // test_name          response_promise               resp_fn                 matcher           expected_value/obtained_value
    const tests_spec = [
        [
            "healthResponse",
            () => health.health(),
            (x) => {
                return x.healthy;
            },
            e2etestlib_1.Matcher.toBe,
            () => true
        ]
    ];
    (0, e2etestlib_1.createTests)(tests_spec);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoX25vbW9jay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZTJlX3Rlc3RzL2hlYWx0aF9ub21vY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE0RDtBQUk1RCxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUMxQixNQUFNLElBQUksR0FBUyxJQUFBLG9CQUFPLEdBQUUsQ0FBQTtJQUM1QixNQUFNLE1BQU0sR0FBYyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7SUFFdkMsNEhBQTRIO0lBQzVILE1BQU0sVUFBVSxHQUFRO1FBQ3RCO1lBQ0UsZ0JBQWdCO1lBQ2hCLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckIsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDSixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUE7WUFDbEIsQ0FBQztZQUNELG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDWDtLQUNGLENBQUE7SUFFRCxJQUFBLHdCQUFXLEVBQUMsVUFBVSxDQUFDLENBQUE7QUFDekIsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBeGlhLCBjcmVhdGVUZXN0cywgTWF0Y2hlciB9IGZyb20gXCIuL2UyZXRlc3RsaWJcIlxuaW1wb3J0IHsgSGVhbHRoQVBJIH0gZnJvbSBcIi4uL3NyYy9hcGlzL2hlYWx0aC9hcGlcIlxuaW1wb3J0IEF4aWEgZnJvbSBcInNyY1wiXG5cbmRlc2NyaWJlKFwiSW5mb1wiLCAoKTogdm9pZCA9PiB7XG4gIGNvbnN0IGF4aWE6IEF4aWEgPSBnZXRBeGlhKClcbiAgY29uc3QgaGVhbHRoOiBIZWFsdGhBUEkgPSBheGlhLkhlYWx0aCgpXG5cbiAgLy8gdGVzdF9uYW1lICAgICAgICAgIHJlc3BvbnNlX3Byb21pc2UgICAgICAgICAgICAgICByZXNwX2ZuICAgICAgICAgICAgICAgICBtYXRjaGVyICAgICAgICAgICBleHBlY3RlZF92YWx1ZS9vYnRhaW5lZF92YWx1ZVxuICBjb25zdCB0ZXN0c19zcGVjOiBhbnkgPSBbXG4gICAgW1xuICAgICAgXCJoZWFsdGhSZXNwb25zZVwiLFxuICAgICAgKCkgPT4gaGVhbHRoLmhlYWx0aCgpLFxuICAgICAgKHgpID0+IHtcbiAgICAgICAgcmV0dXJuIHguaGVhbHRoeVxuICAgICAgfSxcbiAgICAgIE1hdGNoZXIudG9CZSxcbiAgICAgICgpID0+IHRydWVcbiAgICBdXG4gIF1cblxuICBjcmVhdGVUZXN0cyh0ZXN0c19zcGVjKVxufSkiXX0=