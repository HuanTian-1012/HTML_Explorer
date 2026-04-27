import Code from "../../../components/Code/Code";

export default function DivDocument() {
  return (
    <>
      <h1>{"`<div>` 元素介绍"}</h1>
      <h2>{"什么是 `<div>`？"}</h2>
      <br />
      <p>{"`<div>` 元素用于定义一个 HTML 块级元素。"}</p>
      <Code html="<div>123</div>" />
    </>
  );
}
