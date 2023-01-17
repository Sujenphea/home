/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from "next/app"
import Head from "next/head"
import { ReactNode } from "react"
import "../styles/globals.css"

// eslint-disable-next-line camelcase
import { Inter } from "@next/font/google"
import { Cursor } from "../src/components/Cursor"

/* -------------------------------------------------------------------------- */
/*                                    fonts                                   */
/* -------------------------------------------------------------------------- */
export const interFont = Inter({
  weight: "variable",
  subsets: ["latin", "latin-ext"],
  variable: "--inter",
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
