let sessionId = localStorage.getItem('admin_session');

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            sessionId = result.sessionId;
            localStorage.setItem('admin_session', sessionId);
            showAdminPanel();
            loadConfig();
        } else {
            alert('Login failed: ' + result.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function handleLogout() {
    if (sessionId) {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: { 'X-Session-Id': sessionId }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    localStorage.removeItem('admin_session');
    sessionId = null;
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('adminContainer').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
}

async function loadConfig() {
    if (!sessionId) {
        handleLogout();
        return;
    }

    try {
        const response = await fetch('/api/admin/config', {
            headers: { 'X-Session-Id': sessionId }
        });

        const result = await response.json();

        if (result.success) {
            const config = result.data;
            
            document.getElementById('botName').value = config.bot.name || '';
            document.getElementById('botPrefix').value = config.bot.prefix || '!';
            document.getElementById('adminNumbers').value = (config.bot.adminNumbers || []).join('\n');
            
            document.getElementById('featureAutoReply').checked = config.features.autoReply;
            document.getElementById('featureAiChat').checked = config.features.aiChat;
            document.getElementById('featureGroupManagement').checked = config.features.groupManagement;
            document.getElementById('featureMediaSupport').checked = config.features.mediaSupport;
            document.getElementById('featureBroadcast').checked = config.features.broadcast;
            
            document.getElementById('welcomeMessage').value = config.welcomeMessage || '';
            document.getElementById('keywords').value = JSON.stringify(config.keywords, null, 2);
        } else {
            if (response.status === 401) {
                handleLogout();
            } else {
                showAlert('Error loading config: ' + result.message, 'error');
            }
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

async function saveConfig() {
    if (!sessionId) {
        handleLogout();
        return;
    }

    try {
        const adminNumbers = document.getElementById('adminNumbers').value
            .split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0);

        let keywords;
        try {
            keywords = JSON.parse(document.getElementById('keywords').value);
        } catch (e) {
            showAlert('Invalid JSON format in keywords', 'error');
            return;
        }

        const config = {
            bot: {
                name: document.getElementById('botName').value,
                prefix: document.getElementById('botPrefix').value,
                adminNumbers: adminNumbers
            },
            features: {
                autoReply: document.getElementById('featureAutoReply').checked,
                aiChat: document.getElementById('featureAiChat').checked,
                groupManagement: document.getElementById('featureGroupManagement').checked,
                mediaSupport: document.getElementById('featureMediaSupport').checked,
                broadcast: document.getElementById('featureBroadcast').checked
            },
            welcomeMessage: document.getElementById('welcomeMessage').value,
            keywords: keywords,
            dashboard: {
                port: 5000,
                enabled: true
            }
        };

        const response = await fetch('/api/admin/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(config)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('✅ Configuration saved successfully! Restart bot to apply changes.', 'success');
        } else {
            showAlert('Error saving config: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

async function resetConfig() {
    if (!confirm('Are you sure you want to reset configuration to default?')) {
        return;
    }

    if (!sessionId) {
        handleLogout();
        return;
    }

    try {
        const response = await fetch('/api/admin/config/reset', {
            method: 'POST',
            headers: { 'X-Session-Id': sessionId }
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Configuration reset to default', 'success');
            loadConfig();
        } else {
            showAlert('Error resetting config: ' + result.message, 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    container.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

if (sessionId) {
    showAdminPanel();
    loadConfig();
}
