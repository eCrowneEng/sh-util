import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

describe('App', () => {
  it.skip('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
