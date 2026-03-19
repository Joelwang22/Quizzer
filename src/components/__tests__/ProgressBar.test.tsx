import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders answered and marked counts when provided', () => {
    render(<ProgressBar current={3} total={10} answeredCount={4} markedCount={2} />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('3/10')).toBeInTheDocument();
    expect(screen.getByText('4 answered | 2 marked')).toBeInTheDocument();
  });

  it('omits the summary line when no extra counts are passed', () => {
    render(<ProgressBar current={1} total={5} />);

    expect(screen.queryByText(/answered|marked/i)).not.toBeInTheDocument();
  });
});
