"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { GraduationCap, BarChart3, Rocket, ChevronDown } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center justify-between p-6 sm:p-12 relative">
      {/* Hero Section - Simplified initially */}
      <section className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 py-12">
        {/* Text Content */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Discover Your <span className="text-blue-600">Future</span> with EduPath
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Get personalized insights into careers and courses based on your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Sign Up
            </button>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/hero-image.svg"
            alt="EduPath Hero Illustration"
            width={600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </section>

      {/* Scroll Down Indicator - Enhanced with interaction */}
      <motion.div
        className="cursor-pointer flex flex-col items-center gap-2 mt-4 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          setShowDetails(true);
          const detailsSection = document.getElementById('details-section');
          if (detailsSection) {
            detailsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <p className="text-blue-600 font-medium">Learn More</p>
        <ChevronDown className="w-6 h-6 text-blue-600" />
      </motion.div>

      {/* Additional Details - Only shown after scrolling or clicking "Learn More" */}
      <motion.section
        id="details-section"
        className="w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={showDetails ? { opacity: 1 } : {}}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mt-8 mb-16">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Empowering students to make smarter decisions for tomorrow with real-time insights on salaries, job vacancies, and course pathways.
          </p>
        </div>

        {/* Subtle Divider */}
        <div className="w-full border-t border-gray-100"></div>

        {/* Why EduPath Section - Staggered animation */}
        <div className="mt-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why EduPath?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed with students in mind, our platform provides critical insights to help you choose the right educational and career path.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Benefit Card 1 */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition text-left"
              variants={itemVariants}
            >
              <GraduationCap className="text-blue-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Empower Your Decision-Making</h3>
              <p className="text-gray-600">
                Discover detailed data on course pathways and career outcomes so you can plan your future confidently.
              </p>
            </motion.div>

            {/* Benefit Card 2 */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition text-left"
              variants={itemVariants}
            >
              <BarChart3 className="text-blue-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Explore visualizations on median salaries, job vacancies, and employment trends tailored for students.
              </p>
            </motion.div>

            {/* Benefit Card 3 */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition text-left"
              variants={itemVariants}
            >
              <Rocket className="text-blue-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready for Future Upgrades</h3>
              <p className="text-gray-600">
                Our roadmap includes personalized recommendations and advanced filters, ensuring EduPath grows with your needs.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer - Simplified */}
      <footer className="mt-24 text-sm text-gray-400 text-center py-6">
        © {new Date().getFullYear()} EduPath. All rights reserved.
      </footer>
    </main>
  );
}