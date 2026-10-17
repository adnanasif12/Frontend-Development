'use client';
import { useState } from 'react';

export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => (er[name] ? { ...er, [name]: '' } : er));
  };
  return { values, setValues, errors, setErrors, onChange };
}
