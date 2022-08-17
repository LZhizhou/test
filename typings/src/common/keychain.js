"use strict";
/**
 * @packageDocumentation
 * @module Common-KeyChain
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardKeyChain = exports.StandardKeyPair = void 0;
const buffer_1 = require("buffer/");
/**
 * Class for representing a private and public keypair in Axia.
 * All APIs that need key pairs should extend on this class.
 */
class StandardKeyPair {
    /**
     * Returns a reference to the private key.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the private key
     */
    getPrivateKey() {
        return this.privk;
    }
    /**
     * Returns a reference to the public key.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the public key
     */
    getPublicKey() {
        return this.pubk;
    }
}
exports.StandardKeyPair = StandardKeyPair;
/**
 * Class for representing a key chain in Axia.
 * All endpoints that need key chains should extend on this class.
 *
 * @typeparam KPClass extending [[StandardKeyPair]] which is used as the key in [[StandardKeyChain]]
 */
class StandardKeyChain {
    constructor() {
        this.keys = {};
        /**
         * Gets an array of addresses stored in the [[StandardKeyChain]].
         *
         * @returns An array of {@link https://github.com/feross/buffer|Buffer}  representations
         * of the addresses
         */
        this.getAddresses = () => Object.values(this.keys).map((kp) => kp.getAddress());
        /**
         * Gets an array of addresses stored in the [[StandardKeyChain]].
         *
         * @returns An array of string representations of the addresses
         */
        this.getAddressStrings = () => Object.values(this.keys).map((kp) => kp.getAddressString());
        /**
         * Removes the key pair from the list of they keys managed in the [[StandardKeyChain]].
         *
         * @param key A {@link https://github.com/feross/buffer|Buffer} for the address or
         * KPClass to remove
         *
         * @returns The boolean true if a key was removed.
         */
        this.removeKey = (key) => {
            let kaddr;
            if (key instanceof buffer_1.Buffer) {
                kaddr = key.toString("hex");
            }
            else {
                kaddr = key.getAddress().toString("hex");
            }
            if (kaddr in this.keys) {
                delete this.keys[`${kaddr}`];
                return true;
            }
            return false;
        };
        /**
         * Checks if there is a key associated with the provided address.
         *
         * @param address The address to check for existence in the keys database
         *
         * @returns True on success, false if not found
         */
        this.hasKey = (address) => address.toString("hex") in this.keys;
        /**
         * Returns the [[StandardKeyPair]] listed under the provided address
         *
         * @param address The {@link https://github.com/feross/buffer|Buffer} of the address to
         * retrieve from the keys database
         *
         * @returns A reference to the [[StandardKeyPair]] in the keys database
         */
        this.getKey = (address) => this.keys[address.toString("hex")];
    }
    /**
     * Adds the key pair to the list of the keys managed in the [[StandardKeyChain]].
     *
     * @param newKey A key pair of the appropriate class to be added to the [[StandardKeyChain]]
     */
    addKey(newKey) {
        this.keys[newKey.getAddress().toString("hex")] = newKey;
    }
}
exports.StandardKeyChain = StandardKeyChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Y2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL2tleWNoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQUVILG9DQUFnQztBQUVoQzs7O0dBR0c7QUFDSCxNQUFzQixlQUFlO0lBb0RuQzs7OztPQUlHO0lBQ0gsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztDQWlDRjtBQXJHRCwwQ0FxR0M7QUFFRDs7Ozs7R0FLRztBQUNILE1BQXNCLGdCQUFnQjtJQUF0QztRQUNZLFNBQUksR0FBbUMsRUFBRSxDQUFBO1FBa0JuRDs7Ozs7V0FLRztRQUNILGlCQUFZLEdBQUcsR0FBYSxFQUFFLENBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFFdkQ7Ozs7V0FJRztRQUNILHNCQUFpQixHQUFHLEdBQWEsRUFBRSxDQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7UUFXN0Q7Ozs7Ozs7V0FPRztRQUNILGNBQVMsR0FBRyxDQUFDLEdBQXFCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLEtBQWEsQ0FBQTtZQUNqQixJQUFJLEdBQUcsWUFBWSxlQUFNLEVBQUU7Z0JBQ3pCLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQzVCO2lCQUFNO2dCQUNMLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3pDO1lBQ0QsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQkFDNUIsT0FBTyxJQUFJLENBQUE7YUFDWjtZQUNELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQyxDQUFBO1FBRUQ7Ozs7OztXQU1HO1FBQ0gsV0FBTSxHQUFHLENBQUMsT0FBZSxFQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUE7UUFFM0U7Ozs7Ozs7V0FPRztRQUNILFdBQU0sR0FBRyxDQUFDLE9BQWUsRUFBVyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFPM0UsQ0FBQztJQXZEQzs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE1BQWU7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFBO0lBQ3pELENBQUM7Q0FnREY7QUEzRkQsNENBMkZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIENvbW1vbi1LZXlDaGFpblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcmVwcmVzZW50aW5nIGEgcHJpdmF0ZSBhbmQgcHVibGljIGtleXBhaXIgaW4gQXhpYS5cclxuICogQWxsIEFQSXMgdGhhdCBuZWVkIGtleSBwYWlycyBzaG91bGQgZXh0ZW5kIG9uIHRoaXMgY2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhbmRhcmRLZXlQYWlyIHtcclxuICBwcm90ZWN0ZWQgcHViazogQnVmZmVyXHJcbiAgcHJvdGVjdGVkIHByaXZrOiBCdWZmZXJcclxuXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGVzIGEgbmV3IGtleXBhaXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW50cm9weSBPcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBtYXkgYmUgbmVjZXNzYXJ5IHRvIHByb2R1Y2Ugc2VjdXJlIGtleXNcclxuICAgKi9cclxuICBhYnN0cmFjdCBnZW5lcmF0ZUtleShlbnRyb3B5PzogQnVmZmVyKTogdm9pZFxyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnRzIGEgcHJpdmF0ZSBrZXkgYW5kIGdlbmVyYXRlcyB0aGUgYXBwcm9wcmlhdGUgcHVibGljIGtleS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwcml2ayBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHRydWUgb24gc3VjY2VzcywgZmFsc2Ugb24gZmFpbHVyZVxyXG4gICAqL1xyXG4gIGFic3RyYWN0IGltcG9ydEtleShwcml2azogQnVmZmVyKTogYm9vbGVhblxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIG1lc3NhZ2UsIHNpZ25zIGl0LCBhbmQgcmV0dXJucyB0aGUgc2lnbmF0dXJlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1zZyBUaGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgdGhlIHNpZ25hdHVyZVxyXG4gICAqL1xyXG4gIGFic3RyYWN0IHNpZ24obXNnOiBCdWZmZXIpOiBCdWZmZXJcclxuXHJcbiAgLyoqXHJcbiAgICogUmVjb3ZlcnMgdGhlIHB1YmxpYyBrZXkgb2YgYSBtZXNzYWdlIHNpZ25lciBmcm9tIGEgbWVzc2FnZSBhbmQgaXRzIGFzc29jaWF0ZWQgc2lnbmF0dXJlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1zZyBUaGUgbWVzc2FnZSB0aGF0J3Mgc2lnbmVkXHJcbiAgICogQHBhcmFtIHNpZyBUaGUgc2lnbmF0dXJlIHRoYXQncyBzaWduZWQgb24gdGhlIG1lc3NhZ2VcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyB0aGUgcHVibGljXHJcbiAgICoga2V5IG9mIHRoZSBzaWduZXJcclxuICAgKi9cclxuICBhYnN0cmFjdCByZWNvdmVyKG1zZzogQnVmZmVyLCBzaWc6IEJ1ZmZlcik6IEJ1ZmZlclxyXG5cclxuICAvKipcclxuICAgKiBWZXJpZmllcyB0aGF0IHRoZSBwcml2YXRlIGtleSBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIHB1YmxpYyBrZXkgcHJvZHVjZXMgdGhlXHJcbiAgICogc2lnbmF0dXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtc2cgVGhlIG1lc3NhZ2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBzaWduYXR1cmVcclxuICAgKiBAcGFyYW0gc2lnIFRoZSBzaWduYXR1cmUgb2YgdGhlIHNpZ25lZCBtZXNzYWdlXHJcbiAgICogQHBhcmFtIHB1YmsgVGhlIHB1YmxpYyBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBtZXNzYWdlIHNpZ25hdHVyZVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVHJ1ZSBvbiBzdWNjZXNzLCBmYWxzZSBvbiBmYWlsdXJlXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgdmVyaWZ5KG1zZzogQnVmZmVyLCBzaWc6IEJ1ZmZlciwgcHViazogQnVmZmVyKTogYm9vbGVhblxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBwcml2YXRlIGtleS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBnZXRQcml2YXRlS2V5KCk6IEJ1ZmZlciB7XHJcbiAgICByZXR1cm4gdGhpcy5wcml2a1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgcHVibGljIGtleS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyB0aGUgcHVibGljIGtleVxyXG4gICAqL1xyXG4gIGdldFB1YmxpY0tleSgpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMucHVia1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHJpdmF0ZSBrZXkuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHVibGljIGtleVxyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldFByaXZhdGVLZXlTdHJpbmcoKTogc3RyaW5nXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHB1YmxpYyBrZXkuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHVibGljIGtleVxyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldFB1YmxpY0tleVN0cmluZygpOiBzdHJpbmdcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYWRkcmVzcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhZGRyZXNzXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0QWRkcmVzcygpOiBCdWZmZXJcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYWRkcmVzcydzIHN0cmluZyByZXByZXNlbnRhdGlvbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhZGRyZXNzXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0QWRkcmVzc1N0cmluZygpOiBzdHJpbmdcclxuXHJcbiAgYWJzdHJhY3QgY3JlYXRlKC4uLmFyZ3M6IGFueVtdKTogdGhpc1xyXG5cclxuICBhYnN0cmFjdCBjbG9uZSgpOiB0aGlzXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcmVwcmVzZW50aW5nIGEga2V5IGNoYWluIGluIEF4aWEuXHJcbiAqIEFsbCBlbmRwb2ludHMgdGhhdCBuZWVkIGtleSBjaGFpbnMgc2hvdWxkIGV4dGVuZCBvbiB0aGlzIGNsYXNzLlxyXG4gKlxyXG4gKiBAdHlwZXBhcmFtIEtQQ2xhc3MgZXh0ZW5kaW5nIFtbU3RhbmRhcmRLZXlQYWlyXV0gd2hpY2ggaXMgdXNlZCBhcyB0aGUga2V5IGluIFtbU3RhbmRhcmRLZXlDaGFpbl1dXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyPiB7XHJcbiAgcHJvdGVjdGVkIGtleXM6IHsgW2FkZHJlc3M6IHN0cmluZ106IEtQQ2xhc3MgfSA9IHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2VzIGEgbmV3IFtbU3RhbmRhcmRLZXlQYWlyXV0sIHJldHVybnMgdGhlIGFkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBZGRyZXNzIG9mIHRoZSBuZXcgW1tTdGFuZGFyZEtleVBhaXJdXVxyXG4gICAqL1xyXG4gIG1ha2VLZXk6ICgpID0+IEtQQ2xhc3NcclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSBwcml2YXRlIGtleSwgbWFrZXMgYSBuZXcgW1tTdGFuZGFyZEtleVBhaXJdXSwgcmV0dXJucyB0aGUgYWRkcmVzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwcml2ayBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgbmV3IFtbU3RhbmRhcmRLZXlQYWlyXV1cclxuICAgKi9cclxuICBpbXBvcnRLZXk6IChwcml2azogQnVmZmVyKSA9PiBLUENsYXNzXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgYW4gYXJyYXkgb2YgYWRkcmVzc2VzIHN0b3JlZCBpbiB0aGUgW1tTdGFuZGFyZEtleUNoYWluXV0uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSAgcmVwcmVzZW50YXRpb25zXHJcbiAgICogb2YgdGhlIGFkZHJlc3Nlc1xyXG4gICAqL1xyXG4gIGdldEFkZHJlc3NlcyA9ICgpOiBCdWZmZXJbXSA9PlxyXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLmtleXMpLm1hcCgoa3ApID0+IGtwLmdldEFkZHJlc3MoKSlcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhbiBhcnJheSBvZiBhZGRyZXNzZXMgc3RvcmVkIGluIHRoZSBbW1N0YW5kYXJkS2V5Q2hhaW5dXS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHN0cmluZyByZXByZXNlbnRhdGlvbnMgb2YgdGhlIGFkZHJlc3Nlc1xyXG4gICAqL1xyXG4gIGdldEFkZHJlc3NTdHJpbmdzID0gKCk6IHN0cmluZ1tdID0+XHJcbiAgICBPYmplY3QudmFsdWVzKHRoaXMua2V5cykubWFwKChrcCkgPT4ga3AuZ2V0QWRkcmVzc1N0cmluZygpKVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIHRoZSBrZXkgcGFpciB0byB0aGUgbGlzdCBvZiB0aGUga2V5cyBtYW5hZ2VkIGluIHRoZSBbW1N0YW5kYXJkS2V5Q2hhaW5dXS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXdLZXkgQSBrZXkgcGFpciBvZiB0aGUgYXBwcm9wcmlhdGUgY2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIFtbU3RhbmRhcmRLZXlDaGFpbl1dXHJcbiAgICovXHJcbiAgYWRkS2V5KG5ld0tleTogS1BDbGFzcykge1xyXG4gICAgdGhpcy5rZXlzW25ld0tleS5nZXRBZGRyZXNzKCkudG9TdHJpbmcoXCJoZXhcIildID0gbmV3S2V5XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIHRoZSBrZXkgcGFpciBmcm9tIHRoZSBsaXN0IG9mIHRoZXkga2V5cyBtYW5hZ2VkIGluIHRoZSBbW1N0YW5kYXJkS2V5Q2hhaW5dXS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBrZXkgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3Mgb3JcclxuICAgKiBLUENsYXNzIHRvIHJlbW92ZVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGJvb2xlYW4gdHJ1ZSBpZiBhIGtleSB3YXMgcmVtb3ZlZC5cclxuICAgKi9cclxuICByZW1vdmVLZXkgPSAoa2V5OiBLUENsYXNzIHwgQnVmZmVyKSA9PiB7XHJcbiAgICBsZXQga2FkZHI6IHN0cmluZ1xyXG4gICAgaWYgKGtleSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xyXG4gICAgICBrYWRkciA9IGtleS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAga2FkZHIgPSBrZXkuZ2V0QWRkcmVzcygpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICB9XHJcbiAgICBpZiAoa2FkZHIgaW4gdGhpcy5rZXlzKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmtleXNbYCR7a2FkZHJ9YF1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIGlmIHRoZXJlIGlzIGEga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgYWRkcmVzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIHRvIGNoZWNrIGZvciBleGlzdGVuY2UgaW4gdGhlIGtleXMgZGF0YWJhc2VcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRydWUgb24gc3VjY2VzcywgZmFsc2UgaWYgbm90IGZvdW5kXHJcbiAgICovXHJcbiAgaGFzS2V5ID0gKGFkZHJlc3M6IEJ1ZmZlcik6IGJvb2xlYW4gPT4gYWRkcmVzcy50b1N0cmluZyhcImhleFwiKSBpbiB0aGlzLmtleXNcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgW1tTdGFuZGFyZEtleVBhaXJdXSBsaXN0ZWQgdW5kZXIgdGhlIHByb3ZpZGVkIGFkZHJlc3NcclxuICAgKlxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvZiB0aGUgYWRkcmVzcyB0b1xyXG4gICAqIHJldHJpZXZlIGZyb20gdGhlIGtleXMgZGF0YWJhc2VcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBbW1N0YW5kYXJkS2V5UGFpcl1dIGluIHRoZSBrZXlzIGRhdGFiYXNlXHJcbiAgICovXHJcbiAgZ2V0S2V5ID0gKGFkZHJlc3M6IEJ1ZmZlcik6IEtQQ2xhc3MgPT4gdGhpcy5rZXlzW2FkZHJlc3MudG9TdHJpbmcoXCJoZXhcIildXHJcblxyXG4gIGFic3RyYWN0IGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXNcclxuXHJcbiAgYWJzdHJhY3QgY2xvbmUoKTogdGhpc1xyXG5cclxuICBhYnN0cmFjdCB1bmlvbihrYzogdGhpcyk6IHRoaXNcclxufVxyXG4iXX0=