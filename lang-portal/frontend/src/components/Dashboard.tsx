import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="text-center p-12 rounded-lg shadow-md bg-gradient-to-br from-white via-white to-yellow-50 border-l-4 border-[#AA151B]">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#AA151B] to-[#F1BF00] bg-clip-text text-transparent">
            ¡Bienvenidos! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to Fluency – Your Path to Spanish Mastery! 🚀
          </p>
        </div>

        {/* Activity Sections */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-[#AA151B]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Study Activities 📚</h2>
            <p className="text-gray-600 mb-4">Interactive exercises and lessons to improve your Spanish skills.</p>
            <Link 
              to="/study-activities"
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              Start Learning
            </Link>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-[#F1BF00]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Word Groups 🎯</h2>
            <p className="text-gray-600 mb-4">Organized collections of vocabulary to help you learn effectively.</p>
            <Link 
              to="/groups"
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              View Groups
            </Link>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-[#AA151B]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Progress Tracker 📈</h2>
            <p className="text-gray-600 mb-4">Monitor your learning journey and track your improvements.</p>
            <Link 
              to="/progress"
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#AA151B] to-[#AA151B] hover:to-[#F1BF00] text-white rounded-lg transition-all duration-300"
            >
              Check Progress
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-8 bg-white rounded-lg shadow-md border-t-4 border-[#F1BF00]">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              to="/history"
              className="p-4 bg-gradient-to-br from-[#AA151B]/5 to-[#F1BF00]/5 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-800">Spanish History</h3>
              <p className="text-gray-600">Learn about the rich history of the Spanish language</p>
            </Link>
            {/* Add more quick links as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 