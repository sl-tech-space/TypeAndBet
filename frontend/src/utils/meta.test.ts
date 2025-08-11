import { createMetadata } from "./meta";

describe("Meta Utils", () => {
  it("createMetadata: メタデータを生成する", async () => {
    const metadata = await createMetadata("テスト", "テスト", "テスト");
    expect(metadata).toBeDefined();
  });
});
