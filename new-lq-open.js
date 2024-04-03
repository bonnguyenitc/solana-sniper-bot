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
var web3_js_1 = require("@solana/web3.js");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var bs58_1 = __importDefault(require("bs58"));
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var js_1 = require("@metaplex-foundation/js");
var COMMITMENT_LEVEL = 'finalized';
var MIN_POOL_SIZE = 10;
var OPENBOOK_PROGRAM_ID = new web3_js_1.PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX');
var RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = new web3_js_1.PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
var bot = new node_telegram_bot_api_1.default('6677381747:AAGVWUJfgRGWmXUnYfS4iydwRDBYIMOs7PU', { polling: true });
function checkAllCharIsLowerCase(str) {
    str = str.replace(' ', '');
    for (var i = 0; i < str.length; i++) {
        if (str[i] !== str[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}
var RPC_ENDPOINT = 'https://chaotic-delicate-gadget.solana-mainnet.quiknode.pro/c61ff77c69d3255f7be58feb3fcea3e4611c2375/';
var RPC_WEBSOCKET_ENDPOINT = 'wss://chaotic-delicate-gadget.solana-mainnet.quiknode.pro/c61ff77c69d3255f7be58feb3fcea3e4611c2375/';
var quoteToken = raydium_sdk_1.Token.WSOL;
var quoteMinPoolSizeAmount = new raydium_sdk_1.TokenAmount(quoteToken, MIN_POOL_SIZE, false);
var lpExist = new Set();
var solanaConnection = new web3_js_1.Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});
var metaplex = js_1.Metaplex.make(solanaConnection);
var runTimestamp = Math.floor(new Date().getTime() / 1000);
solanaConnection.onProgramAccountChange(RAYDIUM_LIQUIDITY_PROGRAM_ID_V4, function (updatedAccountInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var poolState, poolOpenTime, id, existing, poolSize, lpMint, lpReserveStr, accInfo, mintInfo, lpReserve, actualSupply, burnAmt, burnPct, metadata;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                poolState = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.decode(updatedAccountInfo.accountInfo.data);
                poolOpenTime = parseInt(poolState.poolOpenTime.toString());
                id = updatedAccountInfo.accountId.toString();
                existing = lpExist.has(id);
                if (!(poolOpenTime >= runTimestamp && !existing)) return [3 /*break*/, 5];
                lpExist.add(id);
                poolSize = new raydium_sdk_1.TokenAmount(quoteToken, poolState.swapQuoteInAmount, true);
                if (poolSize.lt(quoteMinPoolSizeAmount)) {
                    return [2 /*return*/];
                }
                lpMint = poolState.lpMint;
                lpReserveStr = poolState.lpReserve.toString();
                return [4 /*yield*/, solanaConnection.getParsedAccountInfo(new web3_js_1.PublicKey(lpMint))];
            case 1:
                accInfo = _g.sent();
                mintInfo = (_c = (_b = (_a = accInfo === null || accInfo === void 0 ? void 0 : accInfo.value) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.parsed) === null || _c === void 0 ? void 0 : _c.info;
                lpReserve = Number(lpReserveStr) / Math.pow(10, mintInfo === null || mintInfo === void 0 ? void 0 : mintInfo.decimals);
                actualSupply = (mintInfo === null || mintInfo === void 0 ? void 0 : mintInfo.supply) / Math.pow(10, mintInfo === null || mintInfo === void 0 ? void 0 : mintInfo.decimals);
                burnAmt = lpReserve - actualSupply;
                burnPct = (burnAmt / lpReserve) * 100;
                // delay
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
            case 2:
                // delay
                _g.sent();
                return [4 /*yield*/, checkMetaplex(poolState.baseMint, solanaConnection)];
            case 3:
                metadata = _g.sent();
                if (!metadata) return [3 /*break*/, 5];
                if (!metadata.renounceable) return [3 /*break*/, 5];
                // notify
                return [4 /*yield*/, bot.sendMessage('@bngok', "<strong>\uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8NEW LIQUID ADDED\uD83D\uDEA8\uD83D\uDEA8\uD83D\uDEA8</strong>\n".concat(metadata.name, " (").concat(metadata.symbol, ") (").concat(burnPct !== null && burnPct !== void 0 ? burnPct : 0, "% \uD83D\uDD25)\n\uD83E\uDE85 CA: <code>").concat(poolState.baseMint.toString(), "</code>\n\uD83D\uDC64 Renounced: \u2705\n\uD83D\uDCB0 Supply: ").concat((_d = formatter.format(metadata.supply)) === null || _d === void 0 ? void 0 : _d.replace('$', ''), " ").concat(metadata.symbol, "\n\uD83D\uDCD6 Description: ").concat(metadata.description, " ").concat((_f = Object.values((_e = metadata.extensions) !== null && _e !== void 0 ? _e : {})) === null || _f === void 0 ? void 0 : _f.join('\n'), "\n\uD83D\uDCC8 <a href=\"https://dexscreener.com/solana/").concat(id, "\">DS</a>|\uD83D\uDCC8 <a href=\"https://solscan.io/token/").concat(poolState.baseMint.toString(), "\">Token</a>"), {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                    })];
            case 4:
                // notify
                _g.sent();
                _g.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); }, COMMITMENT_LEVEL, [
    { dataSize: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.span },
    {
        memcmp: {
            offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf('quoteMint'),
            bytes: raydium_sdk_1.Token.WSOL.mint.toBase58(),
        },
    },
    {
        memcmp: {
            offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf('marketProgramId'),
            bytes: OPENBOOK_PROGRAM_ID.toBase58(),
        },
    },
    {
        memcmp: {
            offset: raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.offsetOf('status'),
            bytes: bs58_1.default.encode([6, 0, 0, 0, 0, 0, 0, 0]),
        },
    },
]);
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
                    console.log(token.mint.supply.basisPoints.toString(), token.mint.address);
                    return [2 /*return*/, __assign(__assign({}, token.json), { decimals: token.mint.decimals, renounceable: token.mint.freezeAuthorityAddress === null && token.mint.mintAuthorityAddress === null, name: token.name, symbol: token.symbol, isMutable: token.isMutable, supply: Number(token.mint.supply.basisPoints.toString()) / Math.pow(10, token.mint.decimals) })];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
