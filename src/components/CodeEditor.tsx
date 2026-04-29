import { Sandpack } from "@codesandbox/sandpack-react";
export default function CodeEditor({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const code = {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Card</title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    ${html}
</body>
</html>`,
    "index.css": `${css}`,
    "index.js": `${js || 'console.log("Ciallo");'}`,
  };
  return <Sandpack theme="auto" template="static" files={code} />;
}
