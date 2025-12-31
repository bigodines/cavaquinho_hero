import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { Children, ReactElement, cloneElement } from 'react';

interface ActiveLinkProps {
  children: ReactElement;
  activeClassName: string;
  href: string;
  as?: string;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({ children, activeClassName, href, as, ...props }) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = (child.props as Record<string, unknown>).className || '';

  // Apply active class if current path matches href or as prop
  const className =
    asPath === href || asPath === as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link href={href} as={as} {...props}>
      {cloneElement(child, {
        className: className || undefined,
      })}
    </Link>
  );
};

export default ActiveLink;
