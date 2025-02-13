import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function SpanishHistory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-l-4 border-[#AA151B]">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            The Rich History of Spanish
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover the journey of one of the world's most influential languages
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { value: "500M+", label: "Global Speakers", color: "from-[#AA151B]" },
            { value: "#2", label: "Most Spoken Language", color: "from-[#F1BF00]" },
            { value: "75%", label: "Latin Origin Words", color: "from-[#AA151B]" }
          ].map(({ value, label, color }) => (
            <div key={label} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${color} to-transparent bg-clip-text text-transparent`}>
                {value}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Origins Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F1BF00] p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Origins and Evolution</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Spanish evolved from spoken Latin in central-northern Spain during the 8th and 9th centuries. 
                Following the decline of the Roman Empire, this variant of Vulgar Latin developed into what 
                scholars call Old Spanish or Medieval Spanish.
              </p>
              
              <div className="pl-4 border-l-4 border-blue-500 my-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Historical Periods</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">711-1492:</span>
                    Islamic influence introduced many Arabic words (approximately 4,000 words), 
                    particularly in fields of science, agriculture, and architecture.
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">1492:</span>
                    Publication of the first Spanish Grammar book by Antonio de Nebrija, 
                    coinciding with Columbus's voyage and the beginning of Spanish expansion.
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">16th Century:</span>
                    The Spanish Golden Age saw the language standardized and spread throughout 
                    the Americas, becoming the administrative language of a vast empire.
                  </li>
                </ul>
              </div>

              <p>
                Modern Spanish has retained about 75% of its original Latin vocabulary, while 
                incorporating influences from various languages including:
              </p>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="font-semibold dark:text-gray-200">Arabic:</span>
                  <span className="dark:text-gray-300"> alcalde, azúcar, aceite</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="font-semibold dark:text-gray-200">Gothic:</span>
                  <span className="dark:text-gray-300"> guerra, guardar, rico</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="font-semibold dark:text-gray-200">French:</span>
                  <span className="dark:text-gray-300"> jardín, chef, garaje</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="font-semibold dark:text-gray-200">Indigenous American:</span>
                  <span className="dark:text-gray-300"> tomate, chocolate, aguacate</span>
                </div>
              </div>

              <p className="text-sm bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mt-6">
                <span className="font-semibold dark:text-gray-200">Did you know?</span>
                <span className="dark:text-gray-300"> The letter 'ñ' (eñe) was created in 
                  medieval times when scribes placed a small 'n' above the regular 'n' to save space and 
                  indicate a double 'n' sound. Over time, this became the distinctive letter we know today.</span>
              </p>
            </div>
          </div>

          {/* Fun Facts Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#AA151B] p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Did You Know?</h2>
            <div className="space-y-4">
              {[
                { title: "United Nations", content: "Spanish is one of the six official languages of the UN" },
                { title: "Learning Curve", content: "One of the easiest languages for English speakers to learn" },
                { title: "Word Origins", content: "About 75% of Spanish words have Latin origins" }
              ].map((item) => (
                <div key={item.title} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-[#AA151B]/5 to-[#F1BF00]/5 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Begin learning Spanish today and join millions of speakers worldwide
          </p>
          <button 
            onClick={() => navigate('/study-activities')}
            className="px-8 py-3 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Learning Now
          </button>
        </div>
      </div>
    </div>
  );
}
