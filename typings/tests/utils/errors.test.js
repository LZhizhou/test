"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("src/utils");
describe("Errors", () => {
    test("AxiaError", () => {
        try {
            throw new utils_1.AxiaError("Testing AxiaError", "0");
        }
        catch (error) {
            expect(error.getCode()).toBe("0");
        }
        expect(() => {
            throw new utils_1.AxiaError("Testing AxiaError", "0");
        }).toThrow("Testing AxiaError");
        expect(() => {
            throw new utils_1.AxiaError("Testing AxiaError", "0");
        }).toThrowError();
    });
    test("AddressError", () => {
        try {
            throw new utils_1.AddressError("Testing AddressError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1000");
        }
        expect(() => {
            throw new utils_1.AddressError("Testing AddressError");
        }).toThrow("Testing AddressError");
        expect(() => {
            throw new utils_1.AddressError("Testing AddressError");
        }).toThrowError();
    });
    test("GooseEggCheckError", () => {
        try {
            throw new utils_1.GooseEggCheckError("Testing GooseEggCheckError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1001");
        }
        expect(() => {
            throw new utils_1.GooseEggCheckError("Testing GooseEggCheckError");
        }).toThrow("Testing GooseEggCheckError");
        expect(() => {
            throw new utils_1.GooseEggCheckError("Testing GooseEggCheckError");
        }).toThrowError();
    });
    test("ChainIdError", () => {
        try {
            throw new utils_1.ChainIdError("Testing ChainIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1002");
        }
        expect(() => {
            throw new utils_1.ChainIdError("Testing ChainIdError");
        }).toThrow("Testing ChainIdError");
        expect(() => {
            throw new utils_1.ChainIdError("Testing ChainIdError");
        }).toThrowError();
    });
    test("NoAtomicUTXOsError", () => {
        try {
            throw new utils_1.NoAtomicUTXOsError("Testing NoAtomicUTXOsError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1003");
        }
        expect(() => {
            throw new utils_1.NoAtomicUTXOsError("Testing NoAtomicUTXOsError");
        }).toThrow("Testing NoAtomicUTXOsError");
        expect(() => {
            throw new utils_1.NoAtomicUTXOsError("Testing NoAtomicUTXOsError");
        }).toThrowError();
    });
    test("SymbolError", () => {
        try {
            throw new utils_1.SymbolError("Testing SymbolError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1004");
        }
        expect(() => {
            throw new utils_1.SymbolError("Testing SymbolError");
        }).toThrow("Testing SymbolError");
        expect(() => {
            throw new utils_1.SymbolError("Testing SymbolError");
        }).toThrowError();
    });
    test("NameError", () => {
        try {
            throw new utils_1.NameError("Testing NameError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1005");
        }
        expect(() => {
            throw new utils_1.NameError("Testing NameError");
        }).toThrow("Testing NameError");
        expect(() => {
            throw new utils_1.NameError("Testing NameError");
        }).toThrowError();
    });
    test("TransactionError", () => {
        try {
            throw new utils_1.TransactionError("Testing TransactionError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1006");
        }
        expect(() => {
            throw new utils_1.TransactionError("Testing TransactionError");
        }).toThrow("Testing TransactionError");
        expect(() => {
            throw new utils_1.TransactionError("Testing TransactionError");
        }).toThrowError();
    });
    test("CodecIdError", () => {
        try {
            throw new utils_1.CodecIdError("Testing CodecIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1007");
        }
        expect(() => {
            throw new utils_1.CodecIdError("Testing CodecIdError");
        }).toThrow("Testing CodecIdError");
        expect(() => {
            throw new utils_1.CodecIdError("Testing CodecIdError");
        }).toThrowError();
    });
    test("CredIdError", () => {
        try {
            throw new utils_1.CredIdError("Testing CredIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1008");
        }
        expect(() => {
            throw new utils_1.CredIdError("Testing CredIdError");
        }).toThrow("Testing CredIdError");
        expect(() => {
            throw new utils_1.CredIdError("Testing CredIdError");
        }).toThrowError();
    });
    test("TransferableOutputError", () => {
        try {
            throw new utils_1.TransferableOutputError("Testing TransferableOutputError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1009");
        }
        expect(() => {
            throw new utils_1.TransferableOutputError("Testing TransferableOutputError");
        }).toThrow("Testing TransferableOutputError");
        expect(() => {
            throw new utils_1.TransferableOutputError("Testing TransferableOutputError");
        }).toThrowError();
    });
    test("TransferableInputError", () => {
        try {
            throw new utils_1.TransferableInputError("Testing TransferableInputError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1010");
        }
        expect(() => {
            throw new utils_1.TransferableInputError("Testing TransferableInputError");
        }).toThrow("Testing TransferableInputError");
        expect(() => {
            throw new utils_1.TransferableInputError("Testing TransferableInputError");
        }).toThrowError();
    });
    test("InputIdError", () => {
        try {
            throw new utils_1.InputIdError("Testing InputIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1011");
        }
        expect(() => {
            throw new utils_1.InputIdError("Testing InputIdError");
        }).toThrow("Testing InputIdError");
        expect(() => {
            throw new utils_1.InputIdError("Testing InputIdError");
        }).toThrowError();
    });
    test("OperationError", () => {
        try {
            throw new utils_1.OperationError("Testing OperationError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1012");
        }
        expect(() => {
            throw new utils_1.OperationError("Testing OperationError");
        }).toThrow("Testing OperationError");
        expect(() => {
            throw new utils_1.OperationError("Testing OperationError");
        }).toThrowError();
    });
    test("InvalidOperationIdError", () => {
        try {
            throw new utils_1.InvalidOperationIdError("Testing InvalidOperationIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1013");
        }
        expect(() => {
            throw new utils_1.InvalidOperationIdError("Testing InvalidOperationIdError");
        }).toThrow("Testing InvalidOperationIdError");
        expect(() => {
            throw new utils_1.InvalidOperationIdError("Testing InvalidOperationIdError");
        }).toThrowError();
    });
    test("ChecksumError", () => {
        try {
            throw new utils_1.ChecksumError("Testing ChecksumError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1014");
        }
        expect(() => {
            throw new utils_1.ChecksumError("Testing ChecksumError");
        }).toThrow("Testing ChecksumError");
        expect(() => {
            throw new utils_1.ChecksumError("Testing ChecksumError");
        }).toThrowError();
    });
    test("OutputIdError", () => {
        try {
            throw new utils_1.OutputIdError("Testing OutputIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1015");
        }
        expect(() => {
            throw new utils_1.OutputIdError("Testing OutputIdError");
        }).toThrow("Testing OutputIdError");
        expect(() => {
            throw new utils_1.OutputIdError("Testing OutputIdError");
        }).toThrowError();
    });
    test("UTXOError", () => {
        try {
            throw new utils_1.UTXOError("Testing UTXOError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1016");
        }
        expect(() => {
            throw new utils_1.UTXOError("Testing UTXOError");
        }).toThrow("Testing UTXOError");
        expect(() => {
            throw new utils_1.UTXOError("Testing UTXOError");
        }).toThrowError();
    });
    test("InsufficientFundsError", () => {
        try {
            throw new utils_1.InsufficientFundsError("Testing InsufficientFundsError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1017");
        }
        expect(() => {
            throw new utils_1.InsufficientFundsError("Testing InsufficientFundsError");
        }).toThrow("Testing InsufficientFundsError");
        expect(() => {
            throw new utils_1.InsufficientFundsError("Testing InsufficientFundsError");
        }).toThrowError();
    });
    test("ThresholdError", () => {
        try {
            throw new utils_1.ThresholdError("Testing ThresholdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1018");
        }
        expect(() => {
            throw new utils_1.ThresholdError("Testing ThresholdError");
        }).toThrow("Testing ThresholdError");
        expect(() => {
            throw new utils_1.ThresholdError("Testing ThresholdError");
        }).toThrowError();
    });
    test("SECPMintOutputError", () => {
        try {
            throw new utils_1.SECPMintOutputError("Testing SECPMintOutputError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1019");
        }
        expect(() => {
            throw new utils_1.SECPMintOutputError("Testing SECPMintOutputError");
        }).toThrow("Testing SECPMintOutputError");
        expect(() => {
            throw new utils_1.SECPMintOutputError("Testing SECPMintOutputError");
        }).toThrowError();
    });
    test("EVMInputError", () => {
        try {
            throw new utils_1.EVMInputError("Testing EVMInputError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1020");
        }
        expect(() => {
            throw new utils_1.EVMInputError("Testing EVMInputError");
        }).toThrow("Testing EVMInputError");
        expect(() => {
            throw new utils_1.EVMInputError("Testing EVMInputError");
        }).toThrowError();
    });
    test("EVMOutputError", () => {
        try {
            throw new utils_1.EVMOutputError("Testing EVMOutputError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1021");
        }
        expect(() => {
            throw new utils_1.EVMOutputError("Testing EVMOutputError");
        }).toThrow("Testing EVMOutputError");
        expect(() => {
            throw new utils_1.EVMOutputError("Testing EVMOutputError");
        }).toThrowError();
    });
    test("FeeAssetError", () => {
        try {
            throw new utils_1.FeeAssetError("Testing FeeAssetError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1022");
        }
        expect(() => {
            throw new utils_1.FeeAssetError("Testing FeeAssetError");
        }).toThrow("Testing FeeAssetError");
        expect(() => {
            throw new utils_1.FeeAssetError("Testing FeeAssetError");
        }).toThrowError();
    });
    test("StakeError", () => {
        try {
            throw new utils_1.StakeError("Testing StakeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1023");
        }
        expect(() => {
            throw new utils_1.StakeError("Testing StakeError");
        }).toThrow("Testing StakeError");
        expect(() => {
            throw new utils_1.StakeError("Testing StakeError");
        }).toThrowError();
    });
    test("TimeError", () => {
        try {
            throw new utils_1.TimeError("Testing TimeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1024");
        }
        expect(() => {
            throw new utils_1.TimeError("Testing TimeError");
        }).toThrow("Testing TimeError");
        expect(() => {
            throw new utils_1.TimeError("Testing TimeError");
        }).toThrowError();
    });
    test("NominationFeeError", () => {
        try {
            throw new utils_1.NominationFeeError("Testing NominationFeeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1025");
        }
        expect(() => {
            throw new utils_1.NominationFeeError("Testing NominationFeeError");
        }).toThrow("Testing NominationFeeError");
        expect(() => {
            throw new utils_1.NominationFeeError("Testing NominationFeeError");
        }).toThrowError();
    });
    test("AllychainOwnerError", () => {
        try {
            throw new utils_1.AllychainOwnerError("Testing AllychainOwnerError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1026");
        }
        expect(() => {
            throw new utils_1.AllychainOwnerError("Testing AllychainOwnerError");
        }).toThrow("Testing AllychainOwnerError");
        expect(() => {
            throw new utils_1.AllychainOwnerError("Testing AllychainOwnerError");
        }).toThrowError();
    });
    test("BufferSizeError", () => {
        try {
            throw new utils_1.BufferSizeError("Testing BufferSizeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1027");
        }
        expect(() => {
            throw new utils_1.BufferSizeError("Testing BufferSizeError");
        }).toThrow("Testing BufferSizeError");
        expect(() => {
            throw new utils_1.BufferSizeError("Testing BufferSizeError");
        }).toThrowError();
    });
    test("AddressIndexError", () => {
        try {
            throw new utils_1.AddressIndexError("Testing AddressIndexError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1028");
        }
        expect(() => {
            throw new utils_1.AddressIndexError("Testing AddressIndexError");
        }).toThrow("Testing AddressIndexError");
        expect(() => {
            throw new utils_1.AddressIndexError("Testing AddressIndexError");
        }).toThrowError();
    });
    test("PublicKeyError", () => {
        try {
            throw new utils_1.PublicKeyError("Testing PublicKeyError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1029");
        }
        expect(() => {
            throw new utils_1.PublicKeyError("Testing PublicKeyError");
        }).toThrow("Testing PublicKeyError");
        expect(() => {
            throw new utils_1.PublicKeyError("Testing PublicKeyError");
        }).toThrowError();
    });
    test("MergeRuleError", () => {
        try {
            throw new utils_1.MergeRuleError("Testing MergeRuleError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1030");
        }
        expect(() => {
            throw new utils_1.MergeRuleError("Testing MergeRuleError");
        }).toThrow("Testing MergeRuleError");
        expect(() => {
            throw new utils_1.MergeRuleError("Testing MergeRuleError");
        }).toThrowError();
    });
    test("Base58Error", () => {
        try {
            throw new utils_1.Base58Error("Testing Base58Error");
        }
        catch (error) {
            expect(error.getCode()).toBe("1031");
        }
        expect(() => {
            throw new utils_1.Base58Error("Testing Base58Error");
        }).toThrow("Testing Base58Error");
        expect(() => {
            throw new utils_1.Base58Error("Testing Base58Error");
        }).toThrowError();
    });
    test("PrivateKeyError", () => {
        try {
            throw new utils_1.PrivateKeyError("Testing PrivateKeyError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1032");
        }
        expect(() => {
            throw new utils_1.PrivateKeyError("Testing PrivateKeyError");
        }).toThrow("Testing PrivateKeyError");
        expect(() => {
            throw new utils_1.PrivateKeyError("Testing PrivateKeyError");
        }).toThrowError();
    });
    test("NodeIdError", () => {
        try {
            throw new utils_1.NodeIdError("Testing NodeIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1033");
        }
        expect(() => {
            throw new utils_1.NodeIdError("Testing NodeIdError");
        }).toThrow("Testing NodeIdError");
        expect(() => {
            throw new utils_1.NodeIdError("Testing NodeIdError");
        }).toThrowError();
    });
    test("HexError", () => {
        try {
            throw new utils_1.HexError("Testing HexError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1034");
        }
        expect(() => {
            throw new utils_1.HexError("Testing HexError");
        }).toThrow("Testing HexError");
        expect(() => {
            throw new utils_1.HexError("Testing HexError");
        }).toThrowError();
    });
    test("TypeIdError", () => {
        try {
            throw new utils_1.TypeIdError("Testing TypeIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1035");
        }
        expect(() => {
            throw new utils_1.TypeIdError("Testing TypeIdError");
        }).toThrow("Testing TypeIdError");
        expect(() => {
            throw new utils_1.TypeIdError("Testing TypeIdError");
        }).toThrowError();
    });
    test("TypeNameError", () => {
        try {
            throw new utils_1.TypeNameError("Testing TypeNameError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1042");
        }
        expect(() => {
            throw new utils_1.TypeNameError("Testing TypeNameError");
        }).toThrow("Testing TypeNameError");
        expect(() => {
            throw new utils_1.TypeNameError("Testing TypeNameError");
        }).toThrowError();
    });
    test("UnknownTypeError", () => {
        try {
            throw new utils_1.UnknownTypeError("Testing UnknownTypeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1036");
        }
        expect(() => {
            throw new utils_1.UnknownTypeError("Testing UnknownTypeError");
        }).toThrow("Testing UnknownTypeError");
        expect(() => {
            throw new utils_1.UnknownTypeError("Testing UnknownTypeError");
        }).toThrowError();
    });
    test("Bech32Error", () => {
        try {
            throw new utils_1.Bech32Error("Testing Bech32Error");
        }
        catch (error) {
            expect(error.getCode()).toBe("1037");
        }
        expect(() => {
            throw new utils_1.Bech32Error("Testing Bech32Error");
        }).toThrow("Testing Bech32Error");
        expect(() => {
            throw new utils_1.Bech32Error("Testing Bech32Error");
        }).toThrowError();
    });
    test("EVMFeeError", () => {
        try {
            throw new utils_1.EVMFeeError("Testing EVMFeeError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1038");
        }
        expect(() => {
            throw new utils_1.EVMFeeError("Testing EVMFeeError");
        }).toThrow("Testing EVMFeeError");
        expect(() => {
            throw new utils_1.EVMFeeError("Testing EVMFeeError");
        }).toThrowError();
    });
    test("InvalidEntropy", () => {
        try {
            throw new utils_1.InvalidEntropy("Testing InvalidEntropy");
        }
        catch (error) {
            expect(error.getCode()).toBe("1039");
        }
        expect(() => {
            throw new utils_1.InvalidEntropy("Testing InvalidEntropy");
        }).toThrow("Testing InvalidEntropy");
        expect(() => {
            throw new utils_1.InvalidEntropy("Testing InvalidEntropy");
        }).toThrowError();
    });
    test("ProtocolError", () => {
        try {
            throw new utils_1.ProtocolError("Testing ProtocolError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1040");
        }
        expect(() => {
            throw new utils_1.ProtocolError("Testing ProtocolError");
        }).toThrow("Testing ProtocolError");
        expect(() => {
            throw new utils_1.ProtocolError("Testing ProtocolError");
        }).toThrowError();
    });
    test("AllychainIdError", () => {
        try {
            throw new utils_1.AllychainIdError("Testing AllychainIdError");
        }
        catch (error) {
            expect(error.getCode()).toBe("1041");
        }
        expect(() => {
            throw new utils_1.AllychainIdError("Testing AllychainIdError");
        }).toThrow("Testing AllychainIdError");
        expect(() => {
            throw new utils_1.AllychainIdError("Testing AllychainIdError");
        }).toThrowError();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0cy91dGlscy9lcnJvcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQTZDa0I7QUFFbEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFTLEVBQUU7SUFDNUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFTLEVBQUU7UUFDM0IsSUFBSTtZQUNGLE1BQU0sSUFBSSxpQkFBUyxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQzlDO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNsQztRQUNELE1BQU0sQ0FBQyxHQUFTLEVBQUU7WUFDaEIsTUFBTSxJQUFJLGlCQUFTLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDL0MsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDL0IsTUFBTSxDQUFDLEdBQVMsRUFBRTtZQUNoQixNQUFNLElBQUksaUJBQVMsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMvQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBUyxFQUFFO1FBQzlCLElBQUk7WUFDRixNQUFNLElBQUksb0JBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNyQztRQUNELE1BQU0sQ0FBQyxHQUFTLEVBQUU7WUFDaEIsTUFBTSxJQUFJLG9CQUFZLENBQUMsc0JBQXNCLENBQUMs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Q0FBQTtRQUNuQyxNQUFNLENBQUMsR0FBUyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxxQkFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7SUFDbkIsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBUyxFQUFFO1FBQ2xDLElBQUk7WUFDRixNQUFNLElBQUksd0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtTQUN2RDtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDckM7UUFDRCxNQUFNLENBQUMsR0FBUyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSx3QkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7WUFDaEIsTUFBTSxJQUFJLHdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7SUFDbkIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IHtcclxuICBBeGlhRXJyb3IsXHJcbiAgQWRkcmVzc0Vycm9yLFxyXG4gIEdvb3NlRWdnQ2hlY2tFcnJvcixcclxuICBDaGFpbklkRXJyb3IsXHJcbiAgTm9BdG9taWNVVFhPc0Vycm9yLFxyXG4gIFN5bWJvbEVycm9yLFxyXG4gIE5hbWVFcnJvcixcclxuICBUcmFuc2FjdGlvbkVycm9yLFxyXG4gIENvZGVjSWRFcnJvcixcclxuICBDcmVkSWRFcnJvcixcclxuICBUcmFuc2ZlcmFibGVPdXRwdXRFcnJvcixcclxuICBUcmFuc2ZlcmFibGVJbnB1dEVycm9yLFxyXG4gIElucHV0SWRFcnJvcixcclxuICBPcGVyYXRpb25FcnJvcixcclxuICBJbnZhbGlkT3BlcmF0aW9uSWRFcnJvcixcclxuICBDaGVja3N1bUVycm9yLFxyXG4gIE91dHB1dElkRXJyb3IsXHJcbiAgVVRYT0Vycm9yLFxyXG4gIEluc3VmZmljaWVudEZ1bmRzRXJyb3IsXHJcbiAgVGhyZXNob2xkRXJyb3IsXHJcbiAgU0VDUE1pbnRPdXRwdXRFcnJvcixcclxuICBFVk1JbnB1dEVycm9yLFxyXG4gIEVWTU91dHB1dEVycm9yLFxyXG4gIEZlZUFzc2V0RXJyb3IsXHJcbiAgU3Rha2VFcnJvcixcclxuICBUaW1lRXJyb3IsXHJcbiAgTm9taW5hdGlvbkZlZUVycm9yLFxyXG4gIEFsbHljaGFpbk93bmVyRXJyb3IsXHJcbiAgQnVmZmVyU2l6ZUVycm9yLFxyXG4gIEFkZHJlc3NJbmRleEVycm9yLFxyXG4gIFB1YmxpY0tleUVycm9yLFxyXG4gIE1lcmdlUnVsZUVycm9yLFxyXG4gIEJhc2U1OEVycm9yLFxyXG4gIFByaXZhdGVLZXlFcnJvcixcclxuICBOb2RlSWRFcnJvcixcclxuICBIZXhFcnJvcixcclxuICBUeXBlSWRFcnJvcixcclxuICBUeXBlTmFtZUVycm9yLFxyXG4gIFVua25vd25UeXBlRXJyb3IsXHJcbiAgQmVjaDMyRXJyb3IsXHJcbiAgRVZNRmVlRXJyb3IsXHJcbiAgSW52YWxpZEVudHJvcHksXHJcbiAgUHJvdG9jb2xFcnJvcixcclxuICBBbGx5Y2hhaW5JZEVycm9yXHJcbn0gZnJvbSBcInNyYy91dGlsc1wiXHJcblxyXG5kZXNjcmliZShcIkVycm9yc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgdGVzdChcIkF4aWFFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgQXhpYUVycm9yKFwiVGVzdGluZyBBeGlhRXJyb3JcIiwgXCIwXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIwXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQXhpYUVycm9yKFwiVGVzdGluZyBBeGlhRXJyb3JcIiwgXCIwXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBBeGlhRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBBeGlhRXJyb3IoXCJUZXN0aW5nIEF4aWFFcnJvclwiLCBcIjBcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkFkZHJlc3NFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiVGVzdGluZyBBZGRyZXNzRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDBcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXCJUZXN0aW5nIEFkZHJlc3NFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQWRkcmVzc0Vycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiVGVzdGluZyBBZGRyZXNzRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkdvb3NlRWdnQ2hlY2tFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgR29vc2VFZ2dDaGVja0Vycm9yKFwiVGVzdGluZyBHb29zZUVnZ0NoZWNrRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDFcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXCJUZXN0aW5nIEdvb3NlRWdnQ2hlY2tFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgR29vc2VFZ2dDaGVja0Vycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgR29vc2VFZ2dDaGVja0Vycm9yKFwiVGVzdGluZyBHb29zZUVnZ0NoZWNrRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkNoYWluSWRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFwiVGVzdGluZyBDaGFpbklkRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDJcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXCJUZXN0aW5nIENoYWluSWRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQ2hhaW5JZEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFwiVGVzdGluZyBDaGFpbklkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIk5vQXRvbWljVVRYT3NFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgTm9BdG9taWNVVFhPc0Vycm9yKFwiVGVzdGluZyBOb0F0b21pY1VUWE9zRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDNcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBOb0F0b21pY1VUWE9zRXJyb3IoXCJUZXN0aW5nIE5vQXRvbWljVVRYT3NFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgTm9BdG9taWNVVFhPc0Vycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgTm9BdG9taWNVVFhPc0Vycm9yKFwiVGVzdGluZyBOb0F0b21pY1VUWE9zRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIlN5bWJvbEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBTeW1ib2xFcnJvcihcIlRlc3RpbmcgU3ltYm9sRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDRcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBTeW1ib2xFcnJvcihcIlRlc3RpbmcgU3ltYm9sRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFN5bWJvbEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgU3ltYm9sRXJyb3IoXCJUZXN0aW5nIFN5bWJvbEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJOYW1lRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IE5hbWVFcnJvcihcIlRlc3RpbmcgTmFtZUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDA1XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgTmFtZUVycm9yKFwiVGVzdGluZyBOYW1lRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIE5hbWVFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE5hbWVFcnJvcihcIlRlc3RpbmcgTmFtZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJUcmFuc2FjdGlvbkVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBUcmFuc2FjdGlvbkVycm9yKFwiVGVzdGluZyBUcmFuc2FjdGlvbkVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDA2XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVHJhbnNhY3Rpb25FcnJvcihcIlRlc3RpbmcgVHJhbnNhY3Rpb25FcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgVHJhbnNhY3Rpb25FcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFRyYW5zYWN0aW9uRXJyb3IoXCJUZXN0aW5nIFRyYW5zYWN0aW9uRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkNvZGVjSWRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgQ29kZWNJZEVycm9yKFwiVGVzdGluZyBDb2RlY0lkRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDdcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBDb2RlY0lkRXJyb3IoXCJUZXN0aW5nIENvZGVjSWRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQ29kZWNJZEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQ29kZWNJZEVycm9yKFwiVGVzdGluZyBDb2RlY0lkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkNyZWRJZEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBDcmVkSWRFcnJvcihcIlRlc3RpbmcgQ3JlZElkRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMDhcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBDcmVkSWRFcnJvcihcIlRlc3RpbmcgQ3JlZElkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIENyZWRJZEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQ3JlZElkRXJyb3IoXCJUZXN0aW5nIENyZWRJZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJUcmFuc2ZlcmFibGVPdXRwdXRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0RXJyb3IoXCJUZXN0aW5nIFRyYW5zZmVyYWJsZU91dHB1dEVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDA5XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0RXJyb3IoXCJUZXN0aW5nIFRyYW5zZmVyYWJsZU91dHB1dEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBUcmFuc2ZlcmFibGVPdXRwdXRFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFRyYW5zZmVyYWJsZU91dHB1dEVycm9yKFwiVGVzdGluZyBUcmFuc2ZlcmFibGVPdXRwdXRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiVHJhbnNmZXJhYmxlSW5wdXRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgVHJhbnNmZXJhYmxlSW5wdXRFcnJvcihcIlRlc3RpbmcgVHJhbnNmZXJhYmxlSW5wdXRFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAxMFwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFRyYW5zZmVyYWJsZUlucHV0RXJyb3IoXCJUZXN0aW5nIFRyYW5zZmVyYWJsZUlucHV0RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFRyYW5zZmVyYWJsZUlucHV0RXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBUcmFuc2ZlcmFibGVJbnB1dEVycm9yKFwiVGVzdGluZyBUcmFuc2ZlcmFibGVJbnB1dEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJJbnB1dElkRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IElucHV0SWRFcnJvcihcIlRlc3RpbmcgSW5wdXRJZEVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDExXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgSW5wdXRJZEVycm9yKFwiVGVzdGluZyBJbnB1dElkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIElucHV0SWRFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IElucHV0SWRFcnJvcihcIlRlc3RpbmcgSW5wdXRJZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJPcGVyYXRpb25FcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgT3BlcmF0aW9uRXJyb3IoXCJUZXN0aW5nIE9wZXJhdGlvbkVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDEyXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgT3BlcmF0aW9uRXJyb3IoXCJUZXN0aW5nIE9wZXJhdGlvbkVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBPcGVyYXRpb25FcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE9wZXJhdGlvbkVycm9yKFwiVGVzdGluZyBPcGVyYXRpb25FcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiSW52YWxpZE9wZXJhdGlvbklkRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25JZEVycm9yKFwiVGVzdGluZyBJbnZhbGlkT3BlcmF0aW9uSWRFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAxM1wiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25JZEVycm9yKFwiVGVzdGluZyBJbnZhbGlkT3BlcmF0aW9uSWRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgSW52YWxpZE9wZXJhdGlvbklkRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uSWRFcnJvcihcIlRlc3RpbmcgSW52YWxpZE9wZXJhdGlvbklkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkNoZWNrc3VtRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IENoZWNrc3VtRXJyb3IoXCJUZXN0aW5nIENoZWNrc3VtRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMTRcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBDaGVja3N1bUVycm9yKFwiVGVzdGluZyBDaGVja3N1bUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBDaGVja3N1bUVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hlY2tzdW1FcnJvcihcIlRlc3RpbmcgQ2hlY2tzdW1FcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiT3V0cHV0SWRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgT3V0cHV0SWRFcnJvcihcIlRlc3RpbmcgT3V0cHV0SWRFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAxNVwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE91dHB1dElkRXJyb3IoXCJUZXN0aW5nIE91dHB1dElkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIE91dHB1dElkRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBPdXRwdXRJZEVycm9yKFwiVGVzdGluZyBPdXRwdXRJZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJVVFhPRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IFVUWE9FcnJvcihcIlRlc3RpbmcgVVRYT0Vycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDE2XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVVRYT0Vycm9yKFwiVGVzdGluZyBVVFhPRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFVUWE9FcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFVUWE9FcnJvcihcIlRlc3RpbmcgVVRYT0Vycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJJbnN1ZmZpY2llbnRGdW5kc0Vycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBJbnN1ZmZpY2llbnRGdW5kc0Vycm9yKFwiVGVzdGluZyBJbnN1ZmZpY2llbnRGdW5kc0Vycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDE3XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgSW5zdWZmaWNpZW50RnVuZHNFcnJvcihcIlRlc3RpbmcgSW5zdWZmaWNpZW50RnVuZHNFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgSW5zdWZmaWNpZW50RnVuZHNFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEluc3VmZmljaWVudEZ1bmRzRXJyb3IoXCJUZXN0aW5nIEluc3VmZmljaWVudEZ1bmRzRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIlRocmVzaG9sZEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBUaHJlc2hvbGRFcnJvcihcIlRlc3RpbmcgVGhyZXNob2xkRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMThcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBUaHJlc2hvbGRFcnJvcihcIlRlc3RpbmcgVGhyZXNob2xkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFRocmVzaG9sZEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVGhyZXNob2xkRXJyb3IoXCJUZXN0aW5nIFRocmVzaG9sZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJTRUNQTWludE91dHB1dEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBTRUNQTWludE91dHB1dEVycm9yKFwiVGVzdGluZyBTRUNQTWludE91dHB1dEVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDE5XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgU0VDUE1pbnRPdXRwdXRFcnJvcihcIlRlc3RpbmcgU0VDUE1pbnRPdXRwdXRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgU0VDUE1pbnRPdXRwdXRFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFNFQ1BNaW50T3V0cHV0RXJyb3IoXCJUZXN0aW5nIFNFQ1BNaW50T3V0cHV0RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkVWTUlucHV0RXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEVWTUlucHV0RXJyb3IoXCJUZXN0aW5nIEVWTUlucHV0RXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMjBcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBFVk1JbnB1dEVycm9yKFwiVGVzdGluZyBFVk1JbnB1dEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBFVk1JbnB1dEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgRVZNSW5wdXRFcnJvcihcIlRlc3RpbmcgRVZNSW5wdXRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiRVZNT3V0cHV0RXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEVWTU91dHB1dEVycm9yKFwiVGVzdGluZyBFVk1PdXRwdXRFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAyMVwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEVWTU91dHB1dEVycm9yKFwiVGVzdGluZyBFVk1PdXRwdXRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgRVZNT3V0cHV0RXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBFVk1PdXRwdXRFcnJvcihcIlRlc3RpbmcgRVZNT3V0cHV0RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkZlZUFzc2V0RXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEZlZUFzc2V0RXJyb3IoXCJUZXN0aW5nIEZlZUFzc2V0RXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMjJcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBGZWVBc3NldEVycm9yKFwiVGVzdGluZyBGZWVBc3NldEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBGZWVBc3NldEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgRmVlQXNzZXRFcnJvcihcIlRlc3RpbmcgRmVlQXNzZXRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiU3Rha2VFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgU3Rha2VFcnJvcihcIlRlc3RpbmcgU3Rha2VFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAyM1wiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFN0YWtlRXJyb3IoXCJUZXN0aW5nIFN0YWtlRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFN0YWtlRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBTdGFrZUVycm9yKFwiVGVzdGluZyBTdGFrZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJUaW1lRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IFRpbWVFcnJvcihcIlRlc3RpbmcgVGltZUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDI0XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVGltZUVycm9yKFwiVGVzdGluZyBUaW1lRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFRpbWVFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFRpbWVFcnJvcihcIlRlc3RpbmcgVGltZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJOb21pbmF0aW9uRmVlRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IE5vbWluYXRpb25GZWVFcnJvcihcIlRlc3RpbmcgTm9taW5hdGlvbkZlZUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDI1XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgTm9taW5hdGlvbkZlZUVycm9yKFwiVGVzdGluZyBOb21pbmF0aW9uRmVlRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIE5vbWluYXRpb25GZWVFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE5vbWluYXRpb25GZWVFcnJvcihcIlRlc3RpbmcgTm9taW5hdGlvbkZlZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJBbGx5Y2hhaW5Pd25lckVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBBbGx5Y2hhaW5Pd25lckVycm9yKFwiVGVzdGluZyBBbGx5Y2hhaW5Pd25lckVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDI2XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQWxseWNoYWluT3duZXJFcnJvcihcIlRlc3RpbmcgQWxseWNoYWluT3duZXJFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQWxseWNoYWluT3duZXJFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEFsbHljaGFpbk93bmVyRXJyb3IoXCJUZXN0aW5nIEFsbHljaGFpbk93bmVyRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkJ1ZmZlclNpemVFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgQnVmZmVyU2l6ZUVycm9yKFwiVGVzdGluZyBCdWZmZXJTaXplRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMjdcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBCdWZmZXJTaXplRXJyb3IoXCJUZXN0aW5nIEJ1ZmZlclNpemVFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQnVmZmVyU2l6ZUVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQnVmZmVyU2l6ZUVycm9yKFwiVGVzdGluZyBCdWZmZXJTaXplRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkFkZHJlc3NJbmRleEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzSW5kZXhFcnJvcihcIlRlc3RpbmcgQWRkcmVzc0luZGV4RXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMjhcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzSW5kZXhFcnJvcihcIlRlc3RpbmcgQWRkcmVzc0luZGV4RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIEFkZHJlc3NJbmRleEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0luZGV4RXJyb3IoXCJUZXN0aW5nIEFkZHJlc3NJbmRleEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJQdWJsaWNLZXlFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgUHVibGljS2V5RXJyb3IoXCJUZXN0aW5nIFB1YmxpY0tleUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDI5XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgUHVibGljS2V5RXJyb3IoXCJUZXN0aW5nIFB1YmxpY0tleUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBQdWJsaWNLZXlFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFB1YmxpY0tleUVycm9yKFwiVGVzdGluZyBQdWJsaWNLZXlFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiTWVyZ2VSdWxlRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IE1lcmdlUnVsZUVycm9yKFwiVGVzdGluZyBNZXJnZVJ1bGVFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAzMFwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE1lcmdlUnVsZUVycm9yKFwiVGVzdGluZyBNZXJnZVJ1bGVFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgTWVyZ2VSdWxlRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBNZXJnZVJ1bGVFcnJvcihcIlRlc3RpbmcgTWVyZ2VSdWxlRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkJhc2U1OEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBCYXNlNThFcnJvcihcIlRlc3RpbmcgQmFzZTU4RXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMzFcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBCYXNlNThFcnJvcihcIlRlc3RpbmcgQmFzZTU4RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIEJhc2U1OEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQmFzZTU4RXJyb3IoXCJUZXN0aW5nIEJhc2U1OEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJQcml2YXRlS2V5RXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IFByaXZhdGVLZXlFcnJvcihcIlRlc3RpbmcgUHJpdmF0ZUtleUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDMyXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgUHJpdmF0ZUtleUVycm9yKFwiVGVzdGluZyBQcml2YXRlS2V5RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFByaXZhdGVLZXlFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFByaXZhdGVLZXlFcnJvcihcIlRlc3RpbmcgUHJpdmF0ZUtleUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJOb2RlSWRFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgTm9kZUlkRXJyb3IoXCJUZXN0aW5nIE5vZGVJZEVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDMzXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgTm9kZUlkRXJyb3IoXCJUZXN0aW5nIE5vZGVJZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBOb2RlSWRFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IE5vZGVJZEVycm9yKFwiVGVzdGluZyBOb2RlSWRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiSGV4RXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEhleEVycm9yKFwiVGVzdGluZyBIZXhFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAzNFwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEhleEVycm9yKFwiVGVzdGluZyBIZXhFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgSGV4RXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBIZXhFcnJvcihcIlRlc3RpbmcgSGV4RXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIlR5cGVJZEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlSWRFcnJvcihcIlRlc3RpbmcgVHlwZUlkRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMzVcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlSWRFcnJvcihcIlRlc3RpbmcgVHlwZUlkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFR5cGVJZEVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUlkRXJyb3IoXCJUZXN0aW5nIFR5cGVJZEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJUeXBlTmFtZUVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlTmFtZUVycm9yKFwiVGVzdGluZyBUeXBlTmFtZUVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDQyXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZU5hbWVFcnJvcihcIlRlc3RpbmcgVHlwZU5hbWVFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgVHlwZU5hbWVFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVOYW1lRXJyb3IoXCJUZXN0aW5nIFR5cGVOYW1lRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIlVua25vd25UeXBlRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IFVua25vd25UeXBlRXJyb3IoXCJUZXN0aW5nIFVua25vd25UeXBlRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMzZcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBVbmtub3duVHlwZUVycm9yKFwiVGVzdGluZyBVbmtub3duVHlwZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBVbmtub3duVHlwZUVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgVW5rbm93blR5cGVFcnJvcihcIlRlc3RpbmcgVW5rbm93blR5cGVFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiQmVjaDMyRXJyb3JcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiVGVzdGluZyBCZWNoMzJFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTAzN1wiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiVGVzdGluZyBCZWNoMzJFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQmVjaDMyRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIlRlc3RpbmcgQmVjaDMyRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkVWTUZlZUVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBFVk1GZWVFcnJvcihcIlRlc3RpbmcgRVZNRmVlRXJyb3JcIilcclxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgZXhwZWN0KGVycm9yLmdldENvZGUoKSkudG9CZShcIjEwMzhcIilcclxuICAgIH1cclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBFVk1GZWVFcnJvcihcIlRlc3RpbmcgRVZNRmVlRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIEVWTUZlZUVycm9yXCIpXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgRVZNRmVlRXJyb3IoXCJUZXN0aW5nIEVWTUZlZUVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJJbnZhbGlkRW50cm9weVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEVudHJvcHkoXCJUZXN0aW5nIEludmFsaWRFbnRyb3B5XCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDM5XCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEVudHJvcHkoXCJUZXN0aW5nIEludmFsaWRFbnRyb3B5XCIpXHJcbiAgICB9KS50b1Rocm93KFwiVGVzdGluZyBJbnZhbGlkRW50cm9weVwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEludmFsaWRFbnRyb3B5KFwiVGVzdGluZyBJbnZhbGlkRW50cm9weVwiKVxyXG4gICAgfSkudG9UaHJvd0Vycm9yKClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiUHJvdG9jb2xFcnJvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aHJvdyBuZXcgUHJvdG9jb2xFcnJvcihcIlRlc3RpbmcgUHJvdG9jb2xFcnJvclwiKVxyXG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICBleHBlY3QoZXJyb3IuZ2V0Q29kZSgpKS50b0JlKFwiMTA0MFwiKVxyXG4gICAgfVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IFByb3RvY29sRXJyb3IoXCJUZXN0aW5nIFByb3RvY29sRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3coXCJUZXN0aW5nIFByb3RvY29sRXJyb3JcIilcclxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBQcm90b2NvbEVycm9yKFwiVGVzdGluZyBQcm90b2NvbEVycm9yXCIpXHJcbiAgICB9KS50b1Rocm93RXJyb3IoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJBbGx5Y2hhaW5JZEVycm9yXCIsICgpOiB2b2lkID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRocm93IG5ldyBBbGx5Y2hhaW5JZEVycm9yKFwiVGVzdGluZyBBbGx5Y2hhaW5JZEVycm9yXCIpXHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIGV4cGVjdChlcnJvci5nZXRDb2RlKCkpLnRvQmUoXCIxMDQxXCIpXHJcbiAgICB9XHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aHJvdyBuZXcgQWxseWNoYWluSWRFcnJvcihcIlRlc3RpbmcgQWxseWNoYWluSWRFcnJvclwiKVxyXG4gICAgfSkudG9UaHJvdyhcIlRlc3RpbmcgQWxseWNoYWluSWRFcnJvclwiKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEFsbHljaGFpbklkRXJyb3IoXCJUZXN0aW5nIEFsbHljaGFpbklkRXJyb3JcIilcclxuICAgIH0pLnRvVGhyb3dFcnJvcigpXHJcbiAgfSlcclxufSlcclxuIl19