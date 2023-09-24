import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

export const socialLinks = {
  x: { name: 'X', icon: FaXTwitter },
  youtube: { name: 'Youtube', icon: FaYoutube },
  linkedIn: { name: 'LinkedIn', icon: FaLinkedin },
  instagram: { name: 'Instagram', icon: FaInstagram },
} as const;
