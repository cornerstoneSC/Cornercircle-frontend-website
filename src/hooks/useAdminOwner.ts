"use client";

import { useEffect, useState } from "react";

export default function useAdminOwner() {
  const [owner, setOwner] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((value) => { if (active) setOwner(value?.owner === true); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  return owner;
}
