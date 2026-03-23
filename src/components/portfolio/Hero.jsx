import React, { useState, useEffect } from "react"
import myImage from "../../images/hero/inyoung.png"
import GhostCursor from "../animation/GhostCursor"

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3)) 
                    drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)) 
                    drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));
            opacity: 1;
          }
        }
        
        .twinkle-effect {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
      <section
        id="hero"
        className="relative overflow-hidden w-full h-[calc(100vh_-_53px)]"
      >
        <h1 className="absolute top-[10px] left-[10px] text-[24px] md:text-[5vw] text-white">
          소프트웨어 개발자, 정인영입니다.{" "}
        </h1>

        <h1 className="text-[16px] md:text-[3vw] text-white absolute bottom-[20px] left-[10px] md:left-auto md:right-[10px]">
          Learning By Sharing
        </h1>
        <div
          className="hidden md:block"
          style={{
            width: "50%",
            height: "300px",
            position: "absolute",
            top: "200px",
            right: 0,
          }}
        >
          <GhostCursor
            // Visuals
            className={"h-full"}
            color="#000000"
            brightness={6}
            edgeIntensity={0}
            // Trail and motion
            trailLength={100}
            inertia={0.5}
            // Post-processing
            grainIntensity={0.05}
            bloomStrength={0.3}
            bloomRadius={1.0}
            bloomThreshold={0.025}
            // Fade-out behavior
            fadeDelayMs={1000}
            fadeDurationMs={1500}
          />

          {/* 내 숨겨진 기능 */}
          <div className="absolute top-[30px] left-[30px] ">
            <p className="text-[#1e1e1d] text-[21px] font-semibold mb-[20px]">
              마우스를 올리면 보이는 저의 또 다른 면
            </p>
            <p className="text-[#1e1e1d] text-[20px]">
              전공 프로젝트·대외활동에서의 프론트/백엔드/앱/AI 개발 협업 경험
            </p>
            <p className="text-[#1e1e1d] text-[20px]">
              1년간 2회의 개발 인턴 수행
            </p>
            <p className="text-[#1e1e1d] text-[20px]">
              기술 글쓰기를 통한 CS 기초 다지기
            </p>
            <p className="text-[#1e1e1d] text-[20px]">
              AI 개발 도구를 빠르게 익히고 활용하는 습관
            </p>
          </div>
        </div>
        <div
          className={`absolute bottom-[100px] left-[10px] w-[250px] h-[250px] md:w-[500px] md:h-[500px] z-10 bg-[#1e1e1d] transition-transform duration-1000 ease-out ${
            isMounted ? "translate-y-full" : "translate-y-0"
          }`}
        ></div>
        <img
          src={myImage}
          alt="myImage"
          className="absolute bottom-[100px] left-[10px] w-[350px] md:w-[500px] twinkle-effect"
        />
      </section>
    </>
  )
}
