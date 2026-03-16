'use client';

import { useState, useCallback } from 'react';
import { createOfficialSession } from '@/app/actions/createOfficialSession';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './OfficialSessionForm.module.css';

interface OfficialSessionFormProps {
  onCreated?: () => void;
}

interface FormFields {
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  phoneNumber: string;
}

interface FormErrors {
  phoneNumberId?: string;
  accessToken?: string;
  wabaId?: string;
  phoneNumber?: string;
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.phoneNumberId.trim()) {
    errors.phoneNumberId = 'Requerido';
  } else if (!/^\d+$/.test(fields.phoneNumberId.trim())) {
    errors.phoneNumberId = 'Solo dígitos';
  }
  if (!fields.wabaId.trim()) {
    errors.wabaId = 'Requerido';
  } else if (!/^\d+$/.test(fields.wabaId.trim())) {
    errors.wabaId = 'Solo dígitos';
  }
  if (!fields.accessToken.trim()) {
    errors.accessToken = 'Requerido';
  } else if (fields.accessToken.trim().length < 20) {
    errors.accessToken = 'Mínimo 20 caracteres';
  }
  if (!fields.phoneNumber.trim()) {
    errors.phoneNumber = 'Requerido';
  } else if (!/^\d{10,15}$/.test(fields.phoneNumber.trim())) {
    errors.phoneNumber = 'Formato inválido (ej: 549111234567)';
  }
  return errors;
}

export default function OfficialSessionForm({ onCreated }: OfficialSessionFormProps) {
  const { showToast } = useToast();
  const [fields, setFields] = useState<FormFields>({
    phoneNumberId: '',
    accessToken: '',
    wabaId: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFields((prev) => {
        const next = { ...prev, [field]: value };
        if (touched) setErrors(validate(next));
        return next;
      });
    },
    [touched],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await createOfficialSession({
        phoneNumberId: fields.phoneNumberId.trim(),
        accessToken: fields.accessToken.trim(),
        wabaId: fields.wabaId.trim(),
        phoneNumber: fields.phoneNumber.trim(),
      });
      showToast('Sesión oficial registrada correctamente', 'success');
      setFields({ phoneNumberId: '', accessToken: '', wabaId: '', phoneNumber: '' });
      setTouched(false);
      setErrors({});
      onCreated?.();
    } catch (err: any) {
      showToast(err.message || 'Error al registrar la sesión oficial', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Nueva Sesión Oficial (Meta)</h2>
      <p className={styles.description}>
        Conecta tu cuenta de WhatsApp Business usando la API oficial de Meta. Necesitarás los datos de tu WABA en Meta Business Manager.
      </p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          id="phoneNumber"
          label="Número de Teléfono"
          type="text"
          value={fields.phoneNumber}
          onChange={handleChange('phoneNumber')}
          placeholder="549111234567"
          disabled={loading}
          helperText="Código de país + área + número (sin espacios)"
          errorMessage={errors.phoneNumber}
        />
        <Input
          id="phoneNumberId"
          label="Phone Number ID"
          type="text"
          value={fields.phoneNumberId}
          onChange={handleChange('phoneNumberId')}
          placeholder="123456789012345"
          disabled={loading}
          helperText="ID numérico del número en Meta Business Manager"
          errorMessage={errors.phoneNumberId}
        />
        <Input
          id="wabaId"
          label="WABA ID"
          type="text"
          value={fields.wabaId}
          onChange={handleChange('wabaId')}
          placeholder="987654321098765"
          disabled={loading}
          helperText="ID numérico de tu WhatsApp Business Account"
          errorMessage={errors.wabaId}
        />
        <Input
          id="accessToken"
          label="Access Token"
          type="password"
          value={fields.accessToken}
          onChange={handleChange('accessToken')}
          placeholder="EAAxxxxxxxxxxxxxxx..."
          disabled={loading}
          helperText="Token de acceso permanente de Meta"
          errorMessage={errors.accessToken}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading}
          className={styles.submitButton}
        >
          Registrar Sesión Oficial
        </Button>
      </form>
    </div>
  );
}
