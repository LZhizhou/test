"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyChain = exports.KeyPair = void 0;
const bintools_1 = __importDefault(require("../../utils/bintools"));
const secp256k1_1 = require("../../common/secp256k1");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for representing a private and public keypair on an AVM Chain.
 */
class KeyPair extends secp256k1_1.SECP256k1KeyPair {
    clone() {
        const newkp = new KeyPair(this.hrp, this.chainID);
        newkp.importKey(bintools.copyFrom(this.getPrivateKey()));
        return newkp;
    }
    create(...args) {
        if (args.length == 2) {
            return new KeyPair(args[0], args[1]);
        }
        return new KeyPair(this.hrp, this.chainID);
    }
}
exports.KeyPair = KeyPair;
/**
 * Class for representing a key chain in Axia.
 *
 * @typeparam KeyPair Class extending [[SECP256k1KeyChain]] which is used as the key in [[KeyChain]]
 */
class KeyChain extends secp256k1_1.SECP256k1KeyChain {
    /**
     * Returns instance of KeyChain.
     */
    constructor(hrp, chainid) {
        super();
        this.hrp = "";
        this.chainid = "";
        /**
         * Makes a new key pair, returns the address.
         *
         * @returns The new key pair
         */
        this.makeKey = () => {
            let keypair = new KeyPair(this.hrp, this.chainid);
            this.addKey(keypair);
            return keypair;
        };
        this.addKey = (newKey) => {
            newKey.setChainID(this.chainid);
            super.addKey(newKey);
        };
        /**
         * Given a private key, makes a new key pair, returns the address.
         *
         * @param privk A {@link https://github.com/feross/buffer|Buffer} or cb58 serialized string representing the private key
         *
         * @returns The new key pair
         */
        this.importKey = (privk) => {
            let keypair = new KeyPair(this.hrp, this.chainid);
            let pk;
            if (typeof privk === "string") {
                pk = bintools.cb58Decode(privk.split("-")[1]);
            }
            else {
                pk = bintools.copyFrom(privk);
            }
            keypair.importKey(pk);
            if (!(keypair.getAddress().toString("hex") in this.keys)) {
                this.addKey(keypair);
            }
            return keypair;
        };
        this.hrp = hrp;
        this.chainid = chainid;
    }
    create(...args) {
        if (args.length == 2) {
            return new KeyChain(args[0], args[1]);
        }
        return new KeyChain(this.hrp, this.chainid);
    }
    clone() {
        const newkc = new KeyChain(this.hrp, this.chainid);
        for (let k in this.keys) {
            newkc.addKey(this.keys[`${k}`].clone());
        }
        return newkc;
    }
    union(kc) {
        let newkc = kc.clone();
        for (let k in this.keys) {
            newkc.addKey(this.keys[`${k}`].clone());
        }
        return newkc;
    }
}
exports.KeyChain = KeyChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Y2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9hdm0va2V5Y2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBS0Esb0VBQTJDO0FBQzNDLHNEQUE0RTtBQUM1RSx1Q0FBMkQ7QUFFM0Q7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQixxQkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWhFOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsNEJBQWdCO0lBQzNDLEtBQUs7UUFDSCxNQUFNLEtBQUssR0FBWSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN4RCxPQUFPLEtBQWEsQ0FBQTtJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQUcsSUFBVztRQUNuQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBUyxDQUFBO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQVMsQ0FBQTtJQUNwRCxDQUFDO0NBQ0Y7QUFiRCwwQkFhQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFhLFFBQVMsU0FBUSw2QkFBMEI7SUFpRXREOztPQUVHO0lBQ0gsWUFBWSxHQUFXLEVBQUUsT0FBZTtRQUN0QyxLQUFLLEVBQUUsQ0FBQTtRQXBFVCxRQUFHLEdBQVcsRUFBRSxDQUFBO1FBQ2hCLFlB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a2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBBUEktQVZNLUtleUNoYWluXHJcbiAqL1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgeyBTRUNQMjU2azFLZXlDaGFpbiwgU0VDUDI1NmsxS2V5UGFpciB9IGZyb20gXCIuLi8uLi9jb21tb24vc2VjcDI1NmsxXCJcclxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZFR5cGUgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgYSBwcml2YXRlIGFuZCBwdWJsaWMga2V5cGFpciBvbiBhbiBBVk0gQ2hhaW4uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgS2V5UGFpciBleHRlbmRzIFNFQ1AyNTZrMUtleVBhaXIge1xyXG4gIGNsb25lKCk6IHRoaXMge1xyXG4gICAgY29uc3QgbmV3a3A6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxyXG4gICAgbmV3a3AuaW1wb3J0S2V5KGJpbnRvb2xzLmNvcHlGcm9tKHRoaXMuZ2V0UHJpdmF0ZUtleSgpKSlcclxuICAgIHJldHVybiBuZXdrcCBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgIHJldHVybiBuZXcgS2V5UGFpcihhcmdzWzBdLCBhcmdzWzFdKSBhcyB0aGlzXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEtleVBhaXIodGhpcy5ocnAsIHRoaXMuY2hhaW5JRCkgYXMgdGhpc1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgYSBrZXkgY2hhaW4gaW4gQXhpYS5cclxuICpcclxuICogQHR5cGVwYXJhbSBLZXlQYWlyIENsYXNzIGV4dGVuZGluZyBbW1NFQ1AyNTZrMUtleUNoYWluXV0gd2hpY2ggaXMgdXNlZCBhcyB0aGUga2V5IGluIFtbS2V5Q2hhaW5dXVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEtleUNoYWluIGV4dGVuZHMgU0VDUDI1NmsxS2V5Q2hhaW48S2V5UGFpcj4ge1xyXG4gIGhycDogc3RyaW5nID0gXCJcIlxyXG4gIGNoYWluaWQ6IHN0cmluZyA9IFwiXCJcclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZXMgYSBuZXcga2V5IHBhaXIsIHJldHVybnMgdGhlIGFkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgbmV3IGtleSBwYWlyXHJcbiAgICovXHJcbiAgbWFrZUtleSA9ICgpOiBLZXlQYWlyID0+IHtcclxuICAgIGxldCBrZXlwYWlyOiBLZXlQYWlyID0gbmV3IEtleVBhaXIodGhpcy5ocnAsIHRoaXMuY2hhaW5pZClcclxuICAgIHRoaXMuYWRkS2V5KGtleXBhaXIpXHJcbiAgICByZXR1cm4ga2V5cGFpclxyXG4gIH1cclxuXHJcbiAgYWRkS2V5ID0gKG5ld0tleTogS2V5UGFpcikgPT4ge1xyXG4gICAgbmV3S2V5LnNldENoYWluSUQodGhpcy5jaGFpbmlkKVxyXG4gICAgc3VwZXIuYWRkS2V5KG5ld0tleSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdpdmVuIGEgcHJpdmF0ZSBrZXksIG1ha2VzIGEgbmV3IGtleSBwYWlyLCByZXR1cm5zIHRoZSBhZGRyZXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHByaXZrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb3IgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5XHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgbmV3IGtleSBwYWlyXHJcbiAgICovXHJcbiAgaW1wb3J0S2V5ID0gKHByaXZrOiBCdWZmZXIgfCBzdHJpbmcpOiBLZXlQYWlyID0+IHtcclxuICAgIGxldCBrZXlwYWlyOiBLZXlQYWlyID0gbmV3IEtleVBhaXIodGhpcy5ocnAsIHRoaXMuY2hhaW5pZClcclxuICAgIGxldCBwazogQnVmZmVyXHJcbiAgICBpZiAodHlwZW9mIHByaXZrID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHBrID0gYmludG9vbHMuY2I1OERlY29kZShwcml2ay5zcGxpdChcIi1cIilbMV0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwayA9IGJpbnRvb2xzLmNvcHlGcm9tKHByaXZrKVxyXG4gICAgfVxyXG4gICAga2V5cGFpci5pbXBvcnRLZXkocGspXHJcbiAgICBpZiAoIShrZXlwYWlyLmdldEFkZHJlc3MoKS50b1N0cmluZyhcImhleFwiKSBpbiB0aGlzLmtleXMpKSB7XHJcbiAgICAgIHRoaXMuYWRkS2V5KGtleXBhaXIpXHJcbiAgICB9XHJcbiAgICByZXR1cm4ga2V5cGFpclxyXG4gIH1cclxuXHJcbiAgY3JlYXRlKC4uLmFyZ3M6IGFueVtdKTogdGhpcyB7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMikge1xyXG4gICAgICByZXR1cm4gbmV3IEtleUNoYWluKGFyZ3NbMF0sIGFyZ3NbMV0pIGFzIHRoaXNcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgS2V5Q2hhaW4odGhpcy5ocnAsIHRoaXMuY2hhaW5pZCkgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBjb25zdCBuZXdrYzogS2V5Q2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5ocnAsIHRoaXMuY2hhaW5pZClcclxuICAgIGZvciAobGV0IGsgaW4gdGhpcy5rZXlzKSB7XHJcbiAgICAgIG5ld2tjLmFkZEtleSh0aGlzLmtleXNbYCR7a31gXS5jbG9uZSgpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld2tjIGFzIHRoaXNcclxuICB9XHJcblxyXG4gIHVuaW9uKGtjOiB0aGlzKTogdGhpcyB7XHJcbiAgICBsZXQgbmV3a2M6IEtleUNoYWluID0ga2MuY2xvbmUoKVxyXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLmtleXMpIHtcclxuICAgICAgbmV3a2MuYWRkS2V5KHRoaXMua2V5c1tgJHtrfWBdLmNsb25lKCkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3a2MgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBpbnN0YW5jZSBvZiBLZXlDaGFpbi5cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihocnA6IHN0cmluZywgY2hhaW5pZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLmhycCA9IGhycFxyXG4gICAgdGhpcy5jaGFpbmlkID0gY2hhaW5pZFxyXG4gIH1cclxufVxyXG4iXX0=