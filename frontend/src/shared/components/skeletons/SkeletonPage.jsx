

export const SkeletonPage = () => {
    return (
        <div className="w-full h-[100vh] flex justify-center items-center gap-x-2 bg-white rounded-md shadow-md">
            <div className="w-6 h-6 rounded-full bg-blue-700 animate-bounce"></div>
            <div className="w-6 h-6 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-6 h-6 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
    );
}

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const SkeletonChart = () => {
  return (
    <div className="w-full h-[60vh] flex justify-center items-center bg-white rounded-md shadow-md">
      <DotLottieReact
        src="/looties/chart.json"
        loop
        autoplay
        style={{
          width: "80%",
          maxWidth: "500px",
          height: "auto",
        }}
      />
    </div>
  );
};

