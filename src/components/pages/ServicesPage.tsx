"use client"

import { Code, Cloud, Network, Shield, Palette, CheckCircle, ArrowRight, Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ServicesPage() {
  const services = [
    {
      icon: <Code className="h-12 w-12" />,
      title: "Web & Mobile App Development",
      description:
        "Custom websites and applications using React, Node.js, Next.js, and more. We create dynamic, responsive, animated user interfaces leveraging Three.js and Framer Motion that deliver seamless user experiences.",
      features: [
        "Responsive web applications",
        "Mobile-first design approach",
        "Interactive 3D interfaces",
        "Performance optimization",
        "SEO-friendly architecture",
      ],
      src:"/services images/web.png",
      benefits: "Faster time-to-market, enhanced user engagement, and scalable solutions that grow with your business.",
    },
    {
      icon: <Cloud className="h-12 w-12" />,
      title: "Cloud & DevOps Solutions",
      description:
        "Design and deployment of scalable cloud architectures on AWS/Azure/GCP. We implement CI/CD pipelines, containerization (Docker/Kubernetes), and automation (Ansible, Terraform) for reliability and speed.",
      features: [
        "Cloud architecture design",
        "CI/CD pipeline setup",
        "Container orchestration",
        "Infrastructure as Code",
        "Monitoring and logging",
      ],
      src:"/services images/cloud.png",
      benefits:
        "Reduced operational costs, improved scalability, and automated deployment processes that ensure 99.9% uptime.",
    },
    {
      icon: <Network className="h-12 w-12" />,
      title: "Virtualization & VMware Management",
      description:
        "Virtual infrastructure planning and management. We help organizations consolidate servers, optimize resources, and ensure business continuity through advanced virtualization solutions.",
      features: [
        "VMware vSphere setup",
        "Virtual machine optimization",
        "Cloud migration strategies",
        "Disaster recovery planning",
        "Resource management",
      ],
      src:"/services images/vmware.png",
      benefits:
        "Server consolidation savings of up to 70%, improved resource utilization, and enhanced business continuity.",
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Network & Infrastructure Security",
      description:
        "Network design, configuration, and security implementation. We cover secure LAN/WAN setup, firewalls, VPNs, and ensure robust connectivity for your organization.",
      features: [
        "Network architecture design",
        "Firewall configuration",
        "VPN implementation",
        "Security auditing",
        "Performance monitoring",
      ],
      src:"/services images/network.png",
      benefits: "Enhanced security posture, improved network performance, and compliance with industry standards.",
    },
    {
      icon: <Palette className="h-12 w-12" />,
      title: "3D/Interactive Web Experiences",
      description:
        "Specialized service highlighting Three.js/WebGL projects. We create interactive 3D graphics, data visualizations, and gamified interfaces that captivate and engage users.",
      features: [
        "3D web applications",
        "Interactive data visualization",
        "WebGL optimization",
        "AR/VR integration",
        "Custom animations",
      ],
      src:"/services images/3d.png",
      benefits: "Increased user engagement by 300%, memorable brand experiences, and competitive differentiation.",
    },
     {
      icon: <Brain className="h-12 w-12" />,
      title: "Data Science & AI Solutions",
      description:
        "Leveraging data to drive business insights and AI solutions. We specialize in predictive analytics, machine learning models, and data visualization techniques.",
      features: [
        "Predictive analytics",
        "Machine learning model development",
        "Data visualization techniques",
      ],
      src:"/services images/ai.png",
      benefits: "Data-driven decision making, improved operational efficiency, and innovative AI-powered solutions.",
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            At TechCraft Solutions, we specialize in transforming your vision into reality using cutting-edge web, app,
            and cloud technologies. Our services tackle your biggest challenges with creative, future-ready solutions.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <Card className="h-full">
                    <div className="text-cyan-400 mb-6">{service.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 text-white">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300">
                            <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2 text-cyan-400">Benefits:</h4>
                      <p className="text-gray-300">{service.benefits}</p>
                    </div>
                  </Card>
                </div>

                <div className="flex-1">
                  <div className="relative">
                    <img
                      src={service.src}
                      alt={service.title}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Get a Custom Quote</h2>
              <p className="text-gray-300">Tell us about your project and we'll provide a detailed proposal</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Services Needed</label>
                <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent">
                  <option>Select a service</option>
                  <option>Web & Mobile Development</option>
                  <option>Cloud & DevOps</option>
                  <option>Virtualization & VMware</option>
                  <option>Network & Security</option>
                  <option>3D Interactive Design</option>
                  <option>Multiple Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Details</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Tell us about your project requirements, timeline, and goals..."
                ></textarea>
              </div>

              <div className="text-center">
                <Button type="submit" size="lg">
                  Request Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Project?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Let's discuss how we can bring your vision to life with our expertise and innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Contact Us
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
