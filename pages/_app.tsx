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
export const P22SneakyFont = localFont({
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
