import { IStyleCommon } from './style-common.model';
import { IStyleCustom } from './style-custom.model';

export interface IWigetCommon {
  id?: string;
  name?: string;
  style?: Partial<IStyleCommon>;
  customStyle?: Partial<IStyleCustom>;
}
