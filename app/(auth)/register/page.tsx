'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateName = (value: string) => (!value.trim() ? 'El nombre es requerido' : '');
  const validateEmail = (value: string) => {
    if (!value) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email válido';
    return '';
  };
  const validatePassword = (value: string) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  };
  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Confirma tu contraseña';
    if (value !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' | null => {
    if (!pwd) return null;
    if (pwd.length < 8) return 'weak';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (hasUpper && hasNumber && hasSpecial) return 'strong';
    return 'medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(confirmPassword);
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cErr);

    if (nErr) { nameRef.current?.focus(); return; }
    if (eErr) { emailRef.current?.focus(); return; }
    if (pErr) { passwordRef.current?.focus(); return; }
    if (cErr) { confirmPasswordRef.current?.focus(); return; }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      setToken(response.data.token);
      showToast('Cuenta creada correctamente', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoText}>W</span>
          </div>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>Regístrate para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorAlert} role="alert">{error}</div>
          )}

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Nombre</label>
            <input
              ref={nameRef}
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (submitted) setNameError(validateName(e.target.value)); }}
              className={`${styles.input}${submitted && nameError ? ` ${styles.inputError}` : ''}`}
              placeholder="Tu nombre"
            />
            {submitted && nameError && <span className={styles.fieldError} role="alert">{nameError}</span>}
          </div>

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
                placeholder="Mínimo 8 caracteres"
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
            {password && (
              <div className={styles.strengthBar}>
                <div className={`${styles.strengthSegment}${strength ? ` ${styles[`strength_${strength}`]}` : ''}`} />
                <div className={`${styles.strengthSegment}${strength === 'medium' || strength === 'strong' ? ` ${styles[`strength_${strength}`]}` : ''}`} />
                <div className={`${styles.strengthSegment}${strength === 'strong' ? ` ${styles.strength_strong}` : ''}`} />
                <span className={styles.strengthLabel}>
                  {strength === 'weak' && 'Débil'}
                  {strength === 'medium' && 'Media'}
                  {strength === 'strong' && 'Fuerte'}
                </span>
              </div>
            )}
            {submitted && passwordError && <span className={styles.fieldError} role="alert">{passwordError}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirmar contraseña</label>
            <div className={styles.passwordWrapper}>
              <input
                ref={confirmPasswordRef}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (submitted) setConfirmPasswordError(validateConfirmPassword(e.target.value)); }}
                className={`${styles.input} ${styles.inputWithToggle}${submitted && confirmPasswordError ? ` ${styles.inputError}` : ''}`}
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {submitted && confirmPasswordError && <span className={styles.fieldError} role="alert">{confirmPasswordError}</span>}
          </div>

          <Button type="submit" variant="primary" loading={loading} className={styles.submitButton}>
            Registrarse
          </Button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
