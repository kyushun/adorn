import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { isAllImageViewEnabledAtom } from "states/atoms";

export const GalleryHeader = () => {
  const [isAllImageViewEnabled, setIsAllImageViewEnabled] = useAtom(
    isAllImageViewEnabledAtom
  );

  const onChangeAllImageViewEnabled = useCallback(() => {
    setIsAllImageViewEnabled((prev) => !prev);
  }, [setIsAllImageViewEnabled]);

  return (
    <div className="flex items-center justify-between py-8 px-6">
      <h1 className="text-xl font-bold">Adorn</h1>

      <div className="flex items-center">
        <label
          className="select-none pr-2 text-sm"
          onClick={onChangeAllImageViewEnabled}
        >
          すべての画像を表示
        </label>
        <Switch
          checked={isAllImageViewEnabled}
          onChange={onChangeAllImageViewEnabled}
          className={clsx(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out",
            isAllImageViewEnabled ? "bg-blue-600" : "bg-gray-200"
          )}
        >
          <span
            className={clsx(
              "inline-block h-4 w-4 rounded-full bg-white transition duration-200 ease-in-out",
              isAllImageViewEnabled ? "translate-x-6" : "translate-x-1"
            )}
          />
        </Switch>
      </div>
    </div>
  );
};
