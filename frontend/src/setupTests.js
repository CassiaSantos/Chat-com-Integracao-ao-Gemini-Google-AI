import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende o 'expect' do Vitest com os matchers do jest-dom
expect.extend(matchers);

// Limpa o DOM virtual após cada teste
afterEach(() => {
  cleanup();
});