def get_navigation_html(current_page):
    return f"""
    <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border-bottom: 1px solid rgba(170, 21, 27, 0.1);
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
    ">
        <a href="http://localhost:5174" style="
            text-decoration: none;
            color: var(--spanish-red);
            font-weight: 700;
            font-size: 1.5rem;
        ">
            ¡Aprende!
        </a>
        <div>
            <a href="http://localhost:5174/study-activities" style="
                margin: 0 1rem;
                color: {'var(--spanish-red)' if current_page == 'activities' else 'var(--text-secondary)'};
                text-decoration: none;
            ">
                Study Activities
            </a>
            <a href="http://localhost:5174/spanish-history" style="
                margin: 0 1rem;
                color: {'var(--spanish-red)' if current_page == 'history' else 'var(--text-secondary)'};
                text-decoration: none;
            ">
                Spanish History
            </a>
        </div>
    </div>
    <div style="height: 4rem"></div>
    """ 