import React from 'react';
import { VisbyLoader } from './VisbyLoader';

interface LoadingViewProps {
  /** Optional message; default cycles through whimsical messages */
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message }) => (
  <VisbyLoader message={message} />
);
