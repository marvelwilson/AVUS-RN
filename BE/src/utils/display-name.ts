export function emailToDisplayName(
  email: string
): string {
  const name = email
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "");

  if (!name) {
    return "User";
  }

  return (
    name.charAt(0).toUpperCase() +
    name.slice(1, 6) +
    "..."
  );
}