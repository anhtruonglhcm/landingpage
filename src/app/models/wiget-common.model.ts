import { TypeElement } from '../constant/element.constant';
import { IStyleCommon } from './style-common.model';
import { IStyleCustom } from './style-custom.model';

export interface IWigetCommon {
  id?: number;
  elementType?: TypeElement;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  name?: string;
  style?: Partial<IStyleCommon>;
  customStyle?: Partial<IStyleCustom>;
}
