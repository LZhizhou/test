import AxiaCore from "../src/axia";
import { AxiosRequestConfig } from "axios";
import { APIBase, RequestResponseData } from "../src/common/apibase";
export declare class TestAPI extends APIBase {
    TestGET: (input: string, path?: string, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    TestDELETE: (input: string, path?: string, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    TestPOST: (input: string, path?: string, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    TestPUT: (input: string, path?: string, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    TestPATCH: (input: string, path?: string, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    protected _respFn: (res: RequestResponseData) => any;
    protected _TestMethod: (method: string, path?: string, getdata?: object, postdata?: object, axiosConfig?: AxiosRequestConfig) => Promise<object>;
    constructor(axc: AxiaCore, endpoint?: string);
}
//# sourceMappingURL=testlib.d.ts.map