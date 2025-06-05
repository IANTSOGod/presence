"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";

export default function QrScanner() {
  const scannerId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Fonction de démarrage
  const startScanner = async () => {
    try {
      const qrRegion = document.getElementById(scannerId);

      // Nettoie l'ancien contenu HTML du div
      if (qrRegion) qrRegion.innerHTML = "";

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScannedCode(decodedText);
          await stopScanner();
        },
        (error) => {
          // Silence les erreurs
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Erreur startScanner:", err);
    }
  };

  // Fonction d'arrêt du scanner
  const stopScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error("Erreur lors de l'arrêt du scanner:", err);
      }
    }
  };

  // Nettoyage automatique à la destruction du composant
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 mt-6 border-2">
      <h2 className="text-2xl font-bold mt-10">Scanner QR Code</h2>
      <p className="text-gray-600">
        Scannez votre code QR étudiant pour enregistrer votre présence
      </p>

      <div
        id={scannerId}
        className="bg-gray-900 rounded-lg w-[600px] h-[300px] flex items-center justify-center text-white"
      >
        {!isScanning && (
          <p className="text-center">
            Prêt à scanner
            <br />
            <span className="text-sm text-gray-400">
              Cliquez pour activer la caméra
            </span>
          </p>
        )}
      </div>

      {!isScanning && (
        <Button
          onClick={startScanner}
          className="bg-blue-600 hover:bg-blue-700 w-[600px] text-white mb-10"
        >
          📸 Démarrer le scan
        </Button>
      )}

      {scannedCode && (
        <p className="text-green-600 mt-2">
          ✅ QR détecté : <strong>{scannedCode}</strong>
        </p>
      )}
    </div>
  );
}
