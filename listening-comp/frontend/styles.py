def load_css():
    return """
    <style>
        /* Custom fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        /* Base styles */
        :root {
            --primary-red: #AA151B;
            --primary-yellow: #F1BF00;
            --dark-bg: #1A1A1A;
            --light-bg: #FFFFFF;
        }

        /* Main container */
        .stApp {
            font-family: 'Inter', sans-serif;
        }

        /* Headings */
        h1 {
            font-size: 32px !important;
            font-weight: 700 !important;
            color: var(--primary-red) !important;
        }

        h2, h3 {
            font-size: 24px !important;
            font-weight: 600 !important;
        }

        /* Buttons */
        .stButton > button {
            background: linear-gradient(135deg, var(--primary-red), var(--primary-yellow)) !important;
            color: white !important;
            border: none !important;
            border-radius: 0.5rem !important;
            padding: 0.5rem 1rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }

        .stButton > button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(170, 21, 27, 0.2) !important;
        }

        /* Sidebar */
        .css-1d391kg {
            background-color: var(--dark-bg) !important;
        }

        /* Cards */
        .stMarkdown div {
            background: var(--light-bg);
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Radio buttons */
        .stRadio > label {
            font-weight: 500 !important;
            padding: 0.5rem !important;
        }

        /* Progress bars */
        .stProgress > div {
            background: linear-gradient(90deg, var(--primary-red), var(--primary-yellow)) !important;
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            .stApp {
                background-color: var(--dark-bg) !important;
                color: var(--light-bg) !important;
            }
            
            .stMarkdown div {
                background: #2A2A2A;
            }
        }

        /* Sidebar styling */
        section[data-testid="stSidebar"] {
            background-color: var(--dark-bg) !important;
            border-right: 1px solid rgba(250, 250, 250, 0.1);
        }

        section[data-testid="stSidebar"] .stMarkdown {
            color: white !important;
        }

        /* Remove empty white boxes */
        .stMarkdown div:empty {
            display: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        /* Style success/error messages */
        .stSuccess, .stError {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 0.5rem !important;
            padding: 0.75rem !important;
            color: white !important;
        }

        /* Text areas in sidebar */
        .stTextArea textarea {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* Text inputs in sidebar */
        .stTextInput input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* Headers in sidebar */
        .sidebar .stHeading {
            color: var(--primary-yellow) !important;
        }
    </style>
    """ 