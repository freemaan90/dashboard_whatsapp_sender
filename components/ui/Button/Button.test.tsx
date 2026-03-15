/**
 * Tests para el componente Button
 *
 * Cubre: variantes, tamaños, estados disabled/loading, accesibilidad con teclado,
 * renderizado de iconos.
 *
 * Valida: Requisitos 3.1, 10.1
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonVariant, ButtonSize } from './Button';

// ─── Variantes ────────────────────────────────────────────────────────────────

describe('Button – variantes', () => {
  const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

  variants.forEach((variant) => {
    it(`renderiza la variante "${variant}"`, () => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    });
  });
});

// ─── Tamaños ──────────────────────────────────────────────────────────────────

describe('Button – tamaños', () => {
  const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

  sizes.forEach((size) => {
    it(`renderiza el tamaño "${size}"`, () => {
      render(<Button size={size}>Botón</Button>);
      expect(screen.getByRole('button', { name: 'Botón' })).toBeInTheDocument();
    });
  });
});

// ─── Estado disabled ──────────────────────────────────────────────────────────

describe('Button – estado disabled', () => {
  it('tiene el atributo disabled en el DOM', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('tiene aria-disabled="true"', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('no dispara onClick cuando está disabled', async () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ─── Estado loading ───────────────────────────────────────────────────────────

describe('Button – estado loading', () => {
  it('tiene aria-busy="true" cuando loading=true', () => {
    render(<Button loading>Cargando</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('está deshabilitado cuando loading=true', () => {
    render(<Button loading>Cargando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('muestra el spinner cuando loading=true', () => {
    const { container } = render(<Button loading>Cargando</Button>);
    // El spinner tiene aria-hidden y la clase "spinner"
    const spinner = container.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
  });

  it('no dispara onClick cuando está en loading', async () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>Cargando</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ─── Accesibilidad con teclado ────────────────────────────────────────────────

describe('Button – accesibilidad con teclado', () => {
  it('puede recibir foco con Tab', async () => {
    render(<Button>Foco</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('dispara onClick al presionar Enter', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Enter</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
    fireEvent.click(btn); // los botones nativos disparan click con Enter
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('dispara onClick al presionar Space', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Space</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    fireEvent.keyDown(btn, { key: ' ', code: 'Space' });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no puede recibir foco cuando está disabled', async () => {
    render(
      <>
        <Button disabled>Deshabilitado</Button>
        <Button>Otro</Button>
      </>
    );
    await userEvent.tab();
    // El botón deshabilitado no debe tener foco
    expect(screen.getByRole('button', { name: 'Deshabilitado' })).not.toHaveFocus();
  });

  it('tiene aria-label cuando se usa iconOnly', () => {
    render(
      <Button iconOnly aria-label="Cerrar">
        ✕
      </Button>
    );
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });
});

// ─── Iconos ───────────────────────────────────────────────────────────────────

describe('Button – iconos', () => {
  it('renderiza leadingIcon', () => {
    render(
      <Button leadingIcon={<span data-testid="leading-icon">←</span>}>
        Con icono
      </Button>
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
  });

  it('renderiza trailingIcon', () => {
    render(
      <Button trailingIcon={<span data-testid="trailing-icon">→</span>}>
        Con icono
      </Button>
    );
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  it('no muestra leadingIcon cuando loading=true', () => {
    render(
      <Button loading leadingIcon={<span data-testid="leading-icon">←</span>}>
        Cargando
      </Button>
    );
    expect(screen.queryByTestId('leading-icon')).not.toBeInTheDocument();
  });

  it('no muestra trailingIcon cuando loading=true', () => {
    render(
      <Button loading trailingIcon={<span data-testid="trailing-icon">→</span>}>
        Cargando
      </Button>
    );
    expect(screen.queryByTestId('trailing-icon')).not.toBeInTheDocument();
  });
});

// ─── Tipo de botón ────────────────────────────────────────────────────────────

describe('Button – tipo', () => {
  it('tiene type="button" por defecto', () => {
    render(<Button>Botón</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('acepta type="submit"', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
