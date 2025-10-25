let updateInterval;

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

async function updateDashboard() {
    try {
        const response = await fetch('/api/status');
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            document.getElementById('bot-status').textContent = 
                data.ready ? '✅ Online' : '⏳ Connecting...';
            
            document.getElementById('total-messages').textContent = 
                data.stats.totalMessages || 0;
            
            document.getElementById('ai-requests').textContent = 
                data.stats.aiRequests || 0;
            
            document.getElementById('uptime').textContent = 
                formatUptime(data.stats.uptime || 0);
        }
    } catch (error) {
        console.error('Error updating dashboard:', error);
        document.getElementById('bot-status').textContent = '❌ Error';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    
    updateInterval = setInterval(updateDashboard, 5000);
});

window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});
