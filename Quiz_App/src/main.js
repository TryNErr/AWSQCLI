const API_URL = import.meta.env.VITE_API_URL || '/api';

window.testBackend = async function() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Testing backend connection...';
    
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        resultDiv.innerHTML = `✅ Backend connected: ${data.message}`;
        resultDiv.className = 'success';
    } catch (error) {
        resultDiv.innerHTML = `❌ Backend connection failed: ${error.message}`;
        resultDiv.className = 'error';
    }
}
