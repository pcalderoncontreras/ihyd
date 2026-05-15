import React, { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase_config';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = ({ theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [captchaValue, setCaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();

    // IMPORTANTE: Reemplaza esta clave con tu Site Key de Google reCAPTCHA
    // Obtén tu clave en: https://www.google.com/recaptcha/admin
    const RECAPTCHA_SITE_KEY = '6LfBnRQsAAAAAF0d7uZXJ2AbW72N_uN4zZdLi40-'; // Esta es una clave de prueba

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        setError(''); // Limpiar error cuando se completa el captcha
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validar que el captcha esté completado
        if (!captchaValue) {
            setError('Por favor completa la verificación reCAPTCHA');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error(err);
            // Reset captcha en caso de error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setCaptchaValue(null);
            }
        }
    };

    return (
        <div className="ihyd-admin d-flex justify-content-center" style={{ minHeight: 'calc(100vh - 250px)', paddingTop: '6vh', paddingBottom: '0' }}>
            <div className="container" style={{ maxWidth: '400px' }}>
                <div className="ihyd-admin-card">
                    <h2 className="ihyd-admin-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
                    {error && <div className="alert alert-danger" style={{ fontSize: '0.85rem', padding: '8px 12px', borderRadius: 0, border: '1px solid #f5c6cb' }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'var(--ihyd-text-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ background: 'var(--ihyd-surface-2)', color: 'var(--ihyd-text)', border: '1px solid var(--ihyd-border-2)', borderRadius: 0 }}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label" style={{ color: 'var(--ihyd-text-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ background: 'var(--ihyd-surface-2)', color: 'var(--ihyd-text)', border: '1px solid var(--ihyd-border-2)', borderRadius: 0 }}
                                required
                            />
                        </div>

                        {/* Google reCAPTCHA */}
                        <div className="mb-4 d-flex justify-content-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                                theme={theme || 'light'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="ihyd-btn-primary w-100 d-flex justify-content-center"
                            disabled={!captchaValue}
                        >
                            LOGIN
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <small style={{ color: 'var(--ihyd-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Protegido por Google reCAPTCHA
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

