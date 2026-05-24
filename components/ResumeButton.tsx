"use client";

interface ResumeButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ResumeButton({ className, children }: ResumeButtonProps) {
  const handleClick = async () => {
    try {
      const { viewUrl, downloadUrl } = await fetch("/api/resume", {
        method: "POST",
      }).then((r) => r.json());

      // Open the Drive viewer in a new tab
      window.open(viewUrl, "_blank", "noopener,noreferrer");

      // Trigger the download in a hidden iframe — stays on current page
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;";
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 10000);
    } catch {
      window.open("/api/resume", "_blank");
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
