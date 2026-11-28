import type { ComponentProps } from 'react';
import { TLink } from '@/components/motion/BoardTransition';

type ActionLinkProps = Omit<ComponentProps<typeof TLink>, 'className'> & {
  tone?: 'dark' | 'light';
  compact?: boolean;
};

export function ActionLink({ children, tone = 'dark', compact = false, ...props }: ActionLinkProps) {
  return (
    <TLink {...props} className="action-link" data-tone-style={tone} data-compact={compact || undefined}>
      <span>{children}</span>
      <span className="action-link-arrow" aria-hidden="true">↗</span>
    </TLink>
  );
}
