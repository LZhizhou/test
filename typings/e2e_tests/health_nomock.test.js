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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoX25vbW9jay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZTJlX3Rlc3RzL2hlYWx0aF9ub21vY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE0RDtBQUk1RCxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUMxQixNQUFNLElBQUksR0FBUyxJQUFBLG9CQUFPLEdBQUUsQ0FBQTtJQUM1QixNQUFNLE1BQU0sR0FBYyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7SUFFdkMsNEhBQTRIO0lBQzVILE1BQU0sVUFBVSxHQUFRO1FBQ3RCO1lBQ0UsZ0JBQWdCO1lBQ2hCLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckIsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDSixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUE7WUFDbEIsQ0FBQztZQUNELG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDWDtLQUNGLENBQUE7SUFFRCxJQUFBLHdCQUFXLEVBQUMsVUFBVSxDQUFDLENBQUE7QUFDekIsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBeGlhLCBjcmVhdGVUZXN0cywgTWF0Y2hlciB9IGZyb20gXCIuL2UyZXRlc3RsaWJcIlxyXG5pbXBvcnQgeyBIZWFsdGhBUEkgfSBmcm9tIFwiLi4vc3JjL2FwaXMvaGVhbHRoL2FwaVwiXHJcbmltcG9ydCBBeGlhIGZyb20gXCJzcmNcIlxyXG5cclxuZGVzY3JpYmUoXCJJbmZvXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBheGlhOiBBeGlhID0gZ2V0QXhpYSgpXHJcbiAgY29uc3QgaGVhbHRoOiBIZWFsdGhBUEkgPSBheGlhLkhlYWx0aCgpXHJcblxyXG4gIC8vIHRlc3RfbmFtZSAgICAgICAgICByZXNwb25zZV9wcm9taXNlICAgICAgICAgICAgICAgcmVzcF9mbiAgICAgICAgICAgICAgICAgbWF0Y2hlciAgICAgICAgICAgZXhwZWN0ZWRfdmFsdWUvb2J0YWluZWRfdmFsdWVcclxuICBjb25zdCB0ZXN0c19zcGVjOiBhbnkgPSBbXHJcbiAgICBbXHJcbiAgICAgIFwiaGVhbHRoUmVzcG9uc2VcIixcclxuICAgICAgKCkgPT4gaGVhbHRoLmhlYWx0aCgpLFxyXG4gICAgICAoeCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB4LmhlYWx0aHlcclxuICAgICAgfSxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiB0cnVlXHJcbiAgICBdXHJcbiAgXVxyXG5cclxuICBjcmVhdGVUZXN0cyh0ZXN0c19zcGVjKVxyXG59KSJdfQ==