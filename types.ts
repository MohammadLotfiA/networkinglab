export interface OSILayerData {
  id: number;
  name: string;
  pdu: string;
  description: string;
  protocols: string[];
  color: string;
  iconName: string;
}

export interface MacTableEntry {
  mac: string;
  port: number;
  vlan: number;
}

export interface Frame {
  srcMac: string;
  destMac: string;
  srcPort: number;
  vlan: number;
  data: string;
}

export interface RouterInterface {
  name: string;
  ip: string;
  mask: string;
  status: 'up' | 'down' | 'admin down';
}

export enum RouterMode {
  USER = 'USER',
  PRIVILEGED = 'PRIVILEGED',
  GLOBAL_CONFIG = 'GLOBAL_CONFIG',
  INTERFACE_CONFIG = 'INTERFACE_CONFIG',
}