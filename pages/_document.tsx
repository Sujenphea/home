import { Head, Html, Main, NextScript } from "next/document"
import { azoSansFont, guardianSnowingFont } from "./_app"

export default function Document() {
  return (
    <Html lang="en" className={`${guardianSnowingFont.variable} ${azoSansFont.variable}`}>
      <Head />
      <body className="bg-bgColor text-contentColor">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
