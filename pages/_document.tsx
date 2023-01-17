import { Head, Html, Main, NextScript } from "next/document"
import { interFont } from "./_app"

export default function Document() {
  return (
    <Html lang="en" className={`${interFont.variable}`}>
      <Head />
      <body className="bg-bgColor text-contentColor">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
