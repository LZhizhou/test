"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAllychainTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-CreateAllychainTx
 */
const buffer_1 = require("buffer/");
const basetx_1 = require("./basetx");
const constants_1 = require("./constants");
const constants_2 = require("../../utils/constants");
const outputs_1 = require("./outputs");
const errors_1 = require("../../utils/errors");
class CreateAllychainTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned Create Allychain transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param allychainOwners Optional [[SECPOwnerOutput]] class for specifying who owns the allychain.
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, allychainOwners = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "CreateAllychainTx";
        this._typeID = constants_1.PlatformVMConstants.CREATEALLYCHAINTX;
        this.allychainOwners = undefined;
        this.allychainOwners = allychainOwners;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { allychainOwners: this.allychainOwners.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.allychainOwners = new outputs_1.SECPOwnerOutput();
        this.allychainOwners.deserialize(fields["allychainOwners"], encoding);
    }
    /**
     * Returns the id of the [[CreateAllychainTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
     */
    getAllychainOwners() {
        return this.allychainOwners;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateAllychainTx]], parses it, populates the class, and returns the length of the [[CreateAllychainTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateAllychainTx]]
     * @param offset A number for the starting position in the bytes.
     *
     * @returns The length of the raw [[CreateAllychainTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        offset += 4;
        this.allychainOwners = new outputs_1.SECPOwnerOutput();
        offset = this.allychainOwners.fromBuffer(bytes, offset);
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateAllychainTx]].
     */
    toBuffer() {
        if (typeof this.allychainOwners === "undefined" ||
            !(this.allychainOwners instanceof outputs_1.SECPOwnerOutput)) {
            throw new errors_1.AllychainOwnerError("CreateAllychainTx.toBuffer -- this.allychainOwners is not a SECPOwnerOutput");
        }
        let typeID = buffer_1.Buffer.alloc(4);
        typeID.writeUInt32BE(this.allychainOwners.getOutputID(), 0);
        let barr = [
            super.toBuffer(),
            typeID,
            this.allychainOwners.toBuffer()
        ];
        return buffer_1.Buffer.concat(barr);
    }
}
exports.CreateAllychainTx = CreateAllychainTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlYWxseWNoYWludHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2NyZWF0ZWFsbHljaGFpbnR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxxQ0FBaUM7QUFDakMsMkNBQWlEO0FBQ2pELHFEQUF3RDtBQUN4RCx1Q0FBK0Q7QUFHL0QsK0NBQXdEO0FBRXhELE1BQWEsaUJBQWtCLFNBQVEsZUFBTTtJQXlFM0M7Ozs7Ozs7OztPQVNHO0lBQ0gsWUFDRSxZQUFvQiw0QkFBZ0IsRUFDcEMsZUFBdUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNDLE9BQTZCLFNBQVMsRUFDdEMsTUFBMkIsU0FBUyxFQUNwQyxPQUFlLFNBQVMsRUFDeEIsa0JBQW1DLFNBQVM7UUFFNUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQTFGdkMsY0FBUyxHQUFHLG1CQUFtQixDQUFBO1FBQy9CLFlBQU8sR0FBRywrQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQTtRQWUvQyxvQkFBZSxHQUFvQixTQUFTLENBQUE7UUEyRXBELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBO0lBQ3hDLENBQUM7SUF6RkQsU0FBUyxDQUFDLFdBQStCLEtBQUs7UUFDNUMsSUFBSSxNQUFNLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM5Qyx1Q0FDSyxNQUFNLEtBQ1QsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUMxRDtJQUNILENBQUM7SUFDRCxXQUFXLENBQUMsTUFBYyxFQUFFLFdBQStCLEtBQUs7UUFDOUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN2RSxDQUFDO0lBSUQ7O09BRUc7SUFDSCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNILGtCQUFrQjtRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILFVBQVUsQ0FBQyxLQUFhLEVBQUUsU0FBaUIsQ0FBQztRQUMxQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDeEMsTUFBTSxJQUFJLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUE7UUFDNUMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN2RCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixJQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsS0FBSyxXQUFXO1lBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxZQUFZLHlCQUFlLENBQUMsRUFDbEQ7WUFDQSxNQUFNLElBQUksNEJBQW1CLENBQzNCLDZFQUE2RSxDQUM5RSxDQUFBO1NBQ0Y7UUFDRCxJQUFJLE1BQU0sR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzRCxJQUFJLElBQUksR0FBYTtZQUNuQixLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2hCLE1BQU07WUFDTixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRTtTQUNoQyxDQUFBO1FBQ0QsT0FBTyxlQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLENBQUM7Q0F1QkY7QUE5RkQsOENBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1QbGF0Zm9ybVZNLUNyZWF0ZUFsbHljaGFpblR4XHJcbiAqL1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuL2Jhc2V0eFwiXHJcbmltcG9ydCB7IFBsYXRmb3JtVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBEZWZhdWx0TmV0d29ya0lEIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZU91dHB1dCwgU0VDUE93bmVyT3V0cHV0IH0gZnJvbSBcIi4vb3V0cHV0c1wiXHJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHsgU2VyaWFsaXplZEVuY29kaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5pbXBvcnQgeyBBbGx5Y2hhaW5Pd25lckVycm9yIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2Vycm9yc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgQ3JlYXRlQWxseWNoYWluVHggZXh0ZW5kcyBCYXNlVHgge1xyXG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIkNyZWF0ZUFsbHljaGFpblR4XCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IFBsYXRmb3JtVk1Db25zdGFudHMuQ1JFQVRFQUxMWUNIQUlOVFhcclxuXHJcbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcclxuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLmZpZWxkcyxcclxuICAgICAgYWxseWNoYWluT3duZXJzOiB0aGlzLmFsbHljaGFpbk93bmVycy5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICB9XHJcbiAgfVxyXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xyXG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcclxuICAgIHRoaXMuYWxseWNoYWluT3duZXJzID0gbmV3IFNFQ1BPd25lck91dHB1dCgpXHJcbiAgICB0aGlzLmFsbHljaGFpbk93bmVycy5kZXNlcmlhbGl6ZShmaWVsZHNbXCJhbGx5Y2hhaW5Pd25lcnNcIl0sIGVuY29kaW5nKVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGFsbHljaGFpbk93bmVyczogU0VDUE93bmVyT3V0cHV0ID0gdW5kZWZpbmVkXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBbW0NyZWF0ZUFsbHljaGFpblR4XV1cclxuICAgKi9cclxuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl90eXBlSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIHJld2FyZCBhZGRyZXNzLlxyXG4gICAqL1xyXG4gIGdldEFsbHljaGFpbk93bmVycygpOiBTRUNQT3duZXJPdXRwdXQge1xyXG4gICAgcmV0dXJuIHRoaXMuYWxseWNoYWluT3duZXJzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYW4gW1tDcmVhdGVBbGx5Y2hhaW5UeF1dLCBwYXJzZXMgaXQsIHBvcHVsYXRlcyB0aGUgY2xhc3MsIGFuZCByZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIFtbQ3JlYXRlQWxseWNoYWluVHhdXSBpbiBieXRlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYSByYXcgW1tDcmVhdGVBbGx5Y2hhaW5UeF1dXHJcbiAgICogQHBhcmFtIG9mZnNldCBBIG51bWJlciBmb3IgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uIGluIHRoZSBieXRlcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW0NyZWF0ZUFsbHljaGFpblR4XV1cclxuICAgKlxyXG4gICAqIEByZW1hcmtzIGFzc3VtZSBub3QtY2hlY2tzdW1tZWRcclxuICAgKi9cclxuICBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyID0gMCk6IG51bWJlciB7XHJcbiAgICBvZmZzZXQgPSBzdXBlci5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXHJcbiAgICBvZmZzZXQgKz0gNFxyXG4gICAgdGhpcy5hbGx5Y2hhaW5Pd25lcnMgPSBuZXcgU0VDUE93bmVyT3V0cHV0KClcclxuICAgIG9mZnNldCA9IHRoaXMuYWxseWNoYWluT3duZXJzLmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcclxuICAgIHJldHVybiBvZmZzZXRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tDcmVhdGVBbGx5Y2hhaW5UeF1dLlxyXG4gICAqL1xyXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGVvZiB0aGlzLmFsbHljaGFpbk93bmVycyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAhKHRoaXMuYWxseWNoYWluT3duZXJzIGluc3RhbmNlb2YgU0VDUE93bmVyT3V0cHV0KVxyXG4gICAgKSB7XHJcbiAgICAgIHRocm93IG5ldyBBbGx5Y2hhaW5Pd25lckVycm9yKFxyXG4gICAgICAgIFwiQ3JlYXRlQWxseWNoYWluVHgudG9CdWZmZXIgLS0gdGhpcy5hbGx5Y2hhaW5Pd25lcnMgaXMgbm90IGEgU0VDUE93bmVyT3V0cHV0XCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgbGV0IHR5cGVJRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICB0eXBlSUQud3JpdGVVSW50MzJCRSh0aGlzLmFsbHljaGFpbk93bmVycy5nZXRPdXRwdXRJRCgpLCAwKVxyXG4gICAgbGV0IGJhcnI6IEJ1ZmZlcltdID0gW1xyXG4gICAgICBzdXBlci50b0J1ZmZlcigpLFxyXG4gICAgICB0eXBlSUQsXHJcbiAgICAgIHRoaXMuYWxseWNoYWluT3duZXJzLnRvQnVmZmVyKClcclxuICAgIF1cclxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KGJhcnIpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgQ3JlYXRlIEFsbHljaGFpbiB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgT3B0aW9uYWwgbmV0d29ya0lELCBbW0RlZmF1bHROZXR3b3JrSURdXVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwgYmxvY2tjaGFpbklELCBkZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXHJcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXHJcbiAgICogQHBhcmFtIGlucyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgbWVtbyBmaWVsZFxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5Pd25lcnMgT3B0aW9uYWwgW1tTRUNQT3duZXJPdXRwdXRdXSBjbGFzcyBmb3Igc3BlY2lmeWluZyB3aG8gb3ducyB0aGUgYWxseWNoYWluLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIsIDE2KSxcclxuICAgIG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdW5kZWZpbmVkLFxyXG4gICAgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYWxseWNoYWluT3duZXJzOiBTRUNQT3duZXJPdXRwdXQgPSB1bmRlZmluZWRcclxuICApIHtcclxuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXHJcbiAgICB0aGlzLmFsbHljaGFpbk93bmVycyA9IGFsbHljaGFpbk93bmVyc1xyXG4gIH1cclxufVxyXG4iXX0=