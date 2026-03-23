import React, { useState } from "react"
import projects from "../../data/projects.json"
import ProjectCard from "./_ProjectCard"

const DOMAIN_ORDER = ["All", "Front-end", "Full-stack", "AI", "Art-Tech"]

export default function ProjectGrid() {
  const [selectedTag, setSelectedTag] = useState("All")

  const filteredProjects =
    selectedTag === "All"
      ? projects
      : projects.filter(project =>
          (project.domainTags || []).includes(selectedTag)
        )

  if (!projects.length) {
    return null
  }

  return (
    <section
      id="projects"
      className="py-8 md:py-16 pt-[100px] md:pt-[200px] pb-[50px] md:pb-[100px]"
    >
      <h2 className="text-[40px] md:text-[80px] font-bold text-center mb-4 font-paperozi text-stroke pb-4 max-w-fit mx-auto px-4 border-none">
        All Projects
      </h2>

      <div className="max-w-7xl mx-auto px-4">
        {/* 태그 필터 */}
        <div className="flex gap-2 md:gap-3 justify-center mb-6 md:mb-12 flex-wrap">
          {DOMAIN_ORDER.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-white text-[#252525]"
                  : "bg-[#2A2A2A] text-[#CFCFCF] border border-white/10 hover:border-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 3x3 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No projects found for this category.
          </p>
        )}
      </div>
    </section>
  )
}
