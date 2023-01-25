import { IconX } from "@tabler/icons"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { brandColor, maxPageWidth, pageSidePadding } from "../src/constants/uiConstants"

/* -------------------------------------------------------------------------- */
/*                                  constants                                 */
/* -------------------------------------------------------------------------- */
const timelineItems: {
  id: number
  role: string
  company: string
  description: string
  startDate: string
  endDate: string
}[] = [
  {
    id: 0,
    role: "test",
    company: "test",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis maximus vel metus ac vestibulum. Suspendisse a dolor diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ut egestas ante. Pellentesque ultricies neque quis condimentum dictum",
    startDate: "test",
    endDate: "test",
  },
  {
    id: 1,
    role: "test",
    company: "test",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis maximus vel metus ac vestibulum. Suspendisse a dolor diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ut egestas ante. Pellentesque ultricies neque quis condimentum dictum",
    startDate: "test",
    endDate: "test",
  },
  {
    id: 2,
    role: "test",
    company: "test",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis maximus vel metus ac vestibulum. Suspendisse a dolor diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ut egestas ante. Pellentesque ultricies neque quis condimentum dictum",
    startDate: "test",
    endDate: "test",
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
  { id: 0, name: "React", skillLevel: 1 },
  { id: 1, name: "React", skillLevel: 0.9 },
  { id: 2, name: "React", skillLevel: 0.6 },
  { id: 3, name: "React", skillLevel: 0.3 },
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

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
export default function About() {
  /* -------------------------------- displays -------------------------------- */
  const timelineDisplay = () => {
    return (
      <div>
        {/* decoration  */}
        <div className="absolute bottom-0 flex flex-col">
          {/* content */}
          <div className="relative -left-8 flex items-center gap-8">
            {/* circle */}
            <div className="h-16 w-16 rounded-full bg-slate-300" />
          </div>

          {/* vertical line */}
          <div className="relative h-12 w-px border-l border-slate-300" />
        </div>

        {/* content */}
        {timelineItems.map((item) => {
          return (
            <div key={item.id} className="border-l border-slate-300">
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
                <div className="mt-1">
                  <div className="text-sm lowercase opacity-75">{item.company}</div>
                </div>

                {/* description */}
                <div className="mt-3 max-w-[80%]">{item.description}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const skillsDisplay = () => {
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
          <div className="mt-3">
            <div className="flex flex-col gap-7">
              {technologyItems.map((item) => {
                return (
                  <div key={item.id}>
                    {/* title */}
                    <div className="text-sm font-medium uppercase">{item.name}</div>

                    {/* non interactive slider */}
                    <div
                      className="h-[2px] w-full"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${brandColor} ${item.skillLevel * 100}%, white ${
                          (item.skillLevel + 0.001) * 100
                        }%)`,
                      }}
                    />

                    {/*  */}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------------------------------- main ---------------------------------- */
  return (
    <FullPageDisplay>
      {/* button */}
      <div className="mt-1">
        <div className="flex justify-center">
          <div className="rounded-xl bg-slate-600 p-4">
            <IconX className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* heading */}
      <div className="mt-10">
        <div className="text-center text-4xl font-bold">Resume</div>
      </div>

      {/* content */}
      <div className="mt-32">
        <div className="grid h-20 grid-cols-[60%_40%] pt-16">
          {/* left */}
          <div>{timelineDisplay()}</div>

          {/* right */}
          <div>{skillsDisplay()}</div>
        </div>
      </div>
    </FullPageDisplay>
  )
}
