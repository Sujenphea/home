import { IconX } from "@tabler/icons"
import { animate } from "framer-motion"
import Link from "next/link"
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react"
import { brandColor, maxPageWidth, pageSidePadding } from "../src/constants/uiConstants"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
const timelineItems: {
  id: number
  role: string
  company: string
  description: string[]
  startDate: string
  endDate: string
}[] = [
  {
    id: 0,
    role: "Bachelor's degree, Computer Science",
    company: "University of Auckland",
    description: [],
    startDate: "June 2020",
    endDate: "December 2022",
  },
  {
    id: 1,
    role: "Developer",
    company: "Umajin Inc.",
    description: [
      "Developed features for the in-house mobile application design and deployment app.",
      "Co-developed a software platform using the in-house software language.",
    ],
    startDate: "November 2021",
    endDate: "June 2022",
  },
  {
    id: 2,
    role: "Freelance",
    company: "Web development",
    description: ["Collaborated closely with UI/UX designers to develop interactive websites for clients."],
    startDate: "October 2022",
    endDate: "Current",
  },
]

/**
 * skillLevel in percentage
 */
const technologyItems: {
  id: number
  name: string
  skillLevel: number
}[] = [
  { id: 0, name: "NextJS", skillLevel: 1 },
  { id: 1, name: "Typescript", skillLevel: 1 },
  { id: 2, name: "ThreeJS", skillLevel: 0.9 },
  { id: 3, name: "Python", skillLevel: 0.9 },
  { id: 4, name: "Swift", skillLevel: 0.8 },
]

/* -------------------------------------------------------------------------- */
/*                                 components                                 */
/* -------------------------------------------------------------------------- */
const FullPageDisplay = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { children, className, ...rest } = props

  return (
    <div
      className="flex h-screen w-full justify-center overflow-auto"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        className={`relative w-full ${className}`}
        style={{
          maxWidth: maxPageWidth,
          paddingLeft: pageSidePadding,
          paddingRight: pageSidePadding,
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        {children}
      </div>
    </div>
  )
}

const AnimatedLine = (props: { filledPercentage?: number; currentFill?: number }) => {
  return (
    <div
      className="h-[2px] w-full"
      style={{
        backgroundImage: `linear-gradient(to right, ${brandColor} ${
          ((props.filledPercentage || 1) / 2) * 100
        }%, white ${((props.filledPercentage || 1) / 2 + 0.001) * 100}%)`,
        backgroundSize: "200% 100%",
        backgroundPosition: `${props.currentFill || 0}% 0%`,
      }}
    />
  )
}

const Skills = () => {
  const [gradientXPosition, setGradientXPosition] = useState(100)

  /* --------------------------------- effects -------------------------------- */
  // animate from 100 to 0
  useEffect(() => {
    animate(100, 0, {
      duration: 1,
      delay: 0.5,
      onUpdate: (latest) => setGradientXPosition(latest),
    })
  }, [])

  return (
    <div>
      {/* technologies */}
      <div>
        {/* title */}
        <div className="flex items-center gap-5">
          <div className="h-px w-full bg-slate-500" />
          <div>Technologies</div>
          <div className="h-px w-full bg-slate-500" />
        </div>

        {/* content */}
        <div className="mt-8">
          <div className="flex flex-col gap-7">
            {technologyItems.map((item) => {
              return (
                <div key={`technologies ${item.id}`}>
                  {/* title */}
                  <div className="text-sm font-medium uppercase">{item.name}</div>

                  {/* non interactive slider */}
                  <div className="mt-3">
                    <AnimatedLine filledPercentage={item.skillLevel} currentFill={gradientXPosition} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
export default function About() {
  /* -------------------------------- displays -------------------------------- */
  const timelineDisplay = () => {
    return (
      <div className="relative">
        {/* decoration  */}
        <div className="absolute top-0 flex -translate-y-full flex-col">
          {/* content */}
          <div className="relative -translate-x-1/2">
            {/* circle */}
            <svg viewBox="2 3 27 36" className="w-6 rotate-180">
              <path
                className="fill-slate-300"
                strokeWidth="3"
                d="M15 3 Q16.5 6.8 25 18 A12.8 12.8 0 1 1 5 18 Q13.5 6.8 15 3z"
              />
            </svg>
          </div>

          {/* vertical line */}
          <div className="relative h-12 w-px border-l border-slate-300" />
        </div>

        {/* content */}
        {timelineItems.reverse().map((item) => {
          return (
            <div key={`timline ${item.id}`} className="border-l border-slate-300">
              {/* date */}
              <div className="flex items-center gap-5">
                {/* ball */}
                <div className="relative left-[-6px] h-3 w-3 rounded-full bg-slate-500 " />

                {/* date */}
                <div className="flex gap-2 text-sm uppercase opacity-75">
                  <div>{item.startDate}</div>
                  <div>-</div>
                  <div>{item.endDate}</div>
                </div>
              </div>

              {/* content */}
              <div className="pt-2 pb-10 pl-16">
                {/* role */}
                <div className="text-lg font-medium uppercase">{item.role}</div>

                {/* company */}
                {item.company.length > 0 && (
                  <div className="mt-1">
                    <div className="text-sm opacity-75">{item.company}</div>
                  </div>
                )}

                {/* description */}
                <div className="mt-3 max-w-[80%] font-light">
                  {item.description.length > 1
                    ? // bulletpoint
                      item.description.map((bulletpoint, id) => {
                        return (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={`timeline ${item.id}, ${id}`}
                            className="relative flex gap-2"
                          >
                            {/* bullet */}
                            <div>•</div>

                            {/* text */}
                            <div>{bulletpoint}</div>
                          </div>
                        )
                      })
                    : // paragraph
                      item.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <FullPageDisplay className="z-[0]">
      {/* button */}
      <div className="fixed left-1/2 top-4 z-[1] h-14 w-14 -translate-x-1/2">
        <div className="flex h-full items-center justify-center rounded-full bg-slate-50 bg-opacity-70 duration-300 ease-in-out hover:scale-90">
          <Link href="/">
            <IconX className="h-5 w-5 text-slate-500" />
          </Link>
        </div>
      </div>

      {/* heading */}
      <div className="mt-24">
        <div className="text-center text-[34px] font-bold uppercase">Resume</div>
      </div>

      {/* content */}
      <div className="mt-16 mb-10">
        <div className="grid gap-20 pt-16 md:grid-cols-[60%_40%] md:gap-0">
          {/* left */}
          <div>{timelineDisplay()}</div>

          {/* right */}
          <div>
            <Skills />
          </div>
        </div>
      </div>
    </FullPageDisplay>
  )
}
