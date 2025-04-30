// components/EmptyState.tsx
import * as React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Title2,
  Body1,
  Button,
  Subtitle2,
} from '@fluentui/react-components';
import { ErrorCircle48Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    padding: tokens.spacingVerticalXXXL,
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusXLarge,
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorPaletteRedForeground2,
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  message: {
    color: tokens.colorNeutralForeground2,
    maxWidth: '400px',
  },
  actions: {
    marginTop: tokens.spacingVerticalM,
  },
});

type EmptyStateProps = {
  title?: string;
  message?: string;
  retryText?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Oops, something went wrong',
  message = 'We couldn’t load the requested content. Please try again or contact support if the problem persists.',
  retryText = 'Try again',
  onRetry,
  children,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ErrorCircle48Regular className={styles.icon} />
      <Title2 className={styles.title}>{title}</Title2>
      <Body1 className={styles.message}>{message}</Body1>

      {onRetry && (
        <div className={styles.actions}>
          <Button appearance="primary" onClick={onRetry}>
            {retryText}
          </Button>
        </div>
      )}

      {children && (
        <div style={{ marginTop: tokens.spacingVerticalL }}>{children}</div>
      )}
    </div>
  );
};
