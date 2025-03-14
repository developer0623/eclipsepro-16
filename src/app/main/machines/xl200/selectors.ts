import * as _ from 'lodash';
import { IMachine } from 'src/app/core/dto';
export const machineDetailsViewModel = (machine: IMachine) => {
  // No real reason for this except that since I created it
  // I'm keeping it in place. Probably will need it later.
  const newMachine = _.cloneDeep(machine);
  newMachine.eclipseEnforcedSetups.haltDelayMinimum.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.useScrapCodes.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.manualShearScrapLengthIn.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.enforceEclipseCoilValidation.available =
    machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.enforceBundlingRules.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.useCoilInventory.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.allowCoilOverride.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.autoRequestOrderFootage.available = machine.uartVersion >= 3.51;
  newMachine.eclipseEnforcedSetups.displayBundleIdPrompts.available = machine.uartVersion >= 3.53;
  newMachine.eclipseEnforcedSetups.autoDeleteDoneOrdersAfter.available =
    machine.uartVersion >= 3.53;
  newMachine.eclipseEnforcedSetups.showUserDataProgram.available = machine.uartVersion >= 3.59;
  newMachine.eclipseEnforcedSetups.showUserDataStatus.available = machine.uartVersion >= 3.59;
  newMachine.eclipseEnforcedSetups.staggerPanelField.available = machine.uartVersion >= 3.59;
  newMachine.eclipseEnforcedSetups.setDoneItemsToReady.available = machine.uartVersion >= 3.59;
  newMachine.eclipseEnforcedSetups.enableScrapCoilDuringUnload.available =
    machine.uartVersion >= 3.6;
  newMachine.eclipseEnforcedSetups.validate900Bundles.available = machine.uartVersion >= 3.6;
  newMachine.eclipseEnforcedSetups.showPreThreadUpScrapWindow.available =
    machine.uartVersion >= 3.6;

  return {
    ...newMachine,
  };
};
