import React from 'react';
import {
    SiAcademia,
    SiMedium,
    SiMendeley,
    SiOrcid,
    SiLinkedin,
    SiPinterest,
    SiFacebook,
    SiYoutube,
    SiGithub,
    SiInstagram,
} from 'react-icons/si';
import { FaResearchgate, FaTumblrSquare, FaQuora, FaGooglePlus } from 'react-icons/fa';
import { HiMiniPhone } from 'react-icons/hi2';
import { IoIosLink } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';
import { RiTwitterXFill } from 'react-icons/ri';
import { LuArrowRight } from 'react-icons/lu';
import { PiArrowUpRight } from 'react-icons/pi';

const map = {
    academia: SiAcademia,
    medium: SiMedium,
    mendeley: SiMendeley,
    orcid: SiOrcid,
    linkedin: SiLinkedin,
    pinterest: SiPinterest,
    facebook: SiFacebook,
    youtube: SiYoutube,
    github: SiGithub,
    instagram: SiInstagram,
    researchgate: FaResearchgate,
    tumblr: FaTumblrSquare,
    quora: FaQuora,
    googleplus: FaGooglePlus,
    phone: HiMiniPhone,
    link: IoIosLink,
    email: AiOutlineMail,
    x: RiTwitterXFill,
    arrow_right_up: PiArrowUpRight,
    arrow_right: LuArrowRight,
};

export default function Icon({ icon, className = '' }) {
    const IconComponent = map[icon.toLowerCase()] || null;

    if (!IconComponent) {
        console.warn(`Icon not found for: ${icon}`);
        return <IoIosLink className={className} />;
    }

    return <IconComponent className={className} />;
}
