import React, { useEffect, useState } from "react"
import roles from "../../data/career.json"

// 이미지 import - 인덱스 순서대로
import careerImage1 from "../../images/career/1.png"
import careerImage2 from "../../images/career/2.png"
import careerImage3 from "../../images/career/3.png"

// 인덱스 기반 이미지 배열
const careerImages = [careerImage1, careerImage2, careerImage3]

const formatPeriod = period => {
  if (!period) return ""
  const { start, end } = period
  return `${start.replace("-", ".")} – ${end.replace("-", ".")}`
}

const useMediaQuery = query => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

export default function Career() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <section id="career" className="py-[100px] md:py-[500px]">
      <h2 className="text-[40px] md:text-[100px] font-bold text-center font-paperozi border-none mb-1 text-stroke">
        Internship
      </h2>

      <div className="relative px-4 flex flex-col items-start w-full mt-[50px] md:mt-[100px] gap-[50px] md:gap-[100px]">
        {/* 계단형 카드들 */}
        {roles.map((role, index) => {
          return (
            <div
              key={role.organization}
              className="relative py-[20px] md:py-[50px] px-[0px] w-full"
              style={{
                paddingLeft: isDesktop ? 5 + index * 30 : 0,
                boxSizing: "content-box",
              }}
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-8 last:pb-0">
                {/* 이미지 섹션 */}
                {careerImages[index] && (
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <img
                      src={careerImages[index]}
                      alt={role.organization}
                      className="w-full md:w-[400px] h-[200px] md:h-[300px] object-cover border-2"
                      style={{
                        borderColor: role.color || "#FFFFFF",
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-0">
                    <h3
                      className="mb-0 border-none mt-0 p-0 text-[24px] md:text-[32px]"
                      style={{
                        color: role.color || "#FFFFFF",
                      }}
                    >
                      {role.organization}
                    </h3>
                    <span
                      className="career-period-badge inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[12px] md:text-[14px]"
                      style={{
                        color: role.color || "#FFFFFF",
                      }}
                    >
                      {formatPeriod(role.period)}
                    </span>
                  </div>

                  <div className="flex items-end gap-4 mt-2 mb-3">
                    <span
                      className="career-position-button inline-flex items-center border-2 font-bold rounded-lg whitespace-nowrap px-2 py-1 text-[12px] md:text-[14px]"
                      style={{
                        color: role.color || "#FFFFFF",
                        borderColor: role.color || "#FFFFFF",
                        boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 2px inset",
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor =
                          role.color || "#FFFFFF"
                      }}
                    >
                      {role.position}
                    </span>

                    {role.retrospectUrl && (
                      <a
                        href={role.retrospectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-end gap-1.5 text-[14px] md:text-[16px] hover:underline font-semibold"
                        style={{ color: role.color || "#FFFFFF" }}
                      >
                        회고록 보기 →
                      </a>
                    )}
                  </div>

                  {role.highlights && role.highlights.length > 0 && (
                    <ul className="space-y-2 mb-0 mt-3 w-full">
                      {role.highlights.map(highlight => (
                        <li
                          key={highlight}
                          className="text-gray-300 flex items-start gap-2 text-[14px] md:text-[16px]"
                        >
                          <span className="text-white font-bold">›</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
