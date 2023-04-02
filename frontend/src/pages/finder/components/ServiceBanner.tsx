import React from "react";

import Balancer from "react-wrap-balancer";

type ServiceBannerProps = {
  open?: boolean;
};

const ServiceBanner: React.FC<ServiceBannerProps> = ({ open }) => {
  const [isOpen, setIsOpen] = React.useState(open);

  return (
    <div className="relative flex w-full items-center justify-center bg-white p-8">
      <div className="flex w-full max-w-4xl flex-row items-center justify-between">
        <div className="flex  flex-row gap-5">
          <div style={{ width: 80, height: 80, background: "#bbb" }}>
            <img src="https://via.placeholder.com/80x80" alt="placeholder" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0">
              <h4 className="m-0 text-xl font-black">
                Searching for a Kitaplatz?
              </h4>
              <h4 className="m-0 text-xl font-black">
                We'll find one for you.
              </h4>
            </div>
            <p className="font-semibold">
              <Balancer>
                Our PlatzFinder service can take the stress off of you. Get
                started for free —{" "}
                <strong className="font-extrabold">
                  Sie bezahlen nur bei Erfolg.
                </strong>
              </Balancer>
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white">
            Learn more
          </button>
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white">
            Get started
          </button>
        </div>
      </div>
      <div id="closing-x-icon" className="absolute right-16 top-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

export default ServiceBanner;
