import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  const phoneNumber = "+918157822165";
  const message = "Hello! I'm interested in ConnectNest and would like to know more.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 left-4 z-50 flex flex-col items-center gap-1 transition-transform hover:scale-105"
      aria-label="Contact us on WhatsApp for Feedback and Suggestions"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
        <MessageCircle className="h-7 w-7" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-foreground">Feedback</span>
        <span className="text-xs font-medium text-foreground">Suggestion</span>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
