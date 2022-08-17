"use strict";
/**
 * @packageDocumentation
 * @module PlatformVM-Interfaces
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgUGxhdGZvcm1WTS1JbnRlcmZhY2VzXG4gKi9cblxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcGVyc2lzdGVuY2VvcHRpb25zXCJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuXCJcbmltcG9ydCB7IFVUWE9TZXQgfSBmcm9tIFwiLi4vcGxhdGZvcm12bS91dHhvc1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0U3Rha2VQYXJhbXMge1xuICBhZGRyZXNzZXM6IHN0cmluZ1tdXG4gIGVuY29kaW5nOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRTdGFrZVJlc3BvbnNlIHtcbiAgc3Rha2VkOiBCTlxuICBzdGFrZWRPdXRwdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJld2FyZFVUWE9zUGFyYW1zIHtcbiAgdHhJRDogc3RyaW5nXG4gIGVuY29kaW5nOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRSZXdhcmRVVFhPc1Jlc3BvbnNlIHtcbiAgbnVtRmV0Y2hlZDogbnVtYmVyXG4gIHV0eG9zOiBzdHJpbmdbXVxuICBlbmNvZGluZzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0VmFsaWRhdG9yc0F0UGFyYW1zIHtcbiAgaGVpZ2h0OiBudW1iZXJcbiAgYWxseWNoYWluSUQ/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRWYWxpZGF0b3JzQXRSZXNwb25zZSB7XG4gIHZhbGlkYXRvcnM6IG9iamVjdFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEN1cnJlbnRWYWxpZGF0b3JzUGFyYW1zIHtcbiAgYWxseWNoYWluSUQ/OiBCdWZmZXIgfCBzdHJpbmdcbiAgbm9kZUlEcz86IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2FtcGxlVmFsaWRhdG9yc1BhcmFtcyB7XG4gIHNpemU6IG51bWJlciB8IHN0cmluZ1xuICBhbGx5Y2hhaW5JRD86IEJ1ZmZlciB8IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNhbXBsZVZhbGlkYXRvcnNQYXJhbXMge1xuICBzaXplOiBudW1iZXIgfCBzdHJpbmdcbiAgYWxseWNoYWluSUQ/OiBCdWZmZXIgfCBzdHJpbmcgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGRWYWxpZGF0b3JQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbiAgbm9kZUlEOiBzdHJpbmdcbiAgc3RhcnRUaW1lOiBudW1iZXJcbiAgZW5kVGltZTogbnVtYmVyXG4gIHN0YWtlQW1vdW50OiBzdHJpbmdcbiAgcmV3YXJkQWRkcmVzczogc3RyaW5nXG4gIG5vbWluYXRpb25GZWVSYXRlPzogc3RyaW5nIHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWRkTm9taW5hdG9yUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIG5vZGVJRDogc3RyaW5nXG4gIHN0YXJ0VGltZTogbnVtYmVyXG4gIGVuZFRpbWU6IG51bWJlclxuICBzdGFrZUFtb3VudDogc3RyaW5nXG4gIHJld2FyZEFkZHJlc3M6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFBlbmRpbmdWYWxpZGF0b3JzUGFyYW1zIHtcbiAgYWxseWNoYWluSUQ/OiBCdWZmZXIgfCBzdHJpbmdcbiAgbm9kZUlEcz86IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0QVhDUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIGFtb3VudDogc3RyaW5nXG4gIHRvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbXBvcnRBWENQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbiAgc291cmNlQ2hhaW46IHN0cmluZ1xuICB0bzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0S2V5UGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIGFkZHJlc3M6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEltcG9ydEtleVBhcmFtcyB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgcGFzc3dvcmQ6IHN0cmluZ1xuICBwcml2YXRlS2V5OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCYWxhbmNlUmVzcG9uc2Uge1xuICBiYWxhbmNlOiBCTiB8IG51bWJlclxuICB1bmxvY2tlZDogQk4gfCBudW1iZXJcbiAgbG9ja2VkU3Rha2VhYmxlOiBCTiB8IG51bWJlclxuICBsb2NrZWROb3RTdGFrZWFibGU6IEJOIHwgbnVtYmVyXG4gIHV0eG9JRHM6IHtcbiAgICB0eElEOiBzdHJpbmdcbiAgICBvdXRwdXRJbmRleDogbnVtYmVyXG4gIH1bXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZUFkZHJlc3NQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaXN0QWRkcmVzc2VzUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhcnRJbmRleCB7XG4gIGFkZHJlc3M6IHN0cmluZ1xuICB1dHhvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVVFhPc1BhcmFtcyB7XG4gIGFkZHJlc3Nlczogc3RyaW5nW10gfCBzdHJpbmdcbiAgc291cmNlQ2hhaW4/OiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgbGltaXQ6IG51bWJlciB8IDBcbiAgc3RhcnRJbmRleD86IFN0YXJ0SW5kZXggfCB1bmRlZmluZWRcbiAgcGVyc2lzdE9wdHM/OiBQZXJzaXN0YW5jZU9wdGlvbnMgfCB1bmRlZmluZWRcbiAgZW5jb2Rpbmc/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRJbmRleCB7XG4gIGFkZHJlc3M6IHN0cmluZ1xuICB1dHhvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVVFhPc1Jlc3BvbnNlIHtcbiAgbnVtRmV0Y2hlZDogbnVtYmVyXG4gIHV0eG9zOiBVVFhPU2V0XG4gIGVuZEluZGV4OiBFbmRJbmRleFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZUFsbHljaGFpblBhcmFtcyB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgcGFzc3dvcmQ6IHN0cmluZ1xuICBjb250cm9sS2V5czogc3RyaW5nW11cbiAgdGhyZXNob2xkOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbGx5Y2hhaW4ge1xuICBpZHM6IHN0cmluZ1xuICBjb250cm9sS2V5czogc3RyaW5nW11cbiAgdGhyZXNob2xkOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVCbG9ja2NoYWluUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIGFsbHljaGFpbklEPzogQnVmZmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHZtSUQ6IHN0cmluZ1xuICBmeElEczogbnVtYmVyW11cbiAgbmFtZTogc3RyaW5nXG4gIGdlbmVzaXNEYXRhOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja2NoYWluIHtcbiAgaWQ6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgYWxseWNoYWluSUQ6IHN0cmluZ1xuICB2bUlEOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRUeFN0YXR1c1BhcmFtcyB7XG4gIHR4SUQ6IHN0cmluZ1xuICBpbmNsdWRlUmVhc29uPzogYm9vbGVhbiB8IHRydWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRUeFN0YXR1c1Jlc3BvbnNlIHtcbiAgc3RhdHVzOiBzdHJpbmdcbiAgcmVhc29uOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRNaW5TdGFrZVJlc3BvbnNlIHtcbiAgbWluVmFsaWRhdG9yU3Rha2U6IEJOXG4gIG1pbk5vbWluYXRvclN0YWtlOiBCTlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldE1heFN0YWtlQW1vdW50UGFyYW1zIHtcbiAgYWxseWNoYWluSUQ/OiBzdHJpbmdcbiAgbm9kZUlEOiBzdHJpbmdcbiAgc3RhcnRUaW1lOiBCTlxuICBlbmRUaW1lOiBCTlxufVxuIl19