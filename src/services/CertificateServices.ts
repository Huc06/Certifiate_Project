"use client";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const CERTIFICATE_PACKAGE_ID = "0x9f9125fce743acdb7c97562147ad2c4f13e45e2cbbbf56454eeec7a1570dc597";
const CERTIFICATE_MODULE = "quick_mint";
const CERTIFICATE_FN_MINT = "mint";

export function useCertificateMint() {
  const { mutateAsync: signAndExecuteTransaction, isPending, isSuccess, isError, error } = useSignAndExecuteTransaction();

  const mintCertificate = async (studentName: string, imageUrl: string) => {
    if (!CERTIFICATE_PACKAGE_ID || !CERTIFICATE_MODULE) throw new Error("Missing contract info");
    if (!studentName) throw new Error("Missing student name!");
    if (!imageUrl) throw new Error("Missing image URL!");
    
    const tx = new Transaction();
    tx.setGasBudget(100_000_000); // 100M MIST như CLI command
    
    tx.moveCall({
      target: `${CERTIFICATE_PACKAGE_ID}::${CERTIFICATE_MODULE}::${CERTIFICATE_FN_MINT}`,
      arguments: [
        tx.pure.string(studentName),
        tx.pure.string(imageUrl)
      ]
    });
    
    return signAndExecuteTransaction({ transaction: tx });
  };

  return { mintCertificate, isPending, isSuccess, isError, error };
}
