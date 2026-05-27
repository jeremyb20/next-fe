import { useRef, useState } from 'react';
import { Step, STATUS, Controls, LIFECYCLE, EventData } from 'react-joyride';

import WalktourProgressBar from './walktour-progress-bar';

// ----------------------------------------------------------------------

type ReturnType = {
  run: boolean;
  steps: Step[];
  onCallback: (data: EventData) => void;
  setHelpers: (controls: Controls) => void;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UseWalktourProps = {
  defaultRun?: boolean;
  showProgress?: boolean;
  steps: Step[];
};

export function useWalktour(props: UseWalktourProps): ReturnType {
  const helpers = useRef<Controls | undefined>(undefined);

  const [run, setRun] = useState(!!props?.defaultRun);

  const [currentIndex, setCurrentIndex] = useState(0);

  const setHelpers = (controls: Controls) => {
    helpers.current = controls;
  };

  const onCallback = (data: EventData) => {
    const { status, index, lifecycle } = data;

    if (lifecycle === LIFECYCLE.TOOLTIP) {
      setCurrentIndex(index + 1);
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      setCurrentIndex(0);
    }
  };

  const steps = props.steps.map((step) => ({
    ...step,
    content: (
      <>
        {step.content}
        {props.showProgress && (
          <WalktourProgressBar
            currentStep={currentIndex}
            totalSteps={props.steps.length}
            onGoStep={(index: number) => helpers.current?.go(index)}
          />
        )}
      </>
    ),
  }));

  return {
    steps,
    run,
    setRun,
    onCallback,
    setHelpers,
  };
}
