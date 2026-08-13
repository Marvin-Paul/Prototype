// System Status and Health Check
class SystemStatus {
    constructor() {
        this.statusIndicator = null;
        this.init();
    }

    init() {
        this.createIndicator();
        this.checkStatus();
        // Check every 30 seconds
        setInterval(() => this.checkStatus(), 30000);
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'systemStatusIndicator';
        indicator.className = 'system-status-indicator';
        indicator.innerHTML = `
            <div class="status-dot"></div>
            <span class="status-text">Checking System...</span>
            <div class="status-tooltip">
                <h4>System Health</h4>
                <ul>
                    <li id="supabaseAuthStatus">Auth: <i class="fas fa-circle-notch fa-spin"></i></li>
                    <li id="supabaseDbStatus">Database: <i class="fas fa-circle-notch fa-spin"></i></li>
                </ul>
            </div>
        `;
        document.body.appendChild(indicator);
        this.statusIndicator = indicator;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .system-status-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 15px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                cursor: pointer;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(0,0,0,0.05);
            }
            .system-status-indicator:hover {
                transform: translateY(-5px);
            }
            .status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #ccc;
            }
            .status-dot.online { background: #10b981; box-shadow: 0 0 8px #10b981; }
            .status-dot.warning { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
            .status-dot.offline { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
            
            .status-tooltip {
                position: absolute;
                bottom: 100%;
                right: 0;
                background: white;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: none;
                min-width: 180px;
                margin-bottom: 10px;
            }
            .system-status-indicator:hover .status-tooltip {
                display: block;
            }
            .status-tooltip h4 { margin: 0 0 10px 0; font-size: 14px; }
            .status-tooltip ul { list-style: none; padding: 0; margin: 0; }
            .status-tooltip li { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .status-tooltip i { font-size: 10px; }
            .status-tooltip i.fa-check-circle { color: #10b981; }
            .status-tooltip i.fa-times-circle { color: #ef4444; }
        `;
        document.head.appendChild(style);
    }

    async checkStatus() {
        let authOk = false;
        let dbOk = false;

        try {
            // Check Auth
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            authOk = true;
            document.getElementById('supabaseAuthStatus').innerHTML = 'Auth: <i class="fas fa-check-circle"></i>';
        } catch (e) {
            document.getElementById('supabaseAuthStatus').innerHTML = 'Auth: <i class="fas fa-times-circle"></i>';
        }

        try {
            // Check DB by attempting a simple select from profiles
            const { error } = await window.supabaseClient.from('profiles').select('id').limit(1);
            if (!error) {
                dbOk = true;
                document.getElementById('supabaseDbStatus').innerHTML = 'Database: <i class="fas fa-check-circle"></i>';
            } else {
                throw error;
            }
        } catch (e) {
            document.getElementById('supabaseDbStatus').innerHTML = 'Database: <i class="fas fa-times-circle"></i>';
        }

        const dot = this.statusIndicator.querySelector('.status-dot');
        const text = this.statusIndicator.querySelector('.status-text');

        if (authOk && dbOk) {
            dot.className = 'status-dot online';
            text.textContent = 'Cloud Connected';
        } else if (authOk || dbOk) {
            dot.className = 'status-dot warning';
            text.textContent = 'Partial Connection';
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'System Offline';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.systemStatus = new SystemStatus();
});
