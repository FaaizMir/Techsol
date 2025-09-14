"use client"

import { Award, Code, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Button from "@/components/common/Button"
import Card from "@/components/common/Card"

export default function AboutPage() {
  const skills = [
    "React & Next.js",
    "Node.js & Express",
    "Three.js & WebGL",
    "AWS & Azure",
    "Docker & Kubernetes",
    "VMware vSphere",
    "Network Security",
    "DevOps & CI/CD",
  ]

  const values = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation First",
      description:
        "We believe the future of digital is interactive — every site should be a dynamic experience that captivates and engages users.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client Partnership",
      description:
        "We work as an extension of your team, understanding your goals and delivering solutions that exceed expectations.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence Driven",
      description:
        "Every project is a testament to our passion for innovation and delivering results that make a real impact.",
    },
  ]

  const timeline = [
    {
      year: "2021",
      title: "Foundation",
      description: "Started TechCraft Solutions with a vision to blend cutting-edge technology with creative design",
    },
    {
      year: "2022",
      title: "Growth",
      description: "Expanded services to include cloud architecture and 3D web experiences, serving 50+ clients",
    },
    {
      year: "2023",
      title: "Innovation",
      description: "Pioneered interactive 3D solutions and advanced virtualization services for enterprise clients",
    },
    {
      year: "2024",
      title: "Excellence",
      description: "Recognized as a leading digital solutions provider with 100+ successful projects delivered",
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                About TechCraft Solutions
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Hello! I'm the founder of TechCraft Solutions. For the past 3 years, I've helped businesses innovate by
                blending development, cloud, and networking expertise with stunning interactive design.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                With a passion for the future of web technology, I combine React, Three.js, and cloud architecture to
                build immersive web experiences that go beyond traditional websites.
              </p>
              <Link href="/contact">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Let's Work Together
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="/about images/aboutimg.png"
                alt="About TechCraft Solutions"
                className="w-full h-98 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Core Values</h2>
            <p className="text-lg text-gray-300">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <div className="text-cyan-400 mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Skills & Expertise</h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                A career that spans startups to enterprises, mastering web applications, cloud services, and
                virtualization. I bring deep technical knowledge combined with creative vision to every project.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card>
                <div className="text-center">
                  <Code className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">3+ Years Experience</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-cyan-400">100+</div>
                      <div className="text-gray-300">Projects Delivered</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400">50+</div>
                      <div className="text-gray-300">Happy Clients</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Journey</h2>
            <p className="text-lg text-gray-300">The evolution of TechCraft Solutions</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card>
                      <div className="text-2xl font-bold text-cyan-400 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </Card>
                  </div>

                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full border-4 border-gray-900"></div>
                  </div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal Touch */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Beyond the Code</h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            When I'm not coding, I'm exploring AR/VR technologies, contributing to open-source animation libraries, and
            staying at the forefront of emerging web technologies. I believe in continuous learning and pushing the
            boundaries of what's possible in digital experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
              <p className="text-gray-300">Always exploring new technologies and creative solutions</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-white mb-2">Creativity</h3>
              <p className="text-gray-300">Blending technical expertise with artistic vision</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Collaboration</h3>
              <p className="text-gray-300">Building lasting partnerships with clients and community</p>
            </Card>
          </div>

          <Link href="/contact">
            <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
              Let's Build Something Together
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
