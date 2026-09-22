import React from 'react';
import { Compass, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub">
            <Github size={18} />
          </a>
        </div>

        <div className="footer-brand">
          &copy; {new Date().getFullYear()} WonderDnd Private Limited &bull; Built for AWS Practice
        </div>

        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#aws-docs">AWS Architecture</a>
          <a href="#api">API Status</a>
        </div>
      </div>
    </footer>
  );
}
