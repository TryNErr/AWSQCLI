import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #ec4899;
    --accent: #06b6d4;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --dark: #1f2937;
    --dark-light: #374151;
    --gray: #6b7280;
    --gray-light: #d1d5db;
    --gray-lighter: #f3f4f6;
    --white: #ffffff;
    --gradient: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    --gradient-light: linear-gradient(135deg, #a5b4fc 0%, #f9a8d4 100%);
    --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: var(--dark);
    line-height: 1.6;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary {
    background: var(--gradient);
    color: white;
    box-shadow: var(--shadow);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-secondary {
    background: white;
    color: var(--primary);
    border: 2px solid var(--primary);
  }

  .btn-secondary:hover {
    background: var(--primary);
    color: white;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--gray-lighter);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--dark);
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--gray-light);
    border-radius: 12px;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary);
  }

  .text-center { text-align: center; }
  .text-primary { color: var(--primary); }
  .text-error { color: var(--error); }
  .text-success { color: var(--success); }
  
  .mb-1 { margin-bottom: 8px; }
  .mb-2 { margin-bottom: 16px; }
  .mb-3 { margin-bottom: 24px; }
  .mb-4 { margin-bottom: 32px; }
  
  .mt-1 { margin-top: 8px; }
  .mt-2 { margin-top: 16px; }
  .mt-3 { margin-top: 24px; }
  .mt-4 { margin-top: 32px; }

  @media (max-width: 768px) {
    .container {
      padding: 0 16px;
    }
    
    .card {
      padding: 20px;
      border-radius: 12px;
    }
  }
`;

export default GlobalStyles;
