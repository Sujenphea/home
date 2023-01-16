import { Head, Html, Main, NextScript } from "next/document"
import { filmotypeLuckyFont, oxygenFont, P22SneakyFont, roughLoveFont } from "./_app"

export default function Document() {
  return (
    <Html
      lang="en"
      className={`${P22SneakyFont.variable} ${roughLoveFont.variable} ${filmotypeLuckyFont.variable} ${oxygenFont.variable}`}
    >
      <Head />
      <body className="bg-bgColor text-contentColor">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
