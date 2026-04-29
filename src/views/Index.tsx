import { useEffect, useState } from "react";

import "./Index.css";
import initCore from "../core/init";

export default function Index() {
  const [value, setValue] = useState<Awaited<ReturnType<typeof initCore>> | null>(
    null,
  );

  useEffect(() => {
    async function loadCore() {
      const result = await initCore();
      setValue(result);
    }

    void loadCore();
  }, []);

  if (!value) {
    return <div>加载中...</div>;
  }

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
