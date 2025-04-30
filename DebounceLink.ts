// components/EmptyState.tsx
import * as React from 'react';
import {
  makeStyles,
  Title2,
  Body1,
  Button,
} from '@fluentui/react-components';
import { ErrorCircle24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '2rem',
    gap: '1rem',
    color: '#616161',
  },
  icon: {
    fontSize: '48px'
  },
});

type EmptyStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Something went wrong',
  message = 'We couldn’t load this content. Please try again later.',
  onRetry,
  retryText = 'Try again',
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ErrorCircle24Regular className={styles.icon} />
      <Title2>{title}</Title2>
      <Body1>{message}</Body1>
      {onRetry && (
        <Button appearance="primary" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
};
