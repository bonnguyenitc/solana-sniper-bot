import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import wallets from './whales.json';
import TelegramBot from 'node-telegram-bot-api';
import { Metaplex } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const RPC_WEBSOCKET_ENDPOINT = 'wss://api.mainnet-beta.solana.com';

// const bot = new TelegramBot('7046876390:AAEl_46sTUwninrNg-tj56ojFj52omDYfdw', { polling: true });
const bot = new TelegramBot('6496482594:AAF0DiqmkuewnnYKFMsxLEZZJPi1Fs9Mous', { polling: true });

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

const metaplex = Metaplex.make(solanaConnection);

const sent = new Set<string>();

const listMintExclude = [
  'So11111111111111111111111111111111111111112',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
];

function trackingAlpha(wallet: PublicKey) {
  const id = solanaConnection.onProgramAccountChange(
    TOKEN_PROGRAM_ID,
    async (updatedAccountInfo) => {
      const accountData = AccountLayout.decode(updatedAccountInfo.accountInfo!.data);
      const token = accountData.mint.toString();
      let amount = Number(accountData.amount.toString());

      if (listMintExclude.includes(token) || amount <= 100) {
        return;
      }

      const metadata: any = await checkMetaplex(new PublicKey(token), solanaConnection);

      if (metadata) {
        amount = amount / Math.pow(10, metadata.decimals ?? 0);
        if (amount <= 5000) {
          return;
        }
        if (sent.has(`${token}-${wallet.toString()}`)) {
          return;
        }
        // notify
        sent.add(`${token}-${wallet.toString()}`);
        // console.log(`Alpha detected: ${wallet.toString()}-${token}`);
        try {
          await bot.sendMessage(
            '@bngok',
            `💡Alpha wallet: <code>${wallet.toString()}</code>
<a href="https://solscan.io/account/${wallet.toString()}#splTransfers">Check</a>
${metadata.name} (${metadata.symbol})
🪅 CA: <code>${token}</code>
👤 Renounced: ${metadata.renounceable ? '✅' : '❌'}
📖 Description: ${metadata.description} ${Object.values(metadata.extensions ?? {})?.join(', ')}
📈 <a href="https://solscan.io/token/${token}">SolScan</a>
Bought: <code>${formatter.format(amount)}</code> ${metadata.symbol}`,
            {
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            },
          );
        } catch (error) {
          console.log("Can't send message", error);
        }
      }
    },
    'finalized',
    [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: wallet.toBase58(),
        },
      },
    ],
  );

  console.info(`${id} ===> Listening for wallet changes: ${wallet.toString()}`);
}

wallets.list.slice(50).forEach((wallet) => {
  trackingAlpha(new PublicKey(wallet));
});

async function checkBalance() {
  const list = [];
  for (const addr of wallets.list) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const balanceOfOwner = await solanaConnection.getBalance(new PublicKey(addr));
    const balance = balanceOfOwner / 1000000000;
    if (balance > 1) {
      list.push(addr);
    }
  }
  console.log(JSON.stringify(list, null, 2));
}

async function checkMetaplex(mintAddress: PublicKey, connection: Connection) {
  const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
    return {
      ...token.json,
      decimals: token.mint.decimals,
      renounceable: token.mint.freezeAuthorityAddress === null,
      mint: token.mint.mintAuthorityAddress === null,
      name: token.name,
      symbol: token.symbol,
      isMutable: token.isMutable,
    };
  }
  return null;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
