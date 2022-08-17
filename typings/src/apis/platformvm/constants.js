"use strict";
/**
 * @packageDocumentation
 * @module API-PlatformVM-Constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformVMConstants = void 0;
class PlatformVMConstants {
}
exports.PlatformVMConstants = PlatformVMConstants;
PlatformVMConstants.LATESTCODEC = 0;
PlatformVMConstants.SECPFXID = 0;
PlatformVMConstants.SECPXFEROUTPUTID = 7;
PlatformVMConstants.ALLYCHAINAUTHID = 10;
PlatformVMConstants.SECPOWNEROUTPUTID = 11;
PlatformVMConstants.STAKEABLELOCKOUTID = 22;
PlatformVMConstants.SECPINPUTID = 5;
PlatformVMConstants.STAKEABLELOCKINID = 21;
PlatformVMConstants.LOCKEDSTAKEABLES = [
    PlatformVMConstants.STAKEABLELOCKINID,
    PlatformVMConstants.STAKEABLELOCKOUTID
];
PlatformVMConstants.BASETX = 0;
PlatformVMConstants.ALLYCHAINAUTH = 10;
PlatformVMConstants.ADDVALIDATORTX = 12;
PlatformVMConstants.ADDALLYCHAINVALIDATORTX = 13;
PlatformVMConstants.ADDNOMINATORTX = 14;
PlatformVMConstants.CREATECHAINTX = 15;
PlatformVMConstants.CREATEALLYCHAINTX = 16;
PlatformVMConstants.IMPORTTX = 17;
PlatformVMConstants.EXPORTTX = 18;
PlatformVMConstants.ADVANCETIMETX = 19;
PlatformVMConstants.REWARDVALIDATORTX = 20;
PlatformVMConstants.SECPCREDENTIAL = 9;
PlatformVMConstants.ASSETIDLEN = 32;
PlatformVMConstants.BLOCKCHAINIDLEN = 32;
PlatformVMConstants.SYMBOLMAXLEN = 4;
PlatformVMConstants.ASSETNAMELEN = 128;
PlatformVMConstants.ADDRESSLENGTH = 20;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7O0FBRUgsTUFBYSxtQkFBbUI7O0FBQWhDLGtEQXVEQztBQXREUSwrQkFBVyxHQUFXLENBQUMsQ0FBQTtBQUV2Qiw0QkFBUSxHQUFXLENBQUMsQ0FBQTtBQUVwQixvQ0FBZ0IsR0FBVyxDQUFDLENBQUE7QUFFNUIsbUNBQWUsR0FBVyxFQUFFLENBQUE7QUFFNUIscUNBQWlCLEdBQVcsRUFBRSxDQUFBO0FBRTlCLHNDQUFrQixHQUFXLEVBQUUsQ0FBQTtBQUUvQiwrQkFBVyxHQUFXLENBQUMsQ0FBQTtBQUV2QixxQ0FBaUIsR0FBVyxFQUFFLENBQUE7QUFFOUIsb0NBQWdCLEdBQWE7SUFDbEMsbUJBQW1CLENBQUMsaUJBQWlCO0lBQ3JDLG1CQUFtQixDQUFDLGtCQUFrQjtDQUN2QyxDQUFBO0FBRU0sMEJBQU0sR0FBVyxDQUFDLENBQUE7QUFFbEIsaUNBQWEsR0FBVyxFQUFFLENBQUE7QUFFMUIsa0NBQWMsR0FBVyxFQUFFLENBQUE7QUFFM0IsMkNBQXVCLEdBQVcsRUFBRSxDQUFBO0FBRXBDLGtDQUFjLEdBQVcsRUFBRSxDQUFBO0FBRTNCLGlDQUFhLEdBQVcsRUFBRSxDQUFBO0FBRTFCLHFDQUFpQixHQUFXLEVBQUUsQ0FBQTtBQUU5Qiw0QkFBUSxHQUFXLEVBQUUsQ0FBQTtBQUVyQiw0QkFBUSxHQUFXLEVBQUUsQ0FBQTtBQUVyQixpQ0FBYSxHQUFXLEVBQUUsQ0FBQTtBQUUxQixxQ0FBaUIsR0FBVyxFQUFFLENBQUE7QUFFOUIsa0NBQWMsR0FBVyxDQUFDLENBQUE7QUFFMUIsOEJBQVUsR0FBVyxFQUFFLENBQUE7QUFFdkIsbUNBQWUsR0FBVyxFQUFFLENBQUE7QUFFNUIsZ0NBQVksR0FBVyxDQUFDLENBQUE7QUFFeEIsZ0NBQVksR0FBVyxHQUFHLENBQUE7QUFFMUIsaUNBQWEsR0FBVyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLVBsYXRmb3JtVk0tQ29uc3RhbnRzXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtVk1Db25zdGFudHMge1xyXG4gIHN0YXRpYyBMQVRFU1RDT0RFQzogbnVtYmVyID0gMFxyXG5cclxuICBzdGF0aWMgU0VDUEZYSUQ6IG51bWJlciA9IDBcclxuXHJcbiAgc3RhdGljIFNFQ1BYRkVST1VUUFVUSUQ6IG51bWJlciA9IDdcclxuXHJcbiAgc3RhdGljIEFMTFlDSEFJTkFVVEhJRDogbnVtYmVyID0gMTBcclxuXHJcbiAgc3RhdGljIFNFQ1BPV05FUk9VVFBVVElEOiBudW1iZXIgPSAxMVxyXG5cclxuICBzdGF0aWMgU1RBS0VBQkxFTE9DS09VVElEOiBudW1iZXIgPSAyMlxyXG5cclxuICBzdGF0aWMgU0VDUElOUFVUSUQ6IG51bWJlciA9IDVcclxuXHJcbiAgc3RhdGljIFNUQUtFQUJMRUxPQ0tJTklEOiBudW1iZXIgPSAyMVxyXG5cclxuICBzdGF0aWMgTE9DS0VEU1RBS0VBQkxFUzogbnVtYmVyW10gPSBbXHJcbiAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLlNUQUtFQUJMRUxPQ0tJTklELFxyXG4gICAgUGxhdGZvcm1WTUNvbnN0YW50cy5TVEFLRUFCTEVMT0NLT1VUSURcclxuICBdXHJcblxyXG4gIHN0YXRpYyBCQVNFVFg6IG51bWJlciA9IDBcclxuXHJcbiAgc3RhdGljIEFMTFlDSEFJTkFVVEg6IG51bWJlciA9IDEwXHJcblxyXG4gIHN0YXRpYyBBRERWQUxJREFUT1JUWDogbnVtYmVyID0gMTJcclxuXHJcbiAgc3RhdGljIEFEREFMTFlDSEFJTlZBTElEQVRPUlRYOiBudW1iZXIgPSAxM1xyXG5cclxuICBzdGF0aWMgQURETk9NSU5BVE9SVFg6IG51bWJlciA9IDE0XHJcblxyXG4gIHN0YXRpYyBDUkVBVEVDSEFJTlRYOiBudW1iZXIgPSAxNVxyXG5cclxuICBzdGF0aWMgQ1JFQVRFQUxMWUNIQUlOVFg6IG51bWJlciA9IDE2XHJcblxyXG4gIHN0YXRpYyBJTVBPUlRUWDogbnVtYmVyID0gMTdcclxuXHJcbiAgc3RhdGljIEVYUE9SVFRYOiBudW1iZXIgPSAxOFxyXG5cclxuICBzdGF0aWMgQURWQU5DRVRJTUVUWDogbnVtYmVyID0gMTlcclxuXHJcbiAgc3RhdGljIFJFV0FSRFZBTElEQVRPUlRYOiBudW1iZXIgPSAyMFxyXG5cclxuICBzdGF0aWMgU0VDUENSRURFTlRJQUw6IG51bWJlciA9IDlcclxuXHJcbiAgc3RhdGljIEFTU0VUSURMRU46IG51bWJlciA9IDMyXHJcblxyXG4gIHN0YXRpYyBCTE9DS0NIQUlOSURMRU46IG51bWJlciA9IDMyXHJcblxyXG4gIHN0YXRpYyBTWU1CT0xNQVhMRU46IG51bWJlciA9IDRcclxuXHJcbiAgc3RhdGljIEFTU0VUTkFNRUxFTjogbnVtYmVyID0gMTI4XHJcblxyXG4gIHN0YXRpYyBBRERSRVNTTEVOR1RIOiBudW1iZXIgPSAyMFxyXG59XHJcbiJdfQ==