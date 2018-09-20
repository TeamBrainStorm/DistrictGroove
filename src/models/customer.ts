import { Attribute } from "./attribute";

export interface Customer {
  className: string;
  id: string;
  attributes: Attribute;
  createdAt: string;
  updatedAt: string;
}
