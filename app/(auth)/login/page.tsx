'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateEmail = (value: string) => {
    if (!value) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email válido';
    return '';
  };

  const validatePassword = (value: string) => (!value ? 'La contraseña es requerida' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr) { emailRef.current?.focus(); return; }
    if (pErr) { passwordRef.current?.focus(); return; }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      showToast('Sesión iniciada correctamente', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoText}>W</span>
          </div>
          <h1 className={styles.title}>WhatsApp Manager</h1>
          <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert} role="alert">{error}</div>}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (submitted) setEmailError(validateEmail(e.target.value)); }}
              className={`${styles.input}${submitted && emailError ? ` ${styles.inputError}` : ''}`}
              placeholder="tu@email.com"
            />
            {submitted && emailError && <span className={styles.fieldError} role="alert">{emailError}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <div className={styles.passwordWrapper}>
              <input
                ref={passwordRef}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (submitted) setPasswordError(validatePassword(e.target.value)); }}
                className={`${styles.input} ${styles.inputWithToggle}${submitted && passwordError ? ` ${styles.inputError}` : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {submitted && passwordError && <span className={styles.fieldError} role="alert">{passwordError}</span>}
          </div>

          <div className={styles.forgotPassword}>
            <span className={styles.forgotLink}>¿Olvidaste tu contraseña?</span>
          </div>

          <Button type="submit" variant="primary" loading={loading} className={styles.submitButton}>
            Iniciar Sesión
          </Button>
        </form>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" className={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
