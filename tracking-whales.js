"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spl_token_1 = require("@solana/spl-token");
var whales_json_1 = __importDefault(require("./whales.json"));
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var js_1 = require("@metaplex-foundation/js");
var web3_js_1 = require("@solana/web3.js");
var RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
var RPC_WEBSOCKET_ENDPOINT = 'wss://api.mainnet-beta.solana.com';
var bot = new node_telegram_bot_api_1.default('7046876390:AAEl_46sTUwninrNg-tj56ojFj52omDYfdw', { polling: true });
// const bot = new TelegramBot('6496482594:AAF0DiqmkuewnnYKFMsxLEZZJPi1Fs9Mous', { polling: true });
var solanaConnection = new web3_js_1.Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});
var metaplex = js_1.Metaplex.make(solanaConnection);
var sent = new Set();
var listMintExclude = [
    'So11111111111111111111111111111111111111112',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
];
function trackingAlpha(wallet) {
    var _this = this;
    var id = solanaConnection.onProgramAccountChange(spl_token_1.TOKEN_PROGRAM_ID, function (updatedAccountInfo) { return __awaiter(_this, void 0, void 0, function () {
        var accountData, token, amount, metadata, error_1, error_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    accountData = spl_token_1.AccountLayout.decode(updatedAccountInfo.accountInfo.data);
                    token = accountData.mint.toString();
                    amount = Number(accountData.amount.toString());
                    if (listMintExclude.includes(token) || amount <= 100) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, checkMetaplex(new web3_js_1.PublicKey(token), solanaConnection)];
                case 1:
                    metadata = _d.sent();
                    if (!metadata) return [3 /*break*/, 6];
                    amount = amount / Math.pow(10, (_a = metadata.decimals) !== null && _a !== void 0 ? _a : 0);
                    if (amount <= 100) {
                        return [2 /*return*/];
                    }
                    if (sent.has("".concat(token, "-").concat(wallet.toString()))) {
                        return [2 /*return*/];
                    }
                    // notify
                    sent.add("".concat(token, "-").concat(wallet.toString()));
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, bot.sendMessage('@bngok', "\uD83D\uDCA1Alpha wallet: <code>".concat(wallet.toString(), "</code>\n<a href=\"https://solscan.io/account/").concat(wallet.toString(), "#splTransfers\">Check</a>\n").concat(metadata.name, " (").concat(metadata.symbol, ")\n\uD83E\uDE85 CA: <code>").concat(token, "</code>\n\uD83D\uDC64 Renounced: ").concat(metadata.renounceable ? '✅' : '❌', "\n\uD83D\uDCD6 Description: ").concat(metadata.description, " ").concat((_c = Object.values((_b = metadata.extensions) !== null && _b !== void 0 ? _b : {})) === null || _c === void 0 ? void 0 : _c.join(', '), "\n\uD83D\uDCC8 <a href=\"https://solscan.io/token/").concat(token, "\">SolScan</a>\nBought: <code>").concat(amount, "</code> ").concat(metadata.symbol), {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                        })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _d.sent();
                    console.log("Can't send message", error_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 9];
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, bot.sendMessage('@bngok', "Alpha detected: ".concat(wallet.toString(), "\n  Buy Token CA: <code>").concat(token, "</code>\n  Bought: <code>").concat(amount, "</code>"), {
                            parse_mode: 'HTML',
                        })];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _d.sent();
                    console.log("Can't send message", error_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); }, 'finalized', [
        {
            dataSize: 165,
        },
        {
            memcmp: {
                offset: 32,
                bytes: wallet.toBase58(),
            },
        },
    ]);
    console.info("".concat(id, " ===> Listening for wallet changes: ").concat(wallet.toString()));
}
whales_json_1.default.list.slice(1, 50).forEach(function (wallet) {
    trackingAlpha(new web3_js_1.PublicKey(wallet));
});
function checkBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var list, _i, _a, addr, balanceOfOwner, balance;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    list = [];
                    _i = 0, _a = whales_json_1.default.list;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    addr = _a[_i];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, solanaConnection.getBalance(new web3_js_1.PublicKey(addr))];
                case 3:
                    balanceOfOwner = _b.sent();
                    balance = balanceOfOwner / 1000000000;
                    if (balance > 5) {
                        list.push(addr);
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log(JSON.stringify(list, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
function checkMetaplex(mintAddress, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var metadataAccount, metadataAccountInfo, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });
                    return [4 /*yield*/, connection.getAccountInfo(metadataAccount)];
                case 1:
                    metadataAccountInfo = _a.sent();
                    if (!metadataAccountInfo) return [3 /*break*/, 3];
                    return [4 /*yield*/, metaplex.nfts().findByMint({ mintAddress: mintAddress })];
                case 2:
                    token = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, token.json), { decimals: token.mint.decimals, renounceable: token.mint.freezeAuthorityAddress === null, mint: token.mint.mintAuthorityAddress === null, name: token.name, symbol: token.symbol, isMutable: token.isMutable })];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
