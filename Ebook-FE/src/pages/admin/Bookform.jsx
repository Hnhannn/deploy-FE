import { useContext, useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import FormOne from "../../components/Form/BookFormOne";
import FormTwo from "../../components/Form/BookFormTwo";
import FormThree from "../../components/Form/BookFormThree";
import { MultiStepContext } from "../../components/Form/StepContext";

const Bookform = () => {

  const { currentStep, finalData } = useContext(MultiStepContext);
  const showStep = (step) => {
    switch (step) {
      case 1:
        return <FormOne />;
      case 2:
        return <FormTwo />;
      default:
        return <FormThree />;
    }
  };

  return (
    <div className="w-[80%] mr-7 mx-auto p-6 bg-gray-800 shadow-md mt-6">
      <div className="flex flex-col items-center w-full">
        <div className="stepper flex justify-center items-center w-full mb-9">
          <Stepper activeStep={currentStep - 1} className="w-3/4">
            <Step>
              <StepLabel></StepLabel>
            </Step>
            <Step>
              <StepLabel></StepLabel>
            </Step>
            <Step>
              <StepLabel></StepLabel>
            </Step>
          </Stepper>
        </div>
      </div>
      {/* Form */}
      <div className="content">{showStep(currentStep)}</div>
    </div>
  );
};

export default Bookform;
