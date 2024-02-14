import { ReactNode } from 'react';

export interface IPageRoute {
  path: string;
  component: ReactNode;
  isProtected?: boolean;
}