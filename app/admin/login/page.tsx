import { loginAdmin } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { error } = await searchParams;

  const cream = "#EDE8D5";
  const brown = "#3D1A08";
  const creamDark = "#D4C9A8";
  const creamLight = "#F8F4EA";
  const brownMid = "#6B3A1F";

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "var(--font-dm-sans, system-ui)",
        color: brown,
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: "2rem",
              fontWeight: 700,
              margin: "0 0 0.375rem",
            }}
          >
            nayanami
          </h1>
          <p style={{ color: "#8B7355", fontSize: "0.8125rem", margin: 0 }}>
            Admin access
          </p>
        </div>

        <form action={loginAdmin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              placeholder="Enter admin password"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: `1.5px solid ${error ? "#c0392b" : creamDark}`,
                borderRadius: "0.75rem",
                fontSize: "0.9375rem",
                backgroundColor: creamLight,
                color: brown,
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ color: "#c0392b", fontSize: "0.8125rem", marginTop: "0.375rem" }}>
                Incorrect password.
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: brown,
              color: cream,
              border: "none",
              borderRadius: "0.875rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
