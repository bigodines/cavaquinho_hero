'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { Children, ReactElement, cloneElement } from 'react';

interface ActiveLinkProps {
  children: ReactElement;
  activeClassName: string;
  href: string;
  as?: string;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({ children, activeClassName, href, as, ...props }) => {
  const pathname = usePathname();
  const child = Children.only(children);
  const childClassName = (child.props as Record<string, unknown>).className || '';

  // Apply active class if current path matches href or as prop
  const className =
    pathname === href || pathname === as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link href={href} {...props}>
      {cloneElement(child, {
        className: className || undefined,
      })}
    </Link>
  );
};

export default ActiveLink;
