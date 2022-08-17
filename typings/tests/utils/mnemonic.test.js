"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mnemonic_1 = __importDefault(require("src/utils/mnemonic"));
const randomBytes = require("randombytes");
const mnemonic = mnemonic_1.default.getInstance();
const entropy = "9d7c99e77261acb88a5ed717f625d5d3ed5569e0f60429cc6eb9c4e91f48fb7c";
const langs = [
    "japanese",
    "spanish",
    "italian",
    "french",
    "korean",
    "czech",
    "portuguese",
    "chinese_traditional",
    "chinese_simplified"
];
const mnemnonics = [
    "ていし　みっか　せんせい　みっか　えいぶん　さつたば　かいよう　へんたい　うやまう　にちじょう　せっかく　とける　ぶどう　にんぷ　たいうん　はいそう　かえる　したて　なめらか　だじゃれ　だんれつ　てんぼうだい　もくようび　そむく",
    "nueve tenis lágrima tenis baile folleto canica sonoro autor perla jardín oxígeno sensor piscina lonja rabo cañón germen pegar marrón molino opuesto trébol llaga",
    "pergamena tensione maratona tensione becco geco cena srotolato badilata regola lumaca prelievo somma rifasare motivato sarcasmo ceramica ibernato randagio ninfa orafo polmonite tuffato modulo",
    "mobile surface héron surface batterie éthanol capsule serein bafouer pangolin gravir nuisible salive peintre intense préfixe carabine fatal orque label lucide neurone toucher informer",
    "운반 특별 시인 특별 귀신 빗물 농민 취업 구입 작년 스님 이윽고 체험 장애인 아흔 제작 농장 상추 입사 언덕 염려 의외로 학급 씨름",
    "pohnutka vize nikam vize datum ledvina export uklidnit cirkus revolver naslepo procento traverza rozjezd odliv slavnost fajfka lyra rande omluva panovat poukaz vyrvat ochladit",
    "mesada surdina guincho surdina aumentar escrita brilho sediado assador ostentar goela nevoeiro rouco panqueca inovador postal brochura faceta ontem judoca linhagem munido torque indeciso",
    "烯 逮 岩 逮 資 衛 走 賦 料 默 膠 辛 杯 挑 戶 陶 議 劉 拍 謀 浮 休 煩 慮",
    "烯 逮 岩 逮 资 卫 走 赋 料 默 胶 辛 杯 挑 户 陶 议 刘 拍 谋 浮 休 烦 虑"
];
const seeds = [
    "2ed50c99aa2ee350f0a46c8427d69f9f5c7c5864be7a64ae96695374a0a5a02a3c5075312234f05f8f4c840aa486c99131f84b81c56daff5c31a89cdc7b50424",
    "04c6cfd9337642f47e21e28632f9744fd1b56c57454ebae5c627c2a4b16e47c0948b9c582041bbb1590e128a25ae79d7055ed8aecdbc030920a67205da24846d",
    "c4274544eb6c375d2caa70af8c6a67e3b751c518cbb35244891c7b74a12a5e06d5ce5b925f134930e17f5e86b21146d096715c7645a250dbba1d2ba35bc07317",
    "00e5b5e4785763d6f92fe1ad7c5a7e7dd0fd375bd441473198d2486990ca5a924b5cb6b6831dc94d446c9b3180eefe2d799887bcfc1ee6d8f4f0650e594c9d1b",
    "d8dcc049712867ba7d1bc0e2874d8ec38ee26088d1e2affa10ffac30cf1d0b915bbb6c79bfafbb1db0e8cd66880bf4ba52c53b949f6a3adbba1821dd3045c7cb",
    "a81d8a917861cb8a1ffd2e94452e08fd6dc4d2577bad3ac089f56279521b1c95caebe57ac6c3d126d8abd4d6a3f2c3d8c207bd36fbf75a5e797c5a8f1992c651",
    "b9fc39d7f138a95b8f31436e02a8711b3164cd45a211673f7137429b45faf77a1604682b51803a983638c46a8b2c13237c87ab4b685a1fa5c65700dc7136ccfc",
    "1a5f3eab01276bf7d9b06c42be90fb4b8106b278b4bbaf922f3da6821a63b4d69fa9285fec0936e0f04a1b2a25a65064cd51c111c75063dbe59e4de336b35f85",
    "53bcb9fe403a4a45bee2a2a04dabfa3f2018db349d0e5200175bd345aaa3a3bd45a88a6fb7244914ad156961742f7b4ea7f8ffd83fcae5b1166b73b2ad943f76"
];
const vectors = [
    {
        entropy: "00000000000000000000000000000000",
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        seed: "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04"
    },
    {
        entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thank yellow",
        seed: "2e8905819b8723fe2c1d161860e5ee1830318dbf49a83bd451cfb8440c28bd6fa457fe1296106559a3c80937a1c1069be3a3a5bd381ee6260e8d9739fce1f607"
    },
    {
        entropy: "80808080808080808080808080808080",
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letter advice cage above",
        seed: "d71de856f81a8acc65e6fc851a38d4d7ec216fd0796d0a6827a3ad6ed5511a30fa280f12eb2e47ed2ac03b5c462a0358d18d69fe4f985ec81778c1b370b652a8"
    },
    {
        entropy: "ffffffffffffffffffffffffffffffff",
        mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong",
        seed: "ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069"
    },
    {
        entropy: "000000000000000000000000000000000000000000000000",
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon agent",
        seed: "035895f2f481b1b0f01fcf8c289c794660b289981a78f8106447707fdd9666ca06da5a9a565181599b79f53b844d8a71dd9f439c52a3d7b3e8a79c906ac845fa"
    },
    {
        entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal will",
        seed: "f2b94508732bcbacbcc020faefecfc89feafa6649a5491b8c952cede496c214a0c7b3c392d168748f2d4a612bada0753b52a1c7ac53c1e93abd5c6320b9e95dd"
    },
    {
        entropy: "808080808080808080808080808080808080808080808080",
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always",
        seed: "107d7c02a5aa6f38c58083ff74f04c607c2d2c0ecc55501dadd72d025b751bc27fe913ffb796f841c49b1d33b610cf0e91d3aa239027f5e99fe4ce9e5088cd65"
    },
    {
        entropy: "ffffffffffffffffffffffffffffffffffffffffffffffff",
        mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo when",
        seed: "0cd6e5d827bb62eb8fc1e262254223817fd068a74b5b449cc2f667c3f1f985a76379b43348d952e2265b4cd129090758b3e3c2c49103b5051aac2eaeb890a528"
    },
    {
        entropy: "0000000000000000000000000000000000000000000000000000000000000000",
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art",
        seed: "bda85446c68413707090a52022edd26a1c9462295029f2e60cd7c4f2bbd3097170af7a4d73245cafa9c3cca8d561a7c3de6f5d4a10be8ed2a5e608d68f92fcc8"
    },
    {
        entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth title",
        seed: "bc09fca1804f7e69da93c2f2028eb238c227f2e9dda30cd63699232578480a4021b146ad717fbb7e451ce9eb835f43620bf5c514db0f8add49f5d121449d3e87"
    },
    {
        entropy: "8080808080808080808080808080808080808080808080808080808080808080",
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless",
        seed: "c0c519bd0e91a2ed54357d9d1ebef6f5af218a153624cf4f2da911a0ed8f7a09e2ef61af0aca007096df430022f7a2b6fb91661a9589097069720d015e4e982f"
    },
    {
        entropy: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote",
        seed: "dd48c104698c30cfe2b6142103248622fb7bb0ff692eebb00089b32d22484e1613912f0a5b694407be899ffd31ed3992c456cdf60f5d4564b8ba3f05a69890ad"
    },
    {
        entropy: "77c2b00716cec7213839159e404db50d",
        mnemonic: "jelly better achieve collect unaware mountain thought cargo oxygen act hood bridge",
        seed: "b5b6d0127db1a9d2226af0c3346031d77af31e918dba64287a1b44b8ebf63cdd52676f672a290aae502472cf2d602c051f3e6f18055e84e4c43897fc4e51a6ff"
    },
    {
        entropy: "b63a9c59a6e641f288ebc103017f1da9f8290b3da6bdef7b",
        mnemonic: "renew stay biology evidence goat welcome casual join adapt armor shuffle fault little machine walk stumble urge swap",
        seed: "9248d83e06f4cd98debf5b6f010542760df925ce46cf38a1bdb4e4de7d21f5c39366941c69e1bdbf2966e0f6e6dbece898a0e2f0a4c2b3e640953dfe8b7bbdc5"
    },
    {
        entropy: "3e141609b97933b66a060dcddc71fad1d91677db872031e85f4c015c5e7e8982",
        mnemonic: "dignity pass list indicate nasty swamp pool script soccer toe leaf photo multiply desk host tomato cradle drill spread actor shine dismiss champion exotic",
        seed: "ff7f3184df8696d8bef94b6c03114dbee0ef89ff938712301d27ed8336ca89ef9635da20af07d4175f2bf5f3de130f39c9d9e8dd0472489c19b1a020a940da67"
    },
    {
        entropy: "0460ef47585604c5660618db2e6a7e7f",
        mnemonic: "afford alter spike radar gate glance object seek swamp infant panel yellow",
        seed: "65f93a9f36b6c85cbe634ffc1f99f2b82cbb10b31edc7f087b4f6cb9e976e9faf76ff41f8f27c99afdf38f7a303ba1136ee48a4c1e7fcd3dba7aa876113a36e4"
    },
    {
        entropy: "72f60ebac5dd8add8d2a25a797102c3ce21bc029c200076f",
        mnemonic: "indicate race push merry suffer human cruise dwarf pole review arch keep canvas theme poem divorce alter left",
        seed: "3bbf9daa0dfad8229786ace5ddb4e00fa98a044ae4c4975ffd5e094dba9e0bb289349dbe2091761f30f382d4e35c4a670ee8ab50758d2c55881be69e327117ba"
    },
    {
        entropy: "2c85efc7f24ee4573d2b81a6ec66cee209b2dcbd09d8eddc51e0215b0b68e416",
        mnemonic: "clutch control vehicle tonight unusual clog visa ice plunge glimpse recipe series open hour vintage deposit universe tip job dress radar refuse motion taste",
        seed: "fe908f96f46668b2d5b37d82f558c77ed0d69dd0e7e043a5b0511c48c2f1064694a956f86360c93dd04052a8899497ce9e985ebe0c8c52b955e6ae86d4ff4449"
    },
    {
        entropy: "eaebabb2383351fd31d703840b32e9e2",
        mnemonic: "turtle front uncle idea crush write shrug there lottery flower risk shell",
        seed: "bdfb76a0759f301b0b899a1e3985227e53b3f51e67e3f2a65363caedf3e32fde42a66c404f18d7b05818c95ef3ca1e5146646856c461c073169467511680876c"
    },
    {
        entropy: "7ac45cfe7722ee6c7ba84fbc2d5bd61b45cb2fe5eb65aa78",
        mnemonic: "kiss carry display unusual confirm curtain upgrade antique rotate hello void custom frequent obey nut hole price segment",
        seed: "ed56ff6c833c07982eb7119a8f48fd363c4a9b1601cd2de736b01045c5eb8ab4f57b079403485d1c4924f0790dc10a971763337cb9f9c62226f64fff26397c79"
    },
    {
        entropy: "4fa1a8bc3e6d80ee1316050e862c1812031493212b7ec3f3bb1b08f168cabeef",
        mnemonic: "exile ask congress lamp submit jacket era scheme attend cousin alcohol catch course end lucky hurt sentence oven short ball bird grab wing top",
        seed: "095ee6f817b4c2cb30a5a797360a81a40ab0f9a4e25ecd672a3f58a0b5ba0687c096a6b14d2c0deb3bdefce4f61d01ae07417d502429352e27695163f7447a8c"
    },
    {
        entropy: "18ab19a9f54a9274f03e5209a2ac8a91",
        mnemonic: "board flee heavy tunnel powder denial science ski answer betray cargo cat",
        seed: "6eff1bb21562918509c73cb990260db07c0ce34ff0e3cc4a8cb3276129fbcb300bddfe005831350efd633909f476c45c88253276d9fd0df6ef48609e8bb7dca8"
    },
    {
        entropy: "18a2e1d81b8ecfb2a333adcb0c17a5b9eb76cc5d05db91a4",
        mnemonic: "board blade invite damage undo sun mimic interest slam gaze truly inherit resist great inject rocket museum chief",
        seed: "f84521c777a13b61564234bf8f8b62b3afce27fc4062b51bb5e62bdfecb23864ee6ecf07c1d5a97c0834307c5c852d8ceb88e7c97923c0a3b496bedd4e5f88a9"
    },
    {
        entropy: "15da872c95a13dd738fbf50e427583ad61f18fd99f628c417a61cf8343c90419",
        mnemonic: "beyond stage sleep clip because twist token leaf atom beauty genius food business side grid unable middle armed observe pair crouch tonight away coconut",
        seed: "b15509eaa2d09d3efd3e006ef42151b30367dc6e3aa5e44caba3fe4d3e352e65101fbdb86a96776b91946ff06f8eac594dc6ee1d3e82a42dfe1b40fef6bcc3fd"
    }
];
const badMnemonics = [
    {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
    },
    {
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thank yellow yellow"
    },
    {
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letter advice caged above"
    },
    { mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo, wrong" },
    {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
    },
    {
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal will will will"
    },
    {
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always."
    },
    {
        mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo why"
    },
    {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art art"
    },
    {
        mnemonic: "legal winner thank year wave sausage worth useful legal winner thanks year wave worth useful legal winner thank year wave sausage worth title"
    },
    {
        mnemonic: "letter advice cage absurd amount doctor acoustic avoid letters advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless"
    },
    {
        mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo voted"
    },
    {
        mnemonic: "jello better achieve collect unaware mountain thought cargo oxygen act hood bridge"
    },
    {
        mnemonic: "renew, stay, biology, evidence, goat, welcome, casual, join, adapt, armor, shuffle, fault, little, machine, walk, stumble, urge, swap"
    },
    { mnemonic: "dignity pass list indicate nasty" },
    // From issue 32
    {
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon letter"
    }
];
const malformedMnemonics = [
    "a a a a a a a a a a a a a a a a a a a a a a a a a",
    "a",
    "a a a a a a a a a a a a a a" // Not multiple of 3
];
describe("Mnemonic", () => {
    test("vectors", () => {
        vectors.forEach((vector, index) => __awaiter(void 0, void 0, void 0, function* () {
            const wordlist = mnemonic.getWordlists("english");
            const entropyToMnemonic = mnemonic.entropyToMnemonic(vector.entropy, wordlist);
            expect(vector.mnemonic).toBe(entropyToMnemonic);
            const mnemonicToEntropy = mnemonic.mnemonicToEntropy(vector.mnemonic, wordlist);
            expect(mnemonicToEntropy).toBe(vector.entropy);
            const password = "TREZOR";
            const mnemonicToSeed = yield mnemonic.mnemonicToSeed(vector.mnemonic, password);
            expect(mnemonicToSeed.toString("hex")).toBe(vector.seed);
        }));
    });
    test("badMnemonics", () => {
        const wordlist = mnemonic.getWordlists("english");
        badMnemonics.forEach((badMnemonic, index) => {
            const validateMnemonic = mnemonic.validateMnemonic(badMnemonic.mnemonic, wordlist);
            expect(validateMnemonic).toBeFalsy();
        });
    });
    test("malformedMnemonics", () => {
        const wordlist = mnemonic.getWordlists("english");
        malformedMnemonics.forEach((malformedMnemonic, index) => {
            const validateMnemonic = mnemonic.validateMnemonic(malformedMnemonic, wordlist);
            expect(validateMnemonic).toBeFalsy();
        });
    });
    test("entropyToMnemonic", () => {
        langs.forEach((lang, index) => {
            const wordlist = mnemonic.getWordlists(lang);
            const entropyToMnemonic = mnemonic.entropyToMnemonic(entropy, wordlist);
            expect(mnemnonics[index]).toBe(entropyToMnemonic);
        });
    });
    test("generateMnemonic", () => {
        const strength = 256;
        langs.forEach((lang) => {
            const wordlist = mnemonic.getWordlists(lang);
            const m = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
            expect(typeof m === "string").toBeTruthy();
        });
    });
    test("test mnemonic lengths", () => {
        const wordlist = mnemonic.getWordlists("english");
        let strength = 128;
        let mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
        expect(mnemnnic.split(" ").length).toBe(12);
        strength = 160;
        mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
        expect(mnemnnic.split(" ").length).toBe(15);
        strength = 192;
        mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
        expect(mnemnnic.split(" ").length).toBe(18);
        strength = 224;
        mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
        expect(mnemnnic.split(" ").length).toBe(21);
        strength = 256;
        mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist);
        expect(mnemnnic.split(" ").length).toBe(24);
    });
    test("getWordlists", () => {
        langs.forEach((lang) => {
            const wordlist = mnemonic.getWordlists(lang);
            expect(typeof wordlist === "object").toBeTruthy();
        });
    });
    test("mnemonicToEntropy", () => {
        mnemnonics.forEach((mnemnnic, index) => {
            const wordlist = mnemonic.getWordlists(langs[index]);
            const mnemonicToEntropy = mnemonic.mnemonicToEntropy(mnemnnic, wordlist);
            expect(mnemonicToEntropy).toBe(entropy);
        });
    });
    test("mnemonicToSeed", () => __awaiter(void 0, void 0, void 0, function* () {
        mnemnonics.forEach((mnemnnic) => __awaiter(void 0, void 0, void 0, function* () {
            const password = "password";
            const mnemonicToSeed = yield mnemonic.mnemonicToSeed(mnemnnic, password);
            expect(typeof mnemonicToSeed === "object").toBeTruthy();
        }));
    }));
    test("mnemonicToSeedSync", () => {
        mnemnonics.forEach((mnemnnic, index) => {
            const password = "password";
            const mnemonicToSeedSync = mnemonic.mnemonicToSeedSync(mnemnnic, password);
            expect(mnemonicToSeedSync.toString("hex")).toBe(seeds[index]);
        });
    });
    test("validateMnemonic", () => {
        mnemnonics.forEach((mnemnnic, index) => {
            const wordlist = mnemonic.getWordlists(langs[index]);
            const validateMnemonic = mnemonic.validateMnemonic(mnemnnic, wordlist);
            expect(validateMnemonic).toBeTruthy();
        });
    });
    test("setDefaultWordlist", () => {
        langs.forEach((lang, index) => {
            mnemonic.setDefaultWordlist(lang);
            const getDefaultWordlist = mnemonic.getDefaultWordlist();
            const wordlist = mnemonic.getWordlists(lang);
            const m = mnemonic.generateMnemonic(256, randomBytes, wordlist);
            expect(getDefaultWordlist).toBe(lang);
            expect(typeof wordlist === "object").toBeTruthy();
            expect(typeof m === "string").toBeTruthy();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW5lbW9uaWMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL3V0aWxzL21uZW1vbmljLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrRUFBeUM7QUFHekMsTUFBTSxXQUFXLEdBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQy9DLE1BQU0sUUFBUSxHQUFHLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDdkMsTUFBTSxPQUFPLEdBQ1gsa0VBQWtFLENBQUE7QUFDcEUsTUFBTSxLQUFLLEdBQWE7SUFDdEIsVUFBVTtJQUNWLFNBQVM7SUFDVCxTQUFTO0lBQ1QsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsWUFBWTtJQUNaLHFCQUFxQjtJQUNyQixvQkFBb0I7Q0FDckIsQ0FBQTtBQUVELE1BQU0sVUFBVSxHQUFhO0lBQzNCLGdJQUFnSTtJQUNoSSx5S0FBeUs7SUFDekssaU1BQWlNO0lBQ2pNLDRMQUE0TDtJQUM1TCxnS0FBZ0s7SUFDaEssaUxBQWlMO0lBQ2pMLDRMQUE0TDtJQUM1TCxpREFBaUQ7SUFDakQsaURBQWlEO0NBQ2xELENBQUE7QUFFRCxNQUFNLEtBQUssR0FBYTtJQUN0QixrSUFBa0k7SUFDbEksa0lBQWtJO0lBQ2xJLGtJQUFrSTtJQUNsSSxrSUFBa0k7SUFDbEksa0lBQWtJO0lBQ2xJLGtJQUFrSTtJQUNsSSxrSUFBa0k7SUFDbEksa0lBQWtJO0lBQ2xJLGtJQUFrSTtDQUNuSSxDQUFBO0FBUUQsTUFBTSxPQUFPLEdBQWE7SUFDeEI7UUFDRSxPQUFPLEVBQUUsa0NBQWtDO1FBQzNDLFFBQVEsRUFDTiwrRkFBK0Y7UUFDakcsSUFBSSxFQUFFLGtJQUFrSTtLQUN6STtJQUNEO1FBQ0UsT0FBTyxFQUFFLGtDQUFrQztRQUMzQyxRQUFRLEVBQ04sNkVBQTZFO1FBQy9FLElBQUksRUFBRSxrSUFBa0k7S0FDekk7SUFDRDtRQUNFLE9BQU8s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LFlBQVksQ0FBQyxTQUFTLENBQWEsQ0FBQTtRQUM3RCxJQUFJLFFBQVEsR0FBVyxHQUFHLENBQUE7UUFDMUIsSUFBSSxRQUFRLEdBQVcsUUFBUSxDQUFDLGdCQUFnQixDQUM5QyxRQUFRLEVBQ1IsV0FBVyxFQUNYLFFBQVEsQ0FDVCxDQUFBO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLFFBQVEsR0FBRyxHQUFHLENBQUE7UUFDZCxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLFFBQVEsR0FBRyxHQUFHLENBQUE7UUFDZCxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLFFBQVEsR0FBRyxHQUFHLENBQUE7UUFDZCxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLFFBQVEsR0FBRyxHQUFHLENBQUE7UUFDZCxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDckUsTUFB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QUMsa0JBQWtCLEVBQUUsQ0FBQTtZQUNoRSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBYSxDQUFBO1lBQ3hELE1BQU0sQ0FBQyxHQUFXLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1lBQ3ZFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNyQyxNQUFNLENBQUMsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQzVDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNbmVtb25pYyBmcm9tIFwic3JjL3V0aWxzL21uZW1vbmljXCJcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5cclxuY29uc3QgcmFuZG9tQnl0ZXM6IGFueSA9IHJlcXVpcmUoXCJyYW5kb21ieXRlc1wiKVxyXG5jb25zdCBtbmVtb25pYyA9IE1uZW1vbmljLmdldEluc3RhbmNlKClcclxuY29uc3QgZW50cm9weTogc3RyaW5nID1cclxuICBcIjlkN2M5OWU3NzI2MWFjYjg4YTVlZDcxN2Y2MjVkNWQzZWQ1NTY5ZTBmNjA0MjljYzZlYjljNGU5MWY0OGZiN2NcIlxyXG5jb25zdCBsYW5nczogc3RyaW5nW10gPSBbXHJcbiAgXCJqYXBhbmVzZVwiLFxyXG4gIFwic3BhbmlzaFwiLFxyXG4gIFwiaXRhbGlhblwiLFxyXG4gIFwiZnJlbmNoXCIsXHJcbiAgXCJrb3JlYW5cIixcclxuICBcImN6ZWNoXCIsXHJcbiAgXCJwb3J0dWd1ZXNlXCIsXHJcbiAgXCJjaGluZXNlX3RyYWRpdGlvbmFsXCIsXHJcbiAgXCJjaGluZXNlX3NpbXBsaWZpZWRcIlxyXG5dXHJcblxyXG5jb25zdCBtbmVtbm9uaWNzOiBzdHJpbmdbXSA9IFtcclxuICBcIuOBpuOBhOOBl+OAgOOBv+OBo+OBi+OAgOOBm+OCk+OBm+OBhOOAgOOBv+OBo+OBi+OAgOOBiOOBhOOBteOCmeOCk+OAgOOBleOBpOOBn+OBr+OCmeOAgOOBi+OBhOOCiOOBhuOAgOOBuOOCk+OBn+OBhOOAgOOBhuOChOOBvuOBhuOAgOOBq+OBoeOBl+OCmeOCh+OBhuOAgOOBm+OBo+OBi+OBj+OAgOOBqOOBkeOCi+OAgOOBteOCmeOBqOOCmeOBhuOAgOOBq+OCk+OBteOCmuOAgOOBn+OBhOOBhuOCk+OAgOOBr+OBhOOBneOBhuOAgOOBi+OBiOOCi+OAgOOBl+OBn+OBpuOAgOOBquOCgeOCieOBi+OAgOOBn+OCmeOBl+OCmeOCg+OCjOOAgOOBn+OCmeOCk+OCjOOBpOOAgOOBpuOCk+OBu+OCmeOBhuOBn+OCmeOBhOOAgOOCguOBj+OCiOOBhuOBsuOCmeOAgOOBneOCgOOBj1wiLFxyXG4gIFwibnVldmUgdGVuaXMgbGHMgWdyaW1hIHRlbmlzIGJhaWxlIGZvbGxldG8gY2FuaWNhIHNvbm9ybyBhdXRvciBwZXJsYSBqYXJkacyBbiBveGnMgWdlbm8gc2Vuc29yIHBpc2NpbmEgbG9uamEgcmFibyBjYW7Mg2/MgW4gZ2VybWVuIHBlZ2FyIG1hcnJvzIFuIG1vbGlubyBvcHVlc3RvIHRyZcyBYm9sIGxsYWdhXCIsXHJcbiAgXCJwZXJnYW1lbmEgdGVuc2lvbmUgbWFyYXRvbmEgdGVuc2lvbmUgYmVjY28gZ2VjbyBjZW5hIHNyb3RvbGF0byBiYWRpbGF0YSByZWdvbGEgbHVtYWNhIHByZWxpZXZvIHNvbW1hIHJpZmFzYXJlIG1vdGl2YXRvIHNhcmNhc21vIGNlcmFtaWNhIGliZXJuYXRvIHJhbmRhZ2lvIG5pbmZhIG9yYWZvIHBvbG1vbml0ZSB0dWZmYXRvIG1vZHVsb1wiLFxyXG4gIFwibW9iaWxlIHN1cmZhY2UgaGXMgXJvbiBzdXJmYWNlIGJhdHRlcmllIGXMgXRoYW5vbCBjYXBzdWxlIHNlcmVpbiBiYWZvdWVyIHBhbmdvbGluIGdyYXZpciBudWlzaWJsZSBzYWxpdmUgcGVpbnRyZSBpbnRlbnNlIHByZcyBZml4ZSBjYXJhYmluZSBmYXRhbCBvcnF1ZSBsYWJlbCBsdWNpZGUgbmV1cm9uZSB0b3VjaGVyIGluZm9ybWVyXCIsXHJcbiAgXCLhhIvhha7hhqvhhIfhhaHhhqsg4YSQ4YWz4Yao4YSH4YWn4YavIOGEieGFteGEi+GFteGGqyDhhJDhhbPhhqjhhIfhhafhhq8g4YSA4YWx4YSJ4YW14YarIOGEh+GFteGGuuGEhuGFruGGryDhhILhhanhhrzhhIbhhbXhhqsg4YSO4YWx4YSL4YWl4Ya4IOGEgOGFruGEi+GFteGGuCDhhIzhhaHhhqjhhILhhafhhqsg4YSJ4YWz4YSC4YW14Ya3IOGEi+GFteGEi+GFs+GGqOGEgOGFqSDhhI7hhabhhJLhhaXhhrcg4YSM4YWh4Ya84YSL4YWi4YSL4YW14YarIOGEi+GFoeGEkuGFs+GGqyDhhIzhhabhhIzhhaHhhqgg4YSC4YWp4Ya84YSM4YWh4Ya8IOGEieGFoeGGvOGEjuGFriDhhIvhhbXhhrjhhInhhaEg4YSL4YWl4Yar4YSD4YWl4YaoIOGEi+GFp+GGt+GEheGFpyDhhIvhhbThhIvhhazhhIXhhakg4YSS4YWh4Yao4YSA4YWz4Ya4IOGEiuGFteGEheGFs+GGt1wiLFxyXG4gIFwicG9obnV0a2Egdml6ZSBuaWthbSB2aXplIGRhdHVtIGxlZHZpbmEgZXhwb3J0IHVrbGlkbml0IGNpcmt1cyByZXZvbHZlciBuYXNsZXBvIHByb2NlbnRvIHRyYXZlcnphIHJvemplemQgb2RsaXYgc2xhdm5vc3QgZmFqZmthIGx5cmEgcmFuZGUgb21sdXZhIHBhbm92YXQgcG91a2F6IHZ5cnZhdCBvY2hsYWRpdFwiLFxyXG4gIFwibWVzYWRhIHN1cmRpbmEgZ3VpbmNobyBzdXJkaW5hIGF1bWVudGFyIGVzY3JpdGEgYnJpbGhvIHNlZGlhZG8gYXNzYWRvciBvc3RlbnRhciBnb2VsYSBuZXZvZWlybyByb3VjbyBwYW5xdWVjYSBpbm92YWRvciBwb3N0YWwgYnJvY2h1cmEgZmFjZXRhIG9udGVtIGp1ZG9jYSBsaW5oYWdlbSBtdW5pZG8gdG9ycXVlIGluZGVjaXNvXCIsXHJcbiAgXCLng68g6YCuIOWyqSDpgK4g6LOHIOihmyDotbAg6LOmIOaWmSDpu5gg6IagIOi+myDmna8g5oyRIOaItiDpmbYg6K2wIOWKiSDmi40g6KyAIOa1riDkvJEg54WpIOaFrlwiLFxyXG4gIFwi54OvIOmAriDlsqkg6YCuIOi1hCDljasg6LWwIOi1iyDmlpkg6buYIOiDtiDovpsg5p2vIOaMkSDmiLcg6Zm2IOiuriDliJgg5ouNIOiwiyDmta4g5LyRIOeDpiDomZFcIlxyXG5dXHJcblxyXG5jb25zdCBzZWVkczogc3RyaW5nW10gPSBbXHJcbiAgXCIyZWQ1MGM5OWFhMmVlMzUwZjBhNDZjODQyN2Q2OWY5ZjVjN2M1ODY0YmU3YTY0YWU5NjY5NTM3NGEwYTVhMDJhM2M1MDc1MzEyMjM0ZjA1ZjhmNGM4NDBhYTQ4NmM5OTEzMWY4NGI4MWM1NmRhZmY1YzMxYTg5Y2RjN2I1MDQyNFwiLFxyXG4gIFwiMDRjNmNmZDkzMzc2NDJmNDdlMjFlMjg2MzJmOTc0NGZkMWI1NmM1NzQ1NGViYWU1YzYyN2MyYTRiMTZlNDdjMDk0OGI5YzU4MjA0MWJiYjE1OTBlMTI4YTI1YWU3OWQ3MDU1ZWQ4YWVjZGJjMDMwOTIwYTY3MjA1ZGEyNDg0NmRcIixcclxuICBcImM0Mjc0NTQ0ZWI2YzM3NWQyY2FhNzBhZjhjNmE2N2UzYjc1MWM1MThjYmIzNTI0NDg5MWM3Yjc0YTEyYTVlMDZkNWNlNWI5MjVmMTM0OTMwZTE3ZjVlODZiMjExNDZkMDk2NzE1Yzc2NDVhMjUwZGJiYTFkMmJhMzViYzA3MzE3XCIsXHJcbiAgXCIwMGU1YjVlNDc4NTc2M2Q2ZjkyZmUxYWQ3YzVhN2U3ZGQwZmQzNzViZDQ0MTQ3MzE5OGQyNDg2OTkwY2E1YTkyNGI1Y2I2YjY4MzFkYzk0ZDQ0NmM5YjMxODBlZWZlMmQ3OTk4ODdiY2ZjMWVlNmQ4ZjRmMDY1MGU1OTRjOWQxYlwiLFxyXG4gIFwiZDhkY2MwNDk3MTI4NjdiYTdkMWJjMGUyODc0ZDhlYzM4ZWUyNjA4OGQxZTJhZmZhMTBmZmFjMzBjZjFkMGI5MTViYmI2Yzc5YmZhZmJiMWRiMGU4Y2Q2Njg4MGJmNGJhNTJjNTNiOTQ5ZjZhM2FkYmJhMTgyMWRkMzA0NWM3Y2JcIixcclxuICBcImE4MWQ4YTkxNzg2MWNiOGExZmZkMmU5NDQ1MmUwOGZkNmRjNGQyNTc3YmFkM2FjMDg5ZjU2Mjc5NTIxYjFjOTVjYWViZTU3YWM2YzNkMTI2ZDhhYmQ0ZDZhM2YyYzNkOGMyMDdiZDM2ZmJmNzVhNWU3OTdjNWE4ZjE5OTJjNjUxXCIsXHJcbiAgXCJiOWZjMzlkN2YxMzhhOTViOGYzMTQzNmUwMmE4NzExYjMxNjRjZDQ1YTIxMTY3M2Y3MTM3NDI5YjQ1ZmFmNzdhMTYwNDY4MmI1MTgwM2E5ODM2MzhjNDZhOGIyYzEzMjM3Yzg3YWI0YjY4NWExZmE1YzY1NzAwZGM3MTM2Y2NmY1wiLFxyXG4gIFwiMWE1ZjNlYWIwMTI3NmJmN2Q5YjA2YzQyYmU5MGZiNGI4MTA2YjI3OGI0YmJhZjkyMmYzZGE2ODIxYTYzYjRkNjlmYTkyODVmZWMwOTM2ZTBmMDRhMWIyYTI1YTY1MDY0Y2Q1MWMxMTFjNzUwNjNkYmU1OWU0ZGUzMzZiMzVmODVcIixcclxuICBcIjUzYmNiOWZlNDAzYTRhNDViZWUyYTJhMDRkYWJmYTNmMjAxOGRiMzQ5ZDBlNTIwMDE3NWJkMzQ1YWFhM2EzYmQ0NWE4OGE2ZmI3MjQ0OTE0YWQxNTY5NjE3NDJmN2I0ZWE3ZjhmZmQ4M2ZjYWU1YjExNjZiNzNiMmFkOTQzZjc2XCJcclxuXVxyXG5cclxuaW50ZXJmYWNlIFZlY3RvciB7XHJcbiAgZW50cm9weTogc3RyaW5nXHJcbiAgbW5lbW9uaWM6IHN0cmluZ1xyXG4gIHNlZWQ6IHN0cmluZ1xyXG59XHJcblxyXG5jb25zdCB2ZWN0b3JzOiBWZWN0b3JbXSA9IFtcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJvdXRcIixcclxuICAgIHNlZWQ6IFwiYzU1MjU3YzM2MGMwN2M3MjAyOWFlYmMxYjUzYzA1ZWQwMzYyYWRhMzhlYWQzZTNlOWVmYTM3MDhlNTM0OTU1MzFmMDlhNjk4NzU5OWQxODI2NGMxZTFjOTJmMmNmMTQxNjMwYzdhM2M0YWI3YzgxYjJmMDAxNjk4ZTc0NjNiMDRcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCI3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZlwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHVzZWZ1bCBsZWdhbCB3aW5uZXIgdGhhbmsgeWVsbG93XCIsXHJcbiAgICBzZWVkOiBcIjJlODkwNTgxOWI4NzIzZmUyYzFkMTYxODYwZTVlZTE4MzAzMThkYmY0OWE4M2JkNDUxY2ZiODQ0MGMyOGJkNmZhNDU3ZmUxMjk2MTA2NTU5YTNjODA5MzdhMWMxMDY5YmUzYTNhNWJkMzgxZWU2MjYwZThkOTczOWZjZTFmNjA3XCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODBcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBhdm9pZCBsZXR0ZXIgYWR2aWNlIGNhZ2UgYWJvdmVcIixcclxuICAgIHNlZWQ6IFwiZDcxZGU4NTZmODFhOGFjYzY1ZTZmYzg1MWEzOGQ0ZDdlYzIxNmZkMDc5NmQwYTY4MjdhM2FkNmVkNTUxMWEzMGZhMjgwZjEyZWIyZTQ3ZWQyYWMwM2I1YzQ2MmEwMzU4ZDE4ZDY5ZmU0Zjk4NWVjODE3NzhjMWIzNzBiNjUyYThcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZlwiLFxyXG4gICAgbW5lbW9uaWM6IFwiem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB3cm9uZ1wiLFxyXG4gICAgc2VlZDogXCJhYzI3NDk1NDgwMjI1MjIyMDc5ZDdiZTE4MTU4Mzc1MWU4NmY1NzEwMjdiMDQ5N2I1YjVkMTEyMThlMGE4YTEzMzMyNTcyOTE3ZjBmOGU1YTU4OTYyMGM2ZjE1YjExYzYxZGVlMzI3NjUxYTE0YzM0ZTE4MjMxMDUyZTQ4YzA2OVwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMFwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFnZW50XCIsXHJcbiAgICBzZWVkOiBcIjAzNTg5NWYyZjQ4MWIxYjBmMDFmY2Y4YzI4OWM3OTQ2NjBiMjg5OTgxYTc4ZjgxMDY0NDc3MDdmZGQ5NjY2Y2EwNmRhNWE5YTU2NTE4MTU5OWI3OWY1M2I4NDRkOGE3MWRkOWY0MzljNTJhM2Q3YjNlOGE3OWM5MDZhYzg0NWZhXCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJsZWdhbCB3aW5uZXIgdGhhbmsgeWVhciB3YXZlIHNhdXNhZ2Ugd29ydGggdXNlZnVsIGxlZ2FsIHdpbm5lciB0aGFuayB5ZWFyIHdhdmUgc2F1c2FnZSB3b3J0aCB1c2VmdWwgbGVnYWwgd2lsbFwiLFxyXG4gICAgc2VlZDogXCJmMmI5NDUwODczMmJjYmFjYmNjMDIwZmFlZmVjZmM4OWZlYWZhNjY0OWE1NDkxYjhjOTUyY2VkZTQ5NmMyMTRhMGM3YjNjMzkyZDE2ODc0OGYyZDRhNjEyYmFkYTA3NTNiNTJhMWM3YWM1M2MxZTkzYWJkNWM2MzIwYjllOTVkZFwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MFwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGV0dGVyIGFkdmljZSBjYWdlIGFic3VyZCBhbW91bnQgZG9jdG9yIGFjb3VzdGljIGF2b2lkIGxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBhdm9pZCBsZXR0ZXIgYWx3YXlzXCIsXHJcbiAgICBzZWVkOiBcIjEwN2Q3YzAyYTVhYTZmMzhjNTgwODNmZjc0ZjA0YzYwN2MyZDJjMGVjYzU1NTAxZGFkZDcyZDAyNWI3NTFiYzI3ZmU5MTNmZmI3OTZmODQxYzQ5YjFkMzNiNjEwY2YwZTkxZDNhYTIzOTAyN2Y1ZTk5ZmU0Y2U5ZTUwODhjZDY1XCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJ6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHdoZW5cIixcclxuICAgIHNlZWQ6IFwiMGNkNmU1ZDgyN2JiNjJlYjhmYzFlMjYyMjU0MjIzODE3ZmQwNjhhNzRiNWI0NDljYzJmNjY3YzNmMWY5ODVhNzYzNzliNDMzNDhkOTUyZTIyNjViNGNkMTI5MDkwNzU4YjNlM2MyYzQ5MTAzYjUwNTFhYWMyZWFlYjg5MGE1MjhcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYXJ0XCIsXHJcbiAgICBzZWVkOiBcImJkYTg1NDQ2YzY4NDEzNzA3MDkwYTUyMDIyZWRkMjZhMWM5NDYyMjk1MDI5ZjJlNjBjZDdjNGYyYmJkMzA5NzE3MGFmN2E0ZDczMjQ1Y2FmYTljM2NjYThkNTYxYTdjM2RlNmY1ZDRhMTBiZThlZDJhNWU2MDhkNjhmOTJmY2M4XCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZjdmN2Y3ZlwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHVzZWZ1bCBsZWdhbCB3aW5uZXIgdGhhbmsgeWVhciB3YXZlIHNhdXNhZ2Ugd29ydGggdXNlZnVsIGxlZ2FsIHdpbm5lciB0aGFuayB5ZWFyIHdhdmUgc2F1c2FnZSB3b3J0aCB0aXRsZVwiLFxyXG4gICAgc2VlZDogXCJiYzA5ZmNhMTgwNGY3ZTY5ZGE5M2MyZjIwMjhlYjIzOGMyMjdmMmU5ZGRhMzBjZDYzNjk5MjMyNTc4NDgwYTQwMjFiMTQ2YWQ3MTdmYmI3ZTQ1MWNlOWViODM1ZjQzNjIwYmY1YzUxNGRiMGY4YWRkNDlmNWQxMjE0NDlkM2U4N1wiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODA4MDgwODBcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBhdm9pZCBsZXR0ZXIgYWR2aWNlIGNhZ2UgYWJzdXJkIGFtb3VudCBkb2N0b3IgYWNvdXN0aWMgYXZvaWQgbGV0dGVyIGFkdmljZSBjYWdlIGFic3VyZCBhbW91bnQgZG9jdG9yIGFjb3VzdGljIGJsZXNzXCIsXHJcbiAgICBzZWVkOiBcImMwYzUxOWJkMGU5MWEyZWQ1NDM1N2Q5ZDFlYmVmNmY1YWYyMThhMTUzNjI0Y2Y0ZjJkYTkxMWEwZWQ4ZjdhMDllMmVmNjFhZjBhY2EwMDcwOTZkZjQzMDAyMmY3YTJiNmZiOTE2NjFhOTU4OTA5NzA2OTcyMGQwMTVlNGU5ODJmXCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZlwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB2b3RlXCIsXHJcbiAgICBzZWVkOiBcImRkNDhjMTA0Njk4YzMwY2ZlMmI2MTQyMTAzMjQ4NjIyZmI3YmIwZmY2OTJlZWJiMDAwODliMzJkMjI0ODRlMTYxMzkxMmYwYTViNjk0NDA3YmU4OTlmZmQzMWVkMzk5MmM0NTZjZGY2MGY1ZDQ1NjRiOGJhM2YwNWE2OTg5MGFkXCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiNzdjMmIwMDcxNmNlYzcyMTM4MzkxNTllNDA0ZGI1MGRcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImplbGx5IGJldHRlciBhY2hpZXZlIGNvbGxlY3QgdW5hd2FyZSBtb3VudGFpbiB0aG91Z2h0IGNhcmdvIG94eWdlbiBhY3QgaG9vZCBicmlkZ2VcIixcclxuICAgIHNlZWQ6IFwiYjViNmQwMTI3ZGIxYTlkMjIyNmFmMGMzMzQ2MDMxZDc3YWYzMWU5MThkYmE2NDI4N2ExYjQ0YjhlYmY2M2NkZDUyNjc2ZjY3MmEyOTBhYWU1MDI0NzJjZjJkNjAyYzA1MWYzZTZmMTgwNTVlODRlNGM0Mzg5N2ZjNGU1MWE2ZmZcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCJiNjNhOWM1OWE2ZTY0MWYyODhlYmMxMDMwMTdmMWRhOWY4MjkwYjNkYTZiZGVmN2JcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcInJlbmV3IHN0YXkgYmlvbG9neSBldmlkZW5jZSBnb2F0IHdlbGNvbWUgY2FzdWFsIGpvaW4gYWRhcHQgYXJtb3Igc2h1ZmZsZSBmYXVsdCBsaXR0bGUgbWFjaGluZSB3YWxrIHN0dW1ibGUgdXJnZSBzd2FwXCIsXHJcbiAgICBzZWVkOiBcIjkyNDhkODNlMDZmNGNkOThkZWJmNWI2ZjAxMDU0Mjc2MGRmOTI1Y2U0NmNmMzhhMWJkYjRlNGRlN2QyMWY1YzM5MzY2OTQxYzY5ZTFiZGJmMjk2NmUwZjZlNmRiZWNlODk4YTBlMmYwYTRjMmIzZTY0MDk1M2RmZThiN2JiZGM1XCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiM2UxNDE2MDliOTc5MzNiNjZhMDYwZGNkZGM3MWZhZDFkOTE2NzdkYjg3MjAzMWU4NWY0YzAxNWM1ZTdlODk4MlwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiZGlnbml0eSBwYXNzIGxpc3QgaW5kaWNhdGUgbmFzdHkgc3dhbXAgcG9vbCBzY3JpcHQgc29jY2VyIHRvZSBsZWFmIHBob3RvIG11bHRpcGx5IGRlc2sgaG9zdCB0b21hdG8gY3JhZGxlIGRyaWxsIHNwcmVhZCBhY3RvciBzaGluZSBkaXNtaXNzIGNoYW1waW9uIGV4b3RpY1wiLFxyXG4gICAgc2VlZDogXCJmZjdmMzE4NGRmODY5NmQ4YmVmOTRiNmMwMzExNGRiZWUwZWY4OWZmOTM4NzEyMzAxZDI3ZWQ4MzM2Y2E4OWVmOTYzNWRhMjBhZjA3ZDQxNzVmMmJmNWYzZGUxMzBmMzljOWQ5ZThkZDA0NzI0ODljMTliMWEwMjBhOTQwZGE2N1wiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjA0NjBlZjQ3NTg1NjA0YzU2NjA2MThkYjJlNmE3ZTdmXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJhZmZvcmQgYWx0ZXIgc3Bpa2UgcmFkYXIgZ2F0ZSBnbGFuY2Ugb2JqZWN0IHNlZWsgc3dhbXAgaW5mYW50IHBhbmVsIHllbGxvd1wiLFxyXG4gICAgc2VlZDogXCI2NWY5M2E5ZjM2YjZjODVjYmU2MzRmZmMxZjk5ZjJiODJjYmIxMGIzMWVkYzdmMDg3YjRmNmNiOWU5NzZlOWZhZjc2ZmY0MWY4ZjI3Yzk5YWZkZjM4ZjdhMzAzYmExMTM2ZWU0OGE0YzFlN2ZjZDNkYmE3YWE4NzYxMTNhMzZlNFwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjcyZjYwZWJhYzVkZDhhZGQ4ZDJhMjVhNzk3MTAyYzNjZTIxYmMwMjljMjAwMDc2ZlwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiaW5kaWNhdGUgcmFjZSBwdXNoIG1lcnJ5IHN1ZmZlciBodW1hbiBjcnVpc2UgZHdhcmYgcG9sZSByZXZpZXcgYXJjaCBrZWVwIGNhbnZhcyB0aGVtZSBwb2VtIGRpdm9yY2UgYWx0ZXIgbGVmdFwiLFxyXG4gICAgc2VlZDogXCIzYmJmOWRhYTBkZmFkODIyOTc4NmFjZTVkZGI0ZTAwZmE5OGEwNDRhZTRjNDk3NWZmZDVlMDk0ZGJhOWUwYmIyODkzNDlkYmUyMDkxNzYxZjMwZjM4MmQ0ZTM1YzRhNjcwZWU4YWI1MDc1OGQyYzU1ODgxYmU2OWUzMjcxMTdiYVwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcIjJjODVlZmM3ZjI0ZWU0NTczZDJiODFhNmVjNjZjZWUyMDliMmRjYmQwOWQ4ZWRkYzUxZTAyMTViMGI2OGU0MTZcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImNsdXRjaCBjb250cm9sIHZlaGljbGUgdG9uaWdodCB1bnVzdWFsIGNsb2cgdmlzYSBpY2UgcGx1bmdlIGdsaW1wc2UgcmVjaXBlIHNlcmllcyBvcGVuIGhvdXIgdmludGFnZSBkZXBvc2l0IHVuaXZlcnNlIHRpcCBqb2IgZHJlc3MgcmFkYXIgcmVmdXNlIG1vdGlvbiB0YXN0ZVwiLFxyXG4gICAgc2VlZDogXCJmZTkwOGY5NmY0NjY2OGIyZDViMzdkODJmNTU4Yzc3ZWQwZDY5ZGQwZTdlMDQzYTViMDUxMWM0OGMyZjEwNjQ2OTRhOTU2Zjg2MzYwYzkzZGQwNDA1MmE4ODk5NDk3Y2U5ZTk4NWViZTBjOGM1MmI5NTVlNmFlODZkNGZmNDQ0OVwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBlbnRyb3B5OiBcImVhZWJhYmIyMzgzMzUxZmQzMWQ3MDM4NDBiMzJlOWUyXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJ0dXJ0bGUgZnJvbnQgdW5jbGUgaWRlYSBjcnVzaCB3cml0ZSBzaHJ1ZyB0aGVyZSBsb3R0ZXJ5IGZsb3dlciByaXNrIHNoZWxsXCIsXHJcbiAgICBzZWVkOiBcImJkZmI3NmEwNzU5ZjMwMWIwYjg5OWExZTM5ODUyMjdlNTNiM2Y1MWU2N2UzZjJhNjUzNjNjYWVkZjNlMzJmZGU0MmE2NmM0MDRmMThkN2IwNTgxOGM5NWVmM2NhMWU1MTQ2NjQ2ODU2YzQ2MWMwNzMxNjk0Njc1MTE2ODA4NzZjXCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiN2FjNDVjZmU3NzIyZWU2YzdiYTg0ZmJjMmQ1YmQ2MWI0NWNiMmZlNWViNjVhYTc4XCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJraXNzIGNhcnJ5IGRpc3BsYXkgdW51c3VhbCBjb25maXJtIGN1cnRhaW4gdXBncmFkZSBhbnRpcXVlIHJvdGF0ZSBoZWxsbyB2b2lkIGN1c3RvbSBmcmVxdWVudCBvYmV5IG51dCBob2xlIHByaWNlIHNlZ21lbnRcIixcclxuICAgIHNlZWQ6IFwiZWQ1NmZmNmM4MzNjMDc5ODJlYjcxMTlhOGY0OGZkMzYzYzRhOWIxNjAxY2QyZGU3MzZiMDEwNDVjNWViOGFiNGY1N2IwNzk0MDM0ODVkMWM0OTI0ZjA3OTBkYzEwYTk3MTc2MzMzN2NiOWY5YzYyMjI2ZjY0ZmZmMjYzOTdjNzlcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCI0ZmExYThiYzNlNmQ4MGVlMTMxNjA1MGU4NjJjMTgxMjAzMTQ5MzIxMmI3ZWMzZjNiYjFiMDhmMTY4Y2FiZWVmXCIsXHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJleGlsZSBhc2sgY29uZ3Jlc3MgbGFtcCBzdWJtaXQgamFja2V0IGVyYSBzY2hlbWUgYXR0ZW5kIGNvdXNpbiBhbGNvaG9sIGNhdGNoIGNvdXJzZSBlbmQgbHVja3kgaHVydCBzZW50ZW5jZSBvdmVuIHNob3J0IGJhbGwgYmlyZCBncmFiIHdpbmcgdG9wXCIsXHJcbiAgICBzZWVkOiBcIjA5NWVlNmY4MTdiNGMyY2IzMGE1YTc5NzM2MGE4MWE0MGFiMGY5YTRlMjVlY2Q2NzJhM2Y1OGEwYjViYTA2ODdjMDk2YTZiMTRkMmMwZGViM2JkZWZjZTRmNjFkMDFhZTA3NDE3ZDUwMjQyOTM1MmUyNzY5NTE2M2Y3NDQ3YThjXCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiMThhYjE5YTlmNTRhOTI3NGYwM2U1MjA5YTJhYzhhOTFcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImJvYXJkIGZsZWUgaGVhdnkgdHVubmVsIHBvd2RlciBkZW5pYWwgc2NpZW5jZSBza2kgYW5zd2VyIGJldHJheSBjYXJnbyBjYXRcIixcclxuICAgIHNlZWQ6IFwiNmVmZjFiYjIxNTYyOTE4NTA5YzczY2I5OTAyNjBkYjA3YzBjZTM0ZmYwZTNjYzRhOGNiMzI3NjEyOWZiY2IzMDBiZGRmZTAwNTgzMTM1MGVmZDYzMzkwOWY0NzZjNDVjODgyNTMyNzZkOWZkMGRmNmVmNDg2MDllOGJiN2RjYThcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgZW50cm9weTogXCIxOGEyZTFkODFiOGVjZmIyYTMzM2FkY2IwYzE3YTViOWViNzZjYzVkMDVkYjkxYTRcIixcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImJvYXJkIGJsYWRlIGludml0ZSBkYW1hZ2UgdW5kbyBzdW4gbWltaWMgaW50ZXJlc3Qgc2xhbSBnYXplIHRydWx5IGluaGVyaXQgcmVzaXN0IGdyZWF0IGluamVjdCByb2NrZXQgbXVzZXVtIGNoaWVmXCIsXHJcbiAgICBzZWVkOiBcImY4NDUyMWM3NzdhMTNiNjE1NjQyMzRiZjhmOGI2MmIzYWZjZTI3ZmM0MDYyYjUxYmI1ZTYyYmRmZWNiMjM4NjRlZTZlY2YwN2MxZDVhOTdjMDgzNDMwN2M1Yzg1MmQ4Y2ViODhlN2M5NzkyM2MwYTNiNDk2YmVkZDRlNWY4OGE5XCJcclxuICB9LFxyXG4gIHtcclxuICAgIGVudHJvcHk6IFwiMTVkYTg3MmM5NWExM2RkNzM4ZmJmNTBlNDI3NTgzYWQ2MWYxOGZkOTlmNjI4YzQxN2E2MWNmODM0M2M5MDQxOVwiLFxyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiYmV5b25kIHN0YWdlIHNsZWVwIGNsaXAgYmVjYXVzZSB0d2lzdCB0b2tlbiBsZWFmIGF0b20gYmVhdXR5IGdlbml1cyBmb29kIGJ1c2luZXNzIHNpZGUgZ3JpZCB1bmFibGUgbWlkZGxlIGFybWVkIG9ic2VydmUgcGFpciBjcm91Y2ggdG9uaWdodCBhd2F5IGNvY29udXRcIixcclxuICAgIHNlZWQ6IFwiYjE1NTA5ZWFhMmQwOWQzZWZkM2UwMDZlZjQyMTUxYjMwMzY3ZGM2ZTNhYTVlNDRjYWJhM2ZlNGQzZTM1MmU2NTEwMWZiZGI4NmE5Njc3NmI5MTk0NmZmMDZmOGVhYzU5NGRjNmVlMWQzZTgyYTQyZGZlMWI0MGZlZjZiY2MzZmRcIlxyXG4gIH1cclxuXVxyXG5cclxuaW50ZXJmYWNlIEJhZE1uZW1vbmljIHtcclxuICBtbmVtb25pYzogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IGJhZE1uZW1vbmljczogQmFkTW5lbW9uaWNbXSA9IFtcclxuICB7XHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb25cIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHVzZWZ1bCBsZWdhbCB3aW5uZXIgdGhhbmsgeWVsbG93IHllbGxvd1wiXHJcbiAgfSxcclxuICB7XHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJsZXR0ZXIgYWR2aWNlIGNhZ2UgYWJzdXJkIGFtb3VudCBkb2N0b3IgYWNvdXN0aWMgYXZvaWQgbGV0dGVyIGFkdmljZSBjYWdlZCBhYm92ZVwiXHJcbiAgfSxcclxuICB7IG1uZW1vbmljOiBcInpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28sIHdyb25nXCIgfSxcclxuICB7XHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb25cIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHVzZWZ1bCBsZWdhbCB3aW5uZXIgdGhhbmsgeWVhciB3YXZlIHNhdXNhZ2Ugd29ydGggdXNlZnVsIGxlZ2FsIHdpbGwgd2lsbCB3aWxsXCJcclxuICB9LFxyXG4gIHtcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBhdm9pZCBsZXR0ZXIgYWR2aWNlIGNhZ2UgYWJzdXJkIGFtb3VudCBkb2N0b3IgYWNvdXN0aWMgYXZvaWQgbGV0dGVyIGFsd2F5cy5cIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB3aHlcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwiYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFydCBhcnRcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwibGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHVzZWZ1bCBsZWdhbCB3aW5uZXIgdGhhbmtzIHllYXIgd2F2ZSB3b3J0aCB1c2VmdWwgbGVnYWwgd2lubmVyIHRoYW5rIHllYXIgd2F2ZSBzYXVzYWdlIHdvcnRoIHRpdGxlXCJcclxuICB9LFxyXG4gIHtcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBhdm9pZCBsZXR0ZXJzIGFkdmljZSBjYWdlIGFic3VyZCBhbW91bnQgZG9jdG9yIGFjb3VzdGljIGF2b2lkIGxldHRlciBhZHZpY2UgY2FnZSBhYnN1cmQgYW1vdW50IGRvY3RvciBhY291c3RpYyBibGVzc1wiXHJcbiAgfSxcclxuICB7XHJcbiAgICBtbmVtb25pYzpcclxuICAgICAgXCJ6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHpvbyB6b28gem9vIHZvdGVkXCJcclxuICB9LFxyXG4gIHtcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImplbGxvIGJldHRlciBhY2hpZXZlIGNvbGxlY3QgdW5hd2FyZSBtb3VudGFpbiB0aG91Z2h0IGNhcmdvIG94eWdlbiBhY3QgaG9vZCBicmlkZ2VcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbW5lbW9uaWM6XHJcbiAgICAgIFwicmVuZXcsIHN0YXksIGJpb2xvZ3ksIGV2aWRlbmNlLCBnb2F0LCB3ZWxjb21lLCBjYXN1YWwsIGpvaW4sIGFkYXB0LCBhcm1vciwgc2h1ZmZsZSwgZmF1bHQsIGxpdHRsZSwgbWFjaGluZSwgd2Fsaywgc3R1bWJsZSwgdXJnZSwgc3dhcFwiXHJcbiAgfSxcclxuICB7IG1uZW1vbmljOiBcImRpZ25pdHkgcGFzcyBsaXN0IGluZGljYXRlIG5hc3R5XCIgfSxcclxuXHJcbiAgLy8gRnJvbSBpc3N1ZSAzMlxyXG4gIHtcclxuICAgIG1uZW1vbmljOlxyXG4gICAgICBcImFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBhYmFuZG9uIGFiYW5kb24gYWJhbmRvbiBsZXR0ZXJcIlxyXG4gIH1cclxuXVxyXG5cclxuY29uc3QgbWFsZm9ybWVkTW5lbW9uaWNzOiBzdHJpbmdbXSA9IFtcclxuICBcImEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGFcIiwgLy8gVG9vIG1hbnkgd29yZHNcclxuICBcImFcIiwgLy8gVG9vIGZld1xyXG4gIFwiYSBhIGEgYSBhIGEgYSBhIGEgYSBhIGEgYSBhXCIgLy8gTm90IG11bHRpcGxlIG9mIDNcclxuXVxyXG5cclxuZGVzY3JpYmUoXCJNbmVtb25pY1wiLCAoKSA9PiB7XHJcbiAgdGVzdChcInZlY3RvcnNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgdmVjdG9ycy5mb3JFYWNoKGFzeW5jICh2ZWN0b3I6IFZlY3RvciwgaW5kZXg6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCB3b3JkbGlzdCA9IG1uZW1vbmljLmdldFdvcmRsaXN0cyhcImVuZ2xpc2hcIikgYXMgc3RyaW5nW11cclxuICAgICAgY29uc3QgZW50cm9weVRvTW5lbW9uaWM6IHN0cmluZyA9IG1uZW1vbmljLmVudHJvcHlUb01uZW1vbmljKFxyXG4gICAgICAgIHZlY3Rvci5lbnRyb3B5LFxyXG4gICAgICAgIHdvcmRsaXN0XHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHZlY3Rvci5tbmVtb25pYykudG9CZShlbnRyb3B5VG9NbmVtb25pYylcclxuICAgICAgY29uc3QgbW5lbW9uaWNUb0VudHJvcHk6IHN0cmluZyA9IG1uZW1vbmljLm1uZW1vbmljVG9FbnRyb3B5KFxyXG4gICAgICAgIHZlY3Rvci5tbmVtb25pYyxcclxuICAgICAgICB3b3JkbGlzdFxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdChtbmVtb25pY1RvRW50cm9weSkudG9CZSh2ZWN0b3IuZW50cm9weSlcclxuICAgICAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiVFJFWk9SXCJcclxuICAgICAgY29uc3QgbW5lbW9uaWNUb1NlZWQ6IEJ1ZmZlciA9IGF3YWl0IG1uZW1vbmljLm1uZW1vbmljVG9TZWVkKFxyXG4gICAgICAgIHZlY3Rvci5tbmVtb25pYyxcclxuICAgICAgICBwYXNzd29yZFxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdChtbmVtb25pY1RvU2VlZC50b1N0cmluZyhcImhleFwiKSkudG9CZSh2ZWN0b3Iuc2VlZClcclxuICAgIH0pXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImJhZE1uZW1vbmljc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCB3b3JkbGlzdCA9IG1uZW1vbmljLmdldFdvcmRsaXN0cyhcImVuZ2xpc2hcIikgYXMgc3RyaW5nW11cclxuICAgIGJhZE1uZW1vbmljcy5mb3JFYWNoKChiYWRNbmVtb25pYzogQmFkTW5lbW9uaWMsIGluZGV4OiBudW1iZXIpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdmFsaWRhdGVNbmVtb25pYzogc3RyaW5nID0gbW5lbW9uaWMudmFsaWRhdGVNbmVtb25pYyhcclxuICAgICAgICBiYWRNbmVtb25pYy5tbmVtb25pYyxcclxuICAgICAgICB3b3JkbGlzdFxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh2YWxpZGF0ZU1uZW1vbmljKS50b0JlRmFsc3koKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwibWFsZm9ybWVkTW5lbW9uaWNzXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHdvcmRsaXN0ID0gbW5lbW9uaWMuZ2V0V29yZGxpc3RzKFwiZW5nbGlzaFwiKSBhcyBzdHJpbmdbXVxyXG4gICAgbWFsZm9ybWVkTW5lbW9uaWNzLmZvckVhY2goXHJcbiAgICAgIChtYWxmb3JtZWRNbmVtb25pYzogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRhdGVNbmVtb25pYzogc3RyaW5nID0gbW5lbW9uaWMudmFsaWRhdGVNbmVtb25pYyhcclxuICAgICAgICAgIG1hbGZvcm1lZE1uZW1vbmljLFxyXG4gICAgICAgICAgd29yZGxpc3RcclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlTW5lbW9uaWMpLnRvQmVGYWxzeSgpXHJcbiAgICAgIH1cclxuICAgIClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZW50cm9weVRvTW5lbW9uaWNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgbGFuZ3MuZm9yRWFjaCgobGFuZzogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHdvcmRsaXN0ID0gbW5lbW9uaWMuZ2V0V29yZGxpc3RzKGxhbmcpIGFzIHN0cmluZ1tdXHJcbiAgICAgIGNvbnN0IGVudHJvcHlUb01uZW1vbmljOiBzdHJpbmcgPSBtbmVtb25pYy5lbnRyb3B5VG9NbmVtb25pYyhcclxuICAgICAgICBlbnRyb3B5LFxyXG4gICAgICAgIHdvcmRsaXN0XHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KG1uZW1ub25pY3NbaW5kZXhdKS50b0JlKGVudHJvcHlUb01uZW1vbmljKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2VuZXJhdGVNbmVtb25pY1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBzdHJlbmd0aDogbnVtYmVyID0gMjU2XHJcbiAgICBsYW5ncy5mb3JFYWNoKChsYW5nOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3Qgd29yZGxpc3QgPSBtbmVtb25pYy5nZXRXb3JkbGlzdHMobGFuZykgYXMgc3RyaW5nW11cclxuICAgICAgY29uc3QgbTogc3RyaW5nID0gbW5lbW9uaWMuZ2VuZXJhdGVNbmVtb25pYyhcclxuICAgICAgICBzdHJlbmd0aCxcclxuICAgICAgICByYW5kb21CeXRlcyxcclxuICAgICAgICB3b3JkbGlzdFxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eXBlb2YgbSA9PT0gXCJzdHJpbmdcIikudG9CZVRydXRoeSgpXHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJ0ZXN0IG1uZW1vbmljIGxlbmd0aHNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgd29yZGxpc3QgPSBtbmVtb25pYy5nZXRXb3JkbGlzdHMoXCJlbmdsaXNoXCIpIGFzIHN0cmluZ1tdXHJcbiAgICBsZXQgc3RyZW5ndGg6IG51bWJlciA9IDEyOFxyXG4gICAgbGV0IG1uZW1ubmljOiBzdHJpbmcgPSBtbmVtb25pYy5nZW5lcmF0ZU1uZW1vbmljKFxyXG4gICAgICBzdHJlbmd0aCxcclxuICAgICAgcmFuZG9tQnl0ZXMsXHJcbiAgICAgIHdvcmRsaXN0XHJcbiAgICApXHJcbiAgICBleHBlY3QobW5lbW5uaWMuc3BsaXQoXCIgXCIpLmxlbmd0aCkudG9CZSgxMilcclxuICAgIHN0cmVuZ3RoID0gMTYwXHJcbiAgICBtbmVtbm5pYyA9IG1uZW1vbmljLmdlbmVyYXRlTW5lbW9uaWMoc3RyZW5ndGgsIHJhbmRvbUJ5dGVzLCB3b3JkbGlzdClcclxuICAgIGV4cGVjdChtbmVtbm5pYy5zcGxpdChcIiBcIikubGVuZ3RoKS50b0JlKDE1KVxyXG4gICAgc3RyZW5ndGggPSAxOTJcclxuICAgIG1uZW1ubmljID0gbW5lbW9uaWMuZ2VuZXJhdGVNbmVtb25pYyhzdHJlbmd0aCwgcmFuZG9tQnl0ZXMsIHdvcmRsaXN0KVxyXG4gICAgZXhwZWN0KG1uZW1ubmljLnNwbGl0KFwiIFwiKS5sZW5ndGgpLnRvQmUoMTgpXHJcbiAgICBzdHJlbmd0aCA9IDIyNFxyXG4gICAgbW5lbW5uaWMgPSBtbmVtb25pYy5nZW5lcmF0ZU1uZW1vbmljKHN0cmVuZ3RoLCByYW5kb21CeXRlcywgd29yZGxpc3QpXHJcbiAgICBleHBlY3QobW5lbW5uaWMuc3BsaXQoXCIgXCIpLmxlbmd0aCkudG9CZSgyMSlcclxuICAgIHN0cmVuZ3RoID0gMjU2XHJcbiAgICBtbmVtbm5pYyA9IG1uZW1vbmljLmdlbmVyYXRlTW5lbW9uaWMoc3RyZW5ndGgsIHJhbmRvbUJ5dGVzLCB3b3JkbGlzdClcclxuICAgIGV4cGVjdChtbmVtbm5pYy5zcGxpdChcIiBcIikubGVuZ3RoKS50b0JlKDI0KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRXb3JkbGlzdHNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgbGFuZ3MuZm9yRWFjaCgobGFuZzogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHdvcmRsaXN0ID0gbW5lbW9uaWMuZ2V0V29yZGxpc3RzKGxhbmcpIGFzIHN0cmluZ1tdXHJcbiAgICAgIGV4cGVjdCh0eXBlb2Ygd29yZGxpc3QgPT09IFwib2JqZWN0XCIpLnRvQmVUcnV0aHkoKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwibW5lbW9uaWNUb0VudHJvcHlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgbW5lbW5vbmljcy5mb3JFYWNoKChtbmVtbm5pYzogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHdvcmRsaXN0ID0gbW5lbW9uaWMuZ2V0V29yZGxpc3RzKGxhbmdzW2luZGV4XSkgYXMgc3RyaW5nW11cclxuICAgICAgY29uc3QgbW5lbW9uaWNUb0VudHJvcHk6IHN0cmluZyA9IG1uZW1vbmljLm1uZW1vbmljVG9FbnRyb3B5KFxyXG4gICAgICAgIG1uZW1ubmljLFxyXG4gICAgICAgIHdvcmRsaXN0XHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KG1uZW1vbmljVG9FbnRyb3B5KS50b0JlKGVudHJvcHkpXHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJtbmVtb25pY1RvU2VlZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBtbmVtbm9uaWNzLmZvckVhY2goYXN5bmMgKG1uZW1ubmljOiBzdHJpbmcpOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gICAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJwYXNzd29yZFwiXHJcbiAgICAgIGNvbnN0IG1uZW1vbmljVG9TZWVkOiBCdWZmZXIgPSBhd2FpdCBtbmVtb25pYy5tbmVtb25pY1RvU2VlZChcclxuICAgICAgICBtbmVtbm5pYyxcclxuICAgICAgICBwYXNzd29yZFxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eXBlb2YgbW5lbW9uaWNUb1NlZWQgPT09IFwib2JqZWN0XCIpLnRvQmVUcnV0aHkoKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwibW5lbW9uaWNUb1NlZWRTeW5jXCIsICgpOiB2b2lkID0+IHtcclxuICAgIG1uZW1ub25pY3MuZm9yRWFjaCgobW5lbW5uaWM6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJwYXNzd29yZFwiXHJcbiAgICAgIGNvbnN0IG1uZW1vbmljVG9TZWVkU3luYzogQnVmZmVyID0gbW5lbW9uaWMubW5lbW9uaWNUb1NlZWRTeW5jKFxyXG4gICAgICAgIG1uZW1ubmljLFxyXG4gICAgICAgIHBhc3N3b3JkXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KG1uZW1vbmljVG9TZWVkU3luYy50b1N0cmluZyhcImhleFwiKSkudG9CZShzZWVkc1tpbmRleF0pXHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJ2YWxpZGF0ZU1uZW1vbmljXCIsICgpOiB2b2lkID0+IHtcclxuICAgIG1uZW1ub25pY3MuZm9yRWFjaCgobW5lbW5uaWM6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCB3b3JkbGlzdCA9IG1uZW1vbmljLmdldFdvcmRsaXN0cyhsYW5nc1tpbmRleF0pIGFzIHN0cmluZ1tdXHJcbiAgICAgIGNvbnN0IHZhbGlkYXRlTW5lbW9uaWM6IHN0cmluZyA9IG1uZW1vbmljLnZhbGlkYXRlTW5lbW9uaWMoXHJcbiAgICAgICAgbW5lbW5uaWMsXHJcbiAgICAgICAgd29yZGxpc3RcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodmFsaWRhdGVNbmVtb25pYykudG9CZVRydXRoeSgpXHJcbiAgICB9KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJzZXREZWZhdWx0V29yZGxpc3RcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgbGFuZ3MuZm9yRWFjaCgobGFuZzogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XHJcbiAgICAgIG1uZW1vbmljLnNldERlZmF1bHRXb3JkbGlzdChsYW5nKVxyXG4gICAgICBjb25zdCBnZXREZWZhdWx0V29yZGxpc3Q6IHN0cmluZyA9IG1uZW1vbmljLmdldERlZmF1bHRXb3JkbGlzdCgpXHJcbiAgICAgIGNvbnN0IHdvcmRsaXN0ID0gbW5lbW9uaWMuZ2V0V29yZGxpc3RzKGxhbmcpIGFzIHN0cmluZ1tdXHJcbiAgICAgIGNvbnN0IG06IHN0cmluZyA9IG1uZW1vbmljLmdlbmVyYXRlTW5lbW9uaWMoMjU2LCByYW5kb21CeXRlcywgd29yZGxpc3QpXHJcbiAgICAgIGV4cGVjdChnZXREZWZhdWx0V29yZGxpc3QpLnRvQmUobGFuZylcclxuICAgICAgZXhwZWN0KHR5cGVvZiB3b3JkbGlzdCA9PT0gXCJvYmplY3RcIikudG9CZVRydXRoeSgpXHJcbiAgICAgIGV4cGVjdCh0eXBlb2YgbSA9PT0gXCJzdHJpbmdcIikudG9CZVRydXRoeSgpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==