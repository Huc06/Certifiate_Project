export async function uploadImageToPinata(base64Image: string, filename = "certificate.png") {
  // Tách phần base64 (bỏ prefix "data:image/png;base64,")
  const base64Data = base64Image.split(',')[1];
  
  // Decode base64 thành binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Tạo Blob từ binary
  const blob = new Blob([bytes], { type: "image/png" });
  
  // Tạo FormData và append file
  const formData = new FormData();
  formData.append("file", blob, filename);

  // Get JWT from environment variable
  const PINATA_JWT_TOKEN = import.meta.env.VITE_PINATA_JWT;
  
  if (!PINATA_JWT_TOKEN) {
    throw new Error("VITE_PINATA_JWT environment variable is required. Please set it in .env.local file.");
  }
  
  const PINATA_JWT = `Bearer ${PINATA_JWT_TOKEN}`;
  
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: PINATA_JWT
      // KHÔNG thêm Content-Type, fetch tự động set khi dùng FormData
    },
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Pinata upload failed", {
      status: res.status,
      statusText: res.statusText,
      body: errText
    });
    throw new Error("Upload to Pinata failed: " + res.statusText + " | " + errText);
  }
  
  const data = await res.json();
  console.log("Pinata upload success:", data);
  
  return {
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    ipfsHash: data.IpfsHash,
    ...data,
  };
}
