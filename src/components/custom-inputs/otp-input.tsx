import React, { useRef, useEffect } from 'react';

import { Box, OutlinedInput } from '@mui/material';

type Props = {
  onChange: (res: string) => void;
  onEnter?: () => void; // Nueva prop opcional
};

const OtpInput: React.FC<Props> = ({ onChange, onEnter }) => {
  const inputsRef = useRef<Array<HTMLInputElement>>([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const sendResult = () => {
    const res = inputsRef.current.map((input) => input?.value || '').join('');
    if (onChange) onChange(res);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    const nextElementSibling =
      e.target.parentElement?.nextElementSibling?.firstChild;

    if (value.length > 1) {
      e.target.value = value.charAt(0);
      if (nextElementSibling) (nextElementSibling as HTMLInputElement).focus();
    } else if (value.match('[0-9]{1}')) {
      if (nextElementSibling) (nextElementSibling as HTMLInputElement).focus();
    } else {
      e.target.value = '';
    }
    sendResult();
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;
    const previousElementSibling =
      target.parentElement?.previousElementSibling?.firstChild;

    if (key === 'Backspace') {
      if (target.value === '' && previousElementSibling) {
        (previousElementSibling as HTMLInputElement).focus();
        (previousElementSibling as HTMLInputElement).value = '';
        e.preventDefault();
      } else {
        target.value = '';
      }
      sendResult();
    }

    // Si presiona Enter en cualquier campo
    if (key === 'Enter') {
      const currentValue = inputsRef.current
        .map((input) => input?.value || '')
        .join('');
      // Si todos los campos están llenos (6 dígitos)
      if (currentValue.length === 6 && onEnter) {
        onEnter();
      }
      e.preventDefault();
    }
  };

  // Verificar si es el último campo para manejar Enter específicamente
  const handleLastInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;
    const previousElementSibling =
      target.parentElement?.previousElementSibling?.firstChild;

    if (key === 'Backspace') {
      if (target.value === '' && previousElementSibling) {
        (previousElementSibling as HTMLInputElement).focus();
        (previousElementSibling as HTMLInputElement).value = '';
        e.preventDefault();
      } else {
        target.value = '';
      }
      sendResult();
    }

    // Si es el último campo y presiona Enter
    if (key === 'Enter' && index === 5) {
      const currentValue = inputsRef.current
        .map((input) => input?.value || '')
        .join('');
      if (currentValue.length === 6 && onEnter) {
        onEnter();
      }
      e.preventDefault();
    }
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData('Text');

    // Filtrar solo dígitos
    const digits = pastedValue.replace(/\D/g, '').slice(0, 6);

    // Limpiar todos los inputs primero
    inputsRef.current.forEach((input) => {
      if (input) input.value = '';
    });

    // Distribuir los dígitos
    for (let i = 0; i < digits.length; i += 1) {
      const currentInputElement = inputsRef.current[i];
      // ✅ Verificar que el elemento existe antes de usarlo
      if (currentInputElement) {
        currentInputElement.value = digits[i];
      }
    }

    // Enfocar el siguiente campo después del último dígito pegado
    const nextIndex = digits.length;
    if (nextIndex < 6 && inputsRef.current[nextIndex]) {
      inputsRef.current[nextIndex].focus();
    } else if (nextIndex === 6 && inputsRef.current[5]) {
      inputsRef.current[5].focus();
    }

    sendResult();

    // Auto-verificar si se pegaron 6 dígitos
    if (digits.length === 6 && onEnter) {
      setTimeout(() => onEnter(), 100);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        justifyContent: 'center',
      }}
    >
      {Array.from(Array(6).keys()).map((i) => (
        <OutlinedInput
          key={i}
          onChange={handleOnChange}
          onKeyDown={(e) =>
            i === 5 ? handleLastInputKeyDown(e, i) : handleOnKeyDown(e)
          }
          onFocus={handleOnFocus}
          onPaste={handleOnPaste}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 500 },
          }}
          type="tel"
          inputRef={(el: HTMLInputElement) => {
            inputsRef.current[i] = el;
          }}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          sx={{
            width: { xs: 45, sm: 56 },
            height: { xs: 45, sm: 56 },
            '& input': {
              p: 0,
              textAlign: 'center',
            },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
