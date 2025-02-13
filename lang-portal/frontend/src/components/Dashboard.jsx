import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1>¡Bienvenidos! 👋</h1>
            
            <div className="welcome-message">
                <p>Welcome to Fluency – Your Path to Spanish Mastery! 🚀</p>
                <p>Whether you're starting from scratch or refining your skills, Fluency is here to make learning Spanish engaging, effective, and fun. Explore new words, track your progress, and dive into interactive study activities. ¡Vamos! 💫</p>
            </div>

            <div className="activity-sections">
                <section>
                    <h2>Study Activities 📚</h2>
                    {/* existing activity content */}
                </section>

                <section>
                    <h2>Word Groups 🎯</h2>
                    {/* existing groups content */}
                </section>

                <section>
                    <h2>Progress Tracker 📈</h2>
                    {/* existing progress content */}
                </section>
            </div>

            <Link to="/history" className="btn">
                View Spanish History
            </Link>
        </div>
    );
}

export default Dashboard; 