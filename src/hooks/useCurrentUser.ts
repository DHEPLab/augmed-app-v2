import { useMemo } from "react";
import { getToken } from "../services/api";

interface CurrentUser {
  email: string;
  isAdmin: boolean;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function useCurrentUser(): CurrentUser | null {
  const token = getToken();

  return useMemo(() => {
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    return {
      email: (payload.sub as string) ?? "",
      isAdmin: Boolean(payload.admin_flag),
    };
  }, [token]);
}
