import React, { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase_config';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Admin Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Google reCAPTCHA */}
                                <div className="mb-3 d-flex justify-content-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={handleCaptchaChange}
                                        theme="light"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={!captchaValue}
                                >
                                    Login
                                </button>
                            </form>

                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    Protegido por Google reCAPTCHA
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
