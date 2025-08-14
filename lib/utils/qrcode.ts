import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateStyledQRCode(data: string, options?: {
  foreground?: string;
  background?: string;
  size?: number;
}): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: options?.size || 300,
      margin: 2,
      color: {
        dark: options?.foreground || '#3B82F6', // Brand blue
        light: options?.background || '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating styled QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
