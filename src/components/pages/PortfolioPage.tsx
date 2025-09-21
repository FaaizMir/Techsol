"use client"

// import { Card } from "../components/Card"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with React and Node.js",
      image: "/placeholder.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative project management tool with real-time updates",
      image: "/placeholder.jpg",
      technologies: ["Next.js", "Socket.io", "PostgreSQL", "Tailwind"],
      link: "#"
    },
    {
      id: 3,
      title: "AI Dashboard",
      description: "An analytics dashboard with machine learning insights",
      image: "/placeholder.jpg",
      technologies: ["React", "Python", "TensorFlow", "D3.js"],
      link: "#"
    },
    {
      id: 4,
      title: "Mobile Banking App",
      description: "A secure mobile banking application with biometric authentication",
      image: "/placeholder.jpg",
      technologies: ["React Native", "Node.js", "MongoDB", "JWT"],
      link: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our latest projects and innovative solutions that drive business success
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <div className="p-6">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={project.link}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's collaborate to bring your vision to life with cutting-edge technology
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
