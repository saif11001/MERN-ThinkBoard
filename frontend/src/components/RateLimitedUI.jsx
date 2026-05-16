import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div
        className="border rounded-lg shadow-md"
        style={{ backgroundColor: "#1F4959" + "1A", borderColor: "#1F4959" + "4D" }}
      >
        <div className="flex flex-col md:flex-row items-center p-6">

          <div
            className="flex-shrink-0 p-4 rounded-full mb-4 md:mb-0 md:mr-6"
            style={{ backgroundColor: "#f7fafb" + "33" }}
          >
            <ZapIcon style={{ color: "#ffffff", width: 40, height: 40 }} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2" style={{ color: "#ffffff" }}>
              Rate Limit Reached
            </h3>
            <p className="mb-1" style={{ color: "#ffffff" }}>
              You've made too many requests in a short period. Please wait a moment.
            </p>
            <p className="text-sm" style={{ color: "#ffffff" + "B3" }}>
              Try again in a few seconds for the best experience.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;