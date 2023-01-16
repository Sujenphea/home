import { Head, Html, Main, NextScript } from "next/document"
import { interFont, P22SneakyFont } from "./_app"

export default function Document() {
  return (
    <Html lang="en" className={`${P22SneakyFont.variable} ${interFont.variable}`}>
      <Head />
      <body className="bg-bgColor text-contentColor">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
