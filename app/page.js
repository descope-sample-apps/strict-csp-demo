import { AuthProvider, SignUpOrInFlow } from "@descope/nextjs-sdk";
import { headers } from "next/headers";

export default function Page() {
  const nonce = headers().get("x-nonce");
  const projectId = headers().get("x-project-id");
  const baseUrl = headers().get("x-base-url");
  return (
    <AuthProvider
      projectId={projectId}
      baseUrl={baseUrl}
      baseStaticUrl={baseUrl + "/pages"}
    >
      <pre>
        Nonce: {nonce}
        <br />
        ProjectID: {projectId}
        <br />
        BaseURL: {baseUrl}
        <br />
        Set URL params to change the project ID and base URL.
      </pre>
      <SignUpOrInFlow />
    </AuthProvider>
  );
}
