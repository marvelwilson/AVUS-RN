export function emailToUsername(email: string): string {
  const name = email.split("@")[0];

  return (
    name.charAt(0).toUpperCase() +
    name.slice(1, 6) +
    "..."
  );
}