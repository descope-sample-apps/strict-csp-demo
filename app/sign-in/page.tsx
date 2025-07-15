import { SignUpOrInFlow } from "@descope/nextjs-sdk";
import { headers } from "next/headers";

export default async function Home() {
  const hdrs = await headers();
  const nonce = hdrs.get("x-nonce");
  return (
    <SignUpOrInFlow nonce={nonce!} />
  );
}
