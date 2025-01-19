import React from 'react';

const Header = () => {
  return (
    <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
      <h1 className="tw-text-2xl tw-font-bold">Alex Rainbow Slime Co. - Panel de Administración</h1>
      <button
        className="tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 [&_svg]:tw-pointer-events-none [&_svg]:tw-size-4 [&_svg]:tw-shrink-0 hover:tw-bg-accent hover:tw-text-accent-foreground tw-px-4 tw-py-2 tw-relative tw-h-8 tw-w-8 tw-rounded-full"
        type="button"
      >
        <span className="tw-relative tw-flex tw-shrink-0 tw-overflow-hidden tw-rounded-full tw-h-8 tw-w-8">
          {/* <img className="tw-aspect-square tw-h-full tw-w-full" alt="@username" src="/placeholder.svg" /> */}
        </span>
      </button>
    </header>
  );
};

export default Header;

