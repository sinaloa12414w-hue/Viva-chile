// public/script.js

// Sanctions Calculator Logic
const sanctionData = {
    "45": { article: "Art 0.1 - Suplantación de identidad", basePenalty: 45, severity: "Grave" },
    "30": { article: "Art 0.4 - Contenido Inapropiado", basePenalty: 30, severity: "Media" },
    "60": { article: "Art 0.10 - Character Kill", basePenalty: 60, severity: "Muy Grave" }
};

function calculate() {
    const targetUser = document.getElementById('targetUser').value.trim();
    const articleId = document.getElementById('article').value;
    const resultDiv = document.getElementById('result');

    // Validation
    if (!targetUser) {
        resultDiv.innerHTML = '<p style="color: #ff4444;">❌ Por favor ingresa un usuario válido</p>';
        return;
    }

    if (!articleId) {
        resultDiv.innerHTML = '<p style="color: #ff4444;">❌ Por favor selecciona un artículo</p>';
        return;
    }

    const sanction = sanctionData[articleId];
    if (!sanction) {
        resultDiv.innerHTML = '<p style="color: #ff4444;">❌ Artículo no encontrado</p>';
        return;
    }

    // Calculate penalty
    const basePenalty = sanction.basePenalty;
    const multiplier = getSeverityMultiplier(sanction.severity);
    const totalPenalty = Math.round(basePenalty * multiplier);

    // Display result
    const resultHTML = `
        <div style="background: #3a3a3a; padding: 15px; border-left: 4px solid #5865F2; margin-top: 15px; border-radius: 5px;">
            <h3>📋 Resultado de la Sanción</h3>
            <p><strong>Usuario:</strong> ${targetUser}</p>
            <p><strong>Artículo:</strong> ${sanction.article}</p>
            <p><strong>Severidad:</strong> ${sanction.severity}</p>
            <p><strong>Penalización Base:</strong> ${basePenalty} minutos</p>
            <p><strong>Penalización Total:</strong> <span style="color: #ff9900; font-weight: bold;">${totalPenalty} minutos</span></p>
            <p><strong>Equivalente:</strong> ${Math.floor(totalPenalty / 60)} horas y ${totalPenalty % 60} minutos</p>
            <button onclick="applySanction('${targetUser}', ${totalPenalty})" style="margin-top: 10px; background: #ff5533;">⚡ Aplicar Sanción</button>
        </div>
    `;

    resultDiv.innerHTML = resultHTML;
}

function getSeverityMultiplier(severity) {
    const multipliers = {
        "Media": 1.0,
        "Grave": 1.5,
        "Muy Grave": 2.0
    };
    return multipliers[severity] || 1.0;
}

function applySanction(user, minutes) {
    console.log(`Sanción aplicada a ${user} por ${minutes} minutos`);
    alert(`✅ Sanción de ${minutes} minutos aplicada a ${user}`);
}

// Discord Login Handler
function loginWithDiscord() {
    window.location.href = '/auth/discord';
}

// Load user info on dashboard
function loadUserInfo() {
    fetch('/api/user')
        .then(res => res.json())
        .then(data => {
            console.log('User logged in:', data);
        })
        .catch(err => console.error('Not authenticated:', err));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script initialized');
    loadUserInfo();
});
