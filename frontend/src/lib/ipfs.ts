export async function pinToIPFS(contentUrl: string): Promise<string> {
  try {
    // Generate deterministic IPFS CID placeholder for demo preservation
    const hashStr = Array.from(contentUrl).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 0);
    return `bafybeig${hashStr.toString(36)}fauxpreserve`;
  } catch {
    return '';
  }
}
