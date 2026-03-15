/**
 * Tests para el componente Input
 *
 * Cubre: renderizado de label/placeholder/helper text, mensajes de error,
 * accesibilidad con lectores de pantalla (ARIA), estado disabled, iconos,
 * interacción del usuario y comportamiento de foco.
 *
 * Valida: Requisitos 3.2, 10.3
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

// ─── Renderizado básico ───────────────────────────────────────────────────────

describe('Input – renderizado básico', () => {
  it('renderiza el label cuando se proporciona', () => {
    render(<Input label="Nombre" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('no renderiza label cuando no se proporciona', () => {
    render(<Input placeholder="Sin label" />);
    expect(screen.queryByText('Sin label')).not.toBeInTheDocument();
    // el input sigue estando en el DOM
    expect(screen.getByPlaceholderText('Sin label')).toBeInTheDocument();
  });

  it('renderiza el placeholder', () => {
    render(<Input placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });

  it('renderiza el helper text cuando no hay error', () => {
    render(<Input helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('no renderiza el helper text cuando hay un error', () => {
    render(<Input helperText="Texto de ayuda" errorMessage="Campo requerido" />);
    expect(screen.queryByText('Texto de ayuda')).not.toBeInTheDocument();
  });
});

// ─── Mensajes de error ────────────────────────────────────────────────────────

describe('Input – mensajes de error', () => {
  it('renderiza el mensaje de error cuando se proporciona', () => {
    render(<Input errorMessage="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('el mensaje de error tiene role="alert"', () => {
    render(<Input errorMessage="Campo inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo inválido');
  });

  it('no muestra role="alert" cuando no hay error', () => {
    render(<Input helperText="Ayuda" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── Accesibilidad ARIA ───────────────────────────────────────────────────────

describe('Input – accesibilidad ARIA', () => {
  it('aria-invalid es true cuando hay errorMessage', () => {
    render(<Input errorMessage="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('aria-invalid no está presente cuando no hay error', () => {
    render(<Input label="Campo" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('aria-describedby apunta al id del error cuando hay errorMessage', () => {
    render(<Input id="email" errorMessage="Email inválido" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = document.getElementById(describedBy!);
    expect(errorEl).toHaveTextContent('Email inválido');
  });

  it('aria-describedby apunta al id del helper text cuando hay helperText', () => {
    render(<Input id="phone" helperText="Incluye código de país" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const helperEl = document.getElementById(describedBy!);
    expect(helperEl).toHaveTextContent('Incluye código de país');
  });

  it('aria-describedby incluye ambos ids cuando hay helperText y errorMessage', () => {
    render(<Input id="field" helperText="Ayuda" errorMessage="Error" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const ids = describedBy.split(' ');
    expect(ids.length).toBe(2);
  });

  it('aria-describedby no está presente cuando no hay helper ni error', () => {
    render(<Input label="Campo" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('el label está asociado al input mediante htmlFor/id', () => {
    render(<Input label="Correo electrónico" />);
    // getByLabelText verifica la asociación label → input
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
  });
});

// ─── Estado disabled ──────────────────────────────────────────────────────────

describe('Input – estado disabled', () => {
  it('el input tiene el atributo disabled', () => {
    render(<Input disabled label="Campo" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('no acepta escritura cuando está disabled', async () => {
    render(<Input disabled label="Campo" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'texto');
    expect(input).toHaveValue('');
  });
});

// ─── Iconos ───────────────────────────────────────────────────────────────────

describe('Input – iconos', () => {
  it('renderiza el leadingIcon cuando se proporciona', () => {
    render(<Input leadingIcon={<span data-testid="leading-icon">🔍</span>} />);
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
  });

  it('renderiza el trailingIcon cuando se proporciona', () => {
    render(<Input trailingIcon={<span data-testid="trailing-icon">✓</span>} />);
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  it('los iconos tienen aria-hidden="true"', () => {
    const { container } = render(
      <Input
        leadingIcon={<span>🔍</span>}
        trailingIcon={<span>✓</span>}
      />
    );
    const iconWrappers = container.querySelectorAll('[aria-hidden="true"]');
    expect(iconWrappers.length).toBe(2);
  });

  it('no renderiza contenedor de icono cuando no se proporciona', () => {
    const { container } = render(<Input label="Sin iconos" />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });
});

// ─── Interacción del usuario ──────────────────────────────────────────────────

describe('Input – interacción del usuario', () => {
  it('dispara onChange al escribir', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hola');
    expect(handleChange).toHaveBeenCalled();
  });

  it('refleja el valor escrito por el usuario (uncontrolled)', async () => {
    render(<Input defaultValue="" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mundo');
    expect(input).toHaveValue('mundo');
  });

  it('refleja el valor controlado', () => {
    const { rerender } = render(<Input value="inicial" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('inicial');
    rerender(<Input value="actualizado" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('actualizado');
  });
});

// ─── Comportamiento de foco ───────────────────────────────────────────────────

describe('Input – comportamiento de foco', () => {
  it('puede recibir foco con Tab', async () => {
    render(<Input label="Campo" />);
    await userEvent.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('no puede recibir foco cuando está disabled', async () => {
    render(
      <>
        <Input disabled label="Deshabilitado" />
        <Input label="Habilitado" />
      </>
    );
    await userEvent.tab();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).not.toHaveFocus();
    expect(inputs[1]).toHaveFocus();
  });

  it('dispara onFocus al recibir foco', () => {
    const handleFocus = jest.fn();
    render(<Input onFocus={handleFocus} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('dispara onBlur al perder foco', () => {
    const handleBlur = jest.fn();
    render(<Input onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
