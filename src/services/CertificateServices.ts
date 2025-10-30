"use client";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const CERTIFICATE_PACKAGE_ID = "0xa2a8861aec08b64942cb182a7ec48dc0d43df3a0c65e9b9e0fd3b328fad5994f";
const CERTIFICATE_MODULE = "quick_mint";
const CERTIFICATE_FN_MINT = "mint";

export function useCertificateMint() {
  const { mutateAsync: signAndExecuteTransaction, isPending, isSuccess, isError, error } = useSignAndExecuteTransaction();

  const mintCertificate = async (studentName: string) => {
    if (!CERTIFICATE_PACKAGE_ID || !CERTIFICATE_MODULE) throw new Error("Missing contract info");
    if (!studentName) throw new Error("Missing student name!");
    const tx = new Transaction();
    tx.setGasBudget(3_000_000); // Vừa đủ, có thể tăng nếu network báo thiếu
    tx.moveCall({
      target: `${CERTIFICATE_PACKAGE_ID}::${CERTIFICATE_MODULE}::${CERTIFICATE_FN_MINT}`,
      arguments: [tx.pure.string(studentName)]
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  return { mintCertificate, isPending, isSuccess, isError, error };
}
