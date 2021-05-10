import { TypeElement } from '../constant/element.constant';

export interface ISection {
  id?: number;
  idSection: string;
  height?: number;
  element?: TypeElement[];
}

export interface ISectionSubject {
  id: string;
  height: number;
}

export interface ISectitonSelectedId {
  id: string;
}
