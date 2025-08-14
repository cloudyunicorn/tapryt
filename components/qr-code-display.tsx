"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCodeIcon, 
  ShareIcon,
  PrinterIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import { DownloadIcon } from "lucide-react";

interface QRCodeDisplayProps {
  qrCodeData: string;
  cardUrl: string;
  cardTitle: string;
  isOwner?: boolean;
}

export function QRCodeDisplay({ qrCodeData, cardUrl, cardTitle, isOwner = false }: QRCodeDisplayProps) {
  const [showQR, setShowQR] = useState(false);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `${cardTitle}-qr-code.png`;
    link.href = qrCodeData;
    link.click();
  };

  const copyCardUrl = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cardTitle,
          text: `Check out my digital business card: ${cardTitle}`,
          url: cardUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyCardUrl();
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="w-5 h-5" />
          QR Code
          {isOwner && <Badge variant="secondary" className="text-xs">Owner</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showQR ? (
          <div className="text-center">
            <Button 
              onClick={() => setShowQR(true)}
              className="w-full bg-brand-gradient hover:opacity-90"
            >
              <QrCodeIcon className="w-5 h-5 mr-2" />
              Show QR Code
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Generate QR code for easy sharing
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR Code Display */}
            <div className="bg-white p-4 rounded-lg mx-auto w-fit border">
              <img 
                src={qrCodeData} 
                alt={`QR Code for ${cardTitle}`}
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* QR Code Info */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Scan to view business card</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                {cardUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadQRCode}
                className="text-xs"
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareCard}
                className="text-xs"
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyCardUrl}
                className="text-xs"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="text-xs"
              >
                <PrinterIcon className="w-4 h-4 mr-1" />
                Print
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowQR(false)}
              className="w-full text-xs"
            >
              Hide QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
