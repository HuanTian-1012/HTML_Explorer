import type { RouterPathConfig } from "../../core/type";
import style from "./index.module.css";

export default function HomePage({
  routerConfig,
}: {
  routerConfig: RouterPathConfig[];
}) {
  return (
    <div className={style.layout}>
      <ul>
        <li>234234</li>
      </ul>
      <pre>{JSON.stringify(routerConfig, null, 2)}</pre>
    </div>
  );
}
