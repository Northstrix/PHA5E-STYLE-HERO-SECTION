// components/PurpleBackgroundSwitch.tsx

import React from "react";

interface PurpleBackgroundSwitchProps {
  purpleBackgroundEnabled: boolean;
  setPurpleBackgroundEnabled: (enabled: boolean) => void;
}

const PurpleBackgroundSwitch: React.FC<PurpleBackgroundSwitchProps> = ({
  purpleBackgroundEnabled,
  setPurpleBackgroundEnabled,
}) => {
  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-[#212121] rounded-lg">
      <div className="flex items-center">
        <span className="mr-2 text-white text-sm">Purple Background on Hover</span>
        <label className="relative inline-flex items-center cursor-pointer ring-4 w-11 h-6 rounded-full peer peer-focus:ring-4 ring-[#4246ce]">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={purpleBackgroundEnabled}
            onChange={() => setPurpleBackgroundEnabled(!purpleBackgroundEnabled)}
          />
          <div className={`
            w-11 h-6 rounded-full 
            peer peer-focus:ring-4 peer-focus:ring-[#4246ce]
            peer-checked:after:translate-x-full 
            after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
            ${purpleBackgroundEnabled ? 'bg-[#4246ce]' : 'bg-gray-900'}
          `}></div>
        </label>
      </div>
    </div>
  );
};

export default PurpleBackgroundSwitch;