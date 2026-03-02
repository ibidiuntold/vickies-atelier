export interface ImageItem {
  src: string;
  alt: string;
}

export type Collection = 'bespoke' | 'bridal' | 'rtw';

export interface OrderPayload {
  collection: Collection;
  bust: string;
  waist: string;
  hips: string;
  height: string;
  shoulder: string;
  sleeve: string;
  inseam: string;
  notes: string;
  name: string;
  email: string;
}

export interface OrderEmailData extends OrderPayload {
  readyDate: string;
  adminEmail: string;
  estimatedReadyDate?: string;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  message: string;
}

export interface ConfigMap {
  bespoke_days: string;
  bridal_days: string;
  rtw_days: string;
  admin_email: string;
  [key: string]: string;
}
