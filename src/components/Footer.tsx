import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <span className="font-bold">CN</span>
              </div>
              <span className="text-lg font-bold text-primary">ConnectNest</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building stronger local communities through trusted connections.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">For Providers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">List Your Service</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">For Customers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Browse Services</a></li>
              <li><a href="#" className="hover:text-primary">How It Works</a></li>
              <li><a href="#" className="hover:text-primary">Safety Tips</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:abdunazeer@yahoo.com" className="hover:text-primary">
                  abdunazeer@yahoo.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/918157822165" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  +91 815 782 2165
                </a>
              </li>
              <li className="text-xs">For inquiries & suggestions</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ConnectNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
