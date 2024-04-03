import { Connection, PublicKey } from '@solana/web3.js';
import { LIQUIDITY_STATE_LAYOUT_V4, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import base58 from 'bs58';
import TelegramBot from 'node-telegram-bot-api';
import { Metaplex } from '@metaplex-foundation/js';

const COMMITMENT_LEVEL = 'finalized';
const MIN_POOL_SIZE = 10;

const OPENBOOK_PROGRAM_ID = new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX');
const RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');

const bot = new TelegramBot('6677381747:AAGVWUJfgRGWmXUnYfS4iydwRDBYIMOs7PU', { polling: true });

const NAME = 'cat';

const RPC_ENDPOINT =
  'https://chaotic-delicate-gadget.solana-mainnet.quiknode.pro/c61ff77c69d3255f7be58feb3fcea3e4611c2375/';
const RPC_WEBSOCKET_ENDPOINT =
  'wss://chaotic-delicate-gadget.solana-mainnet.quiknode.pro/c61ff77c69d3255f7be58feb3fcea3e4611c2375/';

let quoteToken = Token.WSOL;
let quoteMinPoolSizeAmount = new TokenAmount(quoteToken, MIN_POOL_SIZE, false);

const lpExist = new Set<string>();

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

const metaplex = Metaplex.make(solanaConnection);

const runTimestamp = Math.floor(new Date().getTime() / 1000);
solanaConnection.onProgramAccountChange(
  RAYDIUM_LIQUIDITY_PROGRAM_ID_V4,
  async (updatedAccountInfo) => {
    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(updatedAccountInfo.accountInfo.data);
    const poolOpenTime = parseInt(poolState.poolOpenTime.toString());
    const id = updatedAccountInfo.accountId.toString();
    const existing = lpExist.has(id);

    if (poolOpenTime >= runTimestamp && !existing) {
      lpExist.add(id);
      const poolSize = new TokenAmount(quoteToken, poolState.swapQuoteInAmount, true);
      if (poolSize.lt(quoteMinPoolSizeAmount)) {
        return;
      }

      // delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const metadata: any = await checkMetaplex(poolState.baseMint, solanaConnection);
      if (metadata) {
        if (metadata.renounceable && metadata.renounceableMint) {
          const name = metadata.name?.toLocaleLowerCase();
          const symbol = metadata.symbol?.toLocaleLowerCase();
          if (name?.includes(NAME) || symbol?.includes(NAME)) {
            // notify
            await bot.sendMessage(
              '@bngok',
              `<strong>NEW LP ADDED</strong>
${metadata.name} (${metadata.symbol})
🪅 CA: <code>${poolState.baseMint.toString()}</code>
📖 Description: ${metadata.description} ${Object.values(metadata.extensions ?? {})?.join(', ')}
📈 <a href="https://dexscreener.com/solana/${id}">DexScreen</a>|📈 <a href="https://solscan.io/token/${poolState.baseMint.toString()}">Token</a>|📈 <a href="https://solscan.io/account/${poolState.owner.toString()}#splTransfers">Dev</a>`,
              {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
              },
            );
          }
        }
      }
    }
  },
  COMMITMENT_LEVEL,
  [
    { dataSize: LIQUIDITY_STATE_LAYOUT_V4.span },
    {
      memcmp: {
        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf('quoteMint'),
        bytes: Token.WSOL.mint.toBase58(),
      },
    },
    {
      memcmp: {
        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf('marketProgramId'),
        bytes: OPENBOOK_PROGRAM_ID.toBase58(),
      },
    },
    {
      memcmp: {
        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf('status'),
        bytes: base58.encode([6, 0, 0, 0, 0, 0, 0, 0]),
      },
    },
  ],
);

async function checkMetaplex(mintAddress: PublicKey, connection: Connection) {
  const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
    return {
      ...token.json,
      decimals: token.mint.decimals,
      renounceable: token.mint.freezeAuthorityAddress === null,
      renounceableMint: token.mint.mintAuthorityAddress === null,
      name: token.name,
      symbol: token.symbol,
      isMutable: token.isMutable,
    };
  }
  return null;
}
