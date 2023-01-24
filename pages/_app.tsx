/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from "next/app"
import Head from "next/head"
import { ReactNode } from "react"
import "../styles/globals.css"

// eslint-disable-next-line camelcase
import localFont from "@next/font/local"

import { Cursor } from "../src/components/Cursor"
import { bgColor } from "../src/constants/uiConstants"

/* -------------------------------------------------------------------------- */
/*                                    fonts                                   */
/* -------------------------------------------------------------------------- */
export const guardianSnowingFont = localFont({
  src: [{ path: "../public/fonts/GuardianSnowing.ttf", weight: "400" }],
  variable: "--guardian-snowing",
  display: "swap",
})

export const azoSansFont = localFont({
  src: [
    { path: "../public/fonts/AzoSans-Thin.woff2", weight: "100" },
    { path: "../public/fonts/AzoSans-Light.woff2", weight: "300" },
    { path: "../public/fonts/AzoSans-Regular.woff2", weight: "400" },
    { path: "../public/fonts/AzoSans-Medium.woff2", weight: "500" },
  ],
  variable: "--azo-sans",
  display: "swap",
})

/* -------------------------------------------------------------------------- */
/*                                   layout                                   */
/* -------------------------------------------------------------------------- */
const Layout = (props: { children?: ReactNode | ReactNode[] }) => {
  /* ---------------------------------- main ---------------------------------- */
  return (
    <>
      {/* header */}
      <Head>
        <title>Sujen Phea</title>
        <meta name="theme-color" content={bgColor} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {/* children */}
      <main>{props.children}</main>

      {/* cursor */}
      <div className="hidden md:block">
        <Cursor />
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                     app                                    */
/* -------------------------------------------------------------------------- */
export default function MyApp(props: AppProps) {
  return (
    <Layout>
      {/* main */}
      <props.Component {...props.pageProps} />
    </Layout>
  )
}
