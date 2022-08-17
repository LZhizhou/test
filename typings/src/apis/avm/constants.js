"use strict";
/**
 * @packageDocumentation
 * @module API-AVM-Constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVMConstants = void 0;
class AVMConstants {
}
exports.AVMConstants = AVMConstants;
AVMConstants.LATESTCODEC = 0;
AVMConstants.SECPFXID = 0;
AVMConstants.NFTFXID = 1;
AVMConstants.SECPMINTOUTPUTID = 6;
AVMConstants.SECPMINTOUTPUTID_CODECONE = 65537;
AVMConstants.SECPXFEROUTPUTID = 7;
AVMConstants.SECPXFEROUTPUTID_CODECONE = 65538;
AVMConstants.NFTXFEROUTPUTID = 11;
AVMConstants.NFTXFEROUTPUTID_CODECONE = 131073;
AVMConstants.NFTMINTOUTPUTID = 10;
AVMConstants.NFTMINTOUTPUTID_CODECONE = 131072;
AVMConstants.SECPINPUTID = 5;
AVMConstants.SECPINPUTID_CODECONE = 65536;
AVMConstants.SECPMINTOPID = 8;
AVMConstants.SECPMINTOPID_CODECONE = 65539;
AVMConstants.NFTMINTOPID = 12;
AVMConstants.NFTMINTOPID_CODECONE = 131074;
AVMConstants.NFTXFEROPID = 13;
AVMConstants.NFTXFEROPID_CODECONE = 131075;
AVMConstants.BASETX = 0;
AVMConstants.BASETX_CODECONE = 0;
AVMConstants.CREATEASSETTX = 1;
AVMConstants.CREATEASSETTX_CODECONE = 1;
AVMConstants.OPERATIONTX = 2;
AVMConstants.OPERATIONTX_CODECONE = 2;
AVMConstants.IMPORTTX = 3;
AVMConstants.IMPORTTX_CODECONE = 3;
AVMConstants.EXPORTTX = 4;
AVMConstants.EXPORTTX_CODECONE = 4;
AVMConstants.SECPCREDENTIAL = 9;
AVMConstants.SECPCREDENTIAL_CODECONE = 65540;
AVMConstants.NFTCREDENTIAL = 14;
AVMConstants.NFTCREDENTIAL_CODECONE = 131076;
AVMConstants.ASSETIDLEN = 32;
AVMConstants.BLOCKCHAINIDLEN = 32;
AVMConstants.SYMBOLMAXLEN = 4;
AVMConstants.ASSETNAMELEN = 128;
AVMConstants.ADDRESSLENGTH = 20;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7QUFFSCxNQUFhLFlBQVk7O0FBQXpCLG9DQTRFQztBQTNFUSx3QkFBVyxHQUFXLENBQUMsQ0FBQTtBQUV2QixxQkFBUSxHQUFXLENBQUMsQ0FBQTtBQUVwQixvQkFBTyxHQUFXLENBQUMsQ0FBQTtBQUVuQiw2QkFBZ0IsR0FBVyxDQUFDLENBQUE7QUFFNUIsc0NBQXlCLEdBQVcsS0FBSyxDQUFBO0FBRXpDLDZCQUFnQixHQUFXLENBQUMsQ0FBQTtBQUU1QixzQ0FBeUIsR0FBVyxLQUFLLENBQUE7QUFFekMsNEJBQWUsR0FBVyxFQUFFLENBQUE7QUFFNUIscUNBQXdCLEdBQVcsTUFBTSxDQUFBO0FBRXpDLDRCQUFlLEdBQVcsRUFBRSxDQUFBO0FBRTVCLHFDQUF3QixHQUFXLE1BQU0sQ0FBQTtBQUV6Qyx3QkFBVyxHQUFXLENBQUMsQ0FBQTtBQUV2QixpQ0FBb0IsR0FBVyxLQUFLLENBQUE7QUFFcEMseUJBQVksR0FBVyxDQUFDLENBQUE7QUFFeEIsa0NBQXFCLEdBQVcsS0FBSyxDQUFBO0FBRXJDLHdCQUFXLEdBQVcsRUFBRSxDQUFBO0FBRXhCLGlDQUFvQixHQUFXLE1BQU0sQ0FBQTtBQUVyQyx3QkFBVyxHQUFXLEVBQUUsQ0FBQTtBQUV4QixpQ0FBb0IsR0FBVyxNQUFNLENBQUE7QUFFckMsbUJBQU0sR0FBVyxDQUFDLENBQUE7QUFFbEIsNEJBQWUsR0FBVyxDQUFDLENBQUE7QUFFM0IsMEJBQWEsR0FBVyxDQUFDLENBQUE7QUFFekIsbUNBQXNCLEdBQVcsQ0FBQyxDQUFBO0FBRWxDLHdCQUFXLEdBQVcsQ0FBQyxDQUFBO0FBRXZCLGlDQUFvQixHQUFXLENBQUMsQ0FBQTtBQUVoQyxxQkFBUSxHQUFXLENBQUMsQ0FBQTtBQUVwQiw4QkFBaUIsR0FBVyxDQUFDLENBQUE7QUFFN0IscUJBQVEsR0FBVyxDQUFDLENBQUE7QUFFcEIsOEJBQWlCLEdBQVcsQ0FBQyxDQUFBO0FBRTdCLDJCQUFjLEdBQVcsQ0FBQyxDQUFBO0FBRTFCLG9DQUF1QixHQUFXLEtBQUssQ0FBQTtBQUV2QywwQkFBYSxHQUFXLEVBQUUsQ0FBQTtBQUUxQixtQ0FBc0IsR0FBVyxNQUFNLENBQUE7QUFFdkMsdUJBQVUsR0FBVyxFQUFFLENBQUE7QUFFdkIsNEJBQWUsR0FBVyxFQUFFLENBQUE7QUFFNUIseUJBQVksR0FBVyxDQUFDLENBQUE7QUFFeEIseUJBQVksR0FBVyxHQUFHLENBQUE7QUFFMUIsMEJBQWEsR0FBVyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICogQG1vZHVsZSBBUEktQVZNLUNvbnN0YW50c1xuICovXG5cbmV4cG9ydCBjbGFzcyBBVk1Db25zdGFudHMge1xuICBzdGF0aWMgTEFURVNUQ09ERUM6IG51bWJlciA9IDBcblxuICBzdGF0aWMgU0VDUEZYSUQ6IG51bWJlciA9IDBcblxuICBzdGF0aWMgTkZURlhJRDogbnVtYmVyID0gMVxuXG4gIHN0YXRpYyBTRUNQTUlOVE9VVFBVVElEOiBudW1iZXIgPSA2XG5cbiAgc3RhdGljIFNFQ1BNSU5UT1VUUFVUSURfQ09ERUNPTkU6IG51bWJlciA9IDY1NTM3XG5cbiAgc3RhdGljIFNFQ1BYRkVST1VUUFVUSUQ6IG51bWJlciA9IDdcblxuICBzdGF0aWMgU0VDUFhGRVJPVVRQVVRJRF9DT0RFQ09ORTogbnVtYmVyID0gNjU1MzhcblxuICBzdGF0aWMgTkZUWEZFUk9VVFBVVElEOiBudW1iZXIgPSAxMVxuXG4gIHN0YXRpYyBORlRYRkVST1VUUFVUSURfQ09ERUNPTkU6IG51bWJlciA9IDEzMTA3M1xuXG4gIHN0YXRpYyBORlRNSU5UT1VUUFVUSUQ6IG51bWJlciA9IDEwXG5cbiAgc3RhdGljIE5GVE1JTlRPVVRQVVRJRF9DT0RFQ09ORTogbnVtYmVyID0gMTMxMDcyXG5cbiAgc3RhdGljIFNFQ1BJTlBVVElEOiBudW1iZXIgPSA1XG5cbiAgc3RhdGljIFNFQ1BJTlBVVElEX0NPREVDT05FOiBudW1iZXIgPSA2NTUzNlxuXG4gIHN0YXRpYyBTRUNQTUlOVE9QSUQ6IG51bWJlciA9IDhcblxuICBzdGF0aWMgU0VDUE1JTlRPUElEX0NPREVDT05FOiBudW1iZXIgPSA2NTUzOVxuXG4gIHN0YXRpYyBORlRNSU5UT1BJRDogbnVtYmVyID0gMTJcblxuICBzdGF0aWMgTkZUTUlOVE9QSURfQ09ERUNPTkU6IG51bWJlciA9IDEzMTA3NFxuXG4gIHN0YXRpYyBORlRYRkVST1BJRDogbnVtYmVyID0gMTNcblxuICBzdGF0aWMgTkZUWEZFUk9QSURfQ09ERUNPTkU6IG51bWJlciA9IDEzMTA3NVxuXG4gIHN0YXRpYyBCQVNFVFg6IG51bWJlciA9IDBcblxuICBzdGF0aWMgQkFTRVRYX0NPREVDT05FOiBudW1iZXIgPSAwXG5cbiAgc3RhdGljIENSRUFURUFTU0VUVFg6IG51bWJlciA9IDFcblxuICBzdGF0aWMgQ1JFQVRFQVNTRVRUWF9DT0RFQ09ORTogbnVtYmVyID0gMVxuXG4gIHN0YXRpYyBPUEVSQVRJT05UWDogbnVtYmVyID0gMlxuXG4gIHN0YXRpYyBPUEVSQVRJT05UWF9DT0RFQ09ORTogbnVtYmVyID0gMlxuXG4gIHN0YXRpYyBJTVBPUlRUWDogbnVtYmVyID0gM1xuXG4gIHN0YXRpYyBJTVBPUlRUWF9DT0RFQ09ORTogbnVtYmVyID0gM1xuXG4gIHN0YXRpYyBFWFBPUlRUWDogbnVtYmVyID0gNFxuXG4gIHN0YXRpYyBFWFBPUlRUWF9DT0RFQ09ORTogbnVtYmVyID0gNFxuXG4gIHN0YXRpYyBTRUNQQ1JFREVOVElBTDogbnVtYmVyID0gOVxuXG4gIHN0YXRpYyBTRUNQQ1JFREVOVElBTF9DT0RFQ09ORTogbnVtYmVyID0gNjU1NDBcblxuICBzdGF0aWMgTkZUQ1JFREVOVElBTDogbnVtYmVyID0gMTRcblxuICBzdGF0aWMgTkZUQ1JFREVOVElBTF9DT0RFQ09ORTogbnVtYmVyID0gMTMxMDc2XG5cbiAgc3RhdGljIEFTU0VUSURMRU46IG51bWJlciA9IDMyXG5cbiAgc3RhdGljIEJMT0NLQ0hBSU5JRExFTjogbnVtYmVyID0gMzJcblxuICBzdGF0aWMgU1lNQk9MTUFYTEVOOiBudW1iZXIgPSA0XG5cbiAgc3RhdGljIEFTU0VUTkFNRUxFTjogbnVtYmVyID0gMTI4XG5cbiAgc3RhdGljIEFERFJFU1NMRU5HVEg6IG51bWJlciA9IDIwXG59XG4iXX0=