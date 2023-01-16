/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from "next/app"
import Head from "next/head"
import { ReactNode } from "react"
import "../styles/globals.css"

// eslint-disable-next-line camelcase
import { Oxygen } from "@next/font/google"
import localFont from "@next/font/local"

/* -------------------------------------------------------------------------- */
/*                                    fonts                                   */
/* -------------------------------------------------------------------------- */
export const ligurinoFont = localFont({
  /// rmeove
  src: "../public/fonts/LigurinoRegular.ttf",
  variable: "--ligurino",
  display: "swap",
})

export const roughLoveFont = localFont({
  // maybe
  src: "../public/fonts/RoughLove.otf",
  variable: "--rough-love",
  display: "swap",
})

export const filmotypeLuckyFont = localFont({
  // maybe
  src: "../public/fonts/FilmotypeLucky.ttf",
  variable: "--filmotype-lucky",
  display: "swap",
})

export const P22SneakyFont = localFont({
  // maybe
  src: "../public/fonts/p22Sneaky.ttf",
  variable: "--p22-sneaky",
  display: "swap",
})

export const oxygenFont = Oxygen({
  weight: ["300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--oxygen",
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
        <title>Sujenphea</title>
      </Head>

      {/* children */}
      <main>{props.children}</main>
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
