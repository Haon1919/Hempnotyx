declare module 'react-qr-scanner' {
  import { Component, RefObject } from 'react';

  export interface QrReaderProps {
    delay?: number;
    onError: (error: Error) => void;
    onScan: (data: { text: string } | null) => void;
    style?: React.CSSProperties;
    constraints?: MediaTrackConstraints | any;
  }

  export default class QrReader extends Component<QrReaderProps> {}
} 