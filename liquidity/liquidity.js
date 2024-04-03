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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenAccounts = exports.createPoolKeys = exports.MINIMAL_MARKET_STATE_LAYOUT_V3 = exports.OPENBOOK_PROGRAM_ID = exports.RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = void 0;
var web3_js_1 = require("@solana/web3.js");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var spl_token_1 = require("@solana/spl-token");
exports.RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = raydium_sdk_1.MAINNET_PROGRAM_ID.AmmV4;
exports.OPENBOOK_PROGRAM_ID = raydium_sdk_1.MAINNET_PROGRAM_ID.OPENBOOK_MARKET;
exports.MINIMAL_MARKET_STATE_LAYOUT_V3 = (0, raydium_sdk_1.struct)([
    (0, raydium_sdk_1.publicKey)('eventQueue'),
    (0, raydium_sdk_1.publicKey)('bids'),
    (0, raydium_sdk_1.publicKey)('asks'),
]);
function createPoolKeys(id, accountData, minimalMarketLayoutV3) {
    return {
        id: id,
        baseMint: accountData.baseMint,
        quoteMint: accountData.quoteMint,
        lpMint: accountData.lpMint,
        baseDecimals: accountData.baseDecimal.toNumber(),
        quoteDecimals: accountData.quoteDecimal.toNumber(),
        lpDecimals: 5,
        version: 4,
        programId: exports.RAYDIUM_LIQUIDITY_PROGRAM_ID_V4,
        authority: raydium_sdk_1.Liquidity.getAssociatedAuthority({
            programId: exports.RAYDIUM_LIQUIDITY_PROGRAM_ID_V4,
        }).publicKey,
        openOrders: accountData.openOrders,
        targetOrders: accountData.targetOrders,
        baseVault: accountData.baseVault,
        quoteVault: accountData.quoteVault,
        marketVersion: 3,
        marketProgramId: accountData.marketProgramId,
        marketId: accountData.marketId,
        marketAuthority: raydium_sdk_1.Market.getAssociatedAuthority({
            programId: accountData.marketProgramId,
            marketId: accountData.marketId,
        }).publicKey,
        marketBaseVault: accountData.baseVault,
        marketQuoteVault: accountData.quoteVault,
        marketBids: minimalMarketLayoutV3.bids,
        marketAsks: minimalMarketLayoutV3.asks,
        marketEventQueue: minimalMarketLayoutV3.eventQueue,
        withdrawQueue: accountData.withdrawQueue,
        lpVault: accountData.lpVault,
        lookupTableAccount: web3_js_1.PublicKey.default,
    };
}
exports.createPoolKeys = createPoolKeys;
function getTokenAccounts(connection, owner, commitment) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenResp, accounts, _i, _a, _b, pubkey, account;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, connection.getTokenAccountsByOwner(owner, {
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                    }, commitment)];
                case 1:
                    tokenResp = _c.sent();
                    accounts = [];
                    for (_i = 0, _a = tokenResp.value; _i < _a.length; _i++) {
                        _b = _a[_i], pubkey = _b.pubkey, account = _b.account;
                        accounts.push({
                            pubkey: pubkey,
                            programId: account.owner,
                            accountInfo: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.decode(account.data),
                        });
                    }
                    return [2 /*return*/, accounts];
            }
        });
    });
}
exports.getTokenAccounts = getTokenAccounts;
