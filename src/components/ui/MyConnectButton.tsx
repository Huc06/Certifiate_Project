import { ConnectButton, useCurrentAccount, useDisconnectWallet, useSuiClient } from "@mysten/dapp-kit";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";

function shortAddr(addr: string) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

export function MyConnectButton() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const disconnect = useDisconnectWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (account) {
        const b = await suiClient.getBalance({ owner: account.address, coinType: "0x2::sui::SUI" });
        setBalance(
          (Number(b.totalBalance) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 }) + " SUI"
        );
      } else {
        setBalance(null);
      }
    }
    fetchBalance();
  }, [account, suiClient]);

  async function handleCopy() {
    if (!account?.address) return;
    await navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  }

  if (!account) return <ConnectButton connectText="Connect Wallet" />;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="h-9 flex items-center px-3 border border-teal-500/35 rounded-full bg-black/70 hover:bg-black/90 gap-2 shadow transition"
          type="button"
        >
          <span className="font-mono text-xs text-teal-100 truncate max-w-[84px]">{shortAddr(account.address)}</span>
          <svg width="16" height="16" className="text-teal-200" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-60 p-4 bg-black/90 border border-teal-600/40 rounded-2xl shadow-xl flex flex-col gap-3 z-50"
      >
        {/* 1. Copy address row */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-between rounded-lg font-mono text-xs text-white px-4 py-2 bg-black/60 hover:bg-teal-700/30 border border-teal-700/30 hover:border-teal-400 transition group"
          title="Copy address"
          type="button"
        >
          <span>{shortAddr(account.address)}</span>
          <span className="ml-3 text-sm text-teal-400 group-hover:text-white">{copied ? "Copied!" : "Copy"}</span>
        </button>
        {/* 2. Balance */}
        <div className="w-full text-center bg-black/60 rounded-lg px-4 py-2 text-sm font-semibold text-teal-300 border border-teal-700/40">
          Balance: {balance ? balance : "—"}
        </div>
        {/* 3. Disconnect row */}
        <button
          type="button"
          onClick={() => disconnect.mutate()}
          className="w-full transition bg-gradient-to-r from-orange-600/90 to-rose-500/90 hover:from-red-700/80 hover:to-red-500/80 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg text-sm"
        >
          Disconnect
        </button>
      </PopoverContent>
    </Popover>
  );
}
